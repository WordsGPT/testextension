import type { LangCode, VerbaSettings } from '../shared/types';
import type { PageWordCounts } from './highlighter';
import { LANG_MAP } from '../shared/languages';

export interface IslandTodayStats {
  wordsMarkedKnown: number;
  frequentMarkedKnown: number;
  wordsRead: number;
  secondsListened: number;
}

export class VerbaIsland {
  private el: HTMLElement;
  private tallyEl: HTMLElement;
  private switchNoteEl: HTMLElement;
  private tallyOpen = false;

  public counts: PageWordCounts = {
    newWords: 0,
    learningWords: 0,
    knownWordsOnPage: 0,
    diglotWords: 0,
    allBlueKeys: [],
  };
  public totalKnownCount = 0;
  public diglotActive = false;
  public todayStats: IslandTodayStats = { wordsMarkedKnown: 0, frequentMarkedKnown: 0, wordsRead: 0, secondsListened: 0 };

  constructor(
    private shadow: ShadowRoot,
    public settings: VerbaSettings,
    private callbacks: {
      onKnowAll: () => void;
      onOpenReader: () => void;
      onSwitchLanguage: (lang: LangCode) => void;
      onToggleDiglot?: () => void;
    }
  ) {
    this.el = document.createElement('div');
    this.el.className = 'verba-island';
    this.el.setAttribute('part', 'island');

    this.tallyEl = document.createElement('div');
    this.tallyEl.className = 'island-tally-drawer';
    this.tallyEl.hidden = true;

    this.switchNoteEl = document.createElement('div');
    this.switchNoteEl.className = 'auto-switch-note';
    this.switchNoteEl.hidden = true;

    this.shadow.appendChild(this.switchNoteEl);
    this.shadow.appendChild(this.tallyEl);
    this.shadow.appendChild(this.el);
    this.render();
  }

  public showAutoSwitchNote(fromLang: LangCode, toLang: LangCode): void {
    const toName = LANG_MAP[toLang]?.name || toLang;
    const fromName = LANG_MAP[fromLang]?.name || fromLang;
    this.switchNoteEl.hidden = false;
    this.switchNoteEl.innerHTML = `
      <span>Switched to <b>${toName}</b></span>
      <button type="button" class="island-btn" id="verba-switch-back">Back to ${fromName}</button>
    `;
    this.switchNoteEl.querySelector('#verba-switch-back')?.addEventListener('click', () => {
      this.switchNoteEl.hidden = true;
      this.callbacks.onSwitchLanguage(fromLang);
    });
    window.setTimeout(() => {
      this.switchNoteEl.hidden = true;
    }, 9000);
  }

  public update(params: {
    settings?: VerbaSettings;
    counts?: PageWordCounts;
    totalKnownCount?: number;
    diglotActive?: boolean;
    todayStats?: IslandTodayStats;
  }): void {
    if (params.settings) this.settings = params.settings;
    if (params.counts) this.counts = params.counts;
    if (params.totalKnownCount !== undefined) this.totalKnownCount = params.totalKnownCount;
    if (params.diglotActive !== undefined) this.diglotActive = params.diglotActive;
    if (params.todayStats) this.todayStats = params.todayStats;
    this.render();
  }

  public render(): void {
    this.el.hidden = !this.settings.showPageCounter;
    if (this.el.hidden) {
      this.tallyEl.hidden = true;
      return;
    }

    const langBadgeHtml = this.settings.languageSwitcherOnPage
      ? `<select id="island-lang-select" title="Switch language" style="height:24px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--ink);font-size:11.5px;padding:0 6px;cursor:pointer;">
          ${this.settings.learningLangs
            .map(
              (code) =>
                `<option value="${code}" ${code === this.settings.activeLang ? 'selected' : ''}>${code.toUpperCase()}</option>`
            )
            .join('')}
        </select>`
      : '';

    const diglotStatHtml =
      this.diglotActive || this.counts.diglotWords > 0
        ? `<span class="island-stat" title="Target-language words woven into this page"><i class="island-dot diglot"></i><b id="island-diglot-count">${this.counts.diglotWords}</b> woven</span>`
        : '';

    this.el.innerHTML = `
      <button type="button" class="island-btn" id="island-tally-toggle" title="Today's tally">${
        this.tallyOpen ? '▾' : '▴'
      }</button>
      ${langBadgeHtml}
      <button type="button" class="island-btn" id="island-reader-btn" title="Reader View (Shift+L)">📖</button>
      <button type="button" class="island-btn ${
        this.diglotActive ? 'active' : ''
      }" id="island-diglot-btn" title="Toggle Inline Word Replacement / Diglot Weave (${
        this.settings.readingKeymap.toggleDiglot || 'Shift+W'
      })">⇄</button>
      ${diglotStatHtml}
      <span class="island-stat" title="New words on this page"><i class="island-dot new"></i><b id="island-new-count">${
        this.counts.newWords
      }</b> new</span>
      <span class="island-stat" title="Learning words on this page"><i class="island-dot learn"></i><b id="island-learn-count">${
        this.counts.learningWords
      }</b> learning</span>
      <span class="island-stat" title="Total known vocabulary in ${
        LANG_MAP[this.settings.activeLang]?.name || this.settings.activeLang
      }">Vocabulary <b id="island-vocab-count">${this.totalKnownCount.toLocaleString()}</b></span>
      <button type="button" class="island-btn" id="island-know-all" title="Mark all new words on this page known (Shift+K)">Know all</button>
    `;

    this.el.querySelector('#island-tally-toggle')?.addEventListener('click', () => {
      this.tallyOpen = !this.tallyOpen;
      this.render();
    });

    this.el.querySelector('#island-reader-btn')?.addEventListener('click', () => {
      this.callbacks.onOpenReader();
    });

    this.el.querySelector('#island-diglot-btn')?.addEventListener('click', () => {
      this.callbacks.onToggleDiglot?.();
    });

    this.el.querySelector('#island-know-all')?.addEventListener('click', () => {
      this.callbacks.onKnowAll();
    });

    this.el.querySelector('#island-lang-select')?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value as LangCode;
      this.callbacks.onSwitchLanguage(val);
    });

    this.tallyEl.hidden = !this.tallyOpen;
    if (this.tallyOpen) {
      const mins = Math.round(this.todayStats.secondsListened / 60);
      this.tallyEl.innerHTML = `
        <div style="font-weight:600;color:var(--ink);margin-bottom:6px;">Today’s tally · ${
          LANG_MAP[this.settings.activeLang]?.name || this.settings.activeLang
        }</div>
        <div class="tally-row"><span>Marked known today</span><b>${this.todayStats.wordsMarkedKnown}</b></div>
        <div class="tally-row"><span>Frequent known today</span><b>${this.todayStats.frequentMarkedKnown}</b></div>
        <div class="tally-row"><span>Words read today</span><b>${this.todayStats.wordsRead.toLocaleString()}</b></div>
        <div class="tally-row"><span>Listening today</span><b>${mins} min</b></div>
      `;
    }
  }
}
