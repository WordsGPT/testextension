import { unzipSync, strFromU8 } from 'fflate';
import type { DictEntry, LangCode, SubtitleCue, WordRecord, WordStatus } from './types';
import { normalizeWord } from './segmenter';

export function parseCsvRows(text: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(cur.trim());
      cur = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cur.trim());
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur.trim());
    if (row.some((c) => c.length > 0)) rows.push(row);
  }
  return rows;
}

/**
 * 1. Import from LingQ CSV export (files everything in CSV as Known, keeping custom meanings).
 */
export function parseLingQImport(csvText: string, lang: LangCode): WordRecord[] {
  const rows = parseCsvRows(csvText, ',');
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.toLowerCase());
  const termIdx = Math.max(0, header.findIndex((h) => h.includes('term') || h.includes('word') || h.includes('expression')));
  const meaningIdx = header.findIndex((h) => h.includes('hint') || h.includes('meaning') || h.includes('translation') || h.includes('definition'));
  const startRow = header.some((h) => h.includes('term') || h.includes('word')) ? 1 : 0;

  const now = Date.now();
  const out: WordRecord[] = [];
  for (let i = startRow; i < rows.length; i++) {
    const rawWord = rows[i][termIdx]?.trim();
    if (!rawWord) continue;
    const word = normalizeWord(rawWord, lang);
    const meaning = meaningIdx >= 0 ? rows[i][meaningIdx]?.trim() : undefined;
    out.push({
      id: `${lang}:${word}`,
      lang,
      word,
      status: 5, // Known
      isPhrase: /\s/.test(word) && lang !== 'vi',
      isCustomSegment: false,
      ...(meaning ? { customMeaning: meaning } : {}),
      lookupCount: 0,
      source: 'import',
      createdAt: now,
      updatedAt: now,
    });
  }
  return out;
}

/**
 * 2. Import from Language Reactor (JSON preserves levels; CSV asks whether learning or known).
 */
export function parseLanguageReactorImport(
  content: string,
  lang: LangCode,
  format: 'json' | 'csv',
  csvDefaultStatus: WordStatus = 5
): WordRecord[] {
  const now = Date.now();
  const out: WordRecord[] = [];
  if (format === 'json') {
    const parsed = JSON.parse(content);
    const list = Array.isArray(parsed) ? parsed : parsed.words || parsed.items || [];
    for (const item of list) {
      const rawWord = String(item.word?.text || item.word || item.term || item.lemma || '').trim();
      if (!rawWord) continue;
      const word = normalizeWord(rawWord, lang);
      const rawStage = String(item.learningStage || item.status || item.stage || '').toLowerCase();
      const status: WordStatus =
        rawStage.includes('known') || item.status === 'KNOWN' || item.level >= 4
          ? 5
          : 1;
      const meaning = Array.isArray(item.translations) ? item.translations.join('; ') : item.translation || item.meaning || '';
      out.push({
        id: `${lang}:${word}`,
        lang,
        word,
        status,
        isPhrase: /\s/.test(word) && lang !== 'vi',
        isCustomSegment: false,
        ...(meaning ? { customMeaning: String(meaning) } : {}),
        lookupCount: 0,
        source: 'import',
        createdAt: now,
        updatedAt: now,
      });
    }
    return out;
  }

  const rows = parseCsvRows(content, content.includes('\t') ? '\t' : ',');
  for (const r of rows) {
    const rawWord = r[0]?.trim();
    if (!rawWord || rawWord.toLowerCase() === 'word') continue;
    const word = normalizeWord(rawWord, lang);
    const meaning = r[1]?.trim();
    out.push({
      id: `${lang}:${word}`,
      lang,
      word,
      status: csvDefaultStatus,
      isPhrase: /\s/.test(word) && lang !== 'vi',
      isCustomSegment: false,
      ...(meaning ? { customMeaning: meaning } : {}),
      lookupCount: 0,
      source: 'import',
      createdAt: now,
      updatedAt: now,
    });
  }
  return out;
}

/**
 * 3. Import from HanziHero CSV into Chinese:
 *    Novice -> 1, Apprentice -> 2, Journeyman I -> 3, Journeyman II -> 4, Expert / Master / Skipped -> Known (5)
 */
export function parseHanziHeroImport(csvText: string): WordRecord[] {
  const rows = parseCsvRows(csvText, ',');
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.toLowerCase());
  const wordIdx = Math.max(0, header.findIndex((h) => h.includes('character') || h.includes('vocab') || h.includes('word') || h.includes('hanzi')));
  const stageIdx = header.findIndex((h) => h.includes('stage') || h.includes('srs') || h.includes('level') || h.includes('status'));
  const meaningIdx = header.findIndex((h) => h.includes('meaning') || h.includes('gloss'));
  const startRow = header.some((h) => h.includes('stage') || h.includes('vocab') || h.includes('hanzi')) ? 1 : 0;

  const now = Date.now();
  const out: WordRecord[] = [];
  for (let i = startRow; i < rows.length; i++) {
    const word = rows[i][wordIdx]?.trim();
    if (!word) continue;
    const stage = (stageIdx >= 0 ? rows[i][stageIdx] : '').toLowerCase();
    let status: WordStatus = 5;
    if (stage.includes('novice')) status = 1;
    else if (stage.includes('apprentice')) status = 2;
    else if (stage.includes('journeyman ii') || stage.includes('journeyman 2')) status = 4;
    else if (stage.includes('journeyman')) status = 3;
    else if (stage.includes('expert') || stage.includes('master') || stage.includes('skip')) status = 5;

    const meaning = meaningIdx >= 0 ? rows[i][meaningIdx]?.trim() : undefined;
    out.push({
      id: `zh:${word}`,
      lang: 'zh',
      word,
      status,
      isPhrase: false,
      isCustomSegment: word.length >= 2,
      ...(meaning ? { customMeaning: meaning } : {}),
      lookupCount: 0,
      source: 'import',
      createdAt: now,
      updatedAt: now,
    });
  }
  return out;
}

