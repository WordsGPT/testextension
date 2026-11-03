import type { PerLanguageOptions, VerbaSettings } from '../shared/types';
import { buildAskAiChatUrl } from '../shared/ai';
import { sendBgMessage } from '../shared/messaging';
import { speakText, stopSpeaking } from '../shared/tts';
import { setHtmlContent } from '../shared/dom';
import { VerbaHighlighter, buildPageHighlightStyles } from './highlighter-bridge';

export class VerbaReaderSuite {
  private readerEl: HTMLElement;
  private sentenceModalEl: HTMLElement;
  private ttsBarEl: HTMLElement;
  private askModalEl: HTMLElement;
  private shadowHighlightStyle: HTMLStyleElement;

  public isReaderOpen = false;
  public isSentenceModeOpen = false;
  public isReadingAloud = false;
  public isReadingPaused = false;
  public pauseAfterEachSentence = false;

  private sentences: string[] = [];
  private sentenceIdx = 0;
  private showSentenceTranslation = false;
  private sentenceTranslationCache = new Map<string, string>();
  private ttsStartedAt = 0;

  constructor(
    private shadow: ShadowRoot,
    public highlighter: VerbaHighlighter,
    public settings: VerbaSettings,
    public langOpts: PerLanguageOptions,
    private bindWordInteractions: (container: HTMLElement) => void
  ) {
    this.shadowHighlightStyle = document.createElement('style');
    this.shadowHighlightStyle.textContent = buildPageHighlightStyles(settings);
    this.shadow.appendChild(this.shadowHighlightStyle);

    this.readerEl = document.createElement('div');
    this.readerEl.className = 'verba-reader-overlay';
    this.readerEl.hidden = true;

    this.sentenceModalEl = document.createElement('div');
    this.sentenceModalEl.className = 'verba-sentence-modal';
    this.sentenceModalEl.hidden = true;

    this.ttsBarEl = document.createElement('div');
    this.ttsBarEl.className = 'verba-tts-bar';
    this.ttsBarEl.hidden = true;

    this.askModalEl = document.createElement('div');
    this.askModalEl.className = 'verba-ask-modal';
    this.askModalEl.hidden = true;

    this.shadow.appendChild(this.readerEl);
    this.shadow.appendChild(this.sentenceModalEl);
    this.shadow.appendChild(this.ttsBarEl);
    this.shadow.appendChild(this.askModalEl);
  }

  public syncStyles(settings: VerbaSettings, langOpts: PerLanguageOptions): void {
    this.settings = settings;
    this.langOpts = langOpts;
    this.shadowHighlightStyle.textContent = buildPageHighlightStyles(settings);
  }

  private extractArticleFromPage(): { title: string; html: string; text: string } {
    const title = document.title || 'Article';
    // Special handling for ChatGPT / Claude / Gemini assistant replies in order
    const assistantTurns = document.querySelectorAll(
      '[data-message-author-role="assistant"], .model-response-text, [data-testid*="assistant"]'
    );
    if (assistantTurns.length > 0) {
      const htmlParts: string[] = [];
      const textParts: string[] = [];
      assistantTurns.forEach((turn) => {
        const cleanText = (turn.textContent || '').trim();
        if (cleanText) {
          htmlParts.push(`<p>${esc(cleanText).replace(/\n+/g, '</p><p>')}</p>`);
          textParts.push(cleanText);
        }
      });
      return { title, html: htmlParts.join('\n'), text: textParts.join('\n\n') };
    }

    const candidate =
      document.querySelector('article') ||
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.body;

    const paragraphs: string[] = [];
    const textBlocks: string[] = [];
    const nodes = candidate.querySelectorAll('h1, h2, h3, p, blockquote, li, img');
    nodes.forEach((n) => {
      if (n.closest('nav, header, footer, aside, #verba-ui-root')) return;
      if (n.tagName === 'IMG') {
        const src = (n as HTMLImageElement).src;
        if (src && (n as HTMLImageElement).width > 120) {
          paragraphs.push(`<img src="${esc(src)}" alt="">`);
        }
        return;
      }
      const txt = (n.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt.length < 2) return;
      const tag = n.tagName.toLowerCase();
      if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
        paragraphs.push(`<${tag}>${esc(txt)}</${tag}>`);
      } else {
        paragraphs.push(`<p>${esc(txt)}</p>`);
      }
      textBlocks.push(txt);
    });

