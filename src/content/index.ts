import type {
  BundledDictionary,
  LangCode,
  VerbaSettings,
  WordRecord,
  WordStatus,
} from '../shared/types';
import { buildLangIndex, type LoadedLangIndex } from '../shared/dictionary';
import { getLangOptionsFromSettings } from '../shared/db';
import { LANG_MAP } from '../shared/languages';
import { sendBgMessage, type InitPagePayload } from '../shared/messaging';
import { getExtApi } from '../shared/webext';
import { speakText } from '../shared/tts';
import { SHADOW_UI_CSS } from './styles';
import { VerbaHighlighter } from './highlighter';
import { VerbaIsland, type IslandTodayStats } from './island';
import { VerbaWordPanel } from './word-panel';
import { VerbaReaderSuite } from './reader-view';
import { VerbaCaptions } from './captions';
import { VerbaGamepadController } from './controller';

export class VerbaPageRuntime {
  private hostEl!: HTMLElement;
  private shadow!: ShadowRoot;
  public highlighter!: VerbaHighlighter;
  public island!: VerbaIsland;
  public wordPanel!: VerbaWordPanel;
  public readerSuite!: VerbaReaderSuite;
  public captions!: VerbaCaptions;
  public gamepad!: VerbaGamepadController;

  public settings!: VerbaSettings;
  public dictIndex!: LoadedLangIndex;
  public hoveredWordEl: HTMLElement | null = null;
  private hoverTimer: number | null = null;
  private heldKeys = new Set<string>();
  private boundContainers = new WeakSet<EventTarget>();