/**
 * 4. Import from plain text / Anki Notes in Plain Text (.txt / .tsv):
 *    One word/phrase per line or comma-separated; meaning after a tab is kept as customMeaning!
 */
export function parsePlainTextWordImport(
  text: string,
  lang: LangCode,
  targetStatus: 5 | -1 = 5
): WordRecord[] {
  const now = Date.now();
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const out: WordRecord[] = [];
  for (const line of lines) {
    if (line.includes('\t')) {
      const [rawWord, rawMeaning] = line.split('\t');
      const cleanWord = normalizeWord(rawWord.replace(/<[^>]+>/g, '').trim(), lang);
      if (!cleanWord) continue;
      const cleanMeaning = rawMeaning?.replace(/<[^>]+>/g, '').trim();
      out.push({
        id: `${lang}:${cleanWord}`,
        lang,
        word: cleanWord,
        status: targetStatus,
        isPhrase: /\s/.test(cleanWord) && lang !== 'vi',
        isCustomSegment: false,
        ...(cleanMeaning ? { customMeaning: cleanMeaning } : {}),
        lookupCount: 0,
        source: 'import',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      const items = line.split(',').map((s) => s.trim()).filter(Boolean);
      for (const raw of items) {
        const word = normalizeWord(raw, lang);
        if (!word) continue;
        out.push({
          id: `${lang}:${word}`,
          lang,
          word,
          status: targetStatus,
          isPhrase: /\s/.test(word) && lang !== 'vi',
          isCustomSegment: false,
          lookupCount: 0,
          source: 'import',
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }
  return out;
}

/**
 * 5. Parse Yomitan (.zip) or CSV/TSV custom dictionary!
 */
export function parseYomitanZip(zipBytes: Uint8Array): { title: string; entries: DictEntry[] } {
  const files = unzipSync(zipBytes);
  let title = 'Custom Yomitan Dictionary';
  if (files['index.json']) {
    try {
      const idx = JSON.parse(strFromU8(files['index.json']));
      if (idx.title) title = String(idx.title);
    } catch {
      // ignore
    }
  }
  const entries: DictEntry[] = [];
  for (const [name, data] of Object.entries(files)) {
    if (/term_bank_\d+\.json$/i.test(name)) {
      try {
        const rows = JSON.parse(strFromU8(data)) as unknown[][];
        for (const row of rows) {
          const w = String(row[0] || '').trim();
          const r = String(row[1] || '').trim();
          const pos = String(row[2] || '').trim();
          const rawGlosses = row[5];
          const meanings: string[] = [];
          if (Array.isArray(rawGlosses)) {
            for (const g of rawGlosses) {
              if (typeof g === 'string') meanings.push(g);
              else if (g && typeof g === 'object' && 'glossary' in g && Array.isArray((g as { glossary: unknown[] }).glossary)) {
                meanings.push(...(g as { glossary: unknown[] }).glossary.map(String));
              }
            }
          }
          if (w && meanings.length > 0) {
            entries.push({ w, ...(r ? { r } : {}), ...(pos ? { pos } : {}), m: meanings });
          }
        }
      } catch {
        // skip malformed bank
      }
    }
  }
  return { title, entries };
}

export function parseTableDictionary(text: string): DictEntry[] {
  const delim = text.includes('\t') ? '\t' : ',';
  const rows = parseCsvRows(text, delim);
  const out: DictEntry[] = [];
  for (const r of rows) {
    const w = r[0]?.trim();
    const m = r[1]?.trim();
    const reading = r[2]?.trim();
    if (w && m && w.toLowerCase() !== 'word') {
      out.push({ w, ...(reading ? { r: reading } : {}), m: [m] });
    }
  }
  return out;
}

/**
 * 6. Parse SRT, VTT, and ASS subtitle files (used in both Verba video player and Books shelf!).
 */
function parseTimestampSec(ts: string): number {
  const clean = ts.trim().replace(',', '.');
  const parts = clean.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(clean) || 0;
}

export function parseSubtitleFile(raw: string, extHint = 'srt'): SubtitleCue[] {
  const text = raw.replace(/^\uFEFF/, '');
  if (extHint.toLowerCase().endsWith('ass') || text.includes('[Events]')) {
    const cues: SubtitleCue[] = [];
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith('Dialogue:')) {
        const parts = l.slice(9).split(',');
        if (parts.length >= 10) {
          const start = parseTimestampSec(parts[1]);
          const end = parseTimestampSec(parts[2]);
          const body = parts
            .slice(9)
            .join(',')
            .replace(/\{[^}]*\}/g, '')
            .replace(/\\N/gi, ' ')
            .trim();
          if (body) cues.push({ id: `ass_${cues.length}`, start, end, text: body });
        }
      }
    }
    return cues;
  }

  // SRT & WebVTT
  const blocks = text.replace(/^WEBVTT[^\n]*\n+/i, '').split(/\r?\n\r?\n+/);
  const cues: SubtitleCue[] = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const timeLineIdx = lines.findIndex((l) => l.includes('-->'));
    if (timeLineIdx === -1) continue;
    const [startStr, endPart] = lines[timeLineIdx].split('-->');
    const endStr = endPart.trim().split(/\s+/)[0];
    const body = lines
      .slice(timeLineIdx + 1)
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .trim();
    if (!body) continue;
    cues.push({
      id: `cue_${cues.length}`,
      start: parseTimestampSec(startStr),
      end: parseTimestampSec(endStr),
      text: body,
    });
  }
  return cues;
}
