import type { PerLanguageOptions, VerbaSettings, SubtitleCue } from '../shared/types';
import { parseSubtitleFile } from '../shared/imports';
import { sendBgMessage } from '../shared/messaging';
import type { VerbaHighlighter } from './highlighter';

export class VerbaCaptions {
  private stageEl: HTMLElement;
  private pillEl: HTMLElement;
  private menuEl: HTMLElement;
  private drawerEl: HTMLElement;
  private toastEl: HTMLElement;

  public videoEl: HTMLVideoElement | null = null;
  public cues: SubtitleCue[] = [];
  public activeCueIdx = -1;
  public subtitleOffsetSec = 0;
  public loopCurrentLine = false;
  public menuOpen = false;
  public drawerOpen = false;
  public drawerTab: 'transcript' | 'words' = 'transcript';
  public wordsFilter: 'new' | 'learning' | 'both' | 'all' = 'both';
  public peekStep = 0; // E/Z temporary unblur step
  public pauseAtEndOfCueIdx = -1;

  private tickHandle: number | null = null;
  private lastListeningCreditTime = 0;
  private commonHopIdx = -1;
  private boundVideos = new WeakSet<HTMLVideoElement>();

  constructor(
    private shadow: ShadowRoot,
    public highlighter: VerbaHighlighter,
    public settings: VerbaSettings,
    public langOpts: PerLanguageOptions,
    private bindWordInteractions: (container: HTMLElement) => void
  ) {
    this.stageEl = document.createElement('div');
    this.stageEl.className = 'vc-stage';
    this.stageEl.hidden = true;

    this.pillEl = document.createElement('div');
    this.pillEl.className = 'vc-pill';
    this.pillEl.hidden = true;

    this.menuEl = document.createElement('div');
    this.menuEl.className = 'vc-menu';
    this.menuEl.hidden = true;

    this.drawerEl = document.createElement('div');
    this.drawerEl.className = 'vc-drawer';
    this.drawerEl.hidden = true;

    this.toastEl = document.createElement('div');
    this.toastEl.className = 'vc-toast';
    this.toastEl.hidden = true;

    this.shadow.appendChild(this.stageEl);
    this.shadow.appendChild(this.pillEl);
    this.shadow.appendChild(this.menuEl);
    this.shadow.appendChild(this.drawerEl);
    this.shadow.appendChild(this.toastEl);
  }

  public initPageVideoWatcher(): void {
    this.injectYouTubeSearchHelpers();
    const scanVideos = () => {
      const v = document.querySelector('video');
      if (v && v !== this.videoEl) {
        this.attachToVideo(v);
      }
    };
    scanVideos();
    window.setInterval(scanVideos, 2000);
  }

