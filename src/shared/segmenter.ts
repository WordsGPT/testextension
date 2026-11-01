import type { LangCode } from './types';
import { LANG_MAP } from './languages';

export interface TextToken {
  text: string;
  isWord: boolean;
  normalized: string;
  lemmaHint?: string;
  separablePartnerIdx?: number; // for German split verbs like "sieht ... aus" -> "aussehen"
}

const KO_PARTICLES: [string, string][] = [
  ['에서는', 'from/at (topic)'],
  ['으로부터', 'from (source)'],
  ['에게서', 'from (person)'],
  ['이라도', 'even if'],
  ['으로', 'toward / by means of'],
  ['에서', 'at / in / from'],
  ['에게', 'to (a person)'],
  ['한테', 'to (colloquial)'],
  ['께서', 'honorific subject'],
  ['까지', 'until / up to'],
  ['부터', 'from / since'],
  ['처럼', 'like / as'],
  ['보다', 'than'],
  ['마다', 'every / each'],
  ['하고', 'and / with'],
  ['은', 'topic marker'],
  ['는', 'topic marker'],
  ['이', 'subject marker'],
  ['가', 'subject marker'],
  ['을', 'object marker'],
  ['를', 'object marker'],
  ['의', 'possessive (of)'],
  ['에', 'at / to / in'],
  ['로', 'by / toward'],
  ['도', 'also / too'],
  ['만', 'only / just'],
  ['와', 'and / with'],
  ['과', 'and / with'],
];

const JA_INFLECTIONS: [string, string, string][] = [
  ['ませんでした', 'る', 'polite past negative'],
  ['ました', 'る', 'polite past (-mashita)'],
  ['ません', 'る', 'polite negative (-masen)'],
  ['ます', 'る', 'polite (-masu)'],
  ['なかった', 'る', 'past negative'],
  ['ない', 'る', 'negative (-nai)'],
  ['たい', 'る', 'desiderative (want to)'],
  ['ている', 'る', 'progressive / resultant state'],
  ['て', 'る', 'te-form (conjunctive)'],
  ['た', 'る', 'past (-ta)'],
  ['きます', 'く', 'polite (-masu)'],
  ['いた', 'く', 'past (-ta)'],
  ['いて', 'く', 'te-form'],
  ['かない', 'く', 'negative (-nai)'],
  ['みません', 'む', 'polite negative'],
  ['みます', 'む', 'polite (-masu)'],
  ['んだ', 'む', 'past (-nda)'],
  ['んで', 'む', 'te-form'],
  ['まない', 'む', 'negative (-nai)'],
  ['める', 'む', 'potential (can do)'],
  ['します', 'する', 'polite (-masu)'],
  ['した', 'する', 'past'],
  ['して', 'する', 'te-form'],
  ['しない', 'する', 'negative'],
];

const DE_SEPARABLE_VERBS: Record<string, Record<string, string>> = {
  sieht: { aus: 'aussehen', an: 'ansehen', vor: 'vorsehen', zu: 'zusehen' },
  sehe: { aus: 'aussehen', an: 'ansehen' },
  sah: { aus: 'aussehen', an: 'ansehen' },
  fängt: { an: 'anfangen' },
  fange: { an: 'anfangen' },
  fing: { an: 'anfangen' },
  steht: { auf: 'aufstehen', fest: 'feststehen' },
  kommt: { an: 'ankommen', mit: 'mitkommen', zurück: 'zurückkommen' },
  hört: { auf: 'aufhören', zu: 'zuhören' },
  macht: { auf: 'aufmachen', zu: 'zumachen', mit: 'mitmachen' },
};

export function normalizeWord(word: string, lang: LangCode): string {
  const trimmed = word.trim();
  if (!trimmed) return '';
  if (lang === 'zh' || lang === 'yue' || lang === 'ja' || lang === 'ko' || lang === 'th') {
    return trimmed;
  }
  if (lang === 'de') {
    // Keep German capitalization distinction in display, normalize lowercase for lookup fallback
    return trimmed;
  }
  if (lang === 'ar') {
    // Strip tashkeel diacritics for lookup normalization
    return trimmed.replace(/[\u064B-\u065F\u0670]/g, '');
  }
  return trimmed.toLowerCase();
}

