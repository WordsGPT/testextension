import type {
  CustomDictionaryMeta,
  LangCode,
  PerLanguageOptions,
  VerbaSettings,
  WordRecord,
  WordStatus,
} from '../shared/types';
import type { LoadedLangIndex } from '../shared/dictionary';
import { resolveTrackingKey } from '../shared/dictionary';
import { formatWordReading, segmentText } from '../shared/segmenter';
import { textLooksLikeLanguage } from '../shared/languages';
import { buildPageHighlightStyles } from './styles';
import { sendBgMessage } from '../shared/messaging';

const SKIP_TAGS = new Set([
  'A',
  'BUTTON',
  'LABEL',
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
  'CODE',
  'PRE',
  'SVG',
  'MATH',
  'CANVAS',
  'VIDEO',
  'AUDIO',
  'IFRAME',
  'RT',
  'RP',
  'KBD',
  'VERBA-W',
]);

export interface PageWordCounts {
  newWords: number;
  learningWords: number;
  knownWordsOnPage: number;
  allBlueKeys: string[];
}

export class VerbaHighlighter {
  private styleEl: HTMLStyleElement | null = null;
  private observer: MutationObserver | null = null;
  private mutationTimer: number | null = null;
  private readingTimer: number | null = null;
  private lastUserActivityAt = Date.now();
  private observedParagraphs = new WeakSet<Element>();
  private paragraphTimers = new Map<Element, number>();
  private io: IntersectionObserver | null = null;

  public lang: LangCode;
  public settings: VerbaSettings;
  public langOpts: PerLanguageOptions;
  public dictIndex: LoadedLangIndex;
  public wordMap = new Map<string, WordRecord>();
  public customDicts: CustomDictionaryMeta[] = [];
  public onCountsChanged?: (counts: PageWordCounts) => void;

  private rootContainer: ParentNode;
  private isBookOrReader: boolean;

  constructor(params: {
    lang: LangCode;
    settings: VerbaSettings;
    langOpts: PerLanguageOptions;
    dictIndex: LoadedLangIndex;
    words: WordRecord[];
    customDicts?: CustomDictionaryMeta[];
    rootContainer?: ParentNode;
    isBookOrReader?: boolean;
    onCountsChanged?: (counts: PageWordCounts) => void;
  }) {
    this.lang = params.lang;
    this.settings = params.settings;
    this.langOpts = params.langOpts;
    this.dictIndex = params.dictIndex;
    this.customDicts = params.customDicts || [];
    this.rootContainer = params.rootContainer || document.body;
    this.isBookOrReader = Boolean(params.isBookOrReader);
    this.onCountsChanged = params.onCountsChanged;
    this.setWords(params.words);
  }

  public setWords(words: WordRecord[]): void {
    this.wordMap.clear();
    for (const w of words) {
      if (!w.deleted) {
        this.wordMap.set(w.word, w);
      }
    }
  }

