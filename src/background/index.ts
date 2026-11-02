import { unzipSync, strFromU8 } from 'fflate';
import type {
  BookChapter,
  BookItem,
  BundledDictionary,
  LangCode,
  VerbaSettings,
  WordRecord,
} from '../shared/types';
import {
  checkAndRecordArticleParagraphRead,
  getAllWordsRaw,
  getBookById,
  getCustomDictsByLang,
  getDailyStatsByLang,
  getLangOptionsFromSettings,
  getLogicalDateString,
  getSettings,
  getVideoById,
  getWordRecord,
  getWordsByLang,
  incrementDailyStat,
  putBook,
  putListeningLog,
  putVideoHistory,
  putWordRecord,
  putWordRecordsBatch,
  saveSettings,
} from '../shared/db';
import { detectTextLanguage } from '../shared/languages';
import { loadBundledDictionary, lookupWordDetailed, resolveTrackingKey } from '../shared/dictionary';
import { translateText } from '../shared/translate';
import { runAiWordCheck } from '../shared/ai';
import { sendWordToAnki, syncWithAnki, testAnkiConnection } from '../shared/anki';
import { sha256Hex } from '../shared/sync-crypto';
import type { BgRequest, InitPagePayload } from '../shared/messaging';
import {
  createTab,
  getExtApi,
  getExtensionUrl,
  onRuntimeMessage,
  queryTabs,
  sendTabMessage,
} from '../shared/webext';

async function fetchExtensionDict(lang: LangCode): Promise<BundledDictionary> {
  const url = getExtensionUrl(`dictionaries/${lang}.json`);
  const res = await fetch(url);
  return (await res.json()) as BundledDictionary;
}

