import type { LangCode, VerbaSettings, WordRecord } from './types';
import { getLangOptionsFromSettings } from './db';
import { LANG_MAP } from './languages';

export async function ankiInvoke<T = unknown>(
  action: string,
  params: Record<string, unknown> = {},
  port = 8765
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3500);
  try {
    const res = await fetch(`http://127.0.0.1:${port}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, version: 6, params }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`AnkiConnect returned HTTP ${res.status}`);
    const json = (await res.json()) as { result: T; error: string | null };
    if (json.error) throw new Error(json.error);
    return json.result;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function testAnkiConnection(
  port = 8765
): Promise<{ ok: boolean; version?: number; decks?: string[]; models?: string[]; error?: string }> {
  try {
    const version = await ankiInvoke<number>('version', {}, port);
    const decks = await ankiInvoke<string[]>('deckNames', {}, port);
    const models = await ankiInvoke<string[]>('modelNames', {}, port);
    return { ok: true, version, decks, models };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'AnkiConnect not reachable. Make sure Anki is open with add-on 2055492159.',
    };
  }
}

const VERBA_FIELDS = [
  'Word',
  'Reading',
  'PitchAccent',
  'Meaning',
  'Sentence',
  'SentenceTranslation',
  'Picture',
  'WordAudio',
  'SentenceAudio',
];

function buildTemplatesFromLayout(layout: VerbaSettings['ankiCardLayout']): { Front: string; Back: string } {
  const mapping: [keyof VerbaSettings['ankiCardLayout'], string][] = [
    ['word', '<div class="verba-word">{{Word}}</div>'],
    ['reading', '{{#Reading}}<div class="verba-reading">{{Reading}}</div>{{/Reading}}'],
    ['pitch', '{{#PitchAccent}}<div class="verba-pitch">{{PitchAccent}}</div>{{/PitchAccent}}'],
    ['meaning', '{{#Meaning}}<div class="verba-meaning">{{Meaning}}</div>{{/Meaning}}'],
    ['sentence', '{{#Sentence}}<div class="verba-sentence">{{Sentence}}</div>{{/Sentence}}'],
    [
      'sentenceTranslation',
      '{{#SentenceTranslation}}<div class="verba-trans">{{SentenceTranslation}}</div>{{/SentenceTranslation}}',
    ],
    ['picture', '{{#Picture}}<div class="verba-pic">{{Picture}}</div>{{/Picture}}'],
    ['wordAudio', '{{WordAudio}}'],
    ['sentenceAudio', '{{SentenceAudio}}'],
  ];

  const frontParts = mapping.filter(([k]) => layout[k] === 'front').map(([, tpl]) => tpl);
  const backParts = mapping.filter(([k]) => layout[k] === 'back').map(([, tpl]) => tpl);

  return {
    Front: frontParts.join('\n') || '<div class="verba-word">{{Word}}</div>',
    Back: `{{FrontSide}}<hr id="answer">\n` + backParts.join('\n'),
  };
}

export async function ensureVerbaModelAndDeck(deckName: string, settings: VerbaSettings): Promise<void> {
  const port = settings.ankiConnectPort;
  await ankiInvoke('createDeck', { deck: deckName }, port);
  const models = await ankiInvoke<string[]>('modelNames', {}, port);
  const tpl = buildTemplatesFromLayout(settings.ankiCardLayout);
  if (!models.includes('Verba')) {
    await ankiInvoke(
      'createModel',
      {
        modelName: 'Verba',
        inOrderFields: VERBA_FIELDS,
        css: `.card { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 20px; text-align: center; color: #f1f5f9; background-color: #0f172a; padding: 24px; }
.verba-word { font-size: 34px; font-weight: 600; margin-bottom: 8px; }
.verba-reading { color: #94a3b8; font-size: 18px; margin-bottom: 10px; }
.verba-meaning { font-size: 20px; margin: 12px 0; }
.verba-sentence { font-size: 18px; color: #cbd5e1; margin-top: 14px; }
.verba-trans { font-size: 15px; color: #64748b; margin-top: 6px; }`,
        cardTemplates: [{ Name: 'Verba Card', Front: tpl.Front, Back: tpl.Back }],
      },
      port
    );
  } else {
    await ankiInvoke(
      'updateModelTemplates',
      {
        model: {
          name: 'Verba',
          templates: { 'Verba Card': { Front: tpl.Front, Back: tpl.Back } },
        },
      },
      port
    );
  }
}

export interface AddAnkiCardPayload {
  lang: LangCode;
  word: string;
  reading?: string;
  pitch?: string;
  meanings: string[];
  sentence?: string;
  sentenceTranslation?: string;
  pictureDataUrl?: string;
  pickedByHand: boolean;
}

export async function sendWordToAnki(
  payload: AddAnkiCardPayload,
  existingRecord: WordRecord | undefined,
  settings: VerbaSettings
): Promise<{ noteId: number; deck: string; action: 'created' | 'moved' | 'updated' | 'browsed' }> {
  const port = settings.ankiConnectPort;
  const langOpts = getLangOptionsFromSettings(settings, payload.lang);
  const langName = LANG_MAP[payload.lang]?.name || payload.lang;
  const autoDeck = langOpts.ankiAutoDeck || `Verba::${langName}`;
  const pickedDeck = langOpts.ankiPickedDeck || autoDeck;
  const targetDeck = payload.pickedByHand ? pickedDeck : autoDeck;

  await ensureVerbaModelAndDeck(targetDeck, settings);

  let formattedSentence = payload.sentence || '';
  if (formattedSentence && payload.word) {
    const escaped = payload.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    formattedSentence = formattedSentence.replace(new RegExp(escaped, 'gi'), (m) => `<b>${m}</b>`);
  }

  const layout = settings.ankiCardLayout;
  const fields: Record<string, string> = {
    Word: payload.word,
    Reading: layout.reading !== 'off' ? payload.reading || '' : '',
    PitchAccent: layout.pitch !== 'off' ? payload.pitch || '' : '',
    Meaning: layout.meaning !== 'off' ? payload.meanings.join('<br>') : '',
    Sentence: layout.sentence !== 'off' ? formattedSentence : '',
    SentenceTranslation: layout.sentenceTranslation !== 'off' ? payload.sentenceTranslation || '' : '',
    Picture: '',
    WordAudio: '',
    SentenceAudio: '',
  };

  if (existingRecord?.ankiNoteId) {
    const notesInfo = await ankiInvoke<{ noteId: number; cards: number[] }[]>(
      'notesInfo',
      { notes: [existingRecord.ankiNoteId] },
      port
    );
    if (notesInfo?.[0]?.noteId) {
      if (existingRecord.ankiSuspendedByVerba && notesInfo[0].cards?.length) {
        await ankiInvoke('unsuspend', { cards: notesInfo[0].cards }, port);
      }
      if (payload.pickedByHand && existingRecord.ankiDeck !== pickedDeck && notesInfo[0].cards?.length) {
        await ankiInvoke('changeDeck', { cards: notesInfo[0].cards, deck: pickedDeck }, port);
        return { noteId: existingRecord.ankiNoteId, deck: pickedDeck, action: 'moved' };
      }
      await ankiInvoke('updateNoteFields', { note: { id: existingRecord.ankiNoteId, fields } }, port);
      return { noteId: existingRecord.ankiNoteId, deck: targetDeck, action: 'updated' };
    }
  }

  const tags = [...settings.ankiTags.split(/\s+/).filter(Boolean), `verba::${payload.lang}`];

  const noteId = await ankiInvoke<number>(
    'addNote',
    {
      note: {
        deckName: targetDeck,
        modelName: langOpts.ankiNoteType || 'Verba',
        fields,
        options: { allowDuplicate: false, duplicateScope: 'deck' },
        tags,
      },
    },
    port
  );

  return { noteId, deck: targetDeck, action: 'created' };
}

export async function syncWithAnki(words: WordRecord[], settings: VerbaSettings): Promise<WordRecord[]> {
  const port = settings.ankiConnectPort;
  const changed: WordRecord[] = [];
  const withNotes = words.filter((w) => w.ankiNoteId);
  if (withNotes.length === 0) return changed;

  const notesInfo = await ankiInvoke<{ noteId: number; cards: number[] }[]>(
    'notesInfo',
    { notes: withNotes.map((w) => w.ankiNoteId!) },
    port
  );

  const allCardIds = notesInfo.flatMap((n) => n.cards || []);
  const cardsInfo = allCardIds.length
    ? await ankiInvoke<{ cardId: number; note: number; interval: number; queue: number }[]>(
        'cardsInfo',
        { cards: allCardIds },
        port
      )
    : [];

  const cardsByNote = new Map<number, typeof cardsInfo>();
  for (const c of cardsInfo) {
    const arr = cardsByNote.get(c.note) || [];
    arr.push(c);
    cardsByNote.set(c.note, arr);
  }

  for (const w of withNotes) {
    const cards = cardsByNote.get(w.ankiNoteId!) || [];
    if (cards.length === 0) continue;

    if (settings.ankiSuspendWhenKnown && (w.status === 5 || w.status === -1) && !w.ankiSuspendedByVerba) {
      const activeIds = cards.filter((c) => c.queue !== -1).map((c) => c.cardId);
      if (activeIds.length > 0) {
        await ankiInvoke('suspend', { cards: activeIds }, port);
        const next = { ...w, ankiSuspendedByVerba: true, updatedAt: Date.now() };
        changed.push(next);
        continue;
      }
    }

    if (w.status >= 1 && w.status <= 4 && w.ankiSuspendedByVerba) {
      await ankiInvoke('unsuspend', { cards: cards.map((c) => c.cardId) }, port);
      const next = { ...w, ankiSuspendedByVerba: false, updatedAt: Date.now() };
      changed.push(next);
      continue;
    }

    if (settings.ankiMarkKnownOnMature && w.status >= 1 && w.status <= 4) {
      const maxInterval = Math.max(...cards.map((c) => c.interval || 0));
      if (maxInterval >= settings.ankiMatureDays) {
        const next: WordRecord = { ...w, status: 5, updatedAt: Date.now() };
        changed.push(next);
      }
    }
  }

  return changed;
}
