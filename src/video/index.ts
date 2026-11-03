import type {
  BundledDictionary,
  CustomDictionaryMeta,
  LangCode,
  VerbaSettings,
  SubtitleCue,
  VideoHistoryItem,
  WordRecord,
  WordStatus,
} from '../shared/types';
import {
  getCustomDictsByLang,
  getLangOptionsFromSettings,
  getVideosByLang,
  getWordsByLang,
  putVideoHistory,
} from '../shared/db';
import { buildLangIndex, type LoadedLangIndex } from '../shared/dictionary';
import { parseSubtitleFile } from '../shared/imports';
import { LANG_MAP } from '../shared/languages';
import { sendBgMessage } from '../shared/messaging';
import { getExtApi, getExtensionUrl } from '../shared/webext';
import { speakText } from '../shared/tts';
import { setHtmlContent } from '../shared/dom';
import { SHADOW_UI_CSS } from '../content/styles';
import { VerbaHighlighter } from '../content/highlighter';
import { VerbaWordPanel } from '../content/word-panel';
import { VerbaReaderSuite } from '../content/reader-view';
import { VerbaCaptions } from '../content/captions';

/**
 * Generates a real seekable silent WAV audio blob (28 seconds) so `<video>` in local/demo mode
 * has a genuine browser media timeline (`currentTime` 0..28s, play, pause, seek) without needing external network!
 */
function buildSeekableSilentWavUrl(durationSec = 28): string {
  const sampleRate = 8000;
  const numSamples = sampleRate * durationSec;
  const buffer = new ArrayBuffer(44 + numSamples);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // format = 1
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true); // 8-bit unsigned PCM
  writeStr(36, 'data');
  view.setUint32(40, numSamples, true);
  new Uint8Array(buffer, 44).fill(128); // silence in 8-bit unsigned PCM

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

class VerbaLocalVideoApp {
  private rootEl = document.getElementById('video-app')!;
  private vidInput = document.getElementById('vid-file-input') as HTMLInputElement;
  private subInput = document.getElementById('sub-primary-input') as HTMLInputElement;
  private transInput = document.getElementById('sub-trans-input') as HTMLInputElement;

  private shadowHost!: HTMLElement;
  private shadow!: ShadowRoot;
  private highlighter!: VerbaHighlighter;
  private wordPanel!: VerbaWordPanel;
  private readerSuite!: VerbaReaderSuite;
  private captions!: VerbaCaptions;

  private settings!: VerbaSettings;
  private dictIndex!: LoadedLangIndex;
  private words: WordRecord[] = [];
  private customDicts: CustomDictionaryMeta[] = [];
  private history: VideoHistoryItem[] = [];

  private currentTitle = 'No video loaded';
  private hasVideoLoaded = false;
  private hoveredWordEl: HTMLElement | null = null;
  private hoverTimer: number | null = null;
  private boundContainers = new WeakSet<EventTarget>();

  public async init(): Promise<void> {
    this.mountShadowRoot();
    await this.reloadState();
    this.render();
    this.bindInputsAndShortcuts();

    const params = new URLSearchParams(location.search);
    if (params.get('demo') === '1') {
      await this.loadBuiltInDemo();
    }
  }

  private mountShadowRoot(): void {
    this.shadowHost = document.createElement('div');
    this.shadowHost.id = 'verba-ui-root';
    this.shadowHost.dataset.verbaIgnore = '1';
    document.documentElement.appendChild(this.shadowHost);
    this.shadow = this.shadowHost.attachShadow({ mode: 'open' });
    const st = document.createElement('style');
    st.textContent = SHADOW_UI_CSS;
    this.shadow.appendChild(st);
  }

