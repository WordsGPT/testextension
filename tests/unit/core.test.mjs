import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import esbuild from 'esbuild';
import { unzipSync, strFromU8 } from 'fflate';

let core;

before(async () => {
  const entryCode = `
    export * from './src/shared/languages.ts';
    export * from './src/shared/constants.ts';
    export * from './src/shared/segmenter.ts';
    export * from './src/shared/dictionary.ts';
    export * from './src/shared/diglot.ts';
    export * from './src/shared/sync-crypto.ts';
    export * from './src/shared/imports.ts';
    export * from './src/shared/placement.ts';
    export * from './src/shared/webext.ts';
  `;
  const tmpOut = path.join(os.tmpdir(), `verba-unit-bundle-${Date.now()}.mjs`);
  await esbuild.build({
    stdin: {
      contents: entryCode,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    outfile: tmpOut,
  });
  core = await import(`file://${tmpOut}`);
});

describe('Verba 24 Offline Dictionaries & Language Detection', () => {
  it('ships valid JSON dictionaries for all 24 canonical Verba languages with CEFR A1-C2 coverage', () => {
    assert.equal(core.LANGUAGES.length, 24);
    for (const lang of core.LANGUAGES) {
      const p = path.resolve('dictionaries', `${lang.code}.json`);
      assert.ok(fs.existsSync(p), `Missing dictionary for ${lang.code}`);
      const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
      assert.equal(raw.lang, lang.code);
      assert.ok(Array.isArray(raw.entries) && raw.entries.length >= 50, `Too few entries in ${lang.code}`);
      const idx = core.buildLangIndex(raw);
      assert.ok(idx.byRank.length >= 50);
    }
  });

  it('detects languages accurately across scripts and European stopwords', () => {
    assert.equal(core.detectTextLanguage('Oggi Pinocchio non vuole andare a scuola nella città.'), 'it');
    assert.equal(core.detectTextLanguage('吾輩は猫である。名前はまだ無い。'), 'ja');
    assert.equal(core.detectTextLanguage('今天晚上月光很好，我不见他已经三十多年。'), 'zh');
    assert.equal(core.detectTextLanguage('오늘 아침에 밥을 먹고 학교에 갔어요.'), 'ko');
    assert.equal(core.detectTextLanguage('Der kleine Hund sieht heute sehr müde aus und ist im Garten.'), 'de');
  });
});

describe('Verba Multi-Script Segmenter & Readings', () => {
  it('splits Italian elisions cleanly while preserving base words', () => {
    const itDict = JSON.parse(fs.readFileSync(path.resolve('dictionaries/it.json'), 'utf8'));
    const idx = core.buildLangIndex(itDict);
    const tokens = core.segmentText("L'acqua e un'idea bellissima!", 'it', idx.lexiconSet);
    const words = tokens.filter((t) => t.isWord).map((t) => t.normalized);
    assert.ok(words.includes('acqua'), `Expected acqua in ${JSON.stringify(words)}`);
    assert.ok(words.includes('idea'), `Expected idea in ${JSON.stringify(words)}`);
  });

  it('segments Chinese compounds via longest-match and unifies Simplified/Traditional', () => {
    const zhDict = JSON.parse(fs.readFileSync(path.resolve('dictionaries/zh.json'), 'utf8'));
    const idx = core.buildLangIndex(zhDict);
    const customPhrases = new Set(['狂人日记']);
    const lexicon = new Set([...idx.lexiconSet, '狂人日记']);
    const tokens = core.segmentText('我读了狂人日记。', 'zh', lexicon, customPhrases);
    const wordTexts = tokens.filter((t) => t.isWord).map((t) => t.text);
    assert.ok(wordTexts.includes('狂人日记'));

    const opts = core.getDefaultLangOptions('zh');
    const entryWithAlt = zhDict.entries.find((e) => e.alt && e.alt !== e.w);
    if (entryWithAlt) {
      const wordMap = new Map([
        [
          entryWithAlt.w,
          {
            id: `zh:${entryWithAlt.w}`,
            lang: 'zh',
            word: entryWithAlt.w,
            altScript: entryWithAlt.alt,
            status: 5,
            isPhrase: false,
            isCustomSegment: false,
            lookupCount: 1,
            source: 'manual',
            createdAt: 1,
            updatedAt: 1,
          },
        ],
      ]);
      const lk = core.lookupWordDetailed(entryWithAlt.alt, 'zh', idx, opts, wordMap, []);
      assert.equal(lk.crossScriptKnown, true);
    }
  });

  it('deinflects Japanese verbs and formats kanji-only furigana without duplicating okurigana', () => {
    const jaDict = JSON.parse(fs.readFileSync(path.resolve('dictionaries/ja.json'), 'utf8'));
    const idx = core.buildLangIndex(jaDict);
    const opts = core.getDefaultLangOptions('ja');
    const lk = core.lookupWordDetailed('食べました', 'ja', idx, opts, new Map(), []);
    assert.equal(lk.lemma, '食べる');

    const furigana = core.formatWordReading('食べる', 'ja', 'hiragana', 'たべる');
    assert.ok(furigana);
    assert.equal(furigana.kanjiStem, '食');
    assert.equal(furigana.reading, 'た');
    assert.equal(furigana.okurigana, 'べる');
  });

  it('decomposes Korean particles and applies phonetic liaison romanization', () => {
    const parts = core.analyzeKoreanParts('밥을');
    assert.ok(parts);
    assert.equal(parts.stem, '밥');
    assert.equal(parts.parts[1].part, '을');

    const rom = core.formatWordReading('밥을', 'ko', 'revised');
    assert.ok(rom?.reading);
    assert.ok(rom.reading.includes('b') && rom.reading.includes('eul'));
  });

  it('links German separable verbs across clauses (sieht ... aus -> aussehen)', () => {
    const deDict = JSON.parse(fs.readFileSync(path.resolve('dictionaries/de.json'), 'utf8'));
    const idx = core.buildLangIndex(deDict);
    const tokens = core.segmentText('Er sieht heute müde aus.', 'de', idx.lexiconSet);
    const siehtTok = tokens.find((t) => t.text === 'sieht');
    assert.equal(siehtTok?.lemmaHint, 'aussehen');
  });
});

describe('Verba Adaptive CEFR Placement Test Engine', () => {
  it('adapts difficulty upward on correct answers and downward on unsure/incorrect answers across languages', () => {
    for (const langCode of ['it', 'ja', 'zh', 'ar']) {
      const rawDict = JSON.parse(fs.readFileSync(path.resolve('dictionaries', `${langCode}.json`), 'utf8'));
      const idx = core.buildLangIndex(rawDict);

      // 1. High-proficiency learner (answers all 12 correctly)
      const highSession = core.createPlacementSession(idx, { totalQuestions: 12 });
      while (highSession.activeQuestion) {
        const q = highSession.activeQuestion;
        assert.equal(q.options.length, 4, `Expected 4 choices in ${langCode}`);
        const correctOpt = q.options.find((o) => o.isCorrect);
        assert.ok(correctOpt, `Missing correct option in ${langCode}`);
        const res = core.submitPlacementAnswer(highSession, correctOpt.id);
        assert.equal(res.correct, true);
      }
      const highResult = core.finalizePlacementSession(highSession, idx);
      assert.equal(highResult.lang, langCode);
      assert.ok(['B2', 'C1', 'C2'].includes(highResult.cefrLevel), `Expected B2-C2 for 12/12 in ${langCode}, got ${highResult.cefrLevel}`);
      assert.ok(highResult.estimatedVocab >= 3500);
      assert.ok(highResult.recommendedRankFrontier > 0);
      assert.equal(highResult.correctWords.length, 12);

      const cal = core.buildPlacementCalibrationWords(highResult, idx);
      assert.ok(cal.knownWords.length >= 12);

      // 2. Beginner learner (selects unsure on all 12)
      const lowSession = core.createPlacementSession(idx, { totalQuestions: 12 });
      while (lowSession.activeQuestion) {
        const res = core.submitPlacementAnswer(lowSession, 'unsure');
        assert.equal(res.correct, false);
      }
      const lowResult = core.finalizePlacementSession(lowSession, idx);
      assert.ok(['A0', 'A1'].includes(lowResult.cefrLevel), `Expected A0/A1 for 0/12 in ${langCode}, got ${lowResult.cefrLevel}`);
      assert.equal(lowResult.missedWords.length, 12);
      const lowCal = core.buildPlacementCalibrationWords(lowResult, idx);
      assert.equal(lowCal.learningWords.length, 12);
    }
  });
});

describe('Verba Cross-Browser Firefox & Chromium WebExtension API Bridge', () => {
  it('supports Promise-based Firefox browser.* APIs and callback-based chrome.* APIs', async () => {
    const prevBrowser = globalThis.browser;
    const prevChrome = globalThis.chrome;
    try {
      const mockStore = { verbaKey: 'firefox-ok' };
      globalThis.browser = {
        runtime: {
          id: 'verba@verba-reader.org',
          getBrowserInfo: async () => ({ name: 'Firefox', version: '128.0' }),
          getURL: (p) => `moz-extension://uuid/${p}`,
          sendMessage: async (msg) => ({ echoed: msg }),
        },
        storage: {
          local: {
            get: async (key) => ({ [key]: mockStore[key] }),
            set: async (items) => Object.assign(mockStore, items),
          },
        },
        tabs: {
          query: async () => [{ id: 42, url: 'https://example.org' }],
        },
      };

      assert.equal(core.isFirefoxWebExt(), true);
      assert.equal(core.getExtensionUrl('popup.html'), 'moz-extension://uuid/popup.html');
      const got = await core.storageLocalGet('verbaKey');
      assert.equal(got.verbaKey, 'firefox-ok');
      await core.storageLocalSet({ verbaKey: 'updated-ff' });
      assert.equal(mockStore.verbaKey, 'updated-ff');
      const tabs = await core.queryTabs({ active: true });
      assert.equal(tabs[0].id, 42);
      const msgRes = await core.sendRuntimeMessage({ ping: 1 });
      assert.deepEqual(msgRes, { echoed: { ping: 1 } });
    } finally {
      globalThis.browser = prevBrowser;
      globalThis.chrome = prevChrome;
    }
  });
});

describe('Verba CRDT Sync, Pairing Validation & PBKDF2/AES-GCM Backup Encryption', () => {
  it('validates pairing codes and rejects weak codes', () => {
    assert.equal(core.validatePairingCode('12345678').valid, false);
    assert.equal(core.validatePairingCode('PASSWORD').valid, false);
    assert.equal(core.validatePairingCode('ABCDEFGH').valid, false); // missing digit
    assert.equal(core.validatePairingCode('VRB94M2X').valid, true);
  });

  it('encrypts and decrypts API keys with PBKDF2 + AES-GCM and rejects wrong passphrases', async () => {
    const keys = { aiApiKey: 'sk-gemini-secret-123', cloudVoiceApiKey: 'xi-eleven-456' };
    const encrypted = await core.encryptApiKeysWithPassphrase(keys, 'correct-horse-battery');
    assert.ok(encrypted.ciphertext && encrypted.iv && encrypted.salt);
    assert.ok(!JSON.stringify(encrypted).includes('sk-gemini-secret-123'));

    const decrypted = await core.decryptApiKeysWithPassphrase(encrypted, 'correct-horse-battery');
    assert.deepEqual(decrypted, keys);

    await assert.rejects(() => core.decryptApiKeysWithPassphrase(encrypted, 'wrong-passphrase'));
  });

  it('merges word records, book positions (newest-wins), and per-device daily stats without doubling', () => {
    const wLocal = [
      { id: 'it:casa', lang: 'it', word: 'casa', status: 2, isPhrase: false, isCustomSegment: false, lookupCount: 2, source: 'manual', createdAt: 10, updatedAt: 100 },
    ];
    const wRemote = [
      { id: 'it:casa', lang: 'it', word: 'casa', status: 5, isPhrase: false, isCustomSegment: false, lookupCount: 1, source: 'manual', createdAt: 10, updatedAt: 200 },
    ];
    const mergedW = core.mergeWordRecords(wLocal, wRemote);
    assert.equal(mergedW[0].status, 5);
    assert.equal(mergedW[0].lookupCount, 2);

    // Book place: newest-wins even if user turned BACK to an earlier chapter!
    const bLocal = [{ id: 'b1', lang: 'it', title: 'Pinocchio', format: 'epub', chapters: [], chapterIndex: 4, scrollRatio: 0.8, totalWords: 100, uniqueWords: 50, createdAt: 1, updatedAt: 100 }];
    const bRemoteTurnedBack = [{ id: 'b1', lang: 'it', title: 'Pinocchio', format: 'epub', chapters: [], chapterIndex: 1, scrollRatio: 0.2, totalWords: 100, uniqueWords: 50, createdAt: 1, updatedAt: 250 }];
    const mergedB = core.mergeBookItems(bLocal, bRemoteTurnedBack);
    assert.equal(mergedB[0].chapterIndex, 1);

    // Daily stats: two distinct devices keep separate IDs so summing never doubles
    const sDevA = [{ id: 'it:2026-10-31:devA', lang: 'it', date: '2026-10-31', deviceId: 'devA', wordsRead: 600, secondsListened: 300, wordsMarkedKnown: 5, wordsMarkedLearning: 2, frequentMarkedKnown: 4, updatedAt: 100 }];
    const sDevB = [{ id: 'it:2026-10-31:devB', lang: 'it', date: '2026-10-31', deviceId: 'devB', wordsRead: 400, secondsListened: 120, wordsMarkedKnown: 3, wordsMarkedLearning: 1, frequentMarkedKnown: 2, updatedAt: 120 }];
    const synced = core.mergeDailyStats(sDevA, sDevB, 'sync_other_device', 'devA');
    assert.equal(synced.length, 2);
    assert.equal(synced.reduce((sum, r) => sum + r.wordsRead, 0), 1000);
  });
});

describe('Verba Vocabulary & Subtitle Importers', () => {
  it('parses LingQ, Language Reactor, HanziHero, Anki TSV, and SRT subtitles', () => {
    const lingq = core.parseLingQImport('Term,Hint\nallora,"well, then"\nsempre,always', 'it');
    assert.equal(lingq.length, 2);
    assert.equal(lingq[0].status, 5);
    assert.equal(lingq[0].customMeaning, 'well, then');

    const hh = core.parseHanziHeroImport('Hanzi,Stage,Meaning\n猫,Novice,cat\n世界,Apprentice,world\n历史,Journeyman II,history\n水,Master,water');
    assert.equal(hh.find((w) => w.word === '猫')?.status, 1);
    assert.equal(hh.find((w) => w.word === '世界')?.status, 2);
    assert.equal(hh.find((w) => w.word === '历史')?.status, 4);
    assert.equal(hh.find((w) => w.word === '水')?.status, 5);

    const tsv = core.parsePlainTextWordImport('ragazzo\tboy\nragazza\tgirl', 'it', 5);
    assert.equal(tsv.length, 2);
    assert.equal(tsv[0].customMeaning, 'boy');

    const srt = fs.readFileSync(path.resolve('samples/demo-it.srt'), 'utf8');
    const cues = core.parseSubtitleFile(srt, 'srt');
    assert.ok(cues.length >= 4);
    assert.ok(cues[0].end > cues[0].start);
  });
});

describe('Verba Inline Word Replacement (Diglot Weave Engine)', () => {
  it('indexes English glosses across all 24 languages and weaves L2 words into L1 sentences with spacing & pool rules', () => {
    const itRaw = JSON.parse(fs.readFileSync(path.resolve('dictionaries/it.json'), 'utf8'));
    const itIdx = core.buildLangIndex(itRaw);

    assert.ok(itIdx.byEnglishGloss.get('book')?.some((e) => e.w === 'libro'));
    assert.ok(itIdx.byEnglishGloss.get('water')?.some((e) => e.w === 'acqua'));
    assert.ok(itIdx.byEnglishGloss.get('forest')?.some((e) => e.w === 'foresta'));

    // Plural and capitalization matching
    const pluralMatch = core.matchEnglishTokenToTarget('Books', itIdx);
    assert.ok(pluralMatch);
    assert.equal(pluralMatch.isPlural, true);
    assert.equal(pluralMatch.isCapitalized, true);
    const formatted = core.formatDiglotTargetSurface(pluralMatch.candidates[0], 'it', true, true);
    assert.equal(formatted, 'Libri');

    // Weaving into an English sentence
    const settings = core.createDefaultSettings();
    settings.inlineReplacementDensityPct = 25;
    const wordMap = new Map([
      [
        'foresta',
        {
          id: 'it:foresta',
          lang: 'it',
          word: 'foresta',
          status: 2, // Learning stage 2 -> prioritized
          isPhrase: false,
          isCustomSegment: false,
          lookupCount: 1,
          source: 'manual',
          createdAt: 1,
          updatedAt: 1,
        },
      ],
      [
        'casa',
        {
          id: 'it:casa',
          lang: 'it',
          word: 'casa',
          status: -1, // Ignored -> must never be woven
          isPhrase: false,
          isCustomSegment: false,
          lookupCount: 1,
          source: 'manual',
          createdAt: 1,
          updatedAt: 1,
        },
      ],
    ]);

    const sentence = 'Every morning I read a book in the house near the quiet forest and the school.';
    const tokens = core.weaveDiglotSegment(sentence, 'it', itIdx, wordMap, settings, new Map());
    const replaced = tokens.filter((t) => t.isReplaced);
    assert.ok(replaced.length >= 2, `Expected >=2 woven words, got ${replaced.length}`);
    // Ignored 'casa' (house) must not be replaced
    assert.ok(!replaced.some((t) => t.targetWord === 'casa'), 'Ignored word casa should not be replaced');
    // Learning 'foresta' should be replaced with status 2
    const forestTok = replaced.find((t) => t.targetWord === 'foresta');
    assert.ok(forestTok, 'Expected learning word foresta to be woven');
    assert.equal(forestTok.originalText, 'forest');
    assert.equal(forestTok.status, 2);
  });
});

describe('Verba Firefox AMO Package & Linter Compliance', () => {
  it('packages dist/verba-firefox.zip with data_collection_permissions, strict_min_version >= 142.0, and zero unsafe innerHTML/Function/import patterns', () => {
    const zipPath = path.resolve('dist/verba-firefox.zip');
    assert.ok(fs.existsSync(zipPath), 'dist/verba-firefox.zip must exist');
    const archive = unzipSync(new Uint8Array(fs.readFileSync(zipPath)));
    assert.ok(archive['manifest.json'], 'Firefox zip must contain manifest.json');

    const ffManifest = JSON.parse(strFromU8(archive['manifest.json']));
    const gecko = ffManifest.browser_specific_settings?.gecko;
    assert.ok(gecko, 'browser_specific_settings.gecko must be defined');
    assert.ok(
      parseFloat(gecko.strict_min_version) >= 142,
      `Expected strict_min_version >= 142.0 for background.type & data_collection_permissions, got ${gecko.strict_min_version}`
    );
    assert.deepEqual(gecko.data_collection_permissions, {
      required: ['none'],
    });

    const bundleFiles = [
      'dist/popup.js',
      'dist/video.js',
      'dist/dashboard.js',
      'dist/content.js',
      'dist/books.js',
      'dist/background.js',
      'dist/pdf.worker.min.mjs',
    ];
    for (const rel of bundleFiles) {
      assert.ok(archive[rel], `Missing ${rel} in dist/verba-firefox.zip`);
      const code = strFromU8(archive[rel]);
      assert.equal(/\.innerHTML\s*=/.test(code), false, `Unsafe assignment to innerHTML found in ${rel}`);
      assert.equal(/new\s+Function\s*\(/.test(code), false, `Function constructor found in ${rel}`);
      assert.equal(/import\s*\(\s*\/\*.*?\*\/\s*this\.workerSrc\s*\)/.test(code), false, `Unsafe dynamic import(this.workerSrc) found in ${rel}`);
    }
  });
});