    if (paragraphs.length === 0) {
      const fallback = (document.body.innerText || '').trim();
      for (const line of fallback.split(/\n+/)) {
        if (line.trim()) {
          paragraphs.push(`<p>${esc(line.trim())}</p>`);
          textBlocks.push(line.trim());
        }
      }
    }

    return {
      title,
      html: paragraphs.join('\n'),
      text: textBlocks.join('\n\n'),
    };
  }

  public async toggleReaderView(): Promise<void> {
    if (this.isReaderOpen) {
      this.closeReaderView();
      return;
    }
    const extracted = this.extractArticleFromPage();
    this.isReaderOpen = true;
    this.readerEl.hidden = false;
    this.renderReaderView(extracted.title, extracted.html);

    // Save to Shelf automatically ("Every article you open goes on the shelf")
    sendBgMessage({
      type: 'SAVE_ARTICLE_TO_SHELF',
      lang: this.settings.activeLang,
      title: extracted.title,
      url: location.href,
      html: extracted.html,
      text: extracted.text,
    }).catch(() => {});
  }

  public closeReaderView(): void {
    this.isReaderOpen = false;
    this.readerEl.hidden = true;
  }

  private renderReaderView(title: string, bodyHtml: string): void {
    const paper = this.settings.readerTheme || 'dark';
    this.readerEl.dataset.paper = paper;

    const fontStack =
      this.settings.readerFont === 'sans'
        ? 'var(--sans)'
        : this.settings.readerFont === 'mono'
        ? 'var(--mono)'
        : this.settings.readerFont === 'custom' && this.settings.customFontName
        ? `"${this.settings.customFontName}", var(--serif)`
        : 'var(--serif)';

    setHtmlContent(
      this.readerEl,
      `
      <div class="reader-bar">
        <span class="reader-bar-title">${esc(title)}</span>
        <button type="button" class="wp-btn-ghost" data-paper-pick="white">White</button>
        <button type="button" class="wp-btn-ghost" data-paper-pick="sepia">Light yellow</button>
        <button type="button" class="wp-btn-ghost" data-paper-pick="dark">Dark</button>
        <button type="button" class="wp-btn-ghost" id="rv-font-dec">A−</button>
        <button type="button" class="wp-btn-ghost" id="rv-font-inc">A+</button>
        <select id="rv-font-sel" class="wp-btn-ghost">
          <option value="serif" ${this.settings.readerFont === 'serif' ? 'selected' : ''}>Aa · Serif</option>
          <option value="sans" ${this.settings.readerFont === 'sans' ? 'selected' : ''}>Aa · Sans</option>
          <option value="mono" ${this.settings.readerFont === 'mono' ? 'selected' : ''}>Aa · Mono</option>
        </select>
        <button type="button" class="wp-btn-ghost" id="rv-sentence-btn" title="Sentence by sentence (Shift+S)">Sentence by sentence</button>
        <button type="button" class="wp-btn-ghost" id="rv-tts-btn" title="Read aloud (Shift+R)">🔊 Read aloud</button>
        <button type="button" class="wp-btn-ghost" id="rv-close-btn" title="Back to page (Esc)">✕ Back</button>
      </div>
      <div class="reader-scroll">
        <article class="reader-article" id="rv-article-body" style="font-size:${this.settings.readerFontSize}px;font-family:${fontStack}">
          <h1>${esc(title)}</h1>
          ${bodyHtml}
        </article>
      </div>
    `
    );

    const articleBody = this.readerEl.querySelector<HTMLElement>('#rv-article-body');
    if (articleBody) {
      this.highlighter.scanAndHighlight(articleBody);
      this.bindWordInteractions(articleBody);
    }

    this.readerEl.querySelectorAll<HTMLButtonElement>('[data-paper-pick]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const nextPaper = btn.dataset.paperPick as 'white' | 'sepia' | 'dark';
        this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerTheme: nextPaper } });
        this.renderReaderView(title, bodyHtml);
      });
    });

    this.readerEl.querySelector('#rv-font-dec')?.addEventListener('click', async () => {
      const next = Math.max(13, this.settings.readerFontSize - 2);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerFontSize: next } });
      this.renderReaderView(title, bodyHtml);
    });
    this.readerEl.querySelector('#rv-font-inc')?.addEventListener('click', async () => {
      const next = Math.min(34, this.settings.readerFontSize + 2);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerFontSize: next } });
      this.renderReaderView(title, bodyHtml);
    });
    this.readerEl.querySelector('#rv-font-sel')?.addEventListener('change', async (e) => {
      const val = (e.target as HTMLSelectElement).value as 'serif' | 'sans' | 'mono';
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerFont: val } });
      this.renderReaderView(title, bodyHtml);
    });
    this.readerEl.querySelector('#rv-sentence-btn')?.addEventListener('click', () => {
      this.openSentenceBySentence(articleBody?.innerText || '');
    });
    this.readerEl.querySelector('#rv-tts-btn')?.addEventListener('click', () => {
      this.toggleReadAloud(articleBody?.innerText || '');
    });
    this.readerEl.querySelector('#rv-close-btn')?.addEventListener('click', () => this.closeReaderView());
  }

  public openSentenceBySentence(sourceText?: string): void {
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

  public closeSentenceBySentence(): void {
    this.isSentenceModeOpen = false;
    this.sentenceModalEl.hidden = true;
  }

  public stepSentence(delta: number): void {
    if (!this.isSentenceModeOpen || this.sentences.length === 0) return;
    this.sentenceIdx = Math.max(0, Math.min(this.sentences.length - 1, this.sentenceIdx + delta));
    this.renderSentenceCard();
    if (this.isReadingAloud && !this.isReadingPaused) {
      this.speakActiveSentenceLoop();
    }
  }

  public toggleSentenceTranslation(): void {
    if (!this.isSentenceModeOpen) return;
    this.showSentenceTranslation = !this.showSentenceTranslation;
    this.renderSentenceCard();
  }

  public jumpSentenceByUnknown(frequentOnly: boolean, dir: 1 | -1): void {
    const list = this.sentences.length ? this.sentences : splitIntoSentences(this.extractArticleFromPage().text);
    if (!list.length) return;
    for (let step = 1; step <= list.length; step++) {
      const idx = (this.sentenceIdx + dir * step + list.length) % list.length;
      const s = list[idx];
      // Check if sentence contains unknown/learning words
      const tempDiv = document.createElement('div');
      tempDiv.textContent = s;
      this.highlighter.scanAndHighlight(tempDiv);
      const candidates = Array.from(tempDiv.querySelectorAll<HTMLElement>('verba-w')).filter((w) => {
        const st = w.dataset.s;
        if (st !== '0' && st !== '1' && st !== '2' && st !== '3' && st !== '4') return false;
        if (frequentOnly) return Boolean(w.dataset.rank && Number(w.dataset.rank) <= 5000);
        return true;
      });
      if (candidates.length > 0) {
        this.sentenceIdx = idx;
        if (this.isSentenceModeOpen) this.renderSentenceCard();
        return;
      }
    }
  }

  private async renderSentenceCard(): Promise<void> {
    if (!this.isSentenceModeOpen) return;
    const current = this.sentences[this.sentenceIdx] || '';
    let trans = '';
    if (this.showSentenceTranslation && current) {
      if (this.sentenceTranslationCache.has(current)) {
        trans = this.sentenceTranslationCache.get(current)!;
      } else {
        const res = await sendBgMessage<{ translation: string }>({
          type: 'TRANSLATE',
          text: current,
          sourceLang: this.settings.activeLang,
        });
        trans = res?.translation || '';
        this.sentenceTranslationCache.set(current, trans);
      }
    }

    setHtmlContent(
      this.sentenceModalEl,
      `
      <div class="sentence-card" data-paper="${this.settings.readerTheme || 'dark'}">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:var(--ink-3);">
          <span>Sentence ${this.sentenceIdx + 1} / ${this.sentences.length}</span>
          <div style="display:flex;gap:6px;">
            <button type="button" class="wp-btn-ghost" id="sc-speak" title="Say sentence (Shift+V)">🔊</button>
            <button type="button" class="wp-btn-ghost" id="sc-trans" title="Toggle translation (E)">Translation</button>
            <button type="button" class="wp-btn-ghost" id="sc-pause-each" aria-pressed="${this.pauseAfterEachSentence}">${
              this.pauseAfterEachSentence ? '⏸ Pause each: ON' : 'Pause each'
            }</button>
            <button type="button" class="wp-btn-ghost" id="sc-close" title="Exit (Esc)">✕</button>
          </div>
        </div>
        <div class="sentence-body" id="sc-body">${esc(current)}</div>
        ${this.showSentenceTranslation ? `<div class="sentence-trans">${esc(trans)}</div>` : ''}
        <div class="sentence-controls">
          <button type="button" class="wp-btn-ghost" id="sc-prev">‹ Previous (A)</button>
          <span><kbd>A</kbd> / <kbd>D</kbd> turn · <kbd>E</kbd> translate · <kbd>Space</kbd> read aloud</span>
          <button type="button" class="wp-btn-ghost" id="sc-next">Next (D) ›</button>
        </div>
      </div>
    `
    );

    const bodyEl = this.sentenceModalEl.querySelector<HTMLElement>('#sc-body');
    if (bodyEl) {
      this.highlighter.scanAndHighlight(bodyEl);
      this.bindWordInteractions(bodyEl);
    }

    this.sentenceModalEl.querySelector('#sc-prev')?.addEventListener('click', () => this.stepSentence(-1));
    this.sentenceModalEl.querySelector('#sc-next')?.addEventListener('click', () => this.stepSentence(1));
    this.sentenceModalEl.querySelector('#sc-trans')?.addEventListener('click', () => this.toggleSentenceTranslation());
    this.sentenceModalEl.querySelector('#sc-speak')?.addEventListener('click', () => {
      speakText(current, this.settings.activeLang, this.settings);
    });
    this.sentenceModalEl.querySelector('#sc-pause-each')?.addEventListener('click', () => {
      this.pauseAfterEachSentence = !this.pauseAfterEachSentence;
      this.renderSentenceCard();
    });
    this.sentenceModalEl.querySelector('#sc-close')?.addEventListener('click', () => this.closeSentenceBySentence());
  }

  public toggleReadAloud(customText?: string): void {
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

  public pauseReadAloud(): void {
    if (!this.isReadingAloud || this.isReadingPaused) return;
    this.isReadingPaused = true;
    stopSpeaking();
    this.creditListeningElapsed();
    this.renderTtsBar();
  }

  public stopReadAloud(): void {
    if (!this.isReadingAloud) return;
    stopSpeaking();
    this.creditListeningElapsed();
    this.isReadingAloud = false;
    this.isReadingPaused = false;
    this.ttsBarEl.hidden = true;
  }

  private creditListeningElapsed(): void {
    if (!this.ttsStartedAt) return;
    const secs = Math.round((Date.now() - this.ttsStartedAt) / 1000);
    this.ttsStartedAt = 0;
    if (secs >= 2) {
      sendBgMessage({
        type: 'RECORD_LISTENING_SECONDS',
        lang: this.settings.activeLang,
        seconds: secs,
        title: `Read aloud · ${document.title || 'Page'}`,
        domain: location.hostname || 'reader',
      }).catch(() => {});
    }
  }

  private speakActiveSentenceLoop(): void {
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

  private renderTtsBar(): void {
    if (!this.isReadingAloud) {
      this.ttsBarEl.hidden = true;
      return;
    }
    this.ttsBarEl.hidden = false;
    setHtmlContent(
      this.ttsBarEl,
      `
      <button type="button" class="island-btn" id="tts-prev" title="Previous sentence">⏮</button>
      <button type="button" class="island-btn" id="tts-toggle">${this.isReadingPaused ? '▶ Resume' : '⏸ Pause'}</button>
      <button type="button" class="island-btn" id="tts-next" title="Next sentence">⏭</button>
      <span style="color:var(--ink-2);font-variant-numeric:tabular-nums;">${this.sentenceIdx + 1}/${this.sentences.length}</span>
      <select id="tts-speed" style="height:24px;border-radius:6px;background:var(--surface-2);color:var(--ink);border:1px solid var(--border);font-size:12px;">
        ${[0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
          .map((sp) => `<option value="${sp}" ${this.settings.voiceSpeed === sp ? 'selected' : ''}>${sp}×</option>`)
          .join('')}
      </select>
      <button type="button" class="island-btn" id="tts-stop" title="Stop Read Aloud (Esc)">✕</button>
    `
    );

    this.ttsBarEl.querySelector('#tts-prev')?.addEventListener('click', () => {
      this.sentenceIdx = Math.max(0, this.sentenceIdx - 1);
      this.speakActiveSentenceLoop();
    });
    this.ttsBarEl.querySelector('#tts-toggle')?.addEventListener('click', () => this.toggleReadAloud());
    this.ttsBarEl.querySelector('#tts-next')?.addEventListener('click', () => {
      this.sentenceIdx = Math.min(this.sentences.length - 1, this.sentenceIdx + 1);
      this.speakActiveSentenceLoop();
    });
    this.ttsBarEl.querySelector('#tts-speed')?.addEventListener('change', async (e) => {
      const sp = Number((e.target as HTMLSelectElement).value);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { voiceSpeed: sp } });
      if (!this.isReadingPaused) this.speakActiveSentenceLoop();
    });
    this.ttsBarEl.querySelector('#tts-stop')?.addEventListener('click', () => this.stopReadAloud());
  }

  public openAskAiModal(sentence: string, translation?: string): void {
    const cleanSent = sentence.trim() || this.sentences[this.sentenceIdx] || window.getSelection()?.toString().trim() || document.title;
    this.askModalEl.hidden = false;
    setHtmlContent(
      this.askModalEl,
      `
      <div class="ask-box">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:var(--ink);font-size:16px;">Ask your AI chat (${esc(this.settings.askAiChatProvider)})</b>
          <button type="button" class="wp-icon-btn" id="ask-close">✕</button>
        </div>
        <div class="ask-quote">${esc(cleanSent)}</div>
        <textarea class="ask-textarea" id="ask-input" placeholder="Ask a question about grammar, nuance, or why it is said this way… (Enter to ask)"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
          <button type="button" class="wp-btn-ghost" id="ask-cancel">Cancel</button>
          <button type="button" class="wp-btn-sm" id="ask-submit">Ask ↗</button>
        </div>
      </div>
    `
    );

    const textarea = this.askModalEl.querySelector<HTMLTextAreaElement>('#ask-input');
    textarea?.focus();

    const submit = () => {
      const q = textarea?.value || '';
      const built = buildAskAiChatUrl(this.settings, {
        sentence: cleanSent,
        context: cleanSent,
        title: document.title,
        lang: this.settings.activeLang,
        userQuestion: q,
        translation,
      });
      navigator.clipboard?.writeText(built.fullPrompt).catch(() => {});
      window.open(built.url, '_blank', 'noopener');
      this.askModalEl.hidden = true;
    };

    textarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      } else if (e.key === 'Escape') {
        this.askModalEl.hidden = true;
      }
    });
    this.askModalEl.querySelector('#ask-submit')?.addEventListener('click', submit);
    this.askModalEl.querySelector('#ask-cancel')?.addEventListener('click', () => {
      this.askModalEl.hidden = true;
    });
    this.askModalEl.querySelector('#ask-close')?.addEventListener('click', () => {
      this.askModalEl.hidden = true;
    });
  }
}

export function splitIntoSentences(text: string): string[] {
  const raw = text
    .split(/(?<=[.!?。！？\n])\s+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length >= 2);
  return raw;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