export function analyzeKoreanParts(surface: string, knownSet?: Set<string>): { stem: string; parts: { part: string; role: string }[] } | null {
  if (surface.length < 2 || !/[\uac00-\ud7af]/.test(surface)) return null;
  for (const [particle, role] of KO_PARTICLES) {
    if (surface.endsWith(particle) && surface.length > particle.length) {
      const stem = surface.slice(0, surface.length - particle.length);
      if (!knownSet || knownSet.has(stem) || stem.length >= 1) {
        return {
          stem,
          parts: [
            { part: stem, role: 'word stem' },
            { part: particle, role },
          ],
        };
      }
    }
  }
  if (surface.endsWith('해요') && surface.length > 2) {
    const noun = surface.slice(0, -2);
    return {
      stem: `${noun}하다`,
      parts: [
        { part: noun, role: 'verbal noun' },
        { part: '해요', role: 'polite present of 하다 (to do)' },
      ],
    };
  }
  return null;
}

export function analyzeJapaneseParts(surface: string, dictLemmas?: Set<string>): { lemma: string; parts: { part: string; role: string }[] } | null {
  for (const [ending, rep, role] of JA_INFLECTIONS) {
    if (surface.endsWith(ending) && surface.length > ending.length) {
      const prefix = surface.slice(0, surface.length - ending.length);
      const candidate = prefix + rep;
      if (!dictLemmas || dictLemmas.has(candidate)) {
        return {
          lemma: candidate,
          parts: [
            { part: candidate, role: 'dictionary form' },
            { part: ending, role },
          ],
        };
      }
    }
  }
  return null;
}

export function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

const HIRA_ROMAJI: Record<string, string> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo', しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo', みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo', ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo', びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ー: '-',
};

export function kanaToRomaji(input: string): string {
  const hira = input.replace(/[\u30a1-\u30f6]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  let out = '';
  for (let i = 0; i < hira.length; i++) {
    if (hira[i] === 'っ' && i + 1 < hira.length) {
      const nextPair = HIRA_ROMAJI[hira.slice(i + 1, i + 3)] || HIRA_ROMAJI[hira[i + 1]];
      if (nextPair) out += nextPair[0];
      continue;
    }
    const two = hira.slice(i, i + 2);
    if (HIRA_ROMAJI[two]) {
      out += HIRA_ROMAJI[two];
      i++;
    } else if (HIRA_ROMAJI[hira[i]]) {
      out += HIRA_ROMAJI[hira[i]];
    } else {
      out += hira[i];
    }
  }
  return out;
}

const KO_INIT = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const KO_MED = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const KO_FIN = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 't', 'l', 'lk', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'ps', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
const KO_FIN_LIAISON: Record<number, string> = { 1: 'g', 4: 'n', 7: 'd', 8: 'r', 16: 'm', 17: 'b', 19: 's', 21: 'ng', 22: 'j', 23: 'ch', 24: 'k', 25: 't', 26: 'p' };

export function romanizeKorean(word: string): string {
  const syllables: string[] = [];
  let carryConsonant = '';
  for (let i = 0; i < word.length; i++) {
    const code = word.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      const initIdx = Math.floor(offset / 588);
      const medIdx = Math.floor((offset % 588) / 28);
      const finIdx = offset % 28;

      let init = KO_INIT[initIdx];
      if (initIdx === 11 && carryConsonant) {
        // Phonetic liaison across empty initial ㅇ (e.g. 밥을 -> ba·beul)
        init = carryConsonant;
        if (syllables.length > 0) {
          syllables[syllables.length - 1] = syllables[syllables.length - 1].replace(/(k|t|p|l)$/, '');
        }
      }
      carryConsonant = '';
      // Check if next syllable starts with vowel ㅇ (initIdx === 11)
      if (finIdx > 0 && i + 1 < word.length) {
        const nextCode = word.charCodeAt(i + 1);
        if (nextCode >= 0xac00 && nextCode <= 0xd7a3) {
          const nextInit = Math.floor((nextCode - 0xac00) / 588);
          if (nextInit === 11 && KO_FIN_LIAISON[finIdx]) {
            carryConsonant = KO_FIN_LIAISON[finIdx];
          }
        }
      }
      syllables.push(init + KO_MED[medIdx] + (carryConsonant ? '' : KO_FIN[finIdx]));
    } else {
      carryConsonant = '';
      syllables.push(word[i]);
    }
  }
  return syllables.join('·');
}

