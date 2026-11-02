import type { LangCode, VerbaSettings } from '../shared/types';
import { getDailyStatsByLang, getLogicalDateString, getWordsByLang } from '../shared/db';
import { LANG_MAP } from '../shared/languages';
import { sendBgMessage } from '../shared/messaging';
import { createTab, getExtensionUrl, queryTabs, reloadTab, sendTabMessage } from '../shared/webext';

async function initPopup(): Promise<void> {
  const root = document.getElementById('popup-app');
  if (!root) return;

  let settings = await sendBgMessage<VerbaSettings>({ type: 'GET_SETTINGS' });
  applyTheme(settings.theme);

  const [activeTab] = await queryTabs({ active: true, currentWindow: true });
  const tabId = activeTab?.id;
  const tabUrl = activeTab?.url || '';
  const isWebTab = /^https?:\/\/|^file:\/\//i.test(tabUrl);
  let hostname = '';
  try {
    hostname = isWebTab ? new URL(tabUrl).hostname.replace(/^www\./, '') : '';
  } catch {
    hostname = '';
  }

  async function render(): Promise<void> {
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
    const readPct = Math.min(100, Math.round((wordsRead / Math.max(1, settings.dailyReadingGoalWords)) * 100));
    const listenPct = Math.min(100, Math.round((listenMin / Math.max(1, settings.dailyListeningGoalMin)) * 100));

    const isPausedInTab = tabId !== undefined && settings.pausedTabIds.includes(tabId);
    const isNeverDomain = Boolean(hostname && settings.neverRunDomains.includes(hostname));
    const isForceEnabled = Boolean(tabUrl && settings.forceEnabledUrls.includes(tabUrl));

    const langOptionsHtml = settings.learningLangs
      .map((code) => {
        const meta = LANG_MAP[code];
        return `<option value="${code}" ${code === lang ? 'selected' : ''}>${esc(meta?.name || code)} (${esc(meta?.nativeName || code)})</option>`;
      })
      .join('');

    root.innerHTML = `
      <header class="pop-header">
        <a href="#" id="pop-brand" class="brand" title="Open Verba Dashboard">
          <span class="brand-dot"></span>
          <span>Verba</span>
        </a>
        <select id="pop-lang-sel" class="lang-select" aria-label="Active language">
          ${langOptionsHtml}
          <option value="__add__">+ Add a language…</option>
        </select>
      </header>

      ${
        !settings.onboarded
          ? `
        <section id="pop-onboard-banner" style="margin-bottom:10px;padding:10px 12px;border:1px solid var(--blue);background:rgb(56 189 248 / 0.12);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="font-size:12px;line-height:1.35;">
            <strong style="color:var(--ink);">👋 Welcome to Verba!</strong><br/>
            <span style="color:var(--ink-2);">Pick your language &amp; starting level.</span>
          </div>
          <button type="button" class="btn btn-accent" id="pop-start-onboard" style="white-space:nowrap;padding:6px 10px;font-size:12px;">
            Start Setup →
          </button>
        </section>
      `
          : ''
      }

      <section class="tally-card" aria-label="Today's progress">
        <div class="tally-item">
          <span class="tally-val">${knownTotal.toLocaleString()}</span>
          <span class="tally-lbl">Known words (+${markedKnownToday} today)</span>
        </div>
        <div class="tally-item">
          <span class="tally-val">${words.filter((w) => w.status >= 1 && w.status <= 4).length.toLocaleString()}</span>
          <span class="tally-lbl">Learning (1–4)</span>
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
            <input type="checkbox" id="sw-global" ${settings.runOnWebPages ? 'checked' : ''} />
            <span class="toggle-track"></span>
          </label>
        </div>

        <div class="switch-row">
          <div>
            <span class="switch-label">Inline word replacement (${settings.inlineReplacementDensityPct}%)</span>
          </div>
          <label class="toggle">
            <input type="checkbox" id="sw-diglot" ${settings.inlineReplacementEnabled ? 'checked' : ''} />
            <span class="toggle-track"></span>
          </label>
        </div>

        ${
          tabId !== undefined && isWebTab
            ? `
          <div class="switch-row">
            <div>
              <span class="switch-label">Pause Verba in this tab</span>
            </div>
            <label class="toggle">
              <input type="checkbox" id="sw-pause-tab" ${isPausedInTab ? 'checked' : ''} />
              <span class="toggle-track"></span>
            </label>
          </div>
        `
            : ''
        }

        ${
          hostname
            ? `
          <div class="switch-row">
            <div style="min-width:0">
              <span class="switch-label" title="${esc(hostname)}">Never run on ${esc(hostname)}</span>
            </div>
            <label class="toggle">
              <input type="checkbox" id="sw-never-domain" ${isNeverDomain ? 'checked' : ''} />
              <span class="toggle-track"></span>
            </label>
          </div>
        `
            : ''
        }
      </section>

      <section class="quick-actions">
        ${
          isWebTab
            ? `
          <button type="button" class="btn" id="btn-reader">
            <span>Reader View</span>
            <kbd>${esc(settings.readingKeymap.openReaderView)}</kbd>
          </button>
          <button type="button" class="btn" id="btn-aloud">
            <span>Read aloud</span>
            <kbd>${esc(settings.readingKeymap.readAloud)}</kbd>
          </button>
          <button type="button" class="btn btn-full" id="btn-diglot-here">
            <span>⇄ Toggle Inline Word Replacement</span>
            <kbd>${esc(settings.readingKeymap.toggleDiglot || 'Shift+W')}</kbd>
          </button>
          <button type="button" class="btn btn-full ${isForceEnabled ? 'btn-accent' : ''}" id="btn-force-here">
            <span>${isForceEnabled ? '✓ Forced on for this page' : 'Turn Verba on here (override detection)'}</span>
          </button>
        `
            : ''
        }
      </section>

      <nav class="nav-grid" aria-label="Verba pages">
        <button type="button" class="btn btn-accent" id="nav-dashboard">
          <span>Dashboard</span>
          <span>→</span>
        </button>
        <button type="button" class="btn" id="nav-books">
          <span>📚 Read a book</span>
        </button>
        <button type="button" class="btn" id="nav-video">
          <span>🎬 Watch a video</span>
        </button>
        <button type="button" class="btn" id="nav-placement">
          <span>🎯 Placement Test</span>
        </button>
        <button type="button" class="btn btn-full" id="nav-settings">
          <span>⚙ Settings</span>
        </button>
      </nav>
    `;

    root.querySelector('#pop-brand')?.addEventListener('click', (e) => {
      e.preventDefault();
      openExtPage('dashboard.html');
    });

    root.querySelector('#pop-start-onboard')?.addEventListener('click', () => {
      openExtPage('dashboard.html#onboarding');
    });

    root.querySelector('#pop-lang-sel')?.addEventListener('change', async (e) => {
      const val = (e.target as HTMLSelectElement).value;
      if (val === '__add__') {
        openExtPage('dashboard.html#settings:languages');
        return;
      }
      settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { activeLang: val as LangCode },
      });
      if (tabId !== undefined && isWebTab) {
        reloadTab(tabId).catch(() => {});
      }
      await render();
    });

    root.querySelector('#sw-global')?.addEventListener('change', async (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { runOnWebPages: checked },
      });
      if (tabId !== undefined && isWebTab) {
        reloadTab(tabId).catch(() => {});
      }
      await render();
    });

    root.querySelector('#sw-diglot')?.addEventListener('change', async (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { inlineReplacementEnabled: checked },
      });
      if (tabId !== undefined && isWebTab) {
        reloadTab(tabId).catch(() => {});
      }
      await render();
    });

    root.querySelector('#sw-pause-tab')?.addEventListener('change', async (e) => {
      if (tabId === undefined) return;
      const checked = (e.target as HTMLInputElement).checked;
      const nextPaused = checked
        ? Array.from(new Set([...settings.pausedTabIds, tabId]))
        : settings.pausedTabIds.filter((id) => id !== tabId);
      settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { pausedTabIds: nextPaused },
      });
      reloadTab(tabId).catch(() => {});
      await render();
    });

    root.querySelector('#sw-never-domain')?.addEventListener('change', async (e) => {
      if (!hostname) return;
      const checked = (e.target as HTMLInputElement).checked;
      const nextDomains = checked
        ? Array.from(new Set([...settings.neverRunDomains, hostname]))
        : settings.neverRunDomains.filter((d) => d !== hostname);
      settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { neverRunDomains: nextDomains },
      });
      if (tabId !== undefined && isWebTab) {
        reloadTab(tabId).catch(() => {});
      }
      await render();
    });

    root.querySelector('#btn-force-here')?.addEventListener('click', async () => {
      if (!tabUrl) return;
      const nextForce = isForceEnabled
        ? settings.forceEnabledUrls.filter((u) => u !== tabUrl)
        : Array.from(new Set([...settings.forceEnabledUrls, tabUrl]));
      const nextPaused = tabId !== undefined ? settings.pausedTabIds.filter((id) => id !== tabId) : settings.pausedTabIds;
      settings = await sendBgMessage<VerbaSettings>({
        type: 'SAVE_SETTINGS',
        patch: { forceEnabledUrls: nextForce, pausedTabIds: nextPaused, runOnWebPages: true },
      });
      if (tabId !== undefined) {
        reloadTab(tabId).catch(() => {});
      }
      window.close();
    });

    root.querySelector('#btn-reader')?.addEventListener('click', () => {
      if (tabId !== undefined) {
        sendTabMessage(tabId, { type: 'VERBA_TRIGGER_READER' }).catch(() => {});
        window.close();
      }
    });

    root.querySelector('#btn-aloud')?.addEventListener('click', () => {
      if (tabId !== undefined) {
        sendTabMessage(tabId, { type: 'VERBA_TRIGGER_READ_ALOUD' }).catch(() => {});
        window.close();
      }
    });

    root.querySelector('#btn-diglot-here')?.addEventListener('click', () => {
      if (tabId !== undefined) {
        sendTabMessage(tabId, { type: 'VERBA_TRIGGER_DIGLOT' }).catch(() => {});
        window.close();
      }
    });

    root.querySelector('#nav-dashboard')?.addEventListener('click', () => openExtPage('dashboard.html'));
    root.querySelector('#nav-books')?.addEventListener('click', () => openExtPage('books.html'));
    root.querySelector('#nav-video')?.addEventListener('click', () => openExtPage('video.html'));
    root.querySelector('#nav-placement')?.addEventListener('click', () => openExtPage('dashboard.html#placement'));
    root.querySelector('#nav-settings')?.addEventListener('click', () => openExtPage('dashboard.html#settings'));
  }

  await render();
}

function openExtPage(relPath: string): void {
  createTab({ url: getExtensionUrl(relPath) }).catch(() => {});
  window.close();
}

function applyTheme(theme: 'system' | 'light' | 'dark'): void {
  const isLight =
    theme === 'light' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
}

function countUniqueKnown(words: { word: string; altScript?: string; status: number; isPhrase: boolean; deleted?: boolean }[], lang: LangCode): number {
  const seen = new Set<string>();
  let total = 0;
  for (const w of words) {
    if (w.deleted || w.status !== 5) continue;
    if (w.isPhrase && lang !== 'vi') continue;
    if (seen.has(w.word)) continue;
    seen.add(w.word);
    if (w.altScript) seen.add(w.altScript);
    total++;
  }
  return total;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

initPopup().catch((err) => console.error('Verba popup init error:', err));
