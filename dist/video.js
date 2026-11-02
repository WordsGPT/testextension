// src/shared/languages.ts
var LANGUAGES = [
  {
    code: "zh",
    name: "Chinese",
    nativeName: "\u4E2D\u6587",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "pinyin", label: "Pinyin (h\xE0ny\u01D4 p\u012Bny\u012Bn)" },
      { id: "zhuyin", label: "Zhuyin / Bopomofo (\u6CE8\u97F3)" }
    ],
    defaultDictLinks: [
      { name: "MDBG", urlTemplate: "https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Chinese" },
      { name: "Reverso", urlTemplate: "https://context.reverso.net/translation/chinese-english/{word}" }
    ],
    speechLocale: "zh-CN"
  },
  {
    code: "yue",
    name: "Cantonese",
    nativeName: "\u5EE3\u6771\u8A71",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "jyutping", label: "Jyutping (\u7CB5\u62FC)" },
      { id: "yale", label: "Yale Romanization" }
    ],
    defaultDictLinks: [
      { name: "words.hk", urlTemplate: "https://words.hk/zidin/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Chinese" }
    ],
    speechLocale: "zh-HK"
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "\u65E5\u672C\u8A9E",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "hiragana", label: "Hiragana (furigana over kanji)" },
      { id: "katakana", label: "Katakana (over kanji)" },
      { id: "romaji", label: "Romaji (over every word)" }
    ],
    defaultDictLinks: [
      { name: "Jisho", urlTemplate: "https://jisho.org/search/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Japanese" },
      { name: "Weblio", urlTemplate: "https://ejje.weblio.jp/content/{word}" }
    ],
    speechLocale: "ja-JP"
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "\uD55C\uAD6D\uC5B4",
    notations: [{ id: "revised", label: "Revised Romanization (phonetic)" }],
    defaultDictLinks: [
      { name: "Naver Dict", urlTemplate: "https://korean.dict.naver.com/koendict/#/search?query={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Korean" }
    ],
    speechLocale: "ko-KR"
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/iten/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Italian" },
      { name: "Treccani", urlTemplate: "https://www.treccani.it/vocabolario/ricerca/{word}/" }
    ],
    speechLocale: "it-IT"
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    defaultDictLinks: [
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#English" },
      { name: "Cambridge", urlTemplate: "https://dictionary.cambridge.org/dictionary/english/{word}" }
    ],
    speechLocale: "en-US"
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Fran\xE7ais",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/fren/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#French" }
    ],
    speechLocale: "fr-FR"
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    defaultDictLinks: [
      { name: "DWDS", urlTemplate: "https://www.dwds.de/wb/{word}" },
      { name: "dict.cc", urlTemplate: "https://www.dict.cc/?s={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#German" }
    ],
    speechLocale: "de-DE"
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Dutch" }],
    speechLocale: "nl-NL"
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Espa\xF1ol",
    defaultDictLinks: [
      { name: "SpanishDict", urlTemplate: "https://www.spanishdict.com/translate/{word}" },
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/esen/{word}" }
    ],
    speechLocale: "es-ES"
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Portugu\xEAs",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/pten/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Portuguese" }
    ],
    speechLocale: "pt-BR"
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    defaultDictLinks: [
      { name: "svenska.se", urlTemplate: "https://svenska.se/tre/?sok={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Swedish" }
    ],
    speechLocale: "sv-SE"
  },
  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    defaultDictLinks: [{ name: "Ordnet", urlTemplate: "https://ordnet.dk/ddo/ordbog?query={word}" }],
    speechLocale: "da-DK"
  },
  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    defaultDictLinks: [{ name: "Ordb\xF8kene", urlTemplate: "https://ordbokene.no/bm/search?q={word}" }],
    speechLocale: "nb-NO"
  },
  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Finnish" }],
    speechLocale: "fi-FI"
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Polish" }],
    speechLocale: "pl-PL"
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    defaultDictLinks: [
      { name: "OpenRussian", urlTemplate: "https://en.openrussian.org/ru/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Russian" }
    ],
    speechLocale: "ru-RU"
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Ukrainian" }],
    speechLocale: "uk-UA"
  },
  {
    code: "el",
    name: "Greek",
    nativeName: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Greek" }],
    speechLocale: "el-GR"
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "T\xFCrk\xE7e",
    defaultDictLinks: [{ name: "Tureng", urlTemplate: "https://tureng.com/en/turkish-english/{word}" }],
    speechLocale: "tr-TR"
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Ti\u1EBFng Vi\u1EC7t",
    compoundSpaced: true,
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Vietnamese" }],
    speechLocale: "vi-VN"
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    defaultDictLinks: [{ name: "KBBI", urlTemplate: "https://kbbi.kemdikbud.go.id/entri/{word}" }],
    speechLocale: "id-ID"
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "\u0E44\u0E17\u0E22",
    spaceless: true,
    notations: [{ id: "paiboon", label: "Paiboon+ Romanization" }],
    defaultDictLinks: [{ name: "Thai-Language", urlTemplate: "http://www.thai-language.com/dict/{word}" }],
    speechLocale: "th-TH"
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    rtl: true,
    notations: [{ id: "translit", label: "Vocalized Latin Transliteration" }],
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Arabic" }],
    speechLocale: "ar-SA"
  }
];
var LANG_MAP = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l])
);
function getDefaultLangOptions(code) {
  const meta = LANG_MAP[code];
  const defaultNotation = meta?.notations?.[0]?.id || "pinyin";
  return {
    countingMode: "lemma",
    unifyScripts: true,
    onlyHighlightTargetText: !meta?.spaceless && code !== "ko" && code !== "ar" && code !== "el" && code !== "ru" && code !== "uk",
    readingsEnabled: false,
    readingNotation: defaultNotation,
    readingScope: "new_learning",
    pitchAccent: code === "ja",
    definitionLang: "en",
    translateIntoLang: "en",
    whoTranslates: "google",
    customDictPlacement: "above",
    dictionaryLinks: [...meta?.defaultDictLinks || []],
    fontFamily: "original",
    ankiAutoDeck: `Verba::${meta?.name || code}`,
    ankiPickedDeck: `Verba::${meta?.name || code}`,
    ankiNoteType: "Verba"
  };
}
var STOPWORDS = {
  it: ["il", "la", "di", "che", "non", "un", "una", "per", "con", "del", "della", "sono", "era", "questo", "questa", "nella", "anche", "come"],
  en: ["the", "and", "that", "have", "for", "not", "with", "you", "this", "but", "his", "from", "they", "would", "there"],
  fr: ["le", "la", "les", "de", "des", "est", "une", "dans", "pour", "que", "qui", "pas", "sur", "avec", "plus", "sont"],
  de: ["der", "die", "das", "und", "in", "den", "von", "zu", "mit", "sich", "auf", "f\xFCr", "ist", "im", "nicht", "ein", "eine"],
  es: ["el", "la", "los", "las", "de", "que", "en", "un", "una", "por", "con", "no", "para", "es", "del", "como", "m\xE1s"],
  pt: ["o", "a", "os", "as", "de", "que", "em", "um", "uma", "para", "com", "n\xE3o", "por", "mais", "dos", "como"],
  nl: ["de", "het", "een", "en", "van", "in", "is", "dat", "op", "te", "voor", "met", "zijn", "niet"],
  sv: ["och", "att", "det", "som", "en", "p\xE5", "\xE4r", "f\xF6r", "med", "till", "den", "har", "inte"],
  da: ["og", "i", "at", "det", "en", "til", "er", "af", "p\xE5", "for", "med", "som", "ikke"],
  no: ["og", "i", "\xE5", "det", "en", "til", "er", "av", "p\xE5", "for", "med", "som", "ikke"],
  fi: ["ja", "on", "ei", "se", "ett\xE4", "oli", "mutta", "niin", "kuin", "vain", "tai"],
  pl: ["i", "w", "nie", "na", "do", "to", "\u017Ce", "si\u0119", "z", "jest", "jak", "ale"],
  tr: ["ve", "bir", "bu", "i\xE7in", "ile", "de", "da", "ne", "\xE7ok", "daha", "gibi"],
  id: ["dan", "yang", "di", "ini", "itu", "untuk", "dengan", "tidak", "dari", "pada", "dalam"],
  vi: ["c\u1EE7a", "v\xE0", "l\xE0", "c\xF3", "trong", "\u0111\u01B0\u1EE3c", "cho", "kh\xF4ng", "ng\u01B0\u1EDDi", "nh\u1EEFng", "m\u1ED9t"]
};
function detectTextLanguage(text, htmlLangAttr) {
  if (htmlLangAttr) {
    const clean = htmlLangAttr.toLowerCase().trim();
    if (clean.startsWith("yue") || clean === "zh-hk") return "yue";
    const base = clean.split(/[-_]/)[0];
    if (base === "nb" || base === "nn") return "no";
    if (LANG_MAP[base]) return base;
  }
  const sample = text.slice(0, 3e3);
  if (!sample.trim()) return null;
  const kanaCount = (sample.match(/[\u3040-\u30ff]/g) || []).length;
  const hangulCount = (sample.match(/[\uac00-\ud7af]/g) || []).length;
  const hanCount = (sample.match(/[\u4e00-\u9fff]/g) || []).length;
  const arabicCount = (sample.match(/[\u0600-\u06ff]/g) || []).length;
  const thaiCount = (sample.match(/[\u0e00-\u0e7f]/g) || []).length;
  const greekCount = (sample.match(/[\u0370-\u03ff]/g) || []).length;
  const cyrillicCount = (sample.match(/[\u0400-\u04ff]/g) || []).length;
  if (kanaCount >= 3) return "ja";
  if (hangulCount >= 3) return "ko";
  if (hanCount >= 4) {
    if (/[嘅喺唔冇佢哋睇講]/.test(sample)) return "yue";
    return "zh";
  }
  if (arabicCount >= 4) return "ar";
  if (thaiCount >= 4) return "th";
  if (greekCount >= 4) return "el";
  if (cyrillicCount >= 4) {
    if (/[іїєґІЇЄҐ]/.test(sample)) return "uk";
    return "ru";
  }
  const tokens = sample.toLowerCase().split(/[^a-zà-žăâđêôơư]+/i).filter((w) => w.length >= 1);
  if (tokens.length < 3) return null;
  if (/[ăâđêôơưảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(sample)) {
    return "vi";
  }
  let bestLang = null;
  let bestScore = 0;
  for (const [lang, stops] of Object.entries(STOPWORDS)) {
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
function textLooksLikeLanguage(text, lang) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (lang === "zh" || lang === "yue") return /[\u4e00-\u9fff]/.test(trimmed);
  if (lang === "ja") return /[\u3040-\u30ff\u4e00-\u9fff]/.test(trimmed);
  if (lang === "ko") return /[\uac00-\ud7af]/.test(trimmed);
  if (lang === "ar") return /[\u0600-\u06ff]/.test(trimmed);
  if (lang === "th") return /[\u0e00-\u0e7f]/.test(trimmed);
  if (lang === "el") return /[\u0370-\u03ff]/.test(trimmed);
  if (lang === "ru" || lang === "uk") return /[\u0400-\u04ff]/.test(trimmed);
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 4) return new RegExp("\\p{L}", "u").test(trimmed);
  const detected = detectTextLanguage(trimmed);
  return !detected || detected === lang;
}

// src/shared/webext.ts
function getExtApi() {
  const g = globalThis;
  return g.browser || g.chrome || null;
}
function getExtensionUrl(relPath) {
  const api = getExtApi();
  if (api?.runtime?.getURL) {
    return api.runtime.getURL(relPath);
  }
  return relPath;
}
async function sendRuntimeMessage(msg) {
  const api = getExtApi();
  if (!api?.runtime?.sendMessage) {
    throw new Error("WebExtension runtime.sendMessage is unavailable in this context");
  }
  return await api.runtime.sendMessage(msg);
}

// src/shared/db.ts
var DB_NAME = "verba_db_v1";
var DB_VERSION = 1;
var dbPromise = null;
function openVerbaDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("words")) {
        const ws = db.createObjectStore("words", { keyPath: "id" });
        ws.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("books")) {
        const bs = db.createObjectStore("books", { keyPath: "id" });
        bs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("bookFiles")) {
        db.createObjectStore("bookFiles", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("folders")) {
        const fsStore = db.createObjectStore("folders", { keyPath: "id" });
        fsStore.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("bookmarks")) {
        const bms = db.createObjectStore("bookmarks", { keyPath: "id" });
        bms.createIndex("by_book", "bookId", { unique: false });
      }
      if (!db.objectStoreNames.contains("videos")) {
        const vs = db.createObjectStore("videos", { keyPath: "id" });
        vs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("dailyStats")) {
        const ds = db.createObjectStore("dailyStats", { keyPath: "id" });
        ds.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("listeningHistory")) {
        const ls = db.createObjectStore("listeningHistory", { keyPath: "id" });
        ls.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("customDicts")) {
        const cs = db.createObjectStore("customDicts", { keyPath: "id" });
        cs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("assessments")) {
        const asStore = db.createObjectStore("assessments", { keyPath: "id" });
        asStore.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("notes")) {
        const ns = db.createObjectStore("notes", { keyPath: "id" });
        ns.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("readArticles")) {
        db.createObjectStore("readArticles", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
function txPut(storeName, value) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    })
  );
}
function txGetAll(storeName, indexName, query) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const target = indexName ? store.index(indexName) : store;
      const req = query !== void 0 ? target.getAll(query) : target.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    })
  );
}
function getLangOptionsFromSettings(settings, lang) {
  return {
    ...getDefaultLangOptions(lang),
    ...settings.perLang[lang] || {}
  };
}
async function getWordsByLang(lang) {
  const all = await txGetAll("words", "by_lang", lang);
  return all.filter((w) => !w.deleted);
}
async function getVideosByLang(lang) {
  const all = await txGetAll("videos", "by_lang", lang);
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}
async function putVideoHistory(v) {
  await txPut("videos", v);
}
async function getCustomDictsByLang(lang) {
  const all = await txGetAll("customDicts", "by_lang", lang);
  return all.sort((a, b) => a.order - b.order);
}

