import type {
  BundledDictionary,
  CharInfo,
  CustomDictionaryMeta,
  DictEntry,
  LangCode,
  LookupResult,
  PerLanguageOptions,
  WordRecord,
} from './types';
import { analyzeJapaneseParts, analyzeKoreanParts, normalizeWord } from './segmenter';
import { buildEnglishGlossIndex } from './diglot';
import { getExtensionUrl } from './webext';

export interface LoadedLangIndex {
  lang: LangCode;
  entries: DictEntry[];
  byHeadword: Map<string, DictEntry[]>;
  byForm: Map<string, DictEntry[]>;
  byAltScript: Map<string, DictEntry[]>;
  byEnglishGloss: Map<string, DictEntry[]>;
  byRank: DictEntry[];
  lexiconSet: Set<string>;
  chars: Record<string, CharInfo>;
}

const indexCache = new Map<LangCode, LoadedLangIndex>();

export function buildLangIndex(dict: BundledDictionary): LoadedLangIndex {
  const byHeadword = new Map<string, DictEntry[]>();
  const byForm = new Map<string, DictEntry[]>();
  const byAltScript = new Map<string, DictEntry[]>();
  const lexiconSet = new Set<string>();

  const addMap = (map: Map<string, DictEntry[]>, key: string, entry: DictEntry) => {
    if (!key) return;
    const arr = map.get(key);
    if (arr) {
      if (!arr.includes(entry)) arr.push(entry);
    } else {
      map.set(key, [entry]);
    }
  };

  for (const entry of dict.entries) {
    const normW = normalizeWord(entry.w, dict.lang);
    lexiconSet.add(entry.w);
    lexiconSet.add(normW);
    addMap(byHeadword, entry.w, entry);
    addMap(byHeadword, normW, entry);
    addMap(byHeadword, entry.w.toLowerCase(), entry);

    if (entry.alt && entry.alt !== entry.w) {
      lexiconSet.add(entry.alt);
      addMap(byAltScript, entry.alt, entry);
      addMap(byAltScript, entry.w, entry);
    }

    if (entry.forms) {
      for (const f of entry.forms) {
        const nf = normalizeWord(f, dict.lang);
        lexiconSet.add(f);
        lexiconSet.add(nf);
        addMap(byForm, f, entry);
        addMap(byForm, nf, entry);
        addMap(byForm, f.toLowerCase(), entry);
      }
    }
  }

  const byRank = [...dict.entries].sort((a, b) => (a.rank ?? 999999) - (b.rank ?? 999999));
  const byEnglishGloss = buildEnglishGlossIndex(dict.entries);

  const loaded: LoadedLangIndex = {
    lang: dict.lang,
    entries: dict.entries,
    byHeadword,
    byForm,
    byAltScript,
    byEnglishGloss,
    byRank,
    lexiconSet,
    chars: dict.chars || {},
  };
  indexCache.set(dict.lang, loaded);
  return loaded;
}

export async function loadBundledDictionary(lang: LangCode, customFetcher?: (lang: LangCode) => Promise<BundledDictionary>): Promise<LoadedLangIndex> {
  const cached = indexCache.get(lang);
  if (cached) return cached;

  let data: BundledDictionary;
  if (customFetcher) {
    data = await customFetcher(lang);
  } else {
    const url = getExtensionUrl(`dictionaries/${lang}.json`);
    const resp = await fetch(url);
    data = (await resp.json()) as BundledDictionary;
  }
  return buildLangIndex(data);
}

export function getCachedIndex(lang: LangCode): LoadedLangIndex | undefined {
  return indexCache.get(lang);
}

/**
 * Resolves the canonical tracking key for a surface word:
 *  - If user saved a lemmaOverride ("Could also be"), use that.
 *  - If countingMode === 'surface' ("Every form separately"), track each surface form separately.
 *  - If countingMode === 'lemma' ("As one word"), resolve inflected forms to their dictionary headword/lemma!
 */