const AR_TRANSLIT: Record<string, string> = {
  ا: 'ā', أ: 'a', إ: 'i', آ: 'ʾā', ب: 'b', ت: 't', ث: 'th', ج: 'j', ح: 'ḥ', خ: 'kh',
  د: 'd', ذ: 'dh', ر: 'r', ز: 'z', س: 's', ش: 'sh', ص: 'ṣ', ض: 'ḍ', ط: 'ṭ', ظ: 'ẓ',
  ع: 'ʿ', غ: 'gh', ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm', ن: 'n', ه: 'h', و: 'w',
  ي: 'y', ى: 'ā', ة: 'a', ء: 'ʾ',
};

export function transliterateArabic(word: string): string {
  const clean = normalizeWord(word, 'ar');
  if (clean.startsWith('وال') && clean.length > 3) {
    return 'wa-l-' + transliterateArabic(clean.slice(3));
  }
  if (clean.startsWith('ال') && clean.length > 2) {
    return 'al-' + transliterateArabic(clean.slice(2));
  }
  return Array.from(clean)
    .map((ch) => AR_TRANSLIT[ch] ?? ch)
    .join('');
}

/**
 * Formats furigana / reading for display above a word according to language notation settings.
 * For Japanese Hiragana/Katakana, strips okurigana if word contains kanji so readings appear over kanji only!
 */
export function formatWordReading(
  surface: string,
  lang: LangCode,
  notation: string,
  entryReading?: string,
  entryReading2?: string
): { reading: string; kanjiStem?: string; okurigana?: string } | null {
  if (lang === 'zh') {
    const r = notation === 'zhuyin' ? entryReading2 || entryReading : entryReading;
    return r ? { reading: r } : null;
  }
  if (lang === 'yue') {
    const r = notation === 'yale' ? entryReading2 || entryReading : entryReading;
    return r ? { reading: r } : null;
  }
  if (lang === 'ja') {
    if (!entryReading) return null;
    if (notation === 'romaji') {
      return { reading: entryReading2 || kanaToRomaji(entryReading) };
    }
    // Never print furigana over pure kana words!
    if (!/[\u4e00-\u9fff]/.test(surface)) return null;
    // Strip trailing matching okurigana so furigana aligns cleanly over kanji only
    let sEnd = surface.length;
    let rEnd = entryReading.length;
    while (sEnd > 0 && rEnd > 0 && surface[sEnd - 1] === entryReading[rEnd - 1] && /[\u3040-\u309f]/.test(surface[sEnd - 1])) {
      sEnd--;
      rEnd--;
    }
    const kanjiStem = surface.slice(0, sEnd);
    const okurigana = surface.slice(sEnd);
    const stemReading = entryReading.slice(0, rEnd);
    const formatted = notation === 'katakana' ? hiraganaToKatakana(stemReading) : stemReading;
    return { reading: formatted, kanjiStem, okurigana };
  }
  if (lang === 'ko') {
    return { reading: entryReading || romanizeKorean(surface) };
  }
  if (lang === 'th') {
    return entryReading ? { reading: entryReading } : null;
  }
  if (lang === 'ar') {
    return { reading: entryReading || transliterateArabic(surface) };
  }
  return null;
}

const segmenterCache = new Map<string, Intl.Segmenter>();
function getIntlSegmenter(lang: LangCode): Intl.Segmenter | null {
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter === 'undefined') return null;
  let seg = segmenterCache.get(lang);
  if (!seg) {
    try {
      const locale = lang === 'yue' ? 'zh-Hant-HK' : lang;
      seg = new Intl.Segmenter(locale, { granularity: 'word' });
      segmenterCache.set(lang, seg);
    } catch {
      return null;
    }
  }
  return seg;
}

