export type LangCode =
  | 'zh' | 'yue' | 'ja' | 'ko' | 'it' | 'en' | 'fr' | 'de' | 'nl' | 'es' | 'pt'
  | 'sv' | 'da' | 'no' | 'fi' | 'pl' | 'ru' | 'uk' | 'el' | 'tr' | 'vi' | 'id' | 'th' | 'ar';

/**
 * Word status:
 *  0 = New (unfamiliar, highlighted in sky blue)
 *  1..4 = Learning stages 1..4 (graduated amber shades -> underline)
 *  5 = Known (no highlight)
 * -1 = Ignored (names/numbers, no highlight)
 */
export type WordStatus = -1 | 0 | 1 | 2 | 3 | 4 | 5;

export type CefrBand = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type CefrLevel = 'A0' | CefrBand;

export interface AIVerdictData {
  verdict: 'real' | 'narrow' | 'not_a_word' | 'uncertain';
  confidence: 'high' | 'medium' | 'low';
  shortMeaning: string;
  meaning: string;
  reading?: string;
  registerNote?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  reasoning: string;
  customAnswer?: string;
  provider: string;
  checkedAt: number;
}

export interface WordRecord {
  id: string; // `${lang}:${key}`
  lang: LangCode;
  word: string; // canonical key (lemma or surface depending on counting mode)
  surfaceForms?: string[]; // tracked inflected forms
  altScript?: string; // Traditional/Simplified counterpart for zh/yue
  status: WordStatus;
  isPhrase: boolean; // multi-word phrase (not counted in word totals except vi)
  isCustomSegment: boolean; // user-merged CJK/Thai/Korean compound
  lemmaOverride?: string; // "Could also be" user choice
  customMeaning?: string; // tagged "Yours"
  aiMeaning?: string; // tagged "✦ AI"
  aiVerdict?: AIVerdictData;
  reading?: string;
  lookupCount: number;
  source: 'manual' | 'bulk' | 'import';
  contextSentence?: string;
  contextTranslation?: string;
  ankiNoteId?: number;
  ankiDeck?: string;
  ankiSuspendedByVerba?: boolean;
  deleted?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DictEntry {
  w: string;
  alt?: string;
  r?: string;
  r2?: string;
  pitch?: string;
  pos?: string;
  gender?: 'm' | 'f' | 'n';
  sep?: string;
  rank?: number;
  m: string[];
  forms?: string[];
  special?: 'name' | 'place';
  dictName?: string; // populated for custom Yomitan / CSV dictionaries
}

export interface CharInfo {
  r: string;
  m: string;
  comp: [string, string][];
}

export interface BundledDictionary {
  lang: LangCode;
  version: string;
  entries: DictEntry[];
  chars?: Record<string, CharInfo>;
}

export interface LookupResult {
  query: string;
  normalized: string;
  lemma: string;
  entries: DictEntry[];
  couldAlsoBe: { lemma: string; gloss: string }[];
  partsOf?: { part: string; role: string }[];
  characters?: { char: string; reading: string; meaning: string; components: [string, string][] }[];
  charByCharGloss?: { char: string; reading: string; meaning: string }[];
  record?: WordRecord | null;
  crossScriptKnown?: boolean;
  rank?: number;
}

export interface CustomDictionaryMeta {
  id: string;
  lang: LangCode;
  name: string;
  format: 'yomitan' | 'csv' | 'tsv' | 'txt';
  enabled: boolean;
  order: number;
  entryCount: number;
  entries: DictEntry[];
  addedAt: number;
}

export interface BookChapter {
  id: string;
  title: string;
  html?: string;
  text: string;
  vertical?: boolean;
}

export interface BookBookmark {
  id: string;
  bookId: string;
  chapterIndex: number;
  scrollRatio: number;
  excerpt: string;
  createdAt: number;
  deleted?: boolean;
}

export interface BookItem {
  id: string; // content SHA-256 hash
  lang: LangCode;
  title: string;
  author?: string;
  format: 'epub' | 'pdf' | 'txt' | 'srt' | 'vtt' | 'ass' | 'article' | 'paste' | 'cbz' | 'image';
  folderId?: string | null;
  chapters: BookChapter[];
  chapterIndex: number;
  scrollRatio: number;
  sentenceMode?: boolean;
  sentenceIndex?: number;
  paginated?: boolean;
  sourceUrl?: string;
  totalWords: number;
  uniqueWords: number;
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
}

export interface ShelfFolder {
  id: string;
  lang: LangCode;
  name: string;
  createdAt: number;
  deleted?: boolean;
}

export interface SubtitleCue {
  id: string;
  start: number; // seconds
  end: number; // seconds
  text: string;
  translation?: string;
}

export interface VideoHistoryItem {
  id: string;
  lang: LangCode;
  title: string;
  source: 'youtube' | 'netflix' | 'local' | 'web';
  url?: string;
  fileName?: string;
  positionSec: number;
  durationSec: number;
  subtitleOffsetSec: number;
  cues?: SubtitleCue[];
  updatedAt: number;
}

export interface DailyStatRecord {
  id: string; // `${lang}:${date}:${deviceId}`
  lang: LangCode;
  date: string; // YYYY-MM-DD (respecting dayEndsAtHour)
  deviceId: string;
  wordsRead: number;
  secondsListened: number;
  wordsMarkedKnown: number;
  wordsMarkedLearning: number;
  frequentMarkedKnown: number;
  updatedAt: number;
}

export interface ListeningTrackLog {
  id: string;
  lang: LangCode;
  title: string;
  domain: string;
  date: string;
  secondsEarned: number;
  status: 'counted' | 'held' | 'rejected';
  updatedAt: number;
}

export interface StudyNote {
  id: string;
  lang: LangCode;
  title: string;
  text: string;
  createdAt: number;
}

export interface PlacementAssessment {
  id: string;
  lang: LangCode;
  cefrLevel: CefrLevel;
  cefrTitle: string;
  estimatedVocab: number;
  recommendedRankFrontier: number;
  confidencePct: number;
  bandScores: Record<CefrBand, { correct: number; total: number }>;
  correctWords: string[];
  missedWords: string[];
  appliedCalibration?: boolean;
  completedAt: number;
}

export interface ReadingKeymap {
  grade1: string;
  grade2: string;
  grade3: string;
  grade4: string;
  known: string;
  ignore: string;
  resetNew: string;
  aiCheck: string;
  speakWord: string;
  speakSentence: string;
  customMeaning: string;
  googleTranslate: string;
  dictLink: string;
  charactersTab: string;
  nextEntry: string;
  prevEntry: string;
  listEntries: string;
  ankiAdd: string;
  ankiPick: string;
  askAiChat: string;
  nextWord: string;
  prevWord: string;
  openKnownUp: string;
  closeDown: string;
  markPageKnown: string;
  toggleHighlights: string;
  readAloud: string;
  openReaderView: string;
  sentenceMode: string;
  nextFreqSentence: string;
  prevFreqSentence: string;
  nextUnknownSentence: string;
  prevUnknownSentence: string;
  toggleDiglot: string;
}

export type DiglotVocabPool = 'learning_and_new' | 'learning_only' | 'all_vocab';

export interface VideoKeymap {
  toggleCaptions: string;
  prevLine: string;
  replayLine: string;
  nextLine: string;
  autoPause: string;
  peekForward: string;
  peekBackward: string;
  hideKnownLines: string;
  cycleBandFilter: string;
  wordsInVideo: string;
  subEarlier: string;
  subLater: string;
  nextFreqLine: string;
  prevFreqLine: string;
  hopCommonDown: string;
  hopCommonUp: string;
  nextUnknownLine: string;
  prevUnknownLine: string;
  markLineKnown: string;
}

export interface PerLanguageOptions {
  countingMode: 'lemma' | 'surface'; // "As one word" vs "Every form separately"
  unifyScripts: boolean; // Chinese/Cantonese simplified+traditional
  onlyHighlightTargetText: boolean; // e.g. "Only highlight text that looks Italian"
  readingsEnabled: boolean;
  readingNotation: string; // 'pinyin' | 'zhuyin' | 'jyutping' | 'yale' | 'hiragana' | 'katakana' | 'romaji' | 'revised' | 'paiboon' | 'translit'
  readingScope: 'new_learning' | 'new_only' | 'every_word';
  pitchAccent: boolean;
  definitionLang: string;
  translateIntoLang: string;
  whoTranslates: 'google' | 'offline';
  customDictPlacement: 'replace' | 'above' | 'below';
  dictionaryLinks: { name: string; urlTemplate: string }[];
  fontFamily: string;
  ankiAutoDeck: string;
  ankiPickedDeck: string;
  ankiNoteType: string;
}

export type VocabBandFilter = 'all' | 'top500' | 'top1500' | 'top3000' | 'top5000' | 'top10000';

export interface VerbaSettings {
  deviceId: string;
  onboarded: boolean;
  // 1. General & Profile
  profileName: string;

