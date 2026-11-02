// src/shared/languages.ts
var LANGUAGES = [
  {
    code: "zh",
    name: "Chinese",
    nativeName: "\u4E2D\u6587",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "pinyin", label: "Pinyin (h\xE0ny\u01D4 p\u012Bny\u012Bn)" },
      { id: "zhuyin", label: "Zhuyin / Bopomofo (\u6CE8\u97F3)" }
    ],
    defaultDictLinks: [
      { name: "MDBG", urlTemplate: "https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Chinese" },
      { name: "Reverso", urlTemplate: "https://context.reverso.net/translation/chinese-english/{word}" }
    ],
    speechLocale: "zh-CN"
  },
  {
    code: "yue",
    name: "Cantonese",
    nativeName: "\u5EE3\u6771\u8A71",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "jyutping", label: "Jyutping (\u7CB5\u62FC)" },
      { id: "yale", label: "Yale Romanization" }
    ],
    defaultDictLinks: [
      { name: "words.hk", urlTemplate: "https://words.hk/zidin/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Chinese" }
    ],
    speechLocale: "zh-HK"
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "\u65E5\u672C\u8A9E",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "hiragana", label: "Hiragana (furigana over kanji)" },
      { id: "katakana", label: "Katakana (over kanji)" },
      { id: "romaji", label: "Romaji (over every word)" }
    ],
    defaultDictLinks: [
      { name: "Jisho", urlTemplate: "https://jisho.org/search/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Japanese" },
      { name: "Weblio", urlTemplate: "https://ejje.weblio.jp/content/{word}" }
    ],
    speechLocale: "ja-JP"
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "\uD55C\uAD6D\uC5B4",
    notations: [{ id: "revised", label: "Revised Romanization (phonetic)" }],
    defaultDictLinks: [
      { name: "Naver Dict", urlTemplate: "https://korean.dict.naver.com/koendict/#/search?query={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Korean" }
    ],
    speechLocale: "ko-KR"
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/iten/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Italian" },
      { name: "Treccani", urlTemplate: "https://www.treccani.it/vocabolario/ricerca/{word}/" }
    ],
    speechLocale: "it-IT"
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    defaultDictLinks: [
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#English" },
      { name: "Cambridge", urlTemplate: "https://dictionary.cambridge.org/dictionary/english/{word}" }
    ],
    speechLocale: "en-US"
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Fran\xE7ais",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/fren/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#French" }
    ],
    speechLocale: "fr-FR"
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    defaultDictLinks: [
      { name: "DWDS", urlTemplate: "https://www.dwds.de/wb/{word}" },
      { name: "dict.cc", urlTemplate: "https://www.dict.cc/?s={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#German" }
    ],
    speechLocale: "de-DE"
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Dutch" }],
    speechLocale: "nl-NL"
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Espa\xF1ol",
    defaultDictLinks: [
      { name: "SpanishDict", urlTemplate: "https://www.spanishdict.com/translate/{word}" },
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/esen/{word}" }
    ],
    speechLocale: "es-ES"
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Portugu\xEAs",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/pten/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Portuguese" }
    ],
    speechLocale: "pt-BR"
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    defaultDictLinks: [
      { name: "svenska.se", urlTemplate: "https://svenska.se/tre/?sok={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Swedish" }
    ],
    speechLocale: "sv-SE"
  },
  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    defaultDictLinks: [{ name: "Ordnet", urlTemplate: "https://ordnet.dk/ddo/ordbog?query={word}" }],
    speechLocale: "da-DK"
  },
  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    defaultDictLinks: [{ name: "Ordb\xF8kene", urlTemplate: "https://ordbokene.no/bm/search?q={word}" }],
    speechLocale: "nb-NO"
  },
  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Finnish" }],
    speechLocale: "fi-FI"
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Polish" }],
    speechLocale: "pl-PL"
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    defaultDictLinks: [
      { name: "OpenRussian", urlTemplate: "https://en.openrussian.org/ru/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Russian" }
    ],
    speechLocale: "ru-RU"
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Ukrainian" }],
    speechLocale: "uk-UA"
  },
  {
    code: "el",
    name: "Greek",
    nativeName: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Greek" }],
    speechLocale: "el-GR"
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "T\xFCrk\xE7e",
    defaultDictLinks: [{ name: "Tureng", urlTemplate: "https://tureng.com/en/turkish-english/{word}" }],
    speechLocale: "tr-TR"
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Ti\u1EBFng Vi\u1EC7t",
    compoundSpaced: true,
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Vietnamese" }],
    speechLocale: "vi-VN"
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    defaultDictLinks: [{ name: "KBBI", urlTemplate: "https://kbbi.kemdikbud.go.id/entri/{word}" }],
    speechLocale: "id-ID"
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "\u0E44\u0E17\u0E22",
    spaceless: true,
    notations: [{ id: "paiboon", label: "Paiboon+ Romanization" }],
    defaultDictLinks: [{ name: "Thai-Language", urlTemplate: "http://www.thai-language.com/dict/{word}" }],
    speechLocale: "th-TH"
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    rtl: true,
    notations: [{ id: "translit", label: "Vocalized Latin Transliteration" }],
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Arabic" }],
    speechLocale: "ar-SA"
  }
];
var LANG_MAP = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l])
);

