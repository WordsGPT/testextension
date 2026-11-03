import type {
  AIVerdictData,
  LangCode,
  LookupResult,
  PerLanguageOptions,
  VerbaSettings,
  WordStatus,
} from '../shared/types';
import { formatOrdinal } from '../shared/dictionary';
import { sendBgMessage } from '../shared/messaging';
import { speakText } from '../shared/tts';
import { setHtmlContent } from '../shared/dom';

export interface WordPanelCallbacks {
  onGrade: (word: string, status: WordStatus, extra?: {
    isPhrase?: boolean;
    isCustomSegment?: boolean;
    customMeaning?: string;
    aiMeaning?: string;
    lemmaOverride?: string;
    contextSentence?: string;
  }) => Promise<void>;
  onSplitCustomWord: (word: string) => Promise<void>;
  onExtendSelection: (dir: 'left_add' | 'left_trim' | 'right_trim' | 'right_add') => void;
  onOpenAskAiChat: (sentence: string) => void;
  onRevertDiglot?: (el: HTMLElement) => void;
  onClose?: () => void;
}

export class VerbaWordPanel {
  private el: HTMLElement;
  public isOpen = false;
  public isPinned = false;
  public activeLookup: LookupResult | null = null;
  public anchorRect: DOMRect | null = null;
  public contextSentence = '';
  public fullParagraphText = '';
  public activeElement: HTMLElement | null = null;

  private activeTab: 'meaning' | 'characters' = 'meaning';
  private entryIdx = 0;
  private listAllEntries = false;
  private editingMeaning = false;
  private extenderOpen = false;
  private lookUpMenuOpen = false;
  private ankiPickerOpen = false;
  private tickedMeanings: string[] = [];
  private editedSentence = '';
  private editedTranslation = '';
  private googleTranslation = '';
  private aiLoading = false;
  private aiError = '';
  private aiVerdict: AIVerdictData | null = null;
  private editingAiMeaning = false;
  private statusToast = '';
  private lookupSeq = 0;

  constructor(
    private shadow: ShadowRoot,
    public settings: VerbaSettings,
    public langOpts: PerLanguageOptions,
    private callbacks: WordPanelCallbacks
  ) {
    this.el = document.createElement('div');
    this.el.className = 'verba-panel';
    this.el.hidden = true;
    this.shadow.appendChild(this.el);
  }

  public get panelElement(): HTMLElement {
    return this.el;
  }

  public async openForWord(params: {
    query: string;
    lang: LangCode;
    pinned: boolean;
    rect: DOMRect;
    element?: HTMLElement | null;
    sentence?: string;
    paragraph?: string;
    lemmaHint?: string;
    isSelectionPhrase?: boolean;
    runAiImmediately?: boolean;
  }): Promise<void> {
    this.isOpen = true;
    this.isPinned = params.pinned;
    this.anchorRect = params.rect;
    this.activeElement = params.element || null;
    this.contextSentence = params.sentence || '';
    this.fullParagraphText = params.paragraph || params.sentence || '';
    this.editedSentence = this.contextSentence;
    this.editedTranslation = '';
    this.activeTab = 'meaning';
    this.entryIdx = 0;
    this.listAllEntries = false;
    this.editingMeaning = false;
    this.extenderOpen = false;
    this.lookUpMenuOpen = false;
    this.ankiPickerOpen = false;
    this.tickedMeanings = [];
    this.googleTranslation = '';
    this.aiError = '';
    this.editingAiMeaning = false;
    this.statusToast = '';

    const seq = ++this.lookupSeq;
    const lookup = await sendBgMessage<LookupResult>({
      type: 'LOOKUP_WORD',
      word: params.query,
      lang: params.lang,
      sentence: this.settings.contextMeaningFirst ? this.contextSentence : undefined,
      lemmaHint: params.lemmaHint,
      incrementLookup: params.pinned,
    });

    if (seq !== this.lookupSeq || !this.isOpen) return;

    this.activeLookup = lookup;
    this.aiVerdict = lookup.record?.aiVerdict || null;

    // Auto-translate missing words or selected phrases when enabled
    if (
      this.settings.translateMissingWords &&
      (lookup.entries.length === 0 || params.isSelectionPhrase)
    ) {
      sendBgMessage<{ translation: string }>({
        type: 'TRANSLATE',
        text: params.query,
        sourceLang: params.lang,
      })
        .then((res) => {
          if (this.activeLookup?.query === params.query && res?.translation) {
            this.googleTranslation = res.translation;
            this.render();
          }
        })
        .catch(() => {});
    }

    this.render();
    this.positionNear(params.rect);

    if (params.runAiImmediately) {
      this.triggerAiCheck();
    }
  }

