import type {
  CustomDictionaryMeta,
  LangCode,
  PerLanguageOptions,
  ReadingKeymap,
  VerbaSettings,
  VideoKeymap,
} from '../shared/types';
import {
  createDefaultSettings,
  DEFAULT_READING_KEYMAP,
  DEFAULT_VIDEO_KEYMAP,
  generatePairingCode,
  UI_LANGUAGES,
} from '../shared/constants';
import {
  deleteCustomDict,
  deleteLanguageProgress,
  getAllBookmarksRaw,
  getAllBooksRaw,
  getAllDailyStats,
  getAllListeningHistory,
  getAllWordsRaw,
  getCustomDictsByLang,
  getFoldersByLang,
  getLangOptionsFromSettings,
  putBook,
  putBookmark,
  putCustomDict,
  putDailyStatsBatch,
  putFolder,
  putListeningLog,
  putWordRecordsBatch,
} from '../shared/db';
import { getDefaultLangOptions, LANGUAGES, LANG_MAP } from '../shared/languages';
import { parseTableDictionary, parseYomitanZip } from '../shared/imports';
import { sendBgMessage } from '../shared/messaging';
import {
  decryptApiKeysWithPassphrase,
  encryptApiKeysWithPassphrase,
  mergeBookItems,
  mergeBookmarks,
  mergeDailyStats,
  mergeListeningLogs,
  mergeWordRecords,
  sha256Hex,
  validatePairingCode,
  type VerbaBackupBundle,
} from '../shared/sync-crypto';
import { speakText } from '../shared/tts';

export type SettingsSectionId =
  | 'profile'
  | 'reading'
  | 'appearance'
  | 'languages'
  | 'voice'
  | 'listen'
  | 'captions'
  | 'controller'
  | 'ai'
  | 'anki'
  | 'sync'
  | 'data';

const SECTION_META: { id: SettingsSectionId; group: string; label: string; keywords: string }[] = [
  { id: 'profile', group: 'General', label: 'Profile', keywords: 'profile name learner device' },
  { id: 'reading', group: 'Reading & words', label: 'Reading', keywords: 'hover click links keyboard shortcuts keymap never run domains goals pdf font inline word replacement diglot weave toucan fluent code switching passive immersion' },
  { id: 'appearance', group: 'Reading & words', label: 'Appearance', keywords: 'theme dark light colours highlight underline strength word panel size' },
  { id: 'languages', group: 'Reading & words', label: 'Languages', keywords: '24 languages counting lemma surface readings furigana pinyin jyutping pitch accent yomitan dictionary delete' },
  { id: 'voice', group: 'Reading & words', label: 'Voice', keywords: 'tts speech aloud kokoro cloud voice speed volume' },
  { id: 'listen', group: 'Videos', label: 'Watch & Listen', keywords: 'smart listening tracking youtube thumbnail domains' },
  { id: 'captions', group: 'Videos', label: 'Dual Captions', keywords: 'subtitles captions blur translation karaoke auto pause band filter opacity' },
  { id: 'controller', group: 'Extras', label: 'Game controller', keywords: 'gamepad xbox playstation joycon swap abxy scroll' },
  { id: 'ai', group: 'Extras', label: 'AI check', keywords: 'gemini claude openai deepseek api key verdict chatgpt prompt' },
  { id: 'anki', group: 'Extras', label: 'Anki', keywords: 'ankiconnect port deck note type card layout mature suspend sync' },
  { id: 'sync', group: 'Devices & data', label: 'Sync & backup', keywords: 'pairing code backup restore merge passphrase encrypt aes' },
  { id: 'data', group: 'Devices & data', label: 'Your data', keywords: 'export import json reset defaults privacy' },
];

const READING_SHORTCUT_LABELS: [keyof ReadingKeymap, string][] = [
  ['grade1', 'Grade Level 1'],
  ['grade2', 'Grade Level 2'],
  ['grade3', 'Grade Level 3'],
  ['grade4', 'Grade Level 4'],
  ['known', 'Mark Known'],
  ['ignore', 'Ignore word'],
  ['resetNew', 'Reset back to New'],
  ['aiCheck', 'Run AI word check'],
  ['speakWord', 'Speak word'],
  ['speakSentence', 'Speak sentence'],
  ['customMeaning', 'Edit custom meaning'],
  ['googleTranslate', 'Translate sentence'],
  ['dictLink', 'Open external dictionary'],
  ['charactersTab', 'Switch Meaning / Characters'],
  ['ankiAdd', 'Send to Anki'],
  ['ankiPick', 'Pick Anki card details'],
  ['askAiChat', 'Ask your AI chat'],
  ['nextWord', 'Next study word'],
  ['prevWord', 'Previous study word'],
  ['markPageKnown', 'Mark all page blue Known'],
  ['toggleHighlights', 'Toggle word highlights'],
  ['readAloud', 'Read page aloud'],
  ['openReaderView', 'Reader View'],
  ['sentenceMode', 'Sentence by sentence'],
  ['nextFreqSentence', 'Next sentence w/ frequent word'],
  ['prevFreqSentence', 'Prev sentence w/ frequent word'],
  ['toggleDiglot', 'Toggle Inline Word Replacement'],
];

const VIDEO_SHORTCUT_LABELS: [keyof VideoKeymap, string][] = [
  ['toggleCaptions', 'Toggle Dual Captions'],
  ['prevLine', 'Previous subtitle line'],
  ['replayLine', 'Replay current line'],
  ['nextLine', 'Next subtitle line'],
  ['autoPause', 'Toggle Auto-pause'],
  ['peekForward', 'Peek blurred layer'],
  ['hideKnownLines', 'Hide fully known lines'],
  ['cycleBandFilter', 'Cycle vocabulary band'],
  ['wordsInVideo', 'Words in this video'],
  ['subEarlier', 'Subtitles 0.25s earlier'],
  ['subLater', 'Subtitles 0.25s later'],
  ['nextFreqLine', 'Next line w/ frequent unknown'],
  ['markLineKnown', 'Mark subtitle line Known'],
];

export interface SettingsViewContext {
  settings: VerbaSettings;
  activeSection: SettingsSectionId;
  searchQuery: string;
  optionsLang: LangCode;
  customDicts: CustomDictionaryMeta[];
  onSavePatch: (patch: Partial<VerbaSettings>) => Promise<void>;
  onSelectSection: (sec: SettingsSectionId) => void;
  onSearchChange: (q: string) => void;
  onOptionsLangChange: (lang: LangCode) => Promise<void>;
  onNotify: (msg: string) => void;
  onDataMutated: () => Promise<void>;
}

let recordingTarget: { group: 'reading' | 'video'; key: string } | null = null;
let backupPassphraseMem = '';