// src/shared/webext.ts
function getExtApi() {
  const g = globalThis;
  return g.browser || g.chrome || null;
}
function getExtensionUrl(relPath) {
  const api = getExtApi();
  if (api?.runtime?.getURL) {
    return api.runtime.getURL(relPath);
  }
  return relPath;
}
async function sendRuntimeMessage(msg) {
  const api = getExtApi();
  if (!api?.runtime?.sendMessage) {
    throw new Error("WebExtension runtime.sendMessage is unavailable in this context");
  }
  return await api.runtime.sendMessage(msg);
}
async function queryTabs(queryInfo) {
  const api = getExtApi();
  if (!api?.tabs?.query) return [];
  return await api.tabs.query(queryInfo);
}
async function createTab(props) {
  const api = getExtApi();
  if (!api?.tabs?.create) return null;
  return await api.tabs.create(props);
}
async function reloadTab(tabId) {
  const api = getExtApi();
  if (api?.tabs?.reload) {
    await api.tabs.reload(tabId);
  }
}
async function sendTabMessage(tabId, msg) {
  const api = getExtApi();
  if (!api?.tabs?.sendMessage) return null;
  return api.tabs.sendMessage(tabId, msg);
}

// src/shared/db.ts
var DB_NAME = "verba_db_v1";
var DB_VERSION = 1;
var dbPromise = null;
function openVerbaDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("words")) {
        const ws = db.createObjectStore("words", { keyPath: "id" });
        ws.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("books")) {
        const bs = db.createObjectStore("books", { keyPath: "id" });
        bs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("bookFiles")) {
        db.createObjectStore("bookFiles", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("folders")) {
        const fsStore = db.createObjectStore("folders", { keyPath: "id" });
        fsStore.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("bookmarks")) {
        const bms = db.createObjectStore("bookmarks", { keyPath: "id" });
        bms.createIndex("by_book", "bookId", { unique: false });
      }
      if (!db.objectStoreNames.contains("videos")) {
        const vs = db.createObjectStore("videos", { keyPath: "id" });
        vs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("dailyStats")) {
        const ds = db.createObjectStore("dailyStats", { keyPath: "id" });
        ds.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("listeningHistory")) {
        const ls = db.createObjectStore("listeningHistory", { keyPath: "id" });
        ls.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("customDicts")) {
        const cs = db.createObjectStore("customDicts", { keyPath: "id" });
        cs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("assessments")) {
        const asStore = db.createObjectStore("assessments", { keyPath: "id" });
        asStore.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("notes")) {
        const ns = db.createObjectStore("notes", { keyPath: "id" });
        ns.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("readArticles")) {
        db.createObjectStore("readArticles", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
function txGetAll(storeName, indexName, query) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const target = indexName ? store.index(indexName) : store;
      const req = query !== void 0 ? target.getAll(query) : target.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    })
  );
}
async function getWordsByLang(lang) {
  const all = await txGetAll("words", "by_lang", lang);
  return all.filter((w) => !w.deleted);
}
function getLogicalDateString(timestampMs, dayEndsAtHour = 0) {
  const adjusted = new Date(timestampMs - dayEndsAtHour * 3600 * 1e3);
  const y = adjusted.getFullYear();
  const m = String(adjusted.getMonth() + 1).padStart(2, "0");
  const d = String(adjusted.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
async function getDailyStatsByLang(lang) {
  return txGetAll("dailyStats", "by_lang", lang);
}

// src/shared/messaging.ts
async function sendBgMessage(msg) {
  return sendRuntimeMessage(msg);
}

// src/popup/index.ts
async function initPopup() {
  const root = document.getElementById("popup-app");
  if (!root) return;
  let settings = await sendBgMessage({ type: "GET_SETTINGS" });
  applyTheme(settings.theme);
  const [activeTab] = await queryTabs({ active: true, currentWindow: true });
  const tabId = activeTab?.id;
  const tabUrl = activeTab?.url || "";
  const isWebTab = /^https?:\/\/|^file:\/\//i.test(tabUrl);
  let hostname = "";
  try {
    hostname = isWebTab ? new URL(tabUrl).hostname.replace(/^www\./, "") : "";
  } catch {
    hostname = "";
  }
  async function render() {
    if (!root) return;
    applyTheme(settings.theme);
    const lang = settings.activeLang;
    const words = await getWordsByLang(lang);
    const knownTotal = countUniqueKnown(words, lang);
    const todayStr = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
    const stats = await getDailyStatsByLang(lang);
    let wordsRead = 0;
    let secondsListened = 0;
    let markedKnownToday = 0;
    for (const s of stats) {
      if (s.date === todayStr) {
        wordsRead += s.wordsRead;
        secondsListened += s.secondsListened;
        markedKnownToday += s.wordsMarkedKnown;
      }
    }
    const listenMin = Math.round(secondsListened / 60);
    const readPct = Math.min(100, Math.round(wordsRead / Math.max(1, settings.dailyReadingGoalWords) * 100));
    const listenPct = Math.min(100, Math.round(listenMin / Math.max(1, settings.dailyListeningGoalMin) * 100));
    const isPausedInTab = tabId !== void 0 && settings.pausedTabIds.includes(tabId);
    const isNeverDomain = Boolean(hostname && settings.neverRunDomains.includes(hostname));
    const isForceEnabled = Boolean(tabUrl && settings.forceEnabledUrls.includes(tabUrl));
    const langOptionsHtml = settings.learningLangs.map((code) => {
      const meta = LANG_MAP[code];
      return `<option value="${code}" ${code === lang ? "selected" : ""}>${esc(meta?.name || code)} (${esc(meta?.nativeName || code)})</option>`;
    }).join("");
    root.innerHTML = `
      <header class="pop-header">
        <a href="#" id="pop-brand" class="brand" title="Open Verba Dashboard">
          <span class="brand-dot"></span>
          <span>Verba</span>
        </a>
        <select id="pop-lang-sel" class="lang-select" aria-label="Active language">
          ${langOptionsHtml}
          <option value="__add__">+ Add a language\u2026</option>
        </select>
      </header>

      ${!settings.onboarded ? `
        <section id="pop-onboard-banner" style="margin-bottom:10px;padding:10px 12px;border:1px solid var(--blue);background:rgb(56 189 248 / 0.12);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="font-size:12px;line-height:1.35;">
            <strong style="color:var(--ink);">\u{1F44B} Welcome to Verba!</strong><br/>
            <span style="color:var(--ink-2);">Pick your language &amp; starting level.</span>
          </div>
          <button type="button" class="btn btn-accent" id="pop-start-onboard" style="white-space:nowrap;padding:6px 10px;font-size:12px;">
            Start Setup \u2192
          </button>
        </section>
      ` : ""}

      <section class="tally-card" aria-label="Today's progress">
        <div class="tally-item">
          <span class="tally-val">${knownTotal.toLocaleString()}</span>
          <span class="tally-lbl">Known words (+${markedKnownToday} today)</span>
        </div>
        <div class="tally-item">
          <span class="tally-val">${words.filter((w) => w.status >= 1 && w.status <= 4).length.toLocaleString()}</span>
          <span class="tally-lbl">Learning (1\u20134)</span>
        </div>
        <div class="tally-item">
          <span class="tally-val">${wordsRead.toLocaleString()} <small style="font-weight:400;color:var(--ink-3);font-size:11px">/ ${settings.dailyReadingGoalWords}</small></span>
          <span class="tally-lbl">Words read today</span>
          <div class="goal-bar"><div class="goal-fill read" style="width:${readPct}%"></div></div>
        </div>
        <div class="tally-item">
          <span class="tally-val">${listenMin}m <small style="font-weight:400;color:var(--ink-3);font-size:11px">/ ${settings.dailyListeningGoalMin}m</small></span>
          <span class="tally-lbl">Listened today</span>
          <div class="goal-bar"><div class="goal-fill listen" style="width:${listenPct}%"></div></div>
        </div>
      </section>

      <section class="switch-group">
        <div class="switch-row">
          <div>
            <span class="switch-label">Run Verba on web pages</span>
          </div>
          <label class="toggle">
            <input type="checkbox" id="sw-global" ${settings.runOnWebPages ? "checked" : ""} />
            <span class="toggle-track"></span>
          </label>
        </div>

        <div class="switch-row">
          <div>
            <span class="switch-label">Inline word replacement (${settings.inlineReplacementDensityPct}%)</span>
          </div>
          <label class="toggle">
            <input type="checkbox" id="sw-diglot" ${settings.inlineReplacementEnabled ? "checked" : ""} />
            <span class="toggle-track"></span>
          </label>
        </div>

        ${tabId !== void 0 && isWebTab ? `
          <div class="switch-row">
            <div>
              <span class="switch-label">Pause Verba in this tab</span>
            </div>
            <label class="toggle">
              <input type="checkbox" id="sw-pause-tab" ${isPausedInTab ? "checked" : ""} />
              <span class="toggle-track"></span>
            </label>
          </div>
        ` : ""}

        ${hostname ? `
          <div class="switch-row">
            <div style="min-width:0">
              <span class="switch-label" title="${esc(hostname)}">Never run on ${esc(hostname)}</span>
            </div>
            <label class="toggle">
              <input type="checkbox" id="sw-never-domain" ${isNeverDomain ? "checked" : ""} />
              <span class="toggle-track"></span>
            </label>
          </div>
        ` : ""}
      </section>

      <section class="quick-actions">
        ${isWebTab ? `
          <button type="button" class="btn" id="btn-reader">
            <span>Reader View</span>
            <kbd>${esc(settings.readingKeymap.openReaderView)}</kbd>
          </button>
          <button type="button" class="btn" id="btn-aloud">
            <span>Read aloud</span>
            <kbd>${esc(settings.readingKeymap.readAloud)}</kbd>
          </button>
          <button type="button" class="btn btn-full" id="btn-diglot-here">
            <span>\u21C4 Toggle Inline Word Replacement</span>
            <kbd>${esc(settings.readingKeymap.toggleDiglot || "Shift+W")}</kbd>
          </button>
          <button type="button" class="btn btn-full ${isForceEnabled ? "btn-accent" : ""}" id="btn-force-here">
            <span>${isForceEnabled ? "\u2713 Forced on for this page" : "Turn Verba on here (override detection)"}</span>
          </button>
        ` : ""}
      </section>

      <nav class="nav-grid" aria-label="Verba pages">
        <button type="button" class="btn btn-accent" id="nav-dashboard">
          <span>Dashboard</span>
          <span>\u2192</span>
        </button>
        <button type="button" class="btn" id="nav-books">
          <span>\u{1F4DA} Read a book</span>
        </button>
        <button type="button" class="btn" id="nav-video">
          <span>\u{1F3AC} Watch a video</span>
        </button>
        <button type="button" class="btn" id="nav-placement">
          <span>\u{1F3AF} Placement Test</span>
        </button>
        <button type="button" class="btn btn-full" id="nav-settings">
          <span>\u2699 Settings</span>
        </button>
      </nav>
    `;
    root.querySelector("#pop-brand")?.addEventListener("click", (e) => {
      e.preventDefault();
      openExtPage("dashboard.html");
    });
    root.querySelector("#pop-start-onboard")?.addEventListener("click", () => {
      openExtPage("dashboard.html#onboarding");
    });
    root.querySelector("#pop-lang-sel")?.addEventListener("change", async (e) => {
      const val = e.target.value;
      if (val === "__add__") {
        openExtPage("dashboard.html#settings:languages");
        return;
      }
      settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { activeLang: val }
      });
      if (tabId !== void 0 && isWebTab) {
        reloadTab(tabId).catch(() => {
        });
      }
      await render();
    });
    root.querySelector("#sw-global")?.addEventListener("change", async (e) => {
      const checked = e.target.checked;
      settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { runOnWebPages: checked }
      });
      if (tabId !== void 0 && isWebTab) {
        reloadTab(tabId).catch(() => {
        });
      }
      await render();
    });
    root.querySelector("#sw-diglot")?.addEventListener("change", async (e) => {
      const checked = e.target.checked;
      settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { inlineReplacementEnabled: checked }
      });
      if (tabId !== void 0 && isWebTab) {
        reloadTab(tabId).catch(() => {
        });
      }
      await render();
    });
    root.querySelector("#sw-pause-tab")?.addEventListener("change", async (e) => {
      if (tabId === void 0) return;
      const checked = e.target.checked;
      const nextPaused = checked ? Array.from(/* @__PURE__ */ new Set([...settings.pausedTabIds, tabId])) : settings.pausedTabIds.filter((id) => id !== tabId);
      settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { pausedTabIds: nextPaused }
      });
      reloadTab(tabId).catch(() => {
      });
      await render();
    });
    root.querySelector("#sw-never-domain")?.addEventListener("change", async (e) => {
      if (!hostname) return;
      const checked = e.target.checked;
      const nextDomains = checked ? Array.from(/* @__PURE__ */ new Set([...settings.neverRunDomains, hostname])) : settings.neverRunDomains.filter((d) => d !== hostname);
      settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { neverRunDomains: nextDomains }
      });
      if (tabId !== void 0 && isWebTab) {
        reloadTab(tabId).catch(() => {
        });
      }
      await render();
    });
    root.querySelector("#btn-force-here")?.addEventListener("click", async () => {
      if (!tabUrl) return;
      const nextForce = isForceEnabled ? settings.forceEnabledUrls.filter((u) => u !== tabUrl) : Array.from(/* @__PURE__ */ new Set([...settings.forceEnabledUrls, tabUrl]));
      const nextPaused = tabId !== void 0 ? settings.pausedTabIds.filter((id) => id !== tabId) : settings.pausedTabIds;
      settings = await sendBgMessage({
        type: "SAVE_SETTINGS",
        patch: { forceEnabledUrls: nextForce, pausedTabIds: nextPaused, runOnWebPages: true }
      });
      if (tabId !== void 0) {
        reloadTab(tabId).catch(() => {
        });
      }
      window.close();
    });
    root.querySelector("#btn-reader")?.addEventListener("click", () => {
      if (tabId !== void 0) {
        sendTabMessage(tabId, { type: "VERBA_TRIGGER_READER" }).catch(() => {
        });
        window.close();
      }
    });
    root.querySelector("#btn-aloud")?.addEventListener("click", () => {
      if (tabId !== void 0) {
        sendTabMessage(tabId, { type: "VERBA_TRIGGER_READ_ALOUD" }).catch(() => {
        });
        window.close();
      }
    });
    root.querySelector("#btn-diglot-here")?.addEventListener("click", () => {
      if (tabId !== void 0) {
        sendTabMessage(tabId, { type: "VERBA_TRIGGER_DIGLOT" }).catch(() => {
        });
        window.close();
      }
    });
    root.querySelector("#nav-dashboard")?.addEventListener("click", () => openExtPage("dashboard.html"));
    root.querySelector("#nav-books")?.addEventListener("click", () => openExtPage("books.html"));
    root.querySelector("#nav-video")?.addEventListener("click", () => openExtPage("video.html"));
    root.querySelector("#nav-placement")?.addEventListener("click", () => openExtPage("dashboard.html#placement"));
    root.querySelector("#nav-settings")?.addEventListener("click", () => openExtPage("dashboard.html#settings"));
  }
  await render();
}
function openExtPage(relPath) {
  createTab({ url: getExtensionUrl(relPath) }).catch(() => {
  });
  window.close();
}
function applyTheme(theme) {
  const isLight = theme === "light" || theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
}
function countUniqueKnown(words, lang) {
  const seen = /* @__PURE__ */ new Set();
  let total = 0;
  for (const w of words) {
    if (w.deleted || w.status !== 5) continue;
    if (w.isPhrase && lang !== "vi") continue;
    if (seen.has(w.word)) continue;
    seen.add(w.word);
    if (w.altScript) seen.add(w.altScript);
    total++;
  }
  return total;
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
initPopup().catch((err) => console.error("Verba popup init error:", err));
