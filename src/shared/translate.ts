import type { LangCode } from './types';
import { loadBundledDictionary } from './dictionary';
import { segmentText } from './segmenter';

const translationCache = new Map<string, string>();

/**
 * Translates words, selected phrases, or subtitle lines via:
 *  - Offline word-by-word dictionary synthesis when `whoTranslates === 'offline'` or network unavailable
 *  - Google Translate endpoint when `whoTranslates === 'google'`
 */
export async function translateText(
  text: string,
  sourceLang: LangCode | 'auto',
  targetLang = 'en',
  mode: 'google' | 'offline' = 'google'
): Promise<{ translation: string; source: 'google' | 'offline' }> {
  const clean = text.trim();
  if (!clean) return { translation: '', source: mode };

  const cacheKey = `${mode}:${sourceLang}:${targetLang}:${clean}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return { translation: cached, source: mode };

  if (mode === 'google') {
    try {
      const sl = sourceLang === 'yue' ? 'zh-TW' : sourceLang;
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
        sl
      )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(clean)}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.[0])) {
          const joined = json[0].map((seg: unknown[]) => String(seg?.[0] || '')).join('').trim();
          if (joined) {
            translationCache.set(cacheKey, joined);
            return { translation: joined, source: 'google' };
          }
        }
      }
    } catch {
      // Fall through cleanly to offline dictionary-backed translation
    }
  }

  // Offline local dictionary model synthesis
  if (sourceLang !== 'auto') {
    try {
      const idx = await loadBundledDictionary(sourceLang);
      const direct = idx.byHeadword.get(clean) || idx.byForm.get(clean) || idx.byHeadword.get(clean.toLowerCase());
      if (direct?.length) {
        const out = direct[0].m[0];
        translationCache.set(cacheKey, out);
        return { translation: out, source: 'offline' };
      }
      const tokens = segmentText(clean, sourceLang, idx.lexiconSet, new Set());
      const parts: string[] = [];
      for (const tok of tokens) {
        if (!tok.isWord) continue;
        const e =
          idx.byHeadword.get(tok.text)?.[0] ||
          idx.byHeadword.get(tok.normalized)?.[0] ||
          idx.byForm.get(tok.text)?.[0] ||
          idx.byForm.get(tok.normalized)?.[0];
        if (e) {
          parts.push(e.m[0].split(';')[0].trim());
        } else {
          parts.push(tok.text);
        }
      }
      const gloss = parts.join(' ');
      if (gloss) {
        translationCache.set(cacheKey, gloss);
        return { translation: gloss, source: 'offline' };
      }
    } catch {
      // ignore
    }
  }

  return { translation: `[${targetLang.toUpperCase()}] ${clean}`, source: 'offline' };
}
