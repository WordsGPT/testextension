import type { DictEntry, DiglotVocabPool, LangCode, VerbaSettings, WordRecord, WordStatus } from './types';
import type { LoadedLangIndex } from './dictionary';

const FUNCTION_POS = new Set(['art.', 'prep.', 'conj.', 'part.', 'pron.', 'prop.']);

const AMBIGUOUS_ENGLISH_GLOSSES = new Set([
  'the', 'a', 'an', 'to', 'of', 'in', 'into', 'on', 'upon', 'at', 'by', 'for', 'with', 'from', 'about',
  'and', 'or', 'but', 'not', 'no', 'yes', 'that', 'this', 'these', 'those', 'which', 'who', 'what',
  'be', 'is', 'am', 'are', 'was', 'were', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'make', 'go', 'come', 'get', 'take', 'put', 'give',
  'say', 'tell', 'see', 'know', 'can', 'will', 'would', 'should', 'may', 'might',
  'all', 'whole', 'other', 'another', 'else', 'same', 'self', 'very', 'much', 'lot', 'more', 'most',
  'some', 'any', 'one', 'two', 'still', 'yet', 'again', 'well', 'then',
  'way', 'manner', 'part', 'case', 'point', 'state', 'fact', 'thing',
]);

export interface DiglotMatch {
  lemma: string;
  isPlural: boolean;
  isCapitalized: boolean;
  candidates: DictEntry[];
}

export interface DiglotSegmentToken {
  isReplaced: boolean;
  text: string;
  originalText?: string;
  targetSurface?: string;
  targetWord?: string;
  targetLemma?: string;
  entry?: DictEntry;
  status?: WordStatus;
}

function posPriority(pos?: string): number {
  if (!pos) return 3;
  if (pos.startsWith('n')) return 1;
  if (pos.startsWith('adj')) return 2;
  if (pos.startsWith('adv')) return 3;
  if (pos.startsWith('v')) return 4;
  return 5;
}

/**
 * Builds a reverse lookup index from lowercase English gloss words to target-language DictEntries.
 * Grounded in Trusty & Truong (CHI 2011) and Arakawa et al. (VocabEncounter, CHI 2022):
 * focuses on content words (nouns, adjectives, adverbs, and concrete lexical verbs) so the
 * L1 grammatical scaffolding remains intact and readable.
 */
export function buildEnglishGlossIndex(entries: DictEntry[]): Map<string, DictEntry[]> {
  const byGloss = new Map<string, DictEntry[]>();

  for (const entry of entries) {
    if (!entry.w || !entry.m || entry.m.length === 0) continue;
    if (entry.special === 'name' || entry.special === 'place') continue;
    if (entry.pos && FUNCTION_POS.has(entry.pos)) continue;
    if (/vocabulary item #\d+/i.test(entry.m[0] || '')) continue;

    for (const rawM of entry.m) {
      const stripped = rawM.replace(/\([^)]*\)/g, ' ');
      const parts = stripped.split(/[;,/]/);
      for (const part of parts) {
        let cleaned = part.trim().toLowerCase();
        if (cleaned.startsWith('to ') && entry.pos?.startsWith('v')) {
          cleaned = cleaned.slice(3).trim();
        } else if (cleaned.startsWith('the ')) {
          cleaned = cleaned.slice(4).trim();
        } else if (cleaned.startsWith('a ') || cleaned.startsWith('an ')) {
          cleaned = cleaned.replace(/^an?\s+/, '').trim();
        }

        if (!/^[a-z]{3,24}$/.test(cleaned)) continue;
        if (AMBIGUOUS_ENGLISH_GLOSSES.has(cleaned)) continue;
        if (entry.pos?.startsWith('v') && cleaned.length < 4) continue;

        const list = byGloss.get(cleaned);
        if (list) {
          if (!list.includes(entry)) list.push(entry);
        } else {
          byGloss.set(cleaned, [entry]);
        }
      }
    }
  }

  for (const [gloss, list] of byGloss.entries()) {
    list.sort((a, b) => {
      const posDiff = posPriority(a.pos) - posPriority(b.pos);
      if (posDiff !== 0) return posDiff;
      return (a.rank ?? 999999) - (b.rank ?? 999999);
    });
    byGloss.set(gloss, list);
  }

  return byGloss;
}