  // 2. Languages
  activeLang: LangCode;
  learningLangs: LangCode[];
  polyglotOrder: LangCode[];
  autoSwitchPageLang: boolean;
  selectLookupEnabled: boolean;
  perLang: Partial<Record<LangCode, PerLanguageOptions>>;

  // 3. Reading
  runOnWebPages: boolean;
  inlineReplacementEnabled: boolean;
  inlineReplacementDensityPct: number;
  inlineReplacementPool: DiglotVocabPool;
  inlineReplacementMaxRank: number;
  inlineReplacementShowHint: boolean;
  pausedTabIds: number[];
  forceEnabledUrls: string[];
  neverRunDomains: string[];
  showPageCounter: boolean;
  languageSwitcherOnPage: boolean;
  gradeByHovering: boolean;
  hoverDelayMs: number;
  clickNewStartsLearning: boolean;
  linksStayClickable: boolean;
  contextMeaningFirst: boolean;
  entriesOneAtATime: boolean;
  translateMissingWords: boolean;
  countWordsReadWhere: 'everywhere' | 'reader_and_books';
  pdfDefaultMode: 'fit_phones' | 'printed' | 'always_fit';
  readerFont: 'original' | 'sans' | 'serif' | 'mono' | 'custom';
  customFontName: string;
  readerTheme: 'white' | 'sepia' | 'dark';
  readerFontSize: number;
  dailyReadingGoalWords: number;
  dailyListeningGoalMin: number;
  dayEndsAtHour: number;
  readingKeymap: ReadingKeymap;
  videoKeymap: VideoKeymap;

