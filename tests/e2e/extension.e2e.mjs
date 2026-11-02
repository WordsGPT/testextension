import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright-core';

function findChromiumExecutable() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const cacheDir = path.join(os.homedir(), '.cache', 'ms-playwright');
  if (fs.existsSync(cacheDir)) {
    for (const entry of fs.readdirSync(cacheDir)) {
      if (entry.startsWith('chromium')) {
        const candidate = path.join(cacheDir, entry, 'chrome-linux64', 'chrome');
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }
  throw new Error('Could not find Chromium binary in ~/.cache/ms-playwright');
}

function startFixtureServer() {
  const server = http.createServer((req, res) => {
    if (req.url?.startsWith('/english')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html>
        <html lang="en">
          <head><title>Morning Reading Notes</title></head>
          <body>
            <article>
              <h1>Reading in the Garden</h1>
              <p id="en-p1">Every morning a good friend walks to the quiet garden near the old school and the forest to read a story about nature and freedom.</p>
              <p id="en-p2">Music and science bring harmony to the city, while <a id="en-link" href="#en-anchor">this friend</a> studies history.</p>
            </article>
          </body>
        </html>`);
      return;
    }

    if (req.url?.startsWith('/chinese')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html>
        <html lang="zh">
          <head><title>鲁迅读书随笔</title></head>
          <body>
            <article>
              <h1>在图书馆阅读</h1>
              <p>今天晚上月光很好。我们在图书馆看书的时候，学习新的语言和世界历史非常快乐。</p>
            </article>
          </body>
        </html>`);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html>
      <html lang="it">
        <head><title>Storia di Firenze</title></head>
        <body>
          <article>
            <h1>Una mattina a Firenze</h1>
            <p id="p1">C'era una volta un piccolo libro nella vecchia scuola della città. Ogni parola della storia porta grande gioia.</p>
            <p id="p2">Leggere insieme aiuta sempre, <a id="test-link" href="#linked-anchor">scopri questa pagina</a> con calma.</p>
          </article>
        </body>
      </html>`);
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

async function runE2E() {
  const extPath = path.resolve('.');
  const executablePath = findChromiumExecutable();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verba-e2e-profile-'));
  const { server, baseUrl } = await startFixtureServer();

  console.log('Launching Chromium with unpacked Verba MV3 extension...');
  const context = await chromium.launchPersistentContext(userDataDir, {
    executablePath,
    headless: false,
    args: [
      '--headless=new',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
    ],
  });

  try {
    // 1. Wait for MV3 background service worker & extract extension ID
    let [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 15000 });
    const extId = sw.url().split('/')[2];
    assert.ok(extId && extId.length >= 16, `Invalid extension ID: ${extId}`);
    console.log(`✓ [1/8] Service worker active (chrome-extension://${extId})`);

    // Give seedSampleBooksIfEmpty a brief moment to finish writing to IndexedDB
    await new Promise((r) => setTimeout(r, 700));

    // 2. Test Italian Web Page Highlighting, Hover/Click Word Panel, Key 'K' Grading & Links Rule
    const webPage = await context.newPage();
    await webPage.goto(`${baseUrl}/italian`, { waitUntil: 'domcontentloaded' });
    await webPage.waitForSelector('verba-w[data-s="0"]', { timeout: 10000 });

    const initialBlueCount = await webPage.locator('verba-w[data-s="0"]').count();
    assert.ok(initialBlueCount >= 8, `Expected >=8 highlighted blue words, got ${initialBlueCount}`);

    // Verify Counter Island inside Shadow DOM
    const islandVisible = await webPage.evaluate(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const island = root?.querySelector('.verba-island');
      return Boolean(island && !island.hasAttribute('hidden'));
    });
    assert.equal(islandVisible, true, 'Counter Island should be visible');

    // Click 'libro' -> starts learning at Level 1 (amber) & pins Word Panel
    const libroLoc = webPage.locator('verba-w[data-w="libro"]').first();
    await libroLoc.click();
    await webPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const panel = root?.querySelector('.verba-panel');
      return panel && !panel.hasAttribute('hidden') && panel.textContent?.includes('book');
    });
    assert.equal(await libroLoc.getAttribute('data-s'), '1', 'Clicking blue word should set Level 1');

    // Press 'k' to mark 'libro' Known -> highlight disappears (data-s="5") and panel closes
    await webPage.keyboard.press('k');
    await webPage.waitForFunction(() => {
      const el = document.querySelector('verba-w[data-w="libro"]');
      return el?.getAttribute('data-s') === '5';
    });

    // Verify words inside links are ignored by highlighter and clicking a link follows href without opening Word Panel
    const linkWordCount = await webPage.locator('#test-link verba-w').count();
    assert.equal(linkWordCount, 0, 'Links should not contain highlighted <verba-w> tags');
    await webPage.locator('#test-link').click();
    assert.ok(webPage.url().endsWith('#linked-anchor'), 'Clicking link should follow href');
    const panelOpenAfterLink = await webPage.evaluate(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const panel = root?.querySelector('.verba-panel');
      return Boolean(panel && !panel.hasAttribute('hidden'));
    });
    assert.equal(panelOpenAfterLink, false, 'Clicking link should never open Word Panel');
    console.log('✓ [2/8] Italian web highlighting, Word Panel, K grading & ignored links verified');

    // 3. Test Reader View (Shift+L) & Sentence-by-Sentence (Shift+S)
    await webPage.keyboard.press('Shift+L');
    await webPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const rv = root?.querySelector('.verba-reader-overlay');
      return rv && !rv.hasAttribute('hidden') && rv.querySelectorAll('verba-w').length > 5;
    });

    await webPage.keyboard.press('Shift+S');
    await webPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const sm = root?.querySelector('.verba-sentence-modal');
      return sm && !sm.hasAttribute('hidden');
    });
    await webPage.keyboard.press('Escape');
    await webPage.keyboard.press('Escape');
    console.log('✓ [3/8] Reader View (Shift+L) & Sentence-by-Sentence (Shift+S) verified');

    // 4. Test Auto-Language Switch to Chinese + Characters Tab
    await webPage.goto(`${baseUrl}/chinese`, { waitUntil: 'domcontentloaded' });
    await webPage.waitForSelector('verba-w[data-w="图书馆"]', { timeout: 10000 });
    await webPage.locator('verba-w[data-w="图书馆"]').first().click();
    await webPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const panel = root?.querySelector('.verba-panel');
      return panel && !panel.hasAttribute('hidden') && panel.textContent?.includes('library');
    });
    // Press 'b' to switch to Characters decomposition tab
    await webPage.keyboard.press('b');
    await webPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const panel = root?.querySelector('.verba-panel');
      return panel?.textContent?.includes('图') && panel?.textContent?.includes('馆');
    });

    // 4b. Test Inline Word Replacement (Diglot Weave) on an English (L1) Web Page
    await webPage.goto(`${baseUrl}/english`, { waitUntil: 'domcontentloaded' });
    await webPage.waitForSelector('verba-w[data-diglot="1"]', { timeout: 10000 });
    const diglotCount = await webPage.locator('verba-w[data-diglot="1"]').count();
    assert.ok(diglotCount >= 2, `Expected >=2 inline-replaced diglot words on English page, got ${diglotCount}`);

    // Verify Counter Island shows woven count and active Diglot button
    const islandHasDiglot = await webPage.evaluate(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const btn = root?.querySelector('#island-diglot-btn');
      const countEl = root?.querySelector('#island-diglot-count');
      return Boolean(btn?.classList.contains('active') && Number(countEl?.textContent || '0') >= 2);
    });
    assert.equal(islandHasDiglot, true, 'Counter Island should display active Diglot toggle and woven word count');

    // Click first inline-replaced word -> verify Diglot Weave banner in Word Panel & Revert button
    const firstDiglot = webPage.locator('verba-w[data-diglot="1"]').first();
    const origWord = await firstDiglot.getAttribute('data-orig');
    assert.ok(origWord && origWord.length >= 3, 'Diglot element should record original L1 word in data-orig');
    await firstDiglot.click();
    await webPage.waitForFunction((expectedOrig) => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const banner = root?.querySelector('#wp-diglot-banner');
      return Boolean(banner && banner.textContent?.includes(expectedOrig));
    }, origWord);

    // Click Revert button inside Word Panel -> restores that word back to original L1 text
    await webPage.evaluate(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      root?.querySelector('#wp-diglot-revert')?.click();
    });
    const afterRevertCount = await webPage.locator('verba-w[data-diglot="1"]').count();
    assert.equal(afterRevertCount, diglotCount - 1, 'Clicking Revert in Word Panel should restore that single word');

    // Press Shift+W to toggle Diglot Weave off across the page, then Shift+W to weave again
    await webPage.keyboard.press('Shift+W');
    await webPage.waitForFunction(() => document.querySelectorAll('verba-w[data-diglot="1"]').length === 0);
    await webPage.keyboard.press('Shift+W');
    await webPage.waitForSelector('verba-w[data-diglot="1"]');
    console.log('✓ [4b/8] Inline Word Replacement (Diglot Weave), Word Panel Diglot banner/revert & Shift+W toggle verified');

    await webPage.close();
    console.log('✓ [4/8] Auto-language switch (zh), compound segmentation & Characters tab (B) verified');

    // 5. Test Toolbar Popup (popup.html)
    const popPage = await context.newPage();
    await popPage.goto(`chrome-extension://${extId}/popup.html`, { waitUntil: 'domcontentloaded' });
    await popPage.waitForSelector('#pop-lang-sel');
    await popPage.selectOption('#pop-lang-sel', 'it');
    const popText = await popPage.textContent('#popup-app');
    assert.ok(popText?.includes('Known words') && popText?.includes('Run Verba on web pages'));
    await popPage.close();
    console.log('✓ [5/8] Toolbar Popup switches & live tally verified');

    // 6. Test Books Shelf & Pinocchio EPUB Reader (books.html)
    const booksPage = await context.newPage();
    await booksPage.goto(`chrome-extension://${extId}/books.html`, { waitUntil: 'domcontentloaded' });
    await booksPage.waitForSelector('.book-card');
    const shelfText = await booksPage.textContent('#books-app');
    assert.ok(shelfText?.includes('Le avventure di Pinocchio'), 'Seeded Pinocchio EPUB should be on Shelf');
    assert.ok(shelfText?.includes('Storia di Firenze'), 'Article opened in Shift+L should be saved on Shelf');

    // Open Pinocchio EPUB
    await booksPage.locator('.book-card', { hasText: 'Le avventure di Pinocchio' }).first().click();
    await booksPage.waitForSelector('#book-chapter-content verba-w');
    // Bookmark chapter
    await booksPage.click('#btn-bookmark');
    await booksPage.waitForFunction(() =>
      document.querySelector('#btn-bookmark')?.textContent?.includes('Bookmarked')
    );
    // Toggle Aa -> Turn pages mode
    await booksPage.click('#btn-aa-toggle');
    await booksPage.click('[data-flow="pages"]');
    await booksPage.waitForSelector('#paginated-indicator');
    await booksPage.close();
    console.log('✓ [6/8] Books Shelf, saved web article, Pinocchio EPUB reader, bookmarks & Turn pages verified');

    // 7. Test Local Video Player & Verba Dual Captions (video.html?demo=1)
    const vidPage = await context.newPage();
    await vidPage.goto(`chrome-extension://${extId}/video.html?demo=1`, { waitUntil: 'domcontentloaded' });
    await vidPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const stage = root?.querySelector('.vc-stage');
      return stage && !stage.hasAttribute('hidden') && stage.querySelectorAll('verba-w').length >= 4;
    }, { timeout: 10000 });

    // Check blurred translation initially, then press 'e' to peek
    const wasBlurred = await vidPage.evaluate(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      return Boolean(root?.querySelector('.vc-trans.blurred'));
    });
    assert.equal(wasBlurred, true, 'Translation subtitle should start blurred');

    await vidPage.keyboard.press('e');
    await vidPage.keyboard.press('e');
    const unblurredAfterPeek = await vidPage.evaluate(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const tr = root?.querySelector('.vc-trans');
      return Boolean(tr && !tr.classList.contains('blurred'));
    });
    assert.equal(unblurredAfterPeek, true, 'Pressing E twice should unblur translation layer');

    // Press 'd' to step to cue 2 ("Geppetto voleva leggere...")
    await vidPage.keyboard.press('d');
    await vidPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      return root?.querySelector('#cc-sub-line')?.textContent?.includes('Geppetto');
    });

    // Press 'w' to open Words in this video drawer
    await vidPage.keyboard.press('w');
    await vidPage.waitForFunction(() => {
      const root = document.getElementById('verba-ui-root')?.shadowRoot;
      const dr = root?.querySelector('.vc-drawer');
      return dr && !dr.hasAttribute('hidden') && dr.textContent?.includes('Words');
    });
    await vidPage.close();
    console.log('✓ [7/8] Video Player & Verba dual subtitles, blur peek (E), line step (D) & Words drawer (W) verified');

    // 8. Test Dashboard: Onboarding Wizard, Words Sweep + Undo, Adaptive Placement Test + Calibration, Progress & Settings
    const dashPage = await context.newPage();
    await dashPage.goto(`chrome-extension://${extId}/dashboard.html`, { waitUntil: 'domcontentloaded' });
    await dashPage.waitForSelector('#onboarding-wizard');
    await dashPage.click('#ob-next-1');
    await dashPage.waitForSelector('#ob-next-2');
    await dashPage.click('#ob-next-2');
    await dashPage.waitForSelector('#ob-finish-btn');
    await dashPage.click('#ob-finish-btn');
    await dashPage.waitForFunction(() => !document.querySelector('#onboarding-wizard'));

    // Words -> Frequency Sweep slider + Undo
    await dashPage.click('[data-main-tab="words"]');
    await dashPage.click('[data-wsub="mark_known"]');
    await dashPage.waitForSelector('#btn-mark-wall-known');
    await dashPage.click('#btn-mark-wall-known');
    await dashPage.waitForSelector('#btn-undo-wall');
    await dashPage.click('#btn-undo-wall');
    await dashPage.waitForFunction(() => !document.querySelector('#btn-undo-wall'));

    // Placement Test -> 12-question adaptive staircase assessment + 1-Click Calibration + Undo
    await dashPage.click('[data-main-tab="placement"]');
    await dashPage.waitForSelector('#pl-start-btn');
    await dashPage.click('#pl-start-btn');
    for (let q = 0; q < 12; q++) {
      await dashPage.waitForSelector('#pl-quiz-card');
      await dashPage.click('#pl-opt-0');
    }
    await dashPage.waitForSelector('#pl-result-card');
    const cefrBadge = await dashPage.textContent('#pl-cefr-badge');
    assert.ok(['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(cefrBadge?.trim() || ''), `Unexpected CEFR badge: ${cefrBadge}`);
    await dashPage.click('#pl-apply-calibration');
    await dashPage.waitForSelector('#pl-undo-calibration');
    await dashPage.click('#pl-undo-calibration');
    await dashPage.waitForFunction(() => !document.querySelector('#pl-undo-calibration'));

    // Progress -> CEFR & Calendar
    await dashPage.click('[data-main-tab="progress"]');
    await dashPage.waitForSelector('.cal-grid');
    const progText = await dashPage.textContent('#dash-main-pane');
    assert.ok(progText?.includes('Your Level:') && progText?.includes('Polyglot Overview'));

    // Settings -> Instant search filter
    await dashPage.click('[data-main-tab="settings"]');
    await dashPage.fill('#settings-search-input', 'anki');
    await dashPage.waitForSelector('[data-sec="anki"]');
    await dashPage.close();
    console.log('✓ [8/8] Dashboard Frequency Sweep + Undo, Adaptive Placement Test + Calibration, Progress CEFR/Calendar & Settings search verified');

    console.log('\nALL 8 PLAYWRIGHT CHROMIUM MV3 E2E SUITES PASSED!');
  } finally {
    await context.close();
    server.close();
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

runE2E().catch((err) => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});