// src/shared/segmenter.ts
var KO_PARTICLES = [
  ["\uC5D0\uC11C\uB294", "from/at (topic)"],
  ["\uC73C\uB85C\uBD80\uD130", "from (source)"],
  ["\uC5D0\uAC8C\uC11C", "from (person)"],
  ["\uC774\uB77C\uB3C4", "even if"],
  ["\uC73C\uB85C", "toward / by means of"],
  ["\uC5D0\uC11C", "at / in / from"],
  ["\uC5D0\uAC8C", "to (a person)"],
  ["\uD55C\uD14C", "to (colloquial)"],
  ["\uAED8\uC11C", "honorific subject"],
  ["\uAE4C\uC9C0", "until / up to"],
  ["\uBD80\uD130", "from / since"],
  ["\uCC98\uB7FC", "like / as"],
  ["\uBCF4\uB2E4", "than"],
  ["\uB9C8\uB2E4", "every / each"],
  ["\uD558\uACE0", "and / with"],
  ["\uC740", "topic marker"],
  ["\uB294", "topic marker"],
  ["\uC774", "subject marker"],
  ["\uAC00", "subject marker"],
  ["\uC744", "object marker"],
  ["\uB97C", "object marker"],
  ["\uC758", "possessive (of)"],
  ["\uC5D0", "at / to / in"],
  ["\uB85C", "by / toward"],
  ["\uB3C4", "also / too"],
  ["\uB9CC", "only / just"],
  ["\uC640", "and / with"],
  ["\uACFC", "and / with"]
];
var JA_INFLECTIONS = [
  ["\u307E\u305B\u3093\u3067\u3057\u305F", "\u308B", "polite past negative"],
  ["\u307E\u3057\u305F", "\u308B", "polite past (-mashita)"],
  ["\u307E\u305B\u3093", "\u308B", "polite negative (-masen)"],
  ["\u307E\u3059", "\u308B", "polite (-masu)"],
  ["\u306A\u304B\u3063\u305F", "\u308B", "past negative"],
  ["\u306A\u3044", "\u308B", "negative (-nai)"],
  ["\u305F\u3044", "\u308B", "desiderative (want to)"],
  ["\u3066\u3044\u308B", "\u308B", "progressive / resultant state"],
  ["\u3066", "\u308B", "te-form (conjunctive)"],
  ["\u305F", "\u308B", "past (-ta)"],
  ["\u304D\u307E\u3059", "\u304F", "polite (-masu)"],
  ["\u3044\u305F", "\u304F", "past (-ta)"],
  ["\u3044\u3066", "\u304F", "te-form"],
  ["\u304B\u306A\u3044", "\u304F", "negative (-nai)"],
  ["\u307F\u307E\u305B\u3093", "\u3080", "polite negative"],
  ["\u307F\u307E\u3059", "\u3080", "polite (-masu)"],
  ["\u3093\u3060", "\u3080", "past (-nda)"],
  ["\u3093\u3067", "\u3080", "te-form"],
  ["\u307E\u306A\u3044", "\u3080", "negative (-nai)"],
  ["\u3081\u308B", "\u3080", "potential (can do)"],
  ["\u3057\u307E\u3059", "\u3059\u308B", "polite (-masu)"],
  ["\u3057\u305F", "\u3059\u308B", "past"],
  ["\u3057\u3066", "\u3059\u308B", "te-form"],
  ["\u3057\u306A\u3044", "\u3059\u308B", "negative"]
];
var DE_SEPARABLE_VERBS = {
  sieht: { aus: "aussehen", an: "ansehen", vor: "vorsehen", zu: "zusehen" },
  sehe: { aus: "aussehen", an: "ansehen" },
  sah: { aus: "aussehen", an: "ansehen" },
  f\u00E4ngt: { an: "anfangen" },
  fange: { an: "anfangen" },
  fing: { an: "anfangen" },
  steht: { auf: "aufstehen", fest: "feststehen" },
  kommt: { an: "ankommen", mit: "mitkommen", zur\u00FCck: "zur\xFCckkommen" },
  h\u00F6rt: { auf: "aufh\xF6ren", zu: "zuh\xF6ren" },
  macht: { auf: "aufmachen", zu: "zumachen", mit: "mitmachen" }
};
function normalizeWord(word, lang) {
  const trimmed = word.trim();
  if (!trimmed) return "";
  if (lang === "zh" || lang === "yue" || lang === "ja" || lang === "ko" || lang === "th") {
    return trimmed;
  }
  if (lang === "de") {
    return trimmed;
  }
  if (lang === "ar") {
    return trimmed.replace(/[\u064B-\u065F\u0670]/g, "");
  }
  return trimmed.toLowerCase();
}
function analyzeKoreanParts(surface, knownSet) {
  if (surface.length < 2 || !/[\uac00-\ud7af]/.test(surface)) return null;
  for (const [particle, role] of KO_PARTICLES) {
    if (surface.endsWith(particle) && surface.length > particle.length) {
      const stem = surface.slice(0, surface.length - particle.length);
      if (!knownSet || knownSet.has(stem) || stem.length >= 1) {
        return {
          stem,
          parts: [
            { part: stem, role: "word stem" },
            { part: particle, role }
          ]
        };
      }
    }
  }
  if (surface.endsWith("\uD574\uC694") && surface.length > 2) {
    const noun = surface.slice(0, -2);
    return {
      stem: `${noun}\uD558\uB2E4`,
      parts: [
        { part: noun, role: "verbal noun" },
        { part: "\uD574\uC694", role: "polite present of \uD558\uB2E4 (to do)" }
      ]
    };
  }
  return null;
}
function analyzeJapaneseParts(surface, dictLemmas) {
  for (const [ending, rep, role] of JA_INFLECTIONS) {
    if (surface.endsWith(ending) && surface.length > ending.length) {
      const prefix = surface.slice(0, surface.length - ending.length);
      const candidate = prefix + rep;
      if (!dictLemmas || dictLemmas.has(candidate)) {
        return {
          lemma: candidate,
          parts: [
            { part: candidate, role: "dictionary form" },
            { part: ending, role }
          ]
        };
      }
    }
  }
  return null;
}
function hiraganaToKatakana(str) {
  return str.replace(/[\u3041-\u3096]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 96));
}
var HIRA_ROMAJI = {
  \u304D\u3083: "kya",
  \u304D\u3085: "kyu",
  \u304D\u3087: "kyo",
  \u3057\u3083: "sha",
  \u3057\u3085: "shu",
  \u3057\u3087: "sho",
  \u3061\u3083: "cha",
  \u3061\u3085: "chu",
  \u3061\u3087: "cho",
  \u306B\u3083: "nya",
  \u306B\u3085: "nyu",
  \u306B\u3087: "nyo",
  \u3072\u3083: "hya",
  \u3072\u3085: "hyu",
  \u3072\u3087: "hyo",
  \u307F\u3083: "mya",
  \u307F\u3085: "myu",
  \u307F\u3087: "myo",
  \u308A\u3083: "rya",
  \u308A\u3085: "ryu",
  \u308A\u3087: "ryo",
  \u304E\u3083: "gya",
  \u304E\u3085: "gyu",
  \u304E\u3087: "gyo",
  \u3058\u3083: "ja",
  \u3058\u3085: "ju",
  \u3058\u3087: "jo",
  \u3073\u3083: "bya",
  \u3073\u3085: "byu",
  \u3073\u3087: "byo",
  \u3074\u3083: "pya",
  \u3074\u3085: "pyu",
  \u3074\u3087: "pyo",
  \u3042: "a",
  \u3044: "i",
  \u3046: "u",
  \u3048: "e",
  \u304A: "o",
  \u304B: "ka",
  \u304D: "ki",
  \u304F: "ku",
  \u3051: "ke",
  \u3053: "ko",
  \u3055: "sa",
  \u3057: "shi",
  \u3059: "su",
  \u305B: "se",
  \u305D: "so",
  \u305F: "ta",
  \u3061: "chi",
  \u3064: "tsu",
  \u3066: "te",
  \u3068: "to",
  \u306A: "na",
  \u306B: "ni",
  \u306C: "nu",
  \u306D: "ne",
  \u306E: "no",
  \u306F: "ha",
  \u3072: "hi",
  \u3075: "fu",
  \u3078: "he",
  \u307B: "ho",
  \u307E: "ma",
  \u307F: "mi",
  \u3080: "mu",
  \u3081: "me",
  \u3082: "mo",
  \u3084: "ya",
  \u3086: "yu",
  \u3088: "yo",
  \u3089: "ra",
  \u308A: "ri",
  \u308B: "ru",
  \u308C: "re",
  \u308D: "ro",
  \u308F: "wa",
  \u3092: "o",
  \u3093: "n",
  \u304C: "ga",
  \u304E: "gi",
  \u3050: "gu",
  \u3052: "ge",
  \u3054: "go",
  \u3056: "za",
  \u3058: "ji",
  \u305A: "zu",
  \u305C: "ze",
  \u305E: "zo",
  \u3060: "da",
  \u3062: "ji",
  \u3065: "zu",
  \u3067: "de",
  \u3069: "do",
  \u3070: "ba",
  \u3073: "bi",
  \u3076: "bu",
  \u3079: "be",
  \u307C: "bo",
  \u3071: "pa",
  \u3074: "pi",
  \u3077: "pu",
  \u307A: "pe",
  \u307D: "po",
  \u30FC: "-"
};
function kanaToRomaji(input) {
  const hira = input.replace(/[\u30a1-\u30f6]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 96));
  let out = "";
  for (let i = 0; i < hira.length; i++) {
    if (hira[i] === "\u3063" && i + 1 < hira.length) {
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
var KO_INIT = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
var KO_MED = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
var KO_FIN = ["", "k", "k", "ks", "n", "nj", "nh", "t", "l", "lk", "lm", "lb", "ls", "lt", "lp", "lh", "m", "p", "ps", "t", "t", "ng", "t", "t", "k", "t", "p", "t"];
var KO_FIN_LIAISON = { 1: "g", 4: "n", 7: "d", 8: "r", 16: "m", 17: "b", 19: "s", 21: "ng", 22: "j", 23: "ch", 24: "k", 25: "t", 26: "p" };
function romanizeKorean(word) {
  const syllables = [];
  let carryConsonant = "";
  for (let i = 0; i < word.length; i++) {
    const code = word.charCodeAt(i);
    if (code >= 44032 && code <= 55203) {
      const offset = code - 44032;
      const initIdx = Math.floor(offset / 588);
      const medIdx = Math.floor(offset % 588 / 28);
      const finIdx = offset % 28;
      let init = KO_INIT[initIdx];
      if (initIdx === 11 && carryConsonant) {
        init = carryConsonant;
        if (syllables.length > 0) {
          syllables[syllables.length - 1] = syllables[syllables.length - 1].replace(/(k|t|p|l)$/, "");
        }
      }
      carryConsonant = "";
      if (finIdx > 0 && i + 1 < word.length) {
        const nextCode = word.charCodeAt(i + 1);
        if (nextCode >= 44032 && nextCode <= 55203) {
          const nextInit = Math.floor((nextCode - 44032) / 588);
          if (nextInit === 11 && KO_FIN_LIAISON[finIdx]) {
            carryConsonant = KO_FIN_LIAISON[finIdx];
          }
        }
      }
      syllables.push(init + KO_MED[medIdx] + (carryConsonant ? "" : KO_FIN[finIdx]));
    } else {
      carryConsonant = "";
      syllables.push(word[i]);
    }
  }
  return syllables.join("\xB7");
}
var AR_TRANSLIT = {
  \u0627: "\u0101",
  \u0623: "a",
  \u0625: "i",
  \u0622: "\u02BE\u0101",
  \u0628: "b",
  \u062A: "t",
  \u062B: "th",
  \u062C: "j",
  \u062D: "\u1E25",
  \u062E: "kh",
  \u062F: "d",
  \u0630: "dh",
  \u0631: "r",
  \u0632: "z",
  \u0633: "s",
  \u0634: "sh",
  \u0635: "\u1E63",
  \u0636: "\u1E0D",
  \u0637: "\u1E6D",
  \u0638: "\u1E93",
  \u0639: "\u02BF",
  \u063A: "gh",
  \u0641: "f",
  \u0642: "q",
  \u0643: "k",
  \u0644: "l",
  \u0645: "m",
  \u0646: "n",
  \u0647: "h",
  \u0648: "w",
  \u064A: "y",
  \u0649: "\u0101",
  \u0629: "a",
  \u0621: "\u02BE"
};
function transliterateArabic(word) {
  const clean = normalizeWord(word, "ar");
  if (clean.startsWith("\u0648\u0627\u0644") && clean.length > 3) {
    return "wa-l-" + transliterateArabic(clean.slice(3));
  }
  if (clean.startsWith("\u0627\u0644") && clean.length > 2) {
    return "al-" + transliterateArabic(clean.slice(2));
  }
  return Array.from(clean).map((ch) => AR_TRANSLIT[ch] ?? ch).join("");
}
function formatWordReading(surface, lang, notation, entryReading, entryReading2) {
  if (lang === "zh") {
    const r = notation === "zhuyin" ? entryReading2 || entryReading : entryReading;
    return r ? { reading: r } : null;
  }
  if (lang === "yue") {
    const r = notation === "yale" ? entryReading2 || entryReading : entryReading;
    return r ? { reading: r } : null;
  }
  if (lang === "ja") {
    if (!entryReading) return null;
    if (notation === "romaji") {
      return { reading: entryReading2 || kanaToRomaji(entryReading) };
    }
    if (!/[\u4e00-\u9fff]/.test(surface)) return null;
    let sEnd = surface.length;
    let rEnd = entryReading.length;
    while (sEnd > 0 && rEnd > 0 && surface[sEnd - 1] === entryReading[rEnd - 1] && /[\u3040-\u309f]/.test(surface[sEnd - 1])) {
      sEnd--;
      rEnd--;
    }
    const kanjiStem = surface.slice(0, sEnd);
    const okurigana = surface.slice(sEnd);
    const stemReading = entryReading.slice(0, rEnd);
    const formatted = notation === "katakana" ? hiraganaToKatakana(stemReading) : stemReading;
    return { reading: formatted, kanjiStem, okurigana };
  }
  if (lang === "ko") {
    return { reading: entryReading || romanizeKorean(surface) };
  }
  if (lang === "th") {
    return entryReading ? { reading: entryReading } : null;
  }
  if (lang === "ar") {
    return { reading: entryReading || transliterateArabic(surface) };
  }
  return null;
}
var segmenterCache = /* @__PURE__ */ new Map();
function getIntlSegmenter(lang) {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter === "undefined") return null;
  let seg = segmenterCache.get(lang);
  if (!seg) {
    try {
      const locale = lang === "yue" ? "zh-Hant-HK" : lang;
      seg = new Intl.Segmenter(locale, { granularity: "word" });
      segmenterCache.set(lang, seg);
    } catch {
      return null;
    }
  }
  return seg;
}
var WORD_CHAR_RE = /[\p{L}\p{M}]/u;
function segmentText(text, lang, lexiconSet = /* @__PURE__ */ new Set(), phrasesSet = /* @__PURE__ */ new Set()) {
  if (!text) return [];
  const meta = LANG_MAP[lang];
  if (meta?.spaceless) {
    const out = [];
    const maxLen = 8;
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (!WORD_CHAR_RE.test(ch) || /\d/.test(ch)) {
        let j = i + 1;
        while (j < text.length && (!WORD_CHAR_RE.test(text[j]) || /\d/.test(text[j]))) j++;
        out.push({ text: text.slice(i, j), isWord: false, normalized: "" });
        i = j;
        continue;
      }
      let matched = "";
      const limit = Math.min(maxLen, text.length - i);
      for (let len = limit; len >= 2; len--) {
        const sub = text.slice(i, i + len);
        if (phrasesSet.has(sub) || lexiconSet.has(sub)) {
          matched = sub;
          break;
        }
        if (lang === "ja") {
          const jaParts = analyzeJapaneseParts(sub, lexiconSet);
          if (jaParts) {
            matched = sub;
            out.push({
              text: sub,
              isWord: true,
              normalized: sub,
              lemmaHint: jaParts.lemma
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
      let runEnd = i + 1;
      while (runEnd < text.length && WORD_CHAR_RE.test(text[runEnd]) && !/\d/.test(text[runEnd])) {
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
          const jaInf = lang === "ja" && isW ? analyzeJapaneseParts(part.segment, lexiconSet) : null;
          out.push({
            text: part.segment,
            isWord: isW,
            normalized: isW ? part.segment : "",
            ...jaInf ? { lemmaHint: jaInf.lemma } : {}
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
  const rawParts = text.match(/[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*|[^\p{L}\p{M}]+/gu) || [text];
  const baseTokens = rawParts.map((part) => {
    const isWord = WORD_CHAR_RE.test(part[0]);
    if (!isWord) return { text: part, isWord: false, normalized: "" };
    return {
      text: part,
      isWord: true,
      normalized: normalizeWord(part, lang)
    };
  });
  const expanded = [];
  for (const tok of baseTokens) {
    if (tok.isWord && (lang === "it" || lang === "fr") && /['’]/.test(tok.text)) {
      const idx = tok.text.search(/['’]/);
      const left = tok.text.slice(0, idx);
      const apos = tok.text[idx];
      const right = tok.text.slice(idx + 1);
      if (left && right) {
        expanded.push({ text: left, isWord: true, normalized: normalizeWord(left, lang) });
        expanded.push({ text: apos, isWord: false, normalized: "" });
        expanded.push({ text: right, isWord: true, normalized: normalizeWord(right, lang) });
        continue;
      }
    }
    if (tok.isWord && lang === "ko") {
      const ko = analyzeKoreanParts(tok.text, lexiconSet);
      if (ko) {
        expanded.push({ ...tok, lemmaHint: ko.stem });
        continue;
      }
    }
    expanded.push(tok);
  }
  if (phrasesSet.size > 0 || lang === "vi") {
    const merged = [];
    let idx = 0;
    while (idx < expanded.length) {
      if (!expanded[idx].isWord) {
        merged.push(expanded[idx]);
        idx++;
        continue;
      }
      let bestEndIdx = -1;
      let bestText = "";
      let bestNorm = "";
      let wordCount = 1;
      let accumText = expanded[idx].text;
      for (let j = idx + 1; j < expanded.length && wordCount < 12; j++) {
        const t = expanded[j];
        if (!t.isWord && !/^\s+$/.test(t.text)) break;
        accumText += t.text;
        if (t.isWord) {
          wordCount++;
          const normCandidate = normalizeWord(accumText.replace(/\s+/g, " "), lang);
          const rawCandidate = accumText.replace(/\s+/g, " ");
          if (phrasesSet.has(normCandidate) || phrasesSet.has(rawCandidate) || lang === "vi" && (lexiconSet.has(normCandidate) || lexiconSet.has(rawCandidate))) {
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
function applyGermanSeparableVerbs(tokens, lang) {
  if (lang !== "de") return;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.isWord) continue;
    const lower = t.text.toLowerCase();
    const map = DE_SEPARABLE_VERBS[lower];
    if (!map) continue;
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

// src/shared/diglot.ts
var FUNCTION_POS = /* @__PURE__ */ new Set(["art.", "prep.", "conj.", "part.", "pron.", "prop."]);
var AMBIGUOUS_ENGLISH_GLOSSES = /* @__PURE__ */ new Set([
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "into",
  "on",
  "upon",
  "at",
  "by",
  "for",
  "with",
  "from",
  "about",
  "and",
  "or",
  "but",
  "not",
  "no",
  "yes",
  "that",
  "this",
  "these",
  "those",
  "which",
  "who",
  "what",
  "be",
  "is",
  "am",
  "are",
  "was",
  "were",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "make",
  "go",
  "come",
  "get",
  "take",
  "put",
  "give",
  "say",
  "tell",
  "see",
  "know",
  "can",
  "will",
  "would",
  "should",
  "may",
  "might",
  "all",
  "whole",
  "other",
  "another",
  "else",
  "same",
  "self",
  "very",
  "much",
  "lot",
  "more",
  "most",
  "some",
  "any",
  "one",
  "two",
  "still",
  "yet",
  "again",
  "well",
  "then",
  "way",
  "manner",
  "part",
  "case",
  "point",
  "state",
  "fact",
  "thing"
]);
function posPriority(pos) {
  if (!pos) return 3;
  if (pos.startsWith("n")) return 1;
  if (pos.startsWith("adj")) return 2;
  if (pos.startsWith("adv")) return 3;
  if (pos.startsWith("v")) return 4;
  return 5;
}
function buildEnglishGlossIndex(entries) {
  const byGloss = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!entry.w || !entry.m || entry.m.length === 0) continue;
    if (entry.special === "name" || entry.special === "place") continue;
    if (entry.pos && FUNCTION_POS.has(entry.pos)) continue;
    if (/vocabulary item #\d+/i.test(entry.m[0] || "")) continue;
    for (const rawM of entry.m) {
      const stripped = rawM.replace(/\([^)]*\)/g, " ");
      const parts = stripped.split(/[;,/]/);
      for (const part of parts) {
        let cleaned = part.trim().toLowerCase();
        if (cleaned.startsWith("to ") && entry.pos?.startsWith("v")) {
          cleaned = cleaned.slice(3).trim();
        } else if (cleaned.startsWith("the ")) {
          cleaned = cleaned.slice(4).trim();
        } else if (cleaned.startsWith("a ") || cleaned.startsWith("an ")) {
          cleaned = cleaned.replace(/^an?\s+/, "").trim();
        }
        if (!/^[a-z]{3,24}$/.test(cleaned)) continue;
        if (AMBIGUOUS_ENGLISH_GLOSSES.has(cleaned)) continue;
        if (entry.pos?.startsWith("v") && cleaned.length < 4) continue;
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
function matchEnglishTokenToTarget(rawToken, dictIndex) {
  if (!rawToken || rawToken.length < 3 || !/^[A-Za-z]+$/.test(rawToken)) return null;
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
      candidates: direct
    };
  }
  if (lower.length >= 4 && lower.endsWith("s") && !lower.endsWith("ss") && !lower.endsWith("us") && !lower.endsWith("is")) {
    const singularCandidates = [];
    if (lower.endsWith("ies") && lower.length >= 5) {
      singularCandidates.push(lower.slice(0, -3) + "y");
    }
    if (lower.endsWith("es") && lower.length >= 5) {
      singularCandidates.push(lower.slice(0, -2));
      singularCandidates.push(lower.slice(0, -1));
    }
    singularCandidates.push(lower.slice(0, -1));
    for (const sing of singularCandidates) {
      if (AMBIGUOUS_ENGLISH_GLOSSES.has(sing)) continue;
      const entries = dictIndex.byEnglishGloss.get(sing);
      if (entries && entries.length > 0) {
        const nounEntries = entries.filter((e) => !e.pos || e.pos.startsWith("n"));
        if (nounEntries.length > 0) {
          return {
            lemma: sing,
            isPlural: true,
            isCapitalized,
            candidates: nounEntries
          };
        }
      }
    }
  }
  return null;
}
function selectBestDiglotEntry(candidates, wordMap, settings) {
  const pool = settings.inlineReplacementPool || "learning_and_new";
  const maxRank = settings.inlineReplacementMaxRank || 3e3;
  const eligible = [];
  for (const entry of candidates) {
    const rec = wordMap.get(entry.w);
    const status = rec && !rec.deleted ? rec.status : 0;
    if (status === -1) continue;
    if (pool === "learning_only" && !(status >= 1 && status <= 4)) continue;
    if (pool === "learning_and_new" && status === 5) continue;
    if (status === 0 && maxRank > 0 && entry.rank && entry.rank > maxRank) {
      continue;
    }
    const learningBoost = status >= 1 && status <= 4 ? 1e4 : 0;
    const nounBoost = entry.pos?.startsWith("n") ? 1e3 : entry.pos?.startsWith("adj") ? 500 : 0;
    const rankScore = Math.max(0, 2e3 - (entry.rank ?? 1e3));
    eligible.push({
      entry,
      status,
      score: learningBoost + nounBoost + rankScore
    });
  }
  if (eligible.length === 0) return null;
  eligible.sort((a, b) => b.score - a.score);
  return { entry: eligible[0].entry, status: eligible[0].status };
}
function formatDiglotTargetSurface(entry, lang, isPlural, isCapitalized) {
  let surface = entry.w;
  if (isPlural && entry.pos?.startsWith("n") && entry.forms && entry.forms.length === 1) {
    surface = entry.forms[0];
  }
  if (isCapitalized && lang !== "de" && /^[a-zà-žа-яіїєґα-ω]/.test(surface)) {
    surface = surface[0].toUpperCase() + surface.slice(1);
  }
  return surface;
}
function weaveDiglotSegment(text, lang, dictIndex, wordMap, settings, pageWovenCounts) {
  if (lang === "en") {
    return [{ isReplaced: false, text }];
  }
  const rawParts = text.split(/([A-Za-z]+(?:'[A-Za-z]+)?)/g);
  const tokens = [];
  const candidateSlots = [];
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
            chosen
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
      status: slot.chosen.status
    };
    lastReplacedWordIdx = slot.wordIdx;
    replacedInBlock++;
    if (pageWovenCounts) {
      pageWovenCounts.set(targetKey, prevPageCount + 1);
    }
  }
  return tokens;
}

// src/shared/dictionary.ts
var indexCache = /* @__PURE__ */ new Map();
function buildLangIndex(dict) {
  const byHeadword = /* @__PURE__ */ new Map();
  const byForm = /* @__PURE__ */ new Map();
  const byAltScript = /* @__PURE__ */ new Map();
  const lexiconSet = /* @__PURE__ */ new Set();
  const addMap = (map, key, entry) => {
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
  const loaded = {
    lang: dict.lang,
    entries: dict.entries,
    byHeadword,
    byForm,
    byAltScript,
    byEnglishGloss,
    byRank,
    lexiconSet,
    chars: dict.chars || {}
  };
  indexCache.set(dict.lang, loaded);
  return loaded;
}
function resolveTrackingKey(surface, lang, idx, countingMode, lemmaHint, lemmaOverrides) {
  const norm = normalizeWord(surface, lang);
  const override = lemmaOverrides?.get(norm) || lemmaOverrides?.get(surface);
  if (override) {
    const ovEntries = idx.byHeadword.get(override) || idx.byHeadword.get(override.toLowerCase());
    return {
      key: countingMode === "surface" ? norm : override,
      lemma: override,
      primaryEntry: ovEntries?.[0]
    };
  }
  if (lemmaHint) {
    const hintEntries = idx.byHeadword.get(lemmaHint) || idx.byHeadword.get(lemmaHint.toLowerCase());
    if (hintEntries?.length) {
      return {
        key: countingMode === "surface" ? norm : hintEntries[0].w,
        lemma: hintEntries[0].w,
        primaryEntry: hintEntries[0]
      };
    }
  }
  const direct = idx.byHeadword.get(surface) || idx.byHeadword.get(norm) || idx.byHeadword.get(surface.toLowerCase());
  const altMatch = idx.byAltScript.get(surface);
  const formMatch = idx.byForm.get(surface) || idx.byForm.get(norm) || idx.byForm.get(surface.toLowerCase());
  if (direct?.length) {
    return {
      key: countingMode === "surface" ? norm : direct[0].w,
      lemma: direct[0].w,
      primaryEntry: direct[0]
    };
  }
  if (altMatch?.length) {
    return {
      key: surface,
      lemma: surface,
      primaryEntry: altMatch[0]
    };
  }
  if (formMatch?.length) {
    return {
      key: countingMode === "surface" ? norm : formMatch[0].w,
      lemma: formMatch[0].w,
      primaryEntry: formMatch[0]
    };
  }
  if (lang === "ko") {
    const ko = analyzeKoreanParts(surface, idx.lexiconSet);
    if (ko) {
      const stemEntries = idx.byHeadword.get(ko.stem);
      return {
        key: countingMode === "surface" ? norm : ko.stem,
        lemma: ko.stem,
        primaryEntry: stemEntries?.[0]
      };
    }
  }
  if (lang === "ja") {
    const ja = analyzeJapaneseParts(surface, idx.lexiconSet);
    if (ja) {
      const stemEntries = idx.byHeadword.get(ja.lemma);
      return {
        key: countingMode === "surface" ? norm : ja.lemma,
        lemma: ja.lemma,
        primaryEntry: stemEntries?.[0]
      };
    }
  }
  return { key: norm || surface, lemma: norm || surface };
}
function formatOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n.toLocaleString("en-US") + (s[(v - 20) % 10] || s[v] || s[0]);
}

// src/shared/imports.ts
function parseTimestampSec(ts) {
  const clean = ts.trim().replace(",", ".");
  const parts = clean.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(clean) || 0;
}
function parseSubtitleFile(raw, extHint = "srt") {
  const text = raw.replace(/^\uFEFF/, "");
  if (extHint.toLowerCase().endsWith("ass") || text.includes("[Events]")) {
    const cues2 = [];
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith("Dialogue:")) {
        const parts = l.slice(9).split(",");
        if (parts.length >= 10) {
          const start = parseTimestampSec(parts[1]);
          const end = parseTimestampSec(parts[2]);
          const body = parts.slice(9).join(",").replace(/\{[^}]*\}/g, "").replace(/\\N/gi, " ").trim();
          if (body) cues2.push({ id: `ass_${cues2.length}`, start, end, text: body });
        }
      }
    }
    return cues2;
  }
  const blocks = text.replace(/^WEBVTT[^\n]*\n+/i, "").split(/\r?\n\r?\n+/);
  const cues = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const timeLineIdx = lines.findIndex((l) => l.includes("-->"));
    if (timeLineIdx === -1) continue;
    const [startStr, endPart] = lines[timeLineIdx].split("-->");
    const endStr = endPart.trim().split(/\s+/)[0];
    const body = lines.slice(timeLineIdx + 1).join(" ").replace(/<[^>]+>/g, "").trim();
    if (!body) continue;
    cues.push({
      id: `cue_${cues.length}`,
      start: parseTimestampSec(startStr),
      end: parseTimestampSec(endStr),
      text: body
    });
  }
  return cues;
}

// src/shared/messaging.ts
async function sendBgMessage(msg) {
  return sendRuntimeMessage(msg);
}

// src/shared/tts.ts
var audioBlobCache = /* @__PURE__ */ new Map();
var activeAudio = null;
function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
}
async function speakText(text, lang, settings, onEnd) {
  const clean = text.trim();
  if (!clean) {
    onEnd?.();
    return;
  }
  stopSpeaking();
  const cacheKey = `${settings.voiceBackend}:${lang}:${clean}`;
  const cachedUrl = audioBlobCache.get(cacheKey);
  if (cachedUrl) {
    return playAudioUrl(cachedUrl, settings.voiceSpeed, settings.voiceVolume, onEnd);
  }
  if (settings.voiceBackend === "local_server" && settings.localVoiceServerUrl) {
    try {
      const base = settings.localVoiceServerUrl.replace(/\/+$/, "");
      const res = await fetch(`${base}/v1/audio/speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "kokoro",
          input: clean,
          voice: "af_heart",
          speed: settings.voiceSpeed
        })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioBlobCache.set(cacheKey, url);
        return playAudioUrl(url, 1, settings.voiceVolume, onEnd);
      }
    } catch {
    }
  }
  if (settings.voiceBackend === "cloud" && settings.cloudVoiceApiKey) {
    try {
      if (settings.cloudVoiceProvider === "openai") {
        const res = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${settings.cloudVoiceApiKey}`
          },
          body: JSON.stringify({
            model: "tts-1",
            voice: "alloy",
            input: clean,
            speed: settings.voiceSpeed
          })
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          audioBlobCache.set(cacheKey, url);
          return playAudioUrl(url, 1, settings.voiceVolume, onEnd);
        }
      } else if (settings.cloudVoiceProvider === "elevenlabs") {
        const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": settings.cloudVoiceApiKey
          },
          body: JSON.stringify({
            text: clean,
            model_id: "eleven_multilingual_v2"
          })
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          audioBlobCache.set(cacheKey, url);
          return playAudioUrl(url, settings.voiceSpeed, settings.voiceVolume, onEnd);
        }
      } else if (settings.cloudVoiceProvider === "google") {
        const locale = LANG_MAP[lang]?.speechLocale || lang;
        const res = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(settings.cloudVoiceApiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: { text: clean },
              voice: { languageCode: locale },
              audioConfig: { audioEncoding: "MP3", speakingRate: settings.voiceSpeed }
            })
          }
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.audioContent) {
            const url = `data:audio/mp3;base64,${data.audioContent}`;
            audioBlobCache.set(cacheKey, url);
            return playAudioUrl(url, 1, settings.voiceVolume, onEnd);
          }
        }
      }
    } catch {
    }
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    return new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(clean);
      const locale = LANG_MAP[lang]?.speechLocale || lang;
      utter.lang = locale;
      utter.rate = Math.max(0.5, Math.min(2, settings.voiceSpeed));
      utter.volume = Math.max(0, Math.min(1, settings.voiceVolume));
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang.toLowerCase().startsWith(locale.toLowerCase().split("-")[0]));
      if (match) utter.voice = match;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        onEnd?.();
        resolve();
      };
      utter.onend = finish;
      utter.onerror = finish;
      setTimeout(finish, Math.max(900, clean.length * 110));
      window.speechSynthesis.speak(utter);
    });
  }
  onEnd?.();
}
function playAudioUrl(url, speed, volume, onEnd) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    activeAudio = audio;
    audio.playbackRate = speed;
    audio.volume = volume;
    const finish = () => {
      if (activeAudio === audio) activeAudio = null;
      onEnd?.();
      resolve();
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  });
}

// src/content/styles.ts
function hexToRgbTuple(hex, fallback = "56 189 248") {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return `${r} ${g} ${b}`;
    }
  }
  return fallback;
}
function darkenHexRgb(hex, factor = 0.75) {
  const parts = hexToRgbTuple(hex, "245 158 11").split(" ").map(Number);
  return parts.map((v) => Math.max(0, Math.round(v * factor))).join(" ");
}
function buildPageHighlightStyles(settings) {
  const s = settings.highlightStrength || 1;
  const newRgb = hexToRgbTuple(settings.colors.newWord, "56 189 248");
  const learnRgb = hexToRgbTuple(settings.colors.learning, "245 158 11");
  const learnLineRgb = darkenHexRgb(settings.colors.learning, 0.75);
  const crossRgb = hexToRgbTuple(settings.colors.crossScript, "16 185 129");
  const selRgb = hexToRgbTuple(settings.colors.selectedPhrase, "249 115 22");
  const selLineRgb = darkenHexRgb(settings.colors.selectedPhrase, 0.75);
  const specRgb = hexToRgbTuple(settings.colors.specialWord, "168 85 247");
  const hideColors = !settings.highlightWords;
  const ulOnly = settings.underlineInsteadOfFill;
  return `
verba-w {
  display: inline;
  border-radius: 3px;
  padding: 0 1px;
  margin: 0 -1px;
  cursor: pointer;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  transition: background-color 0.12s ease, box-shadow 0.12s ease;
  position: relative;
}
${hideColors ? `verba-w[data-s] { background-color: transparent !important; box-shadow: none !important; }` : ulOnly ? `
verba-w[data-s="0"] { box-shadow: inset 0 -2px 0 rgb(${newRgb} / ${Math.min(1, 0.65 * s).toFixed(2)}); }
verba-w[data-s="1"] { box-shadow: inset 0 -2.5px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.95 * s).toFixed(2)}); }
verba-w[data-s="2"] { box-shadow: inset 0 -2px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.75 * s).toFixed(2)}); }
verba-w[data-s="3"] { box-shadow: inset 0 -1.5px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.55 * s).toFixed(2)}); }
verba-w[data-s="4"] { box-shadow: inset 0 -1px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.4 * s).toFixed(2)}); }
verba-w[data-s="green"] { box-shadow: inset 0 -2px 0 rgb(${crossRgb} / 0.75); }
verba-w[data-s="special"] { box-shadow: inset 0 -2px 0 rgb(${specRgb} / 0.6); }
` : `
verba-w[data-s="0"] { background-color: rgb(${newRgb} / ${Math.min(0.6, 0.2 * s).toFixed(2)}); }
verba-w[data-s="1"] { background-color: rgb(${learnRgb} / ${Math.min(0.9, 0.6 * s).toFixed(2)}); }
verba-w[data-s="2"] { background-color: rgb(${learnRgb} / ${Math.min(0.8, 0.4 * s).toFixed(2)}); }
verba-w[data-s="3"] { background-color: rgb(${learnRgb} / ${Math.min(0.6, 0.24 * s).toFixed(2)}); box-shadow: inset 0 -2px 0 rgb(${learnLineRgb}); }
verba-w[data-s="4"] { background-color: transparent; box-shadow: inset 0 -2px 0 rgb(${learnLineRgb}); }
verba-w[data-s="green"] { background-color: rgb(${crossRgb} / 0.26); }
verba-w[data-s="special"] { background-color: rgb(${specRgb} / 0.20); }
`}
verba-w[data-s="5"], verba-w[data-s="-1"] {
  background-color: transparent;
  box-shadow: none;
}
verba-w[data-pinned="1"], verba-w:hover {
  outline: 1px solid rgb(56 189 248 / 0.55);
}
verba-w[data-selected="1"] {
  background-color: rgb(${selRgb} / 0.35) !important;
  box-shadow: inset 0 -2px 0 rgb(${selLineRgb}) !important;
}
verba-w[data-freq-ring="1"] {
  outline: 2px solid #eab308 !important;
  outline-offset: 2px;
  border-radius: 4px;
}
verba-w[data-speaking="1"] {
  background-color: rgb(56 189 248 / 0.38) !important;
  box-shadow: inset 0 -2px 0 #38bdf8 !important;
}
verba-w ruby.verba-ruby {
  ruby-position: over;
}
verba-w ruby.verba-ruby > rt {
  font-size: 0.58em;
  line-height: 1.1;
  color: inherit;
  opacity: 0.78;
  font-weight: 400;
  user-select: none;
}
verba-w[data-diglot="1"] {
  border-bottom: 1.5px dashed rgb(16 185 129 / 0.8);
  padding: 0 2px;
}
${settings.inlineReplacementShowHint ? `
verba-w[data-diglot="1"][data-orig]::after {
  content: " \xB7 " attr(data-orig);
  font-size: 0.74em;
  opacity: 0.68;
  font-weight: 400;
  user-select: none;
}
` : ""}
[data-verba-reading-sentence="1"] {
  text-decoration: underline;
  text-decoration-color: #38bdf8;
  text-underline-offset: 4px;
}
`;
}
var SHADOW_UI_CSS = `
:host {
  all: initial;
  --bg: #0f172a;
  --surface-1: #162032;
  --surface-2: #1e293b;
  --field: #0b1120;
  --fill-hover: rgb(241 245 249 / .07);
  --fill-selected: rgb(241 245 249 / .11);
  --fill-press: rgb(241 245 249 / .15);
  --control-thumb: #475569;
  --ink: #f1f5f9;
  --body: #cbd5e1;
  --ink-2: #94a3b8;
  --ink-3: #64748b;
  --border-subtle: rgb(255 255 255 / .08);
  --border: #334155;
  --border-control: #475569;
  --primary: #38bdf8;
  --primary-hover: #7dd3fc;
  --on-primary: #082f49;
  --focus: #38bdf8;
  --blue: #38bdf8;
  --amber: #f59e0b;
  --green: #10b981;
  --red: #f43f5e;
  --serif: "Iowan Old Style", "Charter", Georgia, serif;
  --sans: system-ui, -apple-system, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace;
  font-family: var(--sans);
  color: var(--body);
}

*, *::before, *::after {
  box-sizing: border-box;
}

kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border: 1px solid var(--border);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--ink);
  font: 500 11px/1 var(--mono);
}

button {
  font-family: var(--sans);
  cursor: pointer;
}

/* Counter Island (bottom-right pill) */
.verba-island {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483640;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgb(22 32 50 / .95);
  border: 1px solid var(--border);
  box-shadow: 0 12px 32px rgb(0 0 0 / .45);
  color: var(--body);
  font-size: 12.5px;
  backdrop-filter: blur(10px);
  user-select: none;
}
.verba-island[hidden] { display: none !important; }
.island-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
  padding: 0 7px;
  border: 0;
  border-radius: 999px;
  background: var(--fill-selected);
  color: var(--ink);
  font-size: 12px;
  font-weight: 500;
  transition: background 0.12s;
}
.island-btn:hover { background: var(--fill-press); }
.island-btn.active {
  background: rgb(16 185 129 / .22);
  color: #6ee7b7;
  box-shadow: inset 0 0 0 1px rgb(16 185 129 / .45);
}
.island-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.island-dot.new { background: #3b82f6; }
.island-dot.learn { background: #f7a800; }
.island-dot.diglot { background: #10b981; }
.island-stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}
.island-stat b { color: var(--ink); font-weight: 600; }

.island-tally-drawer {
  position: fixed;
  right: 16px;
  bottom: 60px;
  z-index: 2147483640;
  width: 260px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 18px 40px rgb(0 0 0 / .55);
  color: var(--body);
  font-size: 13px;
}
.island-tally-drawer[hidden] { display: none !important; }
.tally-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: var(--ink-2);
}
.tally-row b { color: var(--ink); }

.auto-switch-note {
  position: fixed;
  right: 16px;
  bottom: 58px;
  z-index: 2147483641;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border-radius: 8px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 10px 28px rgb(0 0 0 / .45);
  font-size: 12.5px;
  color: var(--ink-2);
}

/* Word Panel (Hover & Pinned) */
.verba-panel {
  position: fixed;
  z-index: 2147483645;
  width: 356px;
  max-width: calc(100vw - 20px);
  max-height: min(520px, calc(100vh - 24px));
  overflow-y: auto;
  border-radius: 12px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 0 0 1px rgb(255 255 255 / .08), 0 24px 48px rgb(0 0 0 / .65);
  color: var(--body);
  padding: 13px 15px;
  font-size: 14px;
  line-height: 1.5;
}
.verba-panel[hidden] { display: none !important; }
.verba-panel[data-size="S"] { width: 300px; font-size: 12.5px; padding: 10px 12px; }
.verba-panel[data-size="L"] { width: 410px; font-size: 15.5px; padding: 15px 18px; }
.verba-panel[data-size="XL"] { width: 470px; font-size: 17px; padding: 18px 20px; }

.wp-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.wp-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 7px;
}
.wp-word {
  font-family: var(--serif);
  font-size: 1.45em;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.15;
}
.wp-word[data-gender="m"] { color: #60a5fa; } /* German der = blue */
.wp-word[data-gender="f"] { color: #f87171; } /* German die = red */
.wp-word[data-gender="n"] { color: #4ade80; } /* German das = green */

.wp-alt {
  font-size: 1.05em;
  color: var(--ink-3);
}
.wp-badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--fill-selected);
  color: var(--ink-2);
}
.wp-badge[data-s="0"] { background: rgb(59 130 246 / .22); color: #93c5fd; }
.wp-badge[data-s="1"], .wp-badge[data-s="2"], .wp-badge[data-s="3"], .wp-badge[data-s="4"] {
  background: rgb(247 168 0 / .24);
  color: #fcd34d;
}
.wp-badge[data-s="5"] { background: rgb(34 197 94 / .2); color: #86efac; }

.wp-actions {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}
.wp-icon-btn {
  display: inline-grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ink-2);
  font-size: 13px;
  transition: background 0.12s, color 0.12s;
}
.wp-icon-btn:hover, .wp-icon-btn[aria-expanded="true"] {
  background: var(--fill-selected);
  color: var(--ink);
}

.wp-sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.9em;
  color: var(--ink-2);
}
.wp-diglot-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
  padding: 5px 9px;
  border-radius: 7px;
  background: rgb(16 185 129 / .14);
  border: 1px solid rgb(16 185 129 / .35);
  color: #a7f3d0;
  font-size: 12px;
}
.wp-pitch {
  font-family: var(--mono);
  font-size: 0.82em;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--ink-2);
}
.wp-rank {
  color: var(--ink-3);
  font-size: 0.85em;
}

.wp-tabs {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 6px;
}
.wp-tab {
  height: 25px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ink-3);
  font-size: 12px;
  font-weight: 500;
}
.wp-tab[aria-selected="true"] {
  background: var(--fill-selected);
  color: var(--ink);
}

.wp-meanings {
  margin: 9px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 5px;
}
.wp-meaning-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: var(--body);
}
.wp-tag {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}
.wp-tag.yours { background: rgb(59 130 246 / .22); color: #93c5fd; }
.wp-tag.ai { background: rgb(168 85 247 / .24); color: #d8b4fe; }

.wp-pager {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  font-size: 12px;
  color: var(--ink-3);
}
.wp-section {
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
  font-size: 12.5px;
}
.wp-section-title {
  font-weight: 600;
  color: var(--ink-3);
  font-size: 11.5px;
  margin-bottom: 4px;
}

.wp-custom-box {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}
.wp-input {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 0 9px;
  border: 1px solid var(--border-control);
  border-radius: 6px;
  background: var(--field);
  color: var(--ink);
  font: 400 13px var(--sans);
}
.wp-input:focus {
  outline: 2px solid var(--focus);
  outline-offset: -1px;
}
.wp-btn-sm {
  height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 12.5px;
  font-weight: 600;
}
.wp-btn-ghost {
  height: 28px;
  padding: 0 9px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--ink);
  font-size: 12px;
}
.wp-btn-ghost:hover { background: var(--fill-press); }

.wp-grades {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 4px;
  margin-top: 11px;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
}
.wp-grade-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 11.5px;
  font-weight: 600;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.wp-grade-btn:hover {
  background: var(--fill-press);
  color: var(--ink);
}
.wp-grade-btn[aria-pressed="true"] {
  border-color: var(--focus);
  background: rgb(107 155 255 / .18);
  color: var(--ink);
}
.wp-swatch {
  width: 14px;
  height: 4px;
  border-radius: 2px;
}
.wp-swatch.s1 { background: rgb(247 168 0 / .95); }
.wp-swatch.s2 { background: rgb(247 168 0 / .65); }
.wp-swatch.s3 { background: rgb(247 168 0 / .38); border-bottom: 1.5px solid #b97e00; }
.wp-swatch.s4 { border-bottom: 2px solid #b97e00; }
.wp-swatch.sk { background: #22c55e; }
.wp-swatch.sx { background: #7c7b74; }

.wp-hint-foot {
  margin-top: 7px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: var(--ink-3);
}

/* Reader View Overlay (Shift+L) */
.verba-reader-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483635;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  color: #e2e8f0;
  overflow: hidden;
}
.verba-reader-overlay[hidden] { display: none !important; }
.verba-reader-overlay[data-paper="white"] { background: #ffffff; color: #0f172a; }
.verba-reader-overlay[data-paper="sepia"] { background: #fbf5e6; color: #2b251c; }

.reader-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 50px;
  padding: 0 18px;
  border-bottom: 1px solid rgb(128 128 128 / .2);
  background: inherit;
  flex-shrink: 0;
}
.reader-bar-title {
  font: 600 16px/1 var(--sans);
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.reader-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 40px 24px 100px;
}
.reader-article {
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.78;
}
.reader-article h1 {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 2.1em;
  line-height: 1.15;
  margin: 0 0 24px;
}
.reader-article p { margin: 0 0 1.2em; }
.reader-article img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }

/* Sentence-by-Sentence Card (Shift+S) */
.verba-sentence-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483638;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / .92);
  backdrop-filter: blur(8px);
  padding: 24px;
}
.verba-sentence-modal[hidden] { display: none !important; }
.sentence-card {
  width: min(780px, 100%);
  padding: 36px 40px 28px;
  border-radius: 16px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 24px 64px rgb(0 0 0 / .7);
  color: var(--ink);
}
.sentence-card[data-paper="white"] { background: #ffffff; color: #0f172a; border-color: #d4d4d8; }
.sentence-card[data-paper="sepia"] { background: #fbf5e6; color: #2b251c; border-color: #e4d5b7; }
.sentence-body {
  font-size: 28px;
  line-height: 1.6;
  margin: 18px 0;
  min-height: 90px;
}
.sentence-trans {
  font-size: 17px;
  color: var(--ink-2);
  padding-top: 14px;
  border-top: 1px solid rgb(128 128 128 / .2);
  margin-bottom: 16px;
}
.sentence-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  font-size: 13px;
  color: var(--ink-3);
}

/* Read Aloud Floating Bar (Shift+R) */
.verba-tts-bar {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 2147483642;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 16px 40px rgb(0 0 0 / .6);
  color: var(--ink);
  font-size: 13px;
}
.verba-tts-bar[hidden] { display: none !important; }

/* Ask Your AI Chat Modal (Shift+I) */
.verba-ask-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / .62);
  padding: 20px;
}
.verba-ask-modal[hidden] { display: none !important; }
.ask-box {
  width: min(520px, 100%);
  padding: 22px 24px;
  border-radius: 12px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 24px 48px rgb(0 0 0 / .7);
  color: var(--body);
}
.ask-quote {
  padding: 10px 12px;
  border-left: 2px solid var(--blue);
  background: var(--surface-2);
  border-radius: 4px;
  font-size: 14px;
  color: var(--ink);
  margin: 10px 0 14px;
}
.ask-textarea {
  width: 100%;
  min-height: 76px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-control);
  background: var(--field);
  color: var(--ink);
  font: 400 14px/1.45 var(--sans);
  resize: vertical;
}

/* Verba Dual Captions & Transcript */
.vc-stage {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483630;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: min(88vw, 920px);
  pointer-events: auto;
}
.vc-stage[hidden] { display: none !important; }
.vc-box {
  padding: 10px 18px;
  border-radius: 10px;
  text-align: center;
  color: #f1f5f9;
  box-shadow: 0 8px 28px rgb(0 0 0 / .5);
}
.vc-line {
  font-size: 24px;
  line-height: 1.42;
  font-weight: 500;
}
.vc-line[data-size="S"] { font-size: 18px; }
.vc-line[data-size="L"] { font-size: 30px; }
.vc-line[data-size="XL"] { font-size: 36px; }
.vc-line.blurred { filter: blur(6px); transition: filter 0.15s; }
.vc-line.blurred:hover { filter: none; }

.vc-trans {
  margin-top: 5px;
  font-size: 16px;
  color: #cbd5e1;
  transition: filter 0.15s;
}
.vc-trans[data-size="S"] { font-size: 13px; }
.vc-trans[data-size="L"] { font-size: 20px; }
.vc-trans[data-size="XL"] { font-size: 24px; }
.vc-trans.blurred { filter: blur(5px); cursor: pointer; }
.vc-trans.blurred:hover { filter: none; }

.vc-side-btns {
  display: flex;
  flex-direction: column;
  gap: 3px;
  opacity: 0.35;
  transition: opacity 0.15s;
}
.vc-stage:hover .vc-side-btns { opacity: 1; }
.vc-mini-btn {
  width: 26px;
  height: 24px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: rgb(15 23 42 / .9);
  color: var(--ink);
  font-size: 11px;
  display: grid;
  place-items: center;
}

.vc-pill {
  position: fixed;
  z-index: 2147483632;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgb(22 32 50 / .92);
  border: 1px solid var(--border);
  color: var(--ink);
  font-size: 12px;
  box-shadow: 0 6px 20px rgb(0 0 0 / .45);
}
.vc-pill[hidden] { display: none !important; }

.vc-menu {
  position: fixed;
  z-index: 2147483644;
  width: 310px;
  max-height: 440px;
  overflow-y: auto;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 20px 48px rgb(0 0 0 / .7);
  color: var(--body);
  font-size: 13px;
}
.vc-menu[hidden] { display: none !important; }
.cc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 4px;
  border-bottom: 1px solid var(--border-subtle);
}
.cc-row:last-child { border-bottom: 0; }

.vc-drawer {
  position: fixed;
  top: 64px;
  right: 16px;
  width: 340px;
  max-height: calc(100vh - 140px);
  z-index: 2147483633;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: rgb(22 32 50 / .96);
  border: 1px solid var(--border);
  box-shadow: 0 20px 48px rgb(0 0 0 / .65);
  color: var(--body);
  overflow: hidden;
}
.vc-drawer[hidden] { display: none !important; }
.cc-drawer-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-subtle);
}
.cc-drawer-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.cc-cue-item {
  display: flex;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13.5px;
}
.cc-cue-item:hover { background: var(--fill-hover); }
.cc-cue-item.active { background: rgb(56 189 248 / .18); border-left: 2px solid #38bdf8; }
.cc-cue-time {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-3);
  padding-top: 2px;
  flex-shrink: 0;
}
.vc-toast {
  position: fixed;
  z-index: 2147483644;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgb(22 32 50 / .92);
  border: 1px solid var(--border);
  color: var(--ink);
  font-size: 12px;
  pointer-events: none;
}
.vc-toast[hidden] {
  display: none !important;
}
`;