  // 4. Appearance
  theme: 'system' | 'light' | 'dark';
  uiLanguage: string;
  highlightWords: boolean;
  specialWordsHighlight: boolean;
  underlineInsteadOfFill: boolean;
  highlightStrength: number; // 0.5 .. 1.5
  colors: {
    newWord: string;
    learning: string;
    crossScript: string;
    selectedPhrase: string;
    specialWord: string;
  };
  wordPanel: {
    size: 'S' | 'M' | 'L' | 'XL';
    showReading: boolean;
    dictLinksInline: boolean;
    compactSpacing: boolean;
    showGradeButtons: boolean;
  };

  // 5. Voice & TTS
  voiceBackend: 'device' | 'cloud' | 'piper' | 'local_server';
  cloudVoiceProvider: 'gemini' | 'openai' | 'elevenlabs' | 'google' | 'azure';
  cloudVoiceApiKey: string;
  localVoiceServerUrl: string;
  voiceSpeed: number;
  voiceVolume: number;
  sayWordOnOpen: boolean;
  sayWordOnArrow: boolean;

  // 6. Watch & Listen
  smartListeningTracking: boolean;
  showTabCountedChip: boolean;
  askUnsureTrackLang: boolean;
  youtubeThumbnailCounts: boolean;
  ignoredListeningDomains: string[];

  // 7. Dual Captions (Videos)
  captionsEnabled: boolean;
  subtitleMode: 'show' | 'blur' | 'hide';
  translationMode: 'show' | 'blur' | 'hide';
  inlineWordMeanings: 'off' | 'show' | 'blur' | 'hide';
  sharpWordsWithMeaning: boolean;
  colorsThroughBlur: boolean;
  hideKnownLines: boolean;
  vocabBandFilter: VocabBandFilter;
  autoPauseEachLine: boolean;
  autoPauseOnlyNewWords: boolean;
  autoResumeOnKnown: boolean;
  pauseOnLookup: boolean;
  pauseOnLookupDelayMs: number;
  googleTranslateMissingSubs: boolean;
  subtitleSize: 'S' | 'M' | 'L' | 'XL';
  translationSize: 'S' | 'M' | 'L' | 'XL';
  subtitleFont: 'sans' | 'serif' | 'mono';
  subtitleBgOpacity: number; // 0..100
  karaokeMode: boolean;
  showActionNotes: boolean;
  subtitleVerticalPct: number; // 8..92

  // 8. Game Controller
  gamepadEnabled: boolean;
  swapABXY: boolean;
  pageScrollPx: number;

  // 9. AI Check & Ask AI Chat
  aiCheckEnabled: boolean;
  aiIncludeSentence: boolean;
  aiProvider: 'gemini' | 'claude' | 'openai' | 'deepseek';
  aiApiKey: string;
  aiModel: string;
  aiWorkspaceId: string;
  aiCustomRequest: string;
  askAiChatProvider: 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'custom';
  askAiChatCustomUrl: string;
  askAiChatPromptTemplate: string;

  // 10. Anki
  ankiConnectPort: number;
  ankiSendAllLearning: boolean;
  ankiLevelsToSend: number[];
  ankiShowButtonInPanel: boolean;
  ankiTags: string;
  ankiMarkKnownOnMature: boolean;
  ankiMatureDays: number;
  ankiSuspendWhenKnown: boolean;
  ankiVideoMedia: 'audio_clip' | 'picture' | 'video_clip' | 'none';
  ankiIncludeSurroundingLines: boolean;
  ankiVoiceWord: boolean;
  ankiVoiceSentence: boolean;
  ankiCardLayout: {
    word: 'front' | 'back';
    reading: 'front' | 'back' | 'off';
    pitch: 'front' | 'back' | 'off';
    meaning: 'front' | 'back' | 'off';
    sentence: 'front' | 'back' | 'off';
    sentenceTranslation: 'front' | 'back' | 'off';
    picture: 'front' | 'back' | 'off';
    wordAudio: 'front' | 'back' | 'off';
    sentenceAudio: 'front' | 'back' | 'off';
  };

  // 11. Sync & Backup
  syncPairingCode: string;
  syncPeerUrl: string;
  syncSendBookFiles: boolean;
  syncMaxBookSizeMb: number;
  pairedDevices: { id: string; name: string; lastSeen: number }[];
  autoBackupEnabled: boolean;
  backupKeyLockedHash: string;
  lastBackupAt: number;
  updatedAt: number;
}
