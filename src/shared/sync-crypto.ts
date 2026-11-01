import type {
  BookBookmark,
  BookItem,
  DailyStatRecord,
  ListeningTrackLog,
  ShelfFolder,
  VerbaSettings,
  WordRecord,
} from './types';

export interface EncryptedKeyPayload {
  salt: string;
  iv: string;
  ciphertext: string;
}

export interface VerbaBackupBundle {
  verbaArchiveVersion: 1;
  exportedAt: number;
  deviceId: string;
  isAutomaticBackup: boolean;
  words: WordRecord[];
  books: BookItem[];
  folders: ShelfFolder[];
  bookmarks: BookBookmark[];
  dailyStats: DailyStatRecord[];
  listeningHistory: ListeningTrackLog[];
  settings?: Partial<VerbaSettings>;
  encryptedKeys?: EncryptedKeyPayload;
}

function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBuf(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', bytes as BufferSource);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts AI & Cloud Voice API keys with a user passphrase (at least 8 chars) for automatic backups.
 * Plain Exports never include API keys unless encrypted.
 */
export async function encryptApiKeysWithPassphrase(
  keys: { aiApiKey: string; cloudVoiceApiKey: string },
  passphrase: string
): Promise<EncryptedKeyPayload> {
  if (passphrase.length < 8) {
    throw new Error('Passphrase must be at least 8 characters.');
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await deriveAesKey(passphrase, salt);
  const encoded = new TextEncoder().encode(JSON.stringify(keys));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, aesKey, encoded);
  return {
    salt: bufToBase64(salt),
    iv: bufToBase64(iv),
    ciphertext: bufToBase64(ciphertext),
  };
}

export async function decryptApiKeysWithPassphrase(
  payload: EncryptedKeyPayload,
  passphrase: string
): Promise<{ aiApiKey: string; cloudVoiceApiKey: string }> {
  const salt = base64ToBuf(payload.salt);
  const iv = base64ToBuf(payload.iv);
  const cipher = base64ToBuf(payload.ciphertext);
  const aesKey = await deriveAesKey(passphrase, salt);
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, aesKey, cipher as BufferSource);
  return JSON.parse(new TextDecoder().decode(plainBuf));
}

export function validatePairingCode(code: string): { valid: boolean; reason?: string } {
  const clean = code.trim();
  if (clean.length < 8 || clean.length > 32) {
    return { valid: false, reason: 'Code must be 8 to 32 letters and digits.' };
  }
  if (!/^[A-Za-z0-9]+$/.test(clean)) {
    return { valid: false, reason: 'Only letters and digits are allowed.' };
  }
  if (!/[A-Za-z]/.test(clean) || !/[0-9]/.test(clean)) {
    return { valid: false, reason: 'Code must include both letters and digits.' };
  }
  const upper = clean.toUpperCase();
  if (upper === '12345678' || upper === 'PASSWORD' || upper === 'PASSWORD1') {
    return { valid: false, reason: 'Common codes like 12345678 and PASSWORD are turned down.' };
  }
  return { valid: true };
}

/**
 * CRDT conflict-free merge rules:
 *  - Words and levels: Newest edit wins; a tie keeps the higher level. Deleted words stay deleted on both.
 *  - Daily statistics: Kept per device (`lang:date:deviceId`), added up for display. Never doubled!
 *    If same deviceId (`Restore as this device`), take max per counter.
 *  - Books: Your place is newest-wins (so turning back to an earlier chapter intentionally survives).
 *  - Listening history: Per track, keeping the longer total.
 *  - Bookmarks: Added together; one removed (`deleted: true`) on either side is removed on both.
 */