export function resolveTrackingKey(
  surface: string,
  lang: LangCode,
  idx: LoadedLangIndex,
  countingMode: 'lemma' | 'surface',
  lemmaHint?: string,
  lemmaOverrides?: Map<string, string>
): { key: string; lemma: string; primaryEntry?: DictEntry } {
  const norm = normalizeWord(surface, lang);
  const override = lemmaOverrides?.get(norm) || lemmaOverrides?.get(surface);
  if (override) {
    const ovEntries = idx.byHeadword.get(override) || idx.byHeadword.get(override.toLowerCase());
    return {
      key: countingMode === 'surface' ? norm : override,
      lemma: override,
      primaryEntry: ovEntries?.[0],
    };
  }

  if (lemmaHint) {
    const hintEntries = idx.byHeadword.get(lemmaHint) || idx.byHeadword.get(lemmaHint.toLowerCase());
    if (hintEntries?.length) {
      return {
        key: countingMode === 'surface' ? norm : hintEntries[0].w,
        lemma: hintEntries[0].w,
        primaryEntry: hintEntries[0],
      };
    }
  }

  // Direct headword match
  const direct = idx.byHeadword.get(surface) || idx.byHeadword.get(norm) || idx.byHeadword.get(surface.toLowerCase());
  const altMatch = idx.byAltScript.get(surface);
  const formMatch = idx.byForm.get(surface) || idx.byForm.get(norm) || idx.byForm.get(surface.toLowerCase());

  if (direct?.length) {
    return {
      key: countingMode === 'surface' ? norm : direct[0].w,
      lemma: direct[0].w,
      primaryEntry: direct[0],
    };
  }
  if (altMatch?.length) {
    return {
      key: surface,
      lemma: surface,
      primaryEntry: altMatch[0],
    };
  }
  if (formMatch?.length) {
    return {
      key: countingMode === 'surface' ? norm : formMatch[0].w,
      lemma: formMatch[0].w,
      primaryEntry: formMatch[0],
    };
  }

  // Korean / Japanese morphological fallback
  if (lang === 'ko') {
    const ko = analyzeKoreanParts(surface, idx.lexiconSet);
    if (ko) {
      const stemEntries = idx.byHeadword.get(ko.stem);
      return {
        key: countingMode === 'surface' ? norm : ko.stem,
        lemma: ko.stem,
        primaryEntry: stemEntries?.[0],
      };
    }
  }
  if (lang === 'ja') {
    const ja = analyzeJapaneseParts(surface, idx.lexiconSet);
    if (ja) {
      const stemEntries = idx.byHeadword.get(ja.lemma);
      return {
        key: countingMode === 'surface' ? norm : ja.lemma,
        lemma: ja.lemma,
        primaryEntry: stemEntries?.[0],
      };
    }
  }

  return { key: norm || surface, lemma: norm || surface };
}

/**
 * Full Verba word lookup with:
 *  - Bundled + Custom Yomitan/CSV dictionary entries
 *  - "Could also be" alternate lemma suggestions (e.g. French "porte" -> "porter", Italian "porta" -> "portare")
 *  - "Parts of …" morphological breakdown for Japanese & Korean
 *  - "Characters" tab radical decomposition & character-by-character gloss for CJK compounds
 *  - Cross-script green status detection for Chinese & Cantonese
 */
