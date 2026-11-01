import type { LangCode, PerLanguageOptions } from './types';

export interface LanguageMeta {
  code: LangCode;
  name: string;
  nativeName: string;
  rtl?: boolean;
  spaceless?: boolean; // CJK + Thai
  cjk?: boolean; // zh, yue, ja
  compoundSpaced?: boolean; // vi
  notations?: { id: string; label: string }[];
  defaultDictLinks: { name: string; urlTemplate: string }[];
  speechLocale: string;
}

export const LANGUAGES: LanguageMeta[] = [
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    spaceless: true,
    cjk: true,
    notations: [
      { id: 'pinyin', label: 'Pinyin (hànyǔ pīnyīn)' },
      { id: 'zhuyin', label: 'Zhuyin / Bopomofo (注音)' },
    ],
    defaultDictLinks: [
      { name: 'MDBG', urlTemplate: 'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb={word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Chinese' },
      { name: 'Reverso', urlTemplate: 'https://context.reverso.net/translation/chinese-english/{word}' },
    ],
    speechLocale: 'zh-CN',
  },
  {
    code: 'yue',
    name: 'Cantonese',
    nativeName: '廣東話',
    spaceless: true,
    cjk: true,
    notations: [
      { id: 'jyutping', label: 'Jyutping (粵拼)' },
      { id: 'yale', label: 'Yale Romanization' },
    ],
    defaultDictLinks: [
      { name: 'words.hk', urlTemplate: 'https://words.hk/zidin/{word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Chinese' },
    ],
    speechLocale: 'zh-HK',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    spaceless: true,
    cjk: true,
    notations: [
      { id: 'hiragana', label: 'Hiragana (furigana over kanji)' },
      { id: 'katakana', label: 'Katakana (over kanji)' },
      { id: 'romaji', label: 'Romaji (over every word)' },
    ],
    defaultDictLinks: [
      { name: 'Jisho', urlTemplate: 'https://jisho.org/search/{word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Japanese' },
      { name: 'Weblio', urlTemplate: 'https://ejje.weblio.jp/content/{word}' },
    ],
    speechLocale: 'ja-JP',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    notations: [{ id: 'revised', label: 'Revised Romanization (phonetic)' }],
    defaultDictLinks: [
      { name: 'Naver Dict', urlTemplate: 'https://korean.dict.naver.com/koendict/#/search?query={word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Korean' },
    ],
    speechLocale: 'ko-KR',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    defaultDictLinks: [
      { name: 'WordReference', urlTemplate: 'https://www.wordreference.com/iten/{word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Italian' },
      { name: 'Treccani', urlTemplate: 'https://www.treccani.it/vocabolario/ricerca/{word}/' },
    ],
    speechLocale: 'it-IT',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    defaultDictLinks: [
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#English' },
      { name: 'Cambridge', urlTemplate: 'https://dictionary.cambridge.org/dictionary/english/{word}' },
    ],
    speechLocale: 'en-US',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    defaultDictLinks: [
      { name: 'WordReference', urlTemplate: 'https://www.wordreference.com/fren/{word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#French' },
    ],
    speechLocale: 'fr-FR',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    defaultDictLinks: [
      { name: 'DWDS', urlTemplate: 'https://www.dwds.de/wb/{word}' },
      { name: 'dict.cc', urlTemplate: 'https://www.dict.cc/?s={word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#German' },
    ],
    speechLocale: 'de-DE',
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    defaultDictLinks: [{ name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Dutch' }],
    speechLocale: 'nl-NL',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    defaultDictLinks: [
      { name: 'SpanishDict', urlTemplate: 'https://www.spanishdict.com/translate/{word}' },
      { name: 'WordReference', urlTemplate: 'https://www.wordreference.com/esen/{word}' },
    ],
    speechLocale: 'es-ES',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    defaultDictLinks: [
      { name: 'WordReference', urlTemplate: 'https://www.wordreference.com/pten/{word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Portuguese' },
    ],
    speechLocale: 'pt-BR',
  },
  {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    defaultDictLinks: [
      { name: 'svenska.se', urlTemplate: 'https://svenska.se/tre/?sok={word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Swedish' },
    ],
    speechLocale: 'sv-SE',
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    defaultDictLinks: [{ name: 'Ordnet', urlTemplate: 'https://ordnet.dk/ddo/ordbog?query={word}' }],
    speechLocale: 'da-DK',
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    defaultDictLinks: [{ name: 'Ordbøkene', urlTemplate: 'https://ordbokene.no/bm/search?q={word}' }],
    speechLocale: 'nb-NO',
  },
  {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'Suomi',
    defaultDictLinks: [{ name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Finnish' }],
    speechLocale: 'fi-FI',
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    defaultDictLinks: [{ name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Polish' }],
    speechLocale: 'pl-PL',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    defaultDictLinks: [
      { name: 'OpenRussian', urlTemplate: 'https://en.openrussian.org/ru/{word}' },
      { name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Russian' },
    ],
    speechLocale: 'ru-RU',
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    defaultDictLinks: [{ name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Ukrainian' }],
    speechLocale: 'uk-UA',
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    defaultDictLinks: [{ name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Greek' }],
    speechLocale: 'el-GR',
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    defaultDictLinks: [{ name: 'Tureng', urlTemplate: 'https://tureng.com/en/turkish-english/{word}' }],
    speechLocale: 'tr-TR',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    compoundSpaced: true,
    defaultDictLinks: [{ name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Vietnamese' }],
    speechLocale: 'vi-VN',
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    defaultDictLinks: [{ name: 'KBBI', urlTemplate: 'https://kbbi.kemdikbud.go.id/entri/{word}' }],
    speechLocale: 'id-ID',
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    spaceless: true,
    notations: [{ id: 'paiboon', label: 'Paiboon+ Romanization' }],
    defaultDictLinks: [{ name: 'Thai-Language', urlTemplate: 'http://www.thai-language.com/dict/{word}' }],
    speechLocale: 'th-TH',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    rtl: true,
    notations: [{ id: 'translit', label: 'Vocalized Latin Transliteration' }],
    defaultDictLinks: [{ name: 'Wiktionary', urlTemplate: 'https://en.wiktionary.org/wiki/{word}#Arabic' }],
    speechLocale: 'ar-SA',
  },
];

export const LANG_MAP: Record<LangCode, LanguageMeta> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l])
) as Record<LangCode, LanguageMeta>;

export function getDefaultLangOptions(code: LangCode): PerLanguageOptions {
  const meta = LANG_MAP[code];
  const defaultNotation = meta?.notations?.[0]?.id || 'pinyin';
  return {
    countingMode: 'lemma',
    unifyScripts: true,
    onlyHighlightTargetText: !meta?.spaceless && code !== 'ko' && code !== 'ar' && code !== 'el' && code !== 'ru' && code !== 'uk',
    readingsEnabled: false,
    readingNotation: defaultNotation,
    readingScope: 'new_learning',
    pitchAccent: code === 'ja',
    definitionLang: 'en',
    translateIntoLang: 'en',
    whoTranslates: 'google',
    customDictPlacement: 'above',
    dictionaryLinks: [...(meta?.defaultDictLinks || [])],
    fontFamily: 'original',
    ankiAutoDeck: `Verba::${meta?.name || code}`,
    ankiPickedDeck: `Verba::${meta?.name || code}`,
    ankiNoteType: 'Verba',
  };
}

const STOPWORDS: Partial<Record<LangCode, string[]>> = {
  it: ['il', 'la', 'di', 'che', 'non', 'un', 'una', 'per', 'con', 'del', 'della', 'sono', 'era', 'questo', 'questa', 'nella', 'anche', 'come'],
  en: ['the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 'his', 'from', 'they', 'would', 'there'],
  fr: ['le', 'la', 'les', 'de', 'des', 'est', 'une', 'dans', 'pour', 'que', 'qui', 'pas', 'sur', 'avec', 'plus', 'sont'],
  de: ['der', 'die', 'das', 'und', 'in', 'den', 'von', 'zu', 'mit', 'sich', 'auf', 'für', 'ist', 'im', 'nicht', 'ein', 'eine'],
  es: ['el', 'la', 'los', 'las', 'de', 'que', 'en', 'un', 'una', 'por', 'con', 'no', 'para', 'es', 'del', 'como', 'más'],
  pt: ['o', 'a', 'os', 'as', 'de', 'que', 'em', 'um', 'uma', 'para', 'com', 'não', 'por', 'mais', 'dos', 'como'],
  nl: ['de', 'het', 'een', 'en', 'van', 'in', 'is', 'dat', 'op', 'te', 'voor', 'met', 'zijn', 'niet'],
  sv: ['och', 'att', 'det', 'som', 'en', 'på', 'är', 'för', 'med', 'till', 'den', 'har', 'inte'],
  da: ['og', 'i', 'at', 'det', 'en', 'til', 'er', 'af', 'på', 'for', 'med', 'som', 'ikke'],
  no: ['og', 'i', 'å', 'det', 'en', 'til', 'er', 'av', 'på', 'for', 'med', 'som', 'ikke'],
  fi: ['ja', 'on', 'ei', 'se', 'että', 'oli', 'mutta', 'niin', 'kuin', 'vain', 'tai'],
  pl: ['i', 'w', 'nie', 'na', 'do', 'to', 'że', 'się', 'z', 'jest', 'jak', 'ale'],
  tr: ['ve', 'bir', 'bu', 'için', 'ile', 'de', 'da', 'ne', 'çok', 'daha', 'gibi'],
  id: ['dan', 'yang', 'di', 'ini', 'itu', 'untuk', 'dengan', 'tidak', 'dari', 'pada', 'dalam'],
  vi: ['của', 'và', 'là', 'có', 'trong', 'được', 'cho', 'không', 'người', 'những', 'một'],
};

/**
 * Lightweight, accurate client-side language detector across scripts & Latin/Cyrillic stopwords.
 */
export function detectTextLanguage(text: string, htmlLangAttr?: string): LangCode | null {
  if (htmlLangAttr) {
    const clean = htmlLangAttr.toLowerCase().trim();
    if (clean.startsWith('yue') || clean === 'zh-hk') return 'yue';
    const base = clean.split(/[-_]/)[0];
    if (base === 'nb' || base === 'nn') return 'no';
    if (LANG_MAP[base as LangCode]) return base as LangCode;
  }

  const sample = text.slice(0, 3000);
  if (!sample.trim()) return null;

  // Script character counts
  const kanaCount = (sample.match(/[\u3040-\u30ff]/g) || []).length;
  const hangulCount = (sample.match(/[\uac00-\ud7af]/g) || []).length;
  const hanCount = (sample.match(/[\u4e00-\u9fff]/g) || []).length;
  const arabicCount = (sample.match(/[\u0600-\u06ff]/g) || []).length;
  const thaiCount = (sample.match(/[\u0e00-\u0e7f]/g) || []).length;
  const greekCount = (sample.match(/[\u0370-\u03ff]/g) || []).length;
  const cyrillicCount = (sample.match(/[\u0400-\u04ff]/g) || []).length;

  if (kanaCount >= 3) return 'ja';
  if (hangulCount >= 3) return 'ko';
  if (hanCount >= 4) {
    if (/[嘅喺唔冇佢哋睇講]/.test(sample)) return 'yue';
    return 'zh';
  }
  if (arabicCount >= 4) return 'ar';
  if (thaiCount >= 4) return 'th';
  if (greekCount >= 4) return 'el';
  if (cyrillicCount >= 4) {
    if (/[іїєґІЇЄҐ]/.test(sample)) return 'uk';
    return 'ru';
  }

  // Latin script stopword scoring
  const tokens = sample
    .toLowerCase()
    .split(/[^a-zà-žăâđêôơư]+/i)
    .filter((w) => w.length >= 1);
  if (tokens.length < 3) return null;

  if (/[ăâđêôơưảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(sample)) {
    return 'vi';
  }

  let bestLang: LangCode | null = null;
  let bestScore = 0;
  for (const [lang, stops] of Object.entries(STOPWORDS) as [LangCode, string[]][]) {
    const stopSet = new Set(stops);
    let hits = 0;
    for (const tok of tokens) {
      if (stopSet.has(tok)) hits++;
    }
    const ratio = hits / tokens.length;
    if (hits >= 2 && ratio > bestScore) {
      bestScore = ratio;
      bestLang = lang;
    }
  }
  return bestLang;
}

/**
 * Checks whether a run of text plausibly belongs to `lang` ("Only highlight text that looks Italian").
 */
export function textLooksLikeLanguage(text: string, lang: LangCode): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (lang === 'zh' || lang === 'yue') return /[\u4e00-\u9fff]/.test(trimmed);
  if (lang === 'ja') return /[\u3040-\u30ff\u4e00-\u9fff]/.test(trimmed);
  if (lang === 'ko') return /[\uac00-\ud7af]/.test(trimmed);
  if (lang === 'ar') return /[\u0600-\u06ff]/.test(trimmed);
  if (lang === 'th') return /[\u0e00-\u0e7f]/.test(trimmed);
  if (lang === 'el') return /[\u0370-\u03ff]/.test(trimmed);
  if (lang === 'ru' || lang === 'uk') return /[\u0400-\u04ff]/.test(trimmed);

  // For Latin languages: short snippets inside an already-matched page are fine if they contain letters
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 4) return /\p{L}/u.test(trimmed);
  const detected = detectTextLanguage(trimmed);
  // Highlight if detected matches lang or if ambiguous short paragraph
  return !detected || detected === lang;
}