const WORD_CHAR_RE = /[\p{L}\p{M}]/u;

/**
 * Tokenizes a run of text into word and non-word tokens, honoring:
 *  - Longest-match custom compounds & dictionary words for spaceless languages (zh, yue, ja, th)
 *  - Multi-word set phrases (up to 12 words) & Vietnamese compounds
 *  - German separable verbs across a clause ("Er sieht harmlos aus" -> links both parts to "aussehen")
 */
export function segmentText(
  text: string,
  lang: LangCode,
  lexiconSet: Set<string> = new Set(),
  phrasesSet: Set<string> = new Set()
): TextToken[] {
  if (!text) return [];
  const meta = LANG_MAP[lang];

  // 1. Spaceless scripts: Chinese, Cantonese, Japanese, Thai
  if (meta?.spaceless) {
    const out: TextToken[] = [];
    const maxLen = 8;
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (!WORD_CHAR_RE.test(ch) || /\d/.test(ch)) {
        let j = i + 1;
        while (j < text.length && (!WORD_CHAR_RE.test(text[j]) || /\d/.test(text[j]))) j++;
        out.push({ text: text.slice(i, j), isWord: false, normalized: '' });
        i = j;
        continue;
      }

      // Greedy longest-match against lexiconSet + phrasesSet
      let matched = '';
      const limit = Math.min(maxLen, text.length - i);
      for (let len = limit; len >= 2; len--) {
        const sub = text.slice(i, i + len);
        if (phrasesSet.has(sub) || lexiconSet.has(sub)) {
          matched = sub;
          break;
        }
        if (lang === 'ja') {
          const jaParts = analyzeJapaneseParts(sub, lexiconSet);
          if (jaParts) {
            matched = sub;
            out.push({
              text: sub,
              isWord: true,
              normalized: sub,
              lemmaHint: jaParts.lemma,
            });
            i += len;
            break;
          }
        }
      }
      if (matched && out[out.length - 1]?.text !== matched) {
        out.push({ text: matched, isWord: true, normalized: matched });
        i += matched.length;
        continue;
      }
      if (matched) continue;

      // Fallback to Intl.Segmenter on contiguous script run
      let runEnd = i + 1;
      while (runEnd < text.length && WORD_CHAR_RE.test(text[runEnd]) && !/\d/.test(text[runEnd])) {
        // Stop early if a dictionary multi-char word starts at runEnd
        let dictAhead = false;
        for (let len = Math.min(maxLen, text.length - runEnd); len >= 2; len--) {
          const cand = text.slice(runEnd, runEnd + len);
          if (phrasesSet.has(cand) || lexiconSet.has(cand)) {
            dictAhead = true;
            break;
          }
        }
        if (dictAhead) break;
        runEnd++;
      }

      const slice = text.slice(i, runEnd);
      const seg = getIntlSegmenter(lang);
      if (seg) {
        for (const part of seg.segment(slice)) {
          const isW = Boolean(part.isWordLike && WORD_CHAR_RE.test(part.segment));
          const jaInf = lang === 'ja' && isW ? analyzeJapaneseParts(part.segment, lexiconSet) : null;
          out.push({
            text: part.segment,
            isWord: isW,
            normalized: isW ? part.segment : '',
            ...(jaInf ? { lemmaHint: jaInf.lemma } : {}),
          });
        }
      } else {
        for (const c of Array.from(slice)) {
          out.push({ text: c, isWord: true, normalized: c });
        }
      }
      i = runEnd;
    }
    return out;
  }

  // 2. Spaced scripts (Latin, Cyrillic, Greek, Arabic, Korean, Vietnamese)
  // Split preserving punctuation & whitespace
  const rawParts = text.match(/[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*|[^\p{L}\p{M}]+/gu) || [text];
  const baseTokens: TextToken[] = rawParts.map((part) => {
    const isWord = WORD_CHAR_RE.test(part[0]);
    if (!isWord) return { text: part, isWord: false, normalized: '' };
    // Strip Italian/French apostrophe elision prefix like "C'era", "d'inverno", "l'acqua" into separate tokens if apostrophe present
    return {
      text: part,
      isWord: true,
      normalized: normalizeWord(part, lang),
    };
  });

  // Split apostrophe contractions cleanly for Italian & French (e.g. "C'era" -> "C'" + "era", "l'acqua" -> "l'" + "acqua")
  const expanded: TextToken[] = [];
  for (const tok of baseTokens) {
    if (tok.isWord && (lang === 'it' || lang === 'fr') && /['’]/.test(tok.text)) {
      const idx = tok.text.search(/['’]/);
      const left = tok.text.slice(0, idx);
      const apos = tok.text[idx];
      const right = tok.text.slice(idx + 1);
      if (left && right) {
        expanded.push({ text: left, isWord: true, normalized: normalizeWord(left, lang) });
        expanded.push({ text: apos, isWord: false, normalized: '' });
        expanded.push({ text: right, isWord: true, normalized: normalizeWord(right, lang) });
        continue;
      }
    }
    if (tok.isWord && lang === 'ko') {
      const ko = analyzeKoreanParts(tok.text, lexiconSet);
      if (ko) {
        expanded.push({ ...tok, lemmaHint: ko.stem });
        continue;
      }
    }
    expanded.push(tok);
  }

  // Greedy multi-word phrase & Vietnamese compound merge (up to 12 words)
  if (phrasesSet.size > 0 || lang === 'vi') {
    const merged: TextToken[] = [];
    let idx = 0;
    while (idx < expanded.length) {
      if (!expanded[idx].isWord) {
        merged.push(expanded[idx]);
        idx++;
        continue;
      }
      let bestEndIdx = -1;
      let bestText = '';
      let bestNorm = '';
      let wordCount = 1;
      let accumText = expanded[idx].text;
      for (let j = idx + 1; j < expanded.length && wordCount < 12; j++) {
        const t = expanded[j];
        if (!t.isWord && !/^\s+$/.test(t.text)) break;
        accumText += t.text;
        if (t.isWord) {
          wordCount++;
          const normCandidate = normalizeWord(accumText.replace(/\s+/g, ' '), lang);
          const rawCandidate = accumText.replace(/\s+/g, ' ');
          if (
            phrasesSet.has(normCandidate) ||
            phrasesSet.has(rawCandidate) ||
            (lang === 'vi' && (lexiconSet.has(normCandidate) || lexiconSet.has(rawCandidate)))
          ) {
            bestEndIdx = j;
            bestText = accumText;
            bestNorm = lexiconSet.has(rawCandidate) ? rawCandidate : normCandidate;
          }
        }
      }
      if (bestEndIdx !== -1) {
        merged.push({ text: bestText, isWord: true, normalized: bestNorm });
        idx = bestEndIdx + 1;
      } else {
        merged.push(expanded[idx]);
        idx++;
      }
    }
    applyGermanSeparableVerbs(merged, lang);
    return merged;
  }

  applyGermanSeparableVerbs(expanded, lang);
  return expanded;
}

function applyGermanSeparableVerbs(tokens: TextToken[], lang: LangCode): void {
  if (lang !== 'de') return;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.isWord) continue;
    const lower = t.text.toLowerCase();
    const map = DE_SEPARABLE_VERBS[lower];
    if (!map) continue;
    // Scan forward until clause boundary (., !, ?, ;, :)
    for (let j = i + 1; j < Math.min(tokens.length, i + 28); j++) {
      const tj = tokens[j];
      if (!tj.isWord && /[.!?;:]/.test(tj.text)) break;
      if (tj.isWord) {
        const candLemma = map[tj.text.toLowerCase()];
        if (candLemma) {
          t.lemmaHint = candLemma;
          tj.lemmaHint = candLemma;
          t.separablePartnerIdx = j;
          tj.separablePartnerIdx = i;
          break;
        }
      }
    }
  }
}
