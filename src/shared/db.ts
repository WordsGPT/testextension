import type {
  BookBookmark,
  BookItem,
  CustomDictionaryMeta,
  DailyStatRecord,
  LangCode,
  ListeningTrackLog,
  PerLanguageOptions,
  PlacementAssessment,
  ShelfFolder,
  StudyNote,
  VerbaSettings,
  VideoHistoryItem,
  WordRecord,
} from './types';
import { createDefaultSettings } from './constants';
import { getDefaultLangOptions } from './languages';
import { getExtApi, storageLocalGet, storageLocalSet } from './webext';

const DB_NAME = 'verba_db_v1';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function openVerbaDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('words')) {
        const ws = db.createObjectStore('words', { keyPath: 'id' });
        ws.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('books')) {
        const bs = db.createObjectStore('books', { keyPath: 'id' });
        bs.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('bookFiles')) {
        db.createObjectStore('bookFiles', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('folders')) {
        const fsStore = db.createObjectStore('folders', { keyPath: 'id' });
        fsStore.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('bookmarks')) {
        const bms = db.createObjectStore('bookmarks', { keyPath: 'id' });
        bms.createIndex('by_book', 'bookId', { unique: false });
      }
      if (!db.objectStoreNames.contains('videos')) {
        const vs = db.createObjectStore('videos', { keyPath: 'id' });
        vs.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('dailyStats')) {
        const ds = db.createObjectStore('dailyStats', { keyPath: 'id' });
        ds.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('listeningHistory')) {
        const ls = db.createObjectStore('listeningHistory', { keyPath: 'id' });
        ls.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('customDicts')) {
        const cs = db.createObjectStore('customDicts', { keyPath: 'id' });
        cs.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('assessments')) {
        const asStore = db.createObjectStore('assessments', { keyPath: 'id' });
        asStore.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('notes')) {
        const ns = db.createObjectStore('notes', { keyPath: 'id' });
        ns.createIndex('by_lang', 'lang', { unique: false });
      }
      if (!db.objectStoreNames.contains('readArticles')) {
        db.createObjectStore('readArticles', { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function txGet<T>(storeName: string, key: string): Promise<T | undefined> {
  return openVerbaDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).get(key);
        req.onsuccess = () => resolve(req.result as T | undefined);
        req.onerror = () => reject(req.error);
      })
  );
}

function txPut<T>(storeName: string, value: T): Promise<void> {
  return openVerbaDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(value);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function txPutBatch<T>(storeName: string, values: T[]): Promise<void> {
  if (values.length === 0) return Promise.resolve();
  return openVerbaDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        for (const v of values) store.put(v);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function txDelete(storeName: string, key: string): Promise<void> {
  return openVerbaDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function txGetAll<T>(storeName: string, indexName?: string, query?: IDBValidKey): Promise<T[]> {
  return openVerbaDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const target = indexName ? store.index(indexName) : store;
        const req = query !== undefined ? target.getAll(query) : target.getAll();
        req.onsuccess = () => resolve((req.result as T[]) || []);
        req.onerror = () => reject(req.error);
      })
  );
}

const SETTINGS_KEY = 'verba_prefs_v1';

export async function getSettings(): Promise<VerbaSettings> {
  const defaults = createDefaultSettings();
  const ext = getExtApi();
  if (ext?.storage?.local) {
    const res = await storageLocalGet(SETTINGS_KEY);
    const saved = res[SETTINGS_KEY] as Partial<VerbaSettings> | undefined;
    if (!saved) {
      await storageLocalSet({ [SETTINGS_KEY]: defaults });
      return defaults;
    }
    return mergeSettingsWithDefaults(defaults, saved);
  }
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(SETTINGS_KEY) : null;
  if (!raw) return defaults;
  return mergeSettingsWithDefaults(defaults, JSON.parse(raw));
}

function mergeSettingsWithDefaults(defaults: VerbaSettings, saved: Partial<VerbaSettings>): VerbaSettings {
  return {
    ...defaults,
    ...saved,
    colors: { ...defaults.colors, ...(saved.colors || {}) },
    wordPanel: { ...defaults.wordPanel, ...(saved.wordPanel || {}) },
    readingKeymap: { ...defaults.readingKeymap, ...(saved.readingKeymap || {}) },
    videoKeymap: { ...defaults.videoKeymap, ...(saved.videoKeymap || {}) },
    ankiCardLayout: { ...defaults.ankiCardLayout, ...(saved.ankiCardLayout || {}) },
    perLang: { ...defaults.perLang, ...(saved.perLang || {}) },
  };
}