  public async boot(): Promise<void> {
    // Do not run content script inside Verba's own extension pages (they instantiate their own dedicated views)
    if (/^(chrome|moz|safari-web)-extension:$/.test(location.protocol)) return;

    const sampleText = (document.body?.innerText || '').slice(0, 2500);
    const htmlLang = document.documentElement.lang || undefined;

    const init = await sendBgMessage<InitPagePayload>({
      type: 'GET_INIT_DATA',
      url: location.href,
      htmlLang,
      sampleText,
    });

    if (!init || !init.settings) return;
    this.settings = init.settings;

    this.listenToRuntimeMessages();
    if (!init.enabledOnThisPage) return;

    const rawDict = await sendBgMessage<BundledDictionary>({
      type: 'GET_DICTIONARY',
      lang: init.activeLang,
    });
    this.dictIndex = buildLangIndex(rawDict);

    this.mountShadowRoot();
    const langOpts = getLangOptionsFromSettings(this.settings, init.activeLang);

    this.highlighter = new VerbaHighlighter({
      lang: init.activeLang,
      settings: this.settings,
      langOpts,
      dictIndex: this.dictIndex,
      words: init.words,
      customDicts: init.customDicts,
      rootContainer: document.body,
      diglotMode: Boolean(init.diglotModeOnThisPage),
      onCountsChanged: (counts) => {
        this.island?.update({ counts, diglotActive: this.highlighter.diglotMode });
      },
    });

    this.island = new VerbaIsland(this.shadow, this.settings, {
      onKnowAll: () => this.markAllPageBlueKnown(),
      onOpenReader: () => this.readerSuite.toggleReaderView(),
      onSwitchLanguage: async (nextLang) => {
        await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { activeLang: nextLang } });
        location.reload();
      },
      onToggleDiglot: () => this.toggleDiglotOnPage(),
    });
    this.island.update({
      totalKnownCount: init.totalKnownCount,
      diglotActive: Boolean(init.diglotModeOnThisPage),
      todayStats: init.todayStats,
    });
    if (init.autoSwitchedFrom) {
      this.island.showAutoSwitchNote(init.autoSwitchedFrom, init.activeLang);
    }

    this.wordPanel = new VerbaWordPanel(this.shadow, this.settings, langOpts, {
      onGrade: async (word, status, extra) => {
        await this.gradeWord(word, status, extra);
      },
      onSplitCustomWord: async (word) => {
        await sendBgMessage({ type: 'SPLIT_CUSTOM_WORD', lang: this.settings.activeLang, word });
        await this.reloadWordsFromBackground(true);
      },
      onExtendSelection: (dir) => this.extendOpenWordSelection(dir),
      onOpenAskAiChat: (sent) => this.readerSuite.openAskAiModal(sent),
      onRevertDiglot: (el) => {
        this.highlighter.revertDiglotElement(el);
      },
      onClose: () => {
        if (this.readerSuite.isReadingAloud && this.readerSuite.isReadingPaused) {
          this.readerSuite.toggleReadAloud();
        }
        if (this.captions.videoEl?.paused && this.settings.pauseOnLookup) {
          this.captions.videoEl.play().catch(() => {});
        }
      },
    });

    this.readerSuite = new VerbaReaderSuite(
      this.shadow,
      this.highlighter,
      this.settings,
      langOpts,
      (container) => this.bindWordEventsInContainer(container)
    );

    this.captions = new VerbaCaptions(
      this.shadow,
      this.highlighter,
      this.settings,
      langOpts,
      (container) => this.bindWordEventsInContainer(container)
    );

    this.highlighter.injectStyles(document);
    this.highlighter.scanAndHighlight(document.body);
    this.highlighter.startMutationObserver();
    this.bindWordEventsInContainer(document.body);
    this.bindDragSelectionLookup();
    this.bindKeyboardShortcuts();

    this.captions.initPageVideoWatcher();

    this.gamepad = new VerbaGamepadController(this.settings, {
      stepWord: (dir) => this.stepNextStudyWord(dir),
      markOpenWordKnown: () => {
        const target = this.wordPanel.activeLookup?.query || this.hoveredWordEl?.dataset.w;
        if (target) {
          this.gradeWord(target, 5);
          this.wordPanel.close();
        }
      },
      closeOpenWord: () => this.wordPanel.close(),
      cycleOpenWordGrade: (st) => {
        if (this.wordPanel.activeLookup) this.gradeWord(this.wordPanel.activeLookup.query, st);
      },
      addOpenWordToAnki: () => this.wordPanel.sendCurrentToAnki(),
      videoLineStep: (dir) => this.captions.jumpRelativeLine(dir),
      videoTogglePlay: () => {
        const v = this.captions.videoEl;
        if (v) v.paused ? v.play().catch(() => {}) : v.pause();
      },
      scrollPage: (dy) => window.scrollBy({ top: dy, behavior: 'smooth' }),
    });
    this.gamepad.start();
  }

  private mountShadowRoot(): void {
    const existing = document.getElementById('verba-ui-root');
    if (existing) existing.remove();
    this.hostEl = document.createElement('div');
    this.hostEl.id = 'verba-ui-root';
    this.hostEl.dataset.verbaIgnore = '1';
    document.documentElement.appendChild(this.hostEl);
    this.shadow = this.hostEl.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = SHADOW_UI_CSS;
    this.shadow.appendChild(style);
  }

  public bindWordEventsInContainer(container: HTMLElement | Document): void {
    if (this.boundContainers.has(container)) return;
    this.boundContainers.add(container);
    container.addEventListener('mouseover', (e) => {
      const target = (e.target as Element | null)?.closest?.('verba-w') as HTMLElement | null;
      if (!target || target.closest('a, button, [role="link"], [role="button"]')) return;
      this.hoveredWordEl = target;
      if (this.wordPanel.isPinned) return;
      if (this.hoverTimer) window.clearTimeout(this.hoverTimer);
      this.hoverTimer = window.setTimeout(() => {
        if (this.hoveredWordEl === target && !this.wordPanel.isPinned) {
          this.openWordElement(target, false);
        }
      }, this.settings.hoverDelayMs);
    });

    container.addEventListener('mouseout', (e) => {
      const target = (e.target as Element | null)?.closest?.('verba-w') as HTMLElement | null;
      if (!target) return;
      const related = (e as MouseEvent).relatedTarget as Node | null;
      if (related && target.contains(related)) return;
      if (this.hoveredWordEl === target) this.hoveredWordEl = null;
      if (this.hoverTimer) window.clearTimeout(this.hoverTimer);
      if (!this.wordPanel.isPinned) {
        window.setTimeout(() => {
          if (!this.hoveredWordEl && !this.wordPanel.isPinned) {
            this.wordPanel.close();
          }
        }, 120);
      }
    });

    container.addEventListener(
      'click',
      async (e) => {
        const me = e as MouseEvent;
        if (me.ctrlKey || me.metaKey) return; // Never intercept Ctrl+click open-in-new-tab!
        if ((e.target as Element | null)?.closest?.('a, button, [role="link"], [role="button"]')) {
          return; // Always ignore words inside links or buttons
        }
        const target = (e.target as Element | null)?.closest?.('verba-w') as HTMLElement | null;
        if (!target) {
          if (this.wordPanel.isPinned && e.target !== this.hostEl) {
            this.wordPanel.close();
          }
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        if (this.hoverTimer) {
          window.clearTimeout(this.hoverTimer);
          this.hoverTimer = null;
        }

        // Pause Read Aloud or Video if active
        if (this.readerSuite.isReadingAloud && !this.readerSuite.isReadingPaused) {
          this.readerSuite.pauseReadAloud();
        }
        if (this.captions.videoEl && !this.captions.videoEl.paused) {
          if (this.settings.pauseOnLookup) {
            this.captions.videoEl.pause();
          } else if (this.captions.activeCueIdx >= 0) {
            this.captions.pauseAtEndOfCueIdx = this.captions.activeCueIdx;
          }
        }

        // Clicking a blue (New) word starts learning it at level 1 when enabled!
        if (target.dataset.s === '0' && this.settings.clickNewStartsLearning) {
          await this.gradeWord(target.dataset.w || '', 1, {
            contextSentence: extractSurroundingSentence(target),
          });
        }

        await this.openWordElement(target, true);
        if (this.settings.sayWordOnOpen) {
          speakText(target.dataset.w || '', this.settings.activeLang, this.settings);
        }
      },
      true
    );
  }

  private async openWordElement(el: HTMLElement, pinned: boolean, runAi = false): Promise<void> {
    if (this.hoverTimer) {
      window.clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    if (this.wordPanel.activeElement && this.wordPanel.activeElement !== el) {
      delete this.wordPanel.activeElement.dataset.pinned;
    }
    if (pinned) el.dataset.pinned = '1';
    const sentence = extractSurroundingSentence(el);
    const paragraph = el.closest('p, li, blockquote, div')?.textContent?.trim() || sentence;
    await this.wordPanel.openForWord({
      query: el.dataset.w || el.textContent || '',
      lang: this.settings.activeLang,
      pinned,
      rect: el.getBoundingClientRect(),
      element: el,
      sentence,
      paragraph,
      lemmaHint: el.dataset.lemma,
      runAiImmediately: runAi,
    });
  }

  private bindDragSelectionLookup(): void {
    document.addEventListener('mouseup', () => {
      if (!this.settings.selectLookupEnabled) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const raw = sel.toString().trim();
      if (raw.length < 2 || raw.length > 300) return;
      const anchorNode = sel.anchorNode;
      if (anchorNode instanceof Element && anchorNode.closest('#verba-ui-root')) return;

      const meta = LANG_MAP[this.settings.activeLang];
      const wordsCount = raw.split(/\s+/).filter(Boolean).length;
      if (!meta?.spaceless && wordsCount === 1 && !raw.includes(' ')) return;

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const blockText = range.startContainer.parentElement?.textContent?.trim() || raw;
      this.wordPanel.openForWord({
        query: raw,
        lang: this.settings.activeLang,
        pinned: true,
        rect,
        sentence: blockText.slice(0, 300),
        paragraph: blockText,
        isSelectionPhrase: true,
      });
    });
  }

  private extendOpenWordSelection(dir: 'left_add' | 'left_trim' | 'right_trim' | 'right_add'): void {
    const lk = this.wordPanel.activeLookup;
    if (!lk) return;
    const cur = lk.query;
    const sent = this.wordPanel.contextSentence || cur;
    const pos = sent.indexOf(cur);
    let nextQuery = cur;

    const meta = LANG_MAP[this.settings.activeLang];
    if (meta?.spaceless) {
      if (dir === 'left_add' && pos > 0) nextQuery = sent[pos - 1] + cur;
      else if (dir === 'left_trim' && cur.length > 1) nextQuery = cur.slice(1);
      else if (dir === 'right_trim' && cur.length > 1) nextQuery = cur.slice(0, -1);
      else if (dir === 'right_add' && pos >= 0 && pos + cur.length < sent.length) {
        nextQuery = cur + sent[pos + cur.length];
      }
    } else {
      const tokens = sent.split(/\s+/).filter(Boolean);
      const curTokens = cur.split(/\s+/).filter(Boolean);
      const startIdx = tokens.findIndex((_, i) => tokens.slice(i, i + curTokens.length).join(' ') === curTokens.join(' '));
      if (dir === 'left_add' && startIdx > 0) nextQuery = [tokens[startIdx - 1], ...curTokens].join(' ');
      else if (dir === 'left_trim' && curTokens.length > 1) nextQuery = curTokens.slice(1).join(' ');
      else if (dir === 'right_trim' && curTokens.length > 1) nextQuery = curTokens.slice(0, -1).join(' ');
      else if (dir === 'right_add' && startIdx >= 0 && startIdx + curTokens.length < tokens.length) {
        nextQuery = [...curTokens, tokens[startIdx + curTokens.length]].join(' ');
      }
    }

    if (nextQuery && nextQuery !== cur && this.wordPanel.anchorRect) {
      this.wordPanel.openForWord({
        query: nextQuery,
        lang: this.settings.activeLang,
        pinned: true,
        rect: this.wordPanel.anchorRect,
        element: this.wordPanel.activeElement,
        sentence: sent,
        paragraph: this.wordPanel.fullParagraphText,
        isSelectionPhrase: true,
      });
    }
  }

  public async gradeWord(
    word: string,
    status: WordStatus,
    extra?: {
      isPhrase?: boolean;
      isCustomSegment?: boolean;
      customMeaning?: string;
      aiMeaning?: string;
      lemmaOverride?: string;
      contextSentence?: string;
    }
  ): Promise<void> {
    const meta = LANG_MAP[this.settings.activeLang];
    const isCustomSeg =
      extra?.isCustomSegment ??
      Boolean(meta?.spaceless && word.length >= 2 && !this.dictIndex.lexiconSet.has(word));
    const isPhrase = extra?.isPhrase ?? (/\s/.test(word) && this.settings.activeLang !== 'vi');

    const res = await sendBgMessage<{
      ok: boolean;
      record?: WordRecord | null;
      totalKnownCount?: number;
      todayStats?: IslandTodayStats;
      limitReached?: boolean;
      message?: string;
    }>({
      type: 'GRADE_WORD',
      lang: this.settings.activeLang,
      word,
      status,
      isPhrase,
      isCustomSegment: isCustomSeg,
      ...extra,
    });

    if (res.limitReached && res.message) {
      this.captions.showNote(res.message);
      return;
    }

    await this.reloadWordsFromBackground(isCustomSeg || isPhrase);
    if (res.totalKnownCount !== undefined || res.todayStats) {
      this.island.update({
        totalKnownCount: res.totalKnownCount,
        todayStats: res.todayStats,
      });
    }
  }

  private async markAllPageBlueKnown(): Promise<void> {
    const { allBlueKeys } = this.highlighter.getCounts();
    if (allBlueKeys.length === 0) return;
    const res = await sendBgMessage<{
      ok: boolean;
      markedCount: number;
      totalKnownCount: number;
      todayStats: IslandTodayStats;
    }>({
      type: 'BATCH_MARK_KNOWN',
      lang: this.settings.activeLang,
      words: allBlueKeys,
      source: 'manual',
    });
    if (res.ok) {
      await this.reloadWordsFromBackground(false);
      this.island.update({
        totalKnownCount: res.totalKnownCount,
        todayStats: res.todayStats,
      });
    }
  }

  private stepNextStudyWord(dir: 1 | -1): void {
    const rtl = Boolean(LANG_MAP[this.settings.activeLang]?.rtl);
    const effectiveDir = rtl ? (-dir as 1 | -1) : dir;

    const scopeRoot = this.readerSuite.isSentenceModeOpen
      ? this.shadow
      : this.readerSuite.isReaderOpen
      ? this.shadow
      : document.body;

    const allWords = Array.from(scopeRoot.querySelectorAll<HTMLElement>('verba-w')).filter((el) => {
      const s = el.dataset.s;
      return s === '0' || s === '1' || s === '2' || s === '3' || s === '4';
    });
    if (allWords.length === 0) return;

    const curIdx = this.wordPanel.activeElement ? allWords.indexOf(this.wordPanel.activeElement) : -1;
    const nextIdx =
      curIdx === -1
        ? effectiveDir === 1
          ? 0
          : allWords.length - 1
        : (curIdx + effectiveDir + allWords.length) % allWords.length;

    const target = allWords[nextIdx];
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    this.openWordElement(target, true);
    if (this.settings.sayWordOnOpen && this.settings.sayWordOnArrow) {
      speakText(target.dataset.w || '', this.settings.activeLang, this.settings);
    }
  }

  private bindKeyboardShortcuts(): void {
    window.addEventListener('keyup', (e) => {
      this.heldKeys.delete(e.key.toLowerCase());
    });

    window.addEventListener('keydown', async (e) => {
      // Step aside whenever typing in an input, textarea, or chatbot composer!
      const path = e.composedPath();
      const inEditable = path.some(
        (n) =>
          n instanceof HTMLElement &&
          (n.tagName === 'INPUT' ||
            n.tagName === 'TEXTAREA' ||
            n.tagName === 'SELECT' ||
            n.isContentEditable)
      );
      if (inEditable) return;

      this.heldKeys.add(e.key.toLowerCase());
      const combo = formatKeyCombo(e);
      const rk = this.settings.readingKeymap;
      const vk = this.settings.videoKeymap;

      // Esc handling
      if (e.key === 'Escape') {
        if (this.wordPanel.isOpen) {
          e.preventDefault();
          this.wordPanel.close();
          return;
        }
        if (this.readerSuite.isSentenceModeOpen) {
          e.preventDefault();
          this.readerSuite.closeSentenceBySentence();
          return;
        }
        if (this.readerSuite.isReaderOpen) {
          e.preventDefault();
          this.readerSuite.closeReaderView();
          return;
        }
        if (this.readerSuite.isReadingAloud) {
          e.preventDefault();
          this.readerSuite.stopReadAloud();
          return;
        }
      }

      // Anki picker number shortcuts 1..9 when Shift+P picker is open
      if (this.wordPanel.isOpen && /^[1-9]$/.test(e.key) && this.wordPanel.tickAnkiMeaningByNumber(Number(e.key))) {
        e.preventDefault();
        return;
      }

      // Word Grading Keys (act on pinned word, or hovered word if gradeByHovering is on)
      const targetWord =
        this.wordPanel.isPinned && this.wordPanel.activeLookup
          ? this.wordPanel.activeLookup.query
          : this.settings.gradeByHovering && this.hoveredWordEl
          ? this.hoveredWordEl.dataset.w || ''
          : '';

      const gradeMap: [string, WordStatus][] = [
        [rk.grade1, 1],
        [rk.grade2, 2],
        [rk.grade3, 3],
        [rk.grade4, 4],
        [rk.known, 5],
        [rk.ignore, -1],
        [rk.resetNew, 0],
      ];
      for (const [boundKey, statusVal] of gradeMap) {
        if (boundKey && matchCombo(combo, boundKey) && targetWord) {
          e.preventDefault();
          if (this.hoverTimer) {
            window.clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
          }
          if (statusVal === 5 || statusVal === -1 || statusVal === 0) {
            this.wordPanel.close();
          }
          await this.gradeWord(targetWord, statusVal);
          return;
        }
      }

      // Sentence-by-sentence navigation keys
      if (this.readerSuite.isSentenceModeOpen) {
        if (e.key.toLowerCase() === 'd' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          this.readerSuite.stepSentence(1);
          return;
        }
        if (e.key.toLowerCase() === 'a' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          this.readerSuite.stepSentence(-1);
          return;
        }
        if (e.key.toLowerCase() === 'e' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          this.readerSuite.toggleSentenceTranslation();
          return;
        }
        if (e.key === ' ') {
          e.preventDefault();
          this.readerSuite.toggleReadAloud();
          return;
        }
      }

      // Video Dual Captions shortcuts when video has cues
      const videoActive = Boolean(this.captions.videoEl && this.captions.cues.length > 0);
      if (videoActive && matchCombo(combo, vk.toggleCaptions)) {
        e.preventDefault();
        this.captions.toggleEnabled();
        return;
      }
      if (videoActive && this.settings.captionsEnabled) {
        if (this.heldKeys.has('a') && this.heldKeys.has('d')) {
          e.preventDefault();
          this.captions.replayCurrentLine(true);
          return;
        }
        if (matchCombo(combo, vk.prevLine)) {
          e.preventDefault();
          this.captions.jumpRelativeLine(-1);
          return;
        }
        if (matchCombo(combo, vk.replayLine)) {
          e.preventDefault();
          this.captions.replayCurrentLine(false);
          return;
        }
        if (matchCombo(combo, vk.nextLine)) {
          e.preventDefault();
          this.captions.jumpRelativeLine(1);
          return;
        }
        if (matchCombo(combo, vk.autoPause)) {
          e.preventDefault();
          this.captions.toggleAutoPause();
          return;
        }
        if (matchCombo(combo, vk.peekForward) || matchCombo(combo, vk.peekBackward)) {
          e.preventDefault();
          this.captions.peekLayers();
          return;
        }
        if (matchCombo(combo, vk.hideKnownLines)) {
          e.preventDefault();
          this.captions.toggleHideKnownLines();
          return;
        }
        if (matchCombo(combo, vk.cycleBandFilter)) {
          e.preventDefault();
          this.captions.cycleBandFilter();
          return;
        }
        if (matchCombo(combo, vk.wordsInVideo)) {
          e.preventDefault();
          this.captions.toggleWordsOrTranscriptDrawer('words');
          return;
        }
        if (e.ctrlKey && e.key === '.') {
          e.preventDefault();
          this.captions.snapSubtitleToNow(1);
          return;
        }
        if (e.ctrlKey && e.key === ',') {
          e.preventDefault();
          this.captions.snapSubtitleToNow(-1);
          return;
        }
        if (matchCombo(combo, vk.subEarlier)) {
          e.preventDefault();
          this.captions.adjustSubtitleTiming(-0.25);
          return;
        }
        if (matchCombo(combo, vk.subLater)) {
          e.preventDefault();
          this.captions.adjustSubtitleTiming(0.25);
          return;
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'c' && !window.getSelection()?.toString()) {
          const cue = this.captions.cues[this.captions.activeCueIdx];
          if (cue) {
            e.preventDefault();
            navigator.clipboard?.writeText(cue.text).catch(() => {});
            this.captions.showNote('Copied subtitle line');
            return;
          }
        }
        if (matchCombo(combo, vk.hopCommonDown)) {
          e.preventDefault();
          this.captions.hopMostCommonVideoWords(1);
          return;
        }
        if (matchCombo(combo, vk.hopCommonUp)) {
          e.preventDefault();
          this.captions.hopMostCommonVideoWords(-1);
          return;
        }
        if (matchCombo(combo, vk.nextFreqLine)) {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(true, 1);
          return;
        }
        if (matchCombo(combo, vk.prevFreqLine)) {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(true, -1);
          return;
        }
        if (matchCombo(combo, vk.nextUnknownLine)) {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(false, 1);
          return;
        }
        if (matchCombo(combo, vk.prevUnknownLine)) {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(false, -1);
          return;
        }
        if (matchCombo(combo, vk.markLineKnown)) {
          e.preventDefault();
          this.captions.markCurrentLineKnown();
          return;
        }
      }

      // Open-word & Hover actions
      if (matchCombo(combo, rk.aiCheck)) {
        const el = this.wordPanel.activeElement || this.hoveredWordEl;
        if (el) {
          e.preventDefault();
          await this.openWordElement(el, true, true);
          return;
        }
      }

      if (this.wordPanel.isOpen && this.wordPanel.activeLookup) {
        if (matchCombo(combo, rk.speakWord)) {
          e.preventDefault();
          speakText(this.wordPanel.activeLookup.query, this.settings.activeLang, this.settings);
          return;
        }
        if (matchCombo(combo, rk.speakSentence)) {
          e.preventDefault();
          speakText(
            this.wordPanel.contextSentence || this.wordPanel.activeLookup.query,
            this.settings.activeLang,
            this.settings
          );
          return;
        }
        if (matchCombo(combo, rk.customMeaning)) {
          e.preventDefault();
          this.wordPanel.openCustomMeaningEditor();
          return;
        }
        if (matchCombo(combo, rk.googleTranslate)) {
          e.preventDefault();
          this.wordPanel.triggerGoogleTranslate();
          return;
        }
        if (matchCombo(combo, rk.dictLink)) {
          e.preventDefault();
          this.wordPanel.openFirstDictionaryLink();
          return;
        }
        if (matchCombo(combo, rk.charactersTab)) {
          e.preventDefault();
          this.wordPanel.toggleCharactersTab();
          return;
        }
        if (matchCombo(combo, rk.nextEntry)) {
          e.preventDefault();
          this.wordPanel.stepEntry(1);
          return;
        }
        if (matchCombo(combo, rk.prevEntry)) {
          e.preventDefault();
          this.wordPanel.stepEntry(-1);
          return;
        }
        if (matchCombo(combo, rk.listEntries)) {
          e.preventDefault();
          this.wordPanel.toggleListAllEntries();
          return;
        }
        if (matchCombo(combo, rk.ankiAdd)) {
          e.preventDefault();
          this.wordPanel.sendCurrentToAnki();
          return;
        }
        if (matchCombo(combo, rk.ankiPick)) {
          e.preventDefault();
          this.wordPanel.openAnkiMeaningPicker();
          return;
        }
        if (matchCombo(combo, rk.openKnownUp)) {
          e.preventDefault();
          await this.gradeWord(this.wordPanel.activeLookup.query, 5);
          this.wordPanel.close();
          return;
        }
        if (matchCombo(combo, rk.closeDown)) {
          e.preventDefault();
          this.wordPanel.close();
          return;
        }
      } else if (this.hoveredWordEl && matchCombo(combo, rk.ankiAdd)) {
        e.preventDefault();
        await this.openWordElement(this.hoveredWordEl, true);
        this.wordPanel.sendCurrentToAnki();
        return;
      }

      // Word hopping arrows (→ / ←)
      if (matchCombo(combo, rk.nextWord) && (this.wordPanel.isOpen || this.readerSuite.isReaderOpen || this.readerSuite.isSentenceModeOpen)) {
        e.preventDefault();
        this.stepNextStudyWord(1);
        return;
      }
      if (matchCombo(combo, rk.prevWord) && (this.wordPanel.isOpen || this.readerSuite.isReaderOpen || this.readerSuite.isSentenceModeOpen)) {
        e.preventDefault();
        this.stepNextStudyWord(-1);
        return;
      }

      // Page-wide Shift shortcuts
      if (matchCombo(combo, rk.openReaderView)) {
        e.preventDefault();
        this.readerSuite.toggleReaderView();
        return;
      }
      if (matchCombo(combo, rk.sentenceMode)) {
        e.preventDefault();
        if (!this.readerSuite.isReaderOpen && !this.readerSuite.isSentenceModeOpen) {
          await this.readerSuite.toggleReaderView();
        }
        this.readerSuite.openSentenceBySentence();
        return;
      }
      if (matchCombo(combo, rk.readAloud)) {
        e.preventDefault();
        this.readerSuite.toggleReadAloud();
        return;
      }
      if (matchCombo(combo, rk.toggleHighlights)) {
        e.preventDefault();
        this.settings = await sendBgMessage({
          type: 'SAVE_SETTINGS',
          patch: { highlightWords: !this.settings.highlightWords },
        });
        this.highlighter.settings = this.settings;
        this.highlighter.injectStyles();
        this.readerSuite.syncStyles(this.settings, getLangOptionsFromSettings(this.settings, this.settings.activeLang));
        return;
      }
      if (matchCombo(combo, rk.markPageKnown)) {
        e.preventDefault();
        this.markAllPageBlueKnown();
        return;
      }
      if (matchCombo(combo, rk.askAiChat)) {
        e.preventDefault();
        const sent =
          this.wordPanel.contextSentence ||
          this.captions.cues[this.captions.activeCueIdx]?.text ||
          (this.hoveredWordEl ? extractSurroundingSentence(this.hoveredWordEl) : '');
        this.readerSuite.openAskAiModal(sent);
        return;
      }
      if (matchCombo(combo, rk.nextFreqSentence)) {
        e.preventDefault();
        this.readerSuite.jumpSentenceByUnknown(true, 1);
        return;
      }
      if (matchCombo(combo, rk.prevFreqSentence)) {
        e.preventDefault();
        this.readerSuite.jumpSentenceByUnknown(true, -1);
        return;
      }
      if (matchCombo(combo, rk.nextUnknownSentence)) {
        e.preventDefault();
        this.readerSuite.jumpSentenceByUnknown(false, 1);
        return;
      }
      if (matchCombo(combo, rk.prevUnknownSentence)) {
        e.preventDefault();
        this.readerSuite.jumpSentenceByUnknown(false, -1);
        return;
      }
      if (matchCombo(combo, rk.toggleDiglot)) {
        e.preventDefault();
        this.toggleDiglotOnPage();
        return;
      }
    });
  }

  public toggleDiglotOnPage(forceState?: boolean): void {
    if (!this.highlighter) return;
    this.wordPanel?.close();
    const active = this.highlighter.toggleDiglotMode(forceState);
    this.island?.update({
      diglotActive: active,
      counts: this.highlighter.getCounts(),
    });
  }

  private async reloadWordsFromBackground(resegment: boolean): Promise<void> {
    const init = await sendBgMessage<InitPagePayload>({
      type: 'GET_INIT_DATA',
      url: location.href,
    });
    if (!init || !this.highlighter) return;
    this.highlighter.setWords(init.words);
    this.highlighter.customDicts = init.customDicts;
    this.highlighter.refreshAllStatuses(resegment);

    // Also refresh open Reader View or Sentence-by-Sentence card inside shadow DOM if open
    if (this.readerSuite?.isReaderOpen || this.readerSuite?.isSentenceModeOpen) {
      this.shadow.querySelectorAll<HTMLElement>('verba-w').forEach((el) => {
        const surface = el.dataset.w || el.textContent || '';
        const key = el.dataset.key || surface;
        const { statusAttr } = this.highlighter.computeStatusAttr(key, surface, el.dataset.lemma);
        el.dataset.s = statusAttr;
      });
    }
  }

  private listenToRuntimeMessages(): void {
    getExtApi()?.runtime?.onMessage?.addListener((msg: any) => {
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'VERBA_TRIGGER_READER') {
        this.readerSuite?.toggleReaderView();
      } else if (msg.type === 'VERBA_TRIGGER_READ_ALOUD') {
        this.readerSuite?.toggleReadAloud();
      } else if (msg.type === 'VERBA_TRIGGER_DIGLOT') {
        this.toggleDiglotOnPage();
      } else if (msg.type === 'VERBA_WORD_UPDATED' || msg.type === 'VERBA_WORDS_REFRESH') {
        this.reloadWordsFromBackground(false);
        if (msg.totalKnownCount !== undefined || msg.todayStats) {
          this.island?.update({
            totalKnownCount: msg.totalKnownCount,
            todayStats: msg.todayStats,
          });
        }
      } else if (msg.type === 'VERBA_SETTINGS_UPDATED' && msg.settings) {
        this.settings = msg.settings as VerbaSettings;
        if (this.highlighter) {
          this.highlighter.settings = this.settings;
          this.highlighter.langOpts = getLangOptionsFromSettings(this.settings, this.settings.activeLang);
          this.highlighter.refreshAllStatuses(false);
          this.island?.update({ settings: this.settings });
          this.readerSuite?.syncStyles(this.settings, this.highlighter.langOpts);
        }
      }
    });
  }
}