export function mergeWordRecords(local: WordRecord[], incoming: WordRecord[]): WordRecord[] {
  const map = new Map<string, WordRecord>();
  for (const w of local) map.set(w.id, w);
  for (const inc of incoming) {
    const cur = map.get(inc.id);
    if (!cur) {
      map.set(inc.id, inc);
      continue;
    }
    if (inc.deleted || cur.deleted) {
      const newer = inc.updatedAt >= cur.updatedAt ? inc : cur;
      if (newer.deleted) {
        map.set(inc.id, { ...newer, deleted: true });
        continue;
      }
    }
    if (inc.updatedAt > cur.updatedAt) {
      map.set(inc.id, { ...cur, ...inc, lookupCount: Math.max(cur.lookupCount, inc.lookupCount) });
    } else if (inc.updatedAt === cur.updatedAt) {
      const winner = inc.status >= cur.status ? inc : cur;
      map.set(inc.id, { ...winner, lookupCount: Math.max(cur.lookupCount, inc.lookupCount) });
    }
  }
  return Array.from(map.values());
}

export function mergeBookItems(local: BookItem[], incoming: BookItem[]): BookItem[] {
  const map = new Map<string, BookItem>();
  for (const b of local) map.set(b.id, b);
  for (const inc of incoming) {
    const cur = map.get(inc.id);
    if (!cur) {
      map.set(inc.id, inc);
      continue;
    }
    // Newest-wins for place, deletion, rename, and folder
    if (inc.updatedAt >= cur.updatedAt) {
      map.set(inc.id, {
        ...cur,
        ...inc,
        chapters: inc.chapters?.length ? inc.chapters : cur.chapters,
      });
    }
  }
  return Array.from(map.values());
}

export function mergeBookmarks(local: BookBookmark[], incoming: BookBookmark[]): BookBookmark[] {
  const map = new Map<string, BookBookmark>();
  for (const bm of local) map.set(bm.id, bm);
  for (const inc of incoming) {
    const cur = map.get(inc.id);
    if (!cur) {
      map.set(inc.id, inc);
      continue;
    }
    // One removed on either side is removed on both
    if (cur.deleted || inc.deleted) {
      map.set(inc.id, { ...(inc.createdAt >= cur.createdAt ? inc : cur), deleted: true });
    }
  }
  return Array.from(map.values());
}

export function mergeDailyStats(
  local: DailyStatRecord[],
  incoming: DailyStatRecord[],
  mode: 'restore_same_device' | 'sync_other_device',
  currentDeviceId: string
): DailyStatRecord[] {
  const map = new Map<string, DailyStatRecord>();
  for (const s of local) map.set(s.id, s);
  for (const inc of incoming) {
    const rewritten: DailyStatRecord =
      mode === 'restore_same_device'
        ? {
            ...inc,
            deviceId: currentDeviceId,
            id: `${inc.lang}:${inc.date}:${currentDeviceId}`,
          }
        : inc;

    const cur = map.get(rewritten.id);
    if (!cur) {
      map.set(rewritten.id, rewritten);
    } else {
      map.set(rewritten.id, {
        ...cur,
        wordsRead: Math.max(cur.wordsRead, rewritten.wordsRead),
        secondsListened: Math.max(cur.secondsListened, rewritten.secondsListened),
        wordsMarkedKnown: Math.max(cur.wordsMarkedKnown, rewritten.wordsMarkedKnown),
        wordsMarkedLearning: Math.max(cur.wordsMarkedLearning, rewritten.wordsMarkedLearning),
        frequentMarkedKnown: Math.max(cur.frequentMarkedKnown, rewritten.frequentMarkedKnown),
        updatedAt: Math.max(cur.updatedAt, rewritten.updatedAt),
      });
    }
  }
  return Array.from(map.values());
}

export function mergeListeningLogs(local: ListeningTrackLog[], incoming: ListeningTrackLog[]): ListeningTrackLog[] {
  const map = new Map<string, ListeningTrackLog>();
  for (const l of local) map.set(l.id, l);
  for (const inc of incoming) {
    const cur = map.get(inc.id);
    if (!cur) {
      map.set(inc.id, inc);
    } else {
      // Keep the longer total
      map.set(inc.id, {
        ...(inc.updatedAt >= cur.updatedAt ? inc : cur),
        secondsEarned: Math.max(cur.secondsEarned, inc.secondsEarned),
      });
    }
  }
  return Array.from(map.values());
}