export async function saveSettings(patch: Partial<VerbaSettings>): Promise<VerbaSettings> {
  const current = await getSettings();
  const next: VerbaSettings = mergeSettingsWithDefaults(current, {
    ...patch,
    updatedAt: Date.now(),
  });
  const ext = getExtApi();
  if (ext?.storage?.local) {
    await storageLocalSet({ [SETTINGS_KEY]: next });
  } else if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }
  return next;
}

export function getLangOptionsFromSettings(settings: VerbaSettings, lang: LangCode): PerLanguageOptions {
  return {
    ...getDefaultLangOptions(lang),
    ...(settings.perLang[lang] || {}),
  };
}

// Vocabulary Operations
export async function getWordsByLang(lang: LangCode): Promise<WordRecord[]> {
  const all = await txGetAll<WordRecord>('words', 'by_lang', lang);
  return all.filter((w) => !w.deleted);
}

export async function getAllWordsRaw(): Promise<WordRecord[]> {
  return txGetAll<WordRecord>('words');
}

export async function getWordRecord(lang: LangCode, word: string): Promise<WordRecord | undefined> {
  const rec = await txGet<WordRecord>('words', `${lang}:${word}`);
  return rec && !rec.deleted ? rec : undefined;
}

export async function putWordRecord(record: WordRecord): Promise<void> {
  await txPut('words', record);
}

export async function putWordRecordsBatch(records: WordRecord[]): Promise<void> {
  await txPutBatch('words', records);
}