export function lookupWordDetailed(
  query: string,
  lang: LangCode,
  idx: LoadedLangIndex,
  options: PerLanguageOptions,
  wordRecords: Map<string, WordRecord>,
  customDicts: CustomDictionaryMeta[] = [],
  contextSentence?: string,
  lemmaHint?: string
): LookupResult {
  const norm = normalizeWord(query, lang);
  const overrides = new Map<string, string>();
  for (const rec of wordRecords.values()) {
    if (rec.lemmaOverride) overrides.set(rec.word, rec.lemmaOverride);
  }

  const resolved = resolveTrackingKey(query, lang, idx, options.countingMode, lemmaHint, overrides);

  // Collect all candidate bundled entries
  const bundledSet = new Set<DictEntry>();
  for (const list of [
    idx.byHeadword.get(resolved.lemma),
    idx.byHeadword.get(query),
    idx.byHeadword.get(norm),
    idx.byHeadword.get(query.toLowerCase()),
    idx.byAltScript.get(query),
    idx.byForm.get(query),
    idx.byForm.get(norm),
    idx.byForm.get(query.toLowerCase()),
  ]) {
    if (list) for (const e of list) bundledSet.add(e);
  }
  const bundledEntries = Array.from(bundledSet);

  // Collect custom dictionary matches
  const customEntries: DictEntry[] = [];
  for (const cd of customDicts.filter((d) => d.enabled && d.lang === lang).sort((a, b) => a.order - b.order)) {
    for (const ce of cd.entries) {
      if (ce.w === query || ce.w === resolved.lemma || ce.w.toLowerCase() === norm.toLowerCase()) {
        customEntries.push({ ...ce, dictName: cd.name });
      }
    }
  }

  let finalEntries: DictEntry[] = [];
  if (customEntries.length > 0) {
    if (options.customDictPlacement === 'replace') finalEntries = customEntries;
    else if (options.customDictPlacement === 'above') finalEntries = [...customEntries, ...bundledEntries];
    else finalEntries = [...bundledEntries, ...customEntries];
  } else {
    finalEntries = bundledEntries;
  }

  // Contextual meaning ranking ("Put the meaning that fits the sentence first")
  if (contextSentence && finalEntries.length > 0) {
    finalEntries = finalEntries.map((entry) => {
      if (entry.m.length <= 1) return entry;
      const lowerSent = contextSentence.toLowerCase();
      const sortedM = [...entry.m].sort((a, b) => {
        const scoreA = a.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && lowerSent.includes(w)).length;
        const scoreB = b.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && lowerSent.includes(w)).length;
        return scoreB - scoreA;
      });
      return { ...entry, m: sortedM };
    });
  }

  // "Could also be" alternate lemmas (e.g. porte -> porter, porta -> portare, 물을 -> 물 + 을)
  const couldAlsoBe: { lemma: string; gloss: string }[] = [];
  for (const e of bundledEntries) {
    if (e.w !== resolved.lemma) {
      couldAlsoBe.push({ lemma: e.w, gloss: e.m[0] || '' });
    }
  }

  // Morphological "Parts of …" for Korean & Japanese
  let partsOf: { part: string; role: string }[] | undefined;
  if (lang === 'ko') {
    const ko = analyzeKoreanParts(query, idx.lexiconSet);
    if (ko) {
      partsOf = ko.parts;
      if (ko.stem !== resolved.lemma && !couldAlsoBe.some((c) => c.lemma === ko.stem)) {
        const se = idx.byHeadword.get(ko.stem)?.[0];
        couldAlsoBe.push({ lemma: ko.stem, gloss: se?.m[0] || `${ko.stem} + ${ko.parts[1]?.part || ''}` });
      }
    }
  } else if (lang === 'ja') {
    const ja = analyzeJapaneseParts(query, idx.lexiconSet);
    if (ja) partsOf = ja.parts;
  }

  // CJK Characters tab & character-by-character compound gloss
  let characters: LookupResult['characters'];
  let charByCharGloss: LookupResult['charByCharGloss'];
  if (lang === 'zh' || lang === 'yue' || lang === 'ja') {
    const hanChars = Array.from(query).filter((c) => /[\u4e00-\u9fff]/.test(c));
    if (hanChars.length > 0) {
      characters = hanChars.map((ch) => {
        const info = idx.chars[ch];
        const singleEntry = idx.byHeadword.get(ch)?.[0] || idx.byAltScript.get(ch)?.[0];
        return {
          char: ch,
          reading: info?.r || singleEntry?.r || '',
          meaning: info?.m || singleEntry?.m?.[0] || 'CJK character',
          components: info?.comp || [[ch, 'character']],
        };
      });
      if (hanChars.length >= 2) {
        charByCharGloss = characters.map((c) => ({
          char: c.char,
          reading: c.reading,
          meaning: c.meaning,
        }));
      }
    }
  }

  // Check vocabulary record & cross-script Known status (green highlight in Chinese/Cantonese)
  const record = wordRecords.get(resolved.key) || wordRecords.get(query) || null;
  let crossScriptKnown = false;
  if ((lang === 'zh' || lang === 'yue') && options.unifyScripts && (!record || record.status === 0)) {
    const primary = finalEntries[0];
    if (primary) {
      const otherScript = primary.w === query ? primary.alt : primary.w;
      if (otherScript && otherScript !== query) {
        const otherRec = wordRecords.get(otherScript);
        if (otherRec && otherRec.status === 5) {
          crossScriptKnown = true;
        }
      }
    }
  }

  const rank = finalEntries.find((e) => e.rank)?.rank;

  return {
    query,
    normalized: norm,
    lemma: resolved.lemma,
    entries: finalEntries,
    couldAlsoBe,
    partsOf,
    characters,
    charByCharGloss,
    record,
    crossScriptKnown,
    rank,
  };
}

export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n.toLocaleString('en-US') + (s[(v - 20) % 10] || s[v] || s[0]);
}