/**
 * Matches an English surface word (including plurals and capitalized forms) to target-language dictionary entries.
 */
export function matchEnglishTokenToTarget(
  rawToken: string,
  dictIndex: LoadedLangIndex
): DiglotMatch | null {
  if (!rawToken || rawToken.length < 3 || !/^[A-Za-z]+$/.test(rawToken)) return null;

  // Skip all-caps acronyms (e.g., NASA, HTML, USA)
  if (rawToken.length >= 2 && rawToken === rawToken.toUpperCase()) return null;

  const lower = rawToken.toLowerCase();
  if (AMBIGUOUS_ENGLISH_GLOSSES.has(lower)) return null;

  const isCapitalized = rawToken[0] === rawToken[0].toUpperCase() && rawToken[0] !== rawToken[0].toLowerCase();

  const direct = dictIndex.byEnglishGloss.get(lower);
  if (direct && direct.length > 0) {
    return {
      lemma: lower,
      isPlural: false,
      isCapitalized,
      candidates: direct,
    };
  }

  // Try English plural deinflection for nouns (e.g., stories -> story, books -> book, houses -> house)
  if (lower.length >= 4 && lower.endsWith('s') && !lower.endsWith('ss') && !lower.endsWith('us') && !lower.endsWith('is')) {
    const singularCandidates: string[] = [];
    if (lower.endsWith('ies') && lower.length >= 5) {
      singularCandidates.push(lower.slice(0, -3) + 'y');
    }
    if (lower.endsWith('es') && lower.length >= 5) {
      singularCandidates.push(lower.slice(0, -2));
      singularCandidates.push(lower.slice(0, -1));
    }
    singularCandidates.push(lower.slice(0, -1));

    for (const sing of singularCandidates) {
      if (AMBIGUOUS_ENGLISH_GLOSSES.has(sing)) continue;
      const entries = dictIndex.byEnglishGloss.get(sing);
      if (entries && entries.length > 0) {
        const nounEntries = entries.filter((e) => !e.pos || e.pos.startsWith('n'));
        if (nounEntries.length > 0) {
          return {
            lemma: sing,
            isPlural: true,
            isCapitalized,
            candidates: nounEntries,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Selects the best target-language DictEntry for inline replacement based on the learner's vocabulary status,
 * active pool setting ('learning_and_new' | 'learning_only' | 'all_vocab'), and frequency rank ceiling.
 */
export function selectBestDiglotEntry(
  candidates: DictEntry[],
  wordMap: Map<string, WordRecord>,
  settings: {
    inlineReplacementPool?: DiglotVocabPool;
    inlineReplacementMaxRank?: number;
  }
): { entry: DictEntry; status: WordStatus } | null {
  const pool: DiglotVocabPool = settings.inlineReplacementPool || 'learning_and_new';
  const maxRank = settings.inlineReplacementMaxRank || 3000;

  const eligible: { entry: DictEntry; status: WordStatus; score: number }[] = [];

  for (const entry of candidates) {
    const rec = wordMap.get(entry.w);
    const status: WordStatus = rec && !rec.deleted ? rec.status : 0;

    // Never weave Ignored words
    if (status === -1) continue;

    if (pool === 'learning_only' && !(status >= 1 && status <= 4)) continue;
    if (pool === 'learning_and_new' && status === 5) continue;

    // Respect frequency frontier for New (status 0) words so beginners aren't hit with rare C2 words
    if (status === 0 && maxRank > 0 && entry.rank && entry.rank > maxRank) {
      continue;
    }

    // Prioritize words actively in Learning (1..4) for retrieval practice, then concrete nouns, then frequency rank
    const learningBoost = status >= 1 && status <= 4 ? 10000 : 0;
    const nounBoost = entry.pos?.startsWith('n') ? 1000 : entry.pos?.startsWith('adj') ? 500 : 0;
    const rankScore = Math.max(0, 2000 - (entry.rank ?? 1000));
    eligible.push({
      entry,
      status,
      score: learningBoost + nounBoost + rankScore,
    });
  }

  if (eligible.length === 0) return null;
  eligible.sort((a, b) => b.score - a.score);
  return { entry: eligible[0].entry, status: eligible[0].status };
}

/**
 * Formats the target-language surface word to match pluralization (when unambiguous) and sentence capitalization.
 */
export function formatDiglotTargetSurface(
  entry: DictEntry,
  lang: LangCode,
  isPlural: boolean,
  isCapitalized: boolean
): string {
  let surface = entry.w;
  if (isPlural && entry.pos?.startsWith('n') && entry.forms && entry.forms.length === 1) {
    surface = entry.forms[0];
  }

  if (isCapitalized && lang !== 'de' && /^[a-zà-žа-яіїєґα-ω]/.test(surface)) {
    surface = surface[0].toUpperCase() + surface.slice(1);
  }
  return surface;
}

/**
 * Tokenizes an L1 text node and weaves target-language (L2) words inline according to
 * density (`inlineReplacementDensityPct`) and minimum word spacing constraints.
 */
export function weaveDiglotSegment(
  text: string,
  lang: LangCode,
  dictIndex: LoadedLangIndex,
  wordMap: Map<string, WordRecord>,
  settings: Pick<
    VerbaSettings,
    'inlineReplacementDensityPct' | 'inlineReplacementPool' | 'inlineReplacementMaxRank'
  >,
  pageWovenCounts?: Map<string, number>
): DiglotSegmentToken[] {
  // Don't weave if target language is English and text is already English
  if (lang === 'en') {
    return [{ isReplaced: false, text }];
  }

  const rawParts = text.split(/([A-Za-z]+(?:'[A-Za-z]+)?)/g);
  const tokens: DiglotSegmentToken[] = [];

  interface CandidateSlot {
    tokenIdx: number;
    wordIdx: number;
    rawWord: string;
    match: DiglotMatch;
    chosen: { entry: DictEntry; status: WordStatus };
  }

  const candidateSlots: CandidateSlot[] = [];
  let totalWords = 0;

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;

    if (/^[A-Za-z]+$/.test(part)) {
      const currentWordIdx = totalWords++;
      const tokenIdx = tokens.length;
      tokens.push({ isReplaced: false, text: part });

      const match = matchEnglishTokenToTarget(part, dictIndex);
      if (match) {
        const chosen = selectBestDiglotEntry(match.candidates, wordMap, settings);
        if (chosen) {
          candidateSlots.push({
            tokenIdx,
            wordIdx: currentWordIdx,
            rawWord: part,
            match,
            chosen,
          });
        }
      }
    } else {
      tokens.push({ isReplaced: false, text: part });
    }
  }

  if (candidateSlots.length === 0 || totalWords < 2) {
    return tokens;
  }

  const density = Math.max(1, Math.min(60, settings.inlineReplacementDensityPct || 15)) / 100;
  const maxReplacements = Math.max(1, Math.round(totalWords * density));
  const minWordGap = totalWords <= 8 ? 2 : 3;

  // Sort candidate slots to prefer active learning words (status 1..4) first, while keeping natural spread
  let replacedInBlock = 0;
  let lastReplacedWordIdx = -999;

  for (const slot of candidateSlots) {
    if (replacedInBlock >= maxReplacements) break;
    if (slot.wordIdx - lastReplacedWordIdx < minWordGap) continue;

    const targetKey = slot.chosen.entry.w;
    const prevPageCount = pageWovenCounts?.get(targetKey) || 0;
    if (prevPageCount >= 3) continue;

    const surface = formatDiglotTargetSurface(
      slot.chosen.entry,
      lang,
      slot.match.isPlural,
      slot.match.isCapitalized
    );

    tokens[slot.tokenIdx] = {
      isReplaced: true,
      text: surface,
      originalText: slot.rawWord,
      targetSurface: surface,
      targetWord: slot.chosen.entry.w,
      targetLemma: slot.chosen.entry.w,
      entry: slot.chosen.entry,
      status: slot.chosen.status,
    };

    lastReplacedWordIdx = slot.wordIdx;
    replacedInBlock++;
    if (pageWovenCounts) {
      pageWovenCounts.set(targetKey, prevPageCount + 1);
    }
  }

  return tokens;
}