function extractSurroundingSentence(el: HTMLElement): string {
  const block = el.closest('p, li, blockquote, h1, h2, h3, td, div');
  const full = (block?.textContent || el.textContent || '').replace(/\s+/g, ' ').trim();
  if (full.length <= 240) return full;
  const word = el.dataset.w || el.textContent || '';
  const idx = full.indexOf(word);
  if (idx === -1) return full.slice(0, 240);
  const parts = full.split(/(?<=[.!?。！？])\s+/);
  let pos = 0;
  for (const s of parts) {
    if (pos + s.length >= idx) return s.slice(0, 300);
    pos += s.length + 1;
  }
  return full.slice(Math.max(0, idx - 100), idx + 140);
}

export function formatKeyCombo(e: KeyboardEvent): string {
  const mods: string[] = [];
  if (e.ctrlKey) mods.push('Ctrl');
  if (e.altKey) mods.push('Alt');
  if (e.shiftKey && e.key !== 'Shift' && e.key.length === 1) mods.push('Shift');
  else if (e.shiftKey && e.key.startsWith('Arrow')) mods.push('Shift');

  const keyName = e.key.length === 1 ? (mods.length ? e.key.toUpperCase() : e.key.toLowerCase()) : e.key;
  return [...mods, keyName].join('+');
}

export function matchCombo(pressed: string, bound: string): boolean {
  if (!bound) return false;
  return pressed.toLowerCase() === bound.toLowerCase();
}

// Boot on open web pages
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const runtime = new VerbaPageRuntime();
  runtime.boot().catch((err) => console.warn('Verba content boot error:', err));
}