  public injectStyles(targetDoc: Document | ShadowRoot = document): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = 'verba-highlight-styles';
      if (targetDoc instanceof Document) {
        (targetDoc.head || targetDoc.documentElement).appendChild(this.styleEl);
      } else {
        targetDoc.appendChild(this.styleEl);
      }
    }
    this.styleEl.textContent = buildPageHighlightStyles(this.settings);
  }

  public getPhrasesAndCustomLexicon(): { lexicon: Set<string>; phrases: Set<string>; overrides: Map<string, string> } {
    const lexicon = new Set(this.dictIndex.lexiconSet);
    const phrases = new Set<string>();
    const overrides = new Map<string, string>();
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

  public computeStatusAttr(key: string, surface: string, lemmaHint?: string): { statusAttr: string; readingHtml?: string } {
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

    let statusNum: WordStatus = rec ? rec.status : 0;
    let statusAttr = String(statusNum);

    if (statusNum === 0) {
      // Check Chinese/Cantonese cross-script Known -> green!
      if ((this.lang === 'zh' || this.lang === 'yue') && this.langOpts.unifyScripts && entry) {
        const alt = entry.w === surface ? entry.alt : entry.w;
        if (alt && alt !== surface && this.wordMap.get(alt)?.status === 5) {
          statusAttr = 'green';
        }
      }
      // Check Special words (names & places)
      if (statusAttr === '0' && this.settings.specialWordsHighlight && entry?.special) {
        statusAttr = 'special';
      }
      // Check frequency band filter if active (top500..top10000)
      if (statusAttr === '0' && this.settings.vocabBandFilter && this.settings.vocabBandFilter !== 'all') {
        const limit = Number(this.settings.vocabBandFilter.replace('top', ''));
        if (limit > 0 && (!entry?.rank || entry.rank > limit)) {
          statusAttr = 'band_muted';
        }
      }
    }

    // Check Readings above characters
    let readingHtml: string | undefined;
    if (this.langOpts.readingsEnabled) {
      const scope = this.langOpts.readingScope;
      const shouldAnnotate =
        scope === 'every_word' ||
        (scope === 'new_only' && statusNum === 0) ||
        (scope === 'new_learning' && statusNum >= 0 && statusNum <= 3);

      if (shouldAnnotate) {
        const formatted = formatWordReading(
          surface,
          this.lang,
          this.langOpts.readingNotation,
          rec?.reading || entry?.r,
          entry?.r2
        );
        if (formatted?.reading) {
          if (formatted.kanjiStem !== undefined) {
            readingHtml = `<ruby class="verba-ruby">${escapeHtml(formatted.kanjiStem)}<rt>${escapeHtml(
              formatted.reading
            )}</rt></ruby>${escapeHtml(formatted.okurigana || '')}`;
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

  public scanAndHighlight(root: ParentNode = this.rootContainer): void {
    const { lexicon, phrases, overrides } = this.getPhrasesAndCustomLexicon();
    const textNodes: Text[] = [];

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('a, button, [role="link"], [role="button"], verba-w, #verba-ui-root, [data-verba-ignore="1"], [contenteditable="true"], code, pre, script, style, rt')) {
          return NodeFilter.FILTER_REJECT;
        }
        const val = node.nodeValue || '';
        if (!/[\p{L}]/u.test(val)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let current: Node | null;
    while ((current = walker.nextNode())) {
      textNodes.push(current as Text);
    }

    for (const textNode of textNodes) {
      const text = textNode.nodeValue || '';
      if (this.langOpts.onlyHighlightTargetText && !this.isBookOrReader) {
        const blockText = textNode.parentElement?.textContent || text;
        if (!textLooksLikeLanguage(blockText, this.lang)) continue;
      }

      const tokens = segmentText(text, this.lang, lexicon, phrases);
      if (!tokens.some((t) => t.isWord)) continue;

      const frag = document.createDocumentFragment();
      const createdEls: (HTMLElement | null)[] = [];

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

        const el = document.createElement('verba-w');
        el.dataset.w = tok.text;
        el.dataset.key = key;
        el.dataset.s = statusAttr;
        if (tok.lemmaHint) el.dataset.lemma = tok.lemmaHint;
        if (resolved.primaryEntry?.rank) el.dataset.rank = String(resolved.primaryEntry.rank);

        // Preserve existing native <ruby> inside Japanese books without duplicating furigana
        const insideNativeRuby = Boolean(textNode.parentElement?.closest('ruby'));
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
   * Re-renders a paragraph cleanly (e.g. when user merges characters into a custom word or splits one).
   */
  public rehighlightContainer(container: Element): void {
    const wrappers = Array.from(container.querySelectorAll<HTMLElement>('verba-w'));
    for (const w of wrappers) {
      const raw = w.dataset.w || w.textContent || '';
      w.replaceWith(document.createTextNode(raw));
    }
    container.normalize();
    this.scanAndHighlight(container);
  }

  /**
   * Fast in-place highlight update across all existing <verba-w> elements when vocabulary changes.
   */
  public refreshAllStatuses(resegmentIfCustom = false): void {
    this.injectStyles();
    if (resegmentIfCustom) {
      const blocks = new Set<Element>();
      for (const el of Array.from(this.rootContainer.querySelectorAll('verba-w'))) {
        if (el.parentElement) blocks.add(el.parentElement);
      }
      for (const b of blocks) this.rehighlightContainer(b);
      this.emitCounts();
      return;
    }

    const elements = this.rootContainer.querySelectorAll<HTMLElement>('verba-w');
    for (const el of Array.from(elements)) {
      const surface = el.dataset.w || el.textContent || '';
      const key = el.dataset.key || surface;
      const lemmaHint = el.dataset.lemma;
      const { statusAttr, readingHtml } = this.computeStatusAttr(key, surface, lemmaHint);
      el.dataset.s = statusAttr;
      const insideNativeRuby = Boolean(el.parentElement?.closest('ruby:not(.verba-ruby)'));
      if (readingHtml && !insideNativeRuby) {
        el.innerHTML = readingHtml;
      } else if (el.querySelector('ruby.verba-ruby')) {
        el.textContent = surface;
      }
    }
    this.emitCounts();
  }

  public getCounts(): PageWordCounts {
    const newSet = new Set<string>();
    const learnSet = new Set<string>();
    const knownSet = new Set<string>();

    const elements = this.rootContainer.querySelectorAll<HTMLElement>('verba-w');
    for (const el of Array.from(elements)) {
      const key = el.dataset.key || el.dataset.w || '';
      if (!key) continue;
      const s = el.dataset.s;
      if (s === '0' || s === 'green') newSet.add(key);
      else if (s === '1' || s === '2' || s === '3' || s === '4') learnSet.add(key);
      else if (s === '5') knownSet.add(key);
    }

    return {
      newWords: newSet.size,
      learningWords: learnSet.size,
      knownWordsOnPage: knownSet.size,
      allBlueKeys: Array.from(newSet),
    };
  }

  public emitCounts(): void {
    if (this.onCountsChanged) {
      this.onCountsChanged(this.getCounts());
    }
  }

  /**
   * Chatbot & SPA streaming observer: waits a beat (~420ms) after mutations settle so streaming tokens
   * aren't wrapped mid-word!
   */
  public startMutationObserver(): void {
    if (this.observer) return;
    const isChatbotHost = /chatgpt\.com|openai\.com|claude\.ai|gemini\.google\.com|perplexity\.ai|grok\.com/i.test(
      location.hostname
    );
    const settleDelay = isChatbotHost ? 480 : 260;

    this.observer = new MutationObserver((mutations) => {
      let hasExternalText = false;
      for (const m of mutations) {
        if (m.target instanceof Element && m.target.closest('#verba-ui-root, verba-w')) continue;
        if (m.addedNodes.length > 0 || m.type === 'characterData') {
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
      characterData: true,
    });
  }

  /**
   * Honest Reading Counter ("Words read are credited only for text on screen long enough to be read").
   */
  private setupHonestReadingObserver(root: ParentNode): void {
    if (this.settings.countWordsReadWhere === 'reader_and_books' && !this.isBookOrReader) {
      return;
    }

    const markActive = () => {
      this.lastUserActivityAt = Date.now();
    };
    window.addEventListener('scroll', markActive, { passive: true });
    window.addEventListener('mousemove', markActive, { passive: true });
    window.addEventListener('keydown', markActive, { passive: true });

    if (!this.io && typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target;
            if (entry.isIntersecting) {
              if (this.paragraphTimers.has(el)) continue;
              const wordCount = el.querySelectorAll('verba-w').length;
              if (wordCount < 3) continue;
              // At ~180 wpm (3 words/sec), require realistic dwell time (min 1.5s, capped for responsiveness)
              const dwellMs = Math.min(8000, Math.max(1500, Math.round((wordCount / 3.5) * 1000)));
              const timerId = window.setTimeout(() => {
                this.paragraphTimers.delete(el);
                const recentlyActive = Date.now() - this.lastUserActivityAt < 120000;
                if (document.visibilityState === 'visible' && recentlyActive) {
                  const snippet = (el.textContent || '').trim().slice(0, 64);
                  const paraKey = `${location.href}:${snippet}`;
                  sendBgMessage({
                    type: 'RECORD_READING_WORDS',
                    lang: this.lang,
                    count: wordCount,
                    paragraphKey: paraKey,
                  }).catch(() => {});
                }
              }, dwellMs);
              this.paragraphTimers.set(el, timerId);
            } else {
              const t = this.paragraphTimers.get(el);
              if (t !== undefined) {
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
      const blocks = root.querySelectorAll('p, li, blockquote, article div');
      for (const b of Array.from(blocks)) {
        if (this.observedParagraphs.has(b)) continue;
        if (b.closest('nav, header, footer, aside')) continue;
        if (b.querySelectorAll('verba-w').length >= 3) {
          this.observedParagraphs.add(b);
          this.io.observe(b);
        }
      }
    }
  }

  public destroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.io?.disconnect();
    this.io = null;
    if (this.readingTimer) window.clearTimeout(this.readingTimer);
    for (const t of this.paragraphTimers.values()) window.clearTimeout(t);
    this.paragraphTimers.clear();
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