// src/content/highlighter.ts
var SKIP_TAGS = /* @__PURE__ */ new Set([
  "A",
  "BUTTON",
  "LABEL",
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
  "SVG",
  "MATH",
  "CANVAS",
  "VIDEO",
  "AUDIO",
  "IFRAME",
  "RT",
  "RP",
  "KBD",
  "VERBA-W"
]);
var VerbaHighlighter = class {
  styleEl = null;
  observer = null;
  mutationTimer = null;
  readingTimer = null;
  lastUserActivityAt = Date.now();
  observedParagraphs = /* @__PURE__ */ new WeakSet();
  paragraphTimers = /* @__PURE__ */ new Map();
  io = null;
  lang;
  settings;
  langOpts;
  dictIndex;
  wordMap = /* @__PURE__ */ new Map();
  customDicts = [];
  diglotMode = false;
  onCountsChanged;
  rootContainer;
  isBookOrReader;
  constructor(params) {
    this.lang = params.lang;
    this.settings = params.settings;
    this.langOpts = params.langOpts;
    this.dictIndex = params.dictIndex;
    this.customDicts = params.customDicts || [];
    this.rootContainer = params.rootContainer || document.body;
    this.isBookOrReader = Boolean(params.isBookOrReader);
    this.diglotMode = Boolean(params.diglotMode);
    this.onCountsChanged = params.onCountsChanged;
    this.setWords(params.words);
  }
  setWords(words) {
    this.wordMap.clear();
    for (const w of words) {
      if (!w.deleted) {
        this.wordMap.set(w.word, w);
      }
    }
  }
  injectStyles(targetDoc = document) {
    if (!this.styleEl) {
      this.styleEl = document.createElement("style");
      this.styleEl.id = "verba-highlight-styles";
      if (targetDoc instanceof Document) {
        (targetDoc.head || targetDoc.documentElement).appendChild(this.styleEl);
      } else {
        targetDoc.appendChild(this.styleEl);
      }
    }
    this.styleEl.textContent = buildPageHighlightStyles(this.settings);
  }
  getPhrasesAndCustomLexicon() {
    const lexicon = new Set(this.dictIndex.lexiconSet);
    const phrases = /* @__PURE__ */ new Set();
    const overrides = /* @__PURE__ */ new Map();
    for (const w of this.wordMap.values()) {
      if (w.lemmaOverride) overrides.set(w.word, w.lemmaOverride);
      if (w.isCustomSegment) {
        lexicon.add(w.word);
        phrases.add(w.word);
      } else if (w.isPhrase) {
        phrases.add(w.word);
      }
    }
    return { lexicon, phrases, overrides };
  }
  computeStatusAttr(key, surface, lemmaHint) {
    const { overrides } = this.getPhrasesAndCustomLexicon();
    const resolved = resolveTrackingKey(
      surface,
      this.lang,
      this.dictIndex,
      this.langOpts.countingMode,
      lemmaHint,
      overrides
    );
    const rec = this.wordMap.get(key) || this.wordMap.get(resolved.key) || this.wordMap.get(surface);
    const entry = resolved.primaryEntry;
    let statusNum = rec ? rec.status : 0;
    let statusAttr = String(statusNum);
    if (statusNum === 0) {
      if ((this.lang === "zh" || this.lang === "yue") && this.langOpts.unifyScripts && entry) {
        const alt = entry.w === surface ? entry.alt : entry.w;
        if (alt && alt !== surface && this.wordMap.get(alt)?.status === 5) {
          statusAttr = "green";
        }
      }
      if (statusAttr === "0" && this.settings.specialWordsHighlight && entry?.special) {
        statusAttr = "special";
      }
      if (statusAttr === "0" && this.settings.vocabBandFilter && this.settings.vocabBandFilter !== "all") {
        const limit = Number(this.settings.vocabBandFilter.replace("top", ""));
        if (limit > 0 && (!entry?.rank || entry.rank > limit)) {
          statusAttr = "band_muted";
        }
      }
    }
    let readingHtml;
    if (this.langOpts.readingsEnabled) {
      const scope = this.langOpts.readingScope;
      const shouldAnnotate = scope === "every_word" || scope === "new_only" && statusNum === 0 || scope === "new_learning" && statusNum >= 0 && statusNum <= 3;
      if (shouldAnnotate) {
        const formatted = formatWordReading(
          surface,
          this.lang,
          this.langOpts.readingNotation,
          rec?.reading || entry?.r,
          entry?.r2
        );
        if (formatted?.reading) {
          if (formatted.kanjiStem !== void 0) {
            readingHtml = `<ruby class="verba-ruby">${escapeHtml(formatted.kanjiStem)}<rt>${escapeHtml(
              formatted.reading
            )}</rt></ruby>${escapeHtml(formatted.okurigana || "")}`;
          } else {
            readingHtml = `<ruby class="verba-ruby">${escapeHtml(surface)}<rt>${escapeHtml(
              formatted.reading
            )}</rt></ruby>`;
          }
        }
      }
    }
    return { statusAttr, readingHtml };
  }
  scanAndHighlight(root = this.rootContainer) {
    if (this.diglotMode && !this.isBookOrReader) {
      this.scanAndWeaveDiglot(root);
      return;
    }
    const { lexicon, phrases, overrides } = this.getPhrasesAndCustomLexicon();
    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('a, button, [role="link"], [role="button"], verba-w, #verba-ui-root, [data-verba-ignore="1"], [contenteditable="true"], code, pre, script, style, rt')) {
          return NodeFilter.FILTER_REJECT;
        }
        const val = node.nodeValue || "";
        if (!/[\p{L}]/u.test(val)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let current;
    while (current = walker.nextNode()) {
      textNodes.push(current);
    }
    for (const textNode of textNodes) {
      const text = textNode.nodeValue || "";
      if (this.langOpts.onlyHighlightTargetText && !this.isBookOrReader) {
        const blockText = textNode.parentElement?.textContent || text;
        if (!textLooksLikeLanguage(blockText, this.lang)) continue;
      }
      const tokens = segmentText(text, this.lang, lexicon, phrases);
      if (!tokens.some((t) => t.isWord)) continue;
      const frag = document.createDocumentFragment();
      const createdEls = [];
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (!tok.isWord) {
          frag.appendChild(document.createTextNode(tok.text));
          createdEls.push(null);
          continue;
        }
        const resolved = resolveTrackingKey(
          tok.text,
          this.lang,
          this.dictIndex,
          this.langOpts.countingMode,
          tok.lemmaHint,
          overrides
        );
        const key = phrases.has(tok.normalized) ? tok.normalized : phrases.has(tok.text) ? tok.text : resolved.key;
        const { statusAttr, readingHtml } = this.computeStatusAttr(key, tok.text, tok.lemmaHint);
        const el = document.createElement("verba-w");
        el.dataset.w = tok.text;
        el.dataset.key = key;
        el.dataset.s = statusAttr;
        if (tok.lemmaHint) el.dataset.lemma = tok.lemmaHint;
        if (resolved.primaryEntry?.rank) el.dataset.rank = String(resolved.primaryEntry.rank);
        const insideNativeRuby = Boolean(textNode.parentElement?.closest("ruby"));
        if (readingHtml && !insideNativeRuby) {
          el.innerHTML = readingHtml;
        } else {
          el.textContent = tok.text;
        }
        frag.appendChild(el);
        createdEls.push(el);
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    }
    this.setupHonestReadingObserver(root);
    this.emitCounts();
  }
  /**
   * Inline Word Replacement ("Diglot Weave" / Passive Immersion):
   * Scans L1 text nodes and weaves target-language (L2) vocabulary in place while preserving L1 context.
   */
  scanAndWeaveDiglot(root = this.rootContainer) {
    if (!this.settings.inlineReplacementEnabled && !this.diglotMode) return;
    const pageWovenCounts = /* @__PURE__ */ new Map();
    for (const existing of Array.from(this.rootContainer.querySelectorAll('verba-w[data-diglot="1"]'))) {
      const k = existing.dataset.key || existing.dataset.w || "";
      if (k) pageWovenCounts.set(k, (pageWovenCounts.get(k) || 0) + 1);
    }
    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest(
          'a, button, [role="link"], [role="button"], verba-w, #verba-ui-root, [data-verba-ignore="1"], [contenteditable="true"], code, pre, script, style, rt'
        )) {
          return NodeFilter.FILTER_REJECT;
        }
        const val = node.nodeValue || "";
        if (!/[A-Za-z]{3,}/.test(val)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let current;
    while (current = walker.nextNode()) {
      textNodes.push(current);
    }
    for (const textNode of textNodes) {
      const text = textNode.nodeValue || "";
      const tokens = weaveDiglotSegment(
        text,
        this.lang,
        this.dictIndex,
        this.wordMap,
        this.settings,
        pageWovenCounts
      );
      if (!tokens.some((t) => t.isReplaced)) continue;
      const frag = document.createDocumentFragment();
      for (const tok of tokens) {
        if (!tok.isReplaced || !tok.targetSurface || !tok.targetWord) {
          frag.appendChild(document.createTextNode(tok.text));
          continue;
        }
        const key = tok.targetWord;
        const { statusAttr, readingHtml } = this.computeStatusAttr(key, tok.targetSurface, tok.targetLemma);
        const el = document.createElement("verba-w");
        el.dataset.diglot = "1";
        el.dataset.orig = tok.originalText || tok.text;
        el.dataset.w = tok.targetWord;
        el.dataset.key = key;
        el.dataset.s = statusAttr;
        if (tok.targetLemma) el.dataset.lemma = tok.targetLemma;
        if (tok.entry?.rank) el.dataset.rank = String(tok.entry.rank);
        const insideNativeRuby = Boolean(textNode.parentElement?.closest("ruby"));
        if (readingHtml && !insideNativeRuby) {
          el.innerHTML = readingHtml;
        } else {
          el.textContent = tok.targetSurface;
        }
        frag.appendChild(el);
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    }
    this.setupHonestReadingObserver(root);
    this.emitCounts();
  }
  /**
   * Reverts a single inline-replaced <verba-w data-diglot="1"> element back to its original L1 word.
   */
  revertDiglotElement(el) {
    const orig = el.dataset.orig || el.dataset.w || el.textContent || "";
    const parent = el.parentNode;
    el.replaceWith(document.createTextNode(orig));
    parent?.normalize();
    this.emitCounts();
  }
  /**
   * Toggles Inline Word Replacement (Diglot Weave) mode on the current page.
   */
  toggleDiglotMode(forceState) {
    const nextState = forceState !== void 0 ? forceState : !this.diglotMode;
    const wrappers = Array.from(this.rootContainer.querySelectorAll("verba-w"));
    const parents = /* @__PURE__ */ new Set();
    for (const w of wrappers) {
      const raw = w.dataset.orig || w.dataset.w || w.textContent || "";
      if (w.parentNode) parents.add(w.parentNode);
      w.replaceWith(document.createTextNode(raw));
    }
    for (const p of parents) p.normalize();
    this.diglotMode = nextState;
    if (this.diglotMode) {
      this.scanAndWeaveDiglot(this.rootContainer);
    } else {
      this.emitCounts();
    }
    return this.diglotMode;
  }
  /**
   * Re-renders a paragraph cleanly (e.g. when user merges characters into a custom word or splits one).
   */
  rehighlightContainer(container) {
    const wrappers = Array.from(container.querySelectorAll("verba-w"));
    for (const w of wrappers) {
      const raw = w.dataset.orig || w.dataset.w || w.textContent || "";
      w.replaceWith(document.createTextNode(raw));
    }
    container.normalize();
    this.scanAndHighlight(container);
  }
  /**
   * Fast in-place highlight update across all existing <verba-w> elements when vocabulary changes.
   */
  refreshAllStatuses(resegmentIfCustom = false) {
    this.injectStyles();
    if (resegmentIfCustom) {
      const blocks = /* @__PURE__ */ new Set();
      for (const el of Array.from(this.rootContainer.querySelectorAll("verba-w"))) {
        if (el.parentElement) blocks.add(el.parentElement);
      }
      for (const b of blocks) this.rehighlightContainer(b);
      this.emitCounts();
      return;
    }
    const elements = this.rootContainer.querySelectorAll("verba-w");
    for (const el of Array.from(elements)) {
      const surface = el.dataset.w || el.textContent || "";
      const key = el.dataset.key || surface;
      const lemmaHint = el.dataset.lemma;
      const { statusAttr, readingHtml } = this.computeStatusAttr(key, surface, lemmaHint);
      if (el.dataset.diglot === "1" && statusAttr === "-1") {
        this.revertDiglotElement(el);
        continue;
      }
      el.dataset.s = statusAttr;
      const insideNativeRuby = Boolean(el.parentElement?.closest("ruby:not(.verba-ruby)"));
      if (readingHtml && !insideNativeRuby) {
        el.innerHTML = readingHtml;
      } else if (el.querySelector("ruby.verba-ruby")) {
        el.textContent = surface;
      }
    }
    this.emitCounts();
  }
  getCounts() {
    const newSet = /* @__PURE__ */ new Set();
    const learnSet = /* @__PURE__ */ new Set();
    const knownSet = /* @__PURE__ */ new Set();
    let diglotWords = 0;
    const elements = this.rootContainer.querySelectorAll("verba-w");
    for (const el of Array.from(elements)) {
      if (el.dataset.diglot === "1") diglotWords++;
      const key = el.dataset.key || el.dataset.w || "";
      if (!key) continue;
      const s = el.dataset.s;
      if (s === "0" || s === "green") newSet.add(key);
      else if (s === "1" || s === "2" || s === "3" || s === "4") learnSet.add(key);
      else if (s === "5") knownSet.add(key);
    }
    return {
      newWords: newSet.size,
      learningWords: learnSet.size,
      knownWordsOnPage: knownSet.size,
      diglotWords,
      allBlueKeys: Array.from(newSet)
    };
  }
  emitCounts() {
    if (this.onCountsChanged) {
      this.onCountsChanged(this.getCounts());
    }
  }
  /**
   * Chatbot & SPA streaming observer: waits a beat (~420ms) after mutations settle so streaming tokens
   * aren't wrapped mid-word!
   */
  startMutationObserver() {
    if (this.observer) return;
    const isChatbotHost = /chatgpt\.com|openai\.com|claude\.ai|gemini\.google\.com|perplexity\.ai|grok\.com/i.test(
      location.hostname
    );
    const settleDelay = isChatbotHost ? 480 : 260;
    this.observer = new MutationObserver((mutations) => {
      let hasExternalText = false;
      for (const m of mutations) {
        if (m.target instanceof Element && m.target.closest("#verba-ui-root, verba-w")) continue;
        if (m.addedNodes.length > 0 || m.type === "characterData") {
          hasExternalText = true;
          break;
        }
      }
      if (!hasExternalText) return;
      if (this.mutationTimer) window.clearTimeout(this.mutationTimer);
      this.mutationTimer = window.setTimeout(() => {
        this.scanAndHighlight(this.rootContainer);
      }, settleDelay);
    });
    this.observer.observe(this.rootContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  /**
   * Honest Reading Counter ("Words read are credited only for text on screen long enough to be read").
   */
  setupHonestReadingObserver(root) {
    if (this.settings.countWordsReadWhere === "reader_and_books" && !this.isBookOrReader) {
      return;
    }
    const markActive = () => {
      this.lastUserActivityAt = Date.now();
    };
    window.addEventListener("scroll", markActive, { passive: true });
    window.addEventListener("mousemove", markActive, { passive: true });
    window.addEventListener("keydown", markActive, { passive: true });
    if (!this.io && typeof IntersectionObserver !== "undefined") {
      this.io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target;
            if (entry.isIntersecting) {
              if (this.paragraphTimers.has(el)) continue;
              const wordCount = el.querySelectorAll("verba-w").length;
              if (wordCount < 3) continue;
              const dwellMs = Math.min(8e3, Math.max(1500, Math.round(wordCount / 3.5 * 1e3)));
              const timerId = window.setTimeout(() => {
                this.paragraphTimers.delete(el);
                const recentlyActive = Date.now() - this.lastUserActivityAt < 12e4;
                if (document.visibilityState === "visible" && recentlyActive) {
                  const snippet = (el.textContent || "").trim().slice(0, 64);
                  const paraKey = `${location.href}:${snippet}`;
                  sendBgMessage({
                    type: "RECORD_READING_WORDS",
                    lang: this.lang,
                    count: wordCount,
                    paragraphKey: paraKey
                  }).catch(() => {
                  });
                }
              }, dwellMs);
              this.paragraphTimers.set(el, timerId);
            } else {
              const t = this.paragraphTimers.get(el);
              if (t !== void 0) {
                window.clearTimeout(t);
                this.paragraphTimers.delete(el);
              }
            }
          }
        },
        { threshold: 0.6 }
      );
    }
    if (this.io) {
      const blocks = root.querySelectorAll("p, li, blockquote, article div");
      for (const b of Array.from(blocks)) {
        if (this.observedParagraphs.has(b)) continue;
        if (b.closest("nav, header, footer, aside")) continue;
        if (b.querySelectorAll("verba-w").length >= 3) {
          this.observedParagraphs.add(b);
          this.io.observe(b);
        }
      }
    }
  }
  destroy() {
    this.observer?.disconnect();
    this.observer = null;
    this.io?.disconnect();
    this.io = null;
    if (this.readingTimer) window.clearTimeout(this.readingTimer);
    for (const t of this.paragraphTimers.values()) window.clearTimeout(t);
    this.paragraphTimers.clear();
  }
};
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/content/word-panel.ts
var VerbaWordPanel = class {
  constructor(shadow, settings, langOpts, callbacks) {
    this.shadow = shadow;
    this.settings = settings;
    this.langOpts = langOpts;
    this.callbacks = callbacks;
    this.el = document.createElement("div");
    this.el.className = "verba-panel";
    this.el.hidden = true;
    this.shadow.appendChild(this.el);
  }
  el;
  isOpen = false;
  isPinned = false;
  activeLookup = null;
  anchorRect = null;
  contextSentence = "";
  fullParagraphText = "";
  activeElement = null;
  activeTab = "meaning";
  entryIdx = 0;
  listAllEntries = false;
  editingMeaning = false;
  extenderOpen = false;
  lookUpMenuOpen = false;
  ankiPickerOpen = false;
  tickedMeanings = [];
  editedSentence = "";
  editedTranslation = "";
  googleTranslation = "";
  aiLoading = false;
  aiError = "";
  aiVerdict = null;
  editingAiMeaning = false;
  statusToast = "";
  lookupSeq = 0;
  get panelElement() {
    return this.el;
  }
  async openForWord(params) {
    this.isOpen = true;
    this.isPinned = params.pinned;
    this.anchorRect = params.rect;
    this.activeElement = params.element || null;
    this.contextSentence = params.sentence || "";
    this.fullParagraphText = params.paragraph || params.sentence || "";
    this.editedSentence = this.contextSentence;
    this.editedTranslation = "";
    this.activeTab = "meaning";
    this.entryIdx = 0;
    this.listAllEntries = false;
    this.editingMeaning = false;
    this.extenderOpen = false;
    this.lookUpMenuOpen = false;
    this.ankiPickerOpen = false;
    this.tickedMeanings = [];
    this.googleTranslation = "";
    this.aiError = "";
    this.editingAiMeaning = false;
    this.statusToast = "";
    const seq = ++this.lookupSeq;
    const lookup = await sendBgMessage({
      type: "LOOKUP_WORD",
      word: params.query,
      lang: params.lang,
      sentence: this.settings.contextMeaningFirst ? this.contextSentence : void 0,
      lemmaHint: params.lemmaHint,
      incrementLookup: params.pinned
    });
    if (seq !== this.lookupSeq || !this.isOpen) return;
    this.activeLookup = lookup;
    this.aiVerdict = lookup.record?.aiVerdict || null;
    if (this.settings.translateMissingWords && (lookup.entries.length === 0 || params.isSelectionPhrase)) {
      sendBgMessage({
        type: "TRANSLATE",
        text: params.query,
        sourceLang: params.lang
      }).then((res) => {
        if (this.activeLookup?.query === params.query && res?.translation) {
          this.googleTranslation = res.translation;
          this.render();
        }
      }).catch(() => {
      });
    }
    this.render();
    this.positionNear(params.rect);
    if (params.runAiImmediately) {
      this.triggerAiCheck();
    }
  }
  close() {
    this.lookupSeq++;
    if (!this.isOpen) return;
    if (this.activeElement) {
      delete this.activeElement.dataset.pinned;
    }
    this.isOpen = false;
    this.isPinned = false;
    this.activeLookup = null;
    this.activeElement = null;
    this.el.hidden = true;
    this.callbacks.onClose?.();
  }
  toggleCharactersTab() {
    if (!this.activeLookup?.characters?.length) return;
    this.activeTab = this.activeTab === "meaning" ? "characters" : "meaning";
    this.render();
  }
  stepEntry(delta) {
    if (!this.activeLookup || this.activeLookup.entries.length <= 1) return;
    const len = this.activeLookup.entries.length;
    this.entryIdx = (this.entryIdx + delta + len) % len;
    this.listAllEntries = false;
    this.render();
  }
  toggleListAllEntries() {
    if (!this.activeLookup || this.activeLookup.entries.length <= 1) return;
    this.listAllEntries = !this.listAllEntries;
    this.render();
  }
  openCustomMeaningEditor() {
    if (!this.isOpen) return;
    this.isPinned = true;
    this.editingMeaning = true;
    this.render();
    const input = this.el.querySelector("#wp-meaning-input");
    input?.focus();
  }
  async triggerGoogleTranslate() {
    if (!this.activeLookup) return;
    const res = await sendBgMessage({
      type: "TRANSLATE",
      text: this.activeLookup.query,
      sourceLang: this.settings.activeLang
    });
    if (res?.translation) {
      this.googleTranslation = res.translation;
      this.render();
    }
  }
  openFirstDictionaryLink() {
    if (!this.activeLookup) return;
    const first = this.langOpts.dictionaryLinks[0];
    if (first) {
      const url = first.urlTemplate.replace("{word}", encodeURIComponent(this.activeLookup.lemma || this.activeLookup.query));
      window.open(url, "_blank", "noopener");
    }
  }
  async triggerAiCheck() {
    if (!this.activeLookup) return;
    this.isPinned = true;
    this.aiLoading = true;
    this.aiError = "";
    this.render();
    try {
      const res = await sendBgMessage({
        type: "AI_CHECK_WORD",
        word: this.activeLookup.query,
        lang: this.settings.activeLang,
        sentence: this.contextSentence
      });
      if (!res.ok || !res.verdict) {
        this.aiError = res.error || "AI check failed.";
      } else {
        this.aiVerdict = res.verdict;
      }
    } catch (err) {
      this.aiError = err instanceof Error ? err.message : String(err);
    } finally {
      this.aiLoading = false;
      this.render();
    }
  }
  openAnkiMeaningPicker() {
    if (!this.activeLookup) return;
    this.isPinned = true;
    this.ankiPickerOpen = !this.ankiPickerOpen;
    this.editedSentence = this.contextSentence;
    this.render();
  }
  tickAnkiMeaningByNumber(num1Based) {
    if (!this.ankiPickerOpen || !this.activeLookup) return false;
    const allM = this.collectAllMeanings();
    const target = allM[num1Based - 1];
    if (!target) return false;
    const idx = this.tickedMeanings.indexOf(target);
    if (idx >= 0) this.tickedMeanings.splice(idx, 1);
    else this.tickedMeanings.push(target);
    this.render();
    return true;
  }
  async sendCurrentToAnki(customPickedMeanings) {
    if (!this.activeLookup) return;
    const entry = this.activeLookup.entries[0];
    const meanings = customPickedMeanings && customPickedMeanings.length > 0 ? customPickedMeanings : this.activeLookup.record?.customMeaning ? [this.activeLookup.record.customMeaning] : this.collectAllMeanings();
    this.statusToast = "On its way to Anki\u2026";
    this.render();
    const res = await sendBgMessage({
      type: "ANKI_SEND_WORD",
      payload: {
        lang: this.settings.activeLang,
        word: this.activeLookup.lemma || this.activeLookup.query,
        reading: entry?.r || this.activeLookup.record?.reading,
        pitch: entry?.pitch,
        meanings,
        sentence: (this.editedSentence || this.contextSentence).slice(0, 600),
        sentenceTranslation: this.editedTranslation || void 0,
        pickedByHand: true
      }
    });
    if (res.ok) {
      this.statusToast = `Saved to Anki (${res.deck})`;
      this.ankiPickerOpen = false;
    } else {
      this.statusToast = res.error || "Anki not reachable";
    }
    this.render();
  }
  collectAllMeanings() {
    if (!this.activeLookup) return [];
    const list = [];
    if (this.activeLookup.record?.customMeaning) list.push(this.activeLookup.record.customMeaning);
    if (this.activeLookup.record?.aiMeaning) list.push(this.activeLookup.record.aiMeaning);
    for (const e of this.activeLookup.entries) {
      for (const m of e.m) if (!list.includes(m)) list.push(m);
    }
    if (list.length === 0 && this.googleTranslation) list.push(this.googleTranslation);
    return list;
  }
  positionNear(rect) {
    this.el.hidden = false;
    const panelW = this.el.offsetWidth || 356;
    const panelH = Math.min(480, this.el.offsetHeight || 220);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = Math.max(10, Math.min(rect.left, vw - panelW - 12));
    let top = rect.bottom + 8;
    if (top + panelH > vh - 12 && rect.top - panelH - 8 > 8) {
      top = rect.top - panelH - 8;
    } else if (top + panelH > vh - 12) {
      top = Math.max(10, vh - panelH - 12);
    }
    this.el.style.left = `${Math.round(left)}px`;
    this.el.style.top = `${Math.round(top)}px`;
  }
  render() {
    const lk = this.activeLookup;
    if (!this.isOpen || !lk) {
      this.el.hidden = true;
      return;
    }
    this.el.dataset.size = this.settings.wordPanel.size;
    const curStatus = lk.record?.status ?? 0;
    const statusLabels = {
      "0": lk.crossScriptKnown ? "Known in other script" : "New",
      "1": "Level 1",
      "2": "Level 2",
      "3": "Level 3",
      "4": "Level 4",
      "5": "Known",
      "-1": "Ignored"
    };
    const entries = lk.entries;
    const activeEntry = entries[this.entryIdx] || entries[0];
    const headword = activeEntry?.w || lk.lemma || lk.query;
    const altForm = activeEntry?.alt && activeEntry.alt !== headword ? activeEntry.alt : lk.query !== headword ? lk.query : "";
    const genderAttr = this.settings.activeLang === "de" && activeEntry?.gender ? `data-gender="${activeEntry.gender}"` : "";
    const readingText = this.settings.wordPanel.showReading ? activeEntry?.r || lk.record?.reading || "" : "";
    const pitchHtml = this.langOpts.pitchAccent && activeEntry?.pitch ? `<span class="wp-pitch">${esc(activeEntry.pitch)}</span>` : "";
    const rankHtml = lk.rank ? `<span class="wp-rank">${formatOrdinal(lk.rank)} most common</span>` : "";
    const showEntriesOneByOne = this.settings.entriesOneAtATime && entries.length > 1 && !this.listAllEntries;
    const visibleEntries = showEntriesOneByOne ? [activeEntry] : entries;
    const meaningItemsHtml = [];
    if (lk.record?.customMeaning) {
      meaningItemsHtml.push(
        `<li class="wp-meaning-item"><span class="wp-tag yours">Yours</span><span>${esc(lk.record.customMeaning)}</span></li>`
      );
    }
    if (lk.record?.aiMeaning) {
      meaningItemsHtml.push(
        `<li class="wp-meaning-item"><span class="wp-tag ai">\u2726 AI</span><span>${esc(lk.record.aiMeaning)}</span></li>`
      );
    }
    for (const ent of visibleEntries) {
      if (!ent) continue;
      for (const m of ent.m) {
        const tag = ent.dictName ? `<span class="wp-tag">${esc(ent.dictName)}</span>` : ent.pos ? `<span class="wp-tag">${esc(ent.pos)}</span>` : "";
        meaningItemsHtml.push(`<li class="wp-meaning-item">${tag}<span>${esc(m)}</span></li>`);
      }
    }
    if (this.googleTranslation) {
      meaningItemsHtml.push(
        `<li class="wp-meaning-item"><span class="wp-tag">Translate</span><span>${esc(this.googleTranslation)}</span></li>`
      );
    }
    if (meaningItemsHtml.length === 0) {
      meaningItemsHtml.push(
        `<li class="wp-meaning-item" style="color:var(--ink-3)">Not in bundled dictionary. Press <kbd>G</kbd> to translate or <kbd>\u2726</kbd> to ask AI.</li>`
      );
    }
    const compoundGlossHtml = entries.length === 0 && lk.charByCharGloss?.length ? `<div class="wp-section">
            <div class="wp-section-title">Character-by-character</div>
            ${lk.charByCharGloss.map((c) => `<div><b>${esc(c.char)}</b> <span style="color:var(--ink-3)">${esc(c.reading)}</span> \u2014 ${esc(c.meaning)}</div>`).join("")}
          </div>` : "";
    const tabsHtml = lk.characters?.length ? `<div class="wp-tabs">
          <button type="button" class="wp-tab" data-tab="meaning" aria-selected="${this.activeTab === "meaning"}">Meaning</button>
          <button type="button" class="wp-tab" data-tab="characters" aria-selected="${this.activeTab === "characters"}">Characters (B)</button>
        </div>` : "";
    const charactersBodyHtml = this.activeTab === "characters" && lk.characters?.length ? `<div style="margin-top:10px;display:grid;gap:8px;">
            ${lk.characters.map(
      (c) => `<div style="padding:8px 10px;border-radius:8px;background:var(--surface-2);">
                  <div style="display:flex;align-items:baseline;gap:8px;">
                    <span style="font-size:20px;color:var(--ink);font-family:var(--serif)">${esc(c.char)}</span>
                    <span style="color:var(--ink-2)">${esc(c.reading)}</span>
                    <span>${esc(c.meaning)}</span>
                  </div>
                  <div style="margin-top:4px;font-size:12px;color:var(--ink-3)">
                    Built from: ${c.components.map(([rad, gloss]) => `<b>${esc(rad)}</b> (${esc(gloss)})`).join(" + ")}
                  </div>
                </div>`
    ).join("")}
          </div>` : "";
    const pagerHtml = entries.length > 1 ? `<div class="wp-pager">
            <button type="button" class="wp-icon-btn" id="wp-prev-entry" title="Previous entry (Shift+N)">\u2039</button>
            <button type="button" class="wp-btn-ghost" id="wp-list-entries" title="List all entries (L)">${this.listAllEntries ? "One at a time" : `${this.entryIdx + 1} / ${entries.length}`}</button>
            <button type="button" class="wp-icon-btn" id="wp-next-entry" title="Next entry (N)">\u203A</button>
          </div>` : "";
    const partsHtml = lk.partsOf?.length ? `<div class="wp-section">
          <div class="wp-section-title">Parts of ${esc(lk.query)}</div>
          ${lk.partsOf.map((p) => `<div><b>${esc(p.part)}</b> \xB7 <span style="color:var(--ink-3)">${esc(p.role)}</span></div>`).join("")}
        </div>` : "";
    const couldAlsoBeHtml = lk.couldAlsoBe.length ? `<div class="wp-section">
          <div class="wp-section-title">Could also be</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${lk.couldAlsoBe.map(
      (c) => `<button type="button" class="wp-btn-ghost wp-lemma-pick" data-lemma="${esc(c.lemma)}"><b>${esc(
        c.lemma
      )}</b> \xB7 ${esc(c.gloss.slice(0, 28))}</button>`
    ).join("")}
          </div>
        </div>` : "";
    const topIconsHtml = this.isPinned ? `<div class="wp-actions">
          <button type="button" class="wp-icon-btn" id="wp-speak-word" title="Say word (V)">\u{1F50A}</button>
          <button type="button" class="wp-icon-btn" id="wp-speak-sent" title="Read sentence aloud (Shift+V)">\u{1F5E3}</button>
          <button type="button" class="wp-icon-btn" id="wp-extend-btn" title="Longer or shorter word (\u2194)">\u2194</button>
          <button type="button" class="wp-icon-btn" id="wp-edit-meaning" title="Your own meaning (M)">\u270E</button>
          <button type="button" class="wp-icon-btn" id="wp-translate-btn" title="Google Translate (G)">\u6587</button>
          <button type="button" class="wp-icon-btn" id="wp-lookup-btn" title="Look up in other dictionaries (T)">\u{1F4D6}</button>
          ${this.settings.ankiShowButtonInPanel ? `<button type="button" class="wp-icon-btn" id="wp-anki-btn" title="${lk.record?.ankiDeck ? `In Anki (${lk.record.ankiDeck})` : "Add to Anki (P / Shift+P)"}">\u2605</button>` : ""}
          <button type="button" class="wp-icon-btn" id="wp-ai-btn" title="Ask AI if this is a real word (A)">\u2726</button>
          <button type="button" class="wp-icon-btn" id="wp-close-btn" title="Close (Esc)">\u2715</button>
        </div>` : "";
    const extenderHtml = this.extenderOpen ? `<div class="wp-section" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="color:var(--ink-3)">Length:</span>
          <button type="button" class="wp-btn-ghost" data-ext="left_add" title="Extend left">\u25C0+</button>
          <button type="button" class="wp-btn-ghost" data-ext="left_trim" title="Trim left">+\u25B6</button>
          <button type="button" class="wp-btn-ghost" data-ext="right_trim" title="Trim right">\u25C0\u2212</button>
          <button type="button" class="wp-btn-ghost" data-ext="right_add" title="Extend right">+\u25B6</button>
          ${lk.record?.isCustomSegment ? `<button type="button" class="wp-btn-ghost" id="wp-split-custom">Split into words</button>` : ""}
        </div>` : "";
    const lookupMenuHtml = this.lookUpMenuOpen || this.isPinned && this.settings.wordPanel.dictLinksInline ? `<div class="wp-section" style="display:flex;flex-wrap:wrap;gap:6px;">
            ${this.langOpts.dictionaryLinks.map(
      (dl) => `<a href="${esc(
        dl.urlTemplate.replace("{word}", encodeURIComponent(lk.lemma || lk.query))
      )}" target="_blank" rel="noopener" class="wp-btn-ghost" style="text-decoration:none;display:inline-flex;align-items:center;">${esc(
        dl.name
      )} \u2197</a>`
    ).join("")}
            <button type="button" class="wp-btn-ghost" id="wp-ask-ai-chat">Ask ${esc(
      this.settings.askAiChatProvider
    )} about this (Shift+I)</button>
          </div>` : "";
    const customMeaningBoxHtml = this.editingMeaning ? `<form class="wp-custom-box" id="wp-meaning-form">
          <input id="wp-meaning-input" class="wp-input" type="text" placeholder="Write a meaning in your own words\u2026" value="${esc(
      lk.record?.customMeaning || ""
    )}" autocomplete="off">
          <button type="submit" class="wp-btn-sm">Save</button>
        </form>` : "";
    const aiBoxHtml = this.aiLoading || this.aiError || this.aiVerdict ? `<div class="wp-section">
            <div class="wp-section-title">\u2726 AI Check</div>
            ${this.aiLoading ? `<div style="color:var(--ink-3)">Checking with ${esc(this.settings.aiProvider)}\u2026</div>` : this.aiError ? `<div style="color:#fca5a5">${esc(this.aiError)}</div>` : this.aiVerdict ? `<div>
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                      <span class="wp-tag ai">${esc(
      this.aiVerdict.verdict === "real" ? "Real word" : this.aiVerdict.verdict === "narrow" ? "Real, but narrow" : this.aiVerdict.verdict === "not_a_word" ? "Not a word" : "Uncertain"
    )}</span>
                      <span style="font-size:11px;color:var(--ink-3)">${esc(this.aiVerdict.confidence)} confidence</span>
                    </div>
                    ${this.aiVerdict.verdict !== "not_a_word" ? `<div style="color:var(--ink);margin:4px 0;"><b>${esc(this.aiVerdict.shortMeaning)}</b> \u2014 ${esc(
      this.aiVerdict.meaning
    )}</div>` : ""}
                    ${this.aiVerdict.exampleSentence ? `<div style="color:var(--ink-2);margin-top:4px;"><i>${esc(
      this.aiVerdict.exampleSentence
    )}</i><br><span style="color:var(--ink-3)">${esc(this.aiVerdict.exampleTranslation || "")}</span></div>` : ""}
                    <div style="color:var(--ink-3);margin-top:4px;">Why: ${esc(this.aiVerdict.reasoning)}</div>
                    ${this.aiVerdict.customAnswer ? `<div style="margin-top:6px;"><b>Your question:</b> ${esc(this.aiVerdict.customAnswer)}</div>` : ""}
                    ${this.aiVerdict.shortMeaning && this.aiVerdict.verdict !== "not_a_word" ? this.editingAiMeaning ? `<form class="wp-custom-box" id="wp-ai-edit-form">
                              <input id="wp-ai-edit-input" class="wp-input" value="${esc(this.aiVerdict.shortMeaning)}">
                              <button type="submit" class="wp-btn-sm">Save as yours</button>
                            </form>` : `<div style="display:flex;gap:6px;margin-top:6px;">
                              <button type="button" class="wp-btn-sm" id="wp-save-ai-meaning">\u2726 Save as its meaning</button>
                              <button type="button" class="wp-btn-ghost" id="wp-edit-ai-meaning" title="Edit before saving">\u270E</button>
                            </div>` : ""}
                  </div>` : ""}
          </div>` : this.isPinned && entries.length === 0 ? `<div class="wp-section">
            <button type="button" class="wp-btn-ghost" id="wp-ask-ai-verdict">\u2726 Ask AI if this is a real word</button>
          </div>` : "";
    const allMeaningsForAnki = this.collectAllMeanings();
    const ankiPickerHtml = this.ankiPickerOpen ? `<div class="wp-section">
          <div class="wp-section-title">Anki Card Builder (Shift+P)</div>
          <div style="display:flex;gap:4px;margin-bottom:4px;flex-wrap:wrap;">
            <button type="button" class="wp-btn-ghost" data-sent-adj="start_more">+ word start</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="start_less">\u2212 word start</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="end_less">\u2212 word end</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="end_more">+ word end</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="reset">Reset</button>
          </div>
          <input id="wp-anki-sent" class="wp-input" style="width:100%;margin-bottom:6px;" value="${esc(
      this.editedSentence
    )}" placeholder="Sentence on card (up to 600 chars)">
          <div style="display:grid;gap:4px;margin-bottom:8px;">
            ${allMeaningsForAnki.map(
      (m, idx) => `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                  <input type="checkbox" class="wp-anki-chk" data-m="${esc(m)}" ${this.tickedMeanings.includes(m) ? "checked" : ""}>
                  <kbd>${idx + 1}</kbd> <span>${esc(m)}</span>
                </label>`
    ).join("")}
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="wp-btn-sm" id="wp-anki-confirm">Add to Anki</button>
            <button type="button" class="wp-btn-ghost" id="wp-anki-cancel">Cancel</button>
          </div>
        </div>` : "";
    const gradesHtml = this.isPinned && this.settings.wordPanel.showGradeButtons ? `<div class="wp-grades">
            ${[1, 2, 3, 4].map(
      (lvl) => `<button type="button" class="wp-grade-btn" data-grade="${lvl}" aria-pressed="${curStatus === lvl}" title="Level ${lvl} (key ${lvl}; click again for New)">
                  <span>${lvl}</span>
                  <span class="wp-swatch s${lvl}"></span>
                </button>`
    ).join("")}
            <button type="button" class="wp-grade-btn" data-grade="5" aria-pressed="${curStatus === 5}" title="Mark Known (K)">
              <span>Known</span>
              <span class="wp-swatch sk"></span>
            </button>
            <button type="button" class="wp-grade-btn" data-grade="-1" aria-pressed="${curStatus === -1}" title="Ignore (X)">
              <span>Ignore</span>
              <span class="wp-swatch sx"></span>
            </button>
          </div>
          <div class="wp-hint-foot">
            <span><kbd>1</kbd>\u2013<kbd>4</kbd> level</span>
            <span><kbd>K</kbd> known</span>
            <span><kbd>X</kbd> ignore</span>
            <span><kbd>0</kbd> new</span>
            ${lk.record?.lookupCount ? `<span>\u{1F440} ${lk.record.lookupCount}</span>` : ""}
          </div>` : "";
    const toastHtml = this.statusToast ? `<div style="margin-top:6px;font-size:12px;color:#93c5fd;">${esc(this.statusToast)}</div>` : "";
    const diglotOrig = this.activeElement?.dataset.diglot === "1" ? this.activeElement.dataset.orig || "" : "";
    const diglotBannerHtml = diglotOrig ? `<div class="wp-diglot-banner" id="wp-diglot-banner">
          <span>\u21C4 Woven in place of <b>"${esc(diglotOrig)}"</b></span>
          <button type="button" class="wp-btn-ghost" id="wp-diglot-revert" style="height:22px;padding:0 8px;font-size:11px;">Revert</button>
        </div>` : "";
    this.el.innerHTML = `
      <div class="wp-top">
        <div class="wp-head">
          <span class="wp-word" ${genderAttr}>${esc(headword)}</span>
          ${altForm ? `<span class="wp-alt">${esc(altForm)}</span>` : ""}
          <span class="wp-badge" data-s="${curStatus}">${esc(statusLabels[String(curStatus)] || "New")}</span>
        </div>
        ${topIconsHtml}
      </div>
      <div class="wp-sub">
        ${readingText ? `<span>${esc(readingText)}</span>` : ""}
        ${pitchHtml}
        ${rankHtml}
      </div>
      ${diglotBannerHtml}
      ${tabsHtml}
      ${this.activeTab === "characters" ? charactersBodyHtml : `
            <ul class="wp-meanings">${meaningItemsHtml.join("")}</ul>
            ${pagerHtml}
            ${compoundGlossHtml}
            ${partsHtml}
            ${couldAlsoBeHtml}
          `}
      ${customMeaningBoxHtml}
      ${extenderHtml}
      ${lookupMenuHtml}
      ${aiBoxHtml}
      ${ankiPickerHtml}
      ${toastHtml}
      ${gradesHtml}
    `;
    this.bindEvents();
  }
  bindEvents() {
    const lk = this.activeLookup;
    if (!lk) return;
    this.el.querySelectorAll(".wp-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.dataset.tab || "meaning";
        this.render();
      });
    });
    this.el.querySelector("#wp-prev-entry")?.addEventListener("click", () => this.stepEntry(-1));
    this.el.querySelector("#wp-next-entry")?.addEventListener("click", () => this.stepEntry(1));
    this.el.querySelector("#wp-list-entries")?.addEventListener("click", () => this.toggleListAllEntries());
    this.el.querySelector("#wp-speak-word")?.addEventListener("click", () => {
      speakText(lk.query, this.settings.activeLang, this.settings);
    });
    this.el.querySelector("#wp-speak-sent")?.addEventListener("click", () => {
      speakText(this.contextSentence || lk.query, this.settings.activeLang, this.settings);
    });
    this.el.querySelector("#wp-extend-btn")?.addEventListener("click", () => {
      this.extenderOpen = !this.extenderOpen;
      this.render();
    });
    this.el.querySelectorAll("[data-ext]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = btn.dataset.ext;
        this.callbacks.onExtendSelection(dir);
      });
    });
    this.el.querySelector("#wp-split-custom")?.addEventListener("click", async () => {
      await this.callbacks.onSplitCustomWord(lk.query);
      this.close();
    });
    this.el.querySelector("#wp-edit-meaning")?.addEventListener("click", () => this.openCustomMeaningEditor());
    this.el.querySelector("#wp-meaning-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = this.el.querySelector("#wp-meaning-input")?.value.trim() || "";
      const targetStatus = lk.record?.status ? lk.record.status : 1;
      await this.callbacks.onGrade(lk.query, targetStatus, {
        customMeaning: val,
        contextSentence: this.contextSentence
      });
      this.editingMeaning = false;
      const refreshed = await sendBgMessage({
        type: "LOOKUP_WORD",
        word: lk.query,
        lang: this.settings.activeLang
      });
      this.activeLookup = refreshed;
      this.render();
    });
    this.el.querySelector("#wp-translate-btn")?.addEventListener("click", () => this.triggerGoogleTranslate());
    this.el.querySelector("#wp-lookup-btn")?.addEventListener("click", () => {
      this.lookUpMenuOpen = !this.lookUpMenuOpen;
      this.render();
    });
    this.el.querySelector("#wp-ask-ai-chat")?.addEventListener("click", () => {
      this.callbacks.onOpenAskAiChat(this.contextSentence || lk.query);
    });
    this.el.querySelector("#wp-ai-btn")?.addEventListener("click", () => this.triggerAiCheck());
    this.el.querySelector("#wp-ask-ai-verdict")?.addEventListener("click", () => this.triggerAiCheck());
    this.el.querySelector("#wp-save-ai-meaning")?.addEventListener("click", async () => {
      if (!this.aiVerdict) return;
      const targetStatus = lk.record?.status || 1;
      await this.callbacks.onGrade(lk.query, targetStatus, {
        aiMeaning: this.aiVerdict.shortMeaning,
        contextSentence: this.contextSentence
      });
      this.activeLookup = await sendBgMessage({
        type: "LOOKUP_WORD",
        word: lk.query,
        lang: this.settings.activeLang
      });
      this.render();
    });
    this.el.querySelector("#wp-edit-ai-meaning")?.addEventListener("click", () => {
      this.editingAiMeaning = true;
      this.render();
    });
    this.el.querySelector("#wp-ai-edit-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = this.el.querySelector("#wp-ai-edit-input")?.value.trim() || "";
      await this.callbacks.onGrade(lk.query, lk.record?.status || 1, {
        customMeaning: val,
        contextSentence: this.contextSentence
      });
      this.editingAiMeaning = false;
      this.activeLookup = await sendBgMessage({
        type: "LOOKUP_WORD",
        word: lk.query,
        lang: this.settings.activeLang
      });
      this.render();
    });
    this.el.querySelector("#wp-anki-btn")?.addEventListener("click", (e) => {
      if (e.shiftKey) this.openAnkiMeaningPicker();
      else this.sendCurrentToAnki();
    });
    this.el.querySelectorAll(".wp-anki-chk").forEach((chk) => {
      chk.addEventListener("change", () => {
        const m = chk.dataset.m || "";
        if (chk.checked && !this.tickedMeanings.includes(m)) this.tickedMeanings.push(m);
        else if (!chk.checked) this.tickedMeanings = this.tickedMeanings.filter((x) => x !== m);
      });
    });
    this.el.querySelectorAll("[data-sent-adj]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.sentAdj;
        if (mode === "reset") {
          this.editedSentence = this.contextSentence;
        } else {
          const words = this.editedSentence.split(/\s+/);
          if (mode === "start_less" && words.length > 2) this.editedSentence = words.slice(1).join(" ");
          else if (mode === "end_less" && words.length > 2) this.editedSentence = words.slice(0, -1).join(" ");
          else if (mode === "start_more" || mode === "end_more") {
            this.editedSentence = this.fullParagraphText.slice(0, 580);
          }
        }
        this.render();
      });
    });
    this.el.querySelector("#wp-anki-sent")?.addEventListener("input", (e) => {
      this.editedSentence = e.target.value;
    });
    this.el.querySelector("#wp-anki-confirm")?.addEventListener("click", () => {
      this.sendCurrentToAnki(this.tickedMeanings);
    });
    this.el.querySelector("#wp-anki-cancel")?.addEventListener("click", () => {
      this.ankiPickerOpen = false;
      this.render();
    });
    this.el.querySelectorAll(".wp-lemma-pick").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const chosen = btn.dataset.lemma || "";
        if (!chosen) return;
        await this.callbacks.onGrade(lk.query, lk.record?.status || 1, {
          lemmaOverride: chosen,
          contextSentence: this.contextSentence
        });
        this.activeLookup = await sendBgMessage({
          type: "LOOKUP_WORD",
          word: lk.query,
          lang: this.settings.activeLang
        });
        this.render();
      });
    });
    this.el.querySelectorAll(".wp-grade-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const rawGrade = Number(btn.dataset.grade);
        const curStatus = lk.record?.status ?? 0;
        const nextStatus = curStatus === rawGrade ? 0 : rawGrade;
        await this.callbacks.onGrade(lk.query, nextStatus, {
          contextSentence: this.contextSentence
        });
        if (nextStatus === 5 || nextStatus === -1) {
          this.close();
        } else {
          this.activeLookup = await sendBgMessage({
            type: "LOOKUP_WORD",
            word: lk.query,
            lang: this.settings.activeLang
          });
          this.render();
        }
      });
    });
    this.el.querySelector("#wp-close-btn")?.addEventListener("click", () => this.close());
    this.el.querySelector("#wp-diglot-revert")?.addEventListener("click", () => {
      if (this.activeElement) {
        this.callbacks.onRevertDiglot?.(this.activeElement);
      }
      this.close();
    });
  }
};
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/shared/ai.ts
function buildAskAiChatUrl(settings, params) {
  const langName = LANG_MAP[params.lang]?.name || params.lang;
  let prompt = (settings.askAiChatPromptTemplate || "").replace(/\{language\}/g, langName).replace(/\{title\}/g, params.title || "Web page").replace(/\{sentence\}/g, params.sentence).replace(/\{context\}/g, params.context || params.sentence);
  if (params.translation) {
    prompt += `
Shown translation: "${params.translation}"`;
  }
  if (params.userQuestion.trim()) {
    prompt += `

My question: ${params.userQuestion.trim()}`;
  }
  const encoded = encodeURIComponent(prompt);
  let url = `https://chatgpt.com/?q=${encoded}`;
  switch (settings.askAiChatProvider) {
    case "claude":
      url = `https://claude.ai/new?q=${encoded}`;
      break;
    case "gemini":
      url = `https://gemini.google.com/app`;
      break;
    case "perplexity":
      url = `https://www.perplexity.ai/search?q=${encoded}`;
      break;
    case "custom":
      if (settings.askAiChatCustomUrl.startsWith("https://")) {
        url = settings.askAiChatCustomUrl.replace("{prompt}", encoded);
      }
      break;
  }
  return { url, fullPrompt: prompt };
}

