import type {
  BookItem,
  BundledDictionary,
  CustomDictionaryMeta,
  DailyStatRecord,
  LangCode,
  ListeningTrackLog,
  StudyNote,
  VerbaSettings,
  VideoHistoryItem,
  WordRecord,
  WordStatus,
} from '../shared/types';
import {
  deleteStudyNote,
  getAllDailyStats,
  getAllWordsRaw,
  getBooksByLang,
  getNotesByLang,
  getCustomDictsByLang,
  getDailyStatsByLang,
  getLangOptionsFromSettings,
  getListeningHistoryByLang,
  getLogicalDateString,
  getVideosByLang,
  getWordsByLang,
  incrementDailyStat,
  putStudyNote,
  putListeningLog,
  putWordRecord,
  putWordRecordsBatch,
} from '../shared/db';
import { buildLangIndex, formatOrdinal, type LoadedLangIndex } from '../shared/dictionary';
import {
  parseHanziHeroImport,
  parseLanguageReactorImport,
  parseLingQImport,
  parsePlainTextWordImport,
} from '../shared/imports';
import { LANGUAGES, LANG_MAP, getDefaultLangOptions } from '../shared/languages';
import { sendBgMessage } from '../shared/messaging';
import { getExtApi } from '../shared/webext';
import { speakText } from '../shared/tts';
import { SHADOW_UI_CSS } from '../content/styles';
import { VerbaWordPanel } from '../content/word-panel';
import { PlacementViewController } from './placement-view';
import { renderSettingsTab, type SettingsSectionId } from './settings-view';

type MainTab = 'home' | 'words' | 'placement' | 'books' | 'videos' | 'progress' | 'milestones' | 'settings';
type WordsSubTab = 'my_words' | 'mark_known' | 'most_common' | 'tools';

class VerbaDashboardApp {
  private rootEl = document.getElementById('dashboard-app')!;
  private shadowHost!: HTMLElement;
  private shadow!: ShadowRoot;
  private wordPanel!: VerbaWordPanel;
  private placementCtrl = new PlacementViewController();

  private settings!: VerbaSettings;
  private dictIndex!: LoadedLangIndex;
  private words: WordRecord[] = [];
  private wordMap = new Map<string, WordRecord>();
  private books: BookItem[] = [];
  private videos: VideoHistoryItem[] = [];
  private dailyStats: DailyStatRecord[] = [];
  private listeningLogs: ListeningTrackLog[] = [];
  private studyNotes: StudyNote[] = [];

  private activeTab: MainTab = 'home';
  private wordsSubTab: WordsSubTab = 'my_words';
  private forceOnboarding = false;
  private onboardingStep: 1 | 2 | 3 = 1;

  // Words sub-views state
  private myWordsSearch = '';
  private myWordsFilter: 'all' | 'learning' | '1' | '2' | '3' | '4' | '5' | '-1' | 'phrases' | 'custom' = 'all';
  private myWordsSort: 'recent' | 'lookups' | 'freq' | 'az' = 'recent';
  private markKnownSliderN = 200;
  private lastBulkMarkedWords: string[] = [];
  private commonBandStart = 1;
  private commonSearch = '';
  private exportRangeFrom = 1;
  private exportRangeTo = 500;
  private pendingImportRecords: WordRecord[] | null = null;
  private pendingImportLabel = '';

  // Progress state
  private calMonthOffset = 0;
  private polyglotRange: 'today' | '7d' | '30d' | 'all' = '30d';

  // Milestones & Notes state
  private notesLangFilter: 'all' | LangCode = 'all';

  // Settings state
  private settingsSection: SettingsSectionId = 'reading';
  private settingsSearch = '';
  private settingsOptionsLang: LangCode = 'it';
  private settingsCustomDicts: CustomDictionaryMeta[] = [];

  private toastMsg = '';

  public async init(): Promise<void> {
    this.mountShadow();
    this.parseHashRoute();
    window.addEventListener('hashchange', () => {
      this.parseHashRoute();
      this.render();
    });

    const ext = getExtApi();
    ext?.runtime?.onMessage?.addListener((msg: { type?: string; lang?: LangCode }) => {
      if (!msg?.type) return;
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;
      if ((msg.type === 'VERBA_WORD_UPDATED' || msg.type === 'VERBA_WORDS_REFRESH') && (!msg.lang || msg.lang === this.settings?.activeLang)) {
        this.reloadAllData().then(() => this.render()).catch(() => {});
      }
    });

    await this.reloadAllData();
    await this.seedDefaultNotesIfEmpty();
    this.render();
  }

  private mountShadow(): void {
    this.shadowHost = document.createElement('div');
    this.shadowHost.id = 'verba-ui-root';
    document.documentElement.appendChild(this.shadowHost);
    this.shadow = this.shadowHost.attachShadow({ mode: 'open' });
    const st = document.createElement('style');
    st.textContent = SHADOW_UI_CSS;
    this.shadow.appendChild(st);
  }