export function renderSettingsTab(container: HTMLElement, ctx: SettingsViewContext): void {
  const s = ctx.settings;
  const q = ctx.searchQuery.trim().toLowerCase();

  const matchingSections = q
    ? SECTION_META.filter(
        (m) => m.label.toLowerCase().includes(q) || m.keywords.toLowerCase().includes(q)
      ).map((m) => m.id)
    : [ctx.activeSection];

  const groups = ['General', 'Reading & words', 'Videos', 'Extras', 'Devices & data'];
  const navHtml = groups
    .map((grp) => {
      const items = SECTION_META.filter((m) => m.group === grp);
      return `
        <div class="settings-group-lbl">${esc(grp)}</div>
        ${items
          .map(
            (it) => `
          <button
            type="button"
            class="settings-nav-btn ${!q && ctx.activeSection === it.id ? 'active' : ''}"
            data-sec-nav="${it.id}"
          >
            ${esc(it.label)}
          </button>
        `
          )
          .join('')}
      `;
    })
    .join('');

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap">
      <div>
        <h1 class="page-heading">Settings</h1>
        <p class="page-sub" style="margin-bottom:0">Every Verba control lives locally on your device — changes take effect immediately.</p>
      </div>
      <input
        type="search"
        id="settings-search-input"
        class="input"
        style="min-width:270px"
        placeholder="Search settings (e.g. furigana, Anki, blur, backup)…"
        value="${esc(ctx.searchQuery)}"
      />
    </div>

    <div class="settings-layout">
      <nav class="settings-nav" aria-label="Settings sections">
        ${navHtml}
      </nav>
      <div id="settings-sections-pane">
        ${
          matchingSections.length === 0
            ? `<div class="card"><p style="margin:0;color:var(--ink-3)">No settings match "${esc(ctx.searchQuery)}".</p></div>`
            : matchingSections.map((secId) => renderSectionHtml(secId, ctx)).join('')
        }
      </div>
    </div>
  `;

  bindSettingsEvents(container, ctx);
}

function renderSectionHtml(secId: SettingsSectionId, ctx: SettingsViewContext): string {
  const s = ctx.settings;
  const langOpts = getLangOptionsFromSettings(s, ctx.optionsLang);
  const langMeta = LANG_MAP[ctx.optionsLang];

  switch (secId) {
    case 'profile':
      return `
        <section class="settings-section" data-sec="profile">
          <h2 class="card-title">General &amp; Learner Profile</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Learner display name</div>
              <div class="setting-desc">Stored locally on your device for your study log and backups.</div>
            </div>
            <input type="text" class="input" data-str="profileName" placeholder="Learner" value="${esc(s.profileName)}" style="width:230px" />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Device ID</div>
              <div class="setting-desc">Used for conflict-free multi-device backup &amp; sync.</div>
            </div>
            <code style="font-family:var(--mono);font-size:12px;color:var(--ink-2)">${esc(s.deviceId)}</code>
          </div>
        </section>
      `;

    case 'reading': {
      const conflicts = detectKeyConflicts(s.readingKeymap);
      return `
        <section class="settings-section" data-sec="reading">
          <h2 class="card-title">Reading &amp; Keyboard Shortcuts</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Run Verba on web pages</div>
              <div class="setting-desc">Automatically highlight unfamiliar words on articles, forums &amp; chatbots.</div>
            </div>
            <input type="checkbox" data-bool="runOnWebPages" ${s.runOnWebPages ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Inline word replacement on native-language pages (Diglot Weave)</div>
              <div class="setting-desc">Passively weave target-language vocabulary into English/L1 web pages you browse daily (Trusty &amp; Truong, CHI 2011).</div>
            </div>
            <input type="checkbox" data-bool="inlineReplacementEnabled" ${s.inlineReplacementEnabled ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Inline replacement density (${s.inlineReplacementDensityPct}%)</div>
              <div class="setting-desc">Percentage of words per paragraph replaced with target-language equivalents.</div>
            </div>
            <input type="range" min="5" max="40" step="5" data-num="inlineReplacementDensityPct" value="${s.inlineReplacementDensityPct}" />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Vocabulary pool to weave</div>
              <div class="setting-desc">Prioritizes words you are actively learning (1–4) plus high-frequency new words (i+1).</div>
            </div>
            <select class="select" data-str="inlineReplacementPool">
              <option value="learning_and_new" ${s.inlineReplacementPool === 'learning_and_new' ? 'selected' : ''}>Learning (1–4) + New words (i+1)</option>
              <option value="learning_only" ${s.inlineReplacementPool === 'learning_only' ? 'selected' : ''}>Learning words only (1–4)</option>
              <option value="all_vocab" ${s.inlineReplacementPool === 'all_vocab' ? 'selected' : ''}>All vocabulary (including Known)</option>
            </select>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show original word hint next to woven words</div>
              <div class="setting-desc">Displays a subtle inline hint of the original L1 word alongside the target-language replacement.</div>
            </div>
            <input type="checkbox" data-bool="inlineReplacementShowHint" ${s.inlineReplacementShowHint ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show floating Counter Island on pages</div>
              <div class="setting-desc">Shows page new/learning counts, Know-all button &amp; Reader trigger.</div>
            </div>
            <input type="checkbox" data-bool="showPageCounter" ${s.showPageCounter ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Grade words by hovering</div>
              <div class="setting-desc">Press 1–4, K, X, or 0 while hovering a word without clicking first.</div>
            </div>
            <input type="checkbox" data-bool="gradeByHovering" ${s.gradeByHovering ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Hover preview delay (${s.hoverDelayMs} ms)</div>
            </div>
            <input type="range" min="0" max="600" step="20" data-num="hoverDelayMs" value="${s.hoverDelayMs}" />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Clicking a blue (New) word starts learning at Level 1</div>
            </div>
            <input type="checkbox" data-bool="clickNewStartsLearning" ${s.clickNewStartsLearning ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Links &amp; buttons stay clickable (Shift+click opens word)</div>
            </div>
            <input type="checkbox" data-bool="linksStayClickable" ${s.linksStayClickable ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show context-matching dictionary entry first</div>
            </div>
            <input type="checkbox" data-bool="contextMeaningFirst" ${s.contextMeaningFirst ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Where words read are counted</div>
            </div>
            <select class="select" data-str="countWordsReadWhere">
              <option value="everywhere" ${s.countWordsReadWhere === 'everywhere' ? 'selected' : ''}>Everywhere Verba highlights</option>
              <option value="reader_and_books" ${s.countWordsReadWhere === 'reader_and_books' ? 'selected' : ''}>Only in Reader &amp; Books</option>
            </select>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">PDF default view</div>
            </div>
            <select class="select" data-str="pdfDefaultMode">
              <option value="fit_phones" ${s.pdfDefaultMode === 'fit_phones' ? 'selected' : ''}>Reflowed paragraphs</option>
              <option value="printed" ${s.pdfDefaultMode === 'printed' ? 'selected' : ''}>Printed page layout</option>
            </select>
          </div>
          <div class="setting-row" style="align-items:flex-start">
            <div>
              <div class="setting-label">Never run on these domains</div>
              <div class="setting-desc">One hostname per line (e.g. mail.google.com).</div>
            </div>
            <textarea class="textarea" id="never-domains-ta" rows="3" style="width:260px">${esc(s.neverRunDomains.join('\n'))}</textarea>
          </div>

          <div style="margin-top:18px;display:flex;justify-content:space-between;align-items:center">
            <h3 style="margin:0;font-size:15px;color:var(--ink)">Keyboard Shortcuts (Click any key to rebind)</h3>
            <button type="button" class="btn btn-sm" id="btn-reset-keymaps">Reset default keys</button>
          </div>
          ${
            conflicts.length > 0
              ? `<p style="color:#fbbf24;font-size:12px;margin:6px 0">⚠ Duplicate key binding detected: ${esc(conflicts.join(', '))}</p>`
              : ''
          }
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:6px 18px;margin-top:10px">
            ${READING_SHORTCUT_LABELS.map(([key, lbl]) => {
              const isRec = recordingTarget?.group === 'reading' && recordingTarget.key === key;
              return `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border-subtle)">
                  <span style="font-size:12.5px">${esc(lbl)}</span>
                  <button type="button" class="keybind-btn ${isRec ? 'recording' : ''}" data-bind-group="reading" data-bind-key="${key}">
                    ${isRec ? 'Press key…' : esc(s.readingKeymap[key])}
                  </button>
                </div>
              `;
            }).join('')}
          </div>

          <h3 style="margin:18px 0 8px;font-size:15px;color:var(--ink)">Video (Dual Captions) Shortcuts</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:6px 18px">
            ${VIDEO_SHORTCUT_LABELS.map(([key, lbl]) => {
              const isRec = recordingTarget?.group === 'video' && recordingTarget.key === key;
              return `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border-subtle)">
                  <span style="font-size:12.5px">${esc(lbl)}</span>
                  <button type="button" class="keybind-btn ${isRec ? 'recording' : ''}" data-bind-group="video" data-bind-key="${key}">
                    ${isRec ? 'Press key…' : esc(s.videoKeymap[key])}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      `;
    }

    case 'appearance':
      return `
        <section class="settings-section" data-sec="appearance">
          <h2 class="card-title">Appearance &amp; Highlight Colours</h2>
          <div class="setting-row">
            <div><div class="setting-label">Theme</div></div>
            <select class="select" data-str="theme">
              <option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>Dark (Verba slate)</option>
              <option value="light" ${s.theme === 'light' ? 'selected' : ''}>Light (Warm paper)</option>
              <option value="system" ${s.theme === 'system' ? 'selected' : ''}>Match system</option>
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Interface language</div></div>
            <select class="select" data-str="uiLanguage">
              ${UI_LANGUAGES.map((l) => `<option value="${l.code}" ${s.uiLanguage === l.code ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight unfamiliar words (Shift+H)</div></div>
            <input type="checkbox" data-bool="highlightWords" ${s.highlightWords ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Underline instead of background fill</div></div>
            <input type="checkbox" data-bool="underlineInsteadOfFill" ${s.underlineInsteadOfFill ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight special words (names &amp; places)</div></div>
            <input type="checkbox" data-bool="specialWordsHighlight" ${s.specialWordsHighlight ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight strength (${Math.round(s.highlightStrength * 100)}%)</div></div>
            <input type="range" min="0.5" max="1.5" step="0.1" data-num="highlightStrength" value="${s.highlightStrength}" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Highlight colours (New / Learning / Cross-script / Phrase)</div></div>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" data-color="newWord" value="${s.colors.newWord}" title="New word" />
              <input type="color" data-color="learning" value="${s.colors.learning}" title="Learning" />
              <input type="color" data-color="crossScript" value="${s.colors.crossScript}" title="Cross-script known" />
              <input type="color" data-color="selectedPhrase" value="${s.colors.selectedPhrase}" title="Selected phrase" />
            </div>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Word panel size</div></div>
            <select class="select" id="wp-size-select">
              ${(['S', 'M', 'L', 'XL'] as const).map((sz) => `<option value="${sz}" ${s.wordPanel.size === sz ? 'selected' : ''}>${sz}</option>`).join('')}
            </select>
          </div>
        </section>
      `;

    case 'languages':
      return `
        <section class="settings-section" data-sec="languages">
          <h2 class="card-title">Languages (All 24 Offline Dictionaries)</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Automatically switch active language to match page</div>
              <div class="setting-desc">Only switches among languages ticked in "Languages I'm learning" below.</div>
            </div>
            <input type="checkbox" data-bool="autoSwitchPageLang" ${s.autoSwitchPageLang ? 'checked' : ''} />
          </div>

          <div style="margin:12px 0">
            <div class="setting-label" style="margin-bottom:8px">Languages I'm learning (${s.learningLangs.length} active)</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:6px">
              ${LANGUAGES.map((l) => {
                const checked = s.learningLangs.includes(l.code);
                return `
                  <label style="display:flex;align-items:center;gap:7px;padding:6px 9px;background:var(--surface-2);border-radius:7px;cursor:pointer;font-size:12.5px">
                    <input type="checkbox" class="learn-lang-chk" value="${l.code}" ${checked ? 'checked' : ''} />
                    <span>${esc(l.name)} <small style="color:var(--ink-3)">${esc(l.nativeName)}</small></span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <hr style="border:none;border-top:1px solid var(--border);margin:18px 0" />

          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap">
            <h3 style="margin:0;font-family:var(--serif);font-style:italic;font-size:20px;color:var(--ink)">
              Options for ${esc(langMeta?.name || ctx.optionsLang)}
            </h3>
            <select id="opts-lang-picker" class="select">
              ${LANGUAGES.map((l) => `<option value="${l.code}" ${l.code === ctx.optionsLang ? 'selected' : ''}>${esc(l.name)} (${esc(l.nativeName)})</option>`).join('')}
            </select>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Word counting &amp; inflections</div>
              <div class="setting-desc">"As one word" groups inflected forms under their dictionary lemma; "Every form separately" tracks surface forms independently.</div>
            </div>
            <select class="select" data-langopt-str="countingMode">
              <option value="lemma" ${langOpts.countingMode === 'lemma' ? 'selected' : ''}>As one word (Lemma)</option>
              <option value="surface" ${langOpts.countingMode === 'surface' ? 'selected' : ''}>Every form separately</option>
            </select>
          </div>

          ${
            ctx.optionsLang === 'zh' || ctx.optionsLang === 'yue'
              ? `
            <div class="setting-row">
              <div>
                <div class="setting-label">Unify Simplified &amp; Traditional characters</div>
                <div class="setting-desc">Known words in one script glow green in the other script and count once.</div>
              </div>
              <input type="checkbox" data-langopt-bool="unifyScripts" ${langOpts.unifyScripts ? 'checked' : ''} />
            </div>
          `
              : ''
          }

          ${
            langMeta?.notations?.length
              ? `
            <div class="setting-row">
              <div><div class="setting-label">Show readings above words (Furigana / Pinyin / Romanization)</div></div>
              <input type="checkbox" data-langopt-bool="readingsEnabled" ${langOpts.readingsEnabled ? 'checked' : ''} />
            </div>
            <div class="setting-row">
              <div><div class="setting-label">Reading notation</div></div>
              <select class="select" data-langopt-str="readingNotation">
                ${langMeta.notations.map((n) => `<option value="${n.id}" ${langOpts.readingNotation === n.id ? 'selected' : ''}>${esc(n.label)}</option>`).join('')}
              </select>
            </div>
            <div class="setting-row">
              <div><div class="setting-label">Show readings over</div></div>
              <select class="select" data-langopt-str="readingScope">
                <option value="new_learning" ${langOpts.readingScope === 'new_learning' ? 'selected' : ''}>New &amp; Learning (1–3)</option>
                <option value="new_only" ${langOpts.readingScope === 'new_only' ? 'selected' : ''}>New words only</option>
                <option value="every_word" ${langOpts.readingScope === 'every_word' ? 'selected' : ''}>Every word</option>
              </select>
            </div>
          `
              : ''
          }

          ${
            ctx.optionsLang === 'ja'
              ? `
            <div class="setting-row">
              <div><div class="setting-label">Show Japanese pitch accent</div></div>
              <input type="checkbox" data-langopt-bool="pitchAccent" ${langOpts.pitchAccent ? 'checked' : ''} />
            </div>
          `
              : ''
          }

          <div class="setting-row">
            <div><div class="setting-label">Translate into language</div></div>
            <select class="select" data-langopt-str="translateIntoLang">
              ${UI_LANGUAGES.map((l) => `<option value="${l.code}" ${langOpts.translateIntoLang === l.code ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}
            </select>
          </div>

          <div class="setting-row">
            <div><div class="setting-label">Who translates sentences &amp; missing words</div></div>
            <select class="select" data-langopt-str="whoTranslates">
              <option value="google" ${langOpts.whoTranslates === 'google' ? 'selected' : ''}>Google Translate (with offline fallback)</option>
              <option value="offline" ${langOpts.whoTranslates === 'offline' ? 'selected' : ''}>Offline dictionary synthesis only</option>
            </select>
          </div>

          <div class="setting-row" style="align-items:flex-start;flex-direction:column">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
              <div>
                <div class="setting-label">Your own dictionaries (Yomitan .zip or CSV/TSV)</div>
                <div class="setting-desc">Import custom monolingual or specialist dictionaries for ${esc(langMeta?.name || ctx.optionsLang)}.</div>
              </div>
              <div style="display:flex;gap:8px;align-items:center">
                <select class="select" data-langopt-str="customDictPlacement">
                  <option value="above" ${langOpts.customDictPlacement === 'above' ? 'selected' : ''}>Show above built-in</option>
                  <option value="below" ${langOpts.customDictPlacement === 'below' ? 'selected' : ''}>Show below built-in</option>
                  <option value="replace" ${langOpts.customDictPlacement === 'replace' ? 'selected' : ''}>Replace built-in</option>
                </select>
                <label class="btn btn-primary" style="cursor:pointer">
                  + Import dictionary
                  <input type="file" id="custom-dict-file" accept=".zip,.csv,.tsv,.txt" hidden />
                </label>
              </div>
            </div>
            ${
              ctx.customDicts.length > 0
                ? `<div style="width:100%;display:flex;flex-direction:column;gap:6px;margin-top:8px">
                  ${ctx.customDicts
                    .map(
                      (cd) => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:var(--surface-2);border-radius:7px">
                      <span><strong>${esc(cd.name)}</strong> <small style="color:var(--ink-3)">(${cd.entryCount.toLocaleString()} entries · ${cd.format})</small></span>
                      <button type="button" class="btn btn-sm btn-danger" data-del-dict="${esc(cd.id)}">Remove</button>
                    </div>
                  `
                    )
                    .join('')}
                </div>`
                : ''
            }
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label" style="color:#fca5a5">Delete all ${esc(langMeta?.name || ctx.optionsLang)} progress</div>
              <div class="setting-desc">Resets saved vocabulary and statistics for this language only.</div>
            </div>
            <button type="button" class="btn btn-danger" id="btn-delete-lang-progress">Delete progress…</button>
          </div>
        </section>
      `;

    case 'voice':
      return `
        <section class="settings-section" data-sec="voice">
          <h2 class="card-title">Voice &amp; Read Aloud</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Voice engine</div>
              <div class="setting-desc">Device Web Speech, Cloud AI voice, or local Kokoro-FastAPI / AllTalk server.</div>
            </div>
            <select class="select" data-str="voiceBackend">
              <option value="device" ${s.voiceBackend === 'device' ? 'selected' : ''}>Device built-in voices</option>
              <option value="cloud" ${s.voiceBackend === 'cloud' ? 'selected' : ''}>Cloud TTS (OpenAI / ElevenLabs / Google)</option>
              <option value="local_server" ${s.voiceBackend === 'local_server' ? 'selected' : ''}>Local server (Kokoro-FastAPI)</option>
            </select>
          </div>
          ${
            s.voiceBackend === 'cloud'
              ? `
            <div class="setting-row">
              <div><div class="setting-label">Cloud provider &amp; API key</div></div>
              <div style="display:flex;gap:8px">
                <select class="select" data-str="cloudVoiceProvider">
                  <option value="openai" ${s.cloudVoiceProvider === 'openai' ? 'selected' : ''}>OpenAI TTS</option>
                  <option value="elevenlabs" ${s.cloudVoiceProvider === 'elevenlabs' ? 'selected' : ''}>ElevenLabs</option>
                  <option value="google" ${s.cloudVoiceProvider === 'google' ? 'selected' : ''}>Google Cloud</option>
                </select>
                <input type="password" class="input" data-str="cloudVoiceApiKey" placeholder="API key" value="${esc(s.cloudVoiceApiKey)}" />
              </div>
            </div>
          `
              : ''
          }
          ${
            s.voiceBackend === 'local_server'
              ? `
            <div class="setting-row">
              <div><div class="setting-label">Local TTS server URL</div></div>
              <input type="text" class="input" data-str="localVoiceServerUrl" value="${esc(s.localVoiceServerUrl)}" style="width:250px" />
            </div>
          `
              : ''
          }
          <div class="setting-row">
            <div><div class="setting-label">Speaking speed (${s.voiceSpeed.toFixed(1)}×)</div></div>
            <input type="range" min="0.5" max="2.0" step="0.1" data-num="voiceSpeed" value="${s.voiceSpeed}" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Automatically pronounce word when opened</div></div>
            <input type="checkbox" data-bool="sayWordOnOpen" ${s.sayWordOnOpen ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Test active language voice</div></div>
            <button type="button" class="btn btn-primary" id="btn-test-voice">🔊 Test voice</button>
          </div>
        </section>
      `;

    case 'listen':
      return `
        <section class="settings-section" data-sec="listen">
          <h2 class="card-title">Watch &amp; Listen</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Smart background listening tracker</div>
              <div class="setting-desc">Credits audible tabs whose title matches your target language.</div>
            </div>
            <input type="checkbox" data-bool="smartListeningTracking" ${s.smartListeningTracking ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Hold unsure tracks for review in Progress → Listening History</div>
            </div>
            <input type="checkbox" data-bool="askUnsureTrackLang" ${s.askUnsureTrackLang ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Show word-difficulty badges on YouTube thumbnails</div>
            </div>
            <input type="checkbox" data-bool="youtubeThumbnailCounts" ${s.youtubeThumbnailCounts ? 'checked' : ''} />
          </div>
        </section>
      `;

    case 'captions':
      return `
        <section class="settings-section" data-sec="captions">
          <h2 class="card-title">Verba Dual Captions</h2>
          <div class="setting-row">
            <div><div class="setting-label">Enable Dual Captions on YouTube, Netflix &amp; HTML5 video</div></div>
            <input type="checkbox" data-bool="captionsEnabled" ${s.captionsEnabled ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Target subtitle display</div></div>
            <select class="select" data-str="subtitleMode">
              <option value="show" ${s.subtitleMode === 'show' ? 'selected' : ''}>Show clearly</option>
              <option value="blur" ${s.subtitleMode === 'blur' ? 'selected' : ''}>Blur until hovered / E</option>
              <option value="hide" ${s.subtitleMode === 'hide' ? 'selected' : ''}>Hide until E</option>
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Translation line display</div></div>
            <select class="select" data-str="translationMode">
              <option value="blur" ${s.translationMode === 'blur' ? 'selected' : ''}>Blur until E</option>
              <option value="show" ${s.translationMode === 'show' ? 'selected' : ''}>Show clearly</option>
              <option value="hide" ${s.translationMode === 'hide' ? 'selected' : ''}>Hide</option>
            </select>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Auto-pause after each subtitle line (Q)</div></div>
            <input type="checkbox" data-bool="autoPauseEachLine" ${s.autoPauseEachLine ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Auto-resume playback when word marked Known</div></div>
            <input type="checkbox" data-bool="autoResumeOnKnown" ${s.autoResumeOnKnown ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Karaoke active-word highlight</div></div>
            <input type="checkbox" data-bool="karaokeMode" ${s.karaokeMode ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Backdrop opacity (${s.subtitleBgOpacity}%)</div></div>
            <input type="range" min="0" max="100" step="5" data-num="subtitleBgOpacity" value="${s.subtitleBgOpacity}" />
          </div>
        </section>
      `;

    case 'controller':
      return `
        <section class="settings-section" data-sec="controller">
          <h2 class="card-title">Game Controller</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Enable Gamepad controls</div>
              <div class="setting-desc">Grade words, step through sentences, or control Dual Captions from the couch with an Xbox, PlayStation, or Joy-Con controller.</div>
            </div>
            <input type="checkbox" data-bool="gamepadEnabled" ${s.gamepadEnabled ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Swap A/B and X/Y (Nintendo Switch layout)</div></div>
            <input type="checkbox" data-bool="swapABXY" ${s.swapABXY ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Scroll step (${s.pageScrollPx} px)</div></div>
            <input type="range" min="120" max="700" step="40" data-num="pageScrollPx" value="${s.pageScrollPx}" />
          </div>
        </section>
      `;

    case 'ai':
      return `
        <section class="settings-section" data-sec="ai">
          <h2 class="card-title">AI Word Check &amp; Ask AI Chat</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Enable AI 4-verdict word check (key A in word panel)</div>
              <div class="setting-desc">Verifies whether a highlighted token is a real word, narrow/slang, or segmentation artifact in context.</div>
            </div>
            <input type="checkbox" data-bool="aiCheckEnabled" ${s.aiCheckEnabled ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">AI Provider &amp; Model</div></div>
            <div style="display:flex;gap:8px">
              <select class="select" data-str="aiProvider">
                <option value="gemini" ${s.aiProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                <option value="claude" ${s.aiProvider === 'claude' ? 'selected' : ''}>Anthropic Claude</option>
                <option value="openai" ${s.aiProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
                <option value="deepseek" ${s.aiProvider === 'deepseek' ? 'selected' : ''}>DeepSeek</option>
              </select>
              <input type="text" class="input" data-str="aiModel" value="${esc(s.aiModel)}" placeholder="Model ID" style="width:175px" />
            </div>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">AI API Key (stored locally)</div></div>
            <input type="password" class="input" data-str="aiApiKey" value="${esc(s.aiApiKey)}" placeholder="Paste API key…" style="width:270px" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Custom extra instruction (max 1,000 chars)</div></div>
            <input type="text" class="input" data-str="aiCustomRequest" maxlength="1000" value="${esc(s.aiCustomRequest)}" placeholder="e.g. Give etymology & register notes" style="width:270px" />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">"Ask your AI chat" target (Shift+I)</div></div>
            <select class="select" data-str="askAiChatProvider">
              <option value="chatgpt" ${s.askAiChatProvider === 'chatgpt' ? 'selected' : ''}>ChatGPT</option>
              <option value="claude" ${s.askAiChatProvider === 'claude' ? 'selected' : ''}>Claude</option>
              <option value="gemini" ${s.askAiChatProvider === 'gemini' ? 'selected' : ''}>Gemini</option>
              <option value="perplexity" ${s.askAiChatProvider === 'perplexity' ? 'selected' : ''}>Perplexity</option>
            </select>
          </div>
        </section>
      `;

    case 'anki':
      return `
        <section class="settings-section" data-sec="anki">
          <h2 class="card-title">Anki Integration (AnkiConnect)</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">AnkiConnect local port</div>
              <div class="setting-desc">Connects to Anki desktop via AnkiConnect (default 8765).</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="number" class="input" data-num="ankiConnectPort" value="${s.ankiConnectPort}" style="width:95px" />
              <button type="button" class="btn" id="btn-anki-test">Try connection</button>
              <button type="button" class="btn btn-primary" id="btn-anki-sync">Sync now</button>
            </div>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Automatically send newly graded Learning words to Anki</div></div>
            <input type="checkbox" data-bool="ankiSendAllLearning" ${s.ankiSendAllLearning ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Mark word Known in Verba when Anki interval ≥ ${s.ankiMatureDays} days</div></div>
            <input type="checkbox" data-bool="ankiMarkKnownOnMature" ${s.ankiMarkKnownOnMature ? 'checked' : ''} />
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Suspend Anki card when marked Known in Verba</div></div>
            <input type="checkbox" data-bool="ankiSuspendWhenKnown" ${s.ankiSuspendWhenKnown ? 'checked' : ''} />
          </div>
          <div style="margin-top:12px">
            <div class="setting-label" style="margin-bottom:6px">Card Field Layout ("Verba" Note Type)</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px">
              ${(
                [
                  ['word', 'Word'],
                  ['reading', 'Reading'],
                  ['meaning', 'Meaning'],
                  ['sentence', 'Context sentence'],
                  ['sentenceTranslation', 'Sentence translation'],
                  ['wordAudio', 'Word audio'],
                ] as const
              )
                .map(
                  ([field, label]) => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--surface-2);border-radius:7px">
                  <span style="font-size:12.5px">${esc(label)}</span>
                  <select class="select anki-layout-sel" data-field="${field}" style="padding:3px 7px;font-size:12px">
                    <option value="front" ${s.ankiCardLayout[field] === 'front' ? 'selected' : ''}>Front</option>
                    <option value="back" ${s.ankiCardLayout[field] === 'back' ? 'selected' : ''}>Back</option>
                    ${field !== 'word' ? `<option value="off" ${s.ankiCardLayout[field] === 'off' ? 'selected' : ''}>Off</option>` : ''}
                  </select>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </section>
      `;

    case 'sync':
      return `
        <section class="settings-section" data-sec="sync">
          <h2 class="card-title">Sync &amp; Backup (CRDT Conflict-Free Merge)</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Device pairing code (8–32 letters &amp; digits)</div>
              <div class="setting-desc">Rejects weak codes like 12345678 or PASSWORD.</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <input type="text" class="input" id="sync-code-input" value="${esc(s.syncPairingCode)}" style="width:145px;font-family:var(--mono)" />
              <button type="button" class="btn btn-sm" id="btn-save-sync-code">Save</button>
              <button type="button" class="btn btn-sm" id="btn-new-sync-code">New code</button>
            </div>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Lock API keys into backups (PBKDF2 + AES-GCM)</div>
              <div class="setting-desc">${
                s.backupKeyLockedHash
                  ? '✓ Passphrase active — backups include encrypted API keys.'
                  : 'Optional ≥8-character passphrase to encrypt AI & Cloud Voice keys inside backups.'
              }</div>
            </div>
            <button type="button" class="btn" id="btn-lock-keys">Set passphrase…</button>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Create full backup file now</div>
              <div class="setting-desc">${s.lastBackupAt ? `Last backup: ${new Date(s.lastBackupAt).toLocaleString()}` : 'Saves words, books, bookmarks, daily stats & settings.'}</div>
            </div>
            <button type="button" class="btn btn-primary" id="btn-backup-now">⬇ Back up now (.json)</button>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Sync or Restore from another Verba backup file</div>
              <div class="setting-desc"><strong>Sync with this device</strong> sums per-device stats without doubling; <strong>Restore as this device</strong> adopts stats onto this device ID.</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <label class="btn btn-amber" style="cursor:pointer">
                ⇄ Sync with this device
                <input type="file" id="file-sync-other" accept=".json" hidden />
              </label>
              <label class="btn" style="cursor:pointer">
                ↺ Restore as this device
                <input type="file" id="file-restore-same" accept=".json" hidden />
              </label>
            </div>
          </div>
        </section>
      `;

    case 'data':
      return `
        <section class="settings-section" data-sec="data">
          <h2 class="card-title">Your Data &amp; Privacy</h2>
          <div class="setting-row">
            <div>
              <div class="setting-label">Plain export (API keys stripped)</div>
              <div class="setting-desc">Safe to share or archive — never includes API keys, even encrypted.</div>
            </div>
            <button type="button" class="btn" id="btn-plain-export">Export data (.json)</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Reset all settings to factory defaults</div>
              <div class="setting-desc">Keeps your learned words and books intact, resetting only preferences &amp; keymaps.</div>
            </div>
            <button type="button" class="btn btn-danger" id="btn-reset-settings">Reset settings</button>
          </div>
        </section>
      `;
  }
}

function detectKeyConflicts(km: ReadingKeymap): string[] {
  const seen = new Map<string, string>();
  const dupes = new Set<string>();
  for (const [k, combo] of Object.entries(km)) {
    const norm = String(combo).toLowerCase();
    if (!norm) continue;
    if (seen.has(norm)) dupes.add(combo);
    else seen.set(norm, k);
  }
  return Array.from(dupes);
}

function bindSettingsEvents(container: HTMLElement, ctx: SettingsViewContext): void {
  const s = ctx.settings;

  const searchInput = container.querySelector<HTMLInputElement>('#settings-search-input');
  searchInput?.addEventListener('input', () => {
    ctx.onSearchChange(searchInput.value);
  });

  container.querySelectorAll<HTMLButtonElement>('[data-sec-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ctx.onSelectSection(btn.dataset.secNav as SettingsSectionId);
    });
  });

  // Generic boolean toggles
  container.querySelectorAll<HTMLInputElement>('[data-bool]').forEach((chk) => {
    chk.addEventListener('change', () => {
      const key = chk.dataset.bool as keyof VerbaSettings;
      ctx.onSavePatch({ [key]: chk.checked } as Partial<VerbaSettings>);
    });
  });

  // Generic string inputs/selects
  container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-str]').forEach((el) => {
    el.addEventListener('change', () => {
      const key = el.dataset.str as keyof VerbaSettings;
      ctx.onSavePatch({ [key]: el.value } as Partial<VerbaSettings>);
    });
  });

  // Generic numeric sliders/inputs
  container.querySelectorAll<HTMLInputElement>('[data-num]').forEach((el) => {
    el.addEventListener('change', () => {
      const key = el.dataset.num as keyof VerbaSettings;
      ctx.onSavePatch({ [key]: Number(el.value) } as Partial<VerbaSettings>);
    });
  });

  // Color pickers
  container.querySelectorAll<HTMLInputElement>('[data-color]').forEach((el) => {
    el.addEventListener('change', () => {
      const cKey = el.dataset.color as keyof VerbaSettings['colors'];
      ctx.onSavePatch({ colors: { ...s.colors, [cKey]: el.value } });
    });
  });

  // Word panel size
  container.querySelector<HTMLSelectElement>('#wp-size-select')?.addEventListener('change', (e) => {
    const size = (e.target as HTMLSelectElement).value as 'S' | 'M' | 'L' | 'XL';
    ctx.onSavePatch({ wordPanel: { ...s.wordPanel, size } });
  });

  // Never run domains
  container.querySelector<HTMLTextAreaElement>('#never-domains-ta')?.addEventListener('change', (e) => {
    const domains = (e.target as HTMLTextAreaElement).value
      .split(/\r?\n/)
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    ctx.onSavePatch({ neverRunDomains: domains });
  });

  // Keybind buttons
  container.querySelectorAll<HTMLButtonElement>('[data-bind-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      recordingTarget = {
        group: btn.dataset.bindGroup as 'reading' | 'video',
        key: btn.dataset.bindKey!,
      };
      renderSettingsTab(container, ctx);

      const onKey = async (ev: KeyboardEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.key === 'Shift' || ev.key === 'Control' || ev.key === 'Alt' || ev.key === 'Meta') return;
        window.removeEventListener('keydown', onKey, true);

        const target = recordingTarget;
        recordingTarget = null;
        if (!target || ev.key === 'Escape') {
          renderSettingsTab(container, ctx);
          return;
        }

        const mods: string[] = [];
        if (ev.ctrlKey) mods.push('Ctrl');
        if (ev.altKey) mods.push('Alt');
        if (ev.shiftKey && ev.key.length === 1) mods.push('Shift');
        const kName = ev.key.length === 1 ? (mods.length ? ev.key.toUpperCase() : ev.key.toLowerCase()) : ev.key;
        const combo = [...mods, kName].join('+');

        if (target.group === 'reading') {
          await ctx.onSavePatch({
            readingKeymap: { ...s.readingKeymap, [target.key]: combo },
          });
        } else {
          await ctx.onSavePatch({
            videoKeymap: { ...s.videoKeymap, [target.key]: combo },
          });
        }
      };
      window.addEventListener('keydown', onKey, true);
    });
  });

  container.querySelector('#btn-reset-keymaps')?.addEventListener('click', () => {
    ctx.onSavePatch({
      readingKeymap: { ...DEFAULT_READING_KEYMAP },
      videoKeymap: { ...DEFAULT_VIDEO_KEYMAP },
    });
    ctx.onNotify('Keyboard shortcuts restored to defaults.');
  });

  // Languages checkboxes
  container.querySelectorAll<HTMLInputElement>('.learn-lang-chk').forEach((chk) => {
    chk.addEventListener('change', () => {
      const code = chk.value as LangCode;
      let next = chk.checked
        ? Array.from(new Set([...s.learningLangs, code]))
        : s.learningLangs.filter((c) => c !== code);
      if (next.length === 0) next = [code];
      const nextActive = next.includes(s.activeLang) ? s.activeLang : next[0];
      const nextPolyglot = Array.from(new Set([...s.polyglotOrder.filter((c) => next.includes(c)), ...next]));
      ctx.onSavePatch({
        learningLangs: next,
        activeLang: nextActive,
        polyglotOrder: nextPolyglot,
      });
    });
  });

  container.querySelector<HTMLSelectElement>('#opts-lang-picker')?.addEventListener('change', (e) => {
    ctx.onOptionsLangChange((e.target as HTMLSelectElement).value as LangCode);
  });

  // Per-language options
  const saveLangOpt = (patch: Partial<PerLanguageOptions>) => {
    const cur = getLangOptionsFromSettings(s, ctx.optionsLang);
    ctx.onSavePatch({
      perLang: {
        ...s.perLang,
        [ctx.optionsLang]: { ...cur, ...patch },
      },
    });
  };

  container.querySelectorAll<HTMLInputElement>('[data-langopt-bool]').forEach((chk) => {
    chk.addEventListener('change', () => {
      const k = chk.dataset.langoptBool as keyof PerLanguageOptions;
      saveLangOpt({ [k]: chk.checked } as Partial<PerLanguageOptions>);
    });
  });

  container.querySelectorAll<HTMLSelectElement>('[data-langopt-str]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const k = sel.dataset.langoptStr as keyof PerLanguageOptions;
      saveLangOpt({ [k]: sel.value } as Partial<PerLanguageOptions>);
    });
  });

  // Custom Yomitan / CSV Dictionary Upload
  container.querySelector<HTMLInputElement>('#custom-dict-file')?.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const isZip = file.name.toLowerCase().endsWith('.zip');
    let name = file.name.replace(/\.[^.]+$/, '');
    let entries = [];
    if (isZip) {
      const parsed = parseYomitanZip(new Uint8Array(await file.arrayBuffer()));
      name = parsed.title || name;
      entries = parsed.entries;
    } else {
      entries = parseTableDictionary(await file.text());
    }
    const existing = await getCustomDictsByLang(ctx.optionsLang);
    const meta: CustomDictionaryMeta = {
      id: `cdict_${ctx.optionsLang}_${Date.now()}`,
      lang: ctx.optionsLang,
      name,
      format: isZip ? 'yomitan' : 'csv',
      enabled: true,
      order: existing.length,
      entryCount: entries.length,
      entries: entries.map((en) => ({ ...en, dictName: name })),
      addedAt: Date.now(),
    };
    await putCustomDict(meta);
    ctx.onNotify(`Imported "${name}" (${entries.length.toLocaleString()} entries)`);
    await ctx.onOptionsLangChange(ctx.optionsLang);
  });

  container.querySelectorAll<HTMLButtonElement>('[data-del-dict]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await deleteCustomDict(btn.dataset.delDict!);
      await ctx.onOptionsLangChange(ctx.optionsLang);
    });
  });

  // Reset language progress
  container.querySelector('#btn-delete-lang-progress')?.addEventListener('click', async () => {
    const langName = LANG_MAP[ctx.optionsLang]?.name || ctx.optionsLang;
    if (!window.confirm(`Reset all saved ${langName} vocabulary and statistics?`)) {
      return;
    }
    await deleteLanguageProgress(ctx.optionsLang);
    sendBgMessage({ type: 'BROADCAST_WORDS_REFRESH', lang: ctx.optionsLang }).catch(() => {});
    await ctx.onDataMutated();
    ctx.onNotify(`Reset all ${langName} progress.`);
  });

  // Voice test
  container.querySelector('#btn-test-voice')?.addEventListener('click', () => {
    const samples: Partial<Record<LangCode, string>> = {
      it: 'Buongiorno! Le parole nuove si illuminano ovunque leggi.',
      zh: '你好！生词在你阅读的每一个地方都会亮起。',
      ja: 'こんにちは。新しい言葉がどこでも光ります。',
      es: '¡Hola! Las palabras nuevas se iluminan dondequiera que leas.',
      de: 'Guten Tag! Neue Wörter leuchten überall auf, wo du liest.',
      fr: 'Bonjour ! Les nouveaux mots s’illuminent partout où vous lisez.',
    };
    speakText(samples[s.activeLang] || 'Verba voice check.', s.activeLang, s);
  });

  // Anki buttons & card layout
  container.querySelector('#btn-anki-test')?.addEventListener('click', async () => {
    const res = await sendBgMessage<{ ok: boolean; version?: number; error?: string }>({
      type: 'ANKI_TEST',
      port: s.ankiConnectPort,
    });
    ctx.onNotify(
      res.ok ? `Connected to AnkiConnect (v${res.version})!` : `AnkiConnect unreachable: ${res.error || 'Is Anki open?'}`
    );
  });

  container.querySelector('#btn-anki-sync')?.addEventListener('click', async () => {
    const res = await sendBgMessage<{ ok: boolean; updatedCount?: number; error?: string }>({
      type: 'ANKI_SYNC_NOW',
    });
    ctx.onNotify(res.ok ? `Anki sync complete (${res.updatedCount || 0} words updated).` : `Anki sync error: ${res.error}`);
  });

  container.querySelectorAll<HTMLSelectElement>('.anki-layout-sel').forEach((sel) => {
    sel.addEventListener('change', () => {
      const f = sel.dataset.field as keyof VerbaSettings['ankiCardLayout'];
      ctx.onSavePatch({
        ankiCardLayout: { ...s.ankiCardLayout, [f]: sel.value },
      });
    });
  });

  // Sync & Backup controls
  container.querySelector('#btn-save-sync-code')?.addEventListener('click', () => {
    const val = (container.querySelector('#sync-code-input') as HTMLInputElement).value.trim();
    const check = validatePairingCode(val);
    if (!check.valid) {
      ctx.onNotify(check.reason || 'Invalid pairing code.');
      return;
    }
    ctx.onSavePatch({ syncPairingCode: val });
    ctx.onNotify('Pairing code updated.');
  });

  container.querySelector('#btn-new-sync-code')?.addEventListener('click', () => {
    ctx.onSavePatch({ syncPairingCode: generatePairingCode() });
  });

  container.querySelector('#btn-lock-keys')?.addEventListener('click', async () => {
    const pass = window.prompt('Enter passphrase (at least 8 characters) to encrypt API keys in backups:');
    if (!pass) return;
    if (pass.length < 8) {
      ctx.onNotify('Passphrase must be at least 8 characters.');
      return;
    }
    backupPassphraseMem = pass;
    const hash = await sha256Hex(pass);
    await ctx.onSavePatch({ backupKeyLockedHash: hash });
    ctx.onNotify('Passphrase active — backups will include AES-GCM encrypted API keys.');
  });

  container.querySelector('#btn-backup-now')?.addEventListener('click', async () => {
    await exportVerbaBundle(ctx, true);
  });

  container.querySelector('#btn-plain-export')?.addEventListener('click', async () => {
    await exportVerbaBundle(ctx, false);
  });

  container.querySelector<HTMLInputElement>('#file-sync-other')?.addEventListener('change', async (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) await importAndMergeBundle(f, 'sync_other_device', ctx);
  });

  container.querySelector<HTMLInputElement>('#file-restore-same')?.addEventListener('change', async (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) await importAndMergeBundle(f, 'restore_same_device', ctx);
  });

  container.querySelector('#btn-reset-settings')?.addEventListener('click', async () => {
    if (!window.confirm('Reset all settings and keyboard shortcuts back to factory defaults?')) return;
    const fresh = createDefaultSettings();
    await ctx.onSavePatch({
      ...fresh,
      deviceId: s.deviceId,
      onboarded: true,
    });
    ctx.onNotify('All settings reset to defaults.');
  });
}