// src/content/reader-view.ts
var VerbaReaderSuite = class {
  constructor(shadow, highlighter, settings, langOpts, bindWordInteractions) {
    this.shadow = shadow;
    this.highlighter = highlighter;
    this.settings = settings;
    this.langOpts = langOpts;
    this.bindWordInteractions = bindWordInteractions;
    this.shadowHighlightStyle = document.createElement("style");
    this.shadowHighlightStyle.textContent = buildPageHighlightStyles(settings);
    this.shadow.appendChild(this.shadowHighlightStyle);
    this.readerEl = document.createElement("div");
    this.readerEl.className = "verba-reader-overlay";
    this.readerEl.hidden = true;
    this.sentenceModalEl = document.createElement("div");
    this.sentenceModalEl.className = "verba-sentence-modal";
    this.sentenceModalEl.hidden = true;
    this.ttsBarEl = document.createElement("div");
    this.ttsBarEl.className = "verba-tts-bar";
    this.ttsBarEl.hidden = true;
    this.askModalEl = document.createElement("div");
    this.askModalEl.className = "verba-ask-modal";
    this.askModalEl.hidden = true;
    this.shadow.appendChild(this.readerEl);
    this.shadow.appendChild(this.sentenceModalEl);
    this.shadow.appendChild(this.ttsBarEl);
    this.shadow.appendChild(this.askModalEl);
  }
  readerEl;
  sentenceModalEl;
  ttsBarEl;
  askModalEl;
  shadowHighlightStyle;
  isReaderOpen = false;
  isSentenceModeOpen = false;
  isReadingAloud = false;
  isReadingPaused = false;
  pauseAfterEachSentence = false;
  sentences = [];
  sentenceIdx = 0;
  showSentenceTranslation = false;
  sentenceTranslationCache = /* @__PURE__ */ new Map();
  ttsStartedAt = 0;
  syncStyles(settings, langOpts) {
    this.settings = settings;
    this.langOpts = langOpts;
    this.shadowHighlightStyle.textContent = buildPageHighlightStyles(settings);
  }
  extractArticleFromPage() {
    const title = document.title || "Article";
    const assistantTurns = document.querySelectorAll(
      '[data-message-author-role="assistant"], .model-response-text, [data-testid*="assistant"]'
    );
    if (assistantTurns.length > 0) {
      const htmlParts = [];
      const textParts = [];
      assistantTurns.forEach((turn) => {
        const cleanText = (turn.textContent || "").trim();
        if (cleanText) {
          htmlParts.push(`<p>${esc2(cleanText).replace(/\n+/g, "</p><p>")}</p>`);
          textParts.push(cleanText);
        }
      });
      return { title, html: htmlParts.join("\n"), text: textParts.join("\n\n") };
    }
    const candidate = document.querySelector("article") || document.querySelector("main") || document.querySelector('[role="main"]') || document.body;
    const paragraphs = [];
    const textBlocks = [];
    const nodes = candidate.querySelectorAll("h1, h2, h3, p, blockquote, li, img");
    nodes.forEach((n) => {
      if (n.closest("nav, header, footer, aside, #verba-ui-root")) return;
      if (n.tagName === "IMG") {
        const src = n.src;
        if (src && n.width > 120) {
          paragraphs.push(`<img src="${esc2(src)}" alt="">`);
        }
        return;
      }
      const txt = (n.textContent || "").replace(/\s+/g, " ").trim();
      if (txt.length < 2) return;
      const tag = n.tagName.toLowerCase();
      if (tag === "h1" || tag === "h2" || tag === "h3") {
        paragraphs.push(`<${tag}>${esc2(txt)}</${tag}>`);
      } else {
        paragraphs.push(`<p>${esc2(txt)}</p>`);
      }
      textBlocks.push(txt);
    });
    if (paragraphs.length === 0) {
      const fallback = (document.body.innerText || "").trim();
      for (const line of fallback.split(/\n+/)) {
        if (line.trim()) {
          paragraphs.push(`<p>${esc2(line.trim())}</p>`);
          textBlocks.push(line.trim());
        }
      }
    }
    return {
      title,
      html: paragraphs.join("\n"),
      text: textBlocks.join("\n\n")
    };
  }
  async toggleReaderView() {
    if (this.isReaderOpen) {
      this.closeReaderView();
      return;
    }
    const extracted = this.extractArticleFromPage();
    this.isReaderOpen = true;
    this.readerEl.hidden = false;
    this.renderReaderView(extracted.title, extracted.html);
    sendBgMessage({
      type: "SAVE_ARTICLE_TO_SHELF",
      lang: this.settings.activeLang,
      title: extracted.title,
      url: location.href,
      html: extracted.html,
      text: extracted.text
    }).catch(() => {
    });
  }
  closeReaderView() {
    this.isReaderOpen = false;
    this.readerEl.hidden = true;
  }
  renderReaderView(title, bodyHtml) {
    const paper = this.settings.readerTheme || "dark";
    this.readerEl.dataset.paper = paper;
    const fontStack = this.settings.readerFont === "sans" ? "var(--sans)" : this.settings.readerFont === "mono" ? "var(--mono)" : this.settings.readerFont === "custom" && this.settings.customFontName ? `"${this.settings.customFontName}", var(--serif)` : "var(--serif)";
    this.readerEl.innerHTML = `
      <div class="reader-bar">
        <span class="reader-bar-title">${esc2(title)}</span>
        <button type="button" class="wp-btn-ghost" data-paper-pick="white">White</button>
        <button type="button" class="wp-btn-ghost" data-paper-pick="sepia">Light yellow</button>
        <button type="button" class="wp-btn-ghost" data-paper-pick="dark">Dark</button>
        <button type="button" class="wp-btn-ghost" id="rv-font-dec">A\u2212</button>
        <button type="button" class="wp-btn-ghost" id="rv-font-inc">A+</button>
        <select id="rv-font-sel" class="wp-btn-ghost">
          <option value="serif" ${this.settings.readerFont === "serif" ? "selected" : ""}>Aa \xB7 Serif</option>
          <option value="sans" ${this.settings.readerFont === "sans" ? "selected" : ""}>Aa \xB7 Sans</option>
          <option value="mono" ${this.settings.readerFont === "mono" ? "selected" : ""}>Aa \xB7 Mono</option>
        </select>
        <button type="button" class="wp-btn-ghost" id="rv-sentence-btn" title="Sentence by sentence (Shift+S)">Sentence by sentence</button>
        <button type="button" class="wp-btn-ghost" id="rv-tts-btn" title="Read aloud (Shift+R)">\u{1F50A} Read aloud</button>
        <button type="button" class="wp-btn-ghost" id="rv-close-btn" title="Back to page (Esc)">\u2715 Back</button>
      </div>
      <div class="reader-scroll">
        <article class="reader-article" id="rv-article-body" style="font-size:${this.settings.readerFontSize}px;font-family:${fontStack}">
          <h1>${esc2(title)}</h1>
          ${bodyHtml}
        </article>
      </div>
    `;
    const articleBody = this.readerEl.querySelector("#rv-article-body");
    if (articleBody) {
      this.highlighter.scanAndHighlight(articleBody);
      this.bindWordInteractions(articleBody);
    }
    this.readerEl.querySelectorAll("[data-paper-pick]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const nextPaper = btn.dataset.paperPick;
        this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { readerTheme: nextPaper } });
        this.renderReaderView(title, bodyHtml);
      });
    });
    this.readerEl.querySelector("#rv-font-dec")?.addEventListener("click", async () => {
      const next = Math.max(13, this.settings.readerFontSize - 2);
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { readerFontSize: next } });
      this.renderReaderView(title, bodyHtml);
    });
    this.readerEl.querySelector("#rv-font-inc")?.addEventListener("click", async () => {
      const next = Math.min(34, this.settings.readerFontSize + 2);
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { readerFontSize: next } });
      this.renderReaderView(title, bodyHtml);
    });
    this.readerEl.querySelector("#rv-font-sel")?.addEventListener("change", async (e) => {
      const val = e.target.value;
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { readerFont: val } });
      this.renderReaderView(title, bodyHtml);
    });
    this.readerEl.querySelector("#rv-sentence-btn")?.addEventListener("click", () => {
      this.openSentenceBySentence(articleBody?.innerText || "");
    });
    this.readerEl.querySelector("#rv-tts-btn")?.addEventListener("click", () => {
      this.toggleReadAloud(articleBody?.innerText || "");
    });
    this.readerEl.querySelector("#rv-close-btn")?.addEventListener("click", () => this.closeReaderView());
  }
  openSentenceBySentence(sourceText) {
    if (this.isSentenceModeOpen) {
      this.closeSentenceBySentence();
      return;
    }
    const raw = sourceText || this.extractArticleFromPage().text;
    this.sentences = splitIntoSentences(raw);
    if (this.sentences.length === 0) return;
    this.sentenceIdx = 0;
    this.isSentenceModeOpen = true;
    this.sentenceModalEl.hidden = false;
    this.renderSentenceCard();
  }
  closeSentenceBySentence() {
    this.isSentenceModeOpen = false;
    this.sentenceModalEl.hidden = true;
  }
  stepSentence(delta) {
    if (!this.isSentenceModeOpen || this.sentences.length === 0) return;
    this.sentenceIdx = Math.max(0, Math.min(this.sentences.length - 1, this.sentenceIdx + delta));
    this.renderSentenceCard();
    if (this.isReadingAloud && !this.isReadingPaused) {
      this.speakActiveSentenceLoop();
    }
  }
  toggleSentenceTranslation() {
    if (!this.isSentenceModeOpen) return;
    this.showSentenceTranslation = !this.showSentenceTranslation;
    this.renderSentenceCard();
  }
  jumpSentenceByUnknown(frequentOnly, dir) {
    const list = this.sentences.length ? this.sentences : splitIntoSentences(this.extractArticleFromPage().text);
    if (!list.length) return;
    for (let step = 1; step <= list.length; step++) {
      const idx = (this.sentenceIdx + dir * step + list.length) % list.length;
      const s = list[idx];
      const tempDiv = document.createElement("div");
      tempDiv.textContent = s;
      this.highlighter.scanAndHighlight(tempDiv);
      const candidates = Array.from(tempDiv.querySelectorAll("verba-w")).filter((w) => {
        const st = w.dataset.s;
        if (st !== "0" && st !== "1" && st !== "2" && st !== "3" && st !== "4") return false;
        if (frequentOnly) return Boolean(w.dataset.rank && Number(w.dataset.rank) <= 5e3);
        return true;
      });
      if (candidates.length > 0) {
        this.sentenceIdx = idx;
        if (this.isSentenceModeOpen) this.renderSentenceCard();
        return;
      }
    }
  }
  async renderSentenceCard() {
    if (!this.isSentenceModeOpen) return;
    const current = this.sentences[this.sentenceIdx] || "";
    let trans = "";
    if (this.showSentenceTranslation && current) {
      if (this.sentenceTranslationCache.has(current)) {
        trans = this.sentenceTranslationCache.get(current);
      } else {
        const res = await sendBgMessage({
          type: "TRANSLATE",
          text: current,
          sourceLang: this.settings.activeLang
        });
        trans = res?.translation || "";
        this.sentenceTranslationCache.set(current, trans);
      }
    }
    this.sentenceModalEl.innerHTML = `
      <div class="sentence-card" data-paper="${this.settings.readerTheme || "dark"}">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:var(--ink-3);">
          <span>Sentence ${this.sentenceIdx + 1} / ${this.sentences.length}</span>
          <div style="display:flex;gap:6px;">
            <button type="button" class="wp-btn-ghost" id="sc-speak" title="Say sentence (Shift+V)">\u{1F50A}</button>
            <button type="button" class="wp-btn-ghost" id="sc-trans" title="Toggle translation (E)">Translation</button>
            <button type="button" class="wp-btn-ghost" id="sc-pause-each" aria-pressed="${this.pauseAfterEachSentence}">${this.pauseAfterEachSentence ? "\u23F8 Pause each: ON" : "Pause each"}</button>
            <button type="button" class="wp-btn-ghost" id="sc-close" title="Exit (Esc)">\u2715</button>
          </div>
        </div>
        <div class="sentence-body" id="sc-body">${esc2(current)}</div>
        ${this.showSentenceTranslation ? `<div class="sentence-trans">${esc2(trans)}</div>` : ""}
        <div class="sentence-controls">
          <button type="button" class="wp-btn-ghost" id="sc-prev">\u2039 Previous (A)</button>
          <span><kbd>A</kbd> / <kbd>D</kbd> turn \xB7 <kbd>E</kbd> translate \xB7 <kbd>Space</kbd> read aloud</span>
          <button type="button" class="wp-btn-ghost" id="sc-next">Next (D) \u203A</button>
        </div>
      </div>
    `;
    const bodyEl = this.sentenceModalEl.querySelector("#sc-body");
    if (bodyEl) {
      this.highlighter.scanAndHighlight(bodyEl);
      this.bindWordInteractions(bodyEl);
    }
    this.sentenceModalEl.querySelector("#sc-prev")?.addEventListener("click", () => this.stepSentence(-1));
    this.sentenceModalEl.querySelector("#sc-next")?.addEventListener("click", () => this.stepSentence(1));
    this.sentenceModalEl.querySelector("#sc-trans")?.addEventListener("click", () => this.toggleSentenceTranslation());
    this.sentenceModalEl.querySelector("#sc-speak")?.addEventListener("click", () => {
      speakText(current, this.settings.activeLang, this.settings);
    });
    this.sentenceModalEl.querySelector("#sc-pause-each")?.addEventListener("click", () => {
      this.pauseAfterEachSentence = !this.pauseAfterEachSentence;
      this.renderSentenceCard();
    });
    this.sentenceModalEl.querySelector("#sc-close")?.addEventListener("click", () => this.closeSentenceBySentence());
  }
  toggleReadAloud(customText) {
    if (this.isReadingAloud) {
      if (this.isReadingPaused) {
        this.isReadingPaused = false;
        this.ttsStartedAt = Date.now();
        this.speakActiveSentenceLoop();
      } else {
        this.pauseReadAloud();
      }
      this.renderTtsBar();
      return;
    }
    const raw = customText || this.extractArticleFromPage().text;
    this.sentences = splitIntoSentences(raw);
    if (this.sentences.length === 0) return;
    if (!this.isSentenceModeOpen) this.sentenceIdx = 0;
    this.isReadingAloud = true;
    this.isReadingPaused = false;
    this.ttsStartedAt = Date.now();
    this.ttsBarEl.hidden = false;
    this.renderTtsBar();
    this.speakActiveSentenceLoop();
  }
  pauseReadAloud() {
    if (!this.isReadingAloud || this.isReadingPaused) return;
    this.isReadingPaused = true;
    stopSpeaking();
    this.creditListeningElapsed();
    this.renderTtsBar();
  }
  stopReadAloud() {
    if (!this.isReadingAloud) return;
    stopSpeaking();
    this.creditListeningElapsed();
    this.isReadingAloud = false;
    this.isReadingPaused = false;
    this.ttsBarEl.hidden = true;
  }
  creditListeningElapsed() {
    if (!this.ttsStartedAt) return;
    const secs = Math.round((Date.now() - this.ttsStartedAt) / 1e3);
    this.ttsStartedAt = 0;
    if (secs >= 2) {
      sendBgMessage({
        type: "RECORD_LISTENING_SECONDS",
        lang: this.settings.activeLang,
        seconds: secs,
        title: `Read aloud \xB7 ${document.title || "Page"}`,
        domain: location.hostname || "reader"
      }).catch(() => {
      });
    }
  }
  speakActiveSentenceLoop() {
    if (!this.isReadingAloud || this.isReadingPaused) return;
    const text = this.sentences[this.sentenceIdx];
    if (!text) {
      this.stopReadAloud();
      return;
    }
    if (this.isSentenceModeOpen) this.renderSentenceCard();
    this.renderTtsBar();
    speakText(text, this.settings.activeLang, this.settings, () => {
      if (!this.isReadingAloud || this.isReadingPaused) return;
      if (this.pauseAfterEachSentence) {
        this.pauseReadAloud();
        return;
      }
      if (this.sentenceIdx + 1 < this.sentences.length) {
        this.sentenceIdx++;
        this.speakActiveSentenceLoop();
      } else {
        this.stopReadAloud();
      }
    });
  }
  renderTtsBar() {
    if (!this.isReadingAloud) {
      this.ttsBarEl.hidden = true;
      return;
    }
    this.ttsBarEl.hidden = false;
    this.ttsBarEl.innerHTML = `
      <button type="button" class="island-btn" id="tts-prev" title="Previous sentence">\u23EE</button>
      <button type="button" class="island-btn" id="tts-toggle">${this.isReadingPaused ? "\u25B6 Resume" : "\u23F8 Pause"}</button>
      <button type="button" class="island-btn" id="tts-next" title="Next sentence">\u23ED</button>
      <span style="color:var(--ink-2);font-variant-numeric:tabular-nums;">${this.sentenceIdx + 1}/${this.sentences.length}</span>
      <select id="tts-speed" style="height:24px;border-radius:6px;background:var(--surface-2);color:var(--ink);border:1px solid var(--border);font-size:12px;">
        ${[0.75, 1, 1.25, 1.5, 1.75, 2].map((sp) => `<option value="${sp}" ${this.settings.voiceSpeed === sp ? "selected" : ""}>${sp}\xD7</option>`).join("")}
      </select>
      <button type="button" class="island-btn" id="tts-stop" title="Stop Read Aloud (Esc)">\u2715</button>
    `;
    this.ttsBarEl.querySelector("#tts-prev")?.addEventListener("click", () => {
      this.sentenceIdx = Math.max(0, this.sentenceIdx - 1);
      this.speakActiveSentenceLoop();
    });
    this.ttsBarEl.querySelector("#tts-toggle")?.addEventListener("click", () => this.toggleReadAloud());
    this.ttsBarEl.querySelector("#tts-next")?.addEventListener("click", () => {
      this.sentenceIdx = Math.min(this.sentences.length - 1, this.sentenceIdx + 1);
      this.speakActiveSentenceLoop();
    });
    this.ttsBarEl.querySelector("#tts-speed")?.addEventListener("change", async (e) => {
      const sp = Number(e.target.value);
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { voiceSpeed: sp } });
      if (!this.isReadingPaused) this.speakActiveSentenceLoop();
    });
    this.ttsBarEl.querySelector("#tts-stop")?.addEventListener("click", () => this.stopReadAloud());
  }
  openAskAiModal(sentence, translation) {
    const cleanSent = sentence.trim() || this.sentences[this.sentenceIdx] || window.getSelection()?.toString().trim() || document.title;
    this.askModalEl.hidden = false;
    this.askModalEl.innerHTML = `
      <div class="ask-box">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:var(--ink);font-size:16px;">Ask your AI chat (${esc2(this.settings.askAiChatProvider)})</b>
          <button type="button" class="wp-icon-btn" id="ask-close">\u2715</button>
        </div>
        <div class="ask-quote">${esc2(cleanSent)}</div>
        <textarea class="ask-textarea" id="ask-input" placeholder="Ask a question about grammar, nuance, or why it is said this way\u2026 (Enter to ask)"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
          <button type="button" class="wp-btn-ghost" id="ask-cancel">Cancel</button>
          <button type="button" class="wp-btn-sm" id="ask-submit">Ask \u2197</button>
        </div>
      </div>
    `;
    const textarea = this.askModalEl.querySelector("#ask-input");
    textarea?.focus();
    const submit = () => {
      const q = textarea?.value || "";
      const built = buildAskAiChatUrl(this.settings, {
        sentence: cleanSent,
        context: cleanSent,
        title: document.title,
        lang: this.settings.activeLang,
        userQuestion: q,
        translation
      });
      navigator.clipboard?.writeText(built.fullPrompt).catch(() => {
      });
      window.open(built.url, "_blank", "noopener");
      this.askModalEl.hidden = true;
    };
    textarea?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      } else if (e.key === "Escape") {
        this.askModalEl.hidden = true;
      }
    });
    this.askModalEl.querySelector("#ask-submit")?.addEventListener("click", submit);
    this.askModalEl.querySelector("#ask-cancel")?.addEventListener("click", () => {
      this.askModalEl.hidden = true;
    });
    this.askModalEl.querySelector("#ask-close")?.addEventListener("click", () => {
      this.askModalEl.hidden = true;
    });
  }
};
function splitIntoSentences(text) {
  const raw = text.split(/(?<=[.!?。！？\n])\s+/).map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.length >= 2);
  return raw;
}
function esc2(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/content/captions.ts
var VerbaCaptions = class {
  constructor(shadow, highlighter, settings, langOpts, bindWordInteractions) {
    this.shadow = shadow;
    this.highlighter = highlighter;
    this.settings = settings;
    this.langOpts = langOpts;
    this.bindWordInteractions = bindWordInteractions;
    this.stageEl = document.createElement("div");
    this.stageEl.className = "vc-stage";
    this.stageEl.hidden = true;
    this.pillEl = document.createElement("div");
    this.pillEl.className = "vc-pill";
    this.pillEl.hidden = true;
    this.menuEl = document.createElement("div");
    this.menuEl.className = "vc-menu";
    this.menuEl.hidden = true;
    this.drawerEl = document.createElement("div");
    this.drawerEl.className = "vc-drawer";
    this.drawerEl.hidden = true;
    this.toastEl = document.createElement("div");
    this.toastEl.className = "vc-toast";
    this.toastEl.hidden = true;
    this.shadow.appendChild(this.stageEl);
    this.shadow.appendChild(this.pillEl);
    this.shadow.appendChild(this.menuEl);
    this.shadow.appendChild(this.drawerEl);
    this.shadow.appendChild(this.toastEl);
  }
  stageEl;
  pillEl;
  menuEl;
  drawerEl;
  toastEl;
  videoEl = null;
  cues = [];
  activeCueIdx = -1;
  subtitleOffsetSec = 0;
  loopCurrentLine = false;
  menuOpen = false;
  drawerOpen = false;
  drawerTab = "transcript";
  wordsFilter = "both";
  peekStep = 0;
  // E/Z temporary unblur step
  pauseAtEndOfCueIdx = -1;
  tickHandle = null;
  lastListeningCreditTime = 0;
  commonHopIdx = -1;
  boundVideos = /* @__PURE__ */ new WeakSet();
  initPageVideoWatcher() {
    this.injectYouTubeSearchHelpers();
    const scanVideos = () => {
      const v = document.querySelector("video");
      if (v && v !== this.videoEl) {
        this.attachToVideo(v);
      }
    };
    scanVideos();
    window.setInterval(scanVideos, 2e3);
  }
  attachToVideo(video, initialCues) {
    this.videoEl = video;
    if (initialCues?.length) {
      this.cues = initialCues;
    } else {
      this.extractNativeTracks(video);
    }
    if (!this.boundVideos.has(video)) {
      this.boundVideos.add(video);
      video.addEventListener("dragover", (e) => e.preventDefault());
      video.addEventListener("drop", async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer?.files || []);
        if (files[0]) {
          const text = await files[0].text();
          const parsed = parseSubtitleFile(text, files[0].name);
          if (files[1]) {
            const transText = await files[1].text();
            const transCues = parseSubtitleFile(transText, files[1].name);
            this.mergeTranslationsIntoCues(parsed, transCues);
          }
          this.setCues(parsed);
          this.showNote(`Loaded ${parsed.length} subtitle lines`);
        }
      });
    }
    this.renderPill();
    this.startPlaybackLoop();
  }
  setCues(cues) {
    this.cues = cues;
    this.activeCueIdx = -1;
    this.renderPill();
    this.updateActiveCue(true);
    if (this.drawerOpen) this.renderDrawer();
  }
  mergeTranslationsIntoCues(primary, secondary) {
    for (const c of primary) {
      const mid = (c.start + c.end) / 2;
      const match = secondary.find((s) => mid >= s.start - 0.6 && mid <= s.end + 0.6);
      if (match) c.translation = match.text;
    }
  }
  extractNativeTracks(video) {
    const tracks = Array.from(video.textTracks || []);
    const match = tracks.find((t) => t.language?.toLowerCase().startsWith(this.settings.activeLang)) || tracks[0];
    if (!match) return;
    match.mode = "hidden";
    const readTrackCues = () => {
      const list = Array.from(match.cues || []);
      if (list.length > 0) {
        this.cues = list.map((c, idx) => ({
          id: `vtt_${idx}`,
          start: c.startTime,
          end: c.endTime,
          text: (c.text || "").replace(/<[^>]+>/g, "").trim()
        }));
        this.renderPill();
      }
    };
    readTrackCues();
    match.addEventListener("cuechange", readTrackCues);
  }
  startPlaybackLoop() {
    if (this.tickHandle) window.clearInterval(this.tickHandle);
    this.lastListeningCreditTime = this.videoEl?.currentTime || 0;
    this.tickHandle = window.setInterval(() => {
      const v = this.videoEl;
      if (!v) return;
      if (!v.paused && !v.ended) {
        const delta = v.currentTime - this.lastListeningCreditTime;
        if (delta >= 10 && delta < 30) {
          this.lastListeningCreditTime = v.currentTime;
          sendBgMessage({
            type: "RECORD_LISTENING_SECONDS",
            lang: this.settings.activeLang,
            seconds: Math.round(delta / (v.playbackRate || 1)),
            title: document.title || "Video",
            domain: location.hostname || "video"
          }).catch(() => {
          });
        } else if (delta < 0 || delta >= 30) {
          this.lastListeningCreditTime = v.currentTime;
        }
      }
      if (!this.settings.captionsEnabled || this.cues.length === 0) {
        this.stageEl.hidden = true;
        return;
      }
      this.updateActiveCue(false);
    }, 90);
  }
  updateActiveCue(forceRender) {
    const v = this.videoEl;
    if (!v || !this.settings.captionsEnabled || this.cues.length === 0) {
      this.stageEl.hidden = true;
      return;
    }
    const now = v.currentTime - this.subtitleOffsetSec;
    const prevCue = this.cues[this.activeCueIdx];
    if (prevCue && now >= prevCue.end - 0.08 && !v.paused) {
      if (this.loopCurrentLine) {
        v.currentTime = prevCue.start + this.subtitleOffsetSec;
        return;
      }
      if (this.pauseAtEndOfCueIdx === this.activeCueIdx) {
        v.pause();
        this.pauseAtEndOfCueIdx = -1;
        return;
      }
      if (this.settings.autoPauseEachLine) {
        const shouldPause = !this.settings.autoPauseOnlyNewWords || this.cueHasUnknownWords(prevCue);
        if (shouldPause) {
          v.pause();
          return;
        }
      }
    }
    const idx = this.cues.findIndex((c) => now >= c.start && now <= c.end);
    if (idx !== this.activeCueIdx || forceRender) {
      this.activeCueIdx = idx;
      this.peekStep = 0;
      this.renderActiveSubtitle();
      if (this.drawerOpen && this.drawerTab === "transcript") {
        this.highlightTranscriptCue();
      }
    } else if (idx >= 0 && this.settings.karaokeMode) {
      this.updateKaraokeHighlight(now, this.cues[idx]);
    }
  }
  cueHasUnknownWords(cue) {
    const tmp = document.createElement("div");
    tmp.textContent = cue.text;
    this.highlighter.scanAndHighlight(tmp);
    return Array.from(tmp.querySelectorAll("verba-w")).some(
      (el) => el.dataset.s === "0" || el.dataset.s === "1" || el.dataset.s === "2" || el.dataset.s === "3" || el.dataset.s === "4"
    );
  }
  updateKaraokeHighlight(now, cue) {
    const words = Array.from(this.stageEl.querySelectorAll("verba-w"));
    if (words.length === 0) return;
    const ratio = Math.max(0, Math.min(0.999, (now - cue.start) / Math.max(0.2, cue.end - cue.start)));
    const activeWordIdx = Math.floor(ratio * words.length);
    words.forEach((w, i) => {
      if (i === activeWordIdx) w.dataset.speaking = "1";
      else delete w.dataset.speaking;
    });
  }
  renderPill() {
    if (!this.videoEl) {
      this.pillEl.hidden = true;
      return;
    }
    const rect = this.videoEl.getBoundingClientRect();
    if (rect.width < 160 || rect.height < 100) {
      this.pillEl.hidden = true;
      return;
    }
    this.pillEl.hidden = false;
    this.pillEl.style.top = `${Math.max(12, Math.round(rect.top + 12))}px`;
    this.pillEl.style.left = `${Math.max(12, Math.round(rect.left + 12))}px`;
    const hasSubs = this.cues.length > 0;
    const label = !this.settings.captionsEnabled ? "Captions OFF" : hasSubs ? `Captions ON \xB7 ${this.cues.length}` : `no ${this.settings.activeLang.toUpperCase()}`;
    this.pillEl.innerHTML = `
      <button type="button" class="island-btn" id="cc-gear-btn" title="Caption settings">\u2699</button>
      <button type="button" class="island-btn" id="cc-toggle-btn" title="Toggle Captions (C)">${esc3(label)}</button>
      <button type="button" class="island-btn" id="cc-drawer-btn" title="Transcript & Words in this video (W)">\u2630</button>
    `;
    this.pillEl.querySelector("#cc-gear-btn")?.addEventListener("click", () => {
      this.menuOpen = !this.menuOpen;
      this.renderMenu();
    });
    this.pillEl.querySelector("#cc-toggle-btn")?.addEventListener("click", () => this.toggleEnabled());
    this.pillEl.querySelector("#cc-drawer-btn")?.addEventListener("click", () => this.toggleWordsOrTranscriptDrawer());
  }
  async renderActiveSubtitle(goldWordKey) {
    if (!this.videoEl || !this.settings.captionsEnabled || this.activeCueIdx < 0) {
      this.stageEl.hidden = true;
      return;
    }
    const cue = this.cues[this.activeCueIdx];
    if (!cue) {
      this.stageEl.hidden = true;
      return;
    }
    if (this.settings.hideKnownLines && this.peekStep === 0 && !this.cueHasUnknownWords(cue)) {
      this.stageEl.hidden = true;
      return;
    }
    const rect = this.videoEl.getBoundingClientRect();
    const topPx = rect.top + rect.height * (this.settings.subtitleVerticalPct / 100);
    this.stageEl.style.top = `${Math.max(40, Math.min(window.innerHeight - 90, Math.round(topPx)))}px`;
    this.stageEl.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    this.stageEl.hidden = false;
    if (!cue.translation && this.settings.googleTranslateMissingSubs && this.settings.translationMode !== "hide") {
      sendBgMessage({
        type: "TRANSLATE",
        text: cue.text,
        sourceLang: this.settings.activeLang
      }).then((res) => {
        if (res?.translation) {
          cue.translation = res.translation;
          if (this.cues[this.activeCueIdx] === cue) this.renderActiveSubtitle(goldWordKey);
        }
      }).catch(() => {
      });
    }
    const subBlurred = this.settings.subtitleMode === "blur" && this.peekStep < 1;
    const subHidden = this.settings.subtitleMode === "hide" && this.peekStep < 1;
    const transBlurred = this.settings.translationMode === "blur" && this.peekStep < 2;
    const transHidden = this.settings.translationMode === "hide" && this.peekStep < 2;
    const bgAlpha = (this.settings.subtitleBgOpacity / 100).toFixed(2);
    const fontCss = this.settings.subtitleFont === "serif" ? "var(--serif)" : this.settings.subtitleFont === "mono" ? "var(--mono)" : "var(--sans)";
    this.stageEl.innerHTML = `
      <div class="vc-box" style="background:rgb(17 17 16 / ${bgAlpha});font-family:${fontCss};">
        ${subHidden ? `<div style="color:var(--ink-3);font-size:13px;">[Subtitle hidden \xB7 press E to peek]</div>` : `<div class="vc-line ${subBlurred ? "blurred" : ""}" id="cc-sub-line" data-size="${this.settings.subtitleSize}">${esc3(cue.text)}</div>`}
        ${cue.translation && !transHidden ? `<div class="vc-trans ${transBlurred ? "blurred" : ""}" data-size="${this.settings.translationSize}">${esc3(cue.translation)}</div>` : ""}
      </div>
      <div class="vc-side-btns">
        <button type="button" class="vc-mini-btn" id="cc-prev" title="Previous line (A)">\u23EE</button>
        <button type="button" class="vc-mini-btn" id="cc-replay" title="Replay line (S)">\u21BA</button>
        <button type="button" class="vc-mini-btn" id="cc-next" title="Next line (D)">\u23ED</button>
        <button type="button" class="vc-mini-btn" id="cc-loop" title="Loop line" style="${this.loopCurrentLine ? "border-color:#3b82f6;color:#93c5fd;" : ""}">\u221E</button>
      </div>
    `;
    const lineEl = this.stageEl.querySelector("#cc-sub-line");
    if (lineEl) {
      this.highlighter.scanAndHighlight(lineEl);
      this.bindWordInteractions(lineEl);
      lineEl.querySelectorAll("verba-w").forEach((wEl) => {
        if (goldWordKey && (wEl.dataset.key === goldWordKey || wEl.dataset.w === goldWordKey)) {
          wEl.dataset.freqRing = "1";
        }
        wEl.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const curS = wEl.dataset.s;
          const nextStatus = curS === "5" ? 1 : 5;
          wEl.dataset.s = String(nextStatus);
          sendBgMessage({
            type: "GRADE_WORD",
            lang: this.settings.activeLang,
            word: wEl.dataset.w || "",
            status: nextStatus,
            contextSentence: cue.text
          }).then((res) => {
            if (res?.record) {
              this.highlighter.wordMap.set(res.record.word, res.record);
              this.highlighter.refreshAllStatuses(false);
              this.renderActiveSubtitle();
            }
            this.showNote(nextStatus === 5 ? "Known" : "Level 1");
          });
        });
      });
    }
    this.stageEl.querySelector("#cc-prev")?.addEventListener("click", () => this.jumpRelativeLine(-1));
    this.stageEl.querySelector("#cc-replay")?.addEventListener("click", () => this.replayCurrentLine());
    this.stageEl.querySelector("#cc-next")?.addEventListener("click", () => this.jumpRelativeLine(1));
    this.stageEl.querySelector("#cc-loop")?.addEventListener("click", () => {
      this.loopCurrentLine = !this.loopCurrentLine;
      this.renderActiveSubtitle();
    });
  }
  async toggleEnabled() {
    this.settings = await sendBgMessage({
      type: "SAVE_SETTINGS",
      patch: { captionsEnabled: !this.settings.captionsEnabled }
    });
    this.renderPill();
    this.updateActiveCue(true);
    this.showNote(this.settings.captionsEnabled ? "Captions ON" : "Captions OFF");
  }
  jumpRelativeLine(delta) {
    if (!this.videoEl || this.cues.length === 0) return;
    const base = this.activeCueIdx >= 0 ? this.activeCueIdx : this.findNearestCueIdx();
    const targetIdx = Math.max(0, Math.min(this.cues.length - 1, base + delta));
    const target = this.cues[targetIdx];
    if (target) {
      this.videoEl.currentTime = Math.max(0, target.start + this.subtitleOffsetSec + 0.02);
      this.videoEl.play().catch(() => {
      });
      this.activeCueIdx = targetIdx;
      this.renderActiveSubtitle();
    }
  }
  replayCurrentLine(resetBlur = false) {
    if (!this.videoEl || this.cues.length === 0) return;
    const idx = this.activeCueIdx >= 0 ? this.activeCueIdx : this.findNearestCueIdx();
    const cue = this.cues[idx];
    if (!cue) return;
    if (resetBlur) this.peekStep = 0;
    this.videoEl.currentTime = Math.max(0, cue.start + this.subtitleOffsetSec + 0.02);
    this.videoEl.play().catch(() => {
    });
    this.renderActiveSubtitle();
  }
  async toggleAutoPause() {
    this.settings = await sendBgMessage({
      type: "SAVE_SETTINGS",
      patch: { autoPauseEachLine: !this.settings.autoPauseEachLine }
    });
    this.showNote(this.settings.autoPauseEachLine ? "Auto-pause ON" : "Auto-pause OFF");
    if (this.menuOpen) this.renderMenu();
  }
  peekLayers() {
    this.peekStep = (this.peekStep + 1) % 3;
    this.renderActiveSubtitle();
  }
  async toggleHideKnownLines() {
    this.settings = await sendBgMessage({
      type: "SAVE_SETTINGS",
      patch: { hideKnownLines: !this.settings.hideKnownLines }
    });
    this.showNote(this.settings.hideKnownLines ? "Hide known lines ON" : "Hide known lines OFF");
    this.renderActiveSubtitle();
  }
  async cycleBandFilter() {
    const steps = ["all", "top500", "top1500", "top3000", "top5000", "top10000"];
    const next = steps[(steps.indexOf(this.settings.vocabBandFilter) + 1) % steps.length];
    this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { vocabBandFilter: next } });
    this.highlighter.settings = this.settings;
    this.highlighter.refreshAllStatuses(false);
    this.renderActiveSubtitle();
    this.showNote(`Vocabulary band: ${next}`);
  }
  adjustSubtitleTiming(deltaSec) {
    this.subtitleOffsetSec = Math.round((this.subtitleOffsetSec + deltaSec) * 100) / 100;
    const sign = this.subtitleOffsetSec >= 0 ? "+" : "";
    this.showNote(`Subtitle timing: ${sign}${this.subtitleOffsetSec.toFixed(2)}s`);
    this.updateActiveCue(true);
  }
  snapSubtitleToNow(dir) {
    if (!this.videoEl || this.cues.length === 0) return;
    const base = this.activeCueIdx >= 0 ? this.activeCueIdx : this.findNearestCueIdx();
    const target = this.cues[Math.max(0, Math.min(this.cues.length - 1, base + dir))];
    if (!target) return;
    this.subtitleOffsetSec = Math.round((this.videoEl.currentTime - target.start) * 100) / 100;
    this.showNote(`Snapped subtitle (${this.subtitleOffsetSec >= 0 ? "+" : ""}${this.subtitleOffsetSec.toFixed(2)}s)`);
    this.updateActiveCue(true);
  }
  jumpLineWithUnknownWord(frequentOnly, dir) {
    if (!this.videoEl || this.cues.length === 0) return;
    const start = this.activeCueIdx >= 0 ? this.activeCueIdx : 0;
    for (let step = 1; step <= this.cues.length; step++) {
      const idx = (start + dir * step + this.cues.length) % this.cues.length;
      const cue = this.cues[idx];
      const tmp = document.createElement("div");
      tmp.textContent = cue.text;
      this.highlighter.scanAndHighlight(tmp);
      const unknowns = Array.from(tmp.querySelectorAll("verba-w")).filter((w) => {
        const s = w.dataset.s;
        if (s !== "0" && s !== "1" && s !== "2" && s !== "3" && s !== "4") return false;
        if (frequentOnly) return Boolean(w.dataset.rank && Number(w.dataset.rank) <= 5e3);
        return true;
      });
      if (unknowns.length > 0) {
        unknowns.sort((a, b) => Number(a.dataset.rank || 999999) - Number(b.dataset.rank || 999999));
        const commonestKey = unknowns[0].dataset.key || unknowns[0].dataset.w;
        this.activeCueIdx = idx;
        this.videoEl.currentTime = Math.max(0, cue.start + this.subtitleOffsetSec + 0.02);
        this.videoEl.play().catch(() => {
        });
        this.renderActiveSubtitle(commonestKey);
        return;
      }
    }
    this.showNote("No matching unknown lines");
  }
  hopMostCommonVideoWords(dir) {
    if (!this.videoEl || this.cues.length === 0) return;
    const rankedList = [];
    const seen = /* @__PURE__ */ new Set();
    this.cues.forEach((cue2, cueIdx) => {
      const tmp = document.createElement("div");
      tmp.textContent = cue2.text;
      this.highlighter.scanAndHighlight(tmp);
      tmp.querySelectorAll("verba-w").forEach((w) => {
        const s = w.dataset.s;
        const key = w.dataset.key || w.dataset.w || "";
        const rank = Number(w.dataset.rank || 999999);
        if ((s === "0" || s === "1" || s === "2" || s === "3" || s === "4") && !seen.has(key)) {
          seen.add(key);
          rankedList.push({ cueIdx, key, rank });
        }
      });
    });
    rankedList.sort((a, b) => a.rank - b.rank);
    if (rankedList.length === 0) {
      this.showNote("All video words known!");
      return;
    }
    this.commonHopIdx = (this.commonHopIdx + dir + rankedList.length) % rankedList.length;
    const pick = rankedList[this.commonHopIdx];
    const cue = this.cues[pick.cueIdx];
    this.activeCueIdx = pick.cueIdx;
    this.videoEl.currentTime = Math.max(0, cue.start + this.subtitleOffsetSec + 0.02);
    this.renderActiveSubtitle(pick.key);
  }
  async markCurrentLineKnown() {
    const cue = this.cues[this.activeCueIdx];
    if (!cue) return;
    const tmp = document.createElement("div");
    tmp.textContent = cue.text;
    this.highlighter.scanAndHighlight(tmp);
    const blueWords = Array.from(tmp.querySelectorAll("verba-w")).filter((w) => w.dataset.s === "0").map((w) => w.dataset.key || w.dataset.w || "").filter(Boolean);
    if (blueWords.length > 0) {
      await sendBgMessage({
        type: "BATCH_MARK_KNOWN",
        lang: this.settings.activeLang,
        words: blueWords,
        source: "manual"
      });
      this.showNote(`Marked ${blueWords.length} words Known`);
      if (this.settings.autoResumeOnKnown && this.videoEl?.paused) {
        this.videoEl.play().catch(() => {
        });
      }
    }
  }
  toggleWordsOrTranscriptDrawer(tab) {
    if (tab && this.drawerOpen && this.drawerTab !== tab) {
      this.drawerTab = tab;
      this.renderDrawer();
      return;
    }
    this.drawerOpen = !this.drawerOpen;
    if (tab) this.drawerTab = tab;
    this.drawerEl.hidden = !this.drawerOpen;
    if (this.drawerOpen) {
      if (this.drawerTab === "words") this.videoEl?.pause();
      this.renderDrawer();
    }
  }
  renderMenu() {
    this.menuEl.hidden = !this.menuOpen;
    if (!this.menuOpen) return;
    const pillRect = this.pillEl.getBoundingClientRect();
    this.menuEl.style.top = `${Math.round(pillRect.bottom + 6)}px`;
    this.menuEl.style.left = `${Math.max(12, Math.round(pillRect.left))}px`;
    this.menuEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <b style="color:var(--ink)">Dual Captions Settings</b>
        <button type="button" class="wp-icon-btn" id="cc-menu-close">\u2715</button>
      </div>
      <div class="cc-row">
        <span>Subtitle</span>
        <select id="cc-sub-mode" class="wp-btn-ghost">
          <option value="show" ${this.settings.subtitleMode === "show" ? "selected" : ""}>Show</option>
          <option value="blur" ${this.settings.subtitleMode === "blur" ? "selected" : ""}>Blur</option>
          <option value="hide" ${this.settings.subtitleMode === "hide" ? "selected" : ""}>Hide</option>
        </select>
      </div>
      <div class="cc-row">
        <span>Translation</span>
        <select id="cc-trans-mode" class="wp-btn-ghost">
          <option value="show" ${this.settings.translationMode === "show" ? "selected" : ""}>Show</option>
          <option value="blur" ${this.settings.translationMode === "blur" ? "selected" : ""}>Blur</option>
          <option value="hide" ${this.settings.translationMode === "hide" ? "selected" : ""}>Hide</option>
        </select>
      </div>
      <div class="cc-row">
        <span>Auto-pause after line (Q)</span>
        <input type="checkbox" id="cc-autopause" ${this.settings.autoPauseEachLine ? "checked" : ""}>
      </div>
      <div class="cc-row">
        <span>Only at new words</span>
        <input type="checkbox" id="cc-only-new" ${this.settings.autoPauseOnlyNewWords ? "checked" : ""}>
      </div>
      <div class="cc-row">
        <span>Auto-resume on Known</span>
        <input type="checkbox" id="cc-autoresume" ${this.settings.autoResumeOnKnown ? "checked" : ""}>
      </div>
      <div class="cc-row">
        <span>Karaoke mode</span>
        <input type="checkbox" id="cc-karaoke" ${this.settings.karaokeMode ? "checked" : ""}>
      </div>
      <div class="cc-row">
        <span>Subtitle size</span>
        <select id="cc-sub-size" class="wp-btn-ghost">
          ${["S", "M", "L", "XL"].map((sz) => `<option value="${sz}" ${this.settings.subtitleSize === sz ? "selected" : ""}>${sz}</option>`).join("")}
        </select>
      </div>
      <div class="cc-row">
        <span>Timing (${this.subtitleOffsetSec >= 0 ? "+" : ""}${this.subtitleOffsetSec.toFixed(2)}s)</span>
        <div style="display:flex;gap:4px;">
          <button type="button" class="wp-btn-ghost" id="cc-time-minus">\u22120.25</button>
          <button type="button" class="wp-btn-ghost" id="cc-time-reset">0</button>
          <button type="button" class="wp-btn-ghost" id="cc-time-plus">+0.25</button>
        </div>
      </div>
      <div class="cc-row">
        <span>Load subtitle (.srt/.vtt/.ass)</span>
        <label class="wp-btn-ghost" style="cursor:pointer;display:inline-flex;align-items:center;">
          Choose\u2026
          <input type="file" id="cc-load-srt" accept=".srt,.vtt,.ass" hidden>
        </label>
      </div>
    `;
    this.menuEl.querySelector("#cc-menu-close")?.addEventListener("click", () => {
      this.menuOpen = false;
      this.menuEl.hidden = true;
    });
    this.menuEl.querySelector("#cc-sub-mode")?.addEventListener("change", async (e) => {
      const v = e.target.value;
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { subtitleMode: v } });
      this.renderActiveSubtitle();
    });
    this.menuEl.querySelector("#cc-trans-mode")?.addEventListener("change", async (e) => {
      const v = e.target.value;
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { translationMode: v } });
      this.renderActiveSubtitle();
    });
    this.menuEl.querySelector("#cc-autopause")?.addEventListener("change", (e) => {
      const v = e.target.checked;
      sendBgMessage({ type: "SAVE_SETTINGS", patch: { autoPauseEachLine: v } }).then((s) => {
        this.settings = s;
      });
    });
    this.menuEl.querySelector("#cc-only-new")?.addEventListener("change", (e) => {
      const v = e.target.checked;
      sendBgMessage({ type: "SAVE_SETTINGS", patch: { autoPauseOnlyNewWords: v } }).then((s) => {
        this.settings = s;
      });
    });
    this.menuEl.querySelector("#cc-autoresume")?.addEventListener("change", (e) => {
      const v = e.target.checked;
      sendBgMessage({ type: "SAVE_SETTINGS", patch: { autoResumeOnKnown: v } }).then((s) => {
        this.settings = s;
      });
    });
    this.menuEl.querySelector("#cc-karaoke")?.addEventListener("change", (e) => {
      const v = e.target.checked;
      sendBgMessage({ type: "SAVE_SETTINGS", patch: { karaokeMode: v } }).then((s) => {
        this.settings = s;
      });
    });
    this.menuEl.querySelector("#cc-sub-size")?.addEventListener("change", async (e) => {
      const v = e.target.value;
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { subtitleSize: v } });
      this.renderActiveSubtitle();
    });
    this.menuEl.querySelector("#cc-time-minus")?.addEventListener("click", () => {
      this.adjustSubtitleTiming(-0.25);
      this.renderMenu();
    });
    this.menuEl.querySelector("#cc-time-reset")?.addEventListener("click", () => {
      this.subtitleOffsetSec = 0;
      this.updateActiveCue(true);
      this.renderMenu();
    });
    this.menuEl.querySelector("#cc-time-plus")?.addEventListener("click", () => {
      this.adjustSubtitleTiming(0.25);
      this.renderMenu();
    });
    this.menuEl.querySelector("#cc-load-srt")?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      this.setCues(parseSubtitleFile(text, file.name));
      this.menuOpen = false;
      this.menuEl.hidden = true;
    });
  }
  renderDrawer() {
    if (!this.drawerOpen) return;
    if (this.drawerTab === "transcript") {
      this.drawerEl.innerHTML = `
        <div class="cc-drawer-head">
          <button type="button" class="wp-tab" aria-selected="true" id="dr-tab-tr">Transcript</button>
          <button type="button" class="wp-tab" aria-selected="false" id="dr-tab-wd">Words in video (W)</button>
          <button type="button" class="wp-btn-ghost" id="dr-save-book" style="margin-left:auto" title="Save transcript to Books">Save to Books</button>
          <button type="button" class="wp-icon-btn" id="dr-close">\u2715</button>
        </div>
        <div class="cc-drawer-list" id="dr-list">
          ${this.cues.map(
        (c, idx) => `<div class="cc-cue-item ${idx === this.activeCueIdx ? "active" : ""}" data-cue-idx="${idx}">
                <span class="cc-cue-time">${formatTime(c.start)}</span>
                <span class="cc-cue-text">${esc3(c.text)}</span>
              </div>`
      ).join("")}
        </div>
      `;
      const listEl = this.drawerEl.querySelector("#dr-list");
      if (listEl) {
        this.highlighter.scanAndHighlight(listEl);
        this.bindWordInteractions(listEl);
        listEl.querySelectorAll(".cc-cue-item").forEach((row) => {
          row.addEventListener("click", (e) => {
            if (e.target.closest("verba-w")) return;
            const idx = Number(row.dataset.cueIdx);
            const cue = this.cues[idx];
            if (cue && this.videoEl) {
              this.videoEl.currentTime = cue.start + this.subtitleOffsetSec + 0.02;
              this.videoEl.play().catch(() => {
              });
            }
          });
        });
      }
      this.drawerEl.querySelector("#dr-save-book")?.addEventListener("click", () => {
        const text = this.cues.map((c) => c.text).join("\n\n");
        const html = this.cues.map((c) => `<p>${esc3(c.text)}</p>`).join("\n");
        sendBgMessage({
          type: "SAVE_ARTICLE_TO_SHELF",
          lang: this.settings.activeLang,
          title: `Transcript \xB7 ${document.title || "Video"}`,
          url: location.href,
          html,
          text
        }).then(() => this.showNote("Saved transcript to Books shelf!"));
      });
    } else {
      const freqMap = /* @__PURE__ */ new Map();
      this.cues.forEach((cue, cueIdx) => {
        const tmp = document.createElement("div");
        tmp.textContent = cue.text;
        this.highlighter.scanAndHighlight(tmp);
        tmp.querySelectorAll("verba-w").forEach((w) => {
          const key = w.dataset.key || w.dataset.w || "";
          const s = w.dataset.s || "0";
          const cur = freqMap.get(key);
          if (cur) cur.count++;
          else freqMap.set(key, { word: key, status: s, count: 1, firstCueIdx: cueIdx });
        });
      });
      const items = Array.from(freqMap.values()).filter((it) => {
        if (this.wordsFilter === "new") return it.status === "0";
        if (this.wordsFilter === "learning") return ["1", "2", "3", "4"].includes(it.status);
        if (this.wordsFilter === "both") return ["0", "1", "2", "3", "4"].includes(it.status);
        return true;
      }).sort((a, b) => b.count - a.count);
      this.drawerEl.innerHTML = `
        <div class="cc-drawer-head">
          <button type="button" class="wp-tab" aria-selected="false" id="dr-tab-tr">Transcript</button>
          <button type="button" class="wp-tab" aria-selected="true" id="dr-tab-wd">Words (${items.length})</button>
          <button type="button" class="wp-icon-btn" id="dr-close" style="margin-left:auto">\u2715</button>
        </div>
        <div style="display:flex;gap:4px;padding:6px 10px;border-bottom:1px solid var(--border-subtle);">
          ${["both", "new", "learning", "all"].map(
        (f) => `<button type="button" class="wp-btn-ghost dr-chip" data-f="${f}" style="${this.wordsFilter === f ? "border-color:#3b82f6;color:var(--ink);" : ""}">${f === "both" ? "New + Learning" : f[0].toUpperCase() + f.slice(1)}</button>`
      ).join("")}
        </div>
        <div class="cc-drawer-list" id="dr-words-list">
          ${items.map(
        (it) => `<div class="cc-cue-item" style="justify-content:space-between;align-items:center;">
                <span><verba-w data-w="${esc3(it.word)}" data-key="${esc3(it.word)}" data-s="${esc3(it.status)}">${esc3(
          it.word
        )}</verba-w> <span style="color:var(--ink-3);font-size:12px;">\xD7${it.count}</span></span>
                <button type="button" class="wp-icon-btn dr-jump-cue" data-cue="${it.firstCueIdx}" title="Jump to line">\u25B6</button>
              </div>`
      ).join("")}
        </div>
      `;
      const wList = this.drawerEl.querySelector("#dr-words-list");
      if (wList) this.bindWordInteractions(wList);
      this.drawerEl.querySelectorAll(".dr-chip").forEach((b) => {
        b.addEventListener("click", () => {
          this.wordsFilter = b.dataset.f;
          this.renderDrawer();
        });
      });
      this.drawerEl.querySelectorAll(".dr-jump-cue").forEach((b) => {
        b.addEventListener("click", () => {
          const cue = this.cues[Number(b.dataset.cue)];
          if (cue && this.videoEl) {
            this.videoEl.currentTime = cue.start + this.subtitleOffsetSec + 0.02;
          }
        });
      });
    }
    this.drawerEl.querySelector("#dr-tab-tr")?.addEventListener("click", () => {
      this.drawerTab = "transcript";
      this.renderDrawer();
    });
    this.drawerEl.querySelector("#dr-tab-wd")?.addEventListener("click", () => {
      this.drawerTab = "words";
      this.renderDrawer();
    });
    this.drawerEl.querySelector("#dr-close")?.addEventListener("click", () => {
      this.drawerOpen = false;
      this.drawerEl.hidden = true;
    });
  }
  highlightTranscriptCue() {
    this.drawerEl.querySelectorAll(".cc-cue-item").forEach((el) => {
      const idx = Number(el.dataset.cueIdx);
      el.classList.toggle("active", idx === this.activeCueIdx);
    });
  }
  findNearestCueIdx() {
    if (!this.videoEl || this.cues.length === 0) return 0;
    const now = this.videoEl.currentTime - this.subtitleOffsetSec;
    for (let i = this.cues.length - 1; i >= 0; i--) {
      if (this.cues[i].start <= now) return i;
    }
    return 0;
  }
  showNote(msg) {
    if (!this.settings.showActionNotes) return;
    this.toastEl.textContent = msg;
    this.toastEl.hidden = false;
    this.toastEl.style.left = "50%";
    this.toastEl.style.bottom = "96px";
    this.toastEl.style.transform = "translateX(-50%)";
    window.setTimeout(() => {
      this.toastEl.hidden = true;
    }, 1500);
  }
  injectYouTubeSearchHelpers() {
    if (!location.hostname.includes("youtube.com")) return;
    const searchForm = document.querySelector("ytd-searchbox form, #search-form");
    if (!searchForm || searchForm.querySelector("#verba-yt-translate")) return;
    const wrap = document.createElement("div");
    wrap.id = "verba-yt-translate";
    wrap.dataset.verbaIgnore = "1";
    wrap.style.cssText = "display:inline-flex;gap:6px;margin-left:8px;align-items:center;";
    wrap.innerHTML = `
      <button type="button" id="verba-yt-tr-btn" style="height:32px;padding:0 10px;border-radius:999px;border:1px solid #3b3a37;background:#191918;color:#f2f0eb;font-size:12px;cursor:pointer;">Translate</button>
      <button type="button" id="verba-yt-cc-btn" style="height:32px;padding:0 10px;border-radius:999px;border:1px solid #3b3a37;background:#191918;color:#f2f0eb;font-size:12px;cursor:pointer;">Subtitles</button>
    `;
    searchForm.parentElement?.appendChild(wrap);
    wrap.querySelector("#verba-yt-tr-btn")?.addEventListener("click", async () => {
      const inp = document.querySelector('input#search, input[name="search_query"]');
      if (!inp || !inp.value.trim()) return;
      const res = await sendBgMessage({
        type: "TRANSLATE",
        text: inp.value.trim(),
        sourceLang: "auto",
        targetLang: this.settings.activeLang
      });
      if (res?.translation) {
        inp.value = res.translation;
        location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(res.translation)}`;
      }
    });
    wrap.querySelector("#verba-yt-cc-btn")?.addEventListener("click", () => {
      const url = new URL(location.href);
      if (url.searchParams.get("sp") === "EgIoAQ%3D%3D") {
        url.searchParams.delete("sp");
      } else {
        url.searchParams.set("sp", "EgIoAQ%3D%3D");
      }
      location.href = url.toString();
    });
  }
};
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function esc3(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/video/index.ts
function buildSeekableSilentWavUrl(durationSec = 28) {
  const sampleRate = 8e3;
  const numSamples = sampleRate * durationSec;
  const buffer = new ArrayBuffer(44 + numSamples);
  const view = new DataView(buffer);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + numSamples, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeStr(36, "data");
  view.setUint32(40, numSamples, true);
  new Uint8Array(buffer, 44).fill(128);
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}
var VerbaLocalVideoApp = class {
  rootEl = document.getElementById("video-app");
  vidInput = document.getElementById("vid-file-input");
  subInput = document.getElementById("sub-primary-input");
  transInput = document.getElementById("sub-trans-input");
  shadowHost;
  shadow;
  highlighter;
  wordPanel;
  readerSuite;
  captions;
  settings;
  dictIndex;
  words = [];
  customDicts = [];
  history = [];
  currentTitle = "No video loaded";
  hasVideoLoaded = false;
  hoveredWordEl = null;
  hoverTimer = null;
  boundContainers = /* @__PURE__ */ new WeakSet();
  async init() {
    this.mountShadowRoot();
    await this.reloadState();
    this.render();
    this.bindInputsAndShortcuts();
    const params = new URLSearchParams(location.search);
    if (params.get("demo") === "1") {
      await this.loadBuiltInDemo();
    }
  }
  mountShadowRoot() {
    this.shadowHost = document.createElement("div");
    this.shadowHost.id = "verba-ui-root";
    this.shadowHost.dataset.verbaIgnore = "1";
    document.documentElement.appendChild(this.shadowHost);
    this.shadow = this.shadowHost.attachShadow({ mode: "open" });
    const st = document.createElement("style");
    st.textContent = SHADOW_UI_CSS;
    this.shadow.appendChild(st);
  }
  async reloadState() {
    this.settings = await sendBgMessage({ type: "GET_SETTINGS" });
    applyTheme(this.settings.theme);
    const lang = this.settings.activeLang;
    const rawDict = await sendBgMessage({ type: "GET_DICTIONARY", lang });
    this.dictIndex = buildLangIndex(rawDict);
    this.words = await getWordsByLang(lang);
    this.customDicts = await getCustomDictsByLang(lang);
    this.history = (await getVideosByLang(lang)).slice(0, 10);
    const langOpts = getLangOptionsFromSettings(this.settings, lang);
    this.highlighter?.destroy();
    this.highlighter = new VerbaHighlighter({
      lang,
      settings: this.settings,
      langOpts,
      dictIndex: this.dictIndex,
      words: this.words,
      customDicts: this.customDicts,
      rootContainer: document.body,
      isBookOrReader: true
    });
    this.highlighter.injectStyles(document);
    this.highlighter.injectStyles(this.shadow);
    if (!this.wordPanel) {
      this.wordPanel = new VerbaWordPanel(this.shadow, this.settings, langOpts, {
        onGrade: async (word, status, extra) => {
          await this.gradeWord(word, status, extra);
        },
        onSplitCustomWord: async (word) => {
          await sendBgMessage({ type: "SPLIT_CUSTOM_WORD", lang: this.settings.activeLang, word });
          await this.refreshVocabulary();
        },
        onExtendSelection: () => {
        },
        onOpenAskAiChat: (sent) => this.readerSuite.openAskAiModal(sent),
        onClose: () => {
          const v = this.captions.videoEl;
          if (v?.paused && this.settings.pauseOnLookup) {
            v.play().catch(() => {
            });
          }
        }
      });
    } else {
      this.wordPanel.settings = this.settings;
      this.wordPanel.langOpts = langOpts;
    }
    if (!this.readerSuite) {
      this.readerSuite = new VerbaReaderSuite(
        this.shadow,
        this.highlighter,
        this.settings,
        langOpts,
        (c) => this.bindWordEvents(c)
      );
    } else {
      this.readerSuite.highlighter = this.highlighter;
      this.readerSuite.syncStyles(this.settings, langOpts);
    }
    if (!this.captions) {
      this.captions = new VerbaCaptions(
        this.shadow,
        this.highlighter,
        this.settings,
        langOpts,
        (c) => this.bindWordEvents(c)
      );
    } else {
      this.captions.highlighter = this.highlighter;
      this.captions.settings = this.settings;
      this.captions.langOpts = langOpts;
    }
  }
  async refreshVocabulary() {
    this.words = await getWordsByLang(this.settings.activeLang);
    this.highlighter.setWords(this.words);
    await this.captions.renderActiveSubtitle();
  }
  async gradeWord(word, status, extra) {
    await sendBgMessage({
      type: "GRADE_WORD",
      lang: this.settings.activeLang,
      word,
      status,
      ...extra
    });
    await this.refreshVocabulary();
    if (status === 5 && this.settings.autoResumeOnKnown && this.captions.videoEl?.paused) {
      this.captions.videoEl.play().catch(() => {
      });
    }
  }
  render() {
    const lang = this.settings.activeLang;
    const langOptsHtml = this.settings.learningLangs.map((c) => `<option value="${c}" ${c === lang ? "selected" : ""}>${esc4(LANG_MAP[c]?.name || c)}</option>`).join("");
    this.rootEl.innerHTML = `
      <header class="topbar">
        <div class="topbar-left">
          <a href="dashboard.html" class="brand">
            <span class="brand-dot"></span>
            <span>Verba</span>
          </a>
          <a href="dashboard.html" class="btn btn-ghost">\u2190 Dashboard</a>
          <span id="vid-title-label" style="color:var(--ink-2);font-size:13px">${esc4(this.currentTitle)}</span>
        </div>
        <div class="topbar-right">
          <button type="button" class="btn btn-primary" id="btn-open-vid">Open video file\u2026</button>
          <button type="button" class="btn" id="btn-load-sub">Load subtitle (.srt/.vtt/.ass)</button>
          <button type="button" class="btn" id="btn-load-trans">Load translation sub</button>
          <button type="button" class="btn btn-amber" id="btn-load-demo">\u25B6 Demo Video &amp; Subtitles</button>
          <button type="button" class="btn" id="btn-words-drawer" title="Transcript & Words in this video (W)">\u2630 Transcript &amp; Words</button>
          <select id="vid-lang-sel" class="select-input" aria-label="Language">
            ${langOptsHtml}
          </select>
        </div>
      </header>

      <main class="video-main">
        <div class="player-frame" id="player-dropzone">
          <video id="verba-local-video" controls playsinline></video>
          ${!this.hasVideoLoaded ? `
            <div class="empty-stage-overlay" id="empty-overlay">
              <div style="font-family:var(--serif);font-style:italic;font-size:24px;color:var(--ink)">
                Watch with Verba Dual Captions
              </div>
              <div style="max-width:480px;color:var(--ink-3);font-size:13.5px">
                Drop an MP4 / WebM / MKV video and .SRT / .VTT / .ASS subtitle files right onto this stage, or try the built-in Italian dialogue demo.
              </div>
              <div style="display:flex;gap:10px;margin-top:6px">
                <button type="button" class="btn btn-primary" id="overlay-open-vid">Choose video file\u2026</button>
                <button type="button" class="btn btn-amber" id="overlay-demo-btn">\u25B6 Try Italian Demo</button>
              </div>
            </div>
          ` : ""}
        </div>

        <div class="shortcut-strip">
          <span><kbd>A</kbd> / <kbd>S</kbd> / <kbd>D</kbd> Prev / Replay / Next line</span>
          <span><kbd>Q</kbd> Auto-pause</span>
          <span><kbd>E</kbd> Peek blurred translation</span>
          <span><kbd>W</kbd> Words in video</span>
          <span><kbd>Shift+D</kbd> Next line w/ frequent word</span>
          <span><kbd>Shift+K</kbd> Mark line Known</span>
        </div>

        <section class="history-section">
          <h2>Recent Videos (${this.history.length})</h2>
          ${this.history.length === 0 ? `<p style="color:var(--ink-3)">Your last 10 watched videos will appear here so you can resume right where you left off.</p>` : `<div class="history-grid">
                ${this.history.map(
      (h) => `
                  <div class="history-card">
                    <div class="history-card-title">${esc4(h.title)}</div>
                    <div class="history-card-meta">
                      ${esc4(h.source.toUpperCase())} \xB7 ${h.cues?.length || 0} cues
                    </div>
                    <div style="margin-top:6px">
                      <button type="button" class="btn btn-primary resume-vid-btn" data-vid-id="${esc4(h.id)}">
                        Continue from ${formatMmSs(h.positionSec)}
                      </button>
                    </div>
                  </div>
                `
    ).join("")}
              </div>`}
        </section>
      </main>
    `;
    const videoEl = document.getElementById("verba-local-video");
    this.captions.attachToVideo(videoEl);
    videoEl.addEventListener("timeupdate", () => {
      if (!this.hasVideoLoaded || videoEl.currentTime < 1) return;
      if (Math.floor(videoEl.currentTime) % 5 === 0) {
        this.saveCurrentVideoHistory(videoEl);
      }
    });
    this.rootEl.querySelector("#btn-open-vid")?.addEventListener("click", () => this.vidInput.click());
    this.rootEl.querySelector("#overlay-open-vid")?.addEventListener("click", () => this.vidInput.click());
    this.rootEl.querySelector("#btn-load-sub")?.addEventListener("click", () => this.subInput.click());
    this.rootEl.querySelector("#btn-load-trans")?.addEventListener("click", () => this.transInput.click());
    this.rootEl.querySelector("#btn-load-demo")?.addEventListener("click", () => this.loadBuiltInDemo());
    this.rootEl.querySelector("#overlay-demo-btn")?.addEventListener("click", () => this.loadBuiltInDemo());
    this.rootEl.querySelector("#btn-words-drawer")?.addEventListener("click", () => {
      this.captions.toggleWordsOrTranscriptDrawer("words");
    });
    this.rootEl.querySelector("#vid-lang-sel")?.addEventListener("change", async (e) => {
      const nextLang = e.target.value;
      await sendBgMessage({ type: "SAVE_SETTINGS", patch: { activeLang: nextLang } });
      await this.reloadState();
      this.render();
    });
    this.rootEl.querySelectorAll(".resume-vid-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const item = this.history.find((h) => h.id === btn.dataset.vidId);
        if (!item) return;
        if (item.id === "demo_it_caffe") {
          await this.loadBuiltInDemo(item.positionSec);
          return;
        }
        this.currentTitle = item.title;
        if (item.cues?.length) {
          this.captions.subtitleOffsetSec = item.subtitleOffsetSec || 0;
          this.captions.setCues(item.cues);
        }
        this.vidInput.click();
      });
    });
    const dropzone = document.getElementById("player-dropzone");
    dropzone?.addEventListener("dragover", (e) => e.preventDefault());
    dropzone?.addEventListener("drop", async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files || []);
      const vidFile = files.find((f) => /\.(mp4|webm|mkv|ogv|mov)$/i.test(f.name) || f.type.startsWith("video/"));
      const subFiles = files.filter((f) => /\.(srt|vtt|ass)$/i.test(f.name));
      if (vidFile) this.loadVideoFile(vidFile);
      if (subFiles[0]) {
        const primary = parseSubtitleFile(await subFiles[0].text(), subFiles[0].name);
        if (subFiles[1]) {
          const secondary = parseSubtitleFile(await subFiles[1].text(), subFiles[1].name);
          this.captions.mergeTranslationsIntoCues(primary, secondary);
        }
        this.captions.setCues(primary);
      }
    });
  }
  loadVideoFile(file) {
    const videoEl = document.getElementById("verba-local-video");
    if (!videoEl) return;
    this.hasVideoLoaded = true;
    this.currentTitle = file.name;
    document.getElementById("empty-overlay")?.remove();
    const lbl = document.getElementById("vid-title-label");
    if (lbl) lbl.textContent = file.name;
    videoEl.src = URL.createObjectURL(file);
    videoEl.play().catch(() => {
    });
    this.captions.renderPill();
  }
  async loadBuiltInDemo(resumeSec = 0.6) {
    if (this.settings.activeLang !== "it") {
      await sendBgMessage({ type: "SAVE_SETTINGS", patch: { activeLang: "it" } });
      await this.reloadState();
      this.render();
    }
    const videoEl = document.getElementById("verba-local-video");
    if (!videoEl) return;
    const [itRes, enRes] = await Promise.all([
      fetch(getExtensionUrl("samples/demo-it.srt")),
      fetch(getExtensionUrl("samples/demo-it-en.srt"))
    ]);
    const itCues = parseSubtitleFile(await itRes.text(), "srt");
    const enCues = parseSubtitleFile(await enRes.text(), "srt");
    this.captions.mergeTranslationsIntoCues(itCues, enCues);
    this.hasVideoLoaded = true;
    this.currentTitle = "Un caff\xE8 a Firenze (Demo)";
    document.getElementById("empty-overlay")?.remove();
    const lbl = document.getElementById("vid-title-label");
    if (lbl) lbl.textContent = this.currentTitle;
    videoEl.poster = "data:image/svg+xml;utf8," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#191918"/><stop offset="100%" stop-color="#28231c"/></linearGradient></defs><rect width="1280" height="720" fill="url(#g)"/><circle cx="640" cy="280" r="95" fill="#f7a800" fill-opacity="0.14"/><text x="640" y="290" text-anchor="middle" fill="#f2f0eb" font-family="Georgia,serif" font-style="italic" font-size="44">Un caff\xE8 a Firenze</text><text x="640" y="340" text-anchor="middle" fill="#9a9891" font-family="sans-serif" font-size="20">Verba Dual Captions Interactive Demo \xB7 Hover or click any Italian word below</text></svg>`
    );
    videoEl.src = buildSeekableSilentWavUrl(28);
    await new Promise((resolve) => {
      videoEl.addEventListener("loadedmetadata", () => resolve(), { once: true });
    });
    this.captions.setCues(itCues);
    videoEl.currentTime = resumeSec;
    this.captions.renderPill();
    await this.captions.renderActiveSubtitle();
    await this.saveCurrentVideoHistory(videoEl, "demo_it_caffe");
  }
  async saveCurrentVideoHistory(videoEl, forcedId) {
    const id = forcedId || `local:${this.settings.activeLang}:${this.currentTitle}`;
    const item = {
      id,
      lang: this.settings.activeLang,
      title: this.currentTitle,
      source: "local",
      fileName: this.currentTitle,
      positionSec: Math.round(videoEl.currentTime),
      durationSec: Math.round(videoEl.duration || 0),
      subtitleOffsetSec: this.captions.subtitleOffsetSec,
      cues: this.captions.cues.slice(0, 500),
      updatedAt: Date.now()
    };
    await putVideoHistory(item);
    this.history = (await getVideosByLang(this.settings.activeLang)).slice(0, 10);
  }
  bindWordEvents(container) {
    if (this.boundContainers.has(container)) return;
    this.boundContainers.add(container);
    container.addEventListener("mouseover", (e) => {
      const target = e.target?.closest?.("verba-w");
      if (!target || target.closest('a, button, [role="link"], [role="button"]')) return;
      this.hoveredWordEl = target;
      if (this.wordPanel.isPinned) return;
      if (this.hoverTimer) window.clearTimeout(this.hoverTimer);
      this.hoverTimer = window.setTimeout(() => {
        if (this.hoveredWordEl === target && !this.wordPanel.isPinned) {
          this.openWordEl(target, false);
        }
      }, this.settings.hoverDelayMs);
    });
    container.addEventListener("mouseout", (e) => {
      const target = e.target?.closest?.("verba-w");
      if (!target) return;
      if (this.hoveredWordEl === target) this.hoveredWordEl = null;
      if (this.hoverTimer) window.clearTimeout(this.hoverTimer);
      if (!this.wordPanel.isPinned) {
        window.setTimeout(() => {
          if (!this.hoveredWordEl && !this.wordPanel.isPinned) this.wordPanel.close();
        }, 120);
      }
    });
    container.addEventListener("click", async (e) => {
      if (e.target?.closest?.('a, button, [role="link"], [role="button"]')) {
        return;
      }
      const target = e.target?.closest?.("verba-w");
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      if (this.hoverTimer) {
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }
      if (this.captions.videoEl && !this.captions.videoEl.paused) {
        this.captions.videoEl.pause();
      }
      const cueText = this.captions.cues[this.captions.activeCueIdx]?.text || "";
      if (target.dataset.s === "0" && this.settings.clickNewStartsLearning) {
        await this.gradeWord(target.dataset.w || "", 1, { contextSentence: cueText });
      }
      await this.openWordEl(target, true);
      if (this.settings.sayWordOnOpen) {
        speakText(target.dataset.w || "", this.settings.activeLang, this.settings);
      }
    });
  }
  async openWordEl(el, pinned) {
    if (this.hoverTimer) {
      window.clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    const cueText = this.captions.cues[this.captions.activeCueIdx]?.text || el.parentElement?.textContent || "";
    await this.wordPanel.openForWord({
      query: el.dataset.w || el.textContent || "",
      lang: this.settings.activeLang,
      pinned,
      rect: el.getBoundingClientRect(),
      element: el,
      sentence: cueText,
      paragraph: cueText,
      lemmaHint: el.dataset.lemma
    });
  }
  bindInputsAndShortcuts() {
    const ext = getExtApi();
    ext?.runtime?.onMessage?.addListener((msg) => {
      if (!msg?.type) return;
      if ((msg.type === "VERBA_WORD_UPDATED" || msg.type === "VERBA_WORDS_REFRESH") && (!msg.lang || msg.lang === this.settings.activeLang)) {
        this.refreshVocabulary().catch(() => {
        });
      } else if (msg.type === "VERBA_SETTINGS_UPDATED" && msg.settings) {
        this.settings = msg.settings;
        applyTheme(this.settings.theme);
        const langOpts = getLangOptionsFromSettings(this.settings, this.settings.activeLang);
        this.highlighter.settings = this.settings;
        this.highlighter.langOpts = langOpts;
        this.captions.settings = this.settings;
        this.captions.langOpts = langOpts;
        this.captions.renderActiveSubtitle();
      }
    });
    this.vidInput?.addEventListener("change", () => {
      const f = this.vidInput.files?.[0];
      this.vidInput.value = "";
      if (f) this.loadVideoFile(f);
    });
    this.subInput?.addEventListener("change", async () => {
      const f = this.subInput.files?.[0];
      this.subInput.value = "";
      if (!f) return;
      const cues = parseSubtitleFile(await f.text(), f.name);
      this.captions.setCues(cues);
      this.captions.showNote(`Loaded ${cues.length} subtitle lines`);
    });
    this.transInput?.addEventListener("change", async () => {
      const f = this.transInput.files?.[0];
      this.transInput.value = "";
      if (!f) return;
      const secondary = parseSubtitleFile(await f.text(), f.name);
      this.captions.mergeTranslationsIntoCues(this.captions.cues, secondary);
      await this.captions.renderActiveSubtitle();
      this.captions.showNote(`Merged ${secondary.length} translation lines`);
    });
    window.addEventListener("keydown", async (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Escape") {
        if (this.wordPanel.isOpen) {
          this.wordPanel.close();
          return;
        }
      }
      const activeWord = this.wordPanel.activeLookup?.query || (this.settings.gradeByHovering ? this.hoveredWordEl?.dataset.w : void 0);
      if (activeWord && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const grades = { "1": 1, "2": 2, "3": 3, "4": 4, k: 5, x: -1, "0": 0 };
        const low2 = e.key.toLowerCase();
        if (low2 in grades) {
          e.preventDefault();
          if (this.hoverTimer) {
            window.clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
          }
          const st = grades[low2];
          if (st === 5 || st === -1 || st === 0) this.wordPanel.close();
          await this.gradeWord(activeWord, st);
          return;
        }
      }
      const low = e.key.toLowerCase();
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (low === "c") {
          e.preventDefault();
          await this.captions.toggleEnabled();
        } else if (low === "a") {
          e.preventDefault();
          this.captions.jumpRelativeLine(-1);
        } else if (low === "s") {
          e.preventDefault();
          this.captions.replayCurrentLine();
        } else if (low === "d") {
          e.preventDefault();
          this.captions.jumpRelativeLine(1);
        } else if (low === "q") {
          e.preventDefault();
          await this.captions.toggleAutoPause();
        } else if (low === "e") {
          e.preventDefault();
          this.captions.peekLayers();
        } else if (low === "h") {
          e.preventDefault();
          await this.captions.toggleHideKnownLines();
        } else if (low === "r") {
          e.preventDefault();
          await this.captions.cycleBandFilter();
        } else if (low === "w") {
          e.preventDefault();
          this.captions.toggleWordsOrTranscriptDrawer("words");
        } else if (e.key === ",") {
          e.preventDefault();
          this.captions.adjustSubtitleTiming(-0.25);
        } else if (e.key === ".") {
          e.preventDefault();
          this.captions.adjustSubtitleTiming(0.25);
        } else if (e.key === " ") {
          e.preventDefault();
          const v = this.captions.videoEl;
          if (v) v.paused ? v.play().catch(() => {
          }) : v.pause();
        }
      } else if (e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const up = e.key.toUpperCase();
        if (e.altKey && up === "D") {
          e.preventDefault();
          this.captions.hopMostCommonVideoWords(1);
        } else if (e.altKey && up === "A") {
          e.preventDefault();
          this.captions.hopMostCommonVideoWords(-1);
        } else if (up === "D") {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(true, 1);
        } else if (up === "A") {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(true, -1);
        } else if (up === "E") {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(false, 1);
        } else if (up === "Q") {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(false, -1);
        } else if (up === "K") {
          e.preventDefault();
          await this.captions.markCurrentLineKnown();
          await this.refreshVocabulary();
        }
      }
    });
  }
};
function formatMmSs(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function applyTheme(theme) {
  const isLight = theme === "light" || theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
}
function esc4(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
new VerbaLocalVideoApp().init().catch((err) => console.error("Verba video app error:", err));
