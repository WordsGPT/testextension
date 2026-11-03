import type {
  BookBookmark,
  BookItem,
  BundledDictionary,
  CustomDictionaryMeta,
  LangCode,
  ShelfFolder,
  VerbaSettings,
  WordRecord,
  WordStatus,
} from '../shared/types';
import {
  getBookById,
  getBookRawBytes,
  getBookmarksByBook,
  getBooksByLang,
  getCustomDictsByLang,
  getFoldersByLang,
  getLangOptionsFromSettings,
  getWordsByLang,
  putBook,
  putBookmark,
  putFolder,
} from '../shared/db';
import { buildLangIndex, formatOrdinal, resolveTrackingKey, type LoadedLangIndex } from '../shared/dictionary';
import { LANG_MAP } from '../shared/languages';
import { segmentText } from '../shared/segmenter';
import { sendBgMessage } from '../shared/messaging';
import { getExtApi } from '../shared/webext';
import { speakText } from '../shared/tts';
import { setHtmlContent } from '../shared/dom';
import { SHADOW_UI_CSS } from '../content/styles';
import { VerbaHighlighter } from '../content/highlighter';
import { VerbaWordPanel } from '../content/word-panel';
import { VerbaReaderSuite } from '../content/reader-view';
import { parseAnyBookFile, parsePlainTextBook, renderPdfPrintedPage } from './parsers';

interface UndoEntry {
  label: string;
  restore: () => Promise<void>;
}

class VerbaBooksApp {
  private rootEl = document.getElementById('books-app')!;
  private fileInput = document.getElementById('hidden-book-file-input') as HTMLInputElement;

  private shadowHost!: HTMLElement;
  private shadow!: ShadowRoot;
  private highlighter!: VerbaHighlighter;
  private wordPanel!: VerbaWordPanel;
  private readerSuite!: VerbaReaderSuite;

  private settings!: VerbaSettings;
  private dictIndex!: LoadedLangIndex;
  private words: WordRecord[] = [];
  private customDicts: CustomDictionaryMeta[] = [];

  private books: BookItem[] = [];
  private folders: ShelfFolder[] = [];
  private activeFolderId: string | 'all' | 'unfiled' = 'all';
  private selectMode = false;
  private selectedBookIds = new Set<string>();
  private openCardMenuId: string | null = null;
  private pasteModalOpen = false;
  private moveModalBookIds: string[] | null = null;
  private undoStack: UndoEntry[] = [];
  private toastMessage = '';

  // Active Book Reader state
  private activeBook: BookItem | null = null;
  private bookmarks: BookBookmark[] = [];
  private drawerOpen = false;
  private drawerTab: 'contents' | 'bookmarks' | 'words' = 'contents';
  private wordsScope: 'chapter' | 'book' = 'chapter';
  private wordsStatusFilter: 'new' | 'learning' | 'all' = 'new';
  private aaOpen = false;
  private pdfViewMode: 'fit' | 'printed' = 'fit';
  private pageIndex = 0;
  private totalPages = 1;
  private hoveredWordEl: HTMLElement | null = null;
  private hoverTimer: number | null = null;
  private boundContainers = new WeakSet<EventTarget>();

  public async init(): Promise<void> {
    this.mountOverlayShadow();
    await this.reloadCoreState();

    const params = new URLSearchParams(location.search);
    const bookId = params.get('book');
    if (bookId) {
      const found = await getBookById(bookId);
      if (found) {
        if (found.lang !== this.settings.activeLang) {
          this.settings = await sendBgMessage<VerbaSettings>({
            type: 'SAVE_SETTINGS',
            patch: { activeLang: found.lang },
          });
          await this.reloadCoreState();
        }
        await this.openBook(found);
      } else {
        this.render();
      }
    } else {
      this.render();
    }

    this.bindFileInputs();
    this.bindGlobalShortcuts();
  }

  private mountOverlayShadow(): void {
    this.shadowHost = document.createElement('div');
    this.shadowHost.id = 'verba-ui-root';
    this.shadowHost.dataset.verbaIgnore = '1';
    document.documentElement.appendChild(this.shadowHost);
    this.shadow = this.shadowHost.attachShadow({ mode: 'open' });
    const st = document.createElement('style');
    st.textContent = SHADOW_UI_CSS;
    this.shadow.appendChild(st);
  }