  private parseHashRoute(): void {
    const queryTab = new URLSearchParams(location.search).get('tab');
    const raw = location.hash.replace(/^#/, '').trim() || queryTab || '';
    if (!raw) return;
    if (raw === 'onboarding') {
      this.activeTab = 'home';
      this.forceOnboarding = true;
      this.onboardingStep = 1;
      return;
    }
    const [tabPart, subPart] = raw.split(':');
    const validTabs: MainTab[] = ['home', 'words', 'placement', 'books', 'videos', 'progress', 'milestones', 'settings'];
    if (validTabs.includes(tabPart as MainTab)) {
      this.activeTab = tabPart as MainTab;
    }
    if (tabPart === 'settings' && subPart) {
      this.settingsSection = subPart as SettingsSectionId;
    } else if (tabPart === 'words' && subPart) {
      this.wordsSubTab = subPart as WordsSubTab;
    }
  }

  private async reloadAllData(): Promise<void> {
    this.settings = await sendBgMessage<VerbaSettings>({ type: 'GET_SETTINGS' });
    applyTheme(this.settings.theme);

    const lang = this.settings.activeLang;
    if (!this.settingsOptionsLang) this.settingsOptionsLang = lang;

    const rawDict = await sendBgMessage<BundledDictionary>({ type: 'GET_DICTIONARY', lang });
    this.dictIndex = buildLangIndex(rawDict);

    const [words, books, videos, dailyStats, listeningLogs, studyNotes, customDicts] = await Promise.all([
      getWordsByLang(lang),
      getBooksByLang(lang),
      getVideosByLang(lang),
      getDailyStatsByLang(lang),
      getListeningHistoryByLang(lang),
      getNotesByLang(),
      getCustomDictsByLang(this.settingsOptionsLang),
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
            type: 'GRADE_WORD',
            lang: this.settings.activeLang,
            word,
            status,
            ...extra,
          });
          await this.reloadAllData();
          this.render();
        },
        onSplitCustomWord: async (word) => {
          await sendBgMessage({ type: 'SPLIT_CUSTOM_WORD', lang: this.settings.activeLang, word });
          await this.reloadAllData();
          this.render();
        },
        onExtendSelection: () => {},
        onOpenAskAiChat: () => {},
      });
    } else {
      this.wordPanel.settings = this.settings;
      this.wordPanel.langOpts = langOpts;
    }
  }

  private async seedDefaultNotesIfEmpty(): Promise<void> {
    if (this.studyNotes.length > 0) return;
    const now = Date.now();
    const initial: StudyNote[] = [
      {
        id: 'note_seed_1',
        lang: 'it',
        title: 'Pinocchio Capitolo I',
        text: 'Completed first reading session with interactive lookups and sentence-by-sentence review.',
        createdAt: now - 3600 * 1000,
      },
    ];
    for (const n of initial) await putStudyNote(n);
    this.studyNotes = await getNotesByLang();
  }

  private notify(msg: string): void {
    this.toastMsg = msg;
    this.render();
    window.setTimeout(() => {
      if (this.toastMsg === msg) {
        this.toastMsg = '';
        this.render();
      }
    }, 4200);
  }

  private getAggregatedDailyMap(): Map<string, { read: number; listenSec: number; known: number; learning: number }> {
    const map = new Map<string, { read: number; listenSec: number; known: number; learning: number }>();
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

  private computeStreak(dailyMap: Map<string, { read: number; listenSec: number }>): { current: number; longest: number } {
    const isDayMet = (dateStr: string): boolean => {
      const d = dailyMap.get(dateStr);
      if (!d) return false;
      const readMet = d.read >= Math.max(1, this.settings.dailyReadingGoalWords);
      const listenMet = d.listenSec / 60 >= Math.max(1, this.settings.dailyListeningGoalMin);
      return readMet || listenMet || d.read >= 50 || d.listenSec >= 120;
    };

    let current = 0;
    const now = Date.now();
    for (let back = 0; back < 365; back++) {
      const dStr = getLogicalDateString(now - back * 86400000, this.settings.dayEndsAtHour);
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

  private countUniqueKnownWords(list = this.words, lang = this.settings.activeLang): number {
    const seen = new Set<string>();
    let n = 0;
    for (const w of list) {
      if (w.deleted || w.status !== 5) continue;
      if (w.isPhrase && lang !== 'vi') continue;
      if (seen.has(w.word)) continue;
      seen.add(w.word);
      if (w.altScript) seen.add(w.altScript);
      n++;
    }
    return n;
  }

  public render(): void {
    const lang = this.settings.activeLang;
    const langOptsHtml = this.settings.learningLangs
      .map((c) => `<option value="${c}" ${c === lang ? 'selected' : ''}>${esc(LANG_MAP[c]?.name || c)} (${esc(LANG_MAP[c]?.nativeName || c)})</option>`)
      .join('');

    const tabs: [MainTab, string][] = [
      ['home', 'Home'],
      ['words', 'Words'],
      ['placement', 'Placement Test'],
      ['books', 'Books'],
      ['videos', 'Videos'],
      ['progress', 'Progress'],
      ['milestones', 'Milestones'],
      ['settings', 'Settings'],
    ];

    this.rootEl.innerHTML = `
      <header class="dash-topbar">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <a href="#home" class="brand">
            <span class="brand-dot"></span>
            <span>Verba</span>
          </a>
          <nav class="main-tabs" aria-label="Dashboard sections">
            ${tabs
              .map(
                ([id, label]) => `
              <button type="button" class="main-tab ${this.activeTab === id ? 'active' : ''}" data-main-tab="${id}">
                ${esc(label)}
              </button>
            `
              )
              .join('')}
          </nav>
        </div>

        <div class="topbar-actions">
          <a href="books.html" class="btn">📚 Read a book</a>
          <a href="video.html" class="btn">🎬 Watch a video</a>
          <select id="dash-lang-select" class="select" aria-label="Active learning language">
            ${langOptsHtml}
            <option value="__add__">+ Add a new language…</option>
          </select>
        </div>
      </header>

      <main class="dash-container" id="dash-main-pane"></main>
      ${this.toastMsg ? `<div class="toast-banner">${esc(this.toastMsg)}</div>` : ''}
    `;

    const pane = document.getElementById('dash-main-pane')!;
    switch (this.activeTab) {
      case 'home':
        this.renderHome(pane);
        break;
      case 'words':
        this.renderWords(pane);
        break;
      case 'placement':
        this.placementCtrl.render(pane, {
          settings: this.settings,
          dictIndex: this.dictIndex,
          words: this.words,
          onSwitchLanguage: async (nextLang) => {
            await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { activeLang: nextLang } });
            this.settingsOptionsLang = nextLang;
            await this.reloadAllData();
            this.render();
          },
          onRefreshData: async () => {
            await this.reloadAllData();
            this.render();
          },
          onNotify: (m) => this.notify(m),
        });
        break;
      case 'books':
        this.renderBooksOverview(pane);
        break;
      case 'videos':
        this.renderVideosOverview(pane);
        break;
      case 'progress':
        this.renderProgress(pane);
        break;
      case 'milestones':
        this.renderMilestones(pane);
        break;
      case 'settings':
        renderSettingsTab(pane, {
          settings: this.settings,
          activeSection: this.settingsSection,
          searchQuery: this.settingsSearch,
          optionsLang: this.settingsOptionsLang,
          customDicts: this.settingsCustomDicts,
          onSavePatch: async (patch) => {
            this.settings = await sendBgMessage<VerbaSettings>({ type: 'SAVE_SETTINGS', patch });
            await this.reloadAllData();
            this.render();
          },
          onSelectSection: (sec) => {
            this.settingsSection = sec;
            this.settingsSearch = '';
            history.replaceState(null, '', `#settings:${sec}`);
            this.render();
          },
          onSearchChange: (q) => {
            this.settingsSearch = q;
            this.render();
            const inp = document.getElementById('settings-search-input') as HTMLInputElement | null;
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
          },
        });
        break;
    }

    this.bindTopbarEvents();
  }

  private bindTopbarEvents(): void {
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-main-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.mainTab as MainTab;
        this.activeTab = next;
        history.replaceState(null, '', `#${next}`);
        this.render();
      });
    });

    this.rootEl.querySelector<HTMLSelectElement>('#dash-lang-select')?.addEventListener('change', async (e) => {
      const val = (e.target as HTMLSelectElement).value;
      if (val === '__add__') {
        this.activeTab = 'settings';
        this.settingsSection = 'languages';
        history.replaceState(null, '', '#settings:languages');
        this.render();
        return;
      }
      await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { activeLang: val as LangCode } });
      this.settingsOptionsLang = val as LangCode;
      await this.reloadAllData();
      this.render();
    });
  }

  private renderHome(pane: HTMLElement): void {
    const lang = this.settings.activeLang;
    const langName = LANG_MAP[lang]?.name || lang;
    const knownCount = this.countUniqueKnownWords();
    const learningCount = this.words.filter((w) => w.status >= 1 && w.status <= 4).length;

    const dailyMap = this.getAggregatedDailyMap();
    const todayStr = getLogicalDateString(Date.now(), this.settings.dayEndsAtHour);
    const today = dailyMap.get(todayStr) || { read: 0, listenSec: 0, known: 0, learning: 0 };
    const listenMin = Math.round(today.listenSec / 60);
    const readPct = Math.min(100, Math.round((today.read / Math.max(1, this.settings.dailyReadingGoalWords)) * 100));
    const listenPct = Math.min(100, Math.round((listenMin / Math.max(1, this.settings.dailyListeningGoalMin)) * 100));
    const streak = this.computeStreak(dailyMap);
    const showOnboarding = !this.settings.onboarded || this.forceOnboarding;

    pane.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:6px;">
        <div>
          <h1 class="page-heading" style="margin-bottom:4px;">Immersion reading &amp; vocabulary, tailored to your frontier.</h1>
          <p class="page-sub" style="margin-bottom:14px;">Studying <strong>${esc(langName)}</strong> · Local-first, private, offline dictionary ready.</p>
        </div>
        ${
          !showOnboarding
            ? `<button type="button" class="btn btn-sm" id="btn-reopen-onboarding">✨ Setup Wizard</button>`
            : ''
        }
      </div>

      ${showOnboarding ? this.buildOnboardingWizardHtml(lang, langName, knownCount) : ''}

      <div class="stats-grid-4">
        <div class="card">
          <div class="metric-big">${knownCount.toLocaleString()}</div>
          <div class="metric-lbl">Known ${esc(langName)} words (+${today.known} today)</div>
          <div style="margin-top:8px;font-size:12px;color:var(--ink-2)">${learningCount.toLocaleString()} words in Learning (1–4)</div>
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
          <div class="metric-big">🔥 ${streak.current} <small style="font-size:14px;color:var(--ink-3);font-weight:400">days</small></div>
          <div class="metric-lbl">Current streak (Longest: ${streak.longest}d)</div>
        </div>
      </div>

      ${
        !showOnboarding && knownCount < 100
          ? `
        <div class="card" style="margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-color:rgb(59 130 246 / 0.5)">
          <div>
            <h2 class="card-title" style="margin-bottom:4px">Calibrate your ${esc(langName)} vocabulary</h2>
            <p style="margin:0;color:var(--ink-2);font-size:13.5px">Take the 90-second Adaptive Placement Test to benchmark your CEFR level, or use the frequency sweep slider to pre-mark words you already know.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="btn btn-primary" id="home-open-placement">🎯 Take Placement Test</button>
            <button type="button" class="btn" id="home-jump-wall">Frequency Sweep →</button>
          </div>
        </div>
      `
          : ''
      }

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:18px">
        <section class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h2 class="card-title" style="margin:0">Continue Reading</h2>
            <a href="books.html" class="btn btn-sm">Open Shelf →</a>
          </div>
          ${
            this.books.length === 0
              ? `<p style="color:var(--ink-3)">No ${esc(langName)} books on your shelf yet.</p>`
              : `<div style="display:flex;flex-direction:column;gap:10px">
                ${this.books
                  .slice(0, 4)
                  .map(
                    (b) => `
                  <a href="books.html?book=${encodeURIComponent(b.id)}" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--surface-2);border-radius:9px;text-decoration:none;color:var(--ink)">
                    <div>
                      <div style="font-weight:600">${esc(b.title)}</div>
                      <div style="font-size:12px;color:var(--ink-3)">${esc(b.format.toUpperCase())} · Ch. ${b.chapterIndex + 1}/${b.chapters.length}</div>
                    </div>
                    <span class="btn btn-sm btn-primary">Read</span>
                  </a>
                `
                  )
                  .join('')}
              </div>`
          }
        </section>

        <section class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h2 class="card-title" style="margin:0">Watch with Verba Dual Captions</h2>
            <a href="video.html?demo=1" class="btn btn-sm btn-amber">▶ Try Italian Demo</a>
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
    `;

    this.bindOnboardingEvents(pane);

    pane.querySelector('#btn-reopen-onboarding')?.addEventListener('click', () => {
      this.forceOnboarding = true;
      this.onboardingStep = 1;
      history.replaceState(null, '', '#onboarding');
      this.render();
    });

    pane.querySelector('#home-open-placement')?.addEventListener('click', () => {
      this.activeTab = 'placement';
      history.replaceState(null, '', '#placement');
      this.render();
    });

    pane.querySelector('#home-jump-wall')?.addEventListener('click', () => {
      this.activeTab = 'words';
      this.wordsSubTab = 'mark_known';
      history.replaceState(null, '', '#words:mark_known');
      this.render();
    });

    pane.querySelector('#home-open-words')?.addEventListener('click', () => {
      this.activeTab = 'words';
      this.wordsSubTab = 'my_words';
      history.replaceState(null, '', '#words');
      this.render();
    });
  }

  private buildOnboardingWizardHtml(lang: LangCode, langName: string, knownCount: number): string {
    const step = this.onboardingStep;
    return `
      <section class="card" id="onboarding-wizard" style="margin-bottom:24px;border:1.5px solid var(--blue);background:linear-gradient(180deg, rgb(56 189 248 / 0.08), transparent 180px);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <span class="pl-eyebrow" style="margin:0;">WELCOME TO VERBA · STEP ${step} OF 3</span>
            <div style="display:flex;gap:6px;">
              ${[1, 2, 3]
                .map(
                  (s) => `
                <button type="button" class="btn btn-sm ${step === s ? 'btn-primary' : ''}" data-ob-step="${s}" style="padding:3px 10px;font-size:11.5px;">
                  ${s}. ${s === 1 ? 'Language' : s === 2 ? 'Starting Level' : 'Goals & Tour'}
                </button>`
                )
                .join('')}
            </div>
          </div>
          <button type="button" class="btn btn-sm" id="ob-skip-btn" title="Dismiss setup wizard">✕ Skip setup</button>
        </div>

        ${
          step === 1
            ? `
          <div>
            <h2 class="card-title" style="font-size:20px;margin:0 0 6px;">1. Which language are you learning?</h2>
            <p style="margin:0 0 14px;color:var(--ink-2);font-size:13.5px;">
              Pick your primary target language below. Verba ships with bundled offline dictionaries for all 24 languages—you can switch or add more languages anytime.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:16px;">
              ${LANGUAGES.map((l) => {
                const isSelected = l.code === lang;
                return `
                  <button
                    type="button"
                    class="btn"
                    data-ob-lang="${l.code}"
                    style="justify-content:flex-start;padding:9px 12px;text-align:left;${
                      isSelected
                        ? 'border-color:var(--blue);background:rgb(56 189 248 / 0.16);color:var(--ink);font-weight:700;'
                        : ''
                    }"
                  >
                    <div>
                      <div style="font-size:13px;">${esc(l.name)}</div>
                      <div style="font-size:11px;color:var(--ink-3);">${esc(l.nativeName)}</div>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;">
              <button type="button" class="btn btn-primary" id="ob-next-1" style="padding:9px 18px;">
                Continue with ${esc(langName)} →
              </button>
            </div>
          </div>
        `
            : step === 2
            ? `
          <div>
            <h2 class="card-title" style="font-size:20px;margin:0 0 6px;">2. Calibrate your ${esc(langName)} starting level</h2>
            <p style="margin:0 0 16px;color:var(--ink-2);font-size:13.5px;">
              Pre-mark foundational ${esc(langName)} words you already know so only unfamiliar vocabulary at your frontier is highlighted in blue. (Currently <b>${knownCount}</b> Known words)
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-bottom:16px;">
              <div style="padding:16px;border-radius:10px;border:1.5px solid var(--blue);background:var(--surface-2);display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:0.05em;">Recommended</div>
                  <h3 style="margin:4px 0 6px;font-size:15.5px;color:var(--ink);">🎯 12-Question Adaptive Placement Test</h3>
                  <p style="margin:0;font-size:12.5px;color:var(--ink-2);line-height:1.45;">
                    Takes 90 seconds. Diagnoses your CEFR band (<b>A0–C2</b>) and calibrates your known vocabulary in one click.
                  </p>
                </div>
                <button type="button" class="btn btn-primary" id="ob-take-placement">
                  ▶ Start Placement Test Now
                </button>
              </div>

              <div style="padding:16px;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:0.05em;">Instant Sweep</div>
                  <h3 style="margin:4px 0 6px;font-size:15.5px;color:var(--ink);">⚡ Quick Frequency Preset</h3>
                  <p style="margin:0;font-size:12.5px;color:var(--ink-2);line-height:1.45;">
                    Immediately mark the most frequent ${esc(langName)} words in our dictionary as Known:
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
                  <h3 style="margin:4px 0 6px;font-size:15.5px;color:var(--ink);">🌱 Start Fresh (A0)</h3>
                  <p style="margin:0;font-size:12.5px;color:var(--ink-2);line-height:1.45;">
                    New to ${esc(langName)}? Keep every word highlighted as new and build your vocabulary as you read.
                  </p>
                </div>
                <button type="button" class="btn" id="ob-start-fresh">
                  Start with 0 Known Words →
                </button>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;gap:10px;">
              <button type="button" class="btn" id="ob-prev-2">← Back</button>
              <button type="button" class="btn btn-primary" id="ob-next-2">Next: Daily Goals &amp; Tour →</button>
            </div>
          </div>
        `
            : `
          <div>
            <h2 class="card-title" style="font-size:20px;margin:0 0 6px;">3. Set your daily goals &amp; how Verba works</h2>
            <p style="margin:0 0 14px;color:var(--ink-2);font-size:13.5px;">
              Pick a sustainable daily reading &amp; listening target to build your streak:
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:16px;">
              <label style="display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--ink-2);">
                <span><strong>Daily Reading Goal</strong> (words/day)</span>
                <select id="ob-read-goal" class="select">
                  ${[500, 1000, 1500, 2000, 3000]
                    .map(
                      (w) =>
                        `<option value="${w}" ${
                          this.settings.dailyReadingGoalWords === w ? 'selected' : ''
                        }>${w.toLocaleString()} words / day</option>`
                    )
                    .join('')}
                </select>
              </label>

              <label style="display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--ink-2);">
                <span><strong>Daily Listening Goal</strong> (minutes/day)</span>
                <select id="ob-listen-goal" class="select">
                  ${[10, 15, 20, 30, 45, 60]
                    .map(
                      (m) =>
                        `<option value="${m}" ${
                          this.settings.dailyListeningGoalMin === m ? 'selected' : ''
                        }>${m} minutes / day</option>`
                    )
                    .join('')}
                </select>
              </label>

              <label style="display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--ink-2);">
                <span><strong>Interface Theme</strong></span>
                <select id="ob-theme-sel" class="select">
                  <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark Slate (Default)</option>
                  <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Clean Light</option>
                  <option value="system" ${this.settings.theme === 'system' ? 'selected' : ''}>Match System</option>
                </select>
              </label>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:16px;padding:12px;border-radius:10px;background:var(--surface-2);">
              <div>
                <strong style="font-size:13px;color:var(--ink);">🌐 1. Web Highlighting</strong>
                <p style="margin:4px 0 0;font-size:12px;color:var(--ink-2);line-height:1.45;">
                  Hover any word for instant dictionary lookup. Click to mark Learning (<kbd>1</kbd>–<kbd>4</kbd>) or press <kbd>K</kbd> for Known. Links are never hijacked.
                </p>
              </div>
              <div>
                <strong style="font-size:13px;color:var(--ink);">📖 2. Reader View &amp; Books</strong>
                <p style="margin:4px 0 0;font-size:12px;color:var(--ink-2);line-height:1.45;">
                  Press <kbd>Shift+L</kbd> on any article for distraction-free Reader View, or press <kbd>Shift+S</kbd> for Sentence-by-Sentence mode.
                </p>
              </div>
              <div>
                <strong style="font-size:13px;color:var(--ink);">🎬 3. Video Dual Captions</strong>
                <p style="margin:4px 0 0;font-size:12px;color:var(--ink-2);line-height:1.45;">
                  Watch YouTube, Netflix, or local videos with dual subtitles. Press <kbd>E</kbd> to peek blurred translations and <kbd>A</kbd>/<kbd>S</kbd>/<kbd>D</kbd> to step lines.
                </p>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <button type="button" class="btn" id="ob-prev-3">← Back</button>
              <button type="button" class="btn btn-primary" id="ob-finish-btn" style="padding:9px 22px;font-size:14px;">
                ✓ Finish Setup &amp; Start Exploring
              </button>
            </div>
          </div>
        `
        }
      </section>
    `;
  }

  private bindOnboardingEvents(pane: HTMLElement): void {
    const wiz = pane.querySelector('#onboarding-wizard');
    if (!wiz) return;

    wiz.querySelectorAll<HTMLButtonElement>('[data-ob-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.onboardingStep = Number(btn.dataset.obStep) as 1 | 2 | 3;
        this.render();
      });
    });

    wiz.querySelector('#ob-skip-btn')?.addEventListener('click', async () => {
      this.forceOnboarding = false;
      this.settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { onboarded: true },
      });
      if (location.hash === '#onboarding') history.replaceState(null, '', '#home');
      this.render();
    });

    wiz.querySelectorAll<HTMLButtonElement>('[data-ob-lang]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const chosen = btn.dataset.obLang as LangCode;
        const nextLearning = this.settings.learningLangs.includes(chosen)
          ? this.settings.learningLangs
          : [chosen, ...this.settings.learningLangs];
        const nextPoly = this.settings.polyglotOrder.includes(chosen)
          ? this.settings.polyglotOrder
          : [chosen, ...this.settings.polyglotOrder];
        const nextPerLang = {
          ...this.settings.perLang,
          ...(this.settings.perLang[chosen] ? {} : { [chosen]: getDefaultLangOptions(chosen) }),
        };
        this.settings = await sendBgMessage<VerbaSettings>({
          type: 'SAVE_SETTINGS',
          patch: {
            activeLang: chosen,
            learningLangs: nextLearning,
            polyglotOrder: nextPoly,
            perLang: nextPerLang,
          },
        });
        this.settingsOptionsLang = chosen;
        await this.reloadAllData();
        this.render();
      });
    });

    wiz.querySelector('#ob-next-1')?.addEventListener('click', () => {
      this.onboardingStep = 2;
      this.render();
    });

    wiz.querySelector('#ob-prev-2')?.addEventListener('click', () => {
      this.onboardingStep = 1;
      this.render();
    });

    wiz.querySelector('#ob-next-2')?.addEventListener('click', () => {
      this.onboardingStep = 3;
      this.render();
    });

    wiz.querySelector('#ob-start-fresh')?.addEventListener('click', () => {
      this.onboardingStep = 3;
      this.render();
    });

    wiz.querySelector('#ob-take-placement')?.addEventListener('click', async () => {
      this.forceOnboarding = false;
      this.settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { onboarded: true },
      });
      this.activeTab = 'placement';
      history.replaceState(null, '', '#placement');
      this.render();
    });

    wiz.querySelectorAll<HTMLButtonElement>('[data-ob-preset]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const count = Number(btn.dataset.obPreset) || 20;
        const wordsToMark = this.dictIndex.byRank.slice(0, count).map((e) => e.w);
        const res = await sendBgMessage<{ ok: boolean; markedCount: number }>({
          type: 'BATCH_MARK_KNOWN',
          lang: this.settings.activeLang,
          words: wordsToMark,
          source: 'bulk',
        });
        if (res.ok) {
          await this.reloadAllData();
          this.onboardingStep = 3;
          this.notify(`Pre-marked top ${res.markedCount} ${LANG_MAP[this.settings.activeLang]?.name || ''} words as Known!`);
        }
      });
    });

    wiz.querySelector('#ob-prev-3')?.addEventListener('click', () => {
      this.onboardingStep = 2;
      this.render();
    });

    wiz.querySelector('#ob-finish-btn')?.addEventListener('click', async () => {
      const readGoal = Number((wiz.querySelector('#ob-read-goal') as HTMLSelectElement)?.value) || 1000;
      const listenGoal = Number((wiz.querySelector('#ob-listen-goal') as HTMLSelectElement)?.value) || 15;
      const theme = ((wiz.querySelector('#ob-theme-sel') as HTMLSelectElement)?.value || 'dark') as VerbaSettings['theme'];
      this.forceOnboarding = false;
      this.settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: {
          onboarded: true,
          dailyReadingGoalWords: readGoal,
          dailyListeningGoalMin: listenGoal,
          theme,
        },
      });
      if (location.hash === '#onboarding') history.replaceState(null, '', '#home');
      await this.reloadAllData();
      this.notify('Setup complete! Welcome to Verba.');
    });
  }

  private renderWords(pane: HTMLElement): void {
    const langName = LANG_MAP[this.settings.activeLang]?.name || this.settings.activeLang;
    pane.innerHTML = `
      <h1 class="page-heading">${esc(langName)} Words</h1>
      <p class="page-sub">Search your graded words, sweep common words Known, explore frequency bands, or import from LingQ / Language Reactor / HanziHero / Anki.</p>

      <div class="subtabs">
        <button type="button" class="subtab-pill ${this.wordsSubTab === 'my_words' ? 'active' : ''}" data-wsub="my_words">
          My words (${this.words.length})
        </button>
        <button type="button" class="subtab-pill ${this.wordsSubTab === 'mark_known' ? 'active' : ''}" data-wsub="mark_known">
          Frequency Sweep
        </button>
        <button type="button" class="subtab-pill ${this.wordsSubTab === 'most_common' ? 'active' : ''}" data-wsub="most_common">
          Most common (${this.dictIndex.byRank.length})
        </button>
        <button type="button" class="subtab-pill ${this.wordsSubTab === 'tools' ? 'active' : ''}" data-wsub="tools">
          Tools &amp; Import
        </button>
      </div>

      <div id="words-subpane"></div>
    `;

    pane.querySelectorAll<HTMLButtonElement>('[data-wsub]').forEach((b) => {
      b.addEventListener('click', () => {
        this.wordsSubTab = b.dataset.wsub as WordsSubTab;
        history.replaceState(null, '', `#words:${this.wordsSubTab}`);
        this.render();
      });
    });

    const sub = document.getElementById('words-subpane')!;
    if (this.wordsSubTab === 'my_words') this.renderMyWordsSub(sub);
    else if (this.wordsSubTab === 'mark_known') this.renderMarkKnownSub(sub);
    else if (this.wordsSubTab === 'most_common') this.renderMostCommonSub(sub);
    else this.renderWordsToolsSub(sub);
  }

  private renderMyWordsSub(sub: HTMLElement): void {
    const q = this.myWordsSearch.trim().toLowerCase();
    const filtered = this.words.filter((w) => {
      if (this.myWordsFilter === 'learning' && !(w.status >= 1 && w.status <= 4)) return false;
      if (['1', '2', '3', '4', '5', '-1'].includes(this.myWordsFilter) && String(w.status) !== this.myWordsFilter) return false;
      if (this.myWordsFilter === 'phrases' && !w.isPhrase) return false;
      if (this.myWordsFilter === 'custom' && !w.customMeaning && !w.isCustomSegment) return false;
      if (q) {
        const entry = this.dictIndex.byHeadword.get(w.word)?.[0];
        const gloss = (w.customMeaning || entry?.m.join(' ') || '').toLowerCase();
        return w.word.toLowerCase().includes(q) || gloss.includes(q);
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (this.myWordsSort === 'lookups') return (b.lookupCount || 0) - (a.lookupCount || 0);
      if (this.myWordsSort === 'az') return a.word.localeCompare(b.word);
      if (this.myWordsSort === 'freq') {
        const ra = this.dictIndex.byHeadword.get(a.word)?.[0]?.rank || 999999;
        const rb = this.dictIndex.byHeadword.get(b.word)?.[0]?.rank || 999999;
        return ra - rb;
      }
      return b.updatedAt - a.updatedAt;
    });

    sub.innerHTML = `
      <div class="card">
        <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:14px">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <input type="search" id="mw-search" class="input" placeholder="Search word or meaning…" value="${esc(this.myWordsSearch)}" />
            <select id="mw-filter" class="select">
              <option value="all" ${this.myWordsFilter === 'all' ? 'selected' : ''}>All statuses (${this.words.length})</option>
              <option value="learning" ${this.myWordsFilter === 'learning' ? 'selected' : ''}>Learning 1–4</option>
              <option value="1" ${this.myWordsFilter === '1' ? 'selected' : ''}>Level 1</option>
              <option value="2" ${this.myWordsFilter === '2' ? 'selected' : ''}>Level 2</option>
              <option value="3" ${this.myWordsFilter === '3' ? 'selected' : ''}>Level 3</option>
              <option value="4" ${this.myWordsFilter === '4' ? 'selected' : ''}>Level 4</option>
              <option value="5" ${this.myWordsFilter === '5' ? 'selected' : ''}>Known</option>
              <option value="-1" ${this.myWordsFilter === '-1' ? 'selected' : ''}>Ignored</option>
              <option value="phrases" ${this.myWordsFilter === 'phrases' ? 'selected' : ''}>Phrases</option>
              <option value="custom" ${this.myWordsFilter === 'custom' ? 'selected' : ''}>Custom meaning</option>
            </select>
            <select id="mw-sort" class="select">
              <option value="recent" ${this.myWordsSort === 'recent' ? 'selected' : ''}>Recently updated</option>
              <option value="lookups" ${this.myWordsSort === 'lookups' ? 'selected' : ''}>Most looked up (👀)</option>
              <option value="freq" ${this.myWordsSort === 'freq' ? 'selected' : ''}>Frequency rank</option>
              <option value="az" ${this.myWordsSort === 'az' ? 'selected' : ''}>Alphabetical (A–Z)</option>
            </select>
          </div>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn btn-sm" id="mw-export-csv">Export CSV</button>
            <button type="button" class="btn btn-sm" id="mw-export-tsv">Export Anki TSV</button>
          </div>
        </div>

        ${
          filtered.length === 0
            ? `<p style="color:var(--ink-3)">No words match your current filter.</p>`
            : `
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
              ${filtered
                .slice(0, 250)
                .map((w) => {
                  const dictEntry = this.dictIndex.byHeadword.get(w.word)?.[0];
                  const meaning = w.customMeaning || w.aiMeaning || dictEntry?.m.slice(0, 2).join('; ') || '—';
                  return `
                  <tr>
                    <td>
                      <span class="w-chip" data-open-word="${esc(w.word)}" data-s="${w.status}">${esc(w.word)}</span>
                      <button type="button" class="btn btn-sm" data-speak-w="${esc(w.word)}" title="Speak">🔊</button>
                    </td>
                    <td>
                      <span>${esc(meaning)}</span>
                      ${w.customMeaning ? `<small style="color:var(--amber);margin-left:6px">Yours</small>` : ''}
                      <button type="button" class="btn btn-sm" data-edit-m="${esc(w.word)}" title="Edit meaning" style="margin-left:6px">✎</button>
                    </td>
                    <td style="color:var(--ink-3)">👀 ${w.lookupCount || 0}</td>
                    <td>
                      <div style="display:flex;gap:4px;flex-wrap:wrap">
                        ${([1, 2, 3, 4, 5, -1, 0] as WordStatus[])
                          .map((st) => {
                            const lbl = st === 5 ? 'K' : st === -1 ? 'X' : st === 0 ? '↺' : String(st);
                            const active = w.status === st;
                            return `<button type="button" class="btn btn-sm ${active ? 'btn-amber' : ''}" data-grade-w="${esc(w.word)}" data-st="${st}">${lbl}</button>`;
                          })
                          .join('')}
                      </div>
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        `
        }
      </div>
    `;

    sub.querySelector<HTMLInputElement>('#mw-search')?.addEventListener('input', (e) => {
      this.myWordsSearch = (e.target as HTMLInputElement).value;
      this.renderMyWordsSub(sub);
      const inp = sub.querySelector<HTMLInputElement>('#mw-search');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(this.myWordsSearch.length, this.myWordsSearch.length);
      }
    });
    sub.querySelector<HTMLSelectElement>('#mw-filter')?.addEventListener('change', (e) => {
      this.myWordsFilter = (e.target as HTMLSelectElement).value as typeof this.myWordsFilter;
      this.renderMyWordsSub(sub);
    });
    sub.querySelector<HTMLSelectElement>('#mw-sort')?.addEventListener('change', (e) => {
      this.myWordsSort = (e.target as HTMLSelectElement).value as typeof this.myWordsSort;
      this.renderMyWordsSub(sub);
    });

    sub.querySelectorAll<HTMLElement>('[data-open-word]').forEach((el) => {
      el.addEventListener('click', () => {
        this.wordPanel.openForWord({
          query: el.dataset.openWord!,
          lang: this.settings.activeLang,
          pinned: true,
          rect: el.getBoundingClientRect(),
        });
      });
    });

    sub.querySelectorAll<HTMLButtonElement>('[data-speak-w]').forEach((btn) => {
      btn.addEventListener('click', () => speakText(btn.dataset.speakW!, this.settings.activeLang, this.settings));
    });

    sub.querySelectorAll<HTMLButtonElement>('[data-edit-m]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const w = btn.dataset.editM!;
        const rec = this.wordMap.get(w);
        const nextM = window.prompt(`Custom meaning for "${w}":`, rec?.customMeaning || '');
        if (nextM === null) return;
        await sendBgMessage({
          type: 'GRADE_WORD',
          lang: this.settings.activeLang,
          word: w,
          status: rec?.status || 1,
          customMeaning: nextM.trim(),
        });
        await this.reloadAllData();
        this.renderMyWordsSub(sub);
      });
    });

    sub.querySelectorAll<HTMLButtonElement>('[data-grade-w]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const word = btn.dataset.gradeW!;
        const status = Number(btn.dataset.st) as WordStatus;
        await sendBgMessage({ type: 'GRADE_WORD', lang: this.settings.activeLang, word, status });
        await this.reloadAllData();
        this.renderMyWordsSub(sub);
      });
    });

    const downloadWords = (delim: ',' | '\t', ext: string) => {
      const lines = filtered.map((w) => {
        const m = w.customMeaning || this.dictIndex.byHeadword.get(w.word)?.[0]?.m.join('; ') || '';
        return delim === '\t'
          ? `${w.word}\t${m}\t${w.reading || ''}`
          : `"${w.word.replace(/"/g, '""')}","${m.replace(/"/g, '""')}",${w.status}`;
      });
      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `verba-${this.settings.activeLang}-words.${ext}`;
      a.click();
    };
    sub.querySelector('#mw-export-csv')?.addEventListener('click', () => downloadWords(',', 'csv'));
    sub.querySelector('#mw-export-tsv')?.addEventListener('click', () => downloadWords('\t', 'tsv'));
  }

  private renderMarkKnownSub(sub: HTMLElement): void {
    const maxSlider = Math.max(50, this.dictIndex.byRank.length);
    const n = Math.min(maxSlider, this.markKnownSliderN);
    const slice = this.dictIndex.byRank.slice(0, n);

    const blueWordsInSlice = slice
      .filter((entry) => {
        const rec = this.wordMap.get(entry.w);
        return !rec || rec.status === 0;
      })
      .map((e) => e.w);

    sub.innerHTML = `
      <div class="card">
        <h2 class="card-title">Frequency Band Vocabulary Sweep</h2>
        <p style="margin:0 0 14px;color:var(--ink-2);font-size:13.5px">
          Slide to pick the <strong>${n.toLocaleString()}</strong> most frequent words in ${esc(LANG_MAP[this.settings.activeLang]?.name || '')}.
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
          <button type="button" class="btn btn-primary" id="btn-mark-wall-known" ${blueWordsInSlice.length === 0 ? 'disabled' : ''}>
            Mark ${blueWordsInSlice.length.toLocaleString()} blue words as known
          </button>
          ${
            this.lastBulkMarkedWords.length > 0
              ? `<button type="button" class="btn btn-amber" id="btn-undo-wall">↶ Undo (${this.lastBulkMarkedWords.length})</button>`
              : ''
          }
        </div>

        <div class="wall-cloud" id="wall-cloud">
          ${slice
            .map((entry) => {
              const st = this.wordMap.get(entry.w)?.status ?? 0;
              return `<span class="w-chip" data-wall-word="${esc(entry.w)}" data-s="${st}" title="#${entry.rank}: ${esc(entry.m[0] || '')}">${esc(entry.w)}</span>`;
            })
            .join('')}
        </div>
      </div>
    `;

    sub.querySelector<HTMLInputElement>('#wall-slider')?.addEventListener('input', (e) => {
      this.markKnownSliderN = Number((e.target as HTMLInputElement).value);
      this.renderMarkKnownSub(sub);
      sub.querySelector<HTMLInputElement>('#wall-slider')?.focus();
    });

    sub.querySelector('#btn-mark-wall-known')?.addEventListener('click', async () => {
      const res = await sendBgMessage<{ ok: boolean; markedCount: number; markedWords: string[] }>({
        type: 'BATCH_MARK_KNOWN',
        lang: this.settings.activeLang,
        words: blueWordsInSlice,
        source: 'bulk',
      });
      if (res.ok) {
        this.lastBulkMarkedWords = res.markedWords || blueWordsInSlice;
        await this.reloadAllData();
        this.notify(`Marked ${res.markedCount} common words as Known!`);
      }
    });

    sub.querySelector('#btn-undo-wall')?.addEventListener('click', async () => {
      const now = Date.now();
      const resetBatch: WordRecord[] = [];
      for (const w of this.lastBulkMarkedWords) {
        const cur = this.wordMap.get(w);
        if (cur) {
          resetBatch.push({ ...cur, status: 0, deleted: true, updatedAt: now });
        }
      }
      await putWordRecordsBatch(resetBatch);
      const count = this.lastBulkMarkedWords.length;
      this.lastBulkMarkedWords = [];
      sendBgMessage({ type: 'BROADCAST_WORDS_REFRESH', lang: this.settings.activeLang }).catch(() => {});
      await this.reloadAllData();
      this.notify(`Undid bulk mark — ${count} words returned to blue (New).`);
    });

    sub.querySelectorAll<HTMLElement>('[data-wall-word]').forEach((chip) => {
      chip.addEventListener('click', () => {
        this.wordPanel.openForWord({
          query: chip.dataset.wallWord!,
          lang: this.settings.activeLang,
          pinned: true,
          rect: chip.getBoundingClientRect(),
        });
      });
    });
  }

  private renderMostCommonSub(sub: HTMLElement): void {
    const allRanked = this.dictIndex.byRank;
    const total = allRanked.length;
    const bands: number[] = [];
    for (let start = 1; start <= Math.max(1, total); start += 100) bands.push(start);

    const q = this.commonSearch.trim().toLowerCase();
    const visible = q
      ? allRanked.filter((e) => e.w.toLowerCase().includes(q) || String(e.rank) === q)
      : allRanked.slice(this.commonBandStart - 1, this.commonBandStart + 99);

    sub.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <select id="common-band-sel" class="select">
              ${bands
                .map(
                  (b) => `<option value="${b}" ${b === this.commonBandStart ? 'selected' : ''}>Ranks ${b}–${Math.min(total, b + 99)}</option>`
                )
                .join('')}
            </select>
            <input type="search" id="common-search" class="input" placeholder="Find word or rank…" value="${esc(this.commonSearch)}" />
          </div>
          <div style="display:flex;gap:6px;align-items:center">
            <span style="font-size:12px;color:var(--ink-3)">Export ranks:</span>
            <input type="number" id="exp-from" class="input" value="${this.exportRangeFrom}" style="width:74px" />
            <span>–</span>
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
            ${visible
              .slice(0, 120)
              .map((e) => {
                const st = this.wordMap.get(e.w)?.status ?? 0;
                return `
                <tr>
                  <td style="font-family:var(--mono);color:var(--ink-3)">${e.rank ? formatOrdinal(e.rank) : '—'}</td>
                  <td><span class="w-chip" data-common-w="${esc(e.w)}" data-s="${st}">${esc(e.w)}</span></td>
                  <td style="color:var(--ink-2)">${esc(e.r || '—')}</td>
                  <td>${esc(e.m.join('; '))}</td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    sub.querySelector<HTMLSelectElement>('#common-band-sel')?.addEventListener('change', (e) => {
      this.commonBandStart = Number((e.target as HTMLSelectElement).value);
      this.commonSearch = '';
      this.renderMostCommonSub(sub);
    });
    sub.querySelector<HTMLInputElement>('#common-search')?.addEventListener('input', (e) => {
      this.commonSearch = (e.target as HTMLInputElement).value;
      this.renderMostCommonSub(sub);
      const inp = sub.querySelector<HTMLInputElement>('#common-search');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(this.commonSearch.length, this.commonSearch.length);
      }
    });
    sub.querySelectorAll<HTMLElement>('[data-common-w]').forEach((el) => {
      el.addEventListener('click', () => {
        this.wordPanel.openForWord({
          query: el.dataset.commonW!,
          lang: this.settings.activeLang,
          pinned: true,
          rect: el.getBoundingClientRect(),
        });
      });
    });
    sub.querySelector('#btn-export-ranked')?.addEventListener('click', () => {
      const from = Math.max(1, Number((document.getElementById('exp-from') as HTMLInputElement).value) || 1);
      const to = Math.max(from, Number((document.getElementById('exp-to') as HTMLInputElement).value) || 500);
      const rows = allRanked
        .filter((e) => (e.rank || 0) >= from && (e.rank || 0) <= to)
        .map((e) => `${e.rank},"${e.w.replace(/"/g, '""')}","${(e.r || '').replace(/"/g, '""')}","${e.m.join('; ').replace(/"/g, '""')}"`);
      const blob = new Blob([`rank,word,reading,meaning\n${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `verba-${this.settings.activeLang}-top-${from}-${to}.csv`;
      a.click();
    });
  }

  private renderWordsToolsSub(sub: HTMLElement): void {
    sub.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px">
        <div class="card">
          <h3 class="card-title">Import from LingQ (CSV)</h3>
          <p style="font-size:13px;color:var(--ink-2)">Files your LingQ vocabulary export as Known while preserving custom hints.</p>
          <label class="btn btn-primary" style="cursor:pointer">
            Choose LingQ .csv…
            <input type="file" id="imp-lingq" accept=".csv" hidden />
          </label>
        </div>

        <div class="card">
          <h3 class="card-title">Import from Language Reactor</h3>
          <p style="font-size:13px;color:var(--ink-2)">Supports LR JSON (preserves stages) and CSV/TSV exports.</p>
          <label class="btn btn-primary" style="cursor:pointer">
            Choose LR .json / .csv…
            <input type="file" id="imp-lr" accept=".json,.csv,.tsv" hidden />
          </label>
        </div>

        <div class="card">
          <h3 class="card-title">Import from HanziHero (Chinese)</h3>
          <p style="font-size:13px;color:var(--ink-2)">Maps Novice→1, Apprentice→2, Journeyman I→3, II→4, Expert/Master→Known.</p>
          <label class="btn btn-primary" style="cursor:pointer">
            Choose HanziHero .csv…
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
              Choose .txt / .tsv…
              <input type="file" id="imp-txt" accept=".txt,.tsv,.csv" hidden />
            </label>
          </div>
        </div>
      </div>

      ${
        this.pendingImportRecords
          ? `
        <div class="card" style="margin-top:18px;border-color:var(--amber)">
          <h3 class="card-title">Preview Import: ${esc(this.pendingImportLabel)} (${this.pendingImportRecords.length.toLocaleString()} words)</h3>
          <p style="font-size:13px;color:var(--ink-2)">Sample: ${esc(
            this.pendingImportRecords
              .slice(0, 12)
              .map((r) => `${r.word}${r.customMeaning ? ` (${r.customMeaning})` : ''}`)
              .join(', ')
          )}</p>
          <div style="display:flex;gap:10px">
            <button type="button" class="btn btn-amber" id="btn-confirm-import">✓ Save ${this.pendingImportRecords.length.toLocaleString()} words</button>
            <button type="button" class="btn" id="btn-cancel-import">Cancel</button>
          </div>
        </div>
      `
          : ''
      }
    `;

    sub.querySelector<HTMLInputElement>('#imp-lingq')?.addEventListener('change', async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      this.pendingImportRecords = parseLingQImport(await f.text(), this.settings.activeLang);
      this.pendingImportLabel = `LingQ (${f.name})`;
      this.renderWordsToolsSub(sub);
    });

    sub.querySelector<HTMLInputElement>('#imp-lr')?.addEventListener('change', async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      const fmt = f.name.toLowerCase().endsWith('.json') ? 'json' : 'csv';
      this.pendingImportRecords = parseLanguageReactorImport(await f.text(), this.settings.activeLang, fmt, 5);
      this.pendingImportLabel = `Language Reactor (${f.name})`;
      this.renderWordsToolsSub(sub);
    });

    sub.querySelector<HTMLInputElement>('#imp-hh')?.addEventListener('change', async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      this.pendingImportRecords = parseHanziHeroImport(await f.text());
      this.pendingImportLabel = `HanziHero (${f.name})`;
      this.renderWordsToolsSub(sub);
    });

    sub.querySelector<HTMLInputElement>('#imp-txt')?.addEventListener('change', async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      const targetSt = Number((document.getElementById('imp-txt-status') as HTMLSelectElement).value) as 5 | -1;
      this.pendingImportRecords = parsePlainTextWordImport(await f.text(), this.settings.activeLang, targetSt);
      this.pendingImportLabel = `Text/Anki (${f.name})`;
      this.renderWordsToolsSub(sub);
    });

    sub.querySelector('#btn-confirm-import')?.addEventListener('click', async () => {
      if (!this.pendingImportRecords) return;
      await putWordRecordsBatch(this.pendingImportRecords);
      const n = this.pendingImportRecords.length;
      this.pendingImportRecords = null;
      sendBgMessage({ type: 'BROADCAST_WORDS_REFRESH', lang: this.settings.activeLang }).catch(() => {});
      await this.reloadAllData();
      this.notify(`Imported ${n.toLocaleString()} words!`);
    });

    sub.querySelector('#btn-cancel-import')?.addEventListener('click', () => {
      this.pendingImportRecords = null;
      this.renderWordsToolsSub(sub);
    });
  }

  private renderBooksOverview(pane: HTMLElement): void {
    const langName = LANG_MAP[this.settings.activeLang]?.name || this.settings.activeLang;
    pane.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <h1 class="page-heading">${esc(langName)} Books Shelf</h1>
          <p class="page-sub" style="margin:0">Read EPUB, PDF, TXT, SRT, comics &amp; saved web articles with instant word grading.</p>
        </div>
        <a href="books.html" class="btn btn-primary">Open Full Books Reader &amp; Shelf →</a>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px">
        ${this.books
          .map(
            (b) => `
          <a href="books.html?book=${encodeURIComponent(b.id)}" class="card" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:8px">
            <div style="font-family:var(--mono);font-size:11px;color:var(--ink-3);text-transform:uppercase">${esc(b.format)}</div>
            <div style="font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink)">${esc(b.title)}</div>
            ${b.author ? `<div style="font-size:12.5px;color:var(--ink-3)">${esc(b.author)}</div>` : ''}
            <div style="margin-top:auto;padding-top:8px;font-size:12px;color:var(--amber)">
              Chapter ${b.chapterIndex + 1} of ${b.chapters.length} →
            </div>
          </a>
        `
          )
          .join('')}
      </div>
    `;
  }

  private renderVideosOverview(pane: HTMLElement): void {
    pane.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <h1 class="page-heading">Videos &amp; Dual Captions</h1>
          <p class="page-sub" style="margin:0">Dual subtitles, blurred translations, auto-pause &amp; "Words in this video" on YouTube, Netflix, and local files.</p>
        </div>
        <div style="display:flex;gap:8px">
          <a href="video.html?demo=1" class="btn btn-amber">▶ Try Built-in Italian Demo</a>
          <a href="video.html" class="btn btn-primary">Open Local Video Player →</a>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">Recent Videos (${this.videos.length})</h2>
        ${
          this.videos.length === 0
            ? `<p style="color:var(--ink-3)">No watched videos recorded yet. Launch the Italian Demo above or open any YouTube video with subtitles!</p>`
            : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">
              ${this.videos
                .map(
                  (v) => `
                <div style="padding:12px;background:var(--surface-2);border-radius:9px">
                  <div style="font-weight:600;color:var(--ink)">${esc(v.title)}</div>
                  <div style="font-size:12px;color:var(--ink-3);margin:4px 0 8px">${esc(v.source)} · ${Math.floor(v.positionSec / 60)}:${String(v.positionSec % 60).padStart(2, '0')}</div>
                  <a href="video.html${v.id === 'demo_it_caffe' ? '?demo=1' : ''}" class="btn btn-sm btn-primary">Resume</a>
                </div>
              `
                )
                .join('')}
            </div>`
        }
      </div>
    `;
  }

  private renderProgress(pane: HTMLElement): void {
    const lang = this.settings.activeLang;
    const langName = LANG_MAP[lang]?.name || lang;
    const knownCount = this.countUniqueKnownWords();
    const cefr = estimateCefrLevel(knownCount, Boolean(LANG_MAP[lang]?.spaceless));

    const dailyMap = this.getAggregatedDailyMap();
    const streak = this.computeStreak(dailyMap);

    // Calendar month calculation
    const refDate = new Date();
    refDate.setDate(1);
    refDate.setMonth(refDate.getMonth() + this.calMonthOffset);
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const monthLabel = refDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calCells: string[] = [];
    for (let i = 0; i < firstDow; i++) calCells.push(`<div></div>`);
    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const stat = dailyMap.get(dStr);
      const rMet = Boolean(stat && stat.read > 0);
      const lMet = Boolean(stat && stat.listenSec >= 60);
      const cls = rMet && lMet ? 'both-met' : rMet ? 'read-only' : lMet ? 'listen-only' : '';
      calCells.push(`
        <div class="cal-cell ${cls}" title="${dStr}: ${stat?.read || 0} words read, ${Math.round((stat?.listenSec || 0) / 60)}m listened">
          <span>${day}</span>
          <small style="font-size:9.5px">${stat ? `${stat.read}w` : ''}</small>
        </div>
      `);
    }

    // 14-day bars
    const last14: { label: string; read: number; listenMin: number }[] = [];
    for (let b = 13; b >= 0; b--) {
      const dStr = getLogicalDateString(Date.now() - b * 86400000, this.settings.dayEndsAtHour);
      const st = dailyMap.get(dStr);
      last14.push({
        label: dStr.slice(8),
        read: st?.read || 0,
        listenMin: Math.round((st?.listenSec || 0) / 60),
      });
    }
    const maxReadBar = Math.max(100, ...last14.map((x) => x.read));
    const maxListenBar = Math.max(10, ...last14.map((x) => x.listenMin));

    pane.innerHTML = `
      <h1 class="page-heading">${esc(langName)} Progress</h1>
      <p class="page-sub">Honest reading &amp; listening tallies, calendar streaks, CEFR vocabulary estimate, and polyglot comparison.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px;margin-bottom:20px">
        <div class="card">
          <h2 class="card-title">Your Level: <span style="color:var(--amber)">${cefr.band}</span> — ${esc(cefr.title)}</h2>
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
                ${[0, 1, 2, 3, 4, 5].map((h) => `<option value="${h}" ${this.settings.dayEndsAtHour === h ? 'selected' : ''}>${h}:00 AM</option>`).join('')}
              </select>
            </label>
          </div>
          <p style="margin:10px 0 0;font-size:12.5px;color:var(--ink-3)">
            🔥 Current streak: <strong>${streak.current}d</strong> · Longest: <strong>${streak.longest}d</strong>
          </p>
        </div>

        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h2 class="card-title" style="margin:0">${esc(monthLabel)}</h2>
            <div style="display:flex;gap:6px">
              <button type="button" class="btn btn-sm" id="cal-prev">←</button>
              <button type="button" class="btn btn-sm" id="cal-next">→</button>
            </div>
          </div>
          <div style="font-size:11.5px;color:var(--ink-3);margin-top:4px">
            <span style="color:#60a5fa">■</span> Reading &nbsp; <span style="color:#fbbf24">■</span> Listening &nbsp; ◪ Both
          </div>
          <div class="cal-grid">
            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<div class="cal-dow">${d}</div>`).join('')}
            ${calCells.join('')}
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px;margin-bottom:20px">
        <div class="card">
          <h2 class="card-title">Words Read (Last 14 Days)</h2>
          <div class="bar-chart">
            ${last14
              .map(
                (d) => `
              <div class="bar-col" title="${d.read} words">
                <div class="bar-rect" style="height:${Math.round((d.read / maxReadBar) * 100)}%;background:var(--blue)"></div>
                <span class="bar-lbl">${d.label}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Minutes Listened (Last 14 Days)</h2>
          <div class="bar-chart">
            ${last14
              .map(
                (d) => `
              <div class="bar-col" title="${d.listenMin} min">
                <div class="bar-rect" style="height:${Math.round((d.listenMin / maxListenBar) * 100)}%;background:var(--amber)"></div>
                <span class="bar-lbl">${d.label}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px" id="polyglot-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h2 class="card-title" style="margin:0">Polyglot Overview</h2>
          <select id="polyglot-range" class="select">
            <option value="today" ${this.polyglotRange === 'today' ? 'selected' : ''}>Today</option>
            <option value="7d" ${this.polyglotRange === '7d' ? 'selected' : ''}>Last 7 days</option>
            <option value="30d" ${this.polyglotRange === '30d' ? 'selected' : ''}>Last 30 days</option>
            <option value="all" ${this.polyglotRange === 'all' ? 'selected' : ''}>All time</option>
          </select>
        </div>
        <div id="polyglot-table-mount">Loading polyglot comparison…</div>
      </div>

      <div class="card">
        <h2 class="card-title">Listening History (${this.listeningLogs.length})</h2>
        ${
          this.listeningLogs.length === 0
            ? `<p style="color:var(--ink-3);margin:0">Smart listening &amp; Read Aloud sessions appear here. Unsure tracks are held until you confirm or ignore them.</p>`
            : `<table class="data-table">
              <thead><tr><th>Date</th><th>Track</th><th>Domain</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                ${this.listeningLogs
                  .slice(0, 30)
                  .map(
                    (lg) => `
                  <tr>
                    <td>${esc(lg.date)}</td>
                    <td>${esc(lg.title)}</td>
                    <td>${esc(lg.domain)}</td>
                    <td>${Math.max(1, Math.round(lg.secondsEarned / 60))}m</td>
                    <td>
                      ${
                        lg.status === 'held'
                          ? `<button type="button" class="btn btn-sm btn-primary" data-confirm-log="${esc(lg.id)}">Count</button>
                             <button type="button" class="btn btn-sm" data-reject-log="${esc(lg.id)}">Reject</button>`
                          : esc(lg.status)
                      }
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>`
        }
      </div>
    `;

    this.populatePolyglotTable();

    pane.querySelector('#cal-prev')?.addEventListener('click', () => {
      this.calMonthOffset--;
      this.renderProgress(pane);
    });
    pane.querySelector('#cal-next')?.addEventListener('click', () => {
      this.calMonthOffset++;
      this.renderProgress(pane);
    });

    pane.querySelector<HTMLInputElement>('#prog-read-goal')?.addEventListener('change', async (e) => {
      const dailyReadingGoalWords = Math.max(10, Number((e.target as HTMLInputElement).value) || 500);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { dailyReadingGoalWords } });
      this.renderProgress(pane);
    });
    pane.querySelector<HTMLInputElement>('#prog-listen-goal')?.addEventListener('change', async (e) => {
      const dailyListeningGoalMin = Math.max(1, Number((e.target as HTMLInputElement).value) || 10);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { dailyListeningGoalMin } });
      this.renderProgress(pane);
    });
    pane.querySelector<HTMLSelectElement>('#prog-day-end')?.addEventListener('change', async (e) => {
      const dayEndsAtHour = Number((e.target as HTMLSelectElement).value);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { dayEndsAtHour } });
      this.renderProgress(pane);
    });
    pane.querySelector<HTMLSelectElement>('#polyglot-range')?.addEventListener('change', (e) => {
      this.polyglotRange = (e.target as HTMLSelectElement).value as typeof this.polyglotRange;
      this.populatePolyglotTable();
    });

    pane.querySelectorAll<HTMLButtonElement>('[data-confirm-log]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const lg = this.listeningLogs.find((x) => x.id === btn.dataset.confirmLog);
        if (!lg) return;
        await putListeningLog({ ...lg, status: 'counted', updatedAt: Date.now() });
        await incrementDailyStat(lg.lang, this.settings.deviceId, this.settings.dayEndsAtHour, {
          secondsListened: lg.secondsEarned,
        });
        await this.reloadAllData();
        this.renderProgress(pane);
      });
    });

    pane.querySelectorAll<HTMLButtonElement>('[data-reject-log]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const lg = this.listeningLogs.find((x) => x.id === btn.dataset.rejectLog);
        if (!lg) return;
        await putListeningLog({ ...lg, status: 'rejected', updatedAt: Date.now() });
        await this.reloadAllData();
        this.renderProgress(pane);
      });
    });
  }

  private async populatePolyglotTable(): Promise<void> {
    const mount = document.getElementById('polyglot-table-mount');
    if (!mount) return;
    const [allWords, allStats] = await Promise.all([getAllWordsRaw(), getAllDailyStats()]);
    const daysBack =
      this.polyglotRange === 'today' ? 0 : this.polyglotRange === '7d' ? 7 : this.polyglotRange === '30d' ? 30 : 99999;
    const cutoffDate = getLogicalDateString(Date.now() - daysBack * 86400000, this.settings.dayEndsAtHour);

    const orderedLangs = this.settings.learningLangs;
    mount.innerHTML = `
      <table class="data-table">
        <thead>
          <tr><th>Language</th><th>Known Words</th><th>Words Read</th><th>Time Listened</th></tr>
        </thead>
        <tbody>
          ${orderedLangs
            .map((code) => {
              const lWords = allWords.filter((w) => w.lang === code && !w.deleted);
              const known = this.countUniqueKnownWords(lWords, code);
              const lStats = allStats.filter((s) => s.lang === code && s.date >= cutoffDate);
              const read = lStats.reduce((sum, s) => sum + s.wordsRead, 0);
              const mins = Math.round(lStats.reduce((sum, s) => sum + s.secondsListened, 0) / 60);
              return `
              <tr>
                <td><strong>${esc(LANG_MAP[code]?.name || code)}</strong> <small style="color:var(--ink-3)">${esc(LANG_MAP[code]?.nativeName || '')}</small></td>
                <td>${known.toLocaleString()}</td>
                <td>${read.toLocaleString()}</td>
                <td>${mins}m</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    `;
  }

  private renderMilestones(pane: HTMLElement): void {
    const lang = this.settings.activeLang;
    const langName = LANG_MAP[lang]?.name || lang;
    const knownCount = this.countUniqueKnownWords();
    const dailyMap = this.getAggregatedDailyMap();
    const totalRead = Array.from(dailyMap.values()).reduce((sum, d) => sum + d.read, 0);
    const totalListenMin = Math.round(Array.from(dailyMap.values()).reduce((sum, d) => sum + d.listenSec, 0) / 60);
    const streak = this.computeStreak(dailyMap).current;

    const milestones = [
      { title: 'First 100 Words', desc: 'Mark 100 words as Known in your active language', done: knownCount >= 100, prog: `${Math.min(100, knownCount)} / 100` },
      { title: 'Core Foundation (500)', desc: 'Reach 500 Known words (CEFR A1 threshold)', done: knownCount >= 500, prog: `${Math.min(500, knownCount)} / 500` },
      { title: 'Independent Reader (2,500)', desc: 'Reach 2,500 Known words (CEFR B1 threshold)', done: knownCount >= 2500, prog: `${Math.min(2500, knownCount)} / 2,500` },
      { title: 'Immersion Bookworm', desc: 'Read 5,000 words in articles or books', done: totalRead >= 5000, prog: `${Math.min(5000, totalRead).toLocaleString()} / 5,000` },
      { title: 'Active Listener', desc: 'Log 60 minutes of target-language audio or video', done: totalListenMin >= 60, prog: `${Math.min(60, totalListenMin)}m / 60m` },
      { title: '7-Day Consistency Streak', desc: 'Maintain a 7-day reading or listening streak', done: streak >= 7, prog: `${Math.min(7, streak)}d / 7d` },
    ];

    const filteredNotes = this.studyNotes.filter(
      (n) => this.notesLangFilter === 'all' || n.lang === this.notesLangFilter
    );

    pane.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <h1 class="page-heading">Milestones &amp; Study Log</h1>
          <p class="page-sub" style="margin:0">Track your ${esc(langName)} proficiency milestones and record personal reading notes.</p>
        </div>
      </div>

      <div class="scoreboard-split">
        <section class="card">
          <h2 class="card-title">Proficiency Milestones (${esc(langName)})</h2>
          <div style="display:grid;gap:10px">
            ${milestones
              .map(
                (m) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--surface-2);border-radius:10px;border:1px solid ${
                m.done ? 'rgb(34 197 94 / 0.45)' : 'var(--border-subtle)'
              }">
                <div>
                  <div style="font-weight:600;color:var(--ink)">${m.done ? '✓ ' : '○ '}${esc(m.title)}</div>
                  <div style="font-size:12px;color:var(--ink-3)">${esc(m.desc)}</div>
                </div>
                <span style="font-family:var(--mono);font-size:12px;color:${m.done ? 'var(--green)' : 'var(--amber)'}">${esc(m.prog)}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </section>

        <aside class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <h2 class="card-title" style="margin:0">Study Journal</h2>
            <select id="notes-lang-filter" class="select" style="padding:4px 8px;font-size:12px">
              <option value="all" ${this.notesLangFilter === 'all' ? 'selected' : ''}>All languages</option>
              ${this.settings.learningLangs
                .map((c) => `<option value="${c}" ${this.notesLangFilter === c ? 'selected' : ''}>${esc(LANG_MAP[c]?.name || c)}</option>`)
                .join('')}
            </select>
          </div>

          <div class="chat-feed" id="notes-feed">
            ${
              filteredNotes.length === 0
                ? `<p style="color:var(--ink-3);font-size:12.5px;margin:0">No study notes yet. Record book reflections, grammar observations, or session goals below.</p>`
                : filteredNotes
                    .map(
                      (n) => `
                  <div class="chat-msg">
                    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--ink-3);margin-bottom:3px">
                      <strong style="color:var(--ink)">[${esc(n.lang.toUpperCase())}] ${esc(n.title)}</strong>
                      <button type="button" class="btn btn-sm" style="padding:1px 5px;font-size:10.5px" data-del-note="${esc(n.id)}">✕</button>
                    </div>
                    <div>${esc(n.text)}</div>
                  </div>
                `
                    )
                    .join('')
            }
          </div>

          <form id="note-form" style="display:flex;flex-direction:column;gap:6px">
            <input type="text" id="note-title-input" class="input" placeholder="Note title (e.g. Chapter 2 grammar)…" />
            <div style="display:flex;gap:6px">
              <input type="text" id="note-body-input" class="input" style="flex:1" placeholder="Write study note…" />
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </aside>
      </div>
    `;

    pane.querySelector<HTMLSelectElement>('#notes-lang-filter')?.addEventListener('change', (e) => {
      this.notesLangFilter = (e.target as HTMLSelectElement).value as 'all' | LangCode;
      this.renderMilestones(pane);
    });

    pane.querySelectorAll<HTMLButtonElement>('[data-del-note]').forEach((b) => {
      b.addEventListener('click', async () => {
        await deleteStudyNote(b.dataset.delNote!);
        this.studyNotes = await getNotesByLang();
        this.renderMilestones(pane);
      });
    });

    pane.querySelector('#note-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titleInp = document.getElementById('note-title-input') as HTMLInputElement;
      const bodyInp = document.getElementById('note-body-input') as HTMLInputElement;
      const text = bodyInp.value.trim();
      if (!text) return;
      const title = titleInp.value.trim() || `${langName} Note`;
      await putStudyNote({
        id: `note_${Date.now()}`,
        lang: this.settings.activeLang,
        title,
        text,
        createdAt: Date.now(),
      });
      this.studyNotes = await getNotesByLang();
      this.renderMilestones(pane);
    });
  }
}

function estimateCefrLevel(known: number, spaceless: boolean): {
  band: string;
  title: string;
  nextBand: string;
  nextTarget: number;
  pct: number;
} {
  const scale = spaceless ? 0.85 : 1.0;
  const thresholds: [string, string, number][] = [
    ['A0', 'First Steps', 0],
    ['A1', 'Beginner', Math.round(500 * scale)],
    ['A2', 'Elementary', Math.round(1200 * scale)],
    ['B1', 'Intermediate', Math.round(2500 * scale)],
    ['B2', 'Upper Intermediate', Math.round(5000 * scale)],
    ['C1', 'Advanced', Math.round(10000 * scale)],
    ['C2', 'Mastery', Math.round(18000 * scale)],
  ];

  let idx = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (known >= thresholds[i][2]) idx = i;
  }
  const cur = thresholds[idx];
  const next = thresholds[Math.min(thresholds.length - 1, idx + 1)];
  const span = Math.max(1, next[2] - cur[2]);
  const pct = idx === thresholds.length - 1 ? 100 : Math.min(100, Math.round(((known - cur[2]) / span) * 100));
  return {
    band: cur[0],
    title: cur[1],
    nextBand: next[0],
    nextTarget: next[2],
    pct,
  };
}

function applyTheme(theme: 'system' | 'light' | 'dark'): void {
  const isLight =
    theme === 'light' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
}

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

new VerbaDashboardApp().init().catch((err) => console.error('Verba dashboard init error:', err));