  private async reloadState(): Promise<void> {
    this.settings = await sendBgMessage<VerbaSettings>({ type: 'GET_SETTINGS' });
    applyTheme(this.settings.theme);

    const lang = this.settings.activeLang;
    const rawDict = await sendBgMessage<BundledDictionary>({ type: 'GET_DICTIONARY', lang });
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
      isBookOrReader: true,
    });
    this.highlighter.injectStyles(document);
    this.highlighter.injectStyles(this.shadow);

    if (!this.wordPanel) {
      this.wordPanel = new VerbaWordPanel(this.shadow, this.settings, langOpts, {
        onGrade: async (word, status, extra) => {
          await this.gradeWord(word, status, extra);
        },
        onSplitCustomWord: async (word) => {
          await sendBgMessage({ type: 'SPLIT_CUSTOM_WORD', lang: this.settings.activeLang, word });
          await this.refreshVocabulary();
        },
        onExtendSelection: () => {},
        onOpenAskAiChat: (sent) => this.readerSuite.openAskAiModal(sent),
        onClose: () => {
          const v = this.captions.videoEl;
          if (v?.paused && this.settings.pauseOnLookup) {
            v.play().catch(() => {});
          }
        },
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

  private async refreshVocabulary(): Promise<void> {
    this.words = await getWordsByLang(this.settings.activeLang);
    this.highlighter.setWords(this.words);
    await this.captions.renderActiveSubtitle();
  }

  private async gradeWord(
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
    await sendBgMessage({
      type: 'GRADE_WORD',
      lang: this.settings.activeLang,
      word,
      status,
      ...extra,
    });
    await this.refreshVocabulary();
    if (status === 5 && this.settings.autoResumeOnKnown && this.captions.videoEl?.paused) {
      this.captions.videoEl.play().catch(() => {});
    }
  }

  public render(): void {
    const lang = this.settings.activeLang;
    const langOptsHtml = this.settings.learningLangs
      .map((c) => `<option value="${c}" ${c === lang ? 'selected' : ''}>${esc(LANG_MAP[c]?.name || c)}</option>`)
      .join('');

    setHtmlContent(
      this.rootEl,
      `
      <header class="topbar">
        <div class="topbar-left">
          <a href="dashboard.html" class="brand">
            <span class="brand-dot"></span>
            <span>Verba</span>
          </a>
          <a href="dashboard.html" class="btn btn-ghost">← Dashboard</a>
          <span id="vid-title-label" style="color:var(--ink-2);font-size:13px">${esc(this.currentTitle)}</span>
        </div>
        <div class="topbar-right">
          <button type="button" class="btn btn-primary" id="btn-open-vid">Open video file…</button>
          <button type="button" class="btn" id="btn-load-sub">Load subtitle (.srt/.vtt/.ass)</button>
          <button type="button" class="btn" id="btn-load-trans">Load translation sub</button>
          <button type="button" class="btn btn-amber" id="btn-load-demo">▶ Demo Video &amp; Subtitles</button>
          <button type="button" class="btn" id="btn-words-drawer" title="Transcript & Words in this video (W)">☰ Transcript &amp; Words</button>
          <select id="vid-lang-sel" class="select-input" aria-label="Language">
            ${langOptsHtml}
          </select>
        </div>
      </header>

      <main class="video-main">
        <div class="player-frame" id="player-dropzone">
          <video id="verba-local-video" controls playsinline></video>
          ${
            !this.hasVideoLoaded
              ? `
            <div class="empty-stage-overlay" id="empty-overlay">
              <div style="font-family:var(--serif);font-style:italic;font-size:24px;color:var(--ink)">
                Watch with Verba Dual Captions
              </div>
              <div style="max-width:480px;color:var(--ink-3);font-size:13.5px">
                Drop an MP4 / WebM / MKV video and .SRT / .VTT / .ASS subtitle files right onto this stage, or try the built-in Italian dialogue demo.
              </div>
              <div style="display:flex;gap:10px;margin-top:6px">
                <button type="button" class="btn btn-primary" id="overlay-open-vid">Choose video file…</button>
                <button type="button" class="btn btn-amber" id="overlay-demo-btn">▶ Try Italian Demo</button>
              </div>
            </div>
          `
              : ''
          }
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
          ${
            this.history.length === 0
              ? `<p style="color:var(--ink-3)">Your last 10 watched videos will appear here so you can resume right where you left off.</p>`
              : `<div class="history-grid">
                ${this.history
                  .map(
                    (h) => `
                  <div class="history-card">
                    <div class="history-card-title">${esc(h.title)}</div>
                    <div class="history-card-meta">
                      ${esc(h.source.toUpperCase())} · ${h.cues?.length || 0} cues
                    </div>
                    <div style="margin-top:6px">
                      <button type="button" class="btn btn-primary resume-vid-btn" data-vid-id="${esc(h.id)}">
                        Continue from ${formatMmSs(h.positionSec)}
                      </button>
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>`
          }
        </section>
      </main>
    `
    );

    const videoEl = document.getElementById('verba-local-video') as HTMLVideoElement;
    this.captions.attachToVideo(videoEl);

    videoEl.addEventListener('timeupdate', () => {
      if (!this.hasVideoLoaded || videoEl.currentTime < 1) return;
      if (Math.floor(videoEl.currentTime) % 5 === 0) {
        this.saveCurrentVideoHistory(videoEl);
      }
    });

    this.rootEl.querySelector('#btn-open-vid')?.addEventListener('click', () => this.vidInput.click());
    this.rootEl.querySelector('#overlay-open-vid')?.addEventListener('click', () => this.vidInput.click());
    this.rootEl.querySelector('#btn-load-sub')?.addEventListener('click', () => this.subInput.click());
    this.rootEl.querySelector('#btn-load-trans')?.addEventListener('click', () => this.transInput.click());
    this.rootEl.querySelector('#btn-load-demo')?.addEventListener('click', () => this.loadBuiltInDemo());
    this.rootEl.querySelector('#overlay-demo-btn')?.addEventListener('click', () => this.loadBuiltInDemo());
    this.rootEl.querySelector('#btn-words-drawer')?.addEventListener('click', () => {
      this.captions.toggleWordsOrTranscriptDrawer('words');
    });

    this.rootEl.querySelector('#vid-lang-sel')?.addEventListener('change', async (e) => {
      const nextLang = (e.target as HTMLSelectElement).value as LangCode;
      await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { activeLang: nextLang } });
      await this.reloadState();
      this.render();
    });

    this.rootEl.querySelectorAll<HTMLButtonElement>('.resume-vid-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const item = this.history.find((h) => h.id === btn.dataset.vidId);
        if (!item) return;
        if (item.id === 'demo_it_caffe') {
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

    const dropzone = document.getElementById('player-dropzone');
    dropzone?.addEventListener('dragover', (e) => e.preventDefault());
    dropzone?.addEventListener('drop', async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files || []);
      const vidFile = files.find((f) => /\.(mp4|webm|mkv|ogv|mov)$/i.test(f.name) || f.type.startsWith('video/'));
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

  private loadVideoFile(file: File): void {
    const videoEl = document.getElementById('verba-local-video') as HTMLVideoElement | null;
    if (!videoEl) return;
    this.hasVideoLoaded = true;
    this.currentTitle = file.name;
    document.getElementById('empty-overlay')?.remove();
    const lbl = document.getElementById('vid-title-label');
    if (lbl) lbl.textContent = file.name;

    videoEl.src = URL.createObjectURL(file);
    videoEl.play().catch(() => {});
    this.captions.renderPill();
  }

  private async loadBuiltInDemo(resumeSec = 0.6): Promise<void> {
    if (this.settings.activeLang !== 'it') {
      await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { activeLang: 'it' } });
      await this.reloadState();
      this.render();
    }

    const videoEl = document.getElementById('verba-local-video') as HTMLVideoElement | null;
    if (!videoEl) return;

    const [itRes, enRes] = await Promise.all([
      fetch(getExtensionUrl('samples/demo-it.srt')),
      fetch(getExtensionUrl('samples/demo-it-en.srt')),
    ]);
    const itCues: SubtitleCue[] = parseSubtitleFile(await itRes.text(), 'srt');
    const enCues: SubtitleCue[] = parseSubtitleFile(await enRes.text(), 'srt');
    this.captions.mergeTranslationsIntoCues(itCues, enCues);

    this.hasVideoLoaded = true;
    this.currentTitle = 'Un caffè a Firenze (Demo)';
    document.getElementById('empty-overlay')?.remove();
    const lbl = document.getElementById('vid-title-label');
    if (lbl) lbl.textContent = this.currentTitle;

    videoEl.poster =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#191918"/><stop offset="100%" stop-color="#28231c"/></linearGradient></defs><rect width="1280" height="720" fill="url(#g)"/><circle cx="640" cy="280" r="95" fill="#f7a800" fill-opacity="0.14"/><text x="640" y="290" text-anchor="middle" fill="#f2f0eb" font-family="Georgia,serif" font-style="italic" font-size="44">Un caffè a Firenze</text><text x="640" y="340" text-anchor="middle" fill="#9a9891" font-family="sans-serif" font-size="20">Verba Dual Captions Interactive Demo · Hover or click any Italian word below</text></svg>`
      );
    videoEl.src = buildSeekableSilentWavUrl(28);
    await new Promise<void>((resolve) => {
      videoEl.addEventListener('loadedmetadata', () => resolve(), { once: true });
    });

    this.captions.setCues(itCues);
    videoEl.currentTime = resumeSec;
    this.captions.renderPill();
    await this.captions.renderActiveSubtitle();
    await this.saveCurrentVideoHistory(videoEl, 'demo_it_caffe');
  }

  private async saveCurrentVideoHistory(videoEl: HTMLVideoElement, forcedId?: string): Promise<void> {
    const id = forcedId || `local:${this.settings.activeLang}:${this.currentTitle}`;
    const item: VideoHistoryItem = {
      id,
      lang: this.settings.activeLang,
      title: this.currentTitle,
      source: 'local',
      fileName: this.currentTitle,
      positionSec: Math.round(videoEl.currentTime),
      durationSec: Math.round(videoEl.duration || 0),
      subtitleOffsetSec: this.captions.subtitleOffsetSec,
      cues: this.captions.cues.slice(0, 500),
      updatedAt: Date.now(),
    };
    await putVideoHistory(item);
    this.history = (await getVideosByLang(this.settings.activeLang)).slice(0, 10);
  }

  private bindWordEvents(container: HTMLElement): void {
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
          this.openWordEl(target, false);
        }
      }, this.settings.hoverDelayMs);
    });

    container.addEventListener('mouseout', (e) => {
      const target = (e.target as Element | null)?.closest?.('verba-w') as HTMLElement | null;
      if (!target) return;
      if (this.hoveredWordEl === target) this.hoveredWordEl = null;
      if (this.hoverTimer) window.clearTimeout(this.hoverTimer);
      if (!this.wordPanel.isPinned) {
        window.setTimeout(() => {
          if (!this.hoveredWordEl && !this.wordPanel.isPinned) this.wordPanel.close();
        }, 120);
      }
    });

    container.addEventListener('click', async (e) => {
      if ((e.target as Element | null)?.closest?.('a, button, [role="link"], [role="button"]')) {
        return;
      }
      const target = (e.target as Element | null)?.closest?.('verba-w') as HTMLElement | null;
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
      const cueText = this.captions.cues[this.captions.activeCueIdx]?.text || '';
      if (target.dataset.s === '0' && this.settings.clickNewStartsLearning) {
        await this.gradeWord(target.dataset.w || '', 1, { contextSentence: cueText });
      }
      await this.openWordEl(target, true);
      if (this.settings.sayWordOnOpen) {
        speakText(target.dataset.w || '', this.settings.activeLang, this.settings);
      }
    });
  }

  private async openWordEl(el: HTMLElement, pinned: boolean): Promise<void> {
    if (this.hoverTimer) {
      window.clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    const cueText = this.captions.cues[this.captions.activeCueIdx]?.text || el.parentElement?.textContent || '';
    await this.wordPanel.openForWord({
      query: el.dataset.w || el.textContent || '',
      lang: this.settings.activeLang,
      pinned,
      rect: el.getBoundingClientRect(),
      element: el,
      sentence: cueText,
      paragraph: cueText,
      lemmaHint: el.dataset.lemma,
    });
  }

  private bindInputsAndShortcuts(): void {
    const ext = getExtApi();
    ext?.runtime?.onMessage?.addListener((msg: { type?: string; lang?: LangCode; settings?: VerbaSettings }) => {
      if (!msg?.type) return;
      if ((msg.type === 'VERBA_WORD_UPDATED' || msg.type === 'VERBA_WORDS_REFRESH') && (!msg.lang || msg.lang === this.settings.activeLang)) {
        this.refreshVocabulary().catch(() => {});
      } else if (msg.type === 'VERBA_SETTINGS_UPDATED' && msg.settings) {
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

    this.vidInput?.addEventListener('change', () => {
      const f = this.vidInput.files?.[0];
      this.vidInput.value = '';
      if (f) this.loadVideoFile(f);
    });

    this.subInput?.addEventListener('change', async () => {
      const f = this.subInput.files?.[0];
      this.subInput.value = '';
      if (!f) return;
      const cues = parseSubtitleFile(await f.text(), f.name);
      this.captions.setCues(cues);
      this.captions.showNote(`Loaded ${cues.length} subtitle lines`);
    });

    this.transInput?.addEventListener('change', async () => {
      const f = this.transInput.files?.[0];
      this.transInput.value = '';
      if (!f) return;
      const secondary = parseSubtitleFile(await f.text(), f.name);
      this.captions.mergeTranslationsIntoCues(this.captions.cues, secondary);
      await this.captions.renderActiveSubtitle();
      this.captions.showNote(`Merged ${secondary.length} translation lines`);
    });

    window.addEventListener('keydown', async (e) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Escape') {
        if (this.wordPanel.isOpen) {
          this.wordPanel.close();
          return;
        }
      }

      // Word grading keys if word panel open or hovering a subtitle word
      const activeWord =
        this.wordPanel.activeLookup?.query ||
        (this.settings.gradeByHovering ? this.hoveredWordEl?.dataset.w : undefined);

      if (activeWord && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const grades: Record<string, WordStatus> = { '1': 1, '2': 2, '3': 3, '4': 4, k: 5, x: -1, '0': 0 };
        const low = e.key.toLowerCase();
        if (low in grades) {
          e.preventDefault();
          if (this.hoverTimer) {
            window.clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
          }
          const st = grades[low];
          if (st === 5 || st === -1 || st === 0) this.wordPanel.close();
          await this.gradeWord(activeWord, st);
          return;
        }
      }

      const low = e.key.toLowerCase();
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (low === 'c') {
          e.preventDefault();
          await this.captions.toggleEnabled();
        } else if (low === 'a') {
          e.preventDefault();
          this.captions.jumpRelativeLine(-1);
        } else if (low === 's') {
          e.preventDefault();
          this.captions.replayCurrentLine();
        } else if (low === 'd') {
          e.preventDefault();
          this.captions.jumpRelativeLine(1);
        } else if (low === 'q') {
          e.preventDefault();
          await this.captions.toggleAutoPause();
        } else if (low === 'e') {
          e.preventDefault();
          this.captions.peekLayers();
        } else if (low === 'h') {
          e.preventDefault();
          await this.captions.toggleHideKnownLines();
        } else if (low === 'r') {
          e.preventDefault();
          await this.captions.cycleBandFilter();
        } else if (low === 'w') {
          e.preventDefault();
          this.captions.toggleWordsOrTranscriptDrawer('words');
        } else if (e.key === ',') {
          e.preventDefault();
          this.captions.adjustSubtitleTiming(-0.25);
        } else if (e.key === '.') {
          e.preventDefault();
          this.captions.adjustSubtitleTiming(0.25);
        } else if (e.key === ' ') {
          e.preventDefault();
          const v = this.captions.videoEl;
          if (v) v.paused ? v.play().catch(() => {}) : v.pause();
        }
      } else if (e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const up = e.key.toUpperCase();
        if (e.altKey && up === 'D') {
          e.preventDefault();
          this.captions.hopMostCommonVideoWords(1);
        } else if (e.altKey && up === 'A') {
          e.preventDefault();
          this.captions.hopMostCommonVideoWords(-1);
        } else if (up === 'D') {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(true, 1);
        } else if (up === 'A') {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(true, -1);
        } else if (up === 'E') {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(false, 1);
        } else if (up === 'Q') {
          e.preventDefault();
          this.captions.jumpLineWithUnknownWord(false, -1);
        } else if (up === 'K') {
          e.preventDefault();
          await this.captions.markCurrentLineKnown();
          await this.refreshVocabulary();
        }
      }
    });
  }
}

function formatMmSs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function applyTheme(theme: 'system' | 'light' | 'dark'): void {
  const isLight =
    theme === 'light' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

new VerbaLocalVideoApp().init().catch((err) => console.error('Verba video app error:', err));