  private async reloadCoreState(): Promise<void> {
    this.settings = await sendBgMessage<VerbaSettings>({ type: 'GET_SETTINGS' });
    applyTheme(this.settings.theme);

    const lang = this.settings.activeLang;
    const rawDict = await sendBgMessage<BundledDictionary>({ type: 'GET_DICTIONARY', lang });
    this.dictIndex = buildLangIndex(rawDict);
    this.words = await getWordsByLang(lang);
    this.customDicts = await getCustomDictsByLang(lang);
    this.books = await getBooksByLang(lang);
    this.folders = await getFoldersByLang(lang);

    const langOpts = getLangOptionsFromSettings(this.settings, lang);
    this.highlighter?.destroy();
    this.highlighter = new VerbaHighlighter({
      lang,
      settings: this.settings,
      langOpts,
      dictIndex: this.dictIndex,
      words: this.words,
      customDicts: this.customDicts,
      rootContainer: this.rootEl,
      isBookOrReader: true,
    });
    this.highlighter.injectStyles(document);

    if (!this.wordPanel) {
      this.wordPanel = new VerbaWordPanel(this.shadow, this.settings, langOpts, {
        onGrade: async (word, status, extra) => {
          await this.gradeWord(word, status, extra);
        },
        onSplitCustomWord: async (word) => {
          await sendBgMessage({ type: 'SPLIT_CUSTOM_WORD', lang: this.settings.activeLang, word });
          await this.refreshVocabulary(true);
        },
        onExtendSelection: () => {},
        onOpenAskAiChat: (sent) => this.readerSuite.openAskAiModal(sent),
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
        (c) => this.bindReaderWordEvents(c)
      );
    } else {
      this.readerSuite.highlighter = this.highlighter;
      this.readerSuite.syncStyles(this.settings, langOpts);
    }
  }

  private async refreshVocabulary(resegment = false): Promise<void> {
    this.words = await getWordsByLang(this.settings.activeLang);
    this.highlighter.setWords(this.words);
    if (this.activeBook) {
      this.highlighter.refreshAllStatuses(resegment);
      if (this.drawerOpen && this.drawerTab === 'words') {
        this.render();
      }
    } else {
      this.render();
    }
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
    const meta = LANG_MAP[this.settings.activeLang];
    const isCustomSegment =
      extra?.isCustomSegment ??
      Boolean(meta?.spaceless && word.length >= 2 && !this.dictIndex.lexiconSet.has(word));
    await sendBgMessage({
      type: 'GRADE_WORD',
      lang: this.settings.activeLang,
      word,
      status,
      isCustomSegment,
      ...extra,
    });
    await this.refreshVocabulary(isCustomSegment);
  }

  private computeTextWordStats(text: string): {
    uniqueTotal: number;
    newCount: number;
    learningCount: number;
    knownCount: number;
    newPct: number;
    wordList: { key: string; surface: string; status: WordStatus; rank?: number }[];
  } {
    const lang = this.settings.activeLang;
    const langOpts = getLangOptionsFromSettings(this.settings, lang);
    const { lexicon, phrases, overrides } = this.highlighter.getPhrasesAndCustomLexicon();
    const tokens = segmentText(text.slice(0, 65000), lang, lexicon, phrases);

    const seen = new Map<string, { key: string; surface: string; status: WordStatus; rank?: number }>();
    for (const tok of tokens) {
      if (!tok.isWord) continue;
      const resolved = resolveTrackingKey(
        tok.text,
        lang,
        this.dictIndex,
        langOpts.countingMode,
        tok.lemmaHint,
        overrides
      );
      const key = resolved.key;
      if (seen.has(key)) continue;
      const rec = this.highlighter.wordMap.get(key) || this.highlighter.wordMap.get(tok.text);
      const status: WordStatus = rec ? rec.status : 0;
      if (status === -1) continue;
      seen.set(key, {
        key,
        surface: tok.text,
        status,
        rank: resolved.primaryEntry?.rank,
      });
    }

    let newCount = 0;
    let learningCount = 0;
    let knownCount = 0;
    for (const item of seen.values()) {
      if (item.status === 0) newCount++;
      else if (item.status >= 1 && item.status <= 4) learningCount++;
      else if (item.status === 5) knownCount++;
    }
    const uniqueTotal = Math.max(1, seen.size);
    const newPct = seen.size === 0 ? 0 : Math.round((newCount / uniqueTotal) * 100);
    const wordList = Array.from(seen.values()).sort((a, b) => (a.rank || 999999) - (b.rank || 999999));

    return { uniqueTotal: seen.size, newCount, learningCount, knownCount, newPct, wordList };
  }

  private async openBook(book: BookItem): Promise<void> {
    this.activeBook = book;
    this.bookmarks = await getBookmarksByBook(book.id);
    this.drawerOpen = false;
    this.aaOpen = false;
    this.pageIndex = 0;
    this.pdfViewMode =
      this.settings.pdfDefaultMode === 'printed'
        ? 'printed'
        : 'fit';

    const url = new URL(location.href);
    url.searchParams.set('book', book.id);
    history.replaceState(null, '', url.toString());

    this.render();

    // Restore exact scroll ratio or Sentence-by-Sentence mode!
    requestAnimationFrame(() => {
      if (book.scrollRatio > 0 && !book.paginated) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: Math.round(maxScroll * book.scrollRatio) });
      }
      if (book.sentenceMode) {
        const ch = book.chapters[book.chapterIndex];
        if (ch?.text) this.readerSuite.openSentenceBySentence(ch.text);
      }
    });
  }

  private async closeBookToShelf(): Promise<void> {
    await this.saveReadingPlace();
    this.wordPanel.close();
    this.activeBook = null;
    const url = new URL(location.href);
    url.searchParams.delete('book');
    history.replaceState(null, '', url.toString());
    this.books = await getBooksByLang(this.settings.activeLang);
    this.render();
  }

  private async saveReadingPlace(overrides?: Partial<BookItem>): Promise<void> {
    if (!this.activeBook) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollRatio = this.activeBook.paginated
      ? this.pageIndex / Math.max(1, this.totalPages - 1)
      : Math.min(1, Math.max(0, window.scrollY / maxScroll));

    const updated: BookItem = {
      ...this.activeBook,
      scrollRatio,
      sentenceMode: this.readerSuite.isSentenceModeOpen,
      ...overrides,
      updatedAt: Date.now(),
    };
    this.activeBook = updated;
    await putBook(updated);
  }

  private pushUndo(label: string, restore: () => Promise<void>): void {
    this.undoStack.push({ label, restore });
    this.toastMessage = label;
    this.render();
    window.setTimeout(() => {
      if (this.toastMessage === label) {
        this.toastMessage = '';
        this.render();
      }
    }, 6500);
  }

  private async performUndo(): Promise<void> {
    const entry = this.undoStack.pop();
    if (!entry) return;
    this.toastMessage = '';
    await entry.restore();
    this.books = await getBooksByLang(this.settings.activeLang);
    this.folders = await getFoldersByLang(this.settings.activeLang);
    this.render();
  }

  public render(): void {
    if (this.activeBook) {
      this.renderBookReader();
    } else {
      this.renderShelf();
    }
  }

  private renderShelf(): void {
    const lang = this.settings.activeLang;
    const langMeta = LANG_MAP[lang];
    const filteredBooks = this.books.filter((b) => {
      if (this.activeFolderId === 'all') return true;
      if (this.activeFolderId === 'unfiled') return !b.folderId;
      return b.folderId === this.activeFolderId;
    });

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
        </div>
        <div class="topbar-right">
          <button type="button" class="btn btn-primary" id="btn-add-book">+ Add book</button>
          <button type="button" class="btn" id="btn-paste-text">Paste text</button>
          <button type="button" class="btn" id="btn-new-folder">New folder</button>
          <button type="button" class="btn ${this.selectMode ? 'btn-amber' : ''}" id="btn-select-mode">
            ${this.selectMode ? `Selected (${this.selectedBookIds.size})` : 'Select'}
          </button>
          ${
            this.selectMode && this.selectedBookIds.size > 0
              ? `
            <button type="button" class="btn" id="btn-bulk-move">Move to folder…</button>
            <button type="button" class="btn" id="btn-bulk-remove" style="color:#f87171">Remove</button>
          `
              : ''
          }
          ${
            this.undoStack.length > 0
              ? `<button type="button" class="btn" id="btn-top-undo" title="Undo (Ctrl+Z)">↶ Undo</button>`
              : ''
          }
          <select id="shelf-lang-sel" class="select-input" aria-label="Language">
            ${langOptsHtml}
          </select>
        </div>
      </header>

      <main class="shelf-wrap" id="shelf-dropzone">
        <div class="shelf-hero">
          <div>
            <h1 class="shelf-title">${esc(langMeta?.name || lang)} Shelf</h1>
            <p class="shelf-sub">EPUB, PDF, plain text, subtitles, comics &amp; saved web articles — highlighted with your live vocabulary.</p>
          </div>
        </div>

        <div class="folder-bar">
          <button type="button" class="folder-pill ${this.activeFolderId === 'all' ? 'active' : ''}" data-folder-pick="all">
            All books (${this.books.length})
          </button>
          <button type="button" class="folder-pill ${this.activeFolderId === 'unfiled' ? 'active' : ''}" data-folder-pick="unfiled" data-drop-folder="">
            Unfiled (${this.books.filter((b) => !b.folderId).length})
          </button>
          ${this.folders
            .map(
              (f) => `
            <button
              type="button"
              class="folder-pill ${this.activeFolderId === f.id ? 'active' : ''}"
              data-folder-pick="${esc(f.id)}"
              data-drop-folder="${esc(f.id)}"
            >
              📁 ${esc(f.name)} (${this.books.filter((b) => b.folderId === f.id).length})
            </button>
          `
            )
            .join('')}
        </div>

        ${
          filteredBooks.length === 0
            ? `<div class="drop-hint">No books in this view yet. Click <strong>+ Add book</strong>, <strong>Paste text</strong>, or drop EPUB / PDF / TXT / SRT files anywhere here.</div>`
            : `<div class="books-grid">
              ${filteredBooks
                .map((b) => {
                  const sampleText = b.chapters.map((c) => c.text).join('\n');
                  const st = this.computeTextWordStats(sampleText);
                  const chPct = Math.round(
                    ((b.chapterIndex + Math.min(1, b.scrollRatio)) / Math.max(1, b.chapters.length)) * 100
                  );
                  const isSel = this.selectedBookIds.has(b.id);
                  const folderName = b.folderId ? this.folders.find((f) => f.id === b.folderId)?.name : '';
                  return `
                  <article
                    class="book-card ${isSel ? 'selected' : ''}"
                    data-book-id="${esc(b.id)}"
                    draggable="true"
                  >
                    <div class="book-card-top">
                      <div style="display:flex;align-items:center;gap:6px">
                        ${
                          this.selectMode
                            ? `<input type="checkbox" class="book-sel-chk" data-chk-id="${esc(b.id)}" ${isSel ? 'checked' : ''} />`
                            : ''
                        }
                        <span class="fmt-badge">${esc(b.format)}</span>
                        ${folderName ? `<span class="fmt-badge">📁 ${esc(folderName)}</span>` : ''}
                      </div>
                      <button type="button" class="btn btn-ghost book-menu-trigger" data-menu-id="${esc(b.id)}" aria-label="Book menu">⋯</button>
                    </div>

                    <h2 class="book-card-title">${esc(b.title)}</h2>
                    ${b.author ? `<p class="book-card-author">${esc(b.author)}</p>` : ''}

                    <div class="book-stats-row">
                      <span><span class="stat-dot blue"></span><strong>${st.newPct}%</strong> new (${st.newCount})</span>
                      <span><span class="stat-dot amber"></span>${st.learningCount} learning</span>
                      <span><span class="stat-dot green"></span>${st.knownCount} known</span>
                    </div>

                    <div class="book-progress-track" title="${chPct}% read">
                      <div class="book-progress-fill" style="width:${chPct}%"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--ink-3)">
                      <span>Ch. ${b.chapterIndex + 1} of ${b.chapters.length}</span>
                      <span>${chPct}%</span>
                    </div>

                    ${
                      this.openCardMenuId === b.id
                        ? `
                      <div class="card-menu-pop" data-stop-card="1">
                        <button type="button" class="card-menu-item" data-card-act="rename" data-id="${esc(b.id)}">Rename…</button>
                        <button type="button" class="card-menu-item" data-card-act="move" data-id="${esc(b.id)}">Move to folder…</button>
                        <button type="button" class="card-menu-item danger" data-card-act="remove" data-id="${esc(b.id)}">Remove from shelf…</button>
                      </div>
                    `
                        : ''
                    }
                  </article>
                `;
                })
                .join('')}
            </div>
            <div class="drop-hint" id="drop-footer-hint">Drop EPUB, PDF, TXT, SRT/VTT/ASS, or CBZ files anywhere on this page to add them.</div>`
        }
      </main>

      ${this.renderModalsAndToast()}
    `
    );

    this.bindShelfEvents();
  }

  private renderBookReader(): void {
    const book = this.activeBook!;
    const chIdx = Math.max(0, Math.min(book.chapters.length - 1, book.chapterIndex));
    const chapter = book.chapters[chIdx] || { id: 'empty', title: book.title, html: '', text: '' };
    const paper = this.settings.readerTheme || 'dark';
    const isBookmarkedHere = this.bookmarks.some((bm) => bm.chapterIndex === chIdx);

    const fontStack =
      this.settings.readerFont === 'sans'
        ? 'var(--sans)'
        : this.settings.readerFont === 'mono'
        ? 'var(--mono)'
        : this.settings.readerFont === 'custom' && this.settings.customFontName
        ? `"${this.settings.customFontName}", var(--serif)`
        : 'var(--serif)';

    const langOpts = getLangOptionsFromSettings(this.settings, this.settings.activeLang);

    setHtmlContent(
      this.rootEl,
      `
      <div class="book-reader-shell" data-paper="${paper}">
        <header class="topbar">
          <div class="topbar-left">
            <button type="button" class="btn" id="btn-back-shelf">← Shelf</button>
            <button type="button" class="btn" id="btn-drawer-toggle" title="Contents, Bookmarks & Words">☰ Contents &amp; Words</button>
            <span style="font-family:var(--serif);font-style:italic;color:var(--ink);font-size:16px">
              ${esc(book.title)} — <span style="color:var(--ink-2)">${esc(chapter.title)}</span>
            </span>
          </div>
          <div class="topbar-right">
            <button type="button" class="btn ${isBookmarkedHere ? 'btn-amber' : ''}" id="btn-bookmark" title="Toggle bookmark">
              🔖 ${isBookmarkedHere ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button type="button" class="btn" id="btn-sentence-mode" title="Sentence by sentence (Shift+S)">
              Sentence by sentence
            </button>
            <button type="button" class="btn" id="btn-read-aloud" title="Read aloud (Shift+R)">
              🔊 Read aloud
            </button>
            <button type="button" class="btn ${this.aaOpen ? 'btn-primary' : ''}" id="btn-aa-toggle">
              Aa
            </button>
          </div>
        </header>

        <div class="book-stage">
          <article
            id="book-chapter-content"
            class="book-article-scroll ${chapter.vertical ? 'vertical-text' : ''} ${book.paginated ? 'paginated-mode' : ''}"
            style="font-size:${this.settings.readerFontSize}px;font-family:${fontStack}"
          >
            ${
              book.format === 'pdf' && this.pdfViewMode === 'printed'
                ? `<div id="pdf-printed-mount" style="min-height:480px;text-align:center">Rendering printed PDF page…</div>`
                : `<h2>${esc(chapter.title)}</h2>${chapter.html || `<p>${esc(chapter.text)}</p>`}`
            }
          </article>

          ${
            book.paginated
              ? `
            <div class="paginated-bar">
              <button type="button" class="btn" id="btn-page-prev">← Prev page</button>
              <span id="paginated-indicator" style="font-variant-numeric:tabular-nums">Page ${this.pageIndex + 1} / ${this.totalPages}</span>
              <button type="button" class="btn" id="btn-page-next">Next page →</button>
            </div>
          `
              : `
            <footer class="chapter-footer-nav">
              <button type="button" class="btn" id="btn-prev-ch" ${chIdx === 0 ? 'disabled' : ''}>← Previous chapter</button>
              <button type="button" class="btn btn-primary" id="btn-know-chapter">Mark remaining blue words Known (Shift+K)</button>
              <button type="button" class="btn" id="btn-next-ch" ${chIdx >= book.chapters.length - 1 ? 'disabled' : ''}>Next chapter →</button>
            </footer>
          `
          }
        </div>

        ${this.aaOpen ? this.renderAaPopover(book, langOpts.readingsEnabled) : ''}
        ${this.drawerOpen ? this.renderBookDrawer(book, chIdx) : ''}
      </div>
    `
    );

    const contentEl = document.getElementById('book-chapter-content')!;
    if (book.format === 'pdf' && this.pdfViewMode === 'printed') {
      getBookRawBytes(book.id).then(async (bytes) => {
        const mount = document.getElementById('pdf-printed-mount');
        if (bytes && mount) {
          const textLayer = await renderPdfPrintedPage(bytes, chIdx + 1, mount);
          this.highlighter.scanAndHighlight(textLayer);
          this.bindReaderWordEvents(textLayer);
        }
      });
    } else {
      this.highlighter.scanAndHighlight(contentEl);
      this.bindReaderWordEvents(contentEl);
    }

    if (book.paginated) {
      requestAnimationFrame(() => this.updatePaginationMetrics(contentEl));
    }

    this.bindBookReaderEvents(contentEl);
  }

  private renderAaPopover(book: BookItem, readingsEnabled: boolean): string {
    return `
      <div class="aa-popover" id="aa-popover">
        <div class="aa-row">
          <span class="aa-lbl">Reading flow</span>
          <div style="display:flex;gap:4px">
            <button type="button" class="btn ${!book.paginated ? 'btn-primary' : ''}" data-flow="scroll">Scroll</button>
            <button type="button" class="btn ${book.paginated ? 'btn-primary' : ''}" data-flow="pages">Turn pages</button>
          </div>
        </div>

        ${
          book.format === 'pdf'
            ? `
          <div class="aa-row">
            <span class="aa-lbl">PDF layout</span>
            <div style="display:flex;gap:4px">
              <button type="button" class="btn ${this.pdfViewMode === 'fit' ? 'btn-primary' : ''}" data-pdf-mode="fit">Fit to screen</button>
              <button type="button" class="btn ${this.pdfViewMode === 'printed' ? 'btn-primary' : ''}" data-pdf-mode="printed">Printed page</button>
            </div>
          </div>
        `
            : ''
        }

        <div class="aa-row">
          <span class="aa-lbl">Page colour</span>
          <div style="display:flex;gap:4px">
            <button type="button" class="btn ${this.settings.readerTheme === 'white' ? 'btn-primary' : ''}" data-paper="white">White</button>
            <button type="button" class="btn ${this.settings.readerTheme === 'sepia' ? 'btn-primary' : ''}" data-paper="sepia">Yellow</button>
            <button type="button" class="btn ${this.settings.readerTheme === 'dark' ? 'btn-primary' : ''}" data-paper="dark">Dark</button>
          </div>
        </div>

        <div class="aa-row">
          <span class="aa-lbl">Font size (${this.settings.readerFontSize}px)</span>
          <div style="display:flex;gap:6px">
            <button type="button" class="btn" id="aa-font-dec">A−</button>
            <button type="button" class="btn" id="aa-font-inc">A+</button>
          </div>
        </div>

        <div class="aa-row">
          <span class="aa-lbl">Font</span>
          <select id="aa-font-family" class="select-input">
            <option value="serif" ${this.settings.readerFont === 'serif' ? 'selected' : ''}>Serif</option>
            <option value="sans" ${this.settings.readerFont === 'sans' ? 'selected' : ''}>Sans</option>
            <option value="mono" ${this.settings.readerFont === 'mono' ? 'selected' : ''}>Mono</option>
            <option value="original" ${this.settings.readerFont === 'original' ? 'selected' : ''}>Original</option>
          </select>
        </div>

        <div class="aa-row">
          <span class="aa-lbl">Highlight words</span>
          <input type="checkbox" id="aa-hl-toggle" ${this.settings.highlightWords ? 'checked' : ''} />
        </div>

        <div class="aa-row">
          <span class="aa-lbl">Readings above words</span>
          <input type="checkbox" id="aa-readings-toggle" ${readingsEnabled ? 'checked' : ''} />
        </div>
      </div>
    `;
  }

  private renderBookDrawer(book: BookItem, chIdx: number): string {
    let bodyHtml = '';
    if (this.drawerTab === 'contents') {
      bodyHtml = book.chapters
        .map(
          (ch, idx) => `
          <button type="button" class="toc-item ${idx === chIdx ? 'active' : ''}" data-jump-ch="${idx}">
            <span>${esc(ch.title)}</span>
            <small style="color:var(--ink-3)">#${idx + 1}</small>
          </button>
        `
        )
        .join('');
    } else if (this.drawerTab === 'bookmarks') {
      if (this.bookmarks.length === 0) {
        bodyHtml = `<p style="color:var(--ink-3);padding:12px">No bookmarks yet. Click 🔖 Bookmark in the top bar to save your spot.</p>`;
      } else {
        bodyHtml = this.bookmarks
          .map(
            (bm) => `
            <div class="toc-item" data-jump-bm="${esc(bm.id)}">
              <div>
                <div style="font-weight:600;font-size:12.5px">Chapter ${bm.chapterIndex + 1} (${Math.round(bm.scrollRatio * 100)}%)</div>
                <div style="font-size:12px;color:var(--ink-3)">${esc(bm.excerpt)}</div>
              </div>
              <button type="button" class="btn btn-ghost" data-del-bm="${esc(bm.id)}" title="Delete bookmark">✕</button>
            </div>
          `
          )
          .join('');
      }
    } else {
      const targetText =
        this.wordsScope === 'chapter'
          ? book.chapters[chIdx]?.text || ''
          : book.chapters.map((c) => c.text).join('\n');
      const stats = this.computeTextWordStats(targetText);
      const filteredWords = stats.wordList.filter((w) => {
        if (this.wordsStatusFilter === 'new') return w.status === 0;
        if (this.wordsStatusFilter === 'learning') return w.status >= 1 && w.status <= 4;
        return true;
      });

      bodyHtml = `
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
          <button type="button" class="btn ${this.wordsScope === 'chapter' ? 'btn-primary' : ''}" data-w-scope="chapter">This chapter</button>
          <button type="button" class="btn ${this.wordsScope === 'book' ? 'btn-primary' : ''}" data-w-scope="book">Whole book</button>
        </div>
        <div style="font-size:12px;color:var(--ink-2);margin-bottom:8px">
          <strong>${stats.uniqueTotal}</strong> unique · ${stats.newCount} new (${stats.newPct}%) · ${stats.learningCount} learning · ${stats.knownCount} known
        </div>
        <div style="display:flex;gap:6px;margin-bottom:10px">
          <button type="button" class="btn ${this.wordsStatusFilter === 'new' ? 'btn-amber' : ''}" data-w-filter="new">New (${stats.newCount})</button>
          <button type="button" class="btn ${this.wordsStatusFilter === 'learning' ? 'btn-amber' : ''}" data-w-filter="learning">Learning (${stats.learningCount})</button>
          <button type="button" class="btn ${this.wordsStatusFilter === 'all' ? 'btn-amber' : ''}" data-w-filter="all">All</button>
        </div>
        ${filteredWords
          .slice(0, 200)
          .map(
            (w) => `
          <button type="button" class="toc-item" data-drawer-word="${esc(w.surface)}">
            <span>${esc(w.key)}</span>
            <small style="color:var(--ink-3)">${w.rank ? formatOrdinal(w.rank) : ''}</small>
          </button>
        `
          )
          .join('')}
      `;
    }

    return `
      <div class="book-drawer-backdrop" id="drawer-backdrop">
        <aside class="book-drawer" data-stop-drawer="1">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px 4px">
            <strong style="font-family:var(--serif);font-style:italic;font-size:17px">${esc(book.title)}</strong>
            <button type="button" class="btn btn-ghost" id="btn-drawer-close">✕</button>
          </div>
          <div class="drawer-tabs">
            <button type="button" class="drawer-tab ${this.drawerTab === 'contents' ? 'active' : ''}" data-dtab="contents">Contents</button>
            <button type="button" class="drawer-tab ${this.drawerTab === 'bookmarks' ? 'active' : ''}" data-dtab="bookmarks">Bookmarks (${this.bookmarks.length})</button>
            <button type="button" class="drawer-tab ${this.drawerTab === 'words' ? 'active' : ''}" data-dtab="words">Words</button>
          </div>
          <div class="drawer-body">
            ${bodyHtml}
          </div>
        </aside>
      </div>
    `;
  }

  private renderModalsAndToast(): string {
    let html = '';
    if (this.pasteModalOpen) {
      html += `
        <div class="modal-backdrop" id="paste-modal-bg">
          <div class="modal-card">
            <h2 class="modal-title">Paste text to read</h2>
            <input type="text" id="paste-title" class="text-input" placeholder="Title (e.g. Dialogue or News Article)" />
            <textarea id="paste-body" class="textarea-input" rows="9" placeholder="Paste ${esc(LANG_MAP[this.settings.activeLang]?.name || '')} text here…"></textarea>
            <div style="display:flex;justify-content:flex-end;gap:8px">
              <button type="button" class="btn" id="paste-cancel">Cancel</button>
              <button type="button" class="btn btn-primary" id="paste-save">Save &amp; Open</button>
            </div>
          </div>
        </div>
      `;
    }

    if (this.moveModalBookIds) {
      html += `
        <div class="modal-backdrop" id="move-modal-bg">
          <div class="modal-card">
            <h2 class="modal-title">Move to folder</h2>
            <select id="move-folder-select" class="select-input">
              <option value="">Unfiled (Main Shelf)</option>
              ${this.folders.map((f) => `<option value="${esc(f.id)}">📁 ${esc(f.name)}</option>`).join('')}
            </select>
            <div style="display:flex;justify-content:flex-end;gap:8px">
              <button type="button" class="btn" id="move-cancel">Cancel</button>
              <button type="button" class="btn btn-primary" id="move-confirm">Move</button>
            </div>
          </div>
        </div>
      `;
    }

    if (this.toastMessage) {
      html += `
        <div class="undo-toast">
          <span>${esc(this.toastMessage)}</span>
          ${
            this.undoStack.length > 0
              ? `<button type="button" class="btn btn-amber" id="toast-undo-btn" style="padding:3px 10px">Undo</button>`
              : ''
          }
        </div>
      `;
    }
    return html;
  }

  private bindFileInputs(): void {
    this.fileInput?.addEventListener('change', async () => {
      const files = Array.from(this.fileInput.files || []);
      this.fileInput.value = '';
      await this.importBookFiles(files);
    });
  }

  private async importBookFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;
    let lastAdded: BookItem | null = null;
    for (const file of files) {
      try {
        const parsed = await parseAnyBookFile(file, this.settings.activeLang);
        if (this.activeFolderId !== 'all' && this.activeFolderId !== 'unfiled') {
          parsed.book.folderId = this.activeFolderId;
        }
        await putBook(parsed.book, parsed.rawBytes);
        lastAdded = parsed.book;
      } catch (err) {
        console.error('Failed to parse book:', file.name, err);
      }
    }
    this.books = await getBooksByLang(this.settings.activeLang);
    if (files.length === 1 && lastAdded) {
      await this.openBook(lastAdded);
    } else {
      this.render();
    }
  }

  private bindShelfEvents(): void {
    this.rootEl.querySelector('#btn-add-book')?.addEventListener('click', () => this.fileInput.click());
    this.rootEl.querySelector('#btn-paste-text')?.addEventListener('click', () => {
      this.pasteModalOpen = true;
      this.render();
    });

    this.rootEl.querySelector('#btn-new-folder')?.addEventListener('click', async () => {
      const name = window.prompt('Folder name:');
      if (!name?.trim()) return;
      const folder: ShelfFolder = {
        id: `fld_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        lang: this.settings.activeLang,
        name: name.trim(),
        createdAt: Date.now(),
      };
      await putFolder(folder);
      this.folders = await getFoldersByLang(this.settings.activeLang);
      this.activeFolderId = folder.id;
      this.render();
    });

    this.rootEl.querySelector('#btn-select-mode')?.addEventListener('click', () => {
      this.selectMode = !this.selectMode;
      this.selectedBookIds.clear();
      this.render();
    });

    this.rootEl.querySelector('#btn-bulk-move')?.addEventListener('click', () => {
      this.moveModalBookIds = Array.from(this.selectedBookIds);
      this.render();
    });

    this.rootEl.querySelector('#btn-bulk-remove')?.addEventListener('click', async () => {
      const ids = Array.from(this.selectedBookIds);
      await this.softDeleteBooks(ids);
      this.selectMode = false;
      this.selectedBookIds.clear();
    });

    this.rootEl.querySelector('#btn-top-undo')?.addEventListener('click', () => this.performUndo());
    this.rootEl.querySelector('#toast-undo-btn')?.addEventListener('click', () => this.performUndo());

    this.rootEl.querySelector('#shelf-lang-sel')?.addEventListener('change', async (e) => {
      const nextLang = (e.target as HTMLSelectElement).value as LangCode;
      await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { activeLang: nextLang } });
      this.activeFolderId = 'all';
      await this.reloadCoreState();
      this.render();
    });

    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-folder-pick]').forEach((pill) => {
      pill.addEventListener('click', () => {
        this.activeFolderId = pill.dataset.folderPick || 'all';
        this.render();
      });

      if (pill.dataset.dropFolder !== undefined) {
        pill.addEventListener('dragover', (e) => {
          e.preventDefault();
          pill.classList.add('drag-over');
        });
        pill.addEventListener('dragleave', () => pill.classList.remove('drag-over'));
        pill.addEventListener('drop', async (e) => {
          e.preventDefault();
          pill.classList.remove('drag-over');
          const draggedId = e.dataTransfer?.getData('text/verba-book-id');
          if (!draggedId) return;
          const targetFolder = pill.dataset.dropFolder || null;
          await this.moveBooksToFolder([draggedId], targetFolder);
        });
      }
    });

    this.rootEl.querySelectorAll<HTMLElement>('.book-card').forEach((card) => {
      const id = card.dataset.bookId!;
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/verba-book-id', id);
      });

      card.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.book-menu-trigger, [data-stop-card="1"], .book-sel-chk')) return;
        if (this.selectMode) {
          if (this.selectedBookIds.has(id)) this.selectedBookIds.delete(id);
          else this.selectedBookIds.add(id);
          this.render();
          return;
        }
        const b = this.books.find((x) => x.id === id);
        if (b) await this.openBook(b);
      });
    });

    this.rootEl.querySelectorAll<HTMLInputElement>('.book-sel-chk').forEach((chk) => {
      chk.addEventListener('change', () => {
        const id = chk.dataset.chkId!;
        if (chk.checked) this.selectedBookIds.add(id);
        else this.selectedBookIds.delete(id);
        this.render();
      });
    });

    this.rootEl.querySelectorAll<HTMLButtonElement>('.book-menu-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.menuId!;
        this.openCardMenuId = this.openCardMenuId === id ? null : id;
        this.render();
      });
    });

    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-card-act]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const act = btn.dataset.cardAct;
        const id = btn.dataset.id!;
        this.openCardMenuId = null;
        const book = this.books.find((x) => x.id === id);
        if (!book) return;

        if (act === 'rename') {
          const nextTitle = window.prompt('Rename book:', book.title);
          if (nextTitle?.trim()) {
            await putBook({ ...book, title: nextTitle.trim(), updatedAt: Date.now() });
            this.books = await getBooksByLang(this.settings.activeLang);
          }
          this.render();
        } else if (act === 'move') {
          this.moveModalBookIds = [id];
          this.render();
        } else if (act === 'remove') {
          await this.softDeleteBooks([id]);
        }
      });
    });

    // Paste Modal handlers
    this.rootEl.querySelector('#paste-cancel')?.addEventListener('click', () => {
      this.pasteModalOpen = false;
      this.render();
    });
    this.rootEl.querySelector('#paste-save')?.addEventListener('click', async () => {
      const title = (document.getElementById('paste-title') as HTMLInputElement)?.value.trim() || 'Pasted Text';
      const body = (document.getElementById('paste-body') as HTMLTextAreaElement)?.value.trim() || '';
      if (!body) return;
      const parsed = await parsePlainTextBook(body, title, this.settings.activeLang, 'paste');
      await putBook(parsed.book);
      this.pasteModalOpen = false;
      this.books = await getBooksByLang(this.settings.activeLang);
      await this.openBook(parsed.book);
    });

    // Move Modal handlers
    this.rootEl.querySelector('#move-cancel')?.addEventListener('click', () => {
      this.moveModalBookIds = null;
      this.render();
    });
    this.rootEl.querySelector('#move-confirm')?.addEventListener('click', async () => {
      const folderId = (document.getElementById('move-folder-select') as HTMLSelectElement)?.value || null;
      if (this.moveModalBookIds) {
        await this.moveBooksToFolder(this.moveModalBookIds, folderId);
      }
      this.moveModalBookIds = null;
      this.selectMode = false;
      this.selectedBookIds.clear();
      this.render();
    });

    // Drag & Drop files onto Shelf
    const dropzone = document.getElementById('shelf-dropzone');
    dropzone?.addEventListener('dragover', (e) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
        document.getElementById('drop-footer-hint')?.classList.add('drag-active');
      }
    });
    dropzone?.addEventListener('dragleave', () => {
      document.getElementById('drop-footer-hint')?.classList.remove('drag-active');
    });
    dropzone?.addEventListener('drop', async (e) => {
      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        e.preventDefault();
        await this.importBookFiles(files);
      }
    });
  }

  private async softDeleteBooks(ids: string[]): Promise<void> {
    const snapshots = this.books.filter((b) => ids.includes(b.id)).map((b) => ({ ...b }));
    for (const s of snapshots) {
      await putBook({ ...s, deleted: true, updatedAt: Date.now() });
    }
    this.books = await getBooksByLang(this.settings.activeLang);
    this.pushUndo(`Removed ${snapshots.length} book${snapshots.length > 1 ? 's' : ''}`, async () => {
      for (const s of snapshots) {
        await putBook({ ...s, deleted: false, updatedAt: Date.now() });
      }
    });
  }

  private async moveBooksToFolder(ids: string[], folderId: string | null): Promise<void> {
    const snapshots = this.books.filter((b) => ids.includes(b.id)).map((b) => ({ ...b }));
    for (const s of snapshots) {
      await putBook({ ...s, folderId, updatedAt: Date.now() });
    }
    this.books = await getBooksByLang(this.settings.activeLang);
    this.pushUndo(`Moved ${snapshots.length} book${snapshots.length > 1 ? 's' : ''}`, async () => {
      for (const s of snapshots) {
        await putBook({ ...s, updatedAt: Date.now() });
      }
    });
  }

  private updatePaginationMetrics(contentEl: HTMLElement): void {
    const pageStep = contentEl.clientWidth + 80;
    this.totalPages = Math.max(1, Math.ceil((contentEl.scrollWidth + 20) / Math.max(1, pageStep)));
    this.pageIndex = Math.min(this.pageIndex, this.totalPages - 1);
    contentEl.scrollLeft = this.pageIndex * pageStep;
    const ind = document.getElementById('paginated-indicator');
    if (ind) ind.textContent = `Page ${this.pageIndex + 1} / ${this.totalPages}`;
  }

  private stepPageOrChapter(dir: 1 | -1): void {
    const book = this.activeBook;
    if (!book) return;
    const contentEl = document.getElementById('book-chapter-content');
    if (book.paginated && contentEl) {
      const nextPage = this.pageIndex + dir;
      if (nextPage >= 0 && nextPage < this.totalPages) {
        this.pageIndex = nextPage;
        this.updatePaginationMetrics(contentEl);
        this.saveReadingPlace();
        return;
      }
    }
    const nextCh = book.chapterIndex + dir;
    if (nextCh >= 0 && nextCh < book.chapters.length) {
      this.pageIndex = 0;
      this.saveReadingPlace({ chapterIndex: nextCh, scrollRatio: 0 }).then(() => {
        window.scrollTo({ top: 0 });
        this.render();
      });
    }
  }

  private bindBookReaderEvents(contentEl: HTMLElement): void {
    const book = this.activeBook!;
    const chIdx = book.chapterIndex;

    this.rootEl.querySelector('#btn-back-shelf')?.addEventListener('click', () => this.closeBookToShelf());
    this.rootEl.querySelector('#btn-drawer-toggle')?.addEventListener('click', () => {
      this.drawerOpen = !this.drawerOpen;
      this.aaOpen = false;
      this.render();
    });
    this.rootEl.querySelector('#btn-aa-toggle')?.addEventListener('click', () => {
      this.aaOpen = !this.aaOpen;
      this.drawerOpen = false;
      this.render();
    });

    this.rootEl.querySelector('#btn-bookmark')?.addEventListener('click', async () => {
      const existing = this.bookmarks.find((bm) => bm.chapterIndex === chIdx);
      if (existing) {
        await putBookmark({ ...existing, deleted: true });
      } else {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        const excerpt = (book.chapters[chIdx]?.text || '').slice(0, 90).trim() + '…';
        await putBookmark({
          id: `bm_${book.id}_${chIdx}_${Date.now()}`,
          bookId: book.id,
          chapterIndex: chIdx,
          scrollRatio,
          excerpt,
          createdAt: Date.now(),
        });
      }
      this.bookmarks = await getBookmarksByBook(book.id);
      this.render();
    });

    this.rootEl.querySelector('#btn-sentence-mode')?.addEventListener('click', () => {
      const txt = book.chapters[chIdx]?.text || contentEl.innerText;
      this.readerSuite.openSentenceBySentence(txt);
      this.saveReadingPlace();
    });

    this.rootEl.querySelector('#btn-read-aloud')?.addEventListener('click', () => {
      const txt = book.chapters[chIdx]?.text || contentEl.innerText;
      this.readerSuite.toggleReadAloud(txt);
    });

    this.rootEl.querySelector('#btn-prev-ch')?.addEventListener('click', () => this.stepPageOrChapter(-1));
    this.rootEl.querySelector('#btn-next-ch')?.addEventListener('click', () => this.stepPageOrChapter(1));
    this.rootEl.querySelector('#btn-page-prev')?.addEventListener('click', () => this.stepPageOrChapter(-1));
    this.rootEl.querySelector('#btn-page-next')?.addEventListener('click', () => this.stepPageOrChapter(1));

    this.rootEl.querySelector('#btn-know-chapter')?.addEventListener('click', async () => {
      const { allBlueKeys } = this.highlighter.getCounts();
      if (allBlueKeys.length === 0) return;
      await sendBgMessage({
        type: 'BATCH_MARK_KNOWN',
        lang: this.settings.activeLang,
        words: allBlueKeys,
        source: 'manual',
      });
      await this.refreshVocabulary(false);
    });

    // Aa Menu controls
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-flow]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const paginated = btn.dataset.flow === 'pages';
        this.pageIndex = 0;
        await this.saveReadingPlace({ paginated });
        this.render();
      });
    });

    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-pdf-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.pdfViewMode = btn.dataset.pdfMode as 'fit' | 'printed';
        this.render();
      });
    });

    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-paper]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const readerTheme = btn.dataset.paper as 'white' | 'sepia' | 'dark';
        this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerTheme } });
        this.render();
      });
    });

    this.rootEl.querySelector('#aa-font-dec')?.addEventListener('click', async () => {
      const readerFontSize = Math.max(13, this.settings.readerFontSize - 2);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerFontSize } });
      this.render();
    });
    this.rootEl.querySelector('#aa-font-inc')?.addEventListener('click', async () => {
      const readerFontSize = Math.min(34, this.settings.readerFontSize + 2);
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerFontSize } });
      this.render();
    });
    this.rootEl.querySelector('#aa-font-family')?.addEventListener('change', async (e) => {
      const readerFont = (e.target as HTMLSelectElement).value as VerbaSettings['readerFont'];
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { readerFont } });
      this.render();
    });
    this.rootEl.querySelector('#aa-hl-toggle')?.addEventListener('change', async (e) => {
      const highlightWords = (e.target as HTMLInputElement).checked;
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { highlightWords } });
      this.highlighter.settings = this.settings;
      this.highlighter.injectStyles(document);
    });
    this.rootEl.querySelector('#aa-readings-toggle')?.addEventListener('change', async (e) => {
      const readingsEnabled = (e.target as HTMLInputElement).checked;
      const curOpts = getLangOptionsFromSettings(this.settings, this.settings.activeLang);
      const perLang = {
        ...this.settings.perLang,
        [this.settings.activeLang]: { ...curOpts, readingsEnabled },
      };
      this.settings = await sendBgMessage({ type: 'SAVE_SETTINGS', patch: { perLang } });
      this.highlighter.settings = this.settings;
      this.highlighter.langOpts = getLangOptionsFromSettings(this.settings, this.settings.activeLang);
      this.render();
    });

    // Drawer controls
    this.rootEl.querySelector('#drawer-backdrop')?.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('[data-stop-drawer="1"]')) {
        this.drawerOpen = false;
        this.render();
      }
    });
    this.rootEl.querySelector('#btn-drawer-close')?.addEventListener('click', () => {
      this.drawerOpen = false;
      this.render();
    });
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-dtab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.drawerTab = tab.dataset.dtab as 'contents' | 'bookmarks' | 'words';
        this.render();
      });
    });
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-jump-ch]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idx = Number(btn.dataset.jumpCh);
        this.drawerOpen = false;
        this.pageIndex = 0;
        await this.saveReadingPlace({ chapterIndex: idx, scrollRatio: 0 });
        window.scrollTo({ top: 0 });
        this.render();
      });
    });
    this.rootEl.querySelectorAll<HTMLElement>('[data-jump-bm]').forEach((row) => {
      row.addEventListener('click', async (e) => {
        if ((e.target as HTMLElement).closest('[data-del-bm]')) return;
        const bm = this.bookmarks.find((x) => x.id === row.dataset.jumpBm);
        if (!bm) return;
        this.drawerOpen = false;
        await this.saveReadingPlace({ chapterIndex: bm.chapterIndex, scrollRatio: bm.scrollRatio });
        this.render();
        requestAnimationFrame(() => {
          const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
          window.scrollTo({ top: Math.round(maxScroll * bm.scrollRatio) });
        });
      });
    });
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-del-bm]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const bm = this.bookmarks.find((x) => x.id === btn.dataset.delBm);
        if (bm) {
          await putBookmark({ ...bm, deleted: true });
          this.bookmarks = await getBookmarksByBook(book.id);
          this.render();
        }
      });
    });
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-w-scope]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.wordsScope = btn.dataset.wScope as 'chapter' | 'book';
        this.render();
      });
    });
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-w-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.wordsStatusFilter = btn.dataset.wFilter as 'new' | 'learning' | 'all';
        this.render();
      });
    });
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-drawer-word]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const w = btn.dataset.drawerWord!;
        this.wordPanel.openForWord({
          query: w,
          lang: this.settings.activeLang,
          pinned: true,
          rect: btn.getBoundingClientRect(),
        });
      });
    });
  }

  private bindReaderWordEvents(container: HTMLElement): void {
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
      if (!target) {
        if (this.wordPanel.isPinned) this.wordPanel.close();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (this.hoverTimer) {
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }

      if (target.dataset.s === '0' && this.settings.clickNewStartsLearning) {
        await this.gradeWord(target.dataset.w || '', 1, {
          contextSentence: target.closest('p, li, div')?.textContent?.trim().slice(0, 280),
        });
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
    const sentence = el.closest('p, li, blockquote, div')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 280) || '';
    await this.wordPanel.openForWord({
      query: el.dataset.w || el.textContent || '',
      lang: this.settings.activeLang,
      pinned,
      rect: el.getBoundingClientRect(),
      element: el,
      sentence,
      paragraph: sentence,
      lemmaHint: el.dataset.lemma,
    });
  }

  private bindGlobalShortcuts(): void {
    const ext = getExtApi();
    ext?.runtime?.onMessage?.addListener((msg: { type?: string; lang?: LangCode; settings?: VerbaSettings }) => {
      if (!msg?.type) return;
      if ((msg.type === 'VERBA_WORD_UPDATED' || msg.type === 'VERBA_WORDS_REFRESH') && (!msg.lang || msg.lang === this.settings.activeLang)) {
        this.refreshVocabulary(false).catch(() => {});
      } else if (msg.type === 'VERBA_SETTINGS_UPDATED' && msg.settings) {
        const prevLang = this.settings.activeLang;
        this.settings = msg.settings;
        applyTheme(this.settings.theme);
        if (prevLang !== this.settings.activeLang) {
          this.reloadCoreState().then(() => this.render()).catch(() => {});
        } else {
          const langOpts = getLangOptionsFromSettings(this.settings, this.settings.activeLang);
          this.highlighter.settings = this.settings;
          this.highlighter.langOpts = langOpts;
          this.highlighter.refreshAllStatuses(false);
        }
      }
    });

    window.addEventListener('scroll', () => {
      if (this.activeBook && !this.activeBook.paginated) {
        this.saveReadingPlace();
      }
    }, { passive: true });

    window.addEventListener('keydown', async (e) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !this.activeBook) {
        e.preventDefault();
        await this.performUndo();
        return;
      }

      if (!this.activeBook) return;

      if (e.key === 'Escape') {
        if (this.wordPanel.isOpen) {
          this.wordPanel.close();
          return;
        }
        if (this.readerSuite.isSentenceModeOpen) {
          this.readerSuite.closeSentenceBySentence();
          return;
        }
        if (this.drawerOpen || this.aaOpen) {
          this.drawerOpen = false;
          this.aaOpen = false;
          this.render();
          return;
        }
      }

      // Word grading shortcuts when word is open or hovered
      const activeWord =
        this.wordPanel.activeLookup?.query ||
        (this.settings.gradeByHovering ? this.hoveredWordEl?.dataset.w : undefined);

      if (activeWord && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const keyMap: Record<string, WordStatus> = {
          '1': 1,
          '2': 2,
          '3': 3,
          '4': 4,
          k: 5,
          x: -1,
          '0': 0,
        };
        const lower = e.key.toLowerCase();
        if (!e.shiftKey && lower in keyMap) {
          e.preventDefault();
          if (this.hoverTimer) {
            window.clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
          }
          const st = keyMap[lower];
          if (st === 5 || st === -1 || st === 0) this.wordPanel.close();
          await this.gradeWord(activeWord, st);
          return;
        }
      }

      if (e.shiftKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
        const ch = this.activeBook.chapters[this.activeBook.chapterIndex];
        this.readerSuite.openSentenceBySentence(ch?.text || '');
        return;
      }
      if (e.shiftKey && e.key.toUpperCase() === 'R') {
        e.preventDefault();
        const ch = this.activeBook.chapters[this.activeBook.chapterIndex];
        this.readerSuite.toggleReadAloud(ch?.text || '');
        return;
      }
      if (e.shiftKey && e.key.toUpperCase() === 'K') {
        e.preventDefault();
        const { allBlueKeys } = this.highlighter.getCounts();
        if (allBlueKeys.length > 0) {
          await sendBgMessage({
            type: 'BATCH_MARK_KNOWN',
            lang: this.settings.activeLang,
            words: allBlueKeys,
            source: 'manual',
          });
          await this.refreshVocabulary(false);
        }
        return;
      }

      if (this.activeBook.paginated && !this.wordPanel.isOpen) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          this.stepPageOrChapter(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.stepPageOrChapter(-1);
        }
      }
    });
  }
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

new VerbaBooksApp().init().catch((err) => console.error('Verba books error:', err));