  public attachToVideo(video: HTMLVideoElement, initialCues?: SubtitleCue[]): void {
    this.videoEl = video;
    if (initialCues?.length) {
      this.cues = initialCues;
    } else {
      this.extractNativeTracks(video);
    }

    // Support drag-and-drop of .srt / .vtt / .ass directly onto any video!
    if (!this.boundVideos.has(video)) {
      this.boundVideos.add(video);
      video.addEventListener('dragover', (e) => e.preventDefault());
      video.addEventListener('drop', async (e) => {
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

  public setCues(cues: SubtitleCue[]): void {
    this.cues = cues;
    this.activeCueIdx = -1;
    this.renderPill();
    this.updateActiveCue(true);
    if (this.drawerOpen) this.renderDrawer();
  }

  public mergeTranslationsIntoCues(primary: SubtitleCue[], secondary: SubtitleCue[]): void {
    for (const c of primary) {
      const mid = (c.start + c.end) / 2;
      const match = secondary.find((s) => mid >= s.start - 0.6 && mid <= s.end + 0.6);
      if (match) c.translation = match.text;
    }
  }

  private extractNativeTracks(video: HTMLVideoElement): void {
    const tracks = Array.from(video.textTracks || []);
    const match =
      tracks.find((t) => t.language?.toLowerCase().startsWith(this.settings.activeLang)) || tracks[0];
    if (!match) return;
    match.mode = 'hidden';
    const readTrackCues = () => {
      const list = Array.from(match.cues || []) as VTTCue[];
      if (list.length > 0) {
        this.cues = list.map((c, idx) => ({
          id: `vtt_${idx}`,
          start: c.startTime,
          end: c.endTime,
          text: (c.text || '').replace(/<[^>]+>/g, '').trim(),
        }));
        this.renderPill();
      }
    };
    readTrackCues();
    match.addEventListener('cuechange', readTrackCues);
  }

  private startPlaybackLoop(): void {
    if (this.tickHandle) window.clearInterval(this.tickHandle);
    this.lastListeningCreditTime = this.videoEl?.currentTime || 0;

    this.tickHandle = window.setInterval(() => {
      const v = this.videoEl;
      if (!v) return;

      // Credit honest track-clock listening time when playing
      if (!v.paused && !v.ended) {
        const delta = v.currentTime - this.lastListeningCreditTime;
        if (delta >= 10 && delta < 30) {
          this.lastListeningCreditTime = v.currentTime;
          sendBgMessage({
            type: 'RECORD_LISTENING_SECONDS',
            lang: this.settings.activeLang,
            seconds: Math.round(delta / (v.playbackRate || 1)),
            title: document.title || 'Video',
            domain: location.hostname || 'video',
          }).catch(() => {});
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

  private updateActiveCue(forceRender: boolean): void {
    const v = this.videoEl;
    if (!v || !this.settings.captionsEnabled || this.cues.length === 0) {
      this.stageEl.hidden = true;
      return;
    }

    const now = v.currentTime - this.subtitleOffsetSec;
    const prevCue = this.cues[this.activeCueIdx];

    // Check loop or auto-pause at end of current cue
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
      if (this.drawerOpen && this.drawerTab === 'transcript') {
        this.highlightTranscriptCue();
      }
    } else if (idx >= 0 && this.settings.karaokeMode) {
      this.updateKaraokeHighlight(now, this.cues[idx]);
    }
  }

  private cueHasUnknownWords(cue: SubtitleCue): boolean {
    const tmp = document.createElement('div');
    tmp.textContent = cue.text;
    this.highlighter.scanAndHighlight(tmp);
    return Array.from(tmp.querySelectorAll<HTMLElement>('verba-w')).some(
      (el) => el.dataset.s === '0' || el.dataset.s === '1' || el.dataset.s === '2' || el.dataset.s === '3' || el.dataset.s === '4'
    );
  }

  private updateKaraokeHighlight(now: number, cue: SubtitleCue): void {
    const words = Array.from(this.stageEl.querySelectorAll<HTMLElement>('verba-w'));
    if (words.length === 0) return;
    const ratio = Math.max(0, Math.min(0.999, (now - cue.start) / Math.max(0.2, cue.end - cue.start)));
    const activeWordIdx = Math.floor(ratio * words.length);
    words.forEach((w, i) => {
      if (i === activeWordIdx) w.dataset.speaking = '1';
      else delete w.dataset.speaking;
    });
  }

  public renderPill(): void {
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
    const label = !this.settings.captionsEnabled
      ? 'Captions OFF'
      : hasSubs
      ? `Captions ON · ${this.cues.length}`
      : `no ${this.settings.activeLang.toUpperCase()}`;

    this.pillEl.innerHTML = `
      <button type="button" class="island-btn" id="cc-gear-btn" title="Caption settings">⚙</button>
      <button type="button" class="island-btn" id="cc-toggle-btn" title="Toggle Captions (C)">${esc(label)}</button>
      <button type="button" class="island-btn" id="cc-drawer-btn" title="Transcript & Words in this video (W)">☰</button>
    `;

    this.pillEl.querySelector('#cc-gear-btn')?.addEventListener('click', () => {
      this.menuOpen = !this.menuOpen;
      this.renderMenu();
    });
    this.pillEl.querySelector('#cc-toggle-btn')?.addEventListener('click', () => this.toggleEnabled());
    this.pillEl.querySelector('#cc-drawer-btn')?.addEventListener('click', () => this.toggleWordsOrTranscriptDrawer());
  }

  public async renderActiveSubtitle(goldWordKey?: string): Promise<void> {
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

    // Fetch missing translation if Google Translate fallback is on
    if (!cue.translation && this.settings.googleTranslateMissingSubs && this.settings.translationMode !== 'hide') {
      sendBgMessage<{ translation: string }>({
        type: 'TRANSLATE',
        text: cue.text,
        sourceLang: this.settings.activeLang,
      })
        .then((res) => {
          if (res?.translation) {
            cue.translation = res.translation;
            if (this.cues[this.activeCueIdx] === cue) this.renderActiveSubtitle(goldWordKey);
          }
        })
        .catch(() => {});
    }

    const subBlurred = this.settings.subtitleMode === 'blur' && this.peekStep < 1;
    const subHidden = this.settings.subtitleMode === 'hide' && this.peekStep < 1;
    const transBlurred = this.settings.translationMode === 'blur' && this.peekStep < 2;
    const transHidden = this.settings.translationMode === 'hide' && this.peekStep < 2;

    const bgAlpha = (this.settings.subtitleBgOpacity / 100).toFixed(2);
    const fontCss =
      this.settings.subtitleFont === 'serif'
        ? 'var(--serif)'
        : this.settings.subtitleFont === 'mono'
        ? 'var(--mono)'
        : 'var(--sans)';

    this.stageEl.innerHTML = `
      <div class="vc-box" style="background:rgb(17 17 16 / ${bgAlpha});font-family:${fontCss};">
        ${
          subHidden
            ? `<div style="color:var(--ink-3);font-size:13px;">[Subtitle hidden · press E to peek]</div>`
            : `<div class="vc-line ${subBlurred ? 'blurred' : ''}" id="cc-sub-line" data-size="${
                this.settings.subtitleSize
              }">${esc(cue.text)}</div>`
        }
        ${
          cue.translation && !transHidden
            ? `<div class="vc-trans ${transBlurred ? 'blurred' : ''}" data-size="${
                this.settings.translationSize
              }">${esc(cue.translation)}</div>`
            : ''
        }
      </div>
      <div class="vc-side-btns">
        <button type="button" class="vc-mini-btn" id="cc-prev" title="Previous line (A)">⏮</button>
        <button type="button" class="vc-mini-btn" id="cc-replay" title="Replay line (S)">↺</button>
        <button type="button" class="vc-mini-btn" id="cc-next" title="Next line (D)">⏭</button>
        <button type="button" class="vc-mini-btn" id="cc-loop" title="Loop line" style="${
          this.loopCurrentLine ? 'border-color:#3b82f6;color:#93c5fd;' : ''
        }">∞</button>
      </div>
    `;

    const lineEl = this.stageEl.querySelector<HTMLElement>('#cc-sub-line');
    if (lineEl) {
      this.highlighter.scanAndHighlight(lineEl);
      this.bindWordInteractions(lineEl);

      // Apply right-click quick Known toggle & optional inline meanings & gold ring
      lineEl.querySelectorAll<HTMLElement>('verba-w').forEach((wEl) => {
        if (goldWordKey && (wEl.dataset.key === goldWordKey || wEl.dataset.w === goldWordKey)) {
          wEl.dataset.freqRing = '1';
        }
        wEl.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const curS = wEl.dataset.s;
          const nextStatus = curS === '5' ? 1 : 5;
          wEl.dataset.s = String(nextStatus);
          sendBgMessage<{ ok: boolean; record?: { word: string; status: 1 | 5 } }>({
            type: 'GRADE_WORD',
            lang: this.settings.activeLang,
            word: wEl.dataset.w || '',
            status: nextStatus,
            contextSentence: cue.text,
          }).then((res) => {
            if (res?.record) {
              this.highlighter.wordMap.set(res.record.word, res.record as any);
              this.highlighter.refreshAllStatuses(false);
              this.renderActiveSubtitle();
            }
            this.showNote(nextStatus === 5 ? 'Known' : 'Level 1');
          });
        });
      });
    }

    this.stageEl.querySelector('#cc-prev')?.addEventListener('click', () => this.jumpRelativeLine(-1));
    this.stageEl.querySelector('#cc-replay')?.addEventListener('click', () => this.replayCurrentLine());
    this.stageEl.querySelector('#cc-next')?.addEventListener('click', () => this.jumpRelativeLine(1));
    this.stageEl.querySelector('#cc-loop')?.addEventListener('click', () => {
      this.loopCurrentLine = !this.loopCurrentLine;
      this.renderActiveSubtitle();
    });
  }

  public async toggleEnabled(): Promise<void> {
    this.settings = await sendBgMessage({
      type: 'SAVE_SETTINGS',
      patch: { captionsEnabled: !this.settings.captionsEnabled },
    });
    this.renderPill();
    this.updateActiveCue(true);
    this.showNote(this.settings.captionsEnabled ? 'Captions ON' : 'Captions OFF');
  }

  public jumpRelativeLine(delta: number): void {
    if (!this.videoEl || this.cues.length === 0) return;
    const base = this.activeCueIdx >= 0 ? this.activeCueIdx : this.findNearestCueIdx();
    const targetIdx = Math.max(0, Math.min(this.cues.length - 1, base + delta));
    const target = this.cues[targetIdx];
    if (target) {
      this.videoEl.currentTime = Math.max(0, target.start + this.subtitleOffsetSec + 0.02);
      this.videoEl.play().catch(() => {});
      this.activeCueIdx = targetIdx;
      this.renderActiveSubtitle();
    }
  }

  public replayCurrentLine(resetBlur = false): void {
    if (!this.videoEl || this.cues.length === 0) return;
    const idx = this.activeCueIdx >= 0 ? this.activeCueIdx : this.findNearestCueIdx();
    const cue = this.cues[idx];
    if (!cue) return;
    if (resetBlur) this.peekStep = 0;
    this.videoEl.currentTime = Math.max(0, cue.start + this.subtitleOffsetSec + 0.02);
    this.videoEl.play().catch(() => {});
    this.renderActiveSubtitle();
  }

  public async toggleAutoPause(): Promise<void> {
    this.settings = await sendBgMessage({
      type: 'SAVE_SETTINGS',
      patch: { autoPauseEachLine: !this.settings.autoPauseEachLine },
    });
    this.showNote(this.settings.autoPauseEachLine ? 'Auto-pause ON' : 'Auto-pause OFF');
    if (this.menuOpen) this.renderMenu();
  }

  public peekLayers(): void {
    this.peekStep = (this.peekStep + 1) % 3;
    this.renderActiveSubtitle();
  }

  public async toggleHideKnownLines(): Promise<void> {
    this.settings = await sendBgMessage({
      type: 'SAVE_SETTINGS',
      patch: { hideKnownLines: !this.settings.hideKnownLines },
    });
    this.showNote(this.settings.hideKnownLines ? 'Hide known lines ON' : 'Hide known lines OFF');
    this.renderActiveSubtitle();
  }

  public async cycleBandFilter(): Promise<void> {
    const steps: VerbaSettings['vocabBandFilter'][] = ['all', 'top500', 'top1500', 'top3000', 'top5000', 'top10000'];
    const next = steps[(steps.indexOf(this.settings.vocabBandFilter) + 1) % steps.length];
    this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { vocabBandFilter: next } });
    this.highlighter.settings = this.settings;
    this.highlighter.refreshAllStatuses(false);
    this.renderActiveSubtitle();
    this.showNote(`Vocabulary band: ${next}`);
  }

  public adjustSubtitleTiming(deltaSec: number): void {
    this.subtitleOffsetSec = Math.round((this.subtitleOffsetSec + deltaSec) * 100) / 100;
    const sign = this.subtitleOffsetSec >= 0 ? '+' : '';
    this.showNote(`Subtitle timing: ${sign}${this.subtitleOffsetSec.toFixed(2)}s`);
    this.updateActiveCue(true);
  }

  public snapSubtitleToNow(dir: 1 | -1): void {
    if (!this.videoEl || this.cues.length === 0) return;
    const base = this.activeCueIdx >= 0 ? this.activeCueIdx : this.findNearestCueIdx();
    const target = this.cues[Math.max(0, Math.min(this.cues.length - 1, base + dir))];
    if (!target) return;
    this.subtitleOffsetSec = Math.round((this.videoEl.currentTime - target.start) * 100) / 100;
    this.showNote(`Snapped subtitle (${this.subtitleOffsetSec >= 0 ? '+' : ''}${this.subtitleOffsetSec.toFixed(2)}s)`);
    this.updateActiveCue(true);
  }

  public jumpLineWithUnknownWord(frequentOnly: boolean, dir: 1 | -1): void {
    if (!this.videoEl || this.cues.length === 0) return;
    const start = this.activeCueIdx >= 0 ? this.activeCueIdx : 0;
    for (let step = 1; step <= this.cues.length; step++) {
      const idx = (start + dir * step + this.cues.length) % this.cues.length;
      const cue = this.cues[idx];
      const tmp = document.createElement('div');
      tmp.textContent = cue.text;
      this.highlighter.scanAndHighlight(tmp);
      const unknowns = Array.from(tmp.querySelectorAll<HTMLElement>('verba-w')).filter((w) => {
        const s = w.dataset.s;
        if (s !== '0' && s !== '1' && s !== '2' && s !== '3' && s !== '4') return false;
        if (frequentOnly) return Boolean(w.dataset.rank && Number(w.dataset.rank) <= 5000);
        return true;
      });
      if (unknowns.length > 0) {
        unknowns.sort((a, b) => Number(a.dataset.rank || 999999) - Number(b.dataset.rank || 999999));
        const commonestKey = unknowns[0].dataset.key || unknowns[0].dataset.w;
        this.activeCueIdx = idx;
        this.videoEl.currentTime = Math.max(0, cue.start + this.subtitleOffsetSec + 0.02);
        this.videoEl.play().catch(() => {});
        this.renderActiveSubtitle(commonestKey);
        return;
      }
    }
    this.showNote('No matching unknown lines');
  }

  public hopMostCommonVideoWords(dir: 1 | -1): void {
    if (!this.videoEl || this.cues.length === 0) return;
    const rankedList: { cueIdx: number; key: string; rank: number }[] = [];
    const seen = new Set<string>();
    this.cues.forEach((cue, cueIdx) => {
      const tmp = document.createElement('div');
      tmp.textContent = cue.text;
      this.highlighter.scanAndHighlight(tmp);
      tmp.querySelectorAll<HTMLElement>('verba-w').forEach((w) => {
        const s = w.dataset.s;
        const key = w.dataset.key || w.dataset.w || '';
        const rank = Number(w.dataset.rank || 999999);
        if ((s === '0' || s === '1' || s === '2' || s === '3' || s === '4') && !seen.has(key)) {
          seen.add(key);
          rankedList.push({ cueIdx, key, rank });
        }
      });
    });
    rankedList.sort((a, b) => a.rank - b.rank);
    if (rankedList.length === 0) {
      this.showNote('All video words known!');
      return;
    }
    this.commonHopIdx = (this.commonHopIdx + dir + rankedList.length) % rankedList.length;
    const pick = rankedList[this.commonHopIdx];
    const cue = this.cues[pick.cueIdx];
    this.activeCueIdx = pick.cueIdx;
    this.videoEl.currentTime = Math.max(0, cue.start + this.subtitleOffsetSec + 0.02);
    this.renderActiveSubtitle(pick.key);
  }

  public async markCurrentLineKnown(): Promise<void> {
    const cue = this.cues[this.activeCueIdx];
    if (!cue) return;
    const tmp = document.createElement('div');
    tmp.textContent = cue.text;
    this.highlighter.scanAndHighlight(tmp);
    const blueWords = Array.from(tmp.querySelectorAll<HTMLElement>('verba-w'))
      .filter((w) => w.dataset.s === '0')
      .map((w) => w.dataset.key || w.dataset.w || '')
      .filter(Boolean);
    if (blueWords.length > 0) {
      await sendBgMessage({
        type: 'BATCH_MARK_KNOWN',
        lang: this.settings.activeLang,
        words: blueWords,
        source: 'manual',
      });
      this.showNote(`Marked ${blueWords.length} words Known`);
      if (this.settings.autoResumeOnKnown && this.videoEl?.paused) {
        this.videoEl.play().catch(() => {});
      }
    }
  }

  public toggleWordsOrTranscriptDrawer(tab?: 'transcript' | 'words'): void {
    if (tab && this.drawerOpen && this.drawerTab !== tab) {
      this.drawerTab = tab;
      this.renderDrawer();
      return;
    }
    this.drawerOpen = !this.drawerOpen;
    if (tab) this.drawerTab = tab;
    this.drawerEl.hidden = !this.drawerOpen;
    if (this.drawerOpen) {
      if (this.drawerTab === 'words') this.videoEl?.pause();
      this.renderDrawer();
    }
  }

  private renderMenu(): void {
    this.menuEl.hidden = !this.menuOpen;
    if (!this.menuOpen) return;
    const pillRect = this.pillEl.getBoundingClientRect();
    this.menuEl.style.top = `${Math.round(pillRect.bottom + 6)}px`;
    this.menuEl.style.left = `${Math.max(12, Math.round(pillRect.left))}px`;

    this.menuEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <b style="color:var(--ink)">Dual Captions Settings</b>
        <button type="button" class="wp-icon-btn" id="cc-menu-close">✕</button>
      </div>
      <div class="cc-row">
        <span>Subtitle</span>
        <select id="cc-sub-mode" class="wp-btn-ghost">
          <option value="show" ${this.settings.subtitleMode === 'show' ? 'selected' : ''}>Show</option>
          <option value="blur" ${this.settings.subtitleMode === 'blur' ? 'selected' : ''}>Blur</option>
          <option value="hide" ${this.settings.subtitleMode === 'hide' ? 'selected' : ''}>Hide</option>
        </select>
      </div>
      <div class="cc-row">
        <span>Translation</span>
        <select id="cc-trans-mode" class="wp-btn-ghost">
          <option value="show" ${this.settings.translationMode === 'show' ? 'selected' : ''}>Show</option>
          <option value="blur" ${this.settings.translationMode === 'blur' ? 'selected' : ''}>Blur</option>
          <option value="hide" ${this.settings.translationMode === 'hide' ? 'selected' : ''}>Hide</option>
        </select>
      </div>
      <div class="cc-row">
        <span>Auto-pause after line (Q)</span>
        <input type="checkbox" id="cc-autopause" ${this.settings.autoPauseEachLine ? 'checked' : ''}>
      </div>
      <div class="cc-row">
        <span>Only at new words</span>
        <input type="checkbox" id="cc-only-new" ${this.settings.autoPauseOnlyNewWords ? 'checked' : ''}>
      </div>
      <div class="cc-row">
        <span>Auto-resume on Known</span>
        <input type="checkbox" id="cc-autoresume" ${this.settings.autoResumeOnKnown ? 'checked' : ''}>
      </div>
      <div class="cc-row">
        <span>Karaoke mode</span>
        <input type="checkbox" id="cc-karaoke" ${this.settings.karaokeMode ? 'checked' : ''}>
      </div>
      <div class="cc-row">
        <span>Subtitle size</span>
        <select id="cc-sub-size" class="wp-btn-ghost">
          ${(['S', 'M', 'L', 'XL'] as const)
            .map((sz) => `<option value="${sz}" ${this.settings.subtitleSize === sz ? 'selected' : ''}>${sz}</option>`)
            .join('')}
        </select>
      </div>
      <div class="cc-row">
        <span>Timing (${this.subtitleOffsetSec >= 0 ? '+' : ''}${this.subtitleOffsetSec.toFixed(2)}s)</span>
        <div style="display:flex;gap:4px;">
          <button type="button" class="wp-btn-ghost" id="cc-time-minus">−0.25</button>
          <button type="button" class="wp-btn-ghost" id="cc-time-reset">0</button>
          <button type="button" class="wp-btn-ghost" id="cc-time-plus">+0.25</button>
        </div>
      </div>
      <div class="cc-row">
        <span>Load subtitle (.srt/.vtt/.ass)</span>
        <label class="wp-btn-ghost" style="cursor:pointer;display:inline-flex;align-items:center;">
          Choose…
          <input type="file" id="cc-load-srt" accept=".srt,.vtt,.ass" hidden>
        </label>
      </div>
    `;

    this.menuEl.querySelector('#cc-menu-close')?.addEventListener('click', () => {
      this.menuOpen = false;
      this.menuEl.hidden = true;
    });
    this.menuEl.querySelector('#cc-sub-mode')?.addEventListener('change', async (e) => {
      const v = (e.target as HTMLSelectElement).value as 'show' | 'blur' | 'hide';
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { subtitleMode: v } });
      this.renderActiveSubtitle();
    });
    this.menuEl.querySelector('#cc-trans-mode')?.addEventListener('change', async (e) => {
      const v = (e.target as HTMLSelectElement).value as 'show' | 'blur' | 'hide';
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { translationMode: v } });
      this.renderActiveSubtitle();
    });
    this.menuEl.querySelector('#cc-autopause')?.addEventListener('change', (e) => {
      const v = (e.target as HTMLInputElement).checked;
      sendBgMessage({ type: 'SAVE_SETTINGS', patch: { autoPauseEachLine: v } }).then((s) => {
        this.settings = s as VerbaSettings;
      });
    });
    this.menuEl.querySelector('#cc-only-new')?.addEventListener('change', (e) => {
      const v = (e.target as HTMLInputElement).checked;
      sendBgMessage({ type: 'SAVE_SETTINGS', patch: { autoPauseOnlyNewWords: v } }).then((s) => {
        this.settings = s as VerbaSettings;
      });
    });
    this.menuEl.querySelector('#cc-autoresume')?.addEventListener('change', (e) => {
      const v = (e.target as HTMLInputElement).checked;
      sendBgMessage({ type: 'SAVE_SETTINGS', patch: { autoResumeOnKnown: v } }).then((s) => {
        this.settings = s as VerbaSettings;
      });
    });
    this.menuEl.querySelector('#cc-karaoke')?.addEventListener('change', (e) => {
      const v = (e.target as HTMLInputElement).checked;
      sendBgMessage({ type: 'SAVE_SETTINGS', patch: { karaokeMode: v } }).then((s) => {
        this.settings = s as VerbaSettings;
      });
    });
    this.menuEl.querySelector('#cc-sub-size')?.addEventListener('change', async (e) => {
      const v = (e.target as HTMLSelectElement).value as 'S' | 'M' | 'L' | 'XL';
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { subtitleSize: v } });
      this.renderActiveSubtitle();
    });
    this.menuEl.querySelector('#cc-time-minus')?.addEventListener('click', () => {
      this.adjustSubtitleTiming(-0.25);
      this.renderMenu();
    });
    this.menuEl.querySelector('#cc-time-reset')?.addEventListener('click', () => {
      this.subtitleOffsetSec = 0;
      this.updateActiveCue(true);
      this.renderMenu();
    });
    this.menuEl.querySelector('#cc-time-plus')?.addEventListener('click', () => {
      this.adjustSubtitleTiming(0.25);
      this.renderMenu();
    });
    this.menuEl.querySelector('#cc-load-srt')?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      this.setCues(parseSubtitleFile(text, file.name));
      this.menuOpen = false;
      this.menuEl.hidden = true;
    });
  }

  private renderDrawer(): void {
    if (!this.drawerOpen) return;

    if (this.drawerTab === 'transcript') {
      this.drawerEl.innerHTML = `
        <div class="cc-drawer-head">
          <button type="button" class="wp-tab" aria-selected="true" id="dr-tab-tr">Transcript</button>
          <button type="button" class="wp-tab" aria-selected="false" id="dr-tab-wd">Words in video (W)</button>
          <button type="button" class="wp-btn-ghost" id="dr-save-book" style="margin-left:auto" title="Save transcript to Books">Save to Books</button>
          <button type="button" class="wp-icon-btn" id="dr-close">✕</button>
        </div>
        <div class="cc-drawer-list" id="dr-list">
          ${this.cues
            .map(
              (c, idx) => `<div class="cc-cue-item ${idx === this.activeCueIdx ? 'active' : ''}" data-cue-idx="${idx}">
                <span class="cc-cue-time">${formatTime(c.start)}</span>
                <span class="cc-cue-text">${esc(c.text)}</span>
              </div>`
            )
            .join('')}
        </div>
      `;

      const listEl = this.drawerEl.querySelector<HTMLElement>('#dr-list');
      if (listEl) {
        this.highlighter.scanAndHighlight(listEl);
        this.bindWordInteractions(listEl);
        listEl.querySelectorAll<HTMLElement>('.cc-cue-item').forEach((row) => {
          row.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).closest('verba-w')) return;
            const idx = Number(row.dataset.cueIdx);
            const cue = this.cues[idx];
            if (cue && this.videoEl) {
              this.videoEl.currentTime = cue.start + this.subtitleOffsetSec + 0.02;
              this.videoEl.play().catch(() => {});
            }
          });
        });
      }

      this.drawerEl.querySelector('#dr-save-book')?.addEventListener('click', () => {
        const text = this.cues.map((c) => c.text).join('\n\n');
        const html = this.cues.map((c) => `<p>${esc(c.text)}</p>`).join('\n');
        sendBgMessage({
          type: 'SAVE_ARTICLE_TO_SHELF',
          lang: this.settings.activeLang,
          title: `Transcript · ${document.title || 'Video'}`,
          url: location.href,
          html,
          text,
        }).then(() => this.showNote('Saved transcript to Books shelf!'));
      });
    } else {
      // Words in this video (most said first!)
      const freqMap = new Map<string, { word: string; status: string; count: number; firstCueIdx: number }>();
      this.cues.forEach((cue, cueIdx) => {
        const tmp = document.createElement('div');
        tmp.textContent = cue.text;
        this.highlighter.scanAndHighlight(tmp);
        tmp.querySelectorAll<HTMLElement>('verba-w').forEach((w) => {
          const key = w.dataset.key || w.dataset.w || '';
          const s = w.dataset.s || '0';
          const cur = freqMap.get(key);
          if (cur) cur.count++;
          else freqMap.set(key, { word: key, status: s, count: 1, firstCueIdx: cueIdx });
        });
      });

      const items = Array.from(freqMap.values())
        .filter((it) => {
          if (this.wordsFilter === 'new') return it.status === '0';
          if (this.wordsFilter === 'learning') return ['1', '2', '3', '4'].includes(it.status);
          if (this.wordsFilter === 'both') return ['0', '1', '2', '3', '4'].includes(it.status);
          return true;
        })
        .sort((a, b) => b.count - a.count);

      this.drawerEl.innerHTML = `
        <div class="cc-drawer-head">
          <button type="button" class="wp-tab" aria-selected="false" id="dr-tab-tr">Transcript</button>
          <button type="button" class="wp-tab" aria-selected="true" id="dr-tab-wd">Words (${items.length})</button>
          <button type="button" class="wp-icon-btn" id="dr-close" style="margin-left:auto">✕</button>
        </div>
        <div style="display:flex;gap:4px;padding:6px 10px;border-bottom:1px solid var(--border-subtle);">
          ${(['both', 'new', 'learning', 'all'] as const)
            .map(
              (f) =>
                `<button type="button" class="wp-btn-ghost dr-chip" data-f="${f}" style="${
                  this.wordsFilter === f ? 'border-color:#3b82f6;color:var(--ink);' : ''
                }">${f === 'both' ? 'New + Learning' : f[0].toUpperCase() + f.slice(1)}</button>`
            )
            .join('')}
        </div>
        <div class="cc-drawer-list" id="dr-words-list">
          ${items
            .map(
              (it) => `<div class="cc-cue-item" style="justify-content:space-between;align-items:center;">
                <span><verba-w data-w="${esc(it.word)}" data-key="${esc(it.word)}" data-s="${esc(it.status)}">${esc(
                it.word
              )}</verba-w> <span style="color:var(--ink-3);font-size:12px;">×${it.count}</span></span>
                <button type="button" class="wp-icon-btn dr-jump-cue" data-cue="${it.firstCueIdx}" title="Jump to line">▶</button>
              </div>`
            )
            .join('')}
        </div>
      `;

      const wList = this.drawerEl.querySelector<HTMLElement>('#dr-words-list');
      if (wList) this.bindWordInteractions(wList);

      this.drawerEl.querySelectorAll<HTMLButtonElement>('.dr-chip').forEach((b) => {
        b.addEventListener('click', () => {
          this.wordsFilter = b.dataset.f as typeof this.wordsFilter;
          this.renderDrawer();
        });
      });
      this.drawerEl.querySelectorAll<HTMLButtonElement>('.dr-jump-cue').forEach((b) => {
        b.addEventListener('click', () => {
          const cue = this.cues[Number(b.dataset.cue)];
          if (cue && this.videoEl) {
            this.videoEl.currentTime = cue.start + this.subtitleOffsetSec + 0.02;
          }
        });
      });
    }

    this.drawerEl.querySelector('#dr-tab-tr')?.addEventListener('click', () => {
      this.drawerTab = 'transcript';
      this.renderDrawer();
    });
    this.drawerEl.querySelector('#dr-tab-wd')?.addEventListener('click', () => {
      this.drawerTab = 'words';
      this.renderDrawer();
    });
    this.drawerEl.querySelector('#dr-close')?.addEventListener('click', () => {
      this.drawerOpen = false;
      this.drawerEl.hidden = true;
    });
  }

  private highlightTranscriptCue(): void {
    this.drawerEl.querySelectorAll<HTMLElement>('.cc-cue-item').forEach((el) => {
      const idx = Number(el.dataset.cueIdx);
      el.classList.toggle('active', idx === this.activeCueIdx);
    });
  }

  private findNearestCueIdx(): number {
    if (!this.videoEl || this.cues.length === 0) return 0;
    const now = this.videoEl.currentTime - this.subtitleOffsetSec;
    for (let i = this.cues.length - 1; i >= 0; i--) {
      if (this.cues[i].start <= now) return i;
    }
    return 0;
  }

  public showNote(msg: string): void {
    if (!this.settings.showActionNotes) return;
    this.toastEl.textContent = msg;
    this.toastEl.hidden = false;
    this.toastEl.style.left = '50%';
    this.toastEl.style.bottom = '96px';
    this.toastEl.style.transform = 'translateX(-50%)';
    window.setTimeout(() => {
      this.toastEl.hidden = true;
    }, 1500);
  }

  private injectYouTubeSearchHelpers(): void {
    if (!location.hostname.includes('youtube.com')) return;
    const searchForm = document.querySelector('ytd-searchbox form, #search-form');
    if (!searchForm || searchForm.querySelector('#verba-yt-translate')) return;

    const wrap = document.createElement('div');
    wrap.id = 'verba-yt-translate';
    wrap.dataset.verbaIgnore = '1';
    wrap.style.cssText = 'display:inline-flex;gap:6px;margin-left:8px;align-items:center;';
    wrap.innerHTML = `
      <button type="button" id="verba-yt-tr-btn" style="height:32px;padding:0 10px;border-radius:999px;border:1px solid #3b3a37;background:#191918;color:#f2f0eb;font-size:12px;cursor:pointer;">Translate</button>
      <button type="button" id="verba-yt-cc-btn" style="height:32px;padding:0 10px;border-radius:999px;border:1px solid #3b3a37;background:#191918;color:#f2f0eb;font-size:12px;cursor:pointer;">Subtitles</button>
    `;
    searchForm.parentElement?.appendChild(wrap);

    wrap.querySelector('#verba-yt-tr-btn')?.addEventListener('click', async () => {
      const inp = document.querySelector<HTMLInputElement>('input#search, input[name="search_query"]');
      if (!inp || !inp.value.trim()) return;
      const res = await sendBgMessage<{ translation: string }>({
        type: 'TRANSLATE',
        text: inp.value.trim(),
        sourceLang: 'auto',
        targetLang: this.settings.activeLang,
      });
      if (res?.translation) {
        inp.value = res.translation;
        location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(res.translation)}`;
      }
    });

    wrap.querySelector('#verba-yt-cc-btn')?.addEventListener('click', () => {
      const url = new URL(location.href);
      // YouTube sp=EgIoAQ%3D%3D filters to videos with written Subtitles/CC!
      if (url.searchParams.get('sp') === 'EgIoAQ%3D%3D') {
        url.searchParams.delete('sp');
      } else {
        url.searchParams.set('sp', 'EgIoAQ%3D%3D');
      }
      location.href = url.toString();
    });
  }
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