async function seedSampleBooksIfEmpty(): Promise<void> {
  try {
    // 1. Italian Pinocchio EPUB
    const epubUrl = getExtensionUrl('samples/pinocchio-it.epub');
    const epubRes = await fetch(epubUrl);
    if (epubRes.ok) {
      const bytes = new Uint8Array(await epubRes.arrayBuffer());
      const id = await sha256Hex(bytes);
      const existing = await getBookById(id);
      if (!existing) {
        const unzipped = unzipSync(bytes);
        const ch1Html = unzipped['OEBPS/ch1.xhtml'] ? strFromU8(unzipped['OEBPS/ch1.xhtml']) : '';
        const ch2Html = unzipped['OEBPS/ch2.xhtml'] ? strFromU8(unzipped['OEBPS/ch2.xhtml']) : '';
        const strip = (h: string) =>
          h
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const chapters: BookChapter[] = [
          {
            id: 'ch1',
            title: 'Capitolo I — Maestro Ciliegia e il pezzo di legno',
            html: extractBodyInner(ch1Html),
            text: strip(ch1Html),
          },
          {
            id: 'ch2',
            title: 'Capitolo II — Geppetto prende il pezzo di legno',
            html: extractBodyInner(ch2Html),
            text: strip(ch2Html),
          },
        ];
        const allWords = chapters
          .map((c) => c.text)
          .join(' ')
          .split(/\s+/)
          .filter(Boolean);
        const book: BookItem = {
          id,
          lang: 'it',
          title: 'Le avventure di Pinocchio',
          author: 'Carlo Collodi',
          format: 'epub',
          folderId: null,
          chapters,
          chapterIndex: 0,
          scrollRatio: 0,
          totalWords: allWords.length,
          uniqueWords: new Set(allWords.map((w) => w.toLowerCase())).size,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await putBook(book, bytes);
      }
    }

    // 2. Chinese Lu Xun sample
    const zhUrl = getExtensionUrl('samples/luxun-zh.txt');
    const zhRes = await fetch(zhUrl);
    if (zhRes.ok) {
      const text = await zhRes.text();
      const id = await sha256Hex(text);
      if (!(await getBookById(id))) {
        await putBook({
          id,
          lang: 'zh',
          title: '狂人日记 (选段)',
          author: '鲁迅',
          format: 'txt',
          folderId: null,
          chapters: [{ id: 'ch1', title: '狂人日记', text }],
          chapterIndex: 0,
          scrollRatio: 0,
          totalWords: text.replace(/\s+/g, '').length,
          uniqueWords: new Set(Array.from(text.replace(/\s+/g, ''))).size,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }

    // 3. Japanese Natsume Soseki sample
    const jaUrl = getExtensionUrl('samples/wagahai-ja.txt');
    const jaRes = await fetch(jaUrl);
    if (jaRes.ok) {
      const text = await jaRes.text();
      const id = await sha256Hex(text);
      if (!(await getBookById(id))) {
        await putBook({
          id,
          lang: 'ja',
          title: '吾輩は猫である (冒頭)',
          author: '夏目漱石',
          format: 'txt',
          folderId: null,
          chapters: [{ id: 'ch1', title: '第一章', text }],
          chapterIndex: 0,
          scrollRatio: 0,
          totalWords: text.replace(/\s+/g, '').length,
          uniqueWords: new Set(Array.from(text.replace(/\s+/g, ''))).size,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
  } catch (err) {
    console.warn('Sample book seeding warning:', err);
  }
}

function extractBodyInner(xhtml: string): string {
  const m = xhtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1].trim() : xhtml;
}

export async function updateToolbarBadge(settings?: VerbaSettings, tabId?: number): Promise<void> {
  const ext = getExtApi();
  if (!ext?.action) return;
  const s = settings || (await getSettings());
  const isPausedTab = tabId !== undefined && s.pausedTabIds.includes(tabId);
  if (!s.runOnWebPages || isPausedTab) {
    await ext.action.setBadgeText({ text: 'OFF', ...(tabId !== undefined ? { tabId } : {}) });
    await ext.action.setBadgeBackgroundColor({ color: '#475569', ...(tabId !== undefined ? { tabId } : {}) });
  } else {
    await ext.action.setBadgeText({
      text: s.activeLang.toUpperCase(),
      ...(tabId !== undefined ? { tabId } : {}),
    });
    await ext.action.setBadgeBackgroundColor({ color: '#0f172a', ...(tabId !== undefined ? { tabId } : {}) });
  }
}

function broadcastToAllTabs(payload: Record<string, unknown>, excludeTabId?: number): void {
  queryTabs({}).then((tabs) => {
    for (const tab of tabs) {
      if (tab.id !== undefined && tab.id !== excludeTabId) {
        sendTabMessage(tab.id, payload).catch(() => {});
      }
    }
  });
}

function isDomainBlocked(urlStr: string, neverRunDomains: string[]): boolean {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase();
    return neverRunDomains.some((d) => {
      const clean = d.toLowerCase().trim();
      return clean && (host === clean || host.endsWith('.' + clean));
    });
  } catch {
    return false;
  }
}

function computeTotalKnownWords(words: WordRecord[], lang: LangCode): number {
  const seenScriptPair = new Set<string>();
  let count = 0;
  for (const w of words) {
    if (w.deleted || w.status !== 5) continue;
    if (w.isPhrase && lang !== 'vi') continue;
    if (seenScriptPair.has(w.word)) continue;
    seenScriptPair.add(w.word);
    if (w.altScript) seenScriptPair.add(w.altScript);
    count++;
  }
  return count;
}

async function computeTodayTally(lang: LangCode, dayEndsAtHour: number) {
  const today = getLogicalDateString(Date.now(), dayEndsAtHour);
  const stats = await getDailyStatsByLang(lang);
  let wordsMarkedKnown = 0;
  let frequentMarkedKnown = 0;
  let wordsRead = 0;
  let secondsListened = 0;
  for (const s of stats) {
    if (s.date === today) {
      wordsMarkedKnown += s.wordsMarkedKnown;
      frequentMarkedKnown += s.frequentMarkedKnown;
      wordsRead += s.wordsRead;
      secondsListened += s.secondsListened;
    }
  }
  return { wordsMarkedKnown, frequentMarkedKnown, wordsRead, secondsListened };
}

const extApi = getExtApi();

extApi?.runtime?.onInstalled?.addListener(async (details: { reason?: string }) => {
  const settings = await getSettings();
  await loadBundledDictionary(settings.activeLang, fetchExtensionDict);
  await seedSampleBooksIfEmpty();
  await updateToolbarBadge(settings);

  extApi?.alarms?.create('verba-periodic-tick', { periodInMinutes: 1 });

  try {
    extApi?.contextMenus?.removeAll(() => {
      extApi?.contextMenus?.create({
        id: 'verba-open-reader-view',
        title: 'Open in Verba Reader View (Shift+L)',
        contexts: ['page', 'selection'],
      });
    });
  } catch {
    // ignore
  }

  if (details?.reason === 'install') {
    await createTab({ url: getExtensionUrl('dashboard.html#onboarding') }).catch(() => {});
  }
});

extApi?.contextMenus?.onClicked?.addListener(
  (info: { menuItemId?: string | number }, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId === 'verba-open-reader-view' && tab?.id !== undefined) {
      sendTabMessage(tab.id, { type: 'VERBA_TRIGGER_READER' }).catch(() => {});
    }
  }
);

// Smart Listening Tracker + Periodic Anki Sync
extApi?.alarms?.onAlarm?.addListener(async (alarm: { name?: string }) => {
  if (alarm.name !== 'verba-periodic-tick') return;
  const settings = await getSettings();

  if (settings.smartListeningTracking) {
    const audibleTabs = await queryTabs({ audible: true });
    for (const tab of audibleTabs) {
      if (!tab.url || !tab.title) continue;
      try {
        const host = new URL(tab.url).hostname.replace(/^www\./, '');
        if (settings.ignoredListeningDomains.includes(host)) continue;
        const detected = detectTextLanguage(tab.title);
        if (detected === settings.activeLang) {
          await incrementDailyStat(settings.activeLang, settings.deviceId, settings.dayEndsAtHour, {
            secondsListened: 60,
          });
          const date = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
          await putListeningLog({
            id: `${settings.activeLang}:${date}:${tab.title.slice(0, 80)}`,
            lang: settings.activeLang,
            title: tab.title,
            domain: host,
            date,
            secondsEarned: 60,
            status: 'counted',
            updatedAt: Date.now(),
          });
        } else if (!detected && settings.askUnsureTrackLang) {
          const date = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
          await putListeningLog({
            id: `${settings.activeLang}:${date}:${tab.title.slice(0, 80)}`,
            lang: settings.activeLang,
            title: tab.title,
            domain: host,
            date,
            secondsEarned: 60,
            status: 'held',
            updatedAt: Date.now(),
          });
        }
      } catch {
        // ignore invalid tab URLs
      }
    }
  }

  if (settings.ankiSendAllLearning || settings.ankiMarkKnownOnMature || settings.ankiSuspendWhenKnown) {
    try {
      const allWords = await getAllWordsRaw();
      const changed = await syncWithAnki(allWords, settings);
      if (changed.length > 0) {
        await putWordRecordsBatch(changed);
        broadcastToAllTabs({ type: 'VERBA_WORDS_REFRESH' });
      }
    } catch {
      // Anki closed; silently wait for next minute
    }
  }
});

onRuntimeMessage(async (rawMsg: BgRequest, sender) => {
  const settings = await getSettings();
  const tabId = sender.tab?.id;

  switch (rawMsg.type) {
    case 'GET_SETTINGS': {
      return settings;
    }

    case 'SAVE_SETTINGS': {
      const patch = { ...rawMsg.patch };
      if (patch.activeLang && !patch.learningLangs && !settings.learningLangs.includes(patch.activeLang)) {
        patch.learningLangs = Array.from(new Set([patch.activeLang, ...settings.learningLangs]));
      }
      const next = await saveSettings(patch);
      await updateToolbarBadge(next, tabId);
      broadcastToAllTabs({ type: 'VERBA_SETTINGS_UPDATED', settings: next });
      return next;
    }

    case 'GET_DICTIONARY': {
      const url = getExtensionUrl(`dictionaries/${rawMsg.lang}.json`);
      const res = await fetch(url);
      return await res.json();
    }

    case 'GET_INIT_DATA': {
      let activeLang = settings.activeLang;
      let autoSwitchedFrom: LangCode | undefined;

      const isPaused = tabId !== undefined && settings.pausedTabIds.includes(tabId);
      const isForceOn = settings.forceEnabledUrls.includes(rawMsg.url);
      const isBlocked = !isForceOn && isDomainBlocked(rawMsg.url, settings.neverRunDomains);
      let enabled = settings.runOnWebPages && !isPaused && !isBlocked;
      let diglotModeOnThisPage = false;

      if (enabled && !isForceOn && (rawMsg.htmlLang || rawMsg.sampleText)) {
        const pageLang = detectTextLanguage(rawMsg.sampleText || '', rawMsg.htmlLang);
        if (pageLang && pageLang !== activeLang) {
          if (settings.autoSwitchPageLang && settings.learningLangs.includes(pageLang)) {
            autoSwitchedFrom = activeLang;
            activeLang = pageLang;
            await saveSettings({ activeLang });
          } else if (settings.inlineReplacementEnabled && activeLang !== 'en') {
            diglotModeOnThisPage = true;
          } else if (!rawMsg.url.includes('youtube.com') && !rawMsg.url.includes('netflix.com')) {
            enabled = false;
          }
        }
      }

      await updateToolbarBadge({ ...settings, activeLang }, tabId);
      const words = await getWordsByLang(activeLang);
      const customDicts = await getCustomDictsByLang(activeLang);
      const todayStats = await computeTodayTally(activeLang, settings.dayEndsAtHour);
      const totalKnownCount = computeTotalKnownWords(words, activeLang);

      const payload: InitPagePayload = {
        settings: { ...settings, activeLang },
        activeLang,
        autoSwitchedFrom,
        enabledOnThisPage: enabled,
        diglotModeOnThisPage,
        words,
        customDicts,
        todayStats,
        totalKnownCount,
      };
      return payload;
    }

    case 'LOOKUP_WORD': {
      const idx = await loadBundledDictionary(rawMsg.lang, fetchExtensionDict);
      const words = await getWordsByLang(rawMsg.lang);
      const wordMap = new Map(words.map((w) => [w.word, w]));
      const customDicts = await getCustomDictsByLang(rawMsg.lang);
      const opts = getLangOptionsFromSettings(settings, rawMsg.lang);
      const res = lookupWordDetailed(
        rawMsg.word,
        rawMsg.lang,
        idx,
        opts,
        wordMap,
        customDicts,
        rawMsg.sentence,
        rawMsg.lemmaHint
      );
      if (rawMsg.incrementLookup && res.record) {
        const updated: WordRecord = {
          ...res.record,
          lookupCount: (res.record.lookupCount || 0) + 1,
          updatedAt: Date.now(),
        };
        await putWordRecord(updated);
        res.record = updated;
      }
      return res;
    }

    case 'GRADE_WORD': {
      const idx = await loadBundledDictionary(rawMsg.lang, fetchExtensionDict);
      const opts = getLangOptionsFromSettings(settings, rawMsg.lang);

      const resolved = resolveTrackingKey(
        rawMsg.lemmaOverride || rawMsg.word,
        rawMsg.lang,
        idx,
        opts.countingMode
      );
      const canonicalWord = rawMsg.isPhrase || rawMsg.isCustomSegment ? rawMsg.word : resolved.key;
      const prev = await getWordRecord(rawMsg.lang, canonicalWord);
      const now = Date.now();

      if (rawMsg.status === 0 && !rawMsg.customMeaning && !rawMsg.aiMeaning) {
        if (prev) {
          const resetRec: WordRecord = { ...prev, status: 0, deleted: true, updatedAt: now };
          await putWordRecord(resetRec);
          broadcastToAllTabs({ type: 'VERBA_WORD_UPDATED', record: resetRec });
        }
        return { ok: true, record: null };
      }

      const primaryEntry = resolved.primaryEntry;
      const altScript =
        rawMsg.altScript ||
        (primaryEntry?.alt && primaryEntry.alt !== canonicalWord
          ? primaryEntry.alt
          : primaryEntry?.w && primaryEntry.w !== canonicalWord
          ? primaryEntry.w
          : undefined);

      const nextRecord: WordRecord = {
        id: `${rawMsg.lang}:${canonicalWord}`,
        lang: rawMsg.lang,
        word: canonicalWord,
        ...(altScript ? { altScript } : {}),
        status: rawMsg.status,
        isPhrase: Boolean(rawMsg.isPhrase ?? (/\s/.test(canonicalWord) && rawMsg.lang !== 'vi')),
        isCustomSegment: Boolean(rawMsg.isCustomSegment ?? prev?.isCustomSegment),
        ...(rawMsg.lemmaOverride
          ? { lemmaOverride: rawMsg.lemmaOverride }
          : prev?.lemmaOverride
          ? { lemmaOverride: prev.lemmaOverride }
          : {}),
        ...(rawMsg.customMeaning !== undefined
          ? { customMeaning: rawMsg.customMeaning }
          : prev?.customMeaning
          ? { customMeaning: prev.customMeaning }
          : {}),
        ...(rawMsg.aiMeaning !== undefined
          ? { aiMeaning: rawMsg.aiMeaning }
          : prev?.aiMeaning
          ? { aiMeaning: prev.aiMeaning }
          : {}),
        ...(prev?.aiVerdict ? { aiVerdict: prev.aiVerdict } : {}),
        reading: primaryEntry?.r || prev?.reading,
        lookupCount: (prev?.lookupCount || 0) + 1,
        source: prev?.source || 'manual',
        contextSentence: rawMsg.contextSentence || prev?.contextSentence,
        ankiNoteId: prev?.ankiNoteId,
        ankiDeck: prev?.ankiDeck,
        ankiSuspendedByVerba: prev?.ankiSuspendedByVerba,
        deleted: false,
        createdAt: prev?.createdAt || now,
        updatedAt: now,
      };

      await putWordRecord(nextRecord);

      if (
        (rawMsg.lang === 'zh' || rawMsg.lang === 'yue') &&
        opts.unifyScripts &&
        rawMsg.status === 5 &&
        altScript &&
        altScript !== canonicalWord
      ) {
        const altPrev = await getWordRecord(rawMsg.lang, altScript);
        await putWordRecord({
          id: `${rawMsg.lang}:${altScript}`,
          lang: rawMsg.lang,
          word: altScript,
          altScript: canonicalWord,
          status: 5,
          isPhrase: false,
          isCustomSegment: false,
          lookupCount: altPrev?.lookupCount || 0,
          source: 'manual',
          createdAt: altPrev?.createdAt || now,
          updatedAt: now,
        });
      }

      if (!nextRecord.isPhrase || rawMsg.lang === 'vi') {
        const isFrequent = Boolean(primaryEntry?.rank && primaryEntry.rank <= 5000);
        if (rawMsg.status === 5 && prev?.status !== 5) {
          await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
            wordsMarkedKnown: 1,
            frequentMarkedKnown: isFrequent ? 1 : 0,
          });
        } else if (rawMsg.status >= 1 && rawMsg.status <= 4 && (!prev || prev.status === 0)) {
          await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
            wordsMarkedLearning: 1,
          });
        }
      }

      if (
        settings.ankiSendAllLearning &&
        settings.ankiLevelsToSend.includes(rawMsg.status) &&
        !nextRecord.ankiNoteId
      ) {
        sendWordToAnki(
          {
            lang: rawMsg.lang,
            word: canonicalWord,
            reading: nextRecord.reading,
            pitch: primaryEntry?.pitch,
            meanings: nextRecord.customMeaning ? [nextRecord.customMeaning] : primaryEntry?.m || [],
            sentence: nextRecord.contextSentence,
            pickedByHand: false,
          },
          nextRecord,
          settings
        )
          .then(async (ankiRes) => {
            await putWordRecord({ ...nextRecord, ankiNoteId: ankiRes.noteId, ankiDeck: ankiRes.deck });
          })
          .catch(() => {});
      }

      const updatedWords = await getWordsByLang(rawMsg.lang);
      const totalKnownCount = computeTotalKnownWords(updatedWords, rawMsg.lang);
      const todayStats = await computeTodayTally(rawMsg.lang, settings.dayEndsAtHour);

      broadcastToAllTabs({
        type: 'VERBA_WORD_UPDATED',
        record: nextRecord,
        totalKnownCount,
        todayStats,
      });

      return { ok: true, record: nextRecord, totalKnownCount, todayStats };
    }

    case 'BATCH_MARK_KNOWN': {
      const now = Date.now();
      const existing = await getWordsByLang(rawMsg.lang);
      const existingMap = new Map(existing.map((w) => [w.word, w]));
      const toSave: WordRecord[] = [];

      for (const w of rawMsg.words) {
        const prev = existingMap.get(w);
        if (prev && prev.status !== 0) continue;
        toSave.push({
          id: `${rawMsg.lang}:${w}`,
          lang: rawMsg.lang,
          word: w,
          status: 5,
          isPhrase: /\s/.test(w) && rawMsg.lang !== 'vi',
          isCustomSegment: false,
          lookupCount: prev?.lookupCount || 0,
          source: rawMsg.source,
          createdAt: prev?.createdAt || now,
          updatedAt: now,
        });
      }

      await putWordRecordsBatch(toSave);
      if (rawMsg.source === 'manual' && toSave.length > 0) {
        await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
          wordsMarkedKnown: toSave.length,
        });
      }

      const updatedWords = await getWordsByLang(rawMsg.lang);
      const totalKnownCount = computeTotalKnownWords(updatedWords, rawMsg.lang);
      const todayStats = await computeTodayTally(rawMsg.lang, settings.dayEndsAtHour);

      broadcastToAllTabs({ type: 'VERBA_WORDS_REFRESH', totalKnownCount, todayStats });
      return {
        ok: true,
        markedCount: toSave.length,
        markedWords: toSave.map((r) => r.word),
        totalKnownCount,
        todayStats,
      };
    }

    case 'SPLIT_CUSTOM_WORD': {
      const prev = await getWordRecord(rawMsg.lang, rawMsg.word);
      if (prev) {
        const updated: WordRecord = {
          ...prev,
          isCustomSegment: false,
          deleted: true,
          status: 0,
          updatedAt: Date.now(),
        };
        await putWordRecord(updated);
        broadcastToAllTabs({ type: 'VERBA_WORDS_REFRESH' });
      }
      return { ok: true };
    }

    case 'TRANSLATE': {
      const opts = rawMsg.sourceLang !== 'auto' ? getLangOptionsFromSettings(settings, rawMsg.sourceLang) : null;
      const target = rawMsg.targetLang || opts?.translateIntoLang || 'en';
      const mode = opts?.whoTranslates || 'google';
      return await translateText(rawMsg.text, rawMsg.sourceLang, target, mode);
    }

    case 'AI_CHECK_WORD': {
      const opts = getLangOptionsFromSettings(settings, rawMsg.lang);
      const verdict = await runAiWordCheck(
        rawMsg.word,
        rawMsg.lang,
        rawMsg.sentence,
        settings,
        opts.translateIntoLang
      );
      const idx = await loadBundledDictionary(rawMsg.lang, fetchExtensionDict);
      const resolved = resolveTrackingKey(rawMsg.word, rawMsg.lang, idx, opts.countingMode);
      const prev =
        (await getWordRecord(rawMsg.lang, resolved.key)) ||
        (await getWordRecord(rawMsg.lang, rawMsg.word));
      const now = Date.now();
      const nextRec: WordRecord = prev
        ? { ...prev, aiVerdict: verdict, updatedAt: now }
        : {
            id: `${rawMsg.lang}:${resolved.key}`,
            lang: rawMsg.lang,
            word: resolved.key,
            status: 0,
            isPhrase: Boolean(/\s/.test(resolved.key) && rawMsg.lang !== 'vi'),
            isCustomSegment: false,
            lookupCount: 1,
            source: 'manual',
            aiVerdict: verdict,
            deleted: false,
            createdAt: now,
            updatedAt: now,
          };
      await putWordRecord(nextRec);
      return { ok: true, verdict };
    }

    case 'ANKI_TEST': {
      return await testAnkiConnection(rawMsg.port);
    }

    case 'ANKI_SEND_WORD': {
      const prev = await getWordRecord(rawMsg.payload.lang, rawMsg.payload.word);
      const res = await sendWordToAnki(rawMsg.payload, prev, settings);
      const now = Date.now();
      const nextRec: WordRecord = prev
        ? {
            ...prev,
            status: prev.status === 0 ? 1 : prev.status,
            ankiNoteId: res.noteId,
            ankiDeck: res.deck,
            ankiSuspendedByVerba: false,
            updatedAt: now,
          }
        : {
            id: `${rawMsg.payload.lang}:${rawMsg.payload.word}`,
            lang: rawMsg.payload.lang,
            word: rawMsg.payload.word,
            status: 1,
            isPhrase: /\s/.test(rawMsg.payload.word) && rawMsg.payload.lang !== 'vi',
            isCustomSegment: false,
            lookupCount: 1,
            source: 'manual',
            contextSentence: rawMsg.payload.sentence,
            ankiNoteId: res.noteId,
            ankiDeck: res.deck,
            createdAt: now,
            updatedAt: now,
          };
      await putWordRecord(nextRec);
      broadcastToAllTabs({ type: 'VERBA_WORD_UPDATED', record: nextRec });
      return { ok: true, ...res, record: nextRec };
    }

    case 'ANKI_SYNC_NOW': {
      const allWords = await getAllWordsRaw();
      const changed = await syncWithAnki(allWords, settings);
      if (changed.length > 0) {
        await putWordRecordsBatch(changed);
        broadcastToAllTabs({ type: 'VERBA_WORDS_REFRESH' });
      }
      return { ok: true, updatedCount: changed.length };
    }

    case 'RECORD_READING_WORDS': {
      if (rawMsg.count <= 0) return { ok: true };
      if (rawMsg.paragraphKey) {
        const today = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
        const fresh = await checkAndRecordArticleParagraphRead(`${today}:${rawMsg.paragraphKey}`);
        if (!fresh) return { ok: true, skippedDuplicate: true };
      }
      const stat = await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
        wordsRead: rawMsg.count,
      });
      return { ok: true, stat };
    }

    case 'RECORD_LISTENING_SECONDS': {
      if (rawMsg.seconds <= 0) return { ok: true };
      if (!rawMsg.held) {
        await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
          secondsListened: rawMsg.seconds,
        });
      }
      if (rawMsg.title) {
        const date = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
        await putListeningLog({
          id: `${rawMsg.lang}:${date}:${rawMsg.title.slice(0, 80)}`,
          lang: rawMsg.lang,
          title: rawMsg.title,
          domain: rawMsg.domain || 'reader',
          date,
          secondsEarned: rawMsg.seconds,
          status: rawMsg.held ? 'held' : 'counted',
          updatedAt: Date.now(),
        });
      }
      return { ok: true };
    }

    case 'SAVE_ARTICLE_TO_SHELF': {
      const id = await sha256Hex(`${rawMsg.lang}:article:${rawMsg.url}`);
      const prev = await getBookById(id);
      const wordsArr = rawMsg.text.split(/\s+/).filter(Boolean);
      const book: BookItem = {
        id,
        lang: rawMsg.lang,
        title: prev?.title || rawMsg.title || 'Saved Article',
        format: 'article',
        folderId: prev?.folderId ?? null,
        chapters: [{ id: 'article', title: rawMsg.title || 'Article', html: rawMsg.html, text: rawMsg.text }],
        chapterIndex: prev?.chapterIndex || 0,
        scrollRatio: prev?.scrollRatio || 0,
        sourceUrl: rawMsg.url,
        totalWords: wordsArr.length,
        uniqueWords: new Set(wordsArr.map((w) => w.toLowerCase())).size,
        createdAt: prev?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      await putBook(book);
      return { ok: true, bookId: id };
    }

    case 'SAVE_VIDEO_PROGRESS': {
      await putVideoHistory(rawMsg.item);
      return { ok: true };
    }

    case 'GET_VIDEO_PROGRESS': {
      return (await getVideoById(rawMsg.id)) || null;
    }

    case 'BROADCAST_WORDS_REFRESH': {
      await updateToolbarBadge(settings, tabId);
      broadcastToAllTabs(
        { type: 'VERBA_WORDS_REFRESH', lang: rawMsg.lang || settings.activeLang },
        tabId
      );
      return { ok: true };
    }

    case 'OPEN_EXTENSION_PAGE': {
      const pageMap = {
        dashboard: 'dashboard.html',
        books: 'books.html',
        video: 'video.html',
      };
      const targetUrl = getExtensionUrl(pageMap[rawMsg.page] + (rawMsg.query ? `?${rawMsg.query}` : ''));
      await createTab({ url: targetUrl });
      return { ok: true };
    }
  }
});
