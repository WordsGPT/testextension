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

// src/shared/constants.ts
var DEFAULT_READING_KEYMAP = {
  grade1: "1",
  grade2: "2",
  grade3: "3",
  grade4: "4",
  known: "k",
  ignore: "x",
  resetNew: "0",
  aiCheck: "a",
  speakWord: "v",
  speakSentence: "Shift+V",
  customMeaning: "m",
  googleTranslate: "g",
  dictLink: "t",
  charactersTab: "b",
  nextEntry: "n",
  prevEntry: "Shift+N",
  listEntries: "l",
  ankiAdd: "p",
  ankiPick: "Shift+P",
  askAiChat: "Shift+I",
  nextWord: "ArrowRight",
  prevWord: "ArrowLeft",
  openKnownUp: "ArrowUp",
  closeDown: "ArrowDown",
  markPageKnown: "Shift+K",
  toggleHighlights: "Shift+H",
  readAloud: "Shift+R",
  openReaderView: "Shift+L",
  sentenceMode: "Shift+S",
  nextFreqSentence: "Shift+D",
  prevFreqSentence: "Shift+A",
  nextUnknownSentence: "Shift+E",
  prevUnknownSentence: "Shift+Q",
  toggleDiglot: "Shift+W"
};
var DEFAULT_VIDEO_KEYMAP = {
  toggleCaptions: "c",
  prevLine: "a",
  replayLine: "s",
  nextLine: "d",
  autoPause: "q",
  peekForward: "e",
  peekBackward: "z",
  hideKnownLines: "h",
  cycleBandFilter: "r",
  wordsInVideo: "w",
  subEarlier: ",",
  subLater: ".",
  nextFreqLine: "Shift+D",
  prevFreqLine: "Shift+A",
  hopCommonDown: "Shift+Alt+D",
  hopCommonUp: "Shift+Alt+A",
  nextUnknownLine: "Shift+E",
  prevUnknownLine: "Shift+Q",
  markLineKnown: "Shift+K"
};
var UI_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Fran\xE7ais" },
  { code: "es", name: "Espa\xF1ol" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Portugu\xEAs" },
  { code: "sv", name: "Svenska" },
  { code: "pl", name: "Polski" },
  { code: "ru", name: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" },
  { code: "zh", name: "\u4E2D\u6587" },
  { code: "ja", name: "\u65E5\u672C\u8A9E" },
  { code: "ko", name: "\uD55C\uAD6D\uC5B4" },
  { code: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" }
];
var DEFAULT_ASK_AI_PROMPT = `I am reading in {language} ({title}).
Please explain this sentence naturally and break down any idiomatic or grammatical nuances:

"{sentence}"

Context around it:
{context}`;
function generatePairingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  if (!/[A-Z]/.test(code)) code = "V" + code.slice(1);
  if (!/[2-9]/.test(code)) code = code.slice(0, 7) + "7";
  return code;
}
function createDefaultSettings() {
  const deviceId = "dev_" + Math.random().toString(36).slice(2, 10);
  return {
    deviceId,
    onboarded: false,
    profileName: "Reader",
    activeLang: "it",
    learningLangs: ["it", "zh", "ja", "es", "de", "fr"],
    polyglotOrder: ["it", "zh", "ja", "es", "de", "fr"],
    autoSwitchPageLang: true,
    selectLookupEnabled: true,
    perLang: {
      it: getDefaultLangOptions("it"),
      zh: getDefaultLangOptions("zh"),
      ja: getDefaultLangOptions("ja"),
      es: getDefaultLangOptions("es"),
      de: getDefaultLangOptions("de"),
      fr: getDefaultLangOptions("fr")
    },
    runOnWebPages: true,
    inlineReplacementEnabled: true,
    inlineReplacementDensityPct: 15,
    inlineReplacementPool: "learning_and_new",
    inlineReplacementMaxRank: 3e3,
    inlineReplacementShowHint: true,
    pausedTabIds: [],
    forceEnabledUrls: [],
    neverRunDomains: ["mail.google.com", "docs.google.com", "outlook.live.com"],
    showPageCounter: true,
    languageSwitcherOnPage: true,
    gradeByHovering: true,
    hoverDelayMs: 140,
    clickNewStartsLearning: true,
    linksStayClickable: true,
    contextMeaningFirst: true,
    entriesOneAtATime: true,
    translateMissingWords: true,
    countWordsReadWhere: "everywhere",
    pdfDefaultMode: "fit_phones",
    readerFont: "serif",
    customFontName: "",
    readerTheme: "dark",
    readerFontSize: 19,
    dailyReadingGoalWords: 500,
    dailyListeningGoalMin: 10,
    dayEndsAtHour: 0,
    readingKeymap: { ...DEFAULT_READING_KEYMAP },
    videoKeymap: { ...DEFAULT_VIDEO_KEYMAP },
    theme: "dark",
    uiLanguage: "en",
    highlightWords: true,
    specialWordsHighlight: false,
    underlineInsteadOfFill: false,
    highlightStrength: 1,
    colors: {
      newWord: "#38bdf8",
      learning: "#f59e0b",
      crossScript: "#10b981",
      selectedPhrase: "#f97316",
      specialWord: "#a855f7"
    },
    wordPanel: {
      size: "M",
      showReading: true,
      dictLinksInline: false,
      compactSpacing: false,
      showGradeButtons: true
    },
    voiceBackend: "device",
    cloudVoiceProvider: "gemini",
    cloudVoiceApiKey: "",
    localVoiceServerUrl: "http://localhost:8880",
    voiceSpeed: 1,
    voiceVolume: 1,
    sayWordOnOpen: false,
    sayWordOnArrow: false,
    smartListeningTracking: true,
    showTabCountedChip: true,
    askUnsureTrackLang: true,
    youtubeThumbnailCounts: true,
    ignoredListeningDomains: [],
    captionsEnabled: true,
    subtitleMode: "show",
    translationMode: "blur",
    inlineWordMeanings: "off",
    sharpWordsWithMeaning: true,
    colorsThroughBlur: true,
    hideKnownLines: false,
    vocabBandFilter: "all",
    autoPauseEachLine: false,
    autoPauseOnlyNewWords: false,
    autoResumeOnKnown: true,
    pauseOnLookup: false,
    pauseOnLookupDelayMs: 400,
    googleTranslateMissingSubs: true,
    subtitleSize: "M",
    translationSize: "M",
    subtitleFont: "sans",
    subtitleBgOpacity: 75,
    karaokeMode: false,
    showActionNotes: true,
    subtitleVerticalPct: 82,
    gamepadEnabled: true,
    swapABXY: false,
    pageScrollPx: 320,
    aiCheckEnabled: false,
    aiIncludeSentence: true,
    aiProvider: "gemini",
    aiApiKey: "",
    aiModel: "gemini-2.5-flash",
    aiWorkspaceId: "",
    aiCustomRequest: "",
    askAiChatProvider: "chatgpt",
    askAiChatCustomUrl: "",
    askAiChatPromptTemplate: DEFAULT_ASK_AI_PROMPT,
    ankiConnectPort: 8765,
    ankiSendAllLearning: false,
    ankiLevelsToSend: [1, 2, 3, 4],
    ankiShowButtonInPanel: true,
    ankiTags: "verba",
    ankiMarkKnownOnMature: false,
    ankiMatureDays: 21,
    ankiSuspendWhenKnown: true,
    ankiVideoMedia: "audio_clip",
    ankiIncludeSurroundingLines: false,
    ankiVoiceWord: false,
    ankiVoiceSentence: false,
    ankiCardLayout: {
      word: "front",
      reading: "back",
      pitch: "off",
      meaning: "back",
      sentence: "back",
      sentenceTranslation: "off",
      picture: "back",
      wordAudio: "back",
      sentenceAudio: "back"
    },
    syncPairingCode: generatePairingCode(),
    syncPeerUrl: "",
    syncSendBookFiles: true,
    syncMaxBookSizeMb: 100,
    pairedDevices: [],
    autoBackupEnabled: false,
    backupKeyLockedHash: "",
    lastBackupAt: 0,
    updatedAt: Date.now()
  };
}

// src/shared/webext.ts
function getExtApi() {
  const g = globalThis;
  return g.browser || g.chrome || null;
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
function txGet(storeName, key) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    })
  );
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
function txPutBatch(storeName, values) {
  if (values.length === 0) return Promise.resolve();
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      for (const v of values) store.put(v);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    })
  );
}
function txDelete(storeName, key) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete(key);
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
async function getAllWordsRaw() {
  return txGetAll("words");
}
async function putWordRecordsBatch(records) {
  await txPutBatch("words", records);
}
function getLogicalDateString(timestampMs, dayEndsAtHour = 0) {
  const adjusted = new Date(timestampMs - dayEndsAtHour * 3600 * 1e3);
  const y = adjusted.getFullYear();
  const m = String(adjusted.getMonth() + 1).padStart(2, "0");
  const d = String(adjusted.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
async function incrementDailyStat(lang, deviceId, dayEndsAtHour, delta) {
  const date = getLogicalDateString(Date.now(), dayEndsAtHour);
  const id = `${lang}:${date}:${deviceId}`;
  const existing = await txGet("dailyStats", id) || {
    id,
    lang,
    date,
    deviceId,
    wordsRead: 0,
    secondsListened: 0,
    wordsMarkedKnown: 0,
    wordsMarkedLearning: 0,
    frequentMarkedKnown: 0,
    updatedAt: Date.now()
  };
  const updated = {
    ...existing,
    wordsRead: Math.max(0, existing.wordsRead + (delta.wordsRead || 0)),
    secondsListened: Math.max(0, existing.secondsListened + (delta.secondsListened || 0)),
    wordsMarkedKnown: Math.max(0, existing.wordsMarkedKnown + (delta.wordsMarkedKnown || 0)),
    wordsMarkedLearning: Math.max(0, existing.wordsMarkedLearning + (delta.wordsMarkedLearning || 0)),
    frequentMarkedKnown: Math.max(0, existing.frequentMarkedKnown + (delta.frequentMarkedKnown || 0)),
    updatedAt: Date.now()
  };
  await txPut("dailyStats", updated);
  return updated;
}
async function getDailyStatsByLang(lang) {
  return txGetAll("dailyStats", "by_lang", lang);
}
async function getAllDailyStats() {
  return txGetAll("dailyStats");
}
async function putDailyStatsBatch(records) {
  await txPutBatch("dailyStats", records);
}
async function getBooksByLang(lang) {
  const all = await txGetAll("books", "by_lang", lang);
  return all.filter((b) => !b.deleted).sort((a, b) => b.updatedAt - a.updatedAt);
}
async function getAllBooksRaw() {
  return txGetAll("books");
}
async function putBook(book, rawBytes) {
  await txPut("books", book);
  if (rawBytes) {
    await txPut("bookFiles", { id: book.id, bytes: rawBytes, updatedAt: Date.now() });
  }
}
async function getFoldersByLang(lang) {
  const all = await txGetAll("folders", "by_lang", lang);
  return all.filter((f) => !f.deleted).sort((a, b) => a.name.localeCompare(b.name));
}
async function putFolder(folder) {
  await txPut("folders", folder);
}
async function getAllBookmarksRaw() {
  return txGetAll("bookmarks");
}
async function putBookmark(bm) {
  await txPut("bookmarks", bm);
}
async function getVideosByLang(lang) {
  const all = await txGetAll("videos", "by_lang", lang);
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}
async function getListeningHistoryByLang(lang) {
  const all = await txGetAll("listeningHistory", "by_lang", lang);
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}
async function getAllListeningHistory() {
  return txGetAll("listeningHistory");
}
async function putListeningLog(log) {
  await txPut("listeningHistory", log);
}
async function getCustomDictsByLang(lang) {
  const all = await txGetAll("customDicts", "by_lang", lang);
  return all.sort((a, b) => a.order - b.order);
}
async function putCustomDict(cd) {
  await txPut("customDicts", cd);
}
async function deleteCustomDict(id) {
  await txDelete("customDicts", id);
}
async function getAssessmentsByLang(lang) {
  const all = await txGetAll("assessments", "by_lang", lang);
  return all.sort((a, b) => b.completedAt - a.completedAt);
}
async function putAssessment(assessment) {
  await txPut("assessments", assessment);
}
async function getNotesByLang(lang) {
  const all = lang ? await txGetAll("notes", "by_lang", lang) : await txGetAll("notes");
  return all.sort((a, b) => b.createdAt - a.createdAt);
}
async function putStudyNote(note) {
  await txPut("notes", note);
}
async function deleteStudyNote(id) {
  await txDelete("notes", id);
}
async function deleteLanguageProgress(lang) {
  const db = await openVerbaDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(["words", "dailyStats", "listeningHistory", "assessments"], "readwrite");
    for (const storeName of ["words", "dailyStats", "listeningHistory", "assessments"]) {
      const store = tx.objectStore(storeName);
      const idx = store.index("by_lang");
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

// src/shared/segmenter.ts
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
function formatOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n.toLocaleString("en-US") + (s[(v - 20) % 10] || s[v] || s[0]);
}

// node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
var z64hs = function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

// src/shared/imports.ts
function parseCsvRows(text, delimiter = ",") {
  const rows = [];
  let row = [];
  let cur = "";
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
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cur.trim());
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      cur = "";
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
function parseLingQImport(csvText, lang) {
  const rows = parseCsvRows(csvText, ",");
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.toLowerCase());
  const termIdx = Math.max(0, header.findIndex((h) => h.includes("term") || h.includes("word") || h.includes("expression")));
  const meaningIdx = header.findIndex((h) => h.includes("hint") || h.includes("meaning") || h.includes("translation") || h.includes("definition"));
  const startRow = header.some((h) => h.includes("term") || h.includes("word")) ? 1 : 0;
  const now = Date.now();
  const out = [];
  for (let i = startRow; i < rows.length; i++) {
    const rawWord = rows[i][termIdx]?.trim();
    if (!rawWord) continue;
    const word = normalizeWord(rawWord, lang);
    const meaning = meaningIdx >= 0 ? rows[i][meaningIdx]?.trim() : void 0;
    out.push({
      id: `${lang}:${word}`,
      lang,
      word,
      status: 5,
      // Known
      isPhrase: /\s/.test(word) && lang !== "vi",
      isCustomSegment: false,
      ...meaning ? { customMeaning: meaning } : {},
      lookupCount: 0,
      source: "import",
      createdAt: now,
      updatedAt: now
    });
  }
  return out;
}
function parseLanguageReactorImport(content, lang, format, csvDefaultStatus = 5) {
  const now = Date.now();
  const out = [];
  if (format === "json") {
    const parsed = JSON.parse(content);
    const list = Array.isArray(parsed) ? parsed : parsed.words || parsed.items || [];
    for (const item of list) {
      const rawWord = String(item.word?.text || item.word || item.term || item.lemma || "").trim();
      if (!rawWord) continue;
      const word = normalizeWord(rawWord, lang);
      const rawStage = String(item.learningStage || item.status || item.stage || "").toLowerCase();
      const status = rawStage.includes("known") || item.status === "KNOWN" || item.level >= 4 ? 5 : 1;
      const meaning = Array.isArray(item.translations) ? item.translations.join("; ") : item.translation || item.meaning || "";
      out.push({
        id: `${lang}:${word}`,
        lang,
        word,
        status,
        isPhrase: /\s/.test(word) && lang !== "vi",
        isCustomSegment: false,
        ...meaning ? { customMeaning: String(meaning) } : {},
        lookupCount: 0,
        source: "import",
        createdAt: now,
        updatedAt: now
      });
    }
    return out;
  }
  const rows = parseCsvRows(content, content.includes("	") ? "	" : ",");
  for (const r of rows) {
    const rawWord = r[0]?.trim();
    if (!rawWord || rawWord.toLowerCase() === "word") continue;
    const word = normalizeWord(rawWord, lang);
    const meaning = r[1]?.trim();
    out.push({
      id: `${lang}:${word}`,
      lang,
      word,
      status: csvDefaultStatus,
      isPhrase: /\s/.test(word) && lang !== "vi",
      isCustomSegment: false,
      ...meaning ? { customMeaning: meaning } : {},
      lookupCount: 0,
      source: "import",
      createdAt: now,
      updatedAt: now
    });
  }
  return out;
}
function parseHanziHeroImport(csvText) {
  const rows = parseCsvRows(csvText, ",");
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.toLowerCase());
  const wordIdx = Math.max(0, header.findIndex((h) => h.includes("character") || h.includes("vocab") || h.includes("word") || h.includes("hanzi")));
  const stageIdx = header.findIndex((h) => h.includes("stage") || h.includes("srs") || h.includes("level") || h.includes("status"));
  const meaningIdx = header.findIndex((h) => h.includes("meaning") || h.includes("gloss"));
  const startRow = header.some((h) => h.includes("stage") || h.includes("vocab") || h.includes("hanzi")) ? 1 : 0;
  const now = Date.now();
  const out = [];
  for (let i = startRow; i < rows.length; i++) {
    const word = rows[i][wordIdx]?.trim();
    if (!word) continue;
    const stage = (stageIdx >= 0 ? rows[i][stageIdx] : "").toLowerCase();
    let status = 5;
    if (stage.includes("novice")) status = 1;
    else if (stage.includes("apprentice")) status = 2;
    else if (stage.includes("journeyman ii") || stage.includes("journeyman 2")) status = 4;
    else if (stage.includes("journeyman")) status = 3;
    else if (stage.includes("expert") || stage.includes("master") || stage.includes("skip")) status = 5;
    const meaning = meaningIdx >= 0 ? rows[i][meaningIdx]?.trim() : void 0;
    out.push({
      id: `zh:${word}`,
      lang: "zh",
      word,
      status,
      isPhrase: false,
      isCustomSegment: word.length >= 2,
      ...meaning ? { customMeaning: meaning } : {},
      lookupCount: 0,
      source: "import",
      createdAt: now,
      updatedAt: now
    });
  }
  return out;
}
function parsePlainTextWordImport(text, lang, targetStatus = 5) {
  const now = Date.now();
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  const out = [];
  for (const line of lines) {
    if (line.includes("	")) {
      const [rawWord, rawMeaning] = line.split("	");
      const cleanWord = normalizeWord(rawWord.replace(/<[^>]+>/g, "").trim(), lang);
      if (!cleanWord) continue;
      const cleanMeaning = rawMeaning?.replace(/<[^>]+>/g, "").trim();
      out.push({
        id: `${lang}:${cleanWord}`,
        lang,
        word: cleanWord,
        status: targetStatus,
        isPhrase: /\s/.test(cleanWord) && lang !== "vi",
        isCustomSegment: false,
        ...cleanMeaning ? { customMeaning: cleanMeaning } : {},
        lookupCount: 0,
        source: "import",
        createdAt: now,
        updatedAt: now
      });
    } else {
      const items = line.split(",").map((s) => s.trim()).filter(Boolean);
      for (const raw of items) {
        const word = normalizeWord(raw, lang);
        if (!word) continue;
        out.push({
          id: `${lang}:${word}`,
          lang,
          word,
          status: targetStatus,
          isPhrase: /\s/.test(word) && lang !== "vi",
          isCustomSegment: false,
          lookupCount: 0,
          source: "import",
          createdAt: now,
          updatedAt: now
        });
      }
    }
  }
  return out;
}
function parseYomitanZip(zipBytes) {
  const files = unzipSync(zipBytes);
  let title = "Custom Yomitan Dictionary";
  if (files["index.json"]) {
    try {
      const idx = JSON.parse(strFromU8(files["index.json"]));
      if (idx.title) title = String(idx.title);
    } catch {
    }
  }
  const entries = [];
  for (const [name, data] of Object.entries(files)) {
    if (/term_bank_\d+\.json$/i.test(name)) {
      try {
        const rows = JSON.parse(strFromU8(data));
        for (const row of rows) {
          const w = String(row[0] || "").trim();
          const r = String(row[1] || "").trim();
          const pos = String(row[2] || "").trim();
          const rawGlosses = row[5];
          const meanings = [];
          if (Array.isArray(rawGlosses)) {
            for (const g of rawGlosses) {
              if (typeof g === "string") meanings.push(g);
              else if (g && typeof g === "object" && "glossary" in g && Array.isArray(g.glossary)) {
                meanings.push(...g.glossary.map(String));
              }
            }
          }
          if (w && meanings.length > 0) {
            entries.push({ w, ...r ? { r } : {}, ...pos ? { pos } : {}, m: meanings });
          }
        }
      } catch {
      }
    }
  }
  return { title, entries };
}
function parseTableDictionary(text) {
  const delim = text.includes("	") ? "	" : ",";
  const rows = parseCsvRows(text, delim);
  const out = [];
  for (const r of rows) {
    const w = r[0]?.trim();
    const m = r[1]?.trim();
    const reading = r[2]?.trim();
    if (w && m && w.toLowerCase() !== "word") {
      out.push({ w, ...reading ? { r: reading } : {}, m: [m] });
    }
  }
  return out;
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

// src/shared/dom.ts
var sharedParser = null;
function setHtmlContent(el, html) {
  if (!html) {
    el.replaceChildren();
    return;
  }
  if (!sharedParser) {
    sharedParser = new DOMParser();
  }
  const doc = sharedParser.parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
  doc.body.querySelectorAll("script, iframe, object, embed").forEach((n) => n.remove());
  doc.body.querySelectorAll("*").forEach((elem) => {
    for (const attr of Array.from(elem.attributes)) {
      if (attr.name.toLowerCase().startsWith("on")) {
        elem.removeAttribute(attr.name);
      }
    }
  });
  const nodes = Array.from(doc.body.childNodes).map((n) => document.importNode(n, true));
  el.replaceChildren(...nodes);
}

// src/content/styles.ts
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
    } catch (err2) {
      this.aiError = err2 instanceof Error ? err2.message : String(err2);
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
    setHtmlContent(
      this.el,
      `
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
    `
    );
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

// src/shared/placement.ts
var CEFR_BANDS = ["A1", "A2", "B1", "B2", "C1", "C2"];
var CEFR_META = {
  A0: {
    title: "First Steps",
    summary: "Starting from scratch \u2014 focus on core high-frequency words and short dialogues.",
    approxVocab: 80,
    frontierRatio: 0
  },
  A1: {
    title: "Beginner",
    summary: "Recognizes foundational everyday words, pronouns, and basic connectors.",
    approxVocab: 550,
    frontierRatio: 0.12
  },
  A2: {
    title: "Elementary",
    summary: "Follows routine stories, concrete descriptions, and common conversational vocabulary.",
    approxVocab: 1350,
    frontierRatio: 0.25
  },
  B1: {
    title: "Intermediate",
    summary: "Reads graded articles, narrative fiction, and everyday subtitles with moderate lookup support.",
    approxVocab: 2800,
    frontierRatio: 0.42
  },
  B2: {
    title: "Upper Intermediate",
    summary: "Handles native news, essays, and unadapted novels with strong core lexical coverage.",
    approxVocab: 5400,
    frontierRatio: 0.62
  },
  C1: {
    title: "Advanced",
    summary: "Comprehends nuanced, abstract, and domain-specific writing with minimal friction.",
    approxVocab: 9800,
    frontierRatio: 0.82
  },
  C2: {
    title: "Mastery",
    summary: "Near-native lexical breadth across literary, academic, and idiomatic registers.",
    approxVocab: 15500,
    frontierRatio: 0.95
  }
};
function isAuthenticLexicalEntry(entry) {
  if (!entry.w || !entry.m || entry.m.length === 0) return false;
  if (entry.special === "name" || entry.special === "place") return false;
  const firstMeaning = entry.m[0] || "";
  if (/vocabulary item #\d+/i.test(firstMeaning)) return false;
  return true;
}
function cleanMeaningGloss(entry) {
  const raw = (entry.m[0] || "").trim();
  return raw.length > 68 ? `${raw.slice(0, 65)}\u2026` : raw;
}
function nextRand(session) {
  session.seed = session.seed * 1664525 + 1013904223 >>> 0;
  return session.seed / 4294967296;
}
function buildBandPools(dictIndex) {
  const realRanked = dictIndex.byRank.filter(isAuthenticLexicalEntry);
  const realAll = realRanked.length >= 18 ? realRanked : dictIndex.entries.filter(isAuthenticLexicalEntry);
  const pools = {
    A1: [],
    A2: [],
    B1: [],
    B2: [],
    C1: [],
    C2: []
  };
  const n = realAll.length;
  for (let i = 0; i < n; i++) {
    const ratio = i / Math.max(1, n);
    let band = "C2";
    if (ratio < 0.16) band = "A1";
    else if (ratio < 0.33) band = "A2";
    else if (ratio < 0.5) band = "B1";
    else if (ratio < 0.67) band = "B2";
    else if (ratio < 0.84) band = "C1";
    pools[band].push(realAll[i]);
  }
  return { pools, allRealEntries: realAll };
}
function createPlacementSession(dictIndex, options) {
  const { pools, allRealEntries } = buildBandPools(dictIndex);
  const totalQuestions = Math.max(6, Math.min(20, options?.totalQuestions ?? 12));
  const seed = options?.seed ?? (Date.now() ^ 2654435769) >>> 0;
  const session = {
    lang: dictIndex.lang,
    totalQuestions,
    currentIndex: 0,
    currentBandIdx: 1,
    // Start at A2
    pools,
    allRealEntries,
    usedWords: /* @__PURE__ */ new Set(),
    bandScores: {
      A1: { correct: 0, total: 0 },
      A2: { correct: 0, total: 0 },
      B1: { correct: 0, total: 0 },
      B2: { correct: 0, total: 0 },
      C1: { correct: 0, total: 0 },
      C2: { correct: 0, total: 0 }
    },
    correctWords: [],
    missedWords: [],
    steps: [],
    activeQuestion: null,
    seed
  };
  session.activeQuestion = generateNextQuestion(session);
  return session;
}
function generateNextQuestion(session) {
  if (session.currentIndex >= session.totalQuestions) return null;
  let chosenBandIdx = session.currentBandIdx;
  let candidates = [];
  for (let dist = 0; dist < CEFR_BANDS.length; dist++) {
    for (const dir of [0, 1, -1]) {
      const idx = session.currentBandIdx + dir * dist;
      if (idx < 0 || idx >= CEFR_BANDS.length) continue;
      const band2 = CEFR_BANDS[idx];
      const avail = session.pools[band2].filter((e) => !session.usedWords.has(e.w));
      if (avail.length > 0) {
        chosenBandIdx = idx;
        candidates = avail;
        break;
      }
    }
    if (candidates.length > 0) break;
  }
  if (candidates.length === 0) {
    candidates = session.allRealEntries.filter((e) => !session.usedWords.has(e.w));
    if (candidates.length === 0) candidates = session.allRealEntries;
  }
  const band = CEFR_BANDS[chosenBandIdx];
  const pickIdx = Math.floor(nextRand(session) * candidates.length);
  const target = candidates[pickIdx] || candidates[0];
  session.usedWords.add(target.w);
  const targetGloss = cleanMeaningGloss(target);
  const direction = session.currentIndex % 3 === 2 ? "meaning_to_word" : "word_to_meaning";
  const distractorPool = session.allRealEntries.filter(
    (e) => e.w !== target.w && cleanMeaningGloss(e).toLowerCase() !== targetGloss.toLowerCase()
  );
  const samePos = distractorPool.filter((e) => e.pos && e.pos === target.pos);
  const sourcePool = samePos.length >= 6 ? samePos : distractorPool;
  const chosenDistractors = [];
  const usedGlosses = /* @__PURE__ */ new Set([targetGloss.toLowerCase()]);
  const usedWordsLocal = /* @__PURE__ */ new Set([target.w]);
  const maxAttempts = sourcePool.length * 2 + 12;
  for (let attempt = 0; attempt < maxAttempts && chosenDistractors.length < 3; attempt++) {
    const d = sourcePool[Math.floor(nextRand(session) * sourcePool.length)];
    if (!d) continue;
    const g = cleanMeaningGloss(d).toLowerCase();
    if (!usedWordsLocal.has(d.w) && !usedGlosses.has(g)) {
      usedWordsLocal.add(d.w);
      usedGlosses.add(g);
      chosenDistractors.push(d);
    }
  }
  for (const d of distractorPool) {
    if (chosenDistractors.length >= 3) break;
    const g = cleanMeaningGloss(d).toLowerCase();
    if (!usedWordsLocal.has(d.w) && !usedGlosses.has(g)) {
      usedWordsLocal.add(d.w);
      usedGlosses.add(g);
      chosenDistractors.push(d);
    }
  }
  const rawOptions = [
    {
      id: "opt_correct",
      label: direction === "word_to_meaning" ? targetGloss : target.w,
      sublabel: direction === "meaning_to_word" ? target.r : void 0,
      isCorrect: true
    },
    ...chosenDistractors.map((d, idx) => ({
      id: `opt_dist_${idx}`,
      label: direction === "word_to_meaning" ? cleanMeaningGloss(d) : d.w,
      sublabel: direction === "meaning_to_word" ? d.r : void 0,
      isCorrect: false
    }))
  ];
  for (let i = rawOptions.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand(session) * (i + 1));
    const tmp = rawOptions[i];
    rawOptions[i] = rawOptions[j];
    rawOptions[j] = tmp;
  }
  return {
    index: session.currentIndex,
    total: session.totalQuestions,
    band,
    direction,
    targetEntry: target,
    prompt: direction === "word_to_meaning" ? target.w : targetGloss,
    reading: direction === "word_to_meaning" ? target.r : void 0,
    pos: target.pos,
    options: rawOptions
  };
}
function submitPlacementAnswer(session, selectedOptionId) {
  const q = session.activeQuestion;
  if (!q) {
    return { correct: false, finished: true, nextQuestion: null };
  }
  const skipped = selectedOptionId === "unsure";
  const chosenOpt = q.options.find((o) => o.id === selectedOptionId);
  const correct = !skipped && Boolean(chosenOpt?.isCorrect);
  session.bandScores[q.band].total += 1;
  if (correct) {
    session.bandScores[q.band].correct += 1;
    if (!session.correctWords.includes(q.targetEntry.w)) {
      session.correctWords.push(q.targetEntry.w);
    }
    session.currentBandIdx = Math.min(CEFR_BANDS.length - 1, session.currentBandIdx + 1);
  } else {
    if (!session.missedWords.includes(q.targetEntry.w)) {
      session.missedWords.push(q.targetEntry.w);
    }
    session.currentBandIdx = Math.max(0, session.currentBandIdx - 1);
  }
  session.steps.push({
    band: q.band,
    word: q.targetEntry.w,
    meaning: cleanMeaningGloss(q.targetEntry),
    correct,
    skipped
  });
  session.currentIndex += 1;
  session.activeQuestion = generateNextQuestion(session);
  return {
    correct,
    finished: session.activeQuestion === null,
    nextQuestion: session.activeQuestion
  };
}
function finalizePlacementSession(session, dictIndex) {
  const totalAnswered = session.steps.length;
  const totalCorrect = session.steps.filter((s) => s.correct).length;
  const weights = { A1: 1, A2: 1.35, B1: 1.75, B2: 2.2, C1: 2.7, C2: 3.2 };
  let earnedWeight = 0;
  let maxPossibleWeight = 0;
  let highestMasteredBandIdx = -1;
  for (let i = 0; i < CEFR_BANDS.length; i++) {
    const b = CEFR_BANDS[i];
    const sc = session.bandScores[b];
    const w = weights[b];
    earnedWeight += sc.correct * w;
    maxPossibleWeight += sc.total * w;
    if (sc.total > 0 && sc.correct / sc.total >= 0.5) {
      highestMasteredBandIdx = i;
    }
  }
  const overallAccuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
  const weightedRatio = maxPossibleWeight > 0 ? earnedWeight / maxPossibleWeight : 0;
  let level = "A0";
  if (totalCorrect === 0 || overallAccuracy < 0.2 && highestMasteredBandIdx < 0) {
    level = "A0";
  } else {
    const compositeBand = Math.round(
      session.currentBandIdx * 0.55 + Math.max(0, highestMasteredBandIdx) * 0.45
    );
    const clampedIdx = Math.max(0, Math.min(CEFR_BANDS.length - 1, compositeBand));
    if (clampedIdx >= 5 && overallAccuracy < 0.78) {
      level = "C1";
    } else if (clampedIdx >= 4 && overallAccuracy < 0.6) {
      level = "B2";
    } else {
      level = CEFR_BANDS[clampedIdx];
    }
  }
  const meta = CEFR_META[level];
  const jitter = Math.round((weightedRatio - 0.5) * 280);
  const estimatedVocab = level === "A0" ? Math.max(0, totalCorrect * 45) : Math.max(120, meta.approxVocab + jitter);
  const totalRanked = Math.max(1, dictIndex.byRank.length);
  const recommendedRankFrontier = level === "A0" ? 0 : Math.max(15, Math.min(totalRanked, Math.round(totalRanked * meta.frontierRatio)));
  const consistencyBonus = Math.round(Math.abs(overallAccuracy - 0.5) * 18);
  const confidencePct = Math.min(97, Math.max(68, 72 + Math.min(14, totalAnswered) + consistencyBonus));
  return {
    id: `assess_${session.lang}_${Date.now()}`,
    lang: session.lang,
    cefrLevel: level,
    cefrTitle: meta.title,
    estimatedVocab,
    recommendedRankFrontier,
    confidencePct,
    bandScores: session.bandScores,
    correctWords: [...session.correctWords],
    missedWords: [...session.missedWords],
    appliedCalibration: false,
    completedAt: Date.now()
  };
}
function buildPlacementCalibrationWords(assessment, dictIndex) {
  const missedSet = new Set(assessment.missedWords);
  const knownSet = new Set(assessment.correctWords);
  const frontierSlice = dictIndex.byRank.slice(0, assessment.recommendedRankFrontier);
  for (const entry of frontierSlice) {
    if (!missedSet.has(entry.w)) {
      knownSet.add(entry.w);
    }
  }
  return {
    knownWords: Array.from(knownSet),
    learningWords: Array.from(missedSet)
  };
}

// src/dashboard/placement-view.ts
var PlacementViewController = class {
  session = null;
  latestResult = null;
  lastFeedback = null;
  undoSnapshot = null;
  keyHandler = null;
  render(container, ctx) {
    this.unbindKeys();
    const lang = ctx.settings.activeLang;
    const langMeta = LANG_MAP[lang];
    const langName = langMeta?.name || lang;
    if (this.session && this.session.activeQuestion) {
      this.renderActiveQuiz(container, ctx);
      return;
    }
    getAssessmentsByLang(lang).then((history2) => {
      const displayAssessment = this.latestResult && this.latestResult.lang === lang ? this.latestResult : history2[0] ?? null;
      const knownCount = ctx.words.filter((w) => !w.deleted && w.status === 5).length;
      const learningCount = ctx.words.filter(
        (w) => !w.deleted && w.status >= 1 && w.status <= 4
      ).length;
      setHtmlContent(
        container,
        `
        <div class="pl-wrap">
          <div class="card pl-hero-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
              <div>
                <div class="pl-eyebrow">ADAPTIVE DIAGNOSTIC \xB7 ALL 24 LANGUAGES</div>
                <h1 class="page-heading" style="margin:4px 0 8px;font-size:26px;">
                  ${esc2(langName)} Vocabulary &amp; CEFR Placement Test
                </h1>
                <p style="margin:0;color:var(--ink-2);max-width:680px;font-size:13.5px;line-height:1.55;">
                  An adaptive 12-question staircase assessment across CEFR bands <b>A1 \u2192 C2</b>.
                  Verba estimates your passive vocabulary size, identifies your comprehension frontier,
                  and can calibrate your known vocabulary in one click so only unfamiliar words at your edge stay highlighted.
                </p>
              </div>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <select id="pl-lang-select" class="select" aria-label="Placement test language">
                  ${LANGUAGES.map(
          (l) => `<option value="${l.code}" ${l.code === lang ? "selected" : ""}>${esc2(l.name)} (${esc2(l.nativeName)})</option>`
        ).join("")}
                </select>
                <button type="button" class="btn btn-primary" id="pl-start-btn" style="padding:9px 18px;font-size:13.5px;">
                  ${displayAssessment ? "\u21BB Retake Placement Test" : "\u25B6 Start Placement Test"}
                </button>
              </div>
            </div>

            <div class="pl-band-strip">
              ${CEFR_BANDS.map((band) => {
          const info = CEFR_META[band];
          return `
                  <div class="pl-band-pill">
                    <span class="pl-band-code">${band}</span>
                    <span class="pl-band-desc">${esc2(info.title)}</span>
                    <span class="pl-band-range">~${info.approxVocab.toLocaleString()} words</span>
                  </div>`;
        }).join("")}
            </div>
          </div>

          ${displayAssessment ? this.renderResultMarkup(displayAssessment, knownCount, learningCount) : `
            <div class="card" style="text-align:center;padding:36px 24px;">
              <div style="font-size:36px;margin-bottom:10px;">\u{1F3AF}</div>
              <h2 class="card-title" style="margin:0 0 8px;">No Placement Assessment Yet for ${esc2(langName)}</h2>
              <p style="margin:0 auto 18px;max-width:520px;color:var(--ink-2);font-size:13.5px;">
                Take a quick 90-second adaptive test (12 questions) to benchmark your ${esc2(langName)} level
                and automatically pre-mark foundational vocabulary you already know.
              </p>
              <button type="button" class="btn btn-primary" id="pl-start-empty-btn" style="padding:9px 20px;">
                \u25B6 Begin 12-Question Adaptive Test
              </button>
            </div>
          `}

          ${history2.length > 0 ? `
            <div class="card">
              <h2 class="card-title">Assessment History (${esc2(langName)})</h2>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>CEFR Level</th>
                    <th>Est. Vocabulary</th>
                    <th>Frontier Rank</th>
                    <th>Accuracy</th>
                    <th>Confidence</th>
                    <th>Calibrated</th>
                  </tr>
                </thead>
                <tbody>
                  ${history2.map((h) => {
          const totalAns = Object.values(h.bandScores).reduce((s, b) => s + b.total, 0);
          const totalCor = Object.values(h.bandScores).reduce((s, b) => s + b.correct, 0);
          return `
                      <tr>
                        <td>${new Date(h.completedAt).toLocaleString()}</td>
                        <td><span class="pl-cefr-chip" data-level="${h.cefrLevel}">${h.cefrLevel} \xB7 ${esc2(h.cefrTitle)}</span></td>
                        <td>~${h.estimatedVocab.toLocaleString()} words</td>
                        <td>${h.recommendedRankFrontier > 0 ? `Top ${h.recommendedRankFrontier.toLocaleString()}` : "Start fresh"}</td>
                        <td>${totalCor} / ${totalAns}</td>
                        <td>${h.confidencePct}%</td>
                        <td>${h.appliedCalibration ? "\u2713 Applied" : "\u2014"}</td>
                      </tr>`;
        }).join("")}
                </tbody>
              </table>
            </div>` : ""}
        </div>
      `
      );
      container.querySelector("#pl-lang-select")?.addEventListener("change", async (e) => {
        const nextLang = e.target.value;
        this.session = null;
        this.latestResult = null;
        await ctx.onSwitchLanguage(nextLang);
      });
      const startQuiz = () => {
        this.lastFeedback = null;
        this.session = createPlacementSession(ctx.dictIndex, { totalQuestions: 12 });
        this.render(container, ctx);
      };
      container.querySelector("#pl-start-btn")?.addEventListener("click", startQuiz);
      container.querySelector("#pl-start-empty-btn")?.addEventListener("click", startQuiz);
      if (displayAssessment) {
        this.bindResultEvents(container, ctx, displayAssessment);
      }
    });
  }
  renderResultMarkup(res, currentKnown, currentLearning) {
    const info = CEFR_META[res.cefrLevel] || CEFR_META.A0;
    const canUndo = Boolean(this.undoSnapshot && this.undoSnapshot.assessmentId === res.id);
    const totalAnswered = Object.values(res.bandScores).reduce((s, b) => s + b.total, 0);
    const totalCorrect = Object.values(res.bandScores).reduce((s, b) => s + b.correct, 0);
    return `
      <div class="card pl-result-card" id="pl-result-card">
        <div class="pl-result-grid">
          <div class="pl-level-box">
            <div class="pl-cefr-badge" id="pl-cefr-badge" data-level="${res.cefrLevel}">${res.cefrLevel}</div>
            <div>
              <div style="font-size:11.5px;color:var(--ink-3);text-transform:uppercase;font-weight:700;letter-spacing:0.05em;">
                Diagnosed Proficiency
              </div>
              <div style="font-size:20px;font-weight:700;color:var(--ink);margin-top:2px;">
                ${esc2(res.cefrTitle || info.title)}
              </div>
              <div style="font-size:13px;color:var(--ink-2);margin-top:4px;line-height:1.45;">
                ${esc2(info.summary)}
              </div>
            </div>
          </div>

          <div class="pl-metrics-row">
            <div class="pl-metric">
              <div class="pl-metric-val">~${res.estimatedVocab.toLocaleString()}</div>
              <div class="pl-metric-lbl">Estimated Vocabulary</div>
            </div>
            <div class="pl-metric">
              <div class="pl-metric-val">${res.recommendedRankFrontier > 0 ? `Top ${res.recommendedRankFrontier.toLocaleString()}` : "Start Fresh"}</div>
              <div class="pl-metric-lbl">Recommended Frontier</div>
            </div>
            <div class="pl-metric">
              <div class="pl-metric-val">${totalCorrect}/${totalAnswered}</div>
              <div class="pl-metric-lbl">Correct (${res.confidencePct}% conf.)</div>
            </div>
          </div>
        </div>

        <div class="pl-calibration-banner">
          <div>
            <strong style="color:var(--ink);font-size:14.5px;">
              1-Click Vocabulary Calibration
            </strong>
            <div style="font-size:12.5px;color:var(--ink-2);margin-top:3px;">
              ${res.recommendedRankFrontier > 0 ? `Mark top <b>${res.recommendedRankFrontier.toLocaleString()}</b> high-frequency words + your <b>${res.correctWords.length}</b> verified words as <b>Known</b>, and add <b>${res.missedWords.length}</b> missed test words to <b>Learning (Stage 1)</b>.` : `Mark your <b>${res.correctWords.length}</b> verified words as <b>Known</b> and add <b>${res.missedWords.length}</b> missed words to <b>Learning (Stage 1)</b>.`}
              <span style="color:var(--ink-3);"> (Current profile: ${currentKnown.toLocaleString()} Known \xB7 ${currentLearning} Learning)</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;flex-wrap:wrap;">
            ${canUndo ? `<button type="button" class="btn btn-amber" id="pl-undo-calibration">\u21B6 Undo Calibration</button>` : ""}
            <button type="button" class="btn btn-primary" id="pl-apply-calibration">
              ${res.appliedCalibration ? "\u2713 Re-Apply Calibration" : "\u26A1 Calibrate My Vocabulary"}
            </button>
          </div>
        </div>

        <div id="pl-calibration-msg" style="font-size:13px;color:var(--green);margin-top:8px;" hidden></div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:18px;">
          <div>
            <h3 style="margin:0 0 10px;font-size:12.5px;color:var(--ink-2);text-transform:uppercase;letter-spacing:0.04em;">
              Accuracy by CEFR Band
            </h3>
            <div class="pl-bars">
              ${CEFR_BANDS.map((band) => {
      const stat = res.bandScores[band] ?? { correct: 0, total: 0 };
      const pct = stat.total > 0 ? Math.round(stat.correct / stat.total * 100) : 0;
      return `
                  <div class="pl-bar-row">
                    <span class="pl-bar-band">${band}</span>
                    <div class="pl-bar-track">
                      <div class="pl-bar-fill" style="width:${pct}%;background:${stat.total === 0 ? "transparent" : pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--amber)" : "var(--danger)"}"></div>
                    </div>
                    <span class="pl-bar-stat">${stat.total > 0 ? `${stat.correct}/${stat.total} (${pct}%)` : "Not sampled"}</span>
                  </div>
                `;
    }).join("")}
            </div>
          </div>

          <div>
            <h3 style="margin:0 0 10px;font-size:12.5px;color:var(--ink-2);text-transform:uppercase;letter-spacing:0.04em;">
              Sampled Words Breakdown
            </h3>
            <div style="margin-bottom:10px;">
              <div style="font-size:12px;color:var(--green);font-weight:600;margin-bottom:4px;">
                \u2713 Verified Known (${res.correctWords.length})
              </div>
              <div class="pl-word-chips">
                ${res.correctWords.length > 0 ? res.correctWords.map((w) => `<span class="w-chip" data-s="5">${esc2(w)}</span>`).join("") : '<span style="color:var(--ink-3);font-size:12.5px;">None</span>'}
              </div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--amber);font-weight:600;margin-bottom:4px;">
                \u2726 Frontier / To Learn (${res.missedWords.length})
              </div>
              <div class="pl-word-chips">
                ${res.missedWords.length > 0 ? res.missedWords.map((w) => `<span class="w-chip" data-s="1">${esc2(w)}</span>`).join("") : '<span style="color:var(--ink-3);font-size:12.5px;">None \u2014 100% score!</span>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  bindResultEvents(container, ctx, assessment) {
    container.querySelector("#pl-apply-calibration")?.addEventListener("click", async () => {
      const lang = ctx.settings.activeLang;
      const { knownWords, learningWords } = buildPlacementCalibrationWords(
        assessment,
        ctx.dictIndex
      );
      const existingWords = await getWordsByLang(lang);
      const existingMap = /* @__PURE__ */ new Map();
      for (const w of existingWords) existingMap.set(w.word, w);
      const previousRecords = /* @__PURE__ */ new Map();
      const touchedWords = [];
      const now = Date.now();
      const batch = [];
      for (const word of knownWords) {
        if (!word) continue;
        const prev = existingMap.get(word) ?? null;
        if (!previousRecords.has(word)) {
          previousRecords.set(word, prev ? { ...prev } : null);
          touchedWords.push(word);
        }
        batch.push({
          id: `${lang}:${word}`,
          lang,
          word,
          status: 5,
          isPhrase: false,
          isCustomSegment: prev?.isCustomSegment ?? false,
          lookupCount: prev?.lookupCount ?? 0,
          source: "bulk",
          ...prev?.customMeaning ? { customMeaning: prev.customMeaning } : {},
          ...prev?.reading ? { reading: prev.reading } : {},
          deleted: false,
          createdAt: prev?.createdAt ?? now,
          updatedAt: now
        });
      }
      for (const word of learningWords) {
        if (!word) continue;
        const prev = existingMap.get(word) ?? null;
        if (prev?.status === 5) continue;
        if (!previousRecords.has(word)) {
          previousRecords.set(word, prev ? { ...prev } : null);
          touchedWords.push(word);
        }
        batch.push({
          id: `${lang}:${word}`,
          lang,
          word,
          status: 1,
          isPhrase: false,
          isCustomSegment: prev?.isCustomSegment ?? false,
          lookupCount: prev?.lookupCount ?? 0,
          source: "bulk",
          ...prev?.customMeaning ? { customMeaning: prev.customMeaning } : {},
          ...prev?.reading ? { reading: prev.reading } : {},
          deleted: false,
          createdAt: prev?.createdAt ?? now,
          updatedAt: now
        });
      }
      await putWordRecordsBatch(batch);
      assessment.appliedCalibration = true;
      await putAssessment(assessment);
      this.latestResult = assessment;
      this.undoSnapshot = {
        assessmentId: assessment.id,
        lang,
        previousRecords,
        touchedWords
      };
      sendBgMessage({ type: "BROADCAST_WORDS_REFRESH", lang }).catch(() => {
      });
      await ctx.onRefreshData();
      ctx.onNotify(
        `Calibrated ${knownWords.length.toLocaleString()} words as Known and ${learningWords.length} frontier words as Learning!`
      );
    });
    container.querySelector("#pl-undo-calibration")?.addEventListener("click", async () => {
      if (!this.undoSnapshot) return;
      const snap = this.undoSnapshot;
      const now = Date.now();
      const restoreBatch = [];
      for (const word of snap.touchedWords) {
        const prev = snap.previousRecords.get(word);
        if (prev) {
          restoreBatch.push({ ...prev, updatedAt: now });
        } else {
          restoreBatch.push({
            id: `${snap.lang}:${word}`,
            lang: snap.lang,
            word,
            status: 0,
            isPhrase: false,
            isCustomSegment: false,
            lookupCount: 0,
            source: "bulk",
            deleted: true,
            createdAt: now,
            updatedAt: now
          });
        }
      }
      if (restoreBatch.length > 0) {
        await putWordRecordsBatch(restoreBatch);
      }
      assessment.appliedCalibration = false;
      await putAssessment(assessment);
      this.latestResult = assessment;
      this.undoSnapshot = null;
      sendBgMessage({ type: "BROADCAST_WORDS_REFRESH", lang: snap.lang }).catch(() => {
      });
      await ctx.onRefreshData();
      ctx.onNotify("Undid placement vocabulary calibration.");
    });
  }
  renderActiveQuiz(container, ctx) {
    const session = this.session;
    const q = session.activeQuestion;
    if (!q) {
      this.finishQuiz(container, ctx);
      return;
    }
    const stepNum = q.index + 1;
    const progressPct = Math.round((stepNum - 1) / q.total * 100);
    const bandInfo = CEFR_META[q.band];
    const langMeta = LANG_MAP[ctx.settings.activeLang];
    const langName = langMeta?.name || ctx.settings.activeLang;
    setHtmlContent(
      container,
      `
      <div class="pl-wrap">
        <div class="card pl-quiz-card" id="pl-quiz-card">
          <div class="pl-quiz-top">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <span class="pl-eyebrow">QUESTION ${stepNum} OF ${q.total}</span>
              <span class="pl-band-tag" data-band="${q.band}">Band ${q.band} \xB7 ${esc2(bandInfo.title)}</span>
            </div>
            <button type="button" class="btn btn-sm" id="pl-cancel-quiz">\u2715 Quit Test</button>
          </div>

          <div class="progress-track" style="margin:10px 0 16px;">
            <div class="progress-fill" style="width:${progressPct}%;background:var(--blue)"></div>
          </div>

          ${this.lastFeedback ? `<div class="pl-feedback-pill ${this.lastFeedback.wasCorrect ? "ok" : "miss"}">
                  ${this.lastFeedback.wasCorrect ? `\u2713 Correct! "${esc2(this.lastFeedback.word)}" = ${esc2(this.lastFeedback.meaning)}` : this.lastFeedback.unsure ? `\u21B7 Skipped "${esc2(this.lastFeedback.word)}" (${esc2(this.lastFeedback.meaning)})` : `\u2715 "${esc2(this.lastFeedback.word)}" means "${esc2(this.lastFeedback.meaning)}"`}
                </div>` : ""}

          <div class="pl-question-box">
            <div class="pl-mode-label">
              ${q.direction === "word_to_meaning" ? `Select the correct meaning for this ${esc2(langName)} word:` : `Select the ${esc2(langName)} word that matches this meaning:`}
            </div>
            <div class="pl-prompt-row">
              <div class="pl-prompt-main" id="pl-prompt-text">${esc2(q.prompt)}</div>
              ${q.direction === "word_to_meaning" ? `<button type="button" class="btn btn-sm" id="pl-speak-prompt" title="Listen to pronunciation">\u{1F50A}</button>` : ""}
            </div>
            <div class="pl-prompt-sub">
              ${q.reading && q.reading !== q.prompt ? `<span>[${esc2(q.reading)}]</span>` : ""}
              ${q.pos ? `<span class="pl-pos-tag">${esc2(q.pos)}</span>` : ""}
            </div>
          </div>

          <div class="pl-options-grid" role="group" aria-label="Answer choices">
            ${q.options.map(
        (opt, idx) => `
              <button type="button" class="pl-option-btn" id="pl-opt-${idx}" data-idx="${idx}" data-opt-id="${esc2(opt.id)}">
                <span class="pl-opt-key">${idx + 1}</span>
                <span class="pl-opt-label">
                  ${esc2(opt.label)}
                  ${opt.sublabel ? `<small style="color:var(--ink-3);margin-left:6px">[${esc2(opt.sublabel)}]</small>` : ""}
                </span>
              </button>`
      ).join("")}
          </div>

          <div class="pl-quiz-foot">
            <button type="button" class="btn" id="pl-skip-btn">
              I'm not sure yet (Space / 0)
            </button>
            <span style="font-size:12px;color:var(--ink-3);">
              Tip: Press keys <b>1\u20134</b> to answer or <b>Space</b> if unsure (guessing lowers placement accuracy).
            </span>
          </div>
        </div>
      </div>
    `
    );
    const handleChoice = async (optionId) => {
      const targetWord = q.targetEntry.w;
      const targetMeaning = q.targetEntry.m[0] || "";
      const out = submitPlacementAnswer(session, optionId);
      this.lastFeedback = {
        wasCorrect: out.correct,
        unsure: optionId === "unsure",
        word: targetWord,
        meaning: targetMeaning
      };
      if (out.finished) {
        await this.finishQuiz(container, ctx);
      } else {
        this.renderActiveQuiz(container, ctx);
      }
    };
    container.querySelectorAll(".pl-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const optId = btn.dataset.optId || "unsure";
        handleChoice(optId);
      });
    });
    container.querySelector("#pl-skip-btn")?.addEventListener("click", () => {
      handleChoice("unsure");
    });
    container.querySelector("#pl-speak-prompt")?.addEventListener("click", () => {
      speakText(q.targetEntry.w, ctx.settings.activeLang, ctx.settings);
    });
    container.querySelector("#pl-cancel-quiz")?.addEventListener("click", () => {
      this.session = null;
      this.lastFeedback = null;
      this.render(container, ctx);
    });
    this.keyHandler = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4") {
        e.preventDefault();
        const opt = q.options[Number(e.key) - 1];
        if (opt) handleChoice(opt.id);
      } else if (e.key === "0" || e.key === " ") {
        e.preventDefault();
        handleChoice("unsure");
      }
    };
    window.addEventListener("keydown", this.keyHandler);
  }
  async finishQuiz(container, ctx) {
    this.unbindKeys();
    if (!this.session) return;
    const result = finalizePlacementSession(this.session, ctx.dictIndex);
    await putAssessment(result);
    this.latestResult = result;
    this.session = null;
    this.lastFeedback = null;
    this.render(container, ctx);
  }
  unbindKeys() {
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
  }
};
function esc2(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/shared/sync-crypto.ts
function bufToBase64(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function base64ToBuf(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
async function sha256Hex(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function deriveAesKey(passphrase, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 1e5,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
async function encryptApiKeysWithPassphrase(keys, passphrase) {
  if (passphrase.length < 8) {
    throw new Error("Passphrase must be at least 8 characters.");
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await deriveAesKey(passphrase, salt);
  const encoded = new TextEncoder().encode(JSON.stringify(keys));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, encoded);
  return {
    salt: bufToBase64(salt),
    iv: bufToBase64(iv),
    ciphertext: bufToBase64(ciphertext)
  };
}
async function decryptApiKeysWithPassphrase(payload, passphrase) {
  const salt = base64ToBuf(payload.salt);
  const iv = base64ToBuf(payload.iv);
  const cipher = base64ToBuf(payload.ciphertext);
  const aesKey = await deriveAesKey(passphrase, salt);
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, cipher);
  return JSON.parse(new TextDecoder().decode(plainBuf));
}
function validatePairingCode(code) {
  const clean = code.trim();
  if (clean.length < 8 || clean.length > 32) {
    return { valid: false, reason: "Code must be 8 to 32 letters and digits." };
  }
  if (!/^[A-Za-z0-9]+$/.test(clean)) {
    return { valid: false, reason: "Only letters and digits are allowed." };
  }
  if (!/[A-Za-z]/.test(clean) || !/[0-9]/.test(clean)) {
    return { valid: false, reason: "Code must include both letters and digits." };
  }
  const upper = clean.toUpperCase();
  if (upper === "12345678" || upper === "PASSWORD" || upper === "PASSWORD1") {
    return { valid: false, reason: "Common codes like 12345678 and PASSWORD are turned down." };
  }
  return { valid: true };
}
function mergeWordRecords(local, incoming) {
  const map = /* @__PURE__ */ new Map();
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
function mergeBookItems(local, incoming) {
  const map = /* @__PURE__ */ new Map();
  for (const b of local) map.set(b.id, b);
  for (const inc of incoming) {
    const cur = map.get(inc.id);
    if (!cur) {
      map.set(inc.id, inc);
      continue;
    }
    if (inc.updatedAt >= cur.updatedAt) {
      map.set(inc.id, {
        ...cur,
        ...inc,
        chapters: inc.chapters?.length ? inc.chapters : cur.chapters
      });
    }
  }
  return Array.from(map.values());
}
function mergeBookmarks(local, incoming) {
  const map = /* @__PURE__ */ new Map();
  for (const bm of local) map.set(bm.id, bm);
  for (const inc of incoming) {
    const cur = map.get(inc.id);
    if (!cur) {
      map.set(inc.id, inc);
      continue;
    }
    if (cur.deleted || inc.deleted) {
      map.set(inc.id, { ...inc.createdAt >= cur.createdAt ? inc : cur, deleted: true });
    }
  }
  return Array.from(map.values());
}
function mergeDailyStats(local, incoming, mode, currentDeviceId) {
  const map = /* @__PURE__ */ new Map();
  for (const s of local) map.set(s.id, s);
  for (const inc of incoming) {
    const rewritten = mode === "restore_same_device" ? {
      ...inc,
      deviceId: currentDeviceId,
      id: `${inc.lang}:${inc.date}:${currentDeviceId}`
    } : inc;
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
        updatedAt: Math.max(cur.updatedAt, rewritten.updatedAt)
      });
    }
  }
  return Array.from(map.values());
}
function mergeListeningLogs(local, incoming) {
  const map = /* @__PURE__ */ new Map();
  for (const l of local) map.set(l.id, l);
  for (const inc of incoming) {
    const cur = map.get(inc.id);
    if (!cur) {
      map.set(inc.id, inc);
    } else {
      map.set(inc.id, {
        ...inc.updatedAt >= cur.updatedAt ? inc : cur,
        secondsEarned: Math.max(cur.secondsEarned, inc.secondsEarned)
      });
    }
  }
  return Array.from(map.values());
}

// src/dashboard/settings-view.ts
var SECTION_META = [
  { id: "profile", group: "General", label: "Profile", keywords: "profile name learner device" },
  { id: "reading", group: "Reading & words", label: "Reading", keywords: "hover click links keyboard shortcuts keymap never run domains goals pdf font inline word replacement diglot weave toucan fluent code switching passive immersion" },
  { id: "appearance", group: "Reading & words", label: "Appearance", keywords: "theme dark light colours highlight underline strength word panel size" },
  { id: "languages", group: "Reading & words", label: "Languages", keywords: "24 languages counting lemma surface readings furigana pinyin jyutping pitch accent yomitan dictionary delete" },
  { id: "voice", group: "Reading & words", label: "Voice", keywords: "tts speech aloud kokoro cloud voice speed volume" },
  { id: "listen", group: "Videos", label: "Watch & Listen", keywords: "smart listening tracking youtube thumbnail domains" },
  { id: "captions", group: "Videos", label: "Dual Captions", keywords: "subtitles captions blur translation karaoke auto pause band filter opacity" },
  { id: "controller", group: "Extras", label: "Game controller", keywords: "gamepad xbox playstation joycon swap abxy scroll" },
  { id: "ai", group: "Extras", label: "AI check", keywords: "gemini claude openai deepseek api key verdict chatgpt prompt" },
  { id: "anki", group: "Extras", label: "Anki", keywords: "ankiconnect port deck note type card layout mature suspend sync" },
  { id: "sync", group: "Devices & data", label: "Sync & backup", keywords: "pairing code backup restore merge passphrase encrypt aes" },
  { id: "data", group: "Devices & data", label: "Your data", keywords: "export import json reset defaults privacy" }
];
var READING_SHORTCUT_LABELS = [
  ["grade1", "Grade Level 1"],
  ["grade2", "Grade Level 2"],
  ["grade3", "Grade Level 3"],
  ["grade4", "Grade Level 4"],
  ["known", "Mark Known"],
  ["ignore", "Ignore word"],
  ["resetNew", "Reset back to New"],
  ["aiCheck", "Run AI word check"],
  ["speakWord", "Speak word"],
  ["speakSentence", "Speak sentence"],
  ["customMeaning", "Edit custom meaning"],
  ["googleTranslate", "Translate sentence"],
  ["dictLink", "Open external dictionary"],
  ["charactersTab", "Switch Meaning / Characters"],
  ["ankiAdd", "Send to Anki"],
  ["ankiPick", "Pick Anki card details"],
  ["askAiChat", "Ask your AI chat"],
  ["nextWord", "Next study word"],
  ["prevWord", "Previous study word"],
  ["markPageKnown", "Mark all page blue Known"],
  ["toggleHighlights", "Toggle word highlights"],
  ["readAloud", "Read page aloud"],
  ["openReaderView", "Reader View"],
  ["sentenceMode", "Sentence by sentence"],
  ["nextFreqSentence", "Next sentence w/ frequent word"],
  ["prevFreqSentence", "Prev sentence w/ frequent word"],
  ["toggleDiglot", "Toggle Inline Word Replacement"]
];
var VIDEO_SHORTCUT_LABELS = [
  ["toggleCaptions", "Toggle Dual Captions"],
  ["prevLine", "Previous subtitle line"],
  ["replayLine", "Replay current line"],
  ["nextLine", "Next subtitle line"],
  ["autoPause", "Toggle Auto-pause"],
  ["peekForward", "Peek blurred layer"],
  ["hideKnownLines", "Hide fully known lines"],
  ["cycleBandFilter", "Cycle vocabulary band"],
  ["wordsInVideo", "Words in this video"],
  ["subEarlier", "Subtitles 0.25s earlier"],
  ["subLater", "Subtitles 0.25s later"],
  ["nextFreqLine", "Next line w/ frequent unknown"],
  ["markLineKnown", "Mark subtitle line Known"]
];
var recordingTarget = null;
var backupPassphraseMem = "";
function renderSettingsTab(container, ctx) {
  const s = ctx.settings;
  const q = ctx.searchQuery.trim().toLowerCase();
  const matchingSections = q ? SECTION_META.filter(
    (m) => m.label.toLowerCase().includes(q) || m.keywords.toLowerCase().includes(q)
  ).map((m) => m.id) : [ctx.activeSection];
  const groups = ["General", "Reading & words", "Videos", "Extras", "Devices & data"];
  const navHtml = groups.map((grp) => {
    const items = SECTION_META.filter((m) => m.group === grp);
    return `
        <div class="settings-group-lbl">${esc3(grp)}</div>
        ${items.map(
      (it) => `
          <button
            type="button"
            class="settings-nav-btn ${!q && ctx.activeSection === it.id ? "active" : ""}"
            data-sec-nav="${it.id}"
          >
            ${esc3(it.label)}
          </button>
        `
    ).join("")}
      `;
  }).join("");
  setHtmlContent(
    container,
    `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap">
      <div>
        <h1 class="page-heading">Settings</h1>
        <p class="page-sub" style="margin-bottom:0">Every Verba control lives locally on your device \u2014 changes take effect immediately.</p>
      </div>
      <input
        type="search"
        id="settings-search-input"
        class="input"
        style="min-width:270px"
        placeholder="Search settings (e.g. furigana, Anki, blur, backup)\u2026"
        value="${esc3(ctx.searchQuery)}"
      />
    </div>

    <div class="settings-layout">
      <nav class="settings-nav" aria-label="Settings sections">
        ${navHtml}
      </nav>
      <div id="settings-sections-pane">
        ${matchingSections.length === 0 ? `<div class="card"><p style="margin:0;color:var(--ink-3)">No settings match "${esc3(ctx.searchQuery)}".</p></div>` : matchingSections.map((secId) => renderSectionHtml(secId, ctx)).join("")}
      </div>
    </div>
  `
  );
  bindSettingsEvents(container, ctx);
}
function renderSectionHtml(secId, ctx) {
  const s = ctx.settings;
  const langOpts = getLangOptionsFromSettings(s, ctx.optionsLang);
  const langMeta = LANG_MAP[ctx.optionsLang];
  switch (secId) {
    case "profile":
      return `
        <section class="settings-section" data-sec="profile">
          <h2 class="card-title">General &amp; Learner Profile</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Learner display name</div>
              <div class="setting-desc">Stored locally on your device for your study log and backups.</div>
            </div>
            <input type="text" class="input" data-str="profileName" placeholder="Learner" value="${esc3(s.profileName)}" style="width:230px" />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Device ID</div>
              <div class="setting-desc">Used for conflict-free multi-device backup &amp; sync.</div>
            </div>
            <code style="font-family:var(--mono);font-size:12px;color:var(--ink-2)">${esc3(s.deviceId)}</code>
          </div>
        </section>
      `;
    case "reading": {
      const conflicts = detectKeyConflicts(s.readingKeymap);
      return `
        <section class="settings-section" data-sec="reading">
          <h2 class="card-title">Reading &amp; Keyboard Shortcuts</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Run Verba on web pages</div>
              <div class="setting-desc">Automatically highlight unfamiliar words on articles, forums &amp; chatbots.</div>
            </div>
            <input type="checkbox" data-bool="runOnWebPages" ${s.runOnWebPages ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Inline word replacement on native-language pages (Diglot Weave)</div>
              <div class="setting-desc">Passively weave target-language vocabulary into English/L1 web pages you browse daily (Trusty &amp; Truong, CHI 2011).</div>
            </div>
            <input type="checkbox" data-bool="inlineReplacementEnabled" ${s.inlineReplacementEnabled ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Inline replacement density (${s.inlineReplacementDensityPct}%)</div>
              <div class="setting-desc">Percentage of words per paragraph replaced with target-language equivalents.</div>
            </div>
            <input type="range" min="5" max="40" step="5" data-num="inlineReplacementDensityPct" value="${s.inlineReplacementDensityPct}" />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Vocabulary pool to weave</div>
              <div class="setting-desc">Prioritizes words you are actively learning (1\u20134) plus high-frequency new words (i+1).</div>
            </div>
            <select class="select" data-str="inlineReplacementPool">
              <option value="learning_and_new" ${s.inlineReplacementPool === "learning_and_new" ? "selected" : ""}>Learning (1\u20134) + New words (i+1)</option>
              <option value="learning_only" ${s.inlineReplacementPool === "learning_only" ? "selected" : ""}>Learning words only (1\u20134)</option>
              <option value="all_vocab" ${s.inlineReplacementPool === "all_vocab" ? "selected" : ""}>All vocabulary (including Known)</option>
            </select>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show original word hint next to woven words</div>
              <div class="setting-desc">Displays a subtle inline hint of the original L1 word alongside the target-language replacement.</div>
            </div>
            <input type="checkbox" data-bool="inlineReplacementShowHint" ${s.inlineReplacementShowHint ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show floating Counter Island on pages</div>
              <div class="setting-desc">Shows page new/learning counts, Know-all button &amp; Reader trigger.</div>
            </div>
            <input type="checkbox" data-bool="showPageCounter" ${s.showPageCounter ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Grade words by hovering</div>
              <div class="setting-desc">Press 1\u20134, K, X, or 0 while hovering a word without clicking first.</div>
            </div>
            <input type="checkbox" data-bool="gradeByHovering" ${s.gradeByHovering ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Hover preview delay (${s.hoverDelayMs} ms)</div>
            </div>
            <input type="range" min="0" max="600" step="20" data-num="hoverDelayMs" value="${s.hoverDelayMs}" />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Clicking a blue (New) word starts learning at Level 1</div>
            </div>
            <input type="checkbox" data-bool="clickNewStartsLearning" ${s.clickNewStartsLearning ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Links &amp; buttons stay clickable (Shift+click opens word)</div>
            </div>
            <input type="checkbox" data-bool="linksStayClickable" ${s.linksStayClickable ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show context-matching dictionary entry first</div>
            </div>
            <input type="checkbox" data-bool="contextMeaningFirst" ${s.contextMeaningFirst ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Where words read are counted</div>
            </div>
            <select class="select" data-str="countWordsReadWhere">
              <option value="everywhere" ${s.countWordsReadWhere === "everywhere" ? "selected" : ""}>Everywhere Verba highlights</option>
              <option value="reader_and_books" ${s.countWordsReadWhere === "reader_and_books" ? "selected" : ""}>Only in Reader &amp; Books</option>
            </select>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">PDF default view</div>
            </div>
            <select class="select" data-str="pdfDefaultMode">
              <option value="fit_phones" ${s.pdfDefaultMode === "fit_phones" ? "selected" : ""}>Reflowed paragraphs</option>
              <option value="printed" ${s.pdfDefaultMode === "printed" ? "selected" : ""}>Printed page layout</option>
            </select>
          </div>
          <div class="setting-row" style="align-items:flex-start">
            <div>
              <div class="setting-label">Never run on these domains</div>
              <div class="setting-desc">One hostname per line (e.g. mail.google.com).</div>
            </div>
            <textarea class="textarea" id="never-domains-ta" rows="3" style="width:260px">${esc3(s.neverRunDomains.join("\n"))}</textarea>
          </div>

          <div style="margin-top:18px;display:flex;justify-content:space-between;align-items:center">
            <h3 style="margin:0;font-size:15px;color:var(--ink)">Keyboard Shortcuts (Click any key to rebind)</h3>
            <button type="button" class="btn btn-sm" id="btn-reset-keymaps">Reset default keys</button>
          </div>
          ${conflicts.length > 0 ? `<p style="color:#fbbf24;font-size:12px;margin:6px 0">\u26A0 Duplicate key binding detected: ${esc3(conflicts.join(", "))}</p>` : ""}
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:6px 18px;margin-top:10px">
            ${READING_SHORTCUT_LABELS.map(([key, lbl]) => {
        const isRec = recordingTarget?.group === "reading" && recordingTarget.key === key;
        return `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border-subtle)">
                  <span style="font-size:12.5px">${esc3(lbl)}</span>
                  <button type="button" class="keybind-btn ${isRec ? "recording" : ""}" data-bind-group="reading" data-bind-key="${key}">
                    ${isRec ? "Press key\u2026" : esc3(s.readingKeymap[key])}
                  </button>
                </div>
              `;
      }).join("")}
          </div>

          <h3 style="margin:18px 0 8px;font-size:15px;color:var(--ink)">Video (Dual Captions) Shortcuts</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:6px 18px">
            ${VIDEO_SHORTCUT_LABELS.map(([key, lbl]) => {
        const isRec = recordingTarget?.group === "video" && recordingTarget.key === key;
        return `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border-subtle)">
                  <span style="font-size:12.5px">${esc3(lbl)}</span>
                  <button type="button" class="keybind-btn ${isRec ? "recording" : ""}" data-bind-group="video" data-bind-key="${key}">
                    ${isRec ? "Press key\u2026" : esc3(s.videoKeymap[key])}
                  </button>
                </div>
              `;
      }).join("")}
          </div>
        </section>
      `;
    }
    case "appearance":
      return `
        <section class="settings-section" data-sec="appearance">
          <h2 class="card-title">Appearance &amp; Highlight Colours</h2>
          <div class="setting-row">
            <div><div class="setting-label">Theme</div></div>
            <select class="select" data-str="theme">
              <option value="dark" ${s.theme === "dark" ? "selected" : ""}>Dark (Verba slate)</option>
              <option value="light" ${s.theme === "light" ? "selected" : ""}>Light (Warm paper)</option>
              <option value="system" ${s.theme === "system" ? "selected" : ""}>Match system</option>
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Interface language</div></div>
            <select class="select" data-str="uiLanguage">
              ${UI_LANGUAGES.map((l) => `<option value="${l.code}" ${s.uiLanguage === l.code ? "selected" : ""}>${esc3(l.name)}</option>`).join("")}
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight unfamiliar words (Shift+H)</div></div>
            <input type="checkbox" data-bool="highlightWords" ${s.highlightWords ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Underline instead of background fill</div></div>
            <input type="checkbox" data-bool="underlineInsteadOfFill" ${s.underlineInsteadOfFill ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight special words (names &amp; places)</div></div>
            <input type="checkbox" data-bool="specialWordsHighlight" ${s.specialWordsHighlight ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight strength (${Math.round(s.highlightStrength * 100)}%)</div></div>
            <input type="range" min="0.5" max="1.5" step="0.1" data-num="highlightStrength" value="${s.highlightStrength}" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight colours (New / Learning / Cross-script / Phrase)</div></div>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" data-color="newWord" value="${s.colors.newWord}" title="New word" />
              <input type="color" data-color="learning" value="${s.colors.learning}" title="Learning" />
              <input type="color" data-color="crossScript" value="${s.colors.crossScript}" title="Cross-script known" />
              <input type="color" data-color="selectedPhrase" value="${s.colors.selectedPhrase}" title="Selected phrase" />
            </div>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Word panel size</div></div>
            <select class="select" id="wp-size-select">
              ${["S", "M", "L", "XL"].map((sz) => `<option value="${sz}" ${s.wordPanel.size === sz ? "selected" : ""}>${sz}</option>`).join("")}
            </select>
          </div>
        </section>
      `;
    case "languages":
      return `
        <section class="settings-section" data-sec="languages">
          <h2 class="card-title">Languages (All 24 Offline Dictionaries)</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Automatically switch active language to match page</div>
              <div class="setting-desc">Only switches among languages ticked in "Languages I'm learning" below.</div>
            </div>
            <input type="checkbox" data-bool="autoSwitchPageLang" ${s.autoSwitchPageLang ? "checked" : ""} />
          </div>

          <div style="margin:12px 0">
            <div class="setting-label" style="margin-bottom:8px">Languages I'm learning (${s.learningLangs.length} active)</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:6px">
              ${LANGUAGES.map((l) => {
        const checked = s.learningLangs.includes(l.code);
        return `
                  <label style="display:flex;align-items:center;gap:7px;padding:6px 9px;background:var(--surface-2);border-radius:7px;cursor:pointer;font-size:12.5px">
                    <input type="checkbox" class="learn-lang-chk" value="${l.code}" ${checked ? "checked" : ""} />
                    <span>${esc3(l.name)} <small style="color:var(--ink-3)">${esc3(l.nativeName)}</small></span>
                  </label>
                `;
      }).join("")}
            </div>
          </div>

          <hr style="border:none;border-top:1px solid var(--border);margin:18px 0" />

          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap">
            <h3 style="margin:0;font-family:var(--serif);font-style:italic;font-size:20px;color:var(--ink)">
              Options for ${esc3(langMeta?.name || ctx.optionsLang)}
            </h3>
            <select id="opts-lang-picker" class="select">
              ${LANGUAGES.map((l) => `<option value="${l.code}" ${l.code === ctx.optionsLang ? "selected" : ""}>${esc3(l.name)} (${esc3(l.nativeName)})</option>`).join("")}
            </select>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Word counting &amp; inflections</div>
              <div class="setting-desc">"As one word" groups inflected forms under their dictionary lemma; "Every form separately" tracks surface forms independently.</div>
            </div>
            <select class="select" data-langopt-str="countingMode">
              <option value="lemma" ${langOpts.countingMode === "lemma" ? "selected" : ""}>As one word (Lemma)</option>
              <option value="surface" ${langOpts.countingMode === "surface" ? "selected" : ""}>Every form separately</option>
            </select>
          </div>

          ${ctx.optionsLang === "zh" || ctx.optionsLang === "yue" ? `
            <div class="setting-row">
              <div>
                <div class="setting-label">Unify Simplified &amp; Traditional characters</div>
                <div class="setting-desc">Known words in one script glow green in the other script and count once.</div>
              </div>
              <input type="checkbox" data-langopt-bool="unifyScripts" ${langOpts.unifyScripts ? "checked" : ""} />
            </div>
          ` : ""}

          ${langMeta?.notations?.length ? `
            <div class="setting-row">
              <div><div class="setting-label">Show readings above words (Furigana / Pinyin / Romanization)</div></div>
              <input type="checkbox" data-langopt-bool="readingsEnabled" ${langOpts.readingsEnabled ? "checked" : ""} />
            </div>
            <div class="setting-row">
              <div><div class="setting-label">Reading notation</div></div>
              <select class="select" data-langopt-str="readingNotation">
                ${langMeta.notations.map((n) => `<option value="${n.id}" ${langOpts.readingNotation === n.id ? "selected" : ""}>${esc3(n.label)}</option>`).join("")}
              </select>
            </div>
            <div class="setting-row">
              <div><div class="setting-label">Show readings over</div></div>
              <select class="select" data-langopt-str="readingScope">
                <option value="new_learning" ${langOpts.readingScope === "new_learning" ? "selected" : ""}>New &amp; Learning (1\u20133)</option>
                <option value="new_only" ${langOpts.readingScope === "new_only" ? "selected" : ""}>New words only</option>
                <option value="every_word" ${langOpts.readingScope === "every_word" ? "selected" : ""}>Every word</option>
              </select>
            </div>
          ` : ""}

          ${ctx.optionsLang === "ja" ? `
            <div class="setting-row">
              <div><div class="setting-label">Show Japanese pitch accent</div></div>
              <input type="checkbox" data-langopt-bool="pitchAccent" ${langOpts.pitchAccent ? "checked" : ""} />
            </div>
          ` : ""}

          <div class="setting-row">
            <div><div class="setting-label">Translate into language</div></div>
            <select class="select" data-langopt-str="translateIntoLang">
              ${UI_LANGUAGES.map((l) => `<option value="${l.code}" ${langOpts.translateIntoLang === l.code ? "selected" : ""}>${esc3(l.name)}</option>`).join("")}
            </select>
          </div>

          <div class="setting-row">
            <div><div class="setting-label">Who translates sentences &amp; missing words</div></div>
            <select class="select" data-langopt-str="whoTranslates">
              <option value="google" ${langOpts.whoTranslates === "google" ? "selected" : ""}>Google Translate (with offline fallback)</option>
              <option value="offline" ${langOpts.whoTranslates === "offline" ? "selected" : ""}>Offline dictionary synthesis only</option>
            </select>
          </div>

          <div class="setting-row" style="align-items:flex-start;flex-direction:column">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
              <div>
                <div class="setting-label">Your own dictionaries (Yomitan .zip or CSV/TSV)</div>
                <div class="setting-desc">Import custom monolingual or specialist dictionaries for ${esc3(langMeta?.name || ctx.optionsLang)}.</div>
              </div>
              <div style="display:flex;gap:8px;align-items:center">
                <select class="select" data-langopt-str="customDictPlacement">
                  <option value="above" ${langOpts.customDictPlacement === "above" ? "selected" : ""}>Show above built-in</option>
                  <option value="below" ${langOpts.customDictPlacement === "below" ? "selected" : ""}>Show below built-in</option>
                  <option value="replace" ${langOpts.customDictPlacement === "replace" ? "selected" : ""}>Replace built-in</option>
                </select>
                <label class="btn btn-primary" style="cursor:pointer">
                  + Import dictionary
                  <input type="file" id="custom-dict-file" accept=".zip,.csv,.tsv,.txt" hidden />
                </label>
              </div>
            </div>
            ${ctx.customDicts.length > 0 ? `<div style="width:100%;display:flex;flex-direction:column;gap:6px;margin-top:8px">
                  ${ctx.customDicts.map(
        (cd) => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:var(--surface-2);border-radius:7px">
                      <span><strong>${esc3(cd.name)}</strong> <small style="color:var(--ink-3)">(${cd.entryCount.toLocaleString()} entries \xB7 ${cd.format})</small></span>
                      <button type="button" class="btn btn-sm btn-danger" data-del-dict="${esc3(cd.id)}">Remove</button>
                    </div>
                  `
      ).join("")}
                </div>` : ""}
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label" style="color:#fca5a5">Delete all ${esc3(langMeta?.name || ctx.optionsLang)} progress</div>
              <div class="setting-desc">Resets saved vocabulary and statistics for this language only.</div>
            </div>
            <button type="button" class="btn btn-danger" id="btn-delete-lang-progress">Delete progress\u2026</button>
          </div>
        </section>
      `;
    case "voice":
      return `
        <section class="settings-section" data-sec="voice">
          <h2 class="card-title">Voice &amp; Read Aloud</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Voice engine</div>
              <div class="setting-desc">Device Web Speech, Cloud AI voice, or local Kokoro-FastAPI / AllTalk server.</div>
            </div>
            <select class="select" data-str="voiceBackend">
              <option value="device" ${s.voiceBackend === "device" ? "selected" : ""}>Device built-in voices</option>
              <option value="cloud" ${s.voiceBackend === "cloud" ? "selected" : ""}>Cloud TTS (OpenAI / ElevenLabs / Google)</option>
              <option value="local_server" ${s.voiceBackend === "local_server" ? "selected" : ""}>Local server (Kokoro-FastAPI)</option>
            </select>
          </div>
          ${s.voiceBackend === "cloud" ? `
            <div class="setting-row">
              <div><div class="setting-label">Cloud provider &amp; API key</div></div>
              <div style="display:flex;gap:8px">
                <select class="select" data-str="cloudVoiceProvider">
                  <option value="openai" ${s.cloudVoiceProvider === "openai" ? "selected" : ""}>OpenAI TTS</option>
                  <option value="elevenlabs" ${s.cloudVoiceProvider === "elevenlabs" ? "selected" : ""}>ElevenLabs</option>
                  <option value="google" ${s.cloudVoiceProvider === "google" ? "selected" : ""}>Google Cloud</option>
                </select>
                <input type="password" class="input" data-str="cloudVoiceApiKey" placeholder="API key" value="${esc3(s.cloudVoiceApiKey)}" />
              </div>
            </div>
          ` : ""}
          ${s.voiceBackend === "local_server" ? `
            <div class="setting-row">
              <div><div class="setting-label">Local TTS server URL</div></div>
              <input type="text" class="input" data-str="localVoiceServerUrl" value="${esc3(s.localVoiceServerUrl)}" style="width:250px" />
            </div>
          ` : ""}
          <div class="setting-row">
            <div><div class="setting-label">Speaking speed (${s.voiceSpeed.toFixed(1)}\xD7)</div></div>
            <input type="range" min="0.5" max="2.0" step="0.1" data-num="voiceSpeed" value="${s.voiceSpeed}" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Automatically pronounce word when opened</div></div>
            <input type="checkbox" data-bool="sayWordOnOpen" ${s.sayWordOnOpen ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Test active language voice</div></div>
            <button type="button" class="btn btn-primary" id="btn-test-voice">\u{1F50A} Test voice</button>
          </div>
        </section>
      `;
    case "listen":
      return `
        <section class="settings-section" data-sec="listen">
          <h2 class="card-title">Watch &amp; Listen</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Smart background listening tracker</div>
              <div class="setting-desc">Credits audible tabs whose title matches your target language.</div>
            </div>
            <input type="checkbox" data-bool="smartListeningTracking" ${s.smartListeningTracking ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Hold unsure tracks for review in Progress \u2192 Listening History</div>
            </div>
            <input type="checkbox" data-bool="askUnsureTrackLang" ${s.askUnsureTrackLang ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show word-difficulty badges on YouTube thumbnails</div>
            </div>
            <input type="checkbox" data-bool="youtubeThumbnailCounts" ${s.youtubeThumbnailCounts ? "checked" : ""} />
          </div>
        </section>
      `;
    case "captions":
      return `
        <section class="settings-section" data-sec="captions">
          <h2 class="card-title">Verba Dual Captions</h2>
          <div class="setting-row">
            <div><div class="setting-label">Enable Dual Captions on YouTube, Netflix &amp; HTML5 video</div></div>
            <input type="checkbox" data-bool="captionsEnabled" ${s.captionsEnabled ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Target subtitle display</div></div>
            <select class="select" data-str="subtitleMode">
              <option value="show" ${s.subtitleMode === "show" ? "selected" : ""}>Show clearly</option>
              <option value="blur" ${s.subtitleMode === "blur" ? "selected" : ""}>Blur until hovered / E</option>
              <option value="hide" ${s.subtitleMode === "hide" ? "selected" : ""}>Hide until E</option>
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Translation line display</div></div>
            <select class="select" data-str="translationMode">
              <option value="blur" ${s.translationMode === "blur" ? "selected" : ""}>Blur until E</option>
              <option value="show" ${s.translationMode === "show" ? "selected" : ""}>Show clearly</option>
              <option value="hide" ${s.translationMode === "hide" ? "selected" : ""}>Hide</option>
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Auto-pause after each subtitle line (Q)</div></div>
            <input type="checkbox" data-bool="autoPauseEachLine" ${s.autoPauseEachLine ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Auto-resume playback when word marked Known</div></div>
            <input type="checkbox" data-bool="autoResumeOnKnown" ${s.autoResumeOnKnown ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Karaoke active-word highlight</div></div>
            <input type="checkbox" data-bool="karaokeMode" ${s.karaokeMode ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Backdrop opacity (${s.subtitleBgOpacity}%)</div></div>
            <input type="range" min="0" max="100" step="5" data-num="subtitleBgOpacity" value="${s.subtitleBgOpacity}" />
          </div>
        </section>
      `;
    case "controller":
      return `
        <section class="settings-section" data-sec="controller">
          <h2 class="card-title">Game Controller</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Enable Gamepad controls</div>
              <div class="setting-desc">Grade words, step through sentences, or control Dual Captions from the couch with an Xbox, PlayStation, or Joy-Con controller.</div>
            </div>
            <input type="checkbox" data-bool="gamepadEnabled" ${s.gamepadEnabled ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Swap A/B and X/Y (Nintendo Switch layout)</div></div>
            <input type="checkbox" data-bool="swapABXY" ${s.swapABXY ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Scroll step (${s.pageScrollPx} px)</div></div>
            <input type="range" min="120" max="700" step="40" data-num="pageScrollPx" value="${s.pageScrollPx}" />
          </div>
        </section>
      `;
    case "ai":
      return `
        <section class="settings-section" data-sec="ai">
          <h2 class="card-title">AI Word Check &amp; Ask AI Chat</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Enable AI 4-verdict word check (key A in word panel)</div>
              <div class="setting-desc">Verifies whether a highlighted token is a real word, narrow/slang, or segmentation artifact in context.</div>
            </div>
            <input type="checkbox" data-bool="aiCheckEnabled" ${s.aiCheckEnabled ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">AI Provider &amp; Model</div></div>
            <div style="display:flex;gap:8px">
              <select class="select" data-str="aiProvider">
                <option value="gemini" ${s.aiProvider === "gemini" ? "selected" : ""}>Google Gemini</option>
                <option value="claude" ${s.aiProvider === "claude" ? "selected" : ""}>Anthropic Claude</option>
                <option value="openai" ${s.aiProvider === "openai" ? "selected" : ""}>OpenAI</option>
                <option value="deepseek" ${s.aiProvider === "deepseek" ? "selected" : ""}>DeepSeek</option>
              </select>
              <input type="text" class="input" data-str="aiModel" value="${esc3(s.aiModel)}" placeholder="Model ID" style="width:175px" />
            </div>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">AI API Key (stored locally)</div></div>
            <input type="password" class="input" data-str="aiApiKey" value="${esc3(s.aiApiKey)}" placeholder="Paste API key\u2026" style="width:270px" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Custom extra instruction (max 1,000 chars)</div></div>
            <input type="text" class="input" data-str="aiCustomRequest" maxlength="1000" value="${esc3(s.aiCustomRequest)}" placeholder="e.g. Give etymology & register notes" style="width:270px" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">"Ask your AI chat" target (Shift+I)</div></div>
            <select class="select" data-str="askAiChatProvider">
              <option value="chatgpt" ${s.askAiChatProvider === "chatgpt" ? "selected" : ""}>ChatGPT</option>
              <option value="claude" ${s.askAiChatProvider === "claude" ? "selected" : ""}>Claude</option>
              <option value="gemini" ${s.askAiChatProvider === "gemini" ? "selected" : ""}>Gemini</option>
              <option value="perplexity" ${s.askAiChatProvider === "perplexity" ? "selected" : ""}>Perplexity</option>
            </select>
          </div>
        </section>
      `;
    case "anki":
      return `
        <section class="settings-section" data-sec="anki">
          <h2 class="card-title">Anki Integration (AnkiConnect)</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">AnkiConnect local port</div>
              <div class="setting-desc">Connects to Anki desktop via AnkiConnect (default 8765).</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="number" class="input" data-num="ankiConnectPort" value="${s.ankiConnectPort}" style="width:95px" />
              <button type="button" class="btn" id="btn-anki-test">Try connection</button>
              <button type="button" class="btn btn-primary" id="btn-anki-sync">Sync now</button>
            </div>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Automatically send newly graded Learning words to Anki</div></div>
            <input type="checkbox" data-bool="ankiSendAllLearning" ${s.ankiSendAllLearning ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Mark word Known in Verba when Anki interval \u2265 ${s.ankiMatureDays} days</div></div>
            <input type="checkbox" data-bool="ankiMarkKnownOnMature" ${s.ankiMarkKnownOnMature ? "checked" : ""} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Suspend Anki card when marked Known in Verba</div></div>
            <input type="checkbox" data-bool="ankiSuspendWhenKnown" ${s.ankiSuspendWhenKnown ? "checked" : ""} />
          </div>
          <div style="margin-top:12px">
            <div class="setting-label" style="margin-bottom:6px">Card Field Layout ("Verba" Note Type)</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px">
              ${[
        ["word", "Word"],
        ["reading", "Reading"],
        ["meaning", "Meaning"],
        ["sentence", "Context sentence"],
        ["sentenceTranslation", "Sentence translation"],
        ["wordAudio", "Word audio"]
      ].map(
        ([field, label]) => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--surface-2);border-radius:7px">
                  <span style="font-size:12.5px">${esc3(label)}</span>
                  <select class="select anki-layout-sel" data-field="${field}" style="padding:3px 7px;font-size:12px">
                    <option value="front" ${s.ankiCardLayout[field] === "front" ? "selected" : ""}>Front</option>
                    <option value="back" ${s.ankiCardLayout[field] === "back" ? "selected" : ""}>Back</option>
                    ${field !== "word" ? `<option value="off" ${s.ankiCardLayout[field] === "off" ? "selected" : ""}>Off</option>` : ""}
                  </select>
                </div>
              `
      ).join("")}
            </div>
          </div>
        </section>
      `;
    case "sync":
      return `
        <section class="settings-section" data-sec="sync">
          <h2 class="card-title">Sync &amp; Backup (CRDT Conflict-Free Merge)</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Device pairing code (8\u201332 letters &amp; digits)</div>
              <div class="setting-desc">Rejects weak codes like 12345678 or PASSWORD.</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <input type="text" class="input" id="sync-code-input" value="${esc3(s.syncPairingCode)}" style="width:145px;font-family:var(--mono)" />
              <button type="button" class="btn btn-sm" id="btn-save-sync-code">Save</button>
              <button type="button" class="btn btn-sm" id="btn-new-sync-code">New code</button>
            </div>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Lock API keys into backups (PBKDF2 + AES-GCM)</div>
              <div class="setting-desc">${s.backupKeyLockedHash ? "\u2713 Passphrase active \u2014 backups include encrypted API keys." : "Optional \u22658-character passphrase to encrypt AI & Cloud Voice keys inside backups."}</div>
            </div>
            <button type="button" class="btn" id="btn-lock-keys">Set passphrase\u2026</button>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Create full backup file now</div>
              <div class="setting-desc">${s.lastBackupAt ? `Last backup: ${new Date(s.lastBackupAt).toLocaleString()}` : "Saves words, books, bookmarks, daily stats & settings."}</div>
            </div>
            <button type="button" class="btn btn-primary" id="btn-backup-now">\u2B07 Back up now (.json)</button>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Sync or Restore from another Verba backup file</div>
              <div class="setting-desc"><strong>Sync with this device</strong> sums per-device stats without doubling; <strong>Restore as this device</strong> adopts stats onto this device ID.</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <label class="btn btn-amber" style="cursor:pointer">
                \u21C4 Sync with this device
                <input type="file" id="file-sync-other" accept=".json" hidden />
              </label>
              <label class="btn" style="cursor:pointer">
                \u21BA Restore as this device
                <input type="file" id="file-restore-same" accept=".json" hidden />
              </label>
            </div>
          </div>
        </section>
      `;
    case "data":
      return `
        <section class="settings-section" data-sec="data">
          <h2 class="card-title">Your Data &amp; Privacy</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Plain export (API keys stripped)</div>
              <div class="setting-desc">Safe to share or archive \u2014 never includes API keys, even encrypted.</div>
            </div>
            <button type="button" class="btn" id="btn-plain-export">Export data (.json)</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Reset all settings to factory defaults</div>
              <div class="setting-desc">Keeps your learned words and books intact, resetting only preferences &amp; keymaps.</div>
            </div>
            <button type="button" class="btn btn-danger" id="btn-reset-settings">Reset settings</button>
          </div>
        </section>
      `;
  }
}
function detectKeyConflicts(km) {
  const seen = /* @__PURE__ */ new Map();
  const dupes = /* @__PURE__ */ new Set();
  for (const [k, combo] of Object.entries(km)) {
    const norm = String(combo).toLowerCase();
    if (!norm) continue;
    if (seen.has(norm)) dupes.add(combo);
    else seen.set(norm, k);
  }
  return Array.from(dupes);
}
function bindSettingsEvents(container, ctx) {
  const s = ctx.settings;
  const searchInput = container.querySelector("#settings-search-input");
  searchInput?.addEventListener("input", () => {
    ctx.onSearchChange(searchInput.value);
  });
  container.querySelectorAll("[data-sec-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ctx.onSelectSection(btn.dataset.secNav);
    });
  });
  container.querySelectorAll("[data-bool]").forEach((chk) => {
    chk.addEventListener("change", () => {
      const key = chk.dataset.bool;
      ctx.onSavePatch({ [key]: chk.checked });
    });
  });
  container.querySelectorAll("[data-str]").forEach((el) => {
    el.addEventListener("change", () => {
      const key = el.dataset.str;
      ctx.onSavePatch({ [key]: el.value });
    });
  });
  container.querySelectorAll("[data-num]").forEach((el) => {
    el.addEventListener("change", () => {
      const key = el.dataset.num;
      ctx.onSavePatch({ [key]: Number(el.value) });
    });
  });
  container.querySelectorAll("[data-color]").forEach((el) => {
    el.addEventListener("change", () => {
      const cKey = el.dataset.color;
      ctx.onSavePatch({ colors: { ...s.colors, [cKey]: el.value } });
    });
  });
  container.querySelector("#wp-size-select")?.addEventListener("change", (e) => {
    const size = e.target.value;
    ctx.onSavePatch({ wordPanel: { ...s.wordPanel, size } });
  });
  container.querySelector("#never-domains-ta")?.addEventListener("change", (e) => {
    const domains = e.target.value.split(/\r?\n/).map((d) => d.trim().toLowerCase()).filter(Boolean);
    ctx.onSavePatch({ neverRunDomains: domains });
  });
  container.querySelectorAll("[data-bind-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      recordingTarget = {
        group: btn.dataset.bindGroup,
        key: btn.dataset.bindKey
      };
      renderSettingsTab(container, ctx);
      const onKey = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.key === "Shift" || ev.key === "Control" || ev.key === "Alt" || ev.key === "Meta") return;
        window.removeEventListener("keydown", onKey, true);
        const target = recordingTarget;
        recordingTarget = null;
        if (!target || ev.key === "Escape") {
          renderSettingsTab(container, ctx);
          return;
        }
        const mods = [];
        if (ev.ctrlKey) mods.push("Ctrl");
        if (ev.altKey) mods.push("Alt");
        if (ev.shiftKey && ev.key.length === 1) mods.push("Shift");
        const kName = ev.key.length === 1 ? mods.length ? ev.key.toUpperCase() : ev.key.toLowerCase() : ev.key;
        const combo = [...mods, kName].join("+");
        if (target.group === "reading") {
          await ctx.onSavePatch({
            readingKeymap: { ...s.readingKeymap, [target.key]: combo }
          });
        } else {
          await ctx.onSavePatch({
            videoKeymap: { ...s.videoKeymap, [target.key]: combo }
          });
        }
      };
      window.addEventListener("keydown", onKey, true);
    });
  });
  container.querySelector("#btn-reset-keymaps")?.addEventListener("click", () => {
    ctx.onSavePatch({
      readingKeymap: { ...DEFAULT_READING_KEYMAP },
      videoKeymap: { ...DEFAULT_VIDEO_KEYMAP }
    });
    ctx.onNotify("Keyboard shortcuts restored to defaults.");
  });
  container.querySelectorAll(".learn-lang-chk").forEach((chk) => {
    chk.addEventListener("change", () => {
      const code = chk.value;
      let next = chk.checked ? Array.from(/* @__PURE__ */ new Set([...s.learningLangs, code])) : s.learningLangs.filter((c) => c !== code);
      if (next.length === 0) next = [code];
      const nextActive = next.includes(s.activeLang) ? s.activeLang : next[0];
      const nextPolyglot = Array.from(/* @__PURE__ */ new Set([...s.polyglotOrder.filter((c) => next.includes(c)), ...next]));
      ctx.onSavePatch({
        learningLangs: next,
        activeLang: nextActive,
        polyglotOrder: nextPolyglot
      });
    });
  });
  container.querySelector("#opts-lang-picker")?.addEventListener("change", (e) => {
    ctx.onOptionsLangChange(e.target.value);
  });
  const saveLangOpt = (patch) => {
    const cur = getLangOptionsFromSettings(s, ctx.optionsLang);
    ctx.onSavePatch({
      perLang: {
        ...s.perLang,
        [ctx.optionsLang]: { ...cur, ...patch }
      }
    });
  };
  container.querySelectorAll("[data-langopt-bool]").forEach((chk) => {
    chk.addEventListener("change", () => {
      const k = chk.dataset.langoptBool;
      saveLangOpt({ [k]: chk.checked });
    });
  });
  container.querySelectorAll("[data-langopt-str]").forEach((sel) => {
    sel.addEventListener("change", () => {
      const k = sel.dataset.langoptStr;
      saveLangOpt({ [k]: sel.value });
    });
  });
  container.querySelector("#custom-dict-file")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isZip = file.name.toLowerCase().endsWith(".zip");
    let name = file.name.replace(/\.[^.]+$/, "");
    let entries = [];
    if (isZip) {
      const parsed = parseYomitanZip(new Uint8Array(await file.arrayBuffer()));
      name = parsed.title || name;
      entries = parsed.entries;
    } else {
      entries = parseTableDictionary(await file.text());
    }
    const existing = await getCustomDictsByLang(ctx.optionsLang);
    const meta = {
      id: `cdict_${ctx.optionsLang}_${Date.now()}`,
      lang: ctx.optionsLang,
      name,
      format: isZip ? "yomitan" : "csv",
      enabled: true,
      order: existing.length,
      entryCount: entries.length,
      entries: entries.map((en) => ({ ...en, dictName: name })),
      addedAt: Date.now()
    };
    await putCustomDict(meta);
    ctx.onNotify(`Imported "${name}" (${entries.length.toLocaleString()} entries)`);
    await ctx.onOptionsLangChange(ctx.optionsLang);
  });
  container.querySelectorAll("[data-del-dict]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteCustomDict(btn.dataset.delDict);
      await ctx.onOptionsLangChange(ctx.optionsLang);
    });
  });
  container.querySelector("#btn-delete-lang-progress")?.addEventListener("click", async () => {
    const langName = LANG_MAP[ctx.optionsLang]?.name || ctx.optionsLang;
    if (!window.confirm(`Reset all saved ${langName} vocabulary and statistics?`)) {
      return;
    }
    await deleteLanguageProgress(ctx.optionsLang);
    sendBgMessage({ type: "BROADCAST_WORDS_REFRESH", lang: ctx.optionsLang }).catch(() => {
    });
    await ctx.onDataMutated();
    ctx.onNotify(`Reset all ${langName} progress.`);
  });
  container.querySelector("#btn-test-voice")?.addEventListener("click", () => {
    const samples = {
      it: "Buongiorno! Le parole nuove si illuminano ovunque leggi.",
      zh: "\u4F60\u597D\uFF01\u751F\u8BCD\u5728\u4F60\u9605\u8BFB\u7684\u6BCF\u4E00\u4E2A\u5730\u65B9\u90FD\u4F1A\u4EAE\u8D77\u3002",
      ja: "\u3053\u3093\u306B\u3061\u306F\u3002\u65B0\u3057\u3044\u8A00\u8449\u304C\u3069\u3053\u3067\u3082\u5149\u308A\u307E\u3059\u3002",
      es: "\xA1Hola! Las palabras nuevas se iluminan dondequiera que leas.",
      de: "Guten Tag! Neue W\xF6rter leuchten \xFCberall auf, wo du liest.",
      fr: "Bonjour ! Les nouveaux mots s\u2019illuminent partout o\xF9 vous lisez."
    };
    speakText(samples[s.activeLang] || "Verba voice check.", s.activeLang, s);
  });
  container.querySelector("#btn-anki-test")?.addEventListener("click", async () => {
    const res = await sendBgMessage({
      type: "ANKI_TEST",
      port: s.ankiConnectPort
    });
    ctx.onNotify(
      res.ok ? `Connected to AnkiConnect (v${res.version})!` : `AnkiConnect unreachable: ${res.error || "Is Anki open?"}`
    );
  });
  container.querySelector("#btn-anki-sync")?.addEventListener("click", async () => {
    const res = await sendBgMessage({
      type: "ANKI_SYNC_NOW"
    });
    ctx.onNotify(res.ok ? `Anki sync complete (${res.updatedCount || 0} words updated).` : `Anki sync error: ${res.error}`);
  });
  container.querySelectorAll(".anki-layout-sel").forEach((sel) => {
    sel.addEventListener("change", () => {
      const f = sel.dataset.field;
      ctx.onSavePatch({
        ankiCardLayout: { ...s.ankiCardLayout, [f]: sel.value }
      });
    });
  });
  container.querySelector("#btn-save-sync-code")?.addEventListener("click", () => {
    const val = container.querySelector("#sync-code-input").value.trim();
    const check = validatePairingCode(val);
    if (!check.valid) {
      ctx.onNotify(check.reason || "Invalid pairing code.");
      return;
    }
    ctx.onSavePatch({ syncPairingCode: val });
    ctx.onNotify("Pairing code updated.");
  });
  container.querySelector("#btn-new-sync-code")?.addEventListener("click", () => {
    ctx.onSavePatch({ syncPairingCode: generatePairingCode() });
  });
  container.querySelector("#btn-lock-keys")?.addEventListener("click", async () => {
    const pass = window.prompt("Enter passphrase (at least 8 characters) to encrypt API keys in backups:");
    if (!pass) return;
    if (pass.length < 8) {
      ctx.onNotify("Passphrase must be at least 8 characters.");
      return;
    }
    backupPassphraseMem = pass;
    const hash = await sha256Hex(pass);
    await ctx.onSavePatch({ backupKeyLockedHash: hash });
    ctx.onNotify("Passphrase active \u2014 backups will include AES-GCM encrypted API keys.");
  });
  container.querySelector("#btn-backup-now")?.addEventListener("click", async () => {
    await exportVerbaBundle(ctx, true);
  });
  container.querySelector("#btn-plain-export")?.addEventListener("click", async () => {
    await exportVerbaBundle(ctx, false);
  });
  container.querySelector("#file-sync-other")?.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (f) await importAndMergeBundle(f, "sync_other_device", ctx);
  });
  container.querySelector("#file-restore-same")?.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (f) await importAndMergeBundle(f, "restore_same_device", ctx);
  });
  container.querySelector("#btn-reset-settings")?.addEventListener("click", async () => {
    if (!window.confirm("Reset all settings and keyboard shortcuts back to factory defaults?")) return;
    const fresh = createDefaultSettings();
    await ctx.onSavePatch({
      ...fresh,
      deviceId: s.deviceId,
      onboarded: true
    });
    ctx.onNotify("All settings reset to defaults.");
  });
}
async function exportVerbaBundle(ctx, isAutomaticBackup) {
  const s = ctx.settings;
  const [words, books, bookmarks, dailyStats, listeningHistory] = await Promise.all([
    getAllWordsRaw(),
    getAllBooksRaw(),
    getAllBookmarksRaw(),
    getAllDailyStats(),
    getAllListeningHistory()
  ]);
  const folders = [];
  for (const l of LANGUAGES) {
    const fl2 = await getFoldersByLang(l.code);
    folders.push(...fl2);
  }
  const safeSettings = {
    ...s,
    aiApiKey: "",
    cloudVoiceApiKey: ""
  };
  let encryptedKeys = void 0;
  if (isAutomaticBackup && backupPassphraseMem.length >= 8 && (s.aiApiKey || s.cloudVoiceApiKey)) {
    encryptedKeys = await encryptApiKeysWithPassphrase(
      { aiApiKey: s.aiApiKey, cloudVoiceApiKey: s.cloudVoiceApiKey },
      backupPassphraseMem
    );
  }
  const bundle = {
    verbaArchiveVersion: 1,
    exportedAt: Date.now(),
    deviceId: s.deviceId,
    isAutomaticBackup,
    words,
    books,
    folders,
    bookmarks,
    dailyStats,
    listeningHistory,
    settings: safeSettings,
    ...encryptedKeys ? { encryptedKeys } : {}
  };
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const tag = isAutomaticBackup ? "backup" : "export";
  a.download = `verba-${tag}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
  a.click();
  if (isAutomaticBackup) {
    await ctx.onSavePatch({ lastBackupAt: Date.now() });
  }
  ctx.onNotify(`Downloaded Verba ${tag} (${words.length} word records, ${books.length} books).`);
}
async function importAndMergeBundle(file, mode, ctx) {
  try {
    const incoming = JSON.parse(await file.text());
    if (!incoming || incoming.verbaArchiveVersion !== 1) {
      ctx.onNotify("Invalid Verba backup file.");
      return;
    }
    const [localWords, localBooks, localBookmarks, localStats, localListen] = await Promise.all([
      getAllWordsRaw(),
      getAllBooksRaw(),
      getAllBookmarksRaw(),
      getAllDailyStats(),
      getAllListeningHistory()
    ]);
    const mergedWords = mergeWordRecords(localWords, incoming.words || []);
    const mergedBooks = mergeBookItems(localBooks, incoming.books || []);
    const mergedBookmarks = mergeBookmarks(localBookmarks, incoming.bookmarks || []);
    const mergedStats = mergeDailyStats(localStats, incoming.dailyStats || [], mode, ctx.settings.deviceId);
    const mergedListen = mergeListeningLogs(localListen, incoming.listeningHistory || []);
    await putWordRecordsBatch(mergedWords);
    for (const b of mergedBooks) await putBook(b);
    for (const bm of mergedBookmarks) await putBookmark(bm);
    if (Array.isArray(incoming.folders)) {
      for (const fl2 of incoming.folders) await putFolder(fl2);
    }
    await putDailyStatsBatch(mergedStats);
    for (const lg of mergedListen) await putListeningLog(lg);
    if (mode === "restore_same_device" && incoming.settings) {
      const safePatch = {
        ...incoming.settings,
        deviceId: ctx.settings.deviceId,
        aiApiKey: incoming.settings.aiApiKey || ctx.settings.aiApiKey,
        cloudVoiceApiKey: incoming.settings.cloudVoiceApiKey || ctx.settings.cloudVoiceApiKey
      };
      await ctx.onSavePatch(safePatch);
    }
    if (incoming.encryptedKeys) {
      const pass = window.prompt("This backup contains encrypted API keys. Enter passphrase to unlock (or cancel to skip keys):");
      if (pass) {
        try {
          const keys = await decryptApiKeysWithPassphrase(incoming.encryptedKeys, pass);
          await ctx.onSavePatch(keys);
        } catch {
          ctx.onNotify("Passphrase did not match \u2014 data merged without API keys.");
        }
      }
    }
    sendBgMessage({ type: "BROADCAST_WORDS_REFRESH" }).catch(() => {
    });
    await ctx.onDataMutated();
    ctx.onNotify(
      mode === "sync_other_device" ? `Synced cleanly (${mergedWords.length} words, ${mergedBooks.length} books)!` : `Restored backup onto this device (${mergedWords.length} words)!`
    );
  } catch (err2) {
    ctx.onNotify(`Import error: ${err2 instanceof Error ? err2.message : String(err2)}`);
  }
}
function esc3(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/dashboard/index.ts
var VerbaDashboardApp = class {
  rootEl = document.getElementById("dashboard-app");
  shadowHost;
  shadow;
  wordPanel;
  placementCtrl = new PlacementViewController();
  settings;
  dictIndex;
  words = [];
  wordMap = /* @__PURE__ */ new Map();
  books = [];
  videos = [];
  dailyStats = [];
  listeningLogs = [];
  studyNotes = [];
  activeTab = "home";
  wordsSubTab = "my_words";
  forceOnboarding = false;
  onboardingStep = 1;
  // Words sub-views state
  myWordsSearch = "";
  myWordsFilter = "all";
  myWordsSort = "recent";
  markKnownSliderN = 200;
  lastBulkMarkedWords = [];
  commonBandStart = 1;
  commonSearch = "";
  exportRangeFrom = 1;
  exportRangeTo = 500;
  pendingImportRecords = null;
  pendingImportLabel = "";
  // Progress state
  calMonthOffset = 0;
  polyglotRange = "30d";
  // Milestones & Notes state
  notesLangFilter = "all";
  // Settings state
  settingsSection = "reading";
  settingsSearch = "";
  settingsOptionsLang = "it";
  settingsCustomDicts = [];
  toastMsg = "";
  async init() {
    this.mountShadow();
    this.parseHashRoute();
    window.addEventListener("hashchange", () => {
      this.parseHashRoute();
      this.render();
    });
    const ext = getExtApi();
    ext?.runtime?.onMessage?.addListener((msg) => {
      if (!msg?.type) return;
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;
      if ((msg.type === "VERBA_WORD_UPDATED" || msg.type === "VERBA_WORDS_REFRESH") && (!msg.lang || msg.lang === this.settings?.activeLang)) {
        this.reloadAllData().then(() => this.render()).catch(() => {
        });
      }
    });
    await this.reloadAllData();
    await this.seedDefaultNotesIfEmpty();
    this.render();
  }
  mountShadow() {
    this.shadowHost = document.createElement("div");
    this.shadowHost.id = "verba-ui-root";
    document.documentElement.appendChild(this.shadowHost);
    this.shadow = this.shadowHost.attachShadow({ mode: "open" });
    const st = document.createElement("style");
    st.textContent = SHADOW_UI_CSS;
    this.shadow.appendChild(st);
  }
  parseHashRoute() {
    const queryTab = new URLSearchParams(location.search).get("tab");
    const raw = location.hash.replace(/^#/, "").trim() || queryTab || "";
    if (!raw) return;
    if (raw === "onboarding") {
      this.activeTab = "home";
      this.forceOnboarding = true;
      this.onboardingStep = 1;
      return;
    }
    const [tabPart, subPart] = raw.split(":");
    const validTabs = ["home", "words", "placement", "books", "videos", "progress", "milestones", "settings"];
    if (validTabs.includes(tabPart)) {
      this.activeTab = tabPart;
    }
    if (tabPart === "settings" && subPart) {
      this.settingsSection = subPart;
    } else if (tabPart === "words" && subPart) {
      this.wordsSubTab = subPart;
    }
  }
  async reloadAllData() {
    this.settings = await sendBgMessage({ type: "GET_SETTINGS" });
    applyTheme(this.settings.theme);
    const lang = this.settings.activeLang;
    if (!this.settingsOptionsLang) this.settingsOptionsLang = lang;
    const rawDict = await sendBgMessage({ type: "GET_DICTIONARY", lang });
    this.dictIndex = buildLangIndex(rawDict);
    const [words, books, videos, dailyStats, listeningLogs, studyNotes, customDicts] = await Promise.all([
      getWordsByLang(lang),
      getBooksByLang(lang),
      getVideosByLang(lang),
      getDailyStatsByLang(lang),
      getListeningHistoryByLang(lang),
      getNotesByLang(),
      getCustomDictsByLang(this.settingsOptionsLang)
    ]);
    this.words = words;
    this.wordMap = new Map(words.map((w) => [w.word, w]));
    this.books = books;
    this.videos = videos;
    this.dailyStats = dailyStats;
    this.listeningLogs = listeningLogs;
    this.studyNotes = studyNotes;
    this.settingsCustomDicts = customDicts;
    const langOpts = getLangOptionsFromSettings(this.settings, lang);
    if (!this.wordPanel) {
      this.wordPanel = new VerbaWordPanel(this.shadow, this.settings, langOpts, {
        onGrade: async (word, status, extra) => {
          await sendBgMessage({
            type: "GRADE_WORD",
            lang: this.settings.activeLang,
            word,
            status,
            ...extra
          });
          await this.reloadAllData();
          this.render();
        },
        onSplitCustomWord: async (word) => {
          await sendBgMessage({ type: "SPLIT_CUSTOM_WORD", lang: this.settings.activeLang, word });
          await this.reloadAllData();
          this.render();
        },
        onExtendSelection: () => {
        },
        onOpenAskAiChat: () => {
        }
      });
    } else {
      this.wordPanel.settings = this.settings;
      this.wordPanel.langOpts = langOpts;
    }
  }
  async seedDefaultNotesIfEmpty() {
    if (this.studyNotes.length > 0) return;
    const now = Date.now();
    const initial = [
      {
        id: "note_seed_1",
        lang: "it",
        title: "Pinocchio Capitolo I",
        text: "Completed first reading session with interactive lookups and sentence-by-sentence review.",
        createdAt: now - 3600 * 1e3
      }
    ];
    for (const n of initial) await putStudyNote(n);
    this.studyNotes = await getNotesByLang();
  }
  notify(msg) {
    this.toastMsg = msg;
    this.render();
    window.setTimeout(() => {
      if (this.toastMsg === msg) {
        this.toastMsg = "";
        this.render();
      }
    }, 4200);
  }
  getAggregatedDailyMap() {
    const map = /* @__PURE__ */ new Map();
    for (const s of this.dailyStats) {
      const cur = map.get(s.date) || { read: 0, listenSec: 0, known: 0, learning: 0 };
      cur.read += s.wordsRead;
      cur.listenSec += s.secondsListened;
      cur.known += s.wordsMarkedKnown;
      cur.learning += s.wordsMarkedLearning;
      map.set(s.date, cur);
    }
    return map;
  }
  computeStreak(dailyMap) {
    const isDayMet = (dateStr) => {
      const d = dailyMap.get(dateStr);
      if (!d) return false;
      const readMet = d.read >= Math.max(1, this.settings.dailyReadingGoalWords);
      const listenMet = d.listenSec / 60 >= Math.max(1, this.settings.dailyListeningGoalMin);
      return readMet || listenMet || d.read >= 50 || d.listenSec >= 120;
    };
    let current = 0;
    const now = Date.now();
    for (let back = 0; back < 365; back++) {
      const dStr = getLogicalDateString(now - back * 864e5, this.settings.dayEndsAtHour);
      if (isDayMet(dStr)) current++;
      else if (back > 0) break;
    }
    const sortedDates = Array.from(dailyMap.keys()).sort();
    let longest = current;
    let run = 0;
    for (const d of sortedDates) {
      if (isDayMet(d)) {
        run++;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
    }
    return { current, longest };
  }
  countUniqueKnownWords(list = this.words, lang = this.settings.activeLang) {
    const seen = /* @__PURE__ */ new Set();
    let n = 0;
    for (const w of list) {
      if (w.deleted || w.status !== 5) continue;
      if (w.isPhrase && lang !== "vi") continue;
      if (seen.has(w.word)) continue;
      seen.add(w.word);
      if (w.altScript) seen.add(w.altScript);
      n++;
    }
    return n;
  }
  render() {
    const lang = this.settings.activeLang;
    const langOptsHtml = this.settings.learningLangs.map((c) => `<option value="${c}" ${c === lang ? "selected" : ""}>${esc4(LANG_MAP[c]?.name || c)} (${esc4(LANG_MAP[c]?.nativeName || c)})</option>`).join("");
    const tabs = [
      ["home", "Home"],
      ["words", "Words"],
      ["placement", "Placement Test"],
      ["books", "Books"],
      ["videos", "Videos"],
      ["progress", "Progress"],
      ["milestones", "Milestones"],
      ["settings", "Settings"]
    ];
    setHtmlContent(
      this.rootEl,
      `
      <header class="dash-topbar">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <a href="#home" class="brand">
            <span class="brand-dot"></span>
            <span>Verba</span>
          </a>
          <nav class="main-tabs" aria-label="Dashboard sections">
            ${tabs.map(
        ([id, label]) => `
              <button type="button" class="main-tab ${this.activeTab === id ? "active" : ""}" data-main-tab="${id}">
                ${esc4(label)}
              </button>
            `
      ).join("")}
          </nav>
        </div>

        <div class="topbar-actions">
          <a href="books.html" class="btn">\u{1F4DA} Read a book</a>
          <a href="video.html" class="btn">\u{1F3AC} Watch a video</a>
          <select id="dash-lang-select" class="select" aria-label="Active learning language">
            ${langOptsHtml}
            <option value="__add__">+ Add a new language\u2026</option>
          </select>
        </div>
      </header>

      <main class="dash-container" id="dash-main-pane"></main>
      ${this.toastMsg ? `<div class="toast-banner">${esc4(this.toastMsg)}</div>` : ""}
    `
    );
    const pane = document.getElementById("dash-main-pane");
    switch (this.activeTab) {
      case "home":
        this.renderHome(pane);
        break;
      case "words":
        this.renderWords(pane);
        break;
      case "placement":
        this.placementCtrl.render(pane, {
          settings: this.settings,
          dictIndex: this.dictIndex,
          words: this.words,
          onSwitchLanguage: async (nextLang) => {
            await sendBgMessage({ type: "SAVE_SETTINGS", patch: { activeLang: nextLang } });
            this.settingsOptionsLang = nextLang;
            await this.reloadAllData();
            this.render();
          },
          onRefreshData: async () => {
            await this.reloadAllData();
            this.render();
          },
          onNotify: (m) => this.notify(m)
        });
        break;
      case "books":
        this.renderBooksOverview(pane);
        break;
      case "videos":
        this.renderVideosOverview(pane);
        break;
      case "progress":
        this.renderProgress(pane);
        break;
      case "milestones":
        this.renderMilestones(pane);
        break;
      case "settings":
        renderSettingsTab(pane, {
          settings: this.settings,
          activeSection: this.settingsSection,
          searchQuery: this.settingsSearch,
          optionsLang: this.settingsOptionsLang,
          customDicts: this.settingsCustomDicts,
          onSavePatch: async (patch) => {
            this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch });
            await this.reloadAllData();
            this.render();
          },
          onSelectSection: (sec) => {
            this.settingsSection = sec;
            this.settingsSearch = "";
            history.replaceState(null, "", `#settings:${sec}`);
            this.render();
          },
          onSearchChange: (q) => {
            this.settingsSearch = q;
            this.render();
            const inp = document.getElementById("settings-search-input");
            if (inp) {
              inp.focus();
              inp.setSelectionRange(q.length, q.length);
            }
          },
          onOptionsLangChange: async (nextLang) => {
            this.settingsOptionsLang = nextLang;
            this.settingsCustomDicts = await getCustomDictsByLang(nextLang);
            this.render();
          },
          onNotify: (m) => this.notify(m),
          onDataMutated: async () => {
            await this.reloadAllData();
            this.render();
          }
        });
        break;
    }
    this.bindTopbarEvents();
  }
  bindTopbarEvents() {
    this.rootEl.querySelectorAll("[data-main-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.mainTab;
        this.activeTab = next;
        history.replaceState(null, "", `#${next}`);
        this.render();
      });
    });
    this.rootEl.querySelector("#dash-lang-select")?.addEventListener("change", async (e) => {
      const val = e.target.value;
      if (val === "__add__") {
        this.activeTab = "settings";
        this.settingsSection = "languages";
        history.replaceState(null, "", "#settings:languages");
        this.render();
        return;
      }
      await sendBgMessage({ type: "SAVE_SETTINGS", patch: { activeLang: val } });
      this.settingsOptionsLang = val;
      await this.reloadAllData();
      this.render();
    });
  }
  renderHome(pane) {
    const lang = this.settings.activeLang;
    const langName = LANG_MAP[lang]?.name || lang;
    const knownCount = this.countUniqueKnownWords();
    const learningCount = this.words.filter((w) => w.status >= 1 && w.status <= 4).length;
    const dailyMap = this.getAggregatedDailyMap();
    const todayStr = getLogicalDateString(Date.now(), this.settings.dayEndsAtHour);
    const today = dailyMap.get(todayStr) || { read: 0, listenSec: 0, known: 0, learning: 0 };
    const listenMin = Math.round(today.listenSec / 60);
    const readPct = Math.min(100, Math.round(today.read / Math.max(1, this.settings.dailyReadingGoalWords) * 100));
    const listenPct = Math.min(100, Math.round(listenMin / Math.max(1, this.settings.dailyListeningGoalMin) * 100));
    const streak = this.computeStreak(dailyMap);
    const showOnboarding = !this.settings.onboarded || this.forceOnboarding;
    setHtmlContent(
      pane,
      `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:6px;">
        <div>
          <h1 class="page-heading" style="margin-bottom:4px;">Immersion reading &amp; vocabulary, tailored to your frontier.</h1>
          <p class="page-sub" style="margin-bottom:14px;">Studying <strong>${esc4(langName)}</strong> \xB7 Local-first, private, offline dictionary ready.</p>
        </div>
        ${!showOnboarding ? `<button type="button" class="btn btn-sm" id="btn-reopen-onboarding">\u2728 Setup Wizard</button>` : ""}
      </div>

      ${showOnboarding ? this.buildOnboardingWizardHtml(lang, langName, knownCount) : ""}

      <div class="stats-grid-4">
        <div class="card">
          <div class="metric-big">${knownCount.toLocaleString()}</div>
          <div class="metric-lbl">Known ${esc4(langName)} words (+${today.known} today)</div>
          <div style="margin-top:8px;font-size:12px;color:var(--ink-2)">${learningCount.toLocaleString()} words in Learning (1\u20134)</div>
        </div>

        <div class="card">
          <div class="metric-big">${today.read.toLocaleString()} <small style="font-size:14px;color:var(--ink-3);font-weight:400">/ ${this.settings.dailyReadingGoalWords}</small></div>
          <div class="metric-lbl">Words read today</div>
          <div class="progress-track"><div class="progress-fill" style="width:${readPct}%;background:var(--blue)"></div></div>
        </div>

        <div class="card">
          <div class="metric-big">${listenMin}m <small style="font-size:14px;color:var(--ink-3);font-weight:400">/ ${this.settings.dailyListeningGoalMin}m</small></div>
          <div class="metric-lbl">Time listened today</div>
          <div class="progress-track"><div class="progress-fill" style="width:${listenPct}%;background:var(--amber)"></div></div>
        </div>

        <div class="card">
          <div class="metric-big">\u{1F525} ${streak.current} <small style="font-size:14px;color:var(--ink-3);font-weight:400">days</small></div>
          <div class="metric-lbl">Current streak (Longest: ${streak.longest}d)</div>
        </div>
      </div>

      ${!showOnboarding && knownCount < 100 ? `
        <div class="card" style="margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-color:rgb(59 130 246 / 0.5)">
          <div>
            <h2 class="card-title" style="margin-bottom:4px">Calibrate your ${esc4(langName)} vocabulary</h2>
            <p style="margin:0;color:var(--ink-2);font-size:13.5px">Take the 90-second Adaptive Placement Test to benchmark your CEFR level, or use the frequency sweep slider to pre-mark words you already know.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="btn btn-primary" id="home-open-placement">\u{1F3AF} Take Placement Test</button>
            <button type="button" class="btn" id="home-jump-wall">Frequency Sweep \u2192</button>
          </div>
        </div>
      ` : ""}

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:18px">
        <section class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h2 class="card-title" style="margin:0">Continue Reading</h2>
            <a href="books.html" class="btn btn-sm">Open Shelf \u2192</a>
          </div>
          ${this.books.length === 0 ? `<p style="color:var(--ink-3)">No ${esc4(langName)} books on your shelf yet.</p>` : `<div style="display:flex;flex-direction:column;gap:10px">
                ${this.books.slice(0, 4).map(
        (b) => `
                  <a href="books.html?book=${encodeURIComponent(b.id)}" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--surface-2);border-radius:9px;text-decoration:none;color:var(--ink)">
                    <div>
                      <div style="font-weight:600">${esc4(b.title)}</div>
                      <div style="font-size:12px;color:var(--ink-3)">${esc4(b.format.toUpperCase())} \xB7 Ch. ${b.chapterIndex + 1}/${b.chapters.length}</div>
                    </div>
                    <span class="btn btn-sm btn-primary">Read</span>
                  </a>
                `
      ).join("")}
              </div>`}
        </section>

        <section class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h2 class="card-title" style="margin:0">Watch with Verba Dual Captions</h2>
            <a href="video.html?demo=1" class="btn btn-sm btn-amber">\u25B6 Try Italian Demo</a>
          </div>
          <p style="margin:0 0 12px;font-size:13px;color:var(--ink-2)">
            Verba overlays interactive dual subtitles on YouTube, Netflix, and local video files with hover lookup, blurred translations &amp; auto-pause.
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <a href="video.html" class="btn btn-primary">Open Local Video Player</a>
            <button type="button" class="btn" id="home-open-words">Browse Vocabulary (${this.words.length})</button>
          </div>
        </section>
      </div>
    `
    );
    this.bindOnboardingEvents(pane);
    pane.querySelector("#btn-reopen-onboarding")?.addEventListener("click", () => {
      this.forceOnboarding = true;
      this.onboardingStep = 1;
      history.replaceState(null, "", "#onboarding");
      this.render();
    });
    pane.querySelector("#home-open-placement")?.addEventListener("click", () => {
      this.activeTab = "placement";
      history.replaceState(null, "", "#placement");
      this.render();
    });
    pane.querySelector("#home-jump-wall")?.addEventListener("click", () => {
      this.activeTab = "words";
      this.wordsSubTab = "mark_known";
      history.replaceState(null, "", "#words:mark_known");
      this.render();
    });
    pane.querySelector("#home-open-words")?.addEventListener("click", () => {
      this.activeTab = "words";
      this.wordsSubTab = "my_words";
      history.replaceState(null, "", "#words");
      this.render();
    });
  }
  buildOnboardingWizardHtml(lang, langName, knownCount) {
    const step = this.onboardingStep;
    return `
      <section class="card" id="onboarding-wizard" style="margin-bottom:24px;border:1.5px solid var(--blue);background:linear-gradient(180deg, rgb(56 189 248 / 0.08), transparent 180px);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <span class="pl-eyebrow" style="margin:0;">WELCOME TO VERBA \xB7 STEP ${step} OF 3</span>
            <div style="display:flex;gap:6px;">
              ${[1, 2, 3].map(
      (s) => `
                <button type="button" class="btn btn-sm ${step === s ? "btn-primary" : ""}" data-ob-step="${s}" style="padding:3px 10px;font-size:11.5px;">
                  ${s}. ${s === 1 ? "Language" : s === 2 ? "Starting Level" : "Goals & Tour"}
                </button>`
    ).join("")}
            </div>
          </div>
          <button type="button" class="btn btn-sm" id="ob-skip-btn" title="Dismiss setup wizard">\u2715 Skip setup</button>
        </div>

        ${step === 1 ? `
          <div>
            <h2 class="card-title" style="font-size:20px;margin:0 0 6px;">1. Which language are you learning?</h2>
            <p style="margin:0 0 14px;color:var(--ink-2);font-size:13.5px;">
              Pick your primary target language below. Verba ships with bundled offline dictionaries for all 24 languages\u2014you can switch or add more languages anytime.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:16px;">
              ${LANGUAGES.map((l) => {
      const isSelected = l.code === lang;
      return `
                  <button
                    type="button"
                    class="btn"
                    data-ob-lang="${l.code}"
                    style="justify-content:flex-start;padding:9px 12px;text-align:left;${isSelected ? "border-color:var(--blue);background:rgb(56 189 248 / 0.16);color:var(--ink);font-weight:700;" : ""}"
                  >
                    <div>
                      <div style="font-size:13px;">${esc4(l.name)}</div>
                      <div style="font-size:11px;color:var(--ink-3);">${esc4(l.nativeName)}</div>
                    </div>
                  </button>
                `;
    }).join("")}
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;">
              <button type="button" class="btn btn-primary" id="ob-next-1" style="padding:9px 18px;">
                Continue with ${esc4(langName)} \u2192
              </button>
            </div>
          </div>
        ` : step === 2 ? `
          <div>
            <h2 class="card-title" style="font-size:20px;margin:0 0 6px;">2. Calibrate your ${esc4(langName)} starting level</h2>
            <p style="margin:0 0 16px;color:var(--ink-2);font-size:13.5px;">
              Pre-mark foundational ${esc4(langName)} words you already know so only unfamiliar vocabulary at your frontier is highlighted in blue. (Currently <b>${knownCount}</b> Known words)
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-bottom:16px;">
              <div style="padding:16px;border-radius:10px;border:1.5px solid var(--blue);background:var(--surface-2);display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:0.05em;">Recommended</div>
                  <h3 style="margin:4px 0 6px;font-size:15.5px;color:var(--ink);">\u{1F3AF} 12-Question Adaptive Placement Test</h3>
                  <p style="margin:0;font-size:12.5px;color:var(--ink-2);line-height:1.45;">
                    Takes 90 seconds. Diagnoses your CEFR band (<b>A0\u2013C2</b>) and calibrates your known vocabulary in one click.
                  </p>
                </div>
                <button type="button" class="btn btn-primary" id="ob-take-placement">
                  \u25B6 Start Placement Test Now
                </button>
              </div>

              <div style="padding:16px;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:0.05em;">Instant Sweep</div>
                  <h3 style="margin:4px 0 6px;font-size:15.5px;color:var(--ink);">\u26A1 Quick Frequency Preset</h3>
                  <p style="margin:0;font-size:12.5px;color:var(--ink-2);line-height:1.45;">
                    Immediately mark the most frequent ${esc4(langName)} words in our dictionary as Known:
                  </p>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" class="btn btn-sm" data-ob-preset="20">Top 20 (A1)</button>
                  <button type="button" class="btn btn-sm" data-ob-preset="40">Top 40 (A2)</button>
                  <button type="button" class="btn btn-sm" data-ob-preset="60">All Core (${this.dictIndex.byRank.length})</button>
                </div>
              </div>

              <div style="padding:16px;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.05em;">Complete Beginner</div>
                  <h3 style="margin:4px 0 6px;font-size:15.5px;color:var(--ink);">\u{1F331} Start Fresh (A0)</h3>
                  <p style="margin:0;font-size:12.5px;color:var(--ink-2);line-height:1.45;">
                    New to ${esc4(langName)}? Keep every word highlighted as new and build your vocabulary as you read.
                  </p>
                </div>
                <button type="button" class="btn" id="ob-start-fresh">
                  Start with 0 Known Words \u2192
                </button>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;gap:10px;">
              <button type="button" class="btn" id="ob-prev-2">\u2190 Back</button>
              <button type="button" class="btn btn-primary" id="ob-next-2">Next: Daily Goals &amp; Tour \u2192</button>
            </div>
          </div>
        ` : `
          <div>
            <h2 class="card-title" style="font-size:20px;margin:0 0 6px;">3. Set your daily goals &amp; how Verba works</h2>
            <p style="margin:0 0 14px;color:var(--ink-2);font-size:13.5px;">
              Pick a sustainable daily reading &amp; listening target to build your streak:
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:16px;">
              <label style="display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--ink-2);">
                <span><strong>Daily Reading Goal</strong> (words/day)</span>
                <select id="ob-read-goal" class="select">
                  ${[500, 1e3, 1500, 2e3, 3e3].map(
      (w) => `<option value="${w}" ${this.settings.dailyReadingGoalWords === w ? "selected" : ""}>${w.toLocaleString()} words / day</option>`
    ).join("")}
                </select>
              </label>

              <label style="display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--ink-2);">
                <span><strong>Daily Listening Goal</strong> (minutes/day)</span>
                <select id="ob-listen-goal" class="select">
                  ${[10, 15, 20, 30, 45, 60].map(
      (m) => `<option value="${m}" ${this.settings.dailyListeningGoalMin === m ? "selected" : ""}>${m} minutes / day</option>`
    ).join("")}
                </select>
              </label>

              <label style="display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--ink-2);">
                <span><strong>Interface Theme</strong></span>
                <select id="ob-theme-sel" class="select">
                  <option value="dark" ${this.settings.theme === "dark" ? "selected" : ""}>Dark Slate (Default)</option>
                  <option value="light" ${this.settings.theme === "light" ? "selected" : ""}>Clean Light</option>
                  <option value="system" ${this.settings.theme === "system" ? "selected" : ""}>Match System</option>
                </select>
              </label>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:16px;padding:12px;border-radius:10px;background:var(--surface-2);">
              <div>
                <strong style="font-size:13px;color:var(--ink);">\u{1F310} 1. Web Highlighting</strong>
                <p style="margin:4px 0 0;font-size:12px;color:var(--ink-2);line-height:1.45;">
                  Hover any word for instant dictionary lookup. Click to mark Learning (<kbd>1</kbd>\u2013<kbd>4</kbd>) or press <kbd>K</kbd> for Known. Links are never hijacked.
                </p>
              </div>
              <div>
                <strong style="font-size:13px;color:var(--ink);">\u{1F4D6} 2. Reader View &amp; Books</strong>
                <p style="margin:4px 0 0;font-size:12px;color:var(--ink-2);line-height:1.45;">
                  Press <kbd>Shift+L</kbd> on any article for distraction-free Reader View, or press <kbd>Shift+S</kbd> for Sentence-by-Sentence mode.
                </p>
              </div>
              <div>
                <strong style="font-size:13px;color:var(--ink);">\u{1F3AC} 3. Video Dual Captions</strong>
                <p style="margin:4px 0 0;font-size:12px;color:var(--ink-2);line-height:1.45;">
                  Watch YouTube, Netflix, or local videos with dual subtitles. Press <kbd>E</kbd> to peek blurred translations and <kbd>A</kbd>/<kbd>S</kbd>/<kbd>D</kbd> to step lines.
                </p>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <button type="button" class="btn" id="ob-prev-3">\u2190 Back</button>
              <button type="button" class="btn btn-primary" id="ob-finish-btn" style="padding:9px 22px;font-size:14px;">
                \u2713 Finish Setup &amp; Start Exploring
              </button>
            </div>
          </div>
        `}
      </section>
    `;
  }
  bindOnboardingEvents(pane) {
    const wiz = pane.querySelector("#onboarding-wizard");
    if (!wiz) return;
    wiz.querySelectorAll("[data-ob-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.onboardingStep = Number(btn.dataset.obStep);
        this.render();
      });
    });
    wiz.querySelector("#ob-skip-btn")?.addEventListener("click", async () => {
      this.forceOnboarding = false;
      this.settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { onboarded: true }
      });
      if (location.hash === "#onboarding") history.replaceState(null, "", "#home");
      this.render();
    });
    wiz.querySelectorAll("[data-ob-lang]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const chosen = btn.dataset.obLang;
        const nextLearning = this.settings.learningLangs.includes(chosen) ? this.settings.learningLangs : [chosen, ...this.settings.learningLangs];
        const nextPoly = this.settings.polyglotOrder.includes(chosen) ? this.settings.polyglotOrder : [chosen, ...this.settings.polyglotOrder];
        const nextPerLang = {
          ...this.settings.perLang,
          ...this.settings.perLang[chosen] ? {} : { [chosen]: getDefaultLangOptions(chosen) }
        };
        this.settings = await sendBgMessage({
          type: "SAVE_SETTINGS",
          patch: {
            activeLang: chosen,
            learningLangs: nextLearning,
            polyglotOrder: nextPoly,
            perLang: nextPerLang
          }
        });
        this.settingsOptionsLang = chosen;
        await this.reloadAllData();
        this.render();
      });
    });
    wiz.querySelector("#ob-next-1")?.addEventListener("click", () => {
      this.onboardingStep = 2;
      this.render();
    });
    wiz.querySelector("#ob-prev-2")?.addEventListener("click", () => {
      this.onboardingStep = 1;
      this.render();
    });
    wiz.querySelector("#ob-next-2")?.addEventListener("click", () => {
      this.onboardingStep = 3;
      this.render();
    });
    wiz.querySelector("#ob-start-fresh")?.addEventListener("click", () => {
      this.onboardingStep = 3;
      this.render();
    });
    wiz.querySelector("#ob-take-placement")?.addEventListener("click", async () => {
      this.forceOnboarding = false;
      this.settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { onboarded: true }
      });
      this.activeTab = "placement";
      history.replaceState(null, "", "#placement");
      this.render();
    });
    wiz.querySelectorAll("[data-ob-preset]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const count = Number(btn.dataset.obPreset) || 20;
        const wordsToMark = this.dictIndex.byRank.slice(0, count).map((e) => e.w);
        const res = await sendBgMessage({
          type: "BATCH_MARK_KNOWN",
          lang: this.settings.activeLang,
          words: wordsToMark,
          source: "bulk"
        });
        if (res.ok) {
          await this.reloadAllData();
          this.onboardingStep = 3;
          this.notify(`Pre-marked top ${res.markedCount} ${LANG_MAP[this.settings.activeLang]?.name || ""} words as Known!`);
        }
      });
    });
    wiz.querySelector("#ob-prev-3")?.addEventListener("click", () => {
      this.onboardingStep = 2;
      this.render();
    });
    wiz.querySelector("#ob-finish-btn")?.addEventListener("click", async () => {
      const readGoal = Number(wiz.querySelector("#ob-read-goal")?.value) || 1e3;
      const listenGoal = Number(wiz.querySelector("#ob-listen-goal")?.value) || 15;
      const theme = wiz.querySelector("#ob-theme-sel")?.value || "dark";
      this.forceOnboarding = false;
      this.settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: {
          onboarded: true,
          dailyReadingGoalWords: readGoal,
          dailyListeningGoalMin: listenGoal,
          theme
        }
      });
      if (location.hash === "#onboarding") history.replaceState(null, "", "#home");
      await this.reloadAllData();
      this.notify("Setup complete! Welcome to Verba.");
    });
  }
  renderWords(pane) {
    const langName = LANG_MAP[this.settings.activeLang]?.name || this.settings.activeLang;
    setHtmlContent(
      pane,
      `
      <h1 class="page-heading">${esc4(langName)} Words</h1>
      <p class="page-sub">Search your graded words, sweep common words Known, explore frequency bands, or import from LingQ / Language Reactor / HanziHero / Anki.</p>

      <div class="subtabs">
        <button type="button" class="subtab-pill ${this.wordsSubTab === "my_words" ? "active" : ""}" data-wsub="my_words">
          My words (${this.words.length})
        </button>
        <button type="button" class="subtab-pill ${this.wordsSubTab === "mark_known" ? "active" : ""}" data-wsub="mark_known">
          Frequency Sweep
        </button>
        <button type="button" class="subtab-pill ${this.wordsSubTab === "most_common" ? "active" : ""}" data-wsub="most_common">
          Most common (${this.dictIndex.byRank.length})
        </button>
        <button type="button" class="subtab-pill ${this.wordsSubTab === "tools" ? "active" : ""}" data-wsub="tools">
          Tools &amp; Import
        </button>
      </div>

      <div id="words-subpane"></div>
    `
    );
    pane.querySelectorAll("[data-wsub]").forEach((b) => {
      b.addEventListener("click", () => {
        this.wordsSubTab = b.dataset.wsub;
        history.replaceState(null, "", `#words:${this.wordsSubTab}`);
        this.render();
      });
    });
    const sub = document.getElementById("words-subpane");
    if (this.wordsSubTab === "my_words") this.renderMyWordsSub(sub);
    else if (this.wordsSubTab === "mark_known") this.renderMarkKnownSub(sub);
    else if (this.wordsSubTab === "most_common") this.renderMostCommonSub(sub);
    else this.renderWordsToolsSub(sub);
  }
  renderMyWordsSub(sub) {
    const q = this.myWordsSearch.trim().toLowerCase();
    const filtered = this.words.filter((w) => {
      if (this.myWordsFilter === "learning" && !(w.status >= 1 && w.status <= 4)) return false;
      if (["1", "2", "3", "4", "5", "-1"].includes(this.myWordsFilter) && String(w.status) !== this.myWordsFilter) return false;
      if (this.myWordsFilter === "phrases" && !w.isPhrase) return false;
      if (this.myWordsFilter === "custom" && !w.customMeaning && !w.isCustomSegment) return false;
      if (q) {
        const entry = this.dictIndex.byHeadword.get(w.word)?.[0];
        const gloss = (w.customMeaning || entry?.m.join(" ") || "").toLowerCase();
        return w.word.toLowerCase().includes(q) || gloss.includes(q);
      }
      return true;
    });
    filtered.sort((a, b) => {
      if (this.myWordsSort === "lookups") return (b.lookupCount || 0) - (a.lookupCount || 0);
      if (this.myWordsSort === "az") return a.word.localeCompare(b.word);
      if (this.myWordsSort === "freq") {
        const ra = this.dictIndex.byHeadword.get(a.word)?.[0]?.rank || 999999;
        const rb = this.dictIndex.byHeadword.get(b.word)?.[0]?.rank || 999999;
        return ra - rb;
      }
      return b.updatedAt - a.updatedAt;
    });
    setHtmlContent(
      sub,
      `
      <div class="card">
        <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:14px">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <input type="search" id="mw-search" class="input" placeholder="Search word or meaning\u2026" value="${esc4(this.myWordsSearch)}" />
            <select id="mw-filter" class="select">
              <option value="all" ${this.myWordsFilter === "all" ? "selected" : ""}>All statuses (${this.words.length})</option>
              <option value="learning" ${this.myWordsFilter === "learning" ? "selected" : ""}>Learning 1\u20134</option>
              <option value="1" ${this.myWordsFilter === "1" ? "selected" : ""}>Level 1</option>
              <option value="2" ${this.myWordsFilter === "2" ? "selected" : ""}>Level 2</option>
              <option value="3" ${this.myWordsFilter === "3" ? "selected" : ""}>Level 3</option>
              <option value="4" ${this.myWordsFilter === "4" ? "selected" : ""}>Level 4</option>
              <option value="5" ${this.myWordsFilter === "5" ? "selected" : ""}>Known</option>
              <option value="-1" ${this.myWordsFilter === "-1" ? "selected" : ""}>Ignored</option>
              <option value="phrases" ${this.myWordsFilter === "phrases" ? "selected" : ""}>Phrases</option>
              <option value="custom" ${this.myWordsFilter === "custom" ? "selected" : ""}>Custom meaning</option>
            </select>
            <select id="mw-sort" class="select">
              <option value="recent" ${this.myWordsSort === "recent" ? "selected" : ""}>Recently updated</option>
              <option value="lookups" ${this.myWordsSort === "lookups" ? "selected" : ""}>Most looked up (\u{1F440})</option>
              <option value="freq" ${this.myWordsSort === "freq" ? "selected" : ""}>Frequency rank</option>
              <option value="az" ${this.myWordsSort === "az" ? "selected" : ""}>Alphabetical (A\u2013Z)</option>
            </select>
          </div>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn btn-sm" id="mw-export-csv">Export CSV</button>
            <button type="button" class="btn btn-sm" id="mw-export-tsv">Export Anki TSV</button>
          </div>
        </div>

        ${filtered.length === 0 ? `<p style="color:var(--ink-3)">No words match your current filter.</p>` : `
          <table class="data-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Meaning</th>
                <th>Lookups</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.slice(0, 250).map((w) => {
        const dictEntry = this.dictIndex.byHeadword.get(w.word)?.[0];
        const meaning = w.customMeaning || w.aiMeaning || dictEntry?.m.slice(0, 2).join("; ") || "\u2014";
        return `
                  <tr>
                    <td>
                      <span class="w-chip" data-open-word="${esc4(w.word)}" data-s="${w.status}">${esc4(w.word)}</span>
                      <button type="button" class="btn btn-sm" data-speak-w="${esc4(w.word)}" title="Speak">\u{1F50A}</button>
                    </td>
                    <td>
                      <span>${esc4(meaning)}</span>
                      ${w.customMeaning ? `<small style="color:var(--amber);margin-left:6px">Yours</small>` : ""}
                      <button type="button" class="btn btn-sm" data-edit-m="${esc4(w.word)}" title="Edit meaning" style="margin-left:6px">\u270E</button>
                    </td>
                    <td style="color:var(--ink-3)">\u{1F440} ${w.lookupCount || 0}</td>
                    <td>
                      <div style="display:flex;gap:4px;flex-wrap:wrap">
                        ${[1, 2, 3, 4, 5, -1, 0].map((st) => {
          const lbl = st === 5 ? "K" : st === -1 ? "X" : st === 0 ? "\u21BA" : String(st);
          const active = w.status === st;
          return `<button type="button" class="btn btn-sm ${active ? "btn-amber" : ""}" data-grade-w="${esc4(w.word)}" data-st="${st}">${lbl}</button>`;
        }).join("")}
                      </div>
                    </td>
                  </tr>
                `;
      }).join("")}
            </tbody>
          </table>
        `}
      </div>
    `
    );
    sub.querySelector("#mw-search")?.addEventListener("input", (e) => {
      this.myWordsSearch = e.target.value;
      this.renderMyWordsSub(sub);
      const inp = sub.querySelector("#mw-search");
      if (inp) {
        inp.focus();
        inp.setSelectionRange(this.myWordsSearch.length, this.myWordsSearch.length);
      }
    });
    sub.querySelector("#mw-filter")?.addEventListener("change", (e) => {
      this.myWordsFilter = e.target.value;
      this.renderMyWordsSub(sub);
    });
    sub.querySelector("#mw-sort")?.addEventListener("change", (e) => {
      this.myWordsSort = e.target.value;
      this.renderMyWordsSub(sub);
    });
    sub.querySelectorAll("[data-open-word]").forEach((el) => {
      el.addEventListener("click", () => {
        this.wordPanel.openForWord({
          query: el.dataset.openWord,
          lang: this.settings.activeLang,
          pinned: true,
          rect: el.getBoundingClientRect()
        });
      });
    });
    sub.querySelectorAll("[data-speak-w]").forEach((btn) => {
      btn.addEventListener("click", () => speakText(btn.dataset.speakW, this.settings.activeLang, this.settings));
    });
    sub.querySelectorAll("[data-edit-m]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const w = btn.dataset.editM;
        const rec = this.wordMap.get(w);
        const nextM = window.prompt(`Custom meaning for "${w}":`, rec?.customMeaning || "");
        if (nextM === null) return;
        await sendBgMessage({
          type: "GRADE_WORD",
          lang: this.settings.activeLang,
          word: w,
          status: rec?.status || 1,
          customMeaning: nextM.trim()
        });
        await this.reloadAllData();
        this.renderMyWordsSub(sub);
      });
    });
    sub.querySelectorAll("[data-grade-w]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const word = btn.dataset.gradeW;
        const status = Number(btn.dataset.st);
        await sendBgMessage({ type: "GRADE_WORD", lang: this.settings.activeLang, word, status });
        await this.reloadAllData();
        this.renderMyWordsSub(sub);
      });
    });
    const downloadWords = (delim, ext) => {
      const lines = filtered.map((w) => {
        const m = w.customMeaning || this.dictIndex.byHeadword.get(w.word)?.[0]?.m.join("; ") || "";
        return delim === "	" ? `${w.word}	${m}	${w.reading || ""}` : `"${w.word.replace(/"/g, '""')}","${m.replace(/"/g, '""')}",${w.status}`;
      });
      const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `verba-${this.settings.activeLang}-words.${ext}`;
      a.click();
    };
    sub.querySelector("#mw-export-csv")?.addEventListener("click", () => downloadWords(",", "csv"));
    sub.querySelector("#mw-export-tsv")?.addEventListener("click", () => downloadWords("	", "tsv"));
  }
  renderMarkKnownSub(sub) {
    const maxSlider = Math.max(50, this.dictIndex.byRank.length);
    const n = Math.min(maxSlider, this.markKnownSliderN);
    const slice = this.dictIndex.byRank.slice(0, n);
    const blueWordsInSlice = slice.filter((entry) => {
      const rec = this.wordMap.get(entry.w);
      return !rec || rec.status === 0;
    }).map((e) => e.w);
    setHtmlContent(
      sub,
      `
      <div class="card">
        <h2 class="card-title">Frequency Band Vocabulary Sweep</h2>
        <p style="margin:0 0 14px;color:var(--ink-2);font-size:13.5px">
          Slide to pick the <strong>${n.toLocaleString()}</strong> most frequent words in ${esc4(LANG_MAP[this.settings.activeLang]?.name || "")}.
          Click any individual word below to inspect or grade it first, then mark the remaining blue words Known in one sweep.
        </p>

        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
          <input
            type="range"
            id="wall-slider"
            min="20"
            max="${maxSlider}"
            step="10"
            value="${n}"
            style="flex:1;min-width:220px"
          />
          <span style="font-variant-numeric:tabular-nums;font-weight:600;color:var(--ink)">Top ${n.toLocaleString()} words</span>
          <button type="button" class="btn btn-primary" id="btn-mark-wall-known" ${blueWordsInSlice.length === 0 ? "disabled" : ""}>
            Mark ${blueWordsInSlice.length.toLocaleString()} blue words as known
          </button>
          ${this.lastBulkMarkedWords.length > 0 ? `<button type="button" class="btn btn-amber" id="btn-undo-wall">\u21B6 Undo (${this.lastBulkMarkedWords.length})</button>` : ""}
        </div>

        <div class="wall-cloud" id="wall-cloud">
          ${slice.map((entry) => {
        const st = this.wordMap.get(entry.w)?.status ?? 0;
        return `<span class="w-chip" data-wall-word="${esc4(entry.w)}" data-s="${st}" title="#${entry.rank}: ${esc4(entry.m[0] || "")}">${esc4(entry.w)}</span>`;
      }).join("")}
        </div>
      </div>
    `
    );
    sub.querySelector("#wall-slider")?.addEventListener("input", (e) => {
      this.markKnownSliderN = Number(e.target.value);
      this.renderMarkKnownSub(sub);
      sub.querySelector("#wall-slider")?.focus();
    });
    sub.querySelector("#btn-mark-wall-known")?.addEventListener("click", async () => {
      const res = await sendBgMessage({
        type: "BATCH_MARK_KNOWN",
        lang: this.settings.activeLang,
        words: blueWordsInSlice,
        source: "bulk"
      });
      if (res.ok) {
        this.lastBulkMarkedWords = res.markedWords || blueWordsInSlice;
        await this.reloadAllData();
        this.notify(`Marked ${res.markedCount} common words as Known!`);
      }
    });
    sub.querySelector("#btn-undo-wall")?.addEventListener("click", async () => {
      const now = Date.now();
      const resetBatch = [];
      for (const w of this.lastBulkMarkedWords) {
        const cur = this.wordMap.get(w);
        if (cur) {
          resetBatch.push({ ...cur, status: 0, deleted: true, updatedAt: now });
        }
      }
      await putWordRecordsBatch(resetBatch);
      const count = this.lastBulkMarkedWords.length;
      this.lastBulkMarkedWords = [];
      sendBgMessage({ type: "BROADCAST_WORDS_REFRESH", lang: this.settings.activeLang }).catch(() => {
      });
      await this.reloadAllData();
      this.notify(`Undid bulk mark \u2014 ${count} words returned to blue (New).`);
    });
    sub.querySelectorAll("[data-wall-word]").forEach((chip) => {
      chip.addEventListener("click", () => {
        this.wordPanel.openForWord({
          query: chip.dataset.wallWord,
          lang: this.settings.activeLang,
          pinned: true,
          rect: chip.getBoundingClientRect()
        });
      });
    });
  }
  renderMostCommonSub(sub) {
    const allRanked = this.dictIndex.byRank;
    const total = allRanked.length;
    const bands = [];
    for (let start = 1; start <= Math.max(1, total); start += 100) bands.push(start);
    const q = this.commonSearch.trim().toLowerCase();
    const visible = q ? allRanked.filter((e) => e.w.toLowerCase().includes(q) || String(e.rank) === q) : allRanked.slice(this.commonBandStart - 1, this.commonBandStart + 99);
    setHtmlContent(
      sub,
      `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <select id="common-band-sel" class="select">
              ${bands.map(
        (b) => `<option value="${b}" ${b === this.commonBandStart ? "selected" : ""}>Ranks ${b}\u2013${Math.min(total, b + 99)}</option>`
      ).join("")}
            </select>
            <input type="search" id="common-search" class="input" placeholder="Find word or rank\u2026" value="${esc4(this.commonSearch)}" />
          </div>
          <div style="display:flex;gap:6px;align-items:center">
            <span style="font-size:12px;color:var(--ink-3)">Export ranks:</span>
            <input type="number" id="exp-from" class="input" value="${this.exportRangeFrom}" style="width:74px" />
            <span>\u2013</span>
            <input type="number" id="exp-to" class="input" value="${Math.min(total, this.exportRangeTo)}" style="width:78px" />
            <button type="button" class="btn btn-sm" id="btn-export-ranked">Export CSV</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Word</th>
              <th>Reading</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            ${visible.slice(0, 120).map((e) => {
        const st = this.wordMap.get(e.w)?.status ?? 0;
        return `
                <tr>
                  <td style="font-family:var(--mono);color:var(--ink-3)">${e.rank ? formatOrdinal(e.rank) : "\u2014"}</td>
                  <td><span class="w-chip" data-common-w="${esc4(e.w)}" data-s="${st}">${esc4(e.w)}</span></td>
                  <td style="color:var(--ink-2)">${esc4(e.r || "\u2014")}</td>
                  <td>${esc4(e.m.join("; "))}</td>
                </tr>
              `;
      }).join("")}
          </tbody>
        </table>
      </div>
    `
    );
    sub.querySelector("#common-band-sel")?.addEventListener("change", (e) => {
      this.commonBandStart = Number(e.target.value);
      this.commonSearch = "";
      this.renderMostCommonSub(sub);
    });
    sub.querySelector("#common-search")?.addEventListener("input", (e) => {
      this.commonSearch = e.target.value;
      this.renderMostCommonSub(sub);
      const inp = sub.querySelector("#common-search");
      if (inp) {
        inp.focus();
        inp.setSelectionRange(this.commonSearch.length, this.commonSearch.length);
      }
    });
    sub.querySelectorAll("[data-common-w]").forEach((el) => {
      el.addEventListener("click", () => {
        this.wordPanel.openForWord({
          query: el.dataset.commonW,
          lang: this.settings.activeLang,
          pinned: true,
          rect: el.getBoundingClientRect()
        });
      });
    });
    sub.querySelector("#btn-export-ranked")?.addEventListener("click", () => {
      const from = Math.max(1, Number(document.getElementById("exp-from").value) || 1);
      const to = Math.max(from, Number(document.getElementById("exp-to").value) || 500);
      const rows = allRanked.filter((e) => (e.rank || 0) >= from && (e.rank || 0) <= to).map((e) => `${e.rank},"${e.w.replace(/"/g, '""')}","${(e.r || "").replace(/"/g, '""')}","${e.m.join("; ").replace(/"/g, '""')}"`);
      const blob = new Blob([`rank,word,reading,meaning
${rows.join("\n")}`], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `verba-${this.settings.activeLang}-top-${from}-${to}.csv`;
      a.click();
    });
  }
  renderWordsToolsSub(sub) {
    setHtmlContent(
      sub,
      `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px">
        <div class="card">
          <h3 class="card-title">Import from LingQ (CSV)</h3>
          <p style="font-size:13px;color:var(--ink-2)">Files your LingQ vocabulary export as Known while preserving custom hints.</p>
          <label class="btn btn-primary" style="cursor:pointer">
            Choose LingQ .csv\u2026
            <input type="file" id="imp-lingq" accept=".csv" hidden />
          </label>
        </div>

        <div class="card">
          <h3 class="card-title">Import from Language Reactor</h3>
          <p style="font-size:13px;color:var(--ink-2)">Supports LR JSON (preserves stages) and CSV/TSV exports.</p>
          <label class="btn btn-primary" style="cursor:pointer">
            Choose LR .json / .csv\u2026
            <input type="file" id="imp-lr" accept=".json,.csv,.tsv" hidden />
          </label>
        </div>

        <div class="card">
          <h3 class="card-title">Import from HanziHero (Chinese)</h3>
          <p style="font-size:13px;color:var(--ink-2)">Maps Novice\u21921, Apprentice\u21922, Journeyman I\u21923, II\u21924, Expert/Master\u2192Known.</p>
          <label class="btn btn-primary" style="cursor:pointer">
            Choose HanziHero .csv\u2026
            <input type="file" id="imp-hh" accept=".csv" hidden />
          </label>
        </div>

        <div class="card">
          <h3 class="card-title">Plain Text / Anki TSV List</h3>
          <p style="font-size:13px;color:var(--ink-2)">One word per line or tab-separated word + meaning.</p>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">
            <select id="imp-txt-status" class="select">
              <option value="5">Import as Known</option>
              <option value="-1">Import as Ignored</option>
            </select>
            <label class="btn btn-primary" style="cursor:pointer">
              Choose .txt / .tsv\u2026
              <input type="file" id="imp-txt" accept=".txt,.tsv,.csv" hidden />
            </label>
          </div>
        </div>
      </div>

      ${this.pendingImportRecords ? `
        <div class="card" style="margin-top:18px;border-color:var(--amber)">
          <h3 class="card-title">Preview Import: ${esc4(this.pendingImportLabel)} (${this.pendingImportRecords.length.toLocaleString()} words)</h3>
          <p style="font-size:13px;color:var(--ink-2)">Sample: ${esc4(
        this.pendingImportRecords.slice(0, 12).map((r) => `${r.word}${r.customMeaning ? ` (${r.customMeaning})` : ""}`).join(", ")
      )}</p>
          <div style="display:flex;gap:10px">
            <button type="button" class="btn btn-amber" id="btn-confirm-import">\u2713 Save ${this.pendingImportRecords.length.toLocaleString()} words</button>
            <button type="button" class="btn" id="btn-cancel-import">Cancel</button>
          </div>
        </div>
      ` : ""}
    `
    );
    sub.querySelector("#imp-lingq")?.addEventListener("change", async (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      this.pendingImportRecords = parseLingQImport(await f.text(), this.settings.activeLang);
      this.pendingImportLabel = `LingQ (${f.name})`;
      this.renderWordsToolsSub(sub);
    });
    sub.querySelector("#imp-lr")?.addEventListener("change", async (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const fmt = f.name.toLowerCase().endsWith(".json") ? "json" : "csv";
      this.pendingImportRecords = parseLanguageReactorImport(await f.text(), this.settings.activeLang, fmt, 5);
      this.pendingImportLabel = `Language Reactor (${f.name})`;
      this.renderWordsToolsSub(sub);
    });
    sub.querySelector("#imp-hh")?.addEventListener("change", async (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      this.pendingImportRecords = parseHanziHeroImport(await f.text());
      this.pendingImportLabel = `HanziHero (${f.name})`;
      this.renderWordsToolsSub(sub);
    });
    sub.querySelector("#imp-txt")?.addEventListener("change", async (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const targetSt = Number(document.getElementById("imp-txt-status").value);
      this.pendingImportRecords = parsePlainTextWordImport(await f.text(), this.settings.activeLang, targetSt);
      this.pendingImportLabel = `Text/Anki (${f.name})`;
      this.renderWordsToolsSub(sub);
    });
    sub.querySelector("#btn-confirm-import")?.addEventListener("click", async () => {
      if (!this.pendingImportRecords) return;
      await putWordRecordsBatch(this.pendingImportRecords);
      const n = this.pendingImportRecords.length;
      this.pendingImportRecords = null;
      sendBgMessage({ type: "BROADCAST_WORDS_REFRESH", lang: this.settings.activeLang }).catch(() => {
      });
      await this.reloadAllData();
      this.notify(`Imported ${n.toLocaleString()} words!`);
    });
    sub.querySelector("#btn-cancel-import")?.addEventListener("click", () => {
      this.pendingImportRecords = null;
      this.renderWordsToolsSub(sub);
    });
  }
  renderBooksOverview(pane) {
    const langName = LANG_MAP[this.settings.activeLang]?.name || this.settings.activeLang;
    setHtmlContent(
      pane,
      `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <h1 class="page-heading">${esc4(langName)} Books Shelf</h1>
          <p class="page-sub" style="margin:0">Read EPUB, PDF, TXT, SRT, comics &amp; saved web articles with instant word grading.</p>
        </div>
        <a href="books.html" class="btn btn-primary">Open Full Books Reader &amp; Shelf \u2192</a>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px">
        ${this.books.map(
        (b) => `
          <a href="books.html?book=${encodeURIComponent(b.id)}" class="card" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:8px">
            <div style="font-family:var(--mono);font-size:11px;color:var(--ink-3);text-transform:uppercase">${esc4(b.format)}</div>
            <div style="font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink)">${esc4(b.title)}</div>
            ${b.author ? `<div style="font-size:12.5px;color:var(--ink-3)">${esc4(b.author)}</div>` : ""}
            <div style="margin-top:auto;padding-top:8px;font-size:12px;color:var(--amber)">
              Chapter ${b.chapterIndex + 1} of ${b.chapters.length} \u2192
            </div>
          </a>
        `
      ).join("")}
      </div>
    `
    );
  }
  renderVideosOverview(pane) {
    setHtmlContent(
      pane,
      `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <h1 class="page-heading">Videos &amp; Dual Captions</h1>
          <p class="page-sub" style="margin:0">Dual subtitles, blurred translations, auto-pause &amp; "Words in this video" on YouTube, Netflix, and local files.</p>
        </div>
        <div style="display:flex;gap:8px">
          <a href="video.html?demo=1" class="btn btn-amber">\u25B6 Try Built-in Italian Demo</a>
          <a href="video.html" class="btn btn-primary">Open Local Video Player \u2192</a>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">Recent Videos (${this.videos.length})</h2>
        ${this.videos.length === 0 ? `<p style="color:var(--ink-3)">No watched videos recorded yet. Launch the Italian Demo above or open any YouTube video with subtitles!</p>` : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">
              ${this.videos.map(
        (v) => `
                <div style="padding:12px;background:var(--surface-2);border-radius:9px">
                  <div style="font-weight:600;color:var(--ink)">${esc4(v.title)}</div>
                  <div style="font-size:12px;color:var(--ink-3);margin:4px 0 8px">${esc4(v.source)} \xB7 ${Math.floor(v.positionSec / 60)}:${String(v.positionSec % 60).padStart(2, "0")}</div>
                  <a href="video.html${v.id === "demo_it_caffe" ? "?demo=1" : ""}" class="btn btn-sm btn-primary">Resume</a>
                </div>
              `
      ).join("")}
            </div>`}
      </div>
    `
    );
  }
  renderProgress(pane) {
    const lang = this.settings.activeLang;
    const langName = LANG_MAP[lang]?.name || lang;
    const knownCount = this.countUniqueKnownWords();
    const cefr = estimateCefrLevel(knownCount, Boolean(LANG_MAP[lang]?.spaceless));
    const dailyMap = this.getAggregatedDailyMap();
    const streak = this.computeStreak(dailyMap);
    const refDate = /* @__PURE__ */ new Date();
    refDate.setDate(1);
    refDate.setMonth(refDate.getMonth() + this.calMonthOffset);
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const monthLabel = refDate.toLocaleString("en-US", { month: "long", year: "numeric" });
    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calCells = [];
    for (let i = 0; i < firstDow; i++) calCells.push(`<div></div>`);
    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const stat = dailyMap.get(dStr);
      const rMet = Boolean(stat && stat.read > 0);
      const lMet = Boolean(stat && stat.listenSec >= 60);
      const cls = rMet && lMet ? "both-met" : rMet ? "read-only" : lMet ? "listen-only" : "";
      calCells.push(`
        <div class="cal-cell ${cls}" title="${dStr}: ${stat?.read || 0} words read, ${Math.round((stat?.listenSec || 0) / 60)}m listened">
          <span>${day}</span>
          <small style="font-size:9.5px">${stat ? `${stat.read}w` : ""}</small>
        </div>
      `);
    }
    const last14 = [];
    for (let b = 13; b >= 0; b--) {
      const dStr = getLogicalDateString(Date.now() - b * 864e5, this.settings.dayEndsAtHour);
      const st = dailyMap.get(dStr);
      last14.push({
        label: dStr.slice(8),
        read: st?.read || 0,
        listenMin: Math.round((st?.listenSec || 0) / 60)
      });
    }
    const maxReadBar = Math.max(100, ...last14.map((x) => x.read));
    const maxListenBar = Math.max(10, ...last14.map((x) => x.listenMin));
    setHtmlContent(
      pane,
      `
      <h1 class="page-heading">${esc4(langName)} Progress</h1>
      <p class="page-sub">Honest reading &amp; listening tallies, calendar streaks, CEFR vocabulary estimate, and polyglot comparison.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px;margin-bottom:20px">
        <div class="card">
          <h2 class="card-title">Your Level: <span style="color:var(--amber)">${cefr.band}</span> \u2014 ${esc4(cefr.title)}</h2>
          <p style="font-size:13px;color:var(--ink-2);margin:0 0 10px">
            <strong>${knownCount.toLocaleString()}</strong> unique known words. Next milestone: <strong>${cefr.nextBand}</strong> (${cefr.nextTarget.toLocaleString()} words).
          </p>
          <div class="progress-track"><div class="progress-fill" style="width:${cefr.pct}%;background:var(--green)"></div></div>

          <hr style="border:none;border-top:1px solid var(--border-subtle);margin:16px 0" />
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
            <label style="font-size:12.5px">Daily read goal:
              <input type="number" id="prog-read-goal" class="input" value="${this.settings.dailyReadingGoalWords}" style="width:82px;margin-left:4px" />
            </label>
            <label style="font-size:12.5px">Listen (min):
              <input type="number" id="prog-listen-goal" class="input" value="${this.settings.dailyListeningGoalMin}" style="width:70px;margin-left:4px" />
            </label>
            <label style="font-size:12.5px">Day ends at:
              <select id="prog-day-end" class="select" style="margin-left:4px">
                ${[0, 1, 2, 3, 4, 5].map((h) => `<option value="${h}" ${this.settings.dayEndsAtHour === h ? "selected" : ""}>${h}:00 AM</option>`).join("")}
              </select>
            </label>
          </div>
          <p style="margin:10px 0 0;font-size:12.5px;color:var(--ink-3)">
            \u{1F525} Current streak: <strong>${streak.current}d</strong> \xB7 Longest: <strong>${streak.longest}d</strong>
          </p>
        </div>

        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h2 class="card-title" style="margin:0">${esc4(monthLabel)}</h2>
            <div style="display:flex;gap:6px">
              <button type="button" class="btn btn-sm" id="cal-prev">\u2190</button>
              <button type="button" class="btn btn-sm" id="cal-next">\u2192</button>
            </div>
          </div>
          <div style="font-size:11.5px;color:var(--ink-3);margin-top:4px">
            <span style="color:#60a5fa">\u25A0</span> Reading &nbsp; <span style="color:#fbbf24">\u25A0</span> Listening &nbsp; \u25EA Both
          </div>
          <div class="cal-grid">
            ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-dow">${d}</div>`).join("")}
            ${calCells.join("")}
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px;margin-bottom:20px">
        <div class="card">
          <h2 class="card-title">Words Read (Last 14 Days)</h2>
          <div class="bar-chart">
            ${last14.map(
        (d) => `
              <div class="bar-col" title="${d.read} words">
                <div class="bar-rect" style="height:${Math.round(d.read / maxReadBar * 100)}%;background:var(--blue)"></div>
                <span class="bar-lbl">${d.label}</span>
              </div>
            `
      ).join("")}
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Minutes Listened (Last 14 Days)</h2>
          <div class="bar-chart">
            ${last14.map(
        (d) => `
              <div class="bar-col" title="${d.listenMin} min">
                <div class="bar-rect" style="height:${Math.round(d.listenMin / maxListenBar * 100)}%;background:var(--amber)"></div>
                <span class="bar-lbl">${d.label}</span>
              </div>
            `
      ).join("")}
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px" id="polyglot-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h2 class="card-title" style="margin:0">Polyglot Overview</h2>
          <select id="polyglot-range" class="select">
            <option value="today" ${this.polyglotRange === "today" ? "selected" : ""}>Today</option>
            <option value="7d" ${this.polyglotRange === "7d" ? "selected" : ""}>Last 7 days</option>
            <option value="30d" ${this.polyglotRange === "30d" ? "selected" : ""}>Last 30 days</option>
            <option value="all" ${this.polyglotRange === "all" ? "selected" : ""}>All time</option>
          </select>
        </div>
        <div id="polyglot-table-mount">Loading polyglot comparison\u2026</div>
      </div>

      <div class="card">
        <h2 class="card-title">Listening History (${this.listeningLogs.length})</h2>
        ${this.listeningLogs.length === 0 ? `<p style="color:var(--ink-3);margin:0">Smart listening &amp; Read Aloud sessions appear here. Unsure tracks are held until you confirm or ignore them.</p>` : `<table class="data-table">
              <thead><tr><th>Date</th><th>Track</th><th>Domain</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                ${this.listeningLogs.slice(0, 30).map(
        (lg) => `
                  <tr>
                    <td>${esc4(lg.date)}</td>
                    <td>${esc4(lg.title)}</td>
                    <td>${esc4(lg.domain)}</td>
                    <td>${Math.max(1, Math.round(lg.secondsEarned / 60))}m</td>
                    <td>
                      ${lg.status === "held" ? `<button type="button" class="btn btn-sm btn-primary" data-confirm-log="${esc4(lg.id)}">Count</button>
                             <button type="button" class="btn btn-sm" data-reject-log="${esc4(lg.id)}">Reject</button>` : esc4(lg.status)}
                    </td>
                  </tr>
                `
      ).join("")}
              </tbody>
            </table>`}
      </div>
    `
    );
    this.populatePolyglotTable();
    pane.querySelector("#cal-prev")?.addEventListener("click", () => {
      this.calMonthOffset--;
      this.renderProgress(pane);
    });
    pane.querySelector("#cal-next")?.addEventListener("click", () => {
      this.calMonthOffset++;
      this.renderProgress(pane);
    });
    pane.querySelector("#prog-read-goal")?.addEventListener("change", async (e) => {
      const dailyReadingGoalWords = Math.max(10, Number(e.target.value) || 500);
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { dailyReadingGoalWords } });
      this.renderProgress(pane);
    });
    pane.querySelector("#prog-listen-goal")?.addEventListener("change", async (e) => {
      const dailyListeningGoalMin = Math.max(1, Number(e.target.value) || 10);
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { dailyListeningGoalMin } });
      this.renderProgress(pane);
    });
    pane.querySelector("#prog-day-end")?.addEventListener("change", async (e) => {
      const dayEndsAtHour = Number(e.target.value);
      this.settings = await sendBgMessage({ type: "SAVE_SETTINGS", patch: { dayEndsAtHour } });
      this.renderProgress(pane);
    });
    pane.querySelector("#polyglot-range")?.addEventListener("change", (e) => {
      this.polyglotRange = e.target.value;
      this.populatePolyglotTable();
    });
    pane.querySelectorAll("[data-confirm-log]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const lg = this.listeningLogs.find((x) => x.id === btn.dataset.confirmLog);
        if (!lg) return;
        await putListeningLog({ ...lg, status: "counted", updatedAt: Date.now() });
        await incrementDailyStat(lg.lang, this.settings.deviceId, this.settings.dayEndsAtHour, {
          secondsListened: lg.secondsEarned
        });
        await this.reloadAllData();
        this.renderProgress(pane);
      });
    });
    pane.querySelectorAll("[data-reject-log]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const lg = this.listeningLogs.find((x) => x.id === btn.dataset.rejectLog);
        if (!lg) return;
        await putListeningLog({ ...lg, status: "rejected", updatedAt: Date.now() });
        await this.reloadAllData();
        this.renderProgress(pane);
      });
    });
  }
  async populatePolyglotTable() {
    const mount = document.getElementById("polyglot-table-mount");
    if (!mount) return;
    const [allWords, allStats] = await Promise.all([getAllWordsRaw(), getAllDailyStats()]);
    const daysBack = this.polyglotRange === "today" ? 0 : this.polyglotRange === "7d" ? 7 : this.polyglotRange === "30d" ? 30 : 99999;
    const cutoffDate = getLogicalDateString(Date.now() - daysBack * 864e5, this.settings.dayEndsAtHour);
    const orderedLangs = this.settings.learningLangs;
    setHtmlContent(
      mount,
      `
      <table class="data-table">
        <thead>
          <tr><th>Language</th><th>Known Words</th><th>Words Read</th><th>Time Listened</th></tr>
        </thead>
        <tbody>
          ${orderedLangs.map((code) => {
        const lWords = allWords.filter((w) => w.lang === code && !w.deleted);
        const known = this.countUniqueKnownWords(lWords, code);
        const lStats = allStats.filter((s) => s.lang === code && s.date >= cutoffDate);
        const read = lStats.reduce((sum, s) => sum + s.wordsRead, 0);
        const mins = Math.round(lStats.reduce((sum, s) => sum + s.secondsListened, 0) / 60);
        return `
              <tr>
                <td><strong>${esc4(LANG_MAP[code]?.name || code)}</strong> <small style="color:var(--ink-3)">${esc4(LANG_MAP[code]?.nativeName || "")}</small></td>
                <td>${known.toLocaleString()}</td>
                <td>${read.toLocaleString()}</td>
                <td>${mins}m</td>
              </tr>
            `;
      }).join("")}
        </tbody>
      </table>
    `
    );
  }
  renderMilestones(pane) {
    const lang = this.settings.activeLang;
    const langName = LANG_MAP[lang]?.name || lang;
    const knownCount = this.countUniqueKnownWords();
    const dailyMap = this.getAggregatedDailyMap();
    const totalRead = Array.from(dailyMap.values()).reduce((sum, d) => sum + d.read, 0);
    const totalListenMin = Math.round(Array.from(dailyMap.values()).reduce((sum, d) => sum + d.listenSec, 0) / 60);
    const streak = this.computeStreak(dailyMap).current;
    const milestones = [
      { title: "First 100 Words", desc: "Mark 100 words as Known in your active language", done: knownCount >= 100, prog: `${Math.min(100, knownCount)} / 100` },
      { title: "Core Foundation (500)", desc: "Reach 500 Known words (CEFR A1 threshold)", done: knownCount >= 500, prog: `${Math.min(500, knownCount)} / 500` },
      { title: "Independent Reader (2,500)", desc: "Reach 2,500 Known words (CEFR B1 threshold)", done: knownCount >= 2500, prog: `${Math.min(2500, knownCount)} / 2,500` },
      { title: "Immersion Bookworm", desc: "Read 5,000 words in articles or books", done: totalRead >= 5e3, prog: `${Math.min(5e3, totalRead).toLocaleString()} / 5,000` },
      { title: "Active Listener", desc: "Log 60 minutes of target-language audio or video", done: totalListenMin >= 60, prog: `${Math.min(60, totalListenMin)}m / 60m` },
      { title: "7-Day Consistency Streak", desc: "Maintain a 7-day reading or listening streak", done: streak >= 7, prog: `${Math.min(7, streak)}d / 7d` }
    ];
    const filteredNotes = this.studyNotes.filter(
      (n) => this.notesLangFilter === "all" || n.lang === this.notesLangFilter
    );
    setHtmlContent(
      pane,
      `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <h1 class="page-heading">Milestones &amp; Study Log</h1>
          <p class="page-sub" style="margin:0">Track your ${esc4(langName)} proficiency milestones and record personal reading notes.</p>
        </div>
      </div>

      <div class="scoreboard-split">
        <section class="card">
          <h2 class="card-title">Proficiency Milestones (${esc4(langName)})</h2>
          <div style="display:grid;gap:10px">
            ${milestones.map(
        (m) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--surface-2);border-radius:10px;border:1px solid ${m.done ? "rgb(34 197 94 / 0.45)" : "var(--border-subtle)"}">
                <div>
                  <div style="font-weight:600;color:var(--ink)">${m.done ? "\u2713 " : "\u25CB "}${esc4(m.title)}</div>
                  <div style="font-size:12px;color:var(--ink-3)">${esc4(m.desc)}</div>
                </div>
                <span style="font-family:var(--mono);font-size:12px;color:${m.done ? "var(--green)" : "var(--amber)"}">${esc4(m.prog)}</span>
              </div>
            `
      ).join("")}
          </div>
        </section>

        <aside class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <h2 class="card-title" style="margin:0">Study Journal</h2>
            <select id="notes-lang-filter" class="select" style="padding:4px 8px;font-size:12px">
              <option value="all" ${this.notesLangFilter === "all" ? "selected" : ""}>All languages</option>
              ${this.settings.learningLangs.map((c) => `<option value="${c}" ${this.notesLangFilter === c ? "selected" : ""}>${esc4(LANG_MAP[c]?.name || c)}</option>`).join("")}
            </select>
          </div>

          <div class="chat-feed" id="notes-feed">
            ${filteredNotes.length === 0 ? `<p style="color:var(--ink-3);font-size:12.5px;margin:0">No study notes yet. Record book reflections, grammar observations, or session goals below.</p>` : filteredNotes.map(
        (n) => `
                  <div class="chat-msg">
                    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--ink-3);margin-bottom:3px">
                      <strong style="color:var(--ink)">[${esc4(n.lang.toUpperCase())}] ${esc4(n.title)}</strong>
                      <button type="button" class="btn btn-sm" style="padding:1px 5px;font-size:10.5px" data-del-note="${esc4(n.id)}">\u2715</button>
                    </div>
                    <div>${esc4(n.text)}</div>
                  </div>
                `
      ).join("")}
          </div>

          <form id="note-form" style="display:flex;flex-direction:column;gap:6px">
            <input type="text" id="note-title-input" class="input" placeholder="Note title (e.g. Chapter 2 grammar)\u2026" />
            <div style="display:flex;gap:6px">
              <input type="text" id="note-body-input" class="input" style="flex:1" placeholder="Write study note\u2026" />
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </aside>
      </div>
    `
    );
    pane.querySelector("#notes-lang-filter")?.addEventListener("change", (e) => {
      this.notesLangFilter = e.target.value;
      this.renderMilestones(pane);
    });
    pane.querySelectorAll("[data-del-note]").forEach((b) => {
      b.addEventListener("click", async () => {
        await deleteStudyNote(b.dataset.delNote);
        this.studyNotes = await getNotesByLang();
        this.renderMilestones(pane);
      });
    });
    pane.querySelector("#note-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const titleInp = document.getElementById("note-title-input");
      const bodyInp = document.getElementById("note-body-input");
      const text = bodyInp.value.trim();
      if (!text) return;
      const title = titleInp.value.trim() || `${langName} Note`;
      await putStudyNote({
        id: `note_${Date.now()}`,
        lang: this.settings.activeLang,
        title,
        text,
        createdAt: Date.now()
      });
      this.studyNotes = await getNotesByLang();
      this.renderMilestones(pane);
    });
  }
};
function estimateCefrLevel(known, spaceless) {
  const scale = spaceless ? 0.85 : 1;
  const thresholds = [
    ["A0", "First Steps", 0],
    ["A1", "Beginner", Math.round(500 * scale)],
    ["A2", "Elementary", Math.round(1200 * scale)],
    ["B1", "Intermediate", Math.round(2500 * scale)],
    ["B2", "Upper Intermediate", Math.round(5e3 * scale)],
    ["C1", "Advanced", Math.round(1e4 * scale)],
    ["C2", "Mastery", Math.round(18e3 * scale)]
  ];
  let idx = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (known >= thresholds[i][2]) idx = i;
  }
  const cur = thresholds[idx];
  const next = thresholds[Math.min(thresholds.length - 1, idx + 1)];
  const span = Math.max(1, next[2] - cur[2]);
  const pct = idx === thresholds.length - 1 ? 100 : Math.min(100, Math.round((known - cur[2]) / span * 100));
  return {
    band: cur[0],
    title: cur[1],
    nextBand: next[0],
    nextTarget: next[2],
    pct
  };
}
function applyTheme(theme) {
  const isLight = theme === "light" || theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
}
function esc4(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
new VerbaDashboardApp().init().catch((err2) => console.error("Verba dashboard init error:", err2));