// Daily Statistics Helpers
export function getLogicalDateString(timestampMs: number, dayEndsAtHour = 0): string {
  const adjusted = new Date(timestampMs - dayEndsAtHour * 3600 * 1000);
  const y = adjusted.getFullYear();
  const m = String(adjusted.getMonth() + 1).padStart(2, '0');
  const d = String(adjusted.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function incrementDailyStat(
  lang: LangCode,
  deviceId: string,
  dayEndsAtHour: number,
  delta: Partial<
    Pick<
      DailyStatRecord,
      'wordsRead' | 'secondsListened' | 'wordsMarkedKnown' | 'wordsMarkedLearning' | 'frequentMarkedKnown'
    >
  >
): Promise<DailyStatRecord> {
  const date = getLogicalDateString(Date.now(), dayEndsAtHour);
  const id = `${lang}:${date}:${deviceId}`;
  const existing = (await txGet<DailyStatRecord>('dailyStats', id)) || {
    id,
    lang,
    date,
    deviceId,
    wordsRead: 0,
    secondsListened: 0,
    wordsMarkedKnown: 0,
    wordsMarkedLearning: 0,
    frequentMarkedKnown: 0,
    updatedAt: Date.now(),
  };

  const updated: DailyStatRecord = {
    ...existing,
    wordsRead: Math.max(0, existing.wordsRead + (delta.wordsRead || 0)),
    secondsListened: Math.max(0, existing.secondsListened + (delta.secondsListened || 0)),
    wordsMarkedKnown: Math.max(0, existing.wordsMarkedKnown + (delta.wordsMarkedKnown || 0)),
    wordsMarkedLearning: Math.max(0, existing.wordsMarkedLearning + (delta.wordsMarkedLearning || 0)),
    frequentMarkedKnown: Math.max(0, existing.frequentMarkedKnown + (delta.frequentMarkedKnown || 0)),
    updatedAt: Date.now(),
  };
  await txPut('dailyStats', updated);
  return updated;
}

export async function getDailyStatsByLang(lang: LangCode): Promise<DailyStatRecord[]> {
  return txGetAll<DailyStatRecord>('dailyStats', 'by_lang', lang);
}

export async function getAllDailyStats(): Promise<DailyStatRecord[]> {
  return txGetAll<DailyStatRecord>('dailyStats');
}

export async function putDailyStatsBatch(records: DailyStatRecord[]): Promise<void> {
  await txPutBatch('dailyStats', records);
}

export async function checkAndRecordArticleParagraphRead(key: string): Promise<boolean> {
  const existing = await txGet<{ id: string; at: number }>('readArticles', key);
  if (existing) return false;
  await txPut('readArticles', { id: key, at: Date.now() });
  return true;
}

// Books, Folders & Bookmarks
export async function getBooksByLang(lang: LangCode): Promise<BookItem[]> {
  const all = await txGetAll<BookItem>('books', 'by_lang', lang);
  return all.filter((b) => !b.deleted).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getAllBooksRaw(): Promise<BookItem[]> {
  return txGetAll<BookItem>('books');
}

export async function getBookById(id: string): Promise<BookItem | undefined> {
  const b = await txGet<BookItem>('books', id);
  return b && !b.deleted ? b : undefined;
}

export async function putBook(book: BookItem, rawBytes?: Uint8Array): Promise<void> {
  await txPut('books', book);
  if (rawBytes) {
    await txPut('bookFiles', { id: book.id, bytes: rawBytes, updatedAt: Date.now() });
  }
}

export async function getBookRawBytes(id: string): Promise<Uint8Array | undefined> {
  const rec = await txGet<{ id: string; bytes: Uint8Array }>('bookFiles', id);
  return rec?.bytes;
}

export async function getFoldersByLang(lang: LangCode): Promise<ShelfFolder[]> {
  const all = await txGetAll<ShelfFolder>('folders', 'by_lang', lang);
  return all.filter((f) => !f.deleted).sort((a, b) => a.name.localeCompare(b.name));
}

export async function putFolder(folder: ShelfFolder): Promise<void> {
  await txPut('folders', folder);
}

export async function getBookmarksByBook(bookId: string): Promise<BookBookmark[]> {
  const all = await txGetAll<BookBookmark>('bookmarks', 'by_book', bookId);
  return all
    .filter((bm) => !bm.deleted)
    .sort((a, b) => a.chapterIndex - b.chapterIndex || a.scrollRatio - b.scrollRatio);
}

export async function getAllBookmarksRaw(): Promise<BookBookmark[]> {
  return txGetAll<BookBookmark>('bookmarks');
}

export async function putBookmark(bm: BookBookmark): Promise<void> {
  await txPut('bookmarks', bm);
}

// Video History
export async function getVideosByLang(lang: LangCode): Promise<VideoHistoryItem[]> {
  const all = await txGetAll<VideoHistoryItem>('videos', 'by_lang', lang);
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getVideoById(id: string): Promise<VideoHistoryItem | undefined> {
  return txGet<VideoHistoryItem>('videos', id);
}

export async function putVideoHistory(v: VideoHistoryItem): Promise<void> {
  await txPut('videos', v);
}

// Listening History
export async function getListeningHistoryByLang(lang: LangCode): Promise<ListeningTrackLog[]> {
  const all = await txGetAll<ListeningTrackLog>('listeningHistory', 'by_lang', lang);
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getAllListeningHistory(): Promise<ListeningTrackLog[]> {
  return txGetAll<ListeningTrackLog>('listeningHistory');
}

export async function putListeningLog(log: ListeningTrackLog): Promise<void> {
  await txPut('listeningHistory', log);
}

// Custom Dictionaries
export async function getCustomDictsByLang(lang: LangCode): Promise<CustomDictionaryMeta[]> {
  const all = await txGetAll<CustomDictionaryMeta>('customDicts', 'by_lang', lang);
  return all.sort((a, b) => a.order - b.order);
}

export async function putCustomDict(cd: CustomDictionaryMeta): Promise<void> {
  await txPut('customDicts', cd);
}

export async function deleteCustomDict(id: string): Promise<void> {
  await txDelete('customDicts', id);
}

// Placement Assessments
export async function getAssessmentsByLang(lang: LangCode): Promise<PlacementAssessment[]> {
  const all = await txGetAll<PlacementAssessment>('assessments', 'by_lang', lang);
  return all.sort((a, b) => b.completedAt - a.completedAt);
}

export async function getAllAssessments(): Promise<PlacementAssessment[]> {
  const all = await txGetAll<PlacementAssessment>('assessments');
  return all.sort((a, b) => b.completedAt - a.completedAt);
}

export async function putAssessment(assessment: PlacementAssessment): Promise<void> {
  await txPut('assessments', assessment);
}

// Personal Study Notes & Milestones
export async function getNotesByLang(lang?: LangCode): Promise<StudyNote[]> {
  const all = lang
    ? await txGetAll<StudyNote>('notes', 'by_lang', lang)
    : await txGetAll<StudyNote>('notes');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function putStudyNote(note: StudyNote): Promise<void> {
  await txPut('notes', note);
}

export async function deleteStudyNote(id: string): Promise<void> {
  await txDelete('notes', id);
}

// Reset all progress for a single language
export async function deleteLanguageProgress(lang: LangCode): Promise<void> {
  const db = await openVerbaDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(['words', 'dailyStats', 'listeningHistory', 'assessments'], 'readwrite');
    for (const storeName of ['words', 'dailyStats', 'listeningHistory', 'assessments'] as const) {
      const store = tx.objectStore(storeName);
      const idx = store.index('by_lang');
      const req = idx.openKeyCursor(IDBKeyRange.only(lang));
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