async function exportVerbaBundle(ctx: SettingsViewContext, isAutomaticBackup: boolean): Promise<void> {
  const s = ctx.settings;
  const [words, books, bookmarks, dailyStats, listeningHistory] = await Promise.all([
    getAllWordsRaw(),
    getAllBooksRaw(),
    getAllBookmarksRaw(),
    getAllDailyStats(),
    getAllListeningHistory(),
  ]);

  const folders = [];
  for (const l of LANGUAGES) {
    const fl = await getFoldersByLang(l.code);
    folders.push(...fl);
  }

  // Strip API keys from plain settings object always!
  const safeSettings: Partial<VerbaSettings> = {
    ...s,
    aiApiKey: '',
    cloudVoiceApiKey: '',
  };

  let encryptedKeys = undefined;
  if (isAutomaticBackup && backupPassphraseMem.length >= 8 && (s.aiApiKey || s.cloudVoiceApiKey)) {
    encryptedKeys = await encryptApiKeysWithPassphrase(
      { aiApiKey: s.aiApiKey, cloudVoiceApiKey: s.cloudVoiceApiKey },
      backupPassphraseMem
    );
  }

  const bundle: VerbaBackupBundle = {
    verbaArchiveVersion: 1,
    exportedAt: Date.now(),
    deviceId: s.deviceId,
    isAutomaticBackup,
    words,
    books,
    folders,
    bookmarks,
    dailyStats,
    listeningHistory,
    settings: safeSettings,
    ...(encryptedKeys ? { encryptedKeys } : {}),
  };

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const tag = isAutomaticBackup ? 'backup' : 'export';
  a.download = `verba-${tag}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();

  if (isAutomaticBackup) {
    await ctx.onSavePatch({ lastBackupAt: Date.now() });
  }
  ctx.onNotify(`Downloaded Verba ${tag} (${words.length} word records, ${books.length} books).`);
}

async function importAndMergeBundle(
  file: File,
  mode: 'restore_same_device' | 'sync_other_device',
  ctx: SettingsViewContext
): Promise<void> {
  try {
    const incoming = JSON.parse(await file.text()) as VerbaBackupBundle;
    if (!incoming || incoming.verbaArchiveVersion !== 1) {
      ctx.onNotify('Invalid Verba backup file.');
      return;
    }

    const [localWords, localBooks, localBookmarks, localStats, localListen] = await Promise.all([
      getAllWordsRaw(),
      getAllBooksRaw(),
      getAllBookmarksRaw(),
      getAllDailyStats(),
      getAllListeningHistory(),
    ]);

    const mergedWords = mergeWordRecords(localWords, incoming.words || []);
    const mergedBooks = mergeBookItems(localBooks, incoming.books || []);
    const mergedBookmarks = mergeBookmarks(localBookmarks, incoming.bookmarks || []);
    const mergedStats = mergeDailyStats(localStats, incoming.dailyStats || [], mode, ctx.settings.deviceId);
    const mergedListen = mergeListeningLogs(localListen, incoming.listeningHistory || []);

    await putWordRecordsBatch(mergedWords);
    for (const b of mergedBooks) await putBook(b);
    for (const bm of mergedBookmarks) await putBookmark(bm);
    if (Array.isArray(incoming.folders)) {
      for (const fl of incoming.folders) await putFolder(fl);
    }
    await putDailyStatsBatch(mergedStats);
    for (const lg of mergedListen) await putListeningLog(lg);

    if (mode === 'restore_same_device' && incoming.settings) {
      const safePatch: Partial<VerbaSettings> = {
        ...incoming.settings,
        deviceId: ctx.settings.deviceId,
        aiApiKey: incoming.settings.aiApiKey || ctx.settings.aiApiKey,
        cloudVoiceApiKey: incoming.settings.cloudVoiceApiKey || ctx.settings.cloudVoiceApiKey,
      };
      await ctx.onSavePatch(safePatch);
    }

    if (incoming.encryptedKeys) {
      const pass = window.prompt('This backup contains encrypted API keys. Enter passphrase to unlock (or cancel to skip keys):');
      if (pass) {
        try {
          const keys = await decryptApiKeysWithPassphrase(incoming.encryptedKeys, pass);
          await ctx.onSavePatch(keys);
        } catch {
          ctx.onNotify('Passphrase did not match — data merged without API keys.');
        }
      }
    }

    sendBgMessage({ type: 'BROADCAST_WORDS_REFRESH' }).catch(() => {});
    await ctx.onDataMutated();
    ctx.onNotify(
      mode === 'sync_other_device'
        ? `Synced cleanly (${mergedWords.length} words, ${mergedBooks.length} books)!`
        : `Restored backup onto this device (${mergedWords.length} words)!`
    );
  } catch (err) {
    ctx.onNotify(`Import error: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
