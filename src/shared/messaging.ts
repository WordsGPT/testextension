import type {
  AIVerdictData,
  BookItem,
  BundledDictionary,
  CustomDictionaryMeta,
  DailyStatRecord,
  LangCode,
  ListeningTrackLog,
  LookupResult,
  VerbaSettings,
  VideoHistoryItem,
  WordRecord,
  WordStatus,
} from './types';
import type { AddAnkiCardPayload } from './anki';
import { sendRuntimeMessage } from './webext';

export type BgRequest =
  | { type: 'GET_INIT_DATA'; url: string; htmlLang?: string; sampleText?: string }
  | { type: 'GET_SETTINGS' }
  | { type: 'SAVE_SETTINGS'; patch: Partial<VerbaSettings> }
  | { type: 'GET_DICTIONARY'; lang: LangCode }
  | {
      type: 'LOOKUP_WORD';
      word: string;
      lang: LangCode;
      sentence?: string;
      lemmaHint?: string;
      incrementLookup?: boolean;
    }
  | {
      type: 'GRADE_WORD';
      lang: LangCode;
      word: string;
      status: WordStatus;
      isPhrase?: boolean;
      isCustomSegment?: boolean;
      customMeaning?: string;
      aiMeaning?: string;
      lemmaOverride?: string;
      contextSentence?: string;
      altScript?: string;
    }
  | { type: 'BATCH_MARK_KNOWN'; lang: LangCode; words: string[]; source: 'manual' | 'bulk' }
  | { type: 'SPLIT_CUSTOM_WORD'; lang: LangCode; word: string }
  | { type: 'TRANSLATE'; text: string; sourceLang: LangCode | 'auto'; targetLang?: string }
  | { type: 'AI_CHECK_WORD'; word: string; lang: LangCode; sentence?: string }
  | { type: 'ANKI_SEND_WORD'; payload: AddAnkiCardPayload }
  | { type: 'ANKI_TEST'; port: number }
  | { type: 'ANKI_SYNC_NOW'; lang?: LangCode }
  | { type: 'RECORD_READING_WORDS'; lang: LangCode; count: number; paragraphKey?: string }
  | {
      type: 'RECORD_LISTENING_SECONDS';
      lang: LangCode;
      seconds: number;
      title?: string;
      domain?: string;
      held?: boolean;
    }
  | { type: 'SAVE_ARTICLE_TO_SHELF'; lang: LangCode; title: string; url: string; html: string; text: string }
  | { type: 'SAVE_VIDEO_PROGRESS'; item: VideoHistoryItem }
  | { type: 'GET_VIDEO_PROGRESS'; id: string }
  | { type: 'BROADCAST_WORDS_REFRESH'; lang?: LangCode }
  | { type: 'OPEN_EXTENSION_PAGE'; page: 'dashboard' | 'books' | 'video'; query?: string };

export interface InitPagePayload {
  settings: VerbaSettings;
  activeLang: LangCode;
  autoSwitchedFrom?: LangCode;
  enabledOnThisPage: boolean;
  words: WordRecord[];
  customDicts: CustomDictionaryMeta[];
  todayStats: {
    wordsMarkedKnown: number;
    frequentMarkedKnown: number;
    wordsRead: number;
    secondsListened: number;
  };
  totalKnownCount: number;
}

export async function sendBgMessage<T = unknown>(msg: BgRequest): Promise<T> {
  return sendRuntimeMessage<T>(msg);
}

export type {
  AIVerdictData,
  BookItem,
  BundledDictionary,
  CustomDictionaryMeta,
  DailyStatRecord,
  ListeningTrackLog,
  LookupResult,
};