  public close(): void {
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

  public toggleCharactersTab(): void {
    if (!this.activeLookup?.characters?.length) return;
    this.activeTab = this.activeTab === 'meaning' ? 'characters' : 'meaning';
    this.render();
  }

  public stepEntry(delta: number): void {
    if (!this.activeLookup || this.activeLookup.entries.length <= 1) return;
    const len = this.activeLookup.entries.length;
    this.entryIdx = (this.entryIdx + delta + len) % len;
    this.listAllEntries = false;
    this.render();
  }

  public toggleListAllEntries(): void {
    if (!this.activeLookup || this.activeLookup.entries.length <= 1) return;
    this.listAllEntries = !this.listAllEntries;
    this.render();
  }

  public openCustomMeaningEditor(): void {
    if (!this.isOpen) return;
    this.isPinned = true;
    this.editingMeaning = true;
    this.render();
    const input = this.el.querySelector<HTMLInputElement>('#wp-meaning-input');
    input?.focus();
  }

  public async triggerGoogleTranslate(): Promise<void> {
    if (!this.activeLookup) return;
    const res = await sendBgMessage<{ translation: string }>({
      type: 'TRANSLATE',
      text: this.activeLookup.query,
      sourceLang: this.settings.activeLang,
    });
    if (res?.translation) {
      this.googleTranslation = res.translation;
      this.render();
    }
  }

  public openFirstDictionaryLink(): void {
    if (!this.activeLookup) return;
    const first = this.langOpts.dictionaryLinks[0];
    if (first) {
      const url = first.urlTemplate.replace('{word}', encodeURIComponent(this.activeLookup.lemma || this.activeLookup.query));
      window.open(url, '_blank', 'noopener');
    }
  }

  public async triggerAiCheck(): Promise<void> {
    if (!this.activeLookup) return;
    this.isPinned = true;
    this.aiLoading = true;
    this.aiError = '';
    this.render();
    try {
      const res = await sendBgMessage<{ ok: boolean; verdict?: AIVerdictData; error?: string }>({
        type: 'AI_CHECK_WORD',
        word: this.activeLookup.query,
        lang: this.settings.activeLang,
        sentence: this.contextSentence,
      });
      if (!res.ok || !res.verdict) {
        this.aiError = res.error || 'AI check failed.';
      } else {
        this.aiVerdict = res.verdict;
      }
    } catch (err) {
      this.aiError = err instanceof Error ? err.message : String(err);
    } finally {
      this.aiLoading = false;
      this.render();
    }
  }

  public openAnkiMeaningPicker(): void {
    if (!this.activeLookup) return;
    this.isPinned = true;
    this.ankiPickerOpen = !this.ankiPickerOpen;
    this.editedSentence = this.contextSentence;
    this.render();
  }

  public tickAnkiMeaningByNumber(num1Based: number): boolean {
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

  public async sendCurrentToAnki(customPickedMeanings?: string[]): Promise<void> {
    if (!this.activeLookup) return;
    const entry = this.activeLookup.entries[0];
    const meanings =
      customPickedMeanings && customPickedMeanings.length > 0
        ? customPickedMeanings
        : this.activeLookup.record?.customMeaning
        ? [this.activeLookup.record.customMeaning]
        : this.collectAllMeanings();

    this.statusToast = 'On its way to Anki…';
    this.render();

    const res = await sendBgMessage<{ ok: boolean; deck?: string; action?: string; error?: string }>({
      type: 'ANKI_SEND_WORD',
      payload: {
        lang: this.settings.activeLang,
        word: this.activeLookup.lemma || this.activeLookup.query,
        reading: entry?.r || this.activeLookup.record?.reading,
        pitch: entry?.pitch,
        meanings,
        sentence: (this.editedSentence || this.contextSentence).slice(0, 600),
        sentenceTranslation: this.editedTranslation || undefined,
        pickedByHand: true,
      },
    });

    if (res.ok) {
      this.statusToast = `Saved to Anki (${res.deck})`;
      this.ankiPickerOpen = false;
    } else {
      this.statusToast = res.error || 'Anki not reachable';
    }
    this.render();
  }

  private collectAllMeanings(): string[] {
    if (!this.activeLookup) return [];
    const list: string[] = [];
    if (this.activeLookup.record?.customMeaning) list.push(this.activeLookup.record.customMeaning);
    if (this.activeLookup.record?.aiMeaning) list.push(this.activeLookup.record.aiMeaning);
    for (const e of this.activeLookup.entries) {
      for (const m of e.m) if (!list.includes(m)) list.push(m);
    }
    if (list.length === 0 && this.googleTranslation) list.push(this.googleTranslation);
    return list;
  }

  private positionNear(rect: DOMRect): void {
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

  public render(): void {
    const lk = this.activeLookup;
    if (!this.isOpen || !lk) {
      this.el.hidden = true;
      return;
    }

    this.el.dataset.size = this.settings.wordPanel.size;
    const curStatus: WordStatus = lk.record?.status ?? 0;
    const statusLabels: Record<string, string> = {
      '0': lk.crossScriptKnown ? 'Known in other script' : 'New',
      '1': 'Level 1',
      '2': 'Level 2',
      '3': 'Level 3',
      '4': 'Level 4',
      '5': 'Known',
      '-1': 'Ignored',
    };

    const entries = lk.entries;
    const activeEntry = entries[this.entryIdx] || entries[0];
    const headword = activeEntry?.w || lk.lemma || lk.query;
    const altForm =
      activeEntry?.alt && activeEntry.alt !== headword
        ? activeEntry.alt
        : lk.query !== headword
        ? lk.query
        : '';

    const genderAttr =
      this.settings.activeLang === 'de' && activeEntry?.gender ? `data-gender="${activeEntry.gender}"` : '';

    const readingText = this.settings.wordPanel.showReading ? activeEntry?.r || lk.record?.reading || '' : '';
    const pitchHtml =
      this.langOpts.pitchAccent && activeEntry?.pitch
        ? `<span class="wp-pitch">${esc(activeEntry.pitch)}</span>`
        : '';
    const rankHtml = lk.rank ? `<span class="wp-rank">${formatOrdinal(lk.rank)} most common</span>` : '';

    const showEntriesOneByOne = this.settings.entriesOneAtATime && entries.length > 1 && !this.listAllEntries;
    const visibleEntries = showEntriesOneByOne ? [activeEntry] : entries;

    // Meanings list
    const meaningItemsHtml: string[] = [];
    if (lk.record?.customMeaning) {
      meaningItemsHtml.push(
        `<li class="wp-meaning-item"><span class="wp-tag yours">Yours</span><span>${esc(lk.record.customMeaning)}</span></li>`
      );
    }
    if (lk.record?.aiMeaning) {
      meaningItemsHtml.push(
        `<li class="wp-meaning-item"><span class="wp-tag ai">✦ AI</span><span>${esc(lk.record.aiMeaning)}</span></li>`
      );
    }
    for (const ent of visibleEntries) {
      if (!ent) continue;
      for (const m of ent.m) {
        const tag = ent.dictName ? `<span class="wp-tag">${esc(ent.dictName)}</span>` : ent.pos ? `<span class="wp-tag">${esc(ent.pos)}</span>` : '';
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
        `<li class="wp-meaning-item" style="color:var(--ink-3)">Not in bundled dictionary. Press <kbd>G</kbd> to translate or <kbd>✦</kbd> to ask AI.</li>`
      );
    }

    // Character-by-character gloss for compounds not in dictionary
    const compoundGlossHtml =
      entries.length === 0 && lk.charByCharGloss?.length
        ? `<div class="wp-section">
            <div class="wp-section-title">Character-by-character</div>
            ${lk.charByCharGloss
              .map((c) => `<div><b>${esc(c.char)}</b> <span style="color:var(--ink-3)">${esc(c.reading)}</span> — ${esc(c.meaning)}</div>`)
              .join('')}
          </div>`
        : '';

    // Tabs for CJK (Meaning | Characters)
    const tabsHtml = lk.characters?.length
      ? `<div class="wp-tabs">
          <button type="button" class="wp-tab" data-tab="meaning" aria-selected="${this.activeTab === 'meaning'}">Meaning</button>
          <button type="button" class="wp-tab" data-tab="characters" aria-selected="${this.activeTab === 'characters'}">Characters (B)</button>
        </div>`
      : '';

    const charactersBodyHtml =
      this.activeTab === 'characters' && lk.characters?.length
        ? `<div style="margin-top:10px;display:grid;gap:8px;">
            ${lk.characters
              .map(
                (c) => `<div style="padding:8px 10px;border-radius:8px;background:var(--surface-2);">
                  <div style="display:flex;align-items:baseline;gap:8px;">
                    <span style="font-size:20px;color:var(--ink);font-family:var(--serif)">${esc(c.char)}</span>
                    <span style="color:var(--ink-2)">${esc(c.reading)}</span>
                    <span>${esc(c.meaning)}</span>
                  </div>
                  <div style="margin-top:4px;font-size:12px;color:var(--ink-3)">
                    Built from: ${c.components.map(([rad, gloss]) => `<b>${esc(rad)}</b> (${esc(gloss)})`).join(' + ')}
                  </div>
                </div>`
              )
              .join('')}
          </div>`
        : '';

    // Entry pager (‹ 1 / 3 ›)
    const pagerHtml =
      entries.length > 1
        ? `<div class="wp-pager">
            <button type="button" class="wp-icon-btn" id="wp-prev-entry" title="Previous entry (Shift+N)">‹</button>
            <button type="button" class="wp-btn-ghost" id="wp-list-entries" title="List all entries (L)">${
              this.listAllEntries ? 'One at a time' : `${this.entryIdx + 1} / ${entries.length}`
            }</button>
            <button type="button" class="wp-icon-btn" id="wp-next-entry" title="Next entry (N)">›</button>
          </div>`
        : '';

    // Parts of … (Japanese / Korean deinflection)
    const partsHtml = lk.partsOf?.length
      ? `<div class="wp-section">
          <div class="wp-section-title">Parts of ${esc(lk.query)}</div>
          ${lk.partsOf.map((p) => `<div><b>${esc(p.part)}</b> · <span style="color:var(--ink-3)">${esc(p.role)}</span></div>`).join('')}
        </div>`
      : '';

    // Could also be …
    const couldAlsoBeHtml = lk.couldAlsoBe.length
      ? `<div class="wp-section">
          <div class="wp-section-title">Could also be</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${lk.couldAlsoBe
              .map(
                (c) =>
                  `<button type="button" class="wp-btn-ghost wp-lemma-pick" data-lemma="${esc(c.lemma)}"><b>${esc(
                    c.lemma
                  )}</b> · ${esc(c.gloss.slice(0, 28))}</button>`
              )
              .join('')}
          </div>
        </div>`
      : '';

    // Pinned-only sections
    const topIconsHtml = this.isPinned
      ? `<div class="wp-actions">
          <button type="button" class="wp-icon-btn" id="wp-speak-word" title="Say word (V)">🔊</button>
          <button type="button" class="wp-icon-btn" id="wp-speak-sent" title="Read sentence aloud (Shift+V)">🗣</button>
          <button type="button" class="wp-icon-btn" id="wp-extend-btn" title="Longer or shorter word (↔)">↔</button>
          <button type="button" class="wp-icon-btn" id="wp-edit-meaning" title="Your own meaning (M)">✎</button>
          <button type="button" class="wp-icon-btn" id="wp-translate-btn" title="Google Translate (G)">文</button>
          <button type="button" class="wp-icon-btn" id="wp-lookup-btn" title="Look up in other dictionaries (T)">📖</button>
          ${
            this.settings.ankiShowButtonInPanel
              ? `<button type="button" class="wp-icon-btn" id="wp-anki-btn" title="${
                  lk.record?.ankiDeck ? `In Anki (${lk.record.ankiDeck})` : 'Add to Anki (P / Shift+P)'
                }">★</button>`
              : ''
          }
          <button type="button" class="wp-icon-btn" id="wp-ai-btn" title="Ask AI if this is a real word (A)">✦</button>
          <button type="button" class="wp-icon-btn" id="wp-close-btn" title="Close (Esc)">✕</button>
        </div>`
      : '';

    const extenderHtml = this.extenderOpen
      ? `<div class="wp-section" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="color:var(--ink-3)">Length:</span>
          <button type="button" class="wp-btn-ghost" data-ext="left_add" title="Extend left">◀+</button>
          <button type="button" class="wp-btn-ghost" data-ext="left_trim" title="Trim left">+▶</button>
          <button type="button" class="wp-btn-ghost" data-ext="right_trim" title="Trim right">◀−</button>
          <button type="button" class="wp-btn-ghost" data-ext="right_add" title="Extend right">+▶</button>
          ${
            lk.record?.isCustomSegment
              ? `<button type="button" class="wp-btn-ghost" id="wp-split-custom">Split into words</button>`
              : ''
          }
        </div>`
      : '';

    const lookupMenuHtml =
      this.lookUpMenuOpen || (this.isPinned && this.settings.wordPanel.dictLinksInline)
        ? `<div class="wp-section" style="display:flex;flex-wrap:wrap;gap:6px;">
            ${this.langOpts.dictionaryLinks
              .map(
                (dl) =>
                  `<a href="${esc(
                    dl.urlTemplate.replace('{word}', encodeURIComponent(lk.lemma || lk.query))
                  )}" target="_blank" rel="noopener" class="wp-btn-ghost" style="text-decoration:none;display:inline-flex;align-items:center;">${esc(
                    dl.name
                  )} ↗</a>`
              )
              .join('')}
            <button type="button" class="wp-btn-ghost" id="wp-ask-ai-chat">Ask ${esc(
              this.settings.askAiChatProvider
            )} about this (Shift+I)</button>
          </div>`
        : '';

    const customMeaningBoxHtml = this.editingMeaning
      ? `<form class="wp-custom-box" id="wp-meaning-form">
          <input id="wp-meaning-input" class="wp-input" type="text" placeholder="Write a meaning in your own words…" value="${esc(
            lk.record?.customMeaning || ''
          )}" autocomplete="off">
          <button type="submit" class="wp-btn-sm">Save</button>
        </form>`
      : '';

    const aiBoxHtml =
      this.aiLoading || this.aiError || this.aiVerdict
        ? `<div class="wp-section">
            <div class="wp-section-title">✦ AI Check</div>
            ${
              this.aiLoading
                ? `<div style="color:var(--ink-3)">Checking with ${esc(this.settings.aiProvider)}…</div>`
                : this.aiError
                ? `<div style="color:#fca5a5">${esc(this.aiError)}</div>`
                : this.aiVerdict
                ? `<div>
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                      <span class="wp-tag ai">${esc(
                        this.aiVerdict.verdict === 'real'
                          ? 'Real word'
                          : this.aiVerdict.verdict === 'narrow'
                          ? 'Real, but narrow'
                          : this.aiVerdict.verdict === 'not_a_word'
                          ? 'Not a word'
                          : 'Uncertain'
                      )}</span>
                      <span style="font-size:11px;color:var(--ink-3)">${esc(this.aiVerdict.confidence)} confidence</span>
                    </div>
                    ${
                      this.aiVerdict.verdict !== 'not_a_word'
                        ? `<div style="color:var(--ink);margin:4px 0;"><b>${esc(this.aiVerdict.shortMeaning)}</b> — ${esc(
                            this.aiVerdict.meaning
                          )}</div>`
                        : ''
                    }
                    ${
                      this.aiVerdict.exampleSentence
                        ? `<div style="color:var(--ink-2);margin-top:4px;"><i>${esc(
                            this.aiVerdict.exampleSentence
                          )}</i><br><span style="color:var(--ink-3)">${esc(this.aiVerdict.exampleTranslation || '')}</span></div>`
                        : ''
                    }
                    <div style="color:var(--ink-3);margin-top:4px;">Why: ${esc(this.aiVerdict.reasoning)}</div>
                    ${
                      this.aiVerdict.customAnswer
                        ? `<div style="margin-top:6px;"><b>Your question:</b> ${esc(this.aiVerdict.customAnswer)}</div>`
                        : ''
                    }
                    ${
                      this.aiVerdict.shortMeaning && this.aiVerdict.verdict !== 'not_a_word'
                        ? this.editingAiMeaning
                          ? `<form class="wp-custom-box" id="wp-ai-edit-form">
                              <input id="wp-ai-edit-input" class="wp-input" value="${esc(this.aiVerdict.shortMeaning)}">
                              <button type="submit" class="wp-btn-sm">Save as yours</button>
                            </form>`
                          : `<div style="display:flex;gap:6px;margin-top:6px;">
                              <button type="button" class="wp-btn-sm" id="wp-save-ai-meaning">✦ Save as its meaning</button>
                              <button type="button" class="wp-btn-ghost" id="wp-edit-ai-meaning" title="Edit before saving">✎</button>
                            </div>`
                        : ''
                    }
                  </div>`
                : ''
            }
          </div>`
        : this.isPinned && entries.length === 0
        ? `<div class="wp-section">
            <button type="button" class="wp-btn-ghost" id="wp-ask-ai-verdict">✦ Ask AI if this is a real word</button>
          </div>`
        : '';

    const allMeaningsForAnki = this.collectAllMeanings();
    const ankiPickerHtml = this.ankiPickerOpen
      ? `<div class="wp-section">
          <div class="wp-section-title">Anki Card Builder (Shift+P)</div>
          <div style="display:flex;gap:4px;margin-bottom:4px;flex-wrap:wrap;">
            <button type="button" class="wp-btn-ghost" data-sent-adj="start_more">+ word start</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="start_less">− word start</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="end_less">− word end</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="end_more">+ word end</button>
            <button type="button" class="wp-btn-ghost" data-sent-adj="reset">Reset</button>
          </div>
          <input id="wp-anki-sent" class="wp-input" style="width:100%;margin-bottom:6px;" value="${esc(
            this.editedSentence
          )}" placeholder="Sentence on card (up to 600 chars)">
          <div style="display:grid;gap:4px;margin-bottom:8px;">
            ${allMeaningsForAnki
              .map(
                (m, idx) => `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                  <input type="checkbox" class="wp-anki-chk" data-m="${esc(m)}" ${
                  this.tickedMeanings.includes(m) ? 'checked' : ''
                }>
                  <kbd>${idx + 1}</kbd> <span>${esc(m)}</span>
                </label>`
              )
              .join('')}
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="wp-btn-sm" id="wp-anki-confirm">Add to Anki</button>
            <button type="button" class="wp-btn-ghost" id="wp-anki-cancel">Cancel</button>
          </div>
        </div>`
      : '';

    const gradesHtml =
      this.isPinned && this.settings.wordPanel.showGradeButtons
        ? `<div class="wp-grades">
            ${([1, 2, 3, 4] as WordStatus[])
              .map(
                (lvl) => `<button type="button" class="wp-grade-btn" data-grade="${lvl}" aria-pressed="${
                  curStatus === lvl
                }" title="Level ${lvl} (key ${lvl}; click again for New)">
                  <span>${lvl}</span>
                  <span class="wp-swatch s${lvl}"></span>
                </button>`
              )
              .join('')}
            <button type="button" class="wp-grade-btn" data-grade="5" aria-pressed="${
              curStatus === 5
            }" title="Mark Known (K)">
              <span>Known</span>
              <span class="wp-swatch sk"></span>
            </button>
            <button type="button" class="wp-grade-btn" data-grade="-1" aria-pressed="${
              curStatus === -1
            }" title="Ignore (X)">
              <span>Ignore</span>
              <span class="wp-swatch sx"></span>
            </button>
          </div>
          <div class="wp-hint-foot">
            <span><kbd>1</kbd>–<kbd>4</kbd> level</span>
            <span><kbd>K</kbd> known</span>
            <span><kbd>X</kbd> ignore</span>
            <span><kbd>0</kbd> new</span>
            ${lk.record?.lookupCount ? `<span>👀 ${lk.record.lookupCount}</span>` : ''}
          </div>`
        : '';

    const toastHtml = this.statusToast
      ? `<div style="margin-top:6px;font-size:12px;color:#93c5fd;">${esc(this.statusToast)}</div>`
      : '';

    const diglotOrig =
      this.activeElement?.dataset.diglot === '1' ? this.activeElement.dataset.orig || '' : '';
    const diglotBannerHtml = diglotOrig
      ? `<div class="wp-diglot-banner" id="wp-diglot-banner">
          <span>⇄ Woven in place of <b>"${esc(diglotOrig)}"</b></span>
          <button type="button" class="wp-btn-ghost" id="wp-diglot-revert" style="height:22px;padding:0 8px;font-size:11px;">Revert</button>
        </div>`
      : '';

    setHtmlContent(
      this.el,
      `
      <div class="wp-top">
        <div class="wp-head">
          <span class="wp-word" ${genderAttr}>${esc(headword)}</span>
          ${altForm ? `<span class="wp-alt">${esc(altForm)}</span>` : ''}
          <span class="wp-badge" data-s="${curStatus}">${esc(statusLabels[String(curStatus)] || 'New')}</span>
        </div>
        ${topIconsHtml}
      </div>
      <div class="wp-sub">
        ${readingText ? `<span>${esc(readingText)}</span>` : ''}
        ${pitchHtml}
        ${rankHtml}
      </div>
      ${diglotBannerHtml}
      ${tabsHtml}
      ${
        this.activeTab === 'characters'
          ? charactersBodyHtml
          : `
            <ul class="wp-meanings">${meaningItemsHtml.join('')}</ul>
            ${pagerHtml}
            ${compoundGlossHtml}
            ${partsHtml}
            ${couldAlsoBeHtml}
          `
      }
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

  private bindEvents(): void {
    const lk = this.activeLookup;
    if (!lk) return;

    this.el.querySelectorAll<HTMLButtonElement>('.wp-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeTab = (btn.dataset.tab as 'meaning' | 'characters') || 'meaning';
        this.render();
      });
    });

    this.el.querySelector('#wp-prev-entry')?.addEventListener('click', () => this.stepEntry(-1));
    this.el.querySelector('#wp-next-entry')?.addEventListener('click', () => this.stepEntry(1));
    this.el.querySelector('#wp-list-entries')?.addEventListener('click', () => this.toggleListAllEntries());

    this.el.querySelector('#wp-speak-word')?.addEventListener('click', () => {
      speakText(lk.query, this.settings.activeLang, this.settings);
    });
    this.el.querySelector('#wp-speak-sent')?.addEventListener('click', () => {
      speakText(this.contextSentence || lk.query, this.settings.activeLang, this.settings);
    });
    this.el.querySelector('#wp-extend-btn')?.addEventListener('click', () => {
      this.extenderOpen = !this.extenderOpen;
      this.render();
    });
    this.el.querySelectorAll<HTMLButtonElement>('[data-ext]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.ext as 'left_add' | 'left_trim' | 'right_trim' | 'right_add';
        this.callbacks.onExtendSelection(dir);
      });
    });
    this.el.querySelector('#wp-split-custom')?.addEventListener('click', async () => {
      await this.callbacks.onSplitCustomWord(lk.query);
      this.close();
    });

    this.el.querySelector('#wp-edit-meaning')?.addEventListener('click', () => this.openCustomMeaningEditor());
    this.el.querySelector('#wp-meaning-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = (this.el.querySelector('#wp-meaning-input') as HTMLInputElement)?.value.trim() || '';
      const targetStatus: WordStatus = lk.record?.status ? lk.record.status : 1;
      await this.callbacks.onGrade(lk.query, targetStatus, {
        customMeaning: val,
        contextSentence: this.contextSentence,
      });
      this.editingMeaning = false;
      const refreshed = await sendBgMessage<LookupResult>({
        type: 'LOOKUP_WORD',
        word: lk.query,
        lang: this.settings.activeLang,
      });
      this.activeLookup = refreshed;
      this.render();
    });

    this.el.querySelector('#wp-translate-btn')?.addEventListener('click', () => this.triggerGoogleTranslate());
    this.el.querySelector('#wp-lookup-btn')?.addEventListener('click', () => {
      this.lookUpMenuOpen = !this.lookUpMenuOpen;
      this.render();
    });
    this.el.querySelector('#wp-ask-ai-chat')?.addEventListener('click', () => {
      this.callbacks.onOpenAskAiChat(this.contextSentence || lk.query);
    });

    this.el.querySelector('#wp-ai-btn')?.addEventListener('click', () => this.triggerAiCheck());
    this.el.querySelector('#wp-ask-ai-verdict')?.addEventListener('click', () => this.triggerAiCheck());
    this.el.querySelector('#wp-save-ai-meaning')?.addEventListener('click', async () => {
      if (!this.aiVerdict) return;
      const targetStatus: WordStatus = lk.record?.status || 1;
      await this.callbacks.onGrade(lk.query, targetStatus, {
        aiMeaning: this.aiVerdict.shortMeaning,
        contextSentence: this.contextSentence,
      });
      this.activeLookup = await sendBgMessage<LookupResult>({
        type: 'LOOKUP_WORD',
        word: lk.query,
        lang: this.settings.activeLang,
      });
      this.render();
    });
    this.el.querySelector('#wp-edit-ai-meaning')?.addEventListener('click', () => {
      this.editingAiMeaning = true;
      this.render();
    });
    this.el.querySelector('#wp-ai-edit-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = (this.el.querySelector('#wp-ai-edit-input') as HTMLInputElement)?.value.trim() || '';
      await this.callbacks.onGrade(lk.query, lk.record?.status || 1, {
        customMeaning: val,
        contextSentence: this.contextSentence,
      });
      this.editingAiMeaning = false;
      this.activeLookup = await sendBgMessage<LookupResult>({
        type: 'LOOKUP_WORD',
        word: lk.query,
        lang: this.settings.activeLang,
      });
      this.render();
    });

    this.el.querySelector('#wp-anki-btn')?.addEventListener('click', (e) => {
      if ((e as MouseEvent).shiftKey) this.openAnkiMeaningPicker();
      else this.sendCurrentToAnki();
    });

    this.el.querySelectorAll<HTMLInputElement>('.wp-anki-chk').forEach((chk) => {
      chk.addEventListener('change', () => {
        const m = chk.dataset.m || '';
        if (chk.checked && !this.tickedMeanings.includes(m)) this.tickedMeanings.push(m);
        else if (!chk.checked) this.tickedMeanings = this.tickedMeanings.filter((x) => x !== m);
      });
    });

    this.el.querySelectorAll<HTMLButtonElement>('[data-sent-adj]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.sentAdj;
        if (mode === 'reset') {
          this.editedSentence = this.contextSentence;
        } else {
          const words = this.editedSentence.split(/\s+/);
          if (mode === 'start_less' && words.length > 2) this.editedSentence = words.slice(1).join(' ');
          else if (mode === 'end_less' && words.length > 2) this.editedSentence = words.slice(0, -1).join(' ');
          else if (mode === 'start_more' || mode === 'end_more') {
            this.editedSentence = this.fullParagraphText.slice(0, 580);
          }
        }
        this.render();
      });
    });

    this.el.querySelector('#wp-anki-sent')?.addEventListener('input', (e) => {
      this.editedSentence = (e.target as HTMLInputElement).value;
    });
    this.el.querySelector('#wp-anki-confirm')?.addEventListener('click', () => {
      this.sendCurrentToAnki(this.tickedMeanings);
    });
    this.el.querySelector('#wp-anki-cancel')?.addEventListener('click', () => {
      this.ankiPickerOpen = false;
      this.render();
    });

    this.el.querySelectorAll<HTMLButtonElement>('.wp-lemma-pick').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const chosen = btn.dataset.lemma || '';
        if (!chosen) return;
        await this.callbacks.onGrade(lk.query, lk.record?.status || 1, {
          lemmaOverride: chosen,
          contextSentence: this.contextSentence,
        });
        this.activeLookup = await sendBgMessage<LookupResult>({
          type: 'LOOKUP_WORD',
          word: lk.query,
          lang: this.settings.activeLang,
        });
        this.render();
      });
    });

    this.el.querySelectorAll<HTMLButtonElement>('.wp-grade-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const rawGrade = Number(btn.dataset.grade) as WordStatus;
        const curStatus: WordStatus = lk.record?.status ?? 0;
        // Clicking the level that is already lit puts the word back to New (0)!
        const nextStatus: WordStatus = curStatus === rawGrade ? 0 : rawGrade;
        await this.callbacks.onGrade(lk.query, nextStatus, {
          contextSentence: this.contextSentence,
        });
        if (nextStatus === 5 || nextStatus === -1) {
          this.close();
        } else {
          this.activeLookup = await sendBgMessage<LookupResult>({
            type: 'LOOKUP_WORD',
            word: lk.query,
            lang: this.settings.activeLang,
          });
          this.render();
        }
      });
    });

    this.el.querySelector('#wp-close-btn')?.addEventListener('click', () => this.close());
    this.el.querySelector('#wp-diglot-revert')?.addEventListener('click', () => {
      if (this.activeElement) {
        this.callbacks.onRevertDiglot?.(this.activeElement);
      }
      this.close();
    });
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
