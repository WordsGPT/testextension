import { unzipSync, strFromU8 } from 'fflate';
import * as pdfjsLib from 'pdfjs-dist';
import type { BookChapter, BookItem, LangCode } from '../shared/types';
import { parseSubtitleFile } from '../shared/imports';
import { sha256Hex } from '../shared/sync-crypto';
import { getExtensionUrl } from '../shared/webext';

const pdfWorkerUrl = getExtensionUrl('dist/pdf.worker.min.mjs');
if (pdfWorkerUrl) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export interface ParsedBookResult {
  book: BookItem;
  rawBytes?: Uint8Array;
}

function guessMime(pathStr: string): string {
  const lower = pathStr.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function resolveRelativePath(baseDir: string, rel: string): string {
  if (/^(data:|https?:|blob:)/i.test(rel)) return rel;
  const cleanRel = rel.split('#')[0].split('?')[0];
  const stack = baseDir ? baseDir.split('/').filter(Boolean) : [];
  for (const part of cleanRel.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return stack.join('/');
}

function decodeSmartText(bytes: Uint8Array): string {
  if (bytes.length >= 2) {
    if (bytes[0] === 0xff && bytes[1] === 0xfe) {
      return new TextDecoder('utf-16le').decode(bytes);
    }
    if (bytes[0] === 0xfe && bytes[1] === 0xff) {
      return new TextDecoder('utf-16be').decode(bytes);
    }
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}

function countBookWords(chapters: BookChapter[], lang: LangCode): { totalWords: number; uniqueWords: number } {
  const full = chapters.map((c) => c.text).join(' ');
  if (lang === 'zh' || lang === 'yue' || lang === 'ja' || lang === 'th') {
    const chars = Array.from(full.replace(/[\s\p{P}\p{S}]+/gu, ''));
    return { totalWords: chars.length, uniqueWords: new Set(chars).size };
  }
  const tokens = full
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
  return { totalWords: tokens.length, uniqueWords: new Set(tokens).size };
}

/**
 * Parses an EPUB (.epub) archive offline into chapters with embedded images & ruby/vertical preservation.
 */
export async function parseEpubFile(bytes: Uint8Array, fileName: string, lang: LangCode): Promise<ParsedBookResult> {
  const id = await sha256Hex(bytes);
  const files = unzipSync(bytes);
  const parser = new DOMParser();

  // Locate OPF via META-INF/container.xml
  let opfPath = '';
  if (files['META-INF/container.xml']) {
    const containerXml = strFromU8(files['META-INF/container.xml']);
    const doc = parser.parseFromString(containerXml, 'application/xml');
    opfPath = doc.querySelector('rootfile')?.getAttribute('full-path') || '';
  }
  if (!opfPath) {
    opfPath = Object.keys(files).find((k) => k.toLowerCase().endsWith('.opf')) || '';
  }

  let title = fileName.replace(/\.epub$/i, '');
  let author = '';
  let spineIsVertical = false;
  const chapters: BookChapter[] = [];

  if (opfPath && files[opfPath]) {
    const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/')) : '';
    const opfXml = strFromU8(files[opfPath]);
    const opfDoc = parser.parseFromString(opfXml, 'application/xml');

    const titleEl = opfDoc.getElementsByTagNameNS('*', 'title')[0] || opfDoc.querySelector('title');
    if (titleEl?.textContent?.trim()) title = titleEl.textContent.trim();

    const creatorEl = opfDoc.getElementsByTagNameNS('*', 'creator')[0] || opfDoc.querySelector('creator');
    if (creatorEl?.textContent?.trim()) author = creatorEl.textContent.trim();

    const spineEl = opfDoc.getElementsByTagNameNS('*', 'spine')[0] || opfDoc.querySelector('spine');
    if (spineEl?.getAttribute('page-progression-direction') === 'rtl' && (lang === 'ja' || lang === 'zh' || lang === 'yue')) {
      spineIsVertical = true;
    }

    const manifestMap = new Map<string, { href: string; mediaType: string; properties: string }>();
    const items = Array.from(opfDoc.getElementsByTagNameNS('*', 'item'));
    for (const item of items) {
      const itemId = item.getAttribute('id') || '';
      const href = item.getAttribute('href') || '';
      const mediaType = item.getAttribute('media-type') || '';
      const properties = item.getAttribute('properties') || '';
      if (itemId && href) {
        manifestMap.set(itemId, { href: decodeURIComponent(href), mediaType, properties });
      }
    }

    // Parse TOC labels from NCX or EPUB3 nav document
    const tocTitleByPath = new Map<string, string>();
    for (const item of manifestMap.values()) {
      const fullItemPath = resolveRelativePath(opfDir, item.href);
      if (!files[fullItemPath]) continue;
      if (item.mediaType.includes('ncx') || item.href.endsWith('.ncx')) {
        const ncxDoc = parser.parseFromString(strFromU8(files[fullItemPath]), 'application/xml');
        const ncxDir = fullItemPath.includes('/') ? fullItemPath.slice(0, fullItemPath.lastIndexOf('/')) : '';
        Array.from(ncxDoc.getElementsByTagNameNS('*', 'navPoint')).forEach((np) => {
          const lbl = np.getElementsByTagNameNS('*', 'text')[0]?.textContent?.trim();
          const src = np.getElementsByTagNameNS('*', 'content')[0]?.getAttribute('src');
          if (lbl && src) {
            tocTitleByPath.set(resolveRelativePath(ncxDir, decodeURIComponent(src)), lbl);
          }
        });
      } else if (item.properties.includes('nav')) {
        const navDoc = parser.parseFromString(strFromU8(files[fullItemPath]), 'text/html');
        const navDir = fullItemPath.includes('/') ? fullItemPath.slice(0, fullItemPath.lastIndexOf('/')) : '';
        navDoc.querySelectorAll('nav a[href]').forEach((a) => {
          const lbl = a.textContent?.trim();
          const href = a.getAttribute('href');
          if (lbl && href) {
            tocTitleByPath.set(resolveRelativePath(navDir, decodeURIComponent(href)), lbl);
          }
        });
      }
    }

    const itemrefs = Array.from(opfDoc.getElementsByTagNameNS('*', 'itemref'));
    let chapCounter = 1;
    for (const ref of itemrefs) {
      const idref = ref.getAttribute('idref') || '';
      const manifestItem = manifestMap.get(idref);
      if (!manifestItem) continue;
      const chapterPath = resolveRelativePath(opfDir, manifestItem.href);
      const rawChapter = files[chapterPath];
      if (!rawChapter) continue;

      const xhtml = strFromU8(rawChapter);
      const chapterDir = chapterPath.includes('/') ? chapterPath.slice(0, chapterPath.lastIndexOf('/')) : '';
      const chDoc = parser.parseFromString(xhtml, 'text/html');

      const hasVerticalCss =
        spineIsVertical ||
        /vertical-rl|tategaki/i.test(xhtml) ||
        Boolean(chDoc.body?.className && /vertical|vrtl|tategaki/i.test(chDoc.body.className));

      // Remove scripts and unsafe event attributes, inline archive images as data URLs
      chDoc.querySelectorAll('script, style, link').forEach((n) => n.remove());
      chDoc.querySelectorAll('img[src], image').forEach((imgEl) => {
        const attr = imgEl.hasAttribute('src') ? 'src' : 'xlink:href';
        const rawSrc = imgEl.getAttribute(attr) || imgEl.getAttribute('href') || '';
        if (!rawSrc || rawSrc.startsWith('data:')) return;
        const imgPath = resolveRelativePath(chapterDir, decodeURIComponent(rawSrc));
        const imgBytes = files[imgPath];
        if (imgBytes) {
          const dataUrl = `data:${guessMime(imgPath)};base64,${uint8ToBase64(imgBytes)}`;
          if (imgEl.tagName.toLowerCase() === 'img') {
            imgEl.setAttribute('src', dataUrl);
          } else {
            imgEl.setAttribute('href', dataUrl);
          }
        }
      });

      const bodyHtml = chDoc.body?.innerHTML?.trim() || '';
      const plainText = (chDoc.body?.textContent || '').replace(/\s+/g, ' ').trim();
      if (!plainText && !bodyHtml.includes('<img')) continue;

      const heading =
        tocTitleByPath.get(chapterPath) ||
        chDoc.querySelector('h1, h2, h3')?.textContent?.trim() ||
        `Chapter ${chapCounter}`;

      chapters.push({
        id: `ch_${chapCounter}`,
        title: heading.slice(0, 120),
        html: bodyHtml,
        text: plainText,
        vertical: hasVerticalCss,
      });
      chapCounter++;
    }
  }

  // Fallback if OPF had no spine items
  if (chapters.length === 0) {
    const htmlKeys = Object.keys(files)
      .filter((k) => /\.(x?html?|htm)$/i.test(k) && !k.toLowerCase().includes('nav'))
      .sort();
    htmlKeys.forEach((k, idx) => {
      const raw = strFromU8(files[k]);
      const doc = parser.parseFromString(raw, 'text/html');
      doc.querySelectorAll('script, style').forEach((s) => s.remove());
      const txt = (doc.body?.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt) {
        chapters.push({
          id: `ch_${idx + 1}`,
          title: doc.querySelector('h1, h2')?.textContent?.trim() || `Section ${idx + 1}`,
          html: doc.body?.innerHTML || '',
          text: txt,
        });
      }
    });
  }

  const counts = countBookWords(chapters, lang);
  const now = Date.now();
  return {
    book: {
      id,
      lang,
      title,
      ...(author ? { author } : {}),
      format: 'epub',
      folderId: null,
      chapters,
      chapterIndex: 0,
      scrollRatio: 0,
      totalWords: counts.totalWords,
      uniqueWords: counts.uniqueWords,
      createdAt: now,
      updatedAt: now,
    },
    rawBytes: bytes,
  };
}

/**
 * Parses a PDF (.pdf) using pdfjs-dist into per-page chapters supporting both reflowed Fit-to-Screen
 * and exact Printed Page rendering!
 */
export async function parsePdfFile(bytes: Uint8Array, fileName: string, lang: LangCode): Promise<ParsedBookResult> {
  const id = await sha256Hex(bytes);
  const copyForPdfJs = bytes.slice();
  const loadingTask = pdfjsLib.getDocument({ data: copyForPdfJs });
  const pdf = await loadingTask.promise;

  let title = fileName.replace(/\.pdf$/i, '');
  let author = '';
  try {
    const meta = await pdf.getMetadata();
    const info = meta?.info as Record<string, unknown> | undefined;
    if (info?.Title && String(info.Title).trim()) title = String(info.Title).trim();
    if (info?.Author && String(info.Author).trim()) author = String(info.Author).trim();
  } catch {
    // ignore metadata errors
  }

  const chapters: BookChapter[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let currentLine = '';
    let lastY: number | null = null;

    for (const item of content.items) {
      if (!('str' in item)) continue;
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 6) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = item.str;
      } else {
        currentLine += (currentLine && !currentLine.endsWith('-') && !item.str.startsWith(' ') ? ' ' : '') + item.str;
      }
      lastY = y;
    }
    if (currentLine.trim()) lines.push(currentLine.trim());

    // Rebuild natural paragraphs from PDF lines
    const paragraphs: string[] = [];
    let paraBuf = '';
    for (const ln of lines) {
      if (!paraBuf) {
        paraBuf = ln;
      } else if (/[.!?。！？:»"”]$/.test(paraBuf) || ln.length < 42) {
        paragraphs.push(paraBuf);
        paraBuf = ln;
      } else {
        paraBuf = paraBuf.endsWith('-') ? paraBuf.slice(0, -1) + ln : paraBuf + ' ' + ln;
      }
    }
    if (paraBuf) paragraphs.push(paraBuf);

    const html =
      paragraphs.length > 0
        ? paragraphs.map((pr) => `<p>${escHtml(pr)}</p>`).join('\n')
        : `<p class="pdf-empty-note">[Scanned / image page ${p} — switch to Printed page view in Aa menu]</p>`;

    chapters.push({
      id: `page_${p}`,
      title: `Page ${p}`,
      html,
      text: paragraphs.join('\n\n'),
    });
  }

  const counts = countBookWords(chapters, lang);
  const now = Date.now();
  return {
    book: {
      id,
      lang,
      title,
      ...(author ? { author } : {}),
      format: 'pdf',
      folderId: null,
      chapters,
      chapterIndex: 0,
      scrollRatio: 0,
      totalWords: counts.totalWords,
      uniqueWords: counts.uniqueWords,
      createdAt: now,
      updatedAt: now,
    },
    rawBytes: bytes,
  };
}

/**
 * Renders a specific PDF page (1-based) onto a canvas + positioned text overlay for Printed Page mode!
 */
export async function renderPdfPrintedPage(
  bytes: Uint8Array,
  pageNumber: number,
  container: HTMLElement,
  scale = 1.35
): Promise<HTMLElement> {
  const doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
  const page = await doc.getPage(Math.max(1, Math.min(doc.numPages, pageNumber)));
  const viewport = page.getViewport({ scale });

  container.replaceChildren();
  const wrapper = document.createElement('div');
  wrapper.className = 'pdf-printed-stage';
  wrapper.style.position = 'relative';
  wrapper.style.width = `${Math.round(viewport.width)}px`;
  wrapper.style.height = `${Math.round(viewport.height)}px`;
  wrapper.style.margin = '0 auto';

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  canvas.style.display = 'block';
  wrapper.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;

  const textLayer = document.createElement('div');
  textLayer.className = 'pdf-printed-text-layer';
  textLayer.style.position = 'absolute';
  textLayer.style.inset = '0';

  const textContent = await page.getTextContent();
  for (const item of textContent.items) {
    if (!('str' in item) || !item.str.trim()) continue;
    const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
    const fontHeight = Math.hypot(tx[2], tx[3]);
    const span = document.createElement('span');
    span.textContent = item.str + ' ';
    span.style.position = 'absolute';
    span.style.left = `${tx[4]}px`;
    span.style.top = `${tx[5] - fontHeight}px`;
    span.style.fontSize = `${Math.max(10, fontHeight * 0.92)}px`;
    span.style.lineHeight = '1.15';
    span.style.whiteSpace = 'pre';
    textLayer.appendChild(span);
  }

  wrapper.appendChild(textLayer);
  container.appendChild(wrapper);
  return textLayer;
}

/**
 * Parses Plain Text (.txt) or Pasted text into chapters & rebuilt paragraphs.
 */
export async function parsePlainTextBook(
  rawInput: Uint8Array | string,
  titleHint: string,
  lang: LangCode,
  format: 'txt' | 'paste' = 'txt'
): Promise<ParsedBookResult> {
  const text = typeof rawInput === 'string' ? rawInput : decodeSmartText(rawInput);
  const id = await sha256Hex(`${format}:${lang}:${text}`);

  const blocks = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  // Split into chapters if long or has chapter markers
  const chapters: BookChapter[] = [];
  let curTitle = titleHint || 'Chapter 1';
  let curParas: string[] = [];

  const flush = () => {
    if (curParas.length === 0) return;
    chapters.push({
      id: `ch_${chapters.length + 1}`,
      title: curTitle,
      html: curParas.map((p) => `<p>${escHtml(p)}</p>`).join('\n'),
      text: curParas.join('\n\n'),
    });
    curParas = [];
  };

  for (const b of blocks) {
    const isHeading =
      b.length < 85 &&
      (/^(chapter|capitolo|chapitre|kapitel|capítulo|part|parte)\s+[\divxlcdm]+/i.test(b) ||
        /^第[一二三四五六七八九十百千0-9]+[章节回話]/u.test(b));
    if (isHeading && curParas.length > 0) {
      flush();
      curTitle = b;
    } else {
      curParas.push(b);
      if (curParas.length >= 90) {
        flush();
        curTitle = `Section ${chapters.length + 1}`;
      }
    }
  }
  flush();

  if (chapters.length === 0) {
    chapters.push({
      id: 'ch_1',
      title: titleHint || 'Text',
      html: `<p>${escHtml(text.trim())}</p>`,
      text: text.trim(),
    });
  }

  const counts = countBookWords(chapters, lang);
  const now = Date.now();
  return {
    book: {
      id,
      lang,
      title: titleHint || 'Untitled Text',
      format,
      folderId: null,
      chapters,
      chapterIndex: 0,
      scrollRatio: 0,
      totalWords: counts.totalWords,
      uniqueWords: counts.uniqueWords,
      createdAt: now,
      updatedAt: now,
    },
  };
}

/**
 * Parses Subtitle files (.srt, .vtt, .ass) as readable books on the Shelf!
 */
export async function parseSubtitleAsBook(
  bytes: Uint8Array,
  fileName: string,
  lang: LangCode
): Promise<ParsedBookResult> {
  const raw = decodeSmartText(bytes);
  const id = await sha256Hex(bytes);
  const extMatch = fileName.toLowerCase().match(/\.(srt|vtt|ass)$/);
  const fmt = (extMatch ? extMatch[1] : 'srt') as 'srt' | 'vtt' | 'ass';
  const cues = parseSubtitleFile(raw, fmt);

  const lines = cues.map((c) => c.text.trim()).filter(Boolean);
  const html = cues
    .map((c) => {
      const mm = String(Math.floor(c.start / 60)).padStart(2, '0');
      const ss = String(Math.floor(c.start % 60)).padStart(2, '0');
      return `<p><small class="sub-ts">[${mm}:${ss}]</small> ${escHtml(c.text)}</p>`;
    })
    .join('\n');

  const chapters: BookChapter[] = [
    {
      id: 'sub_1',
      title: fileName.replace(/\.(srt|vtt|ass)$/i, ''),
      html,
      text: lines.join('\n'),
    },
  ];
  const counts = countBookWords(chapters, lang);
  const now = Date.now();
  return {
    book: {
      id,
      lang,
      title: fileName.replace(/\.(srt|vtt|ass)$/i, ''),
      format: fmt,
      folderId: null,
      chapters,
      chapterIndex: 0,
      scrollRatio: 0,
      totalWords: counts.totalWords,
      uniqueWords: counts.uniqueWords,
      createdAt: now,
      updatedAt: now,
    },
    rawBytes: bytes,
  };
}

/**
 * Parses CBZ comic archives or standalone images into visual chapters with editable/OCR notes.
 */
export async function parseComicOrImageBook(
  bytes: Uint8Array,
  fileName: string,
  lang: LangCode
): Promise<ParsedBookResult> {
  const id = await sha256Hex(bytes);
  const isCbz = /\.cbz$|\.zip$/i.test(fileName);
  const chapters: BookChapter[] = [];

  if (isCbz) {
    const files = unzipSync(bytes);
    const imgNames = Object.keys(files)
      .filter((k) => /\.(jpe?g|png|webp|gif)$/i.test(k) && !k.startsWith('__MACOSX'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    imgNames.forEach((name, idx) => {
      const dataUrl = `data:${guessMime(name)};base64,${uint8ToBase64(files[name])}`;
      chapters.push({
        id: `page_${idx + 1}`,
        title: `Page ${idx + 1}`,
        html: `<div class="comic-page"><img src="${dataUrl}" alt="Page ${idx + 1}" /></div>`,
        text: '',
      });
    });
  } else {
    const dataUrl = `data:${guessMime(fileName)};base64,${uint8ToBase64(bytes)}`;
    chapters.push({
      id: 'page_1',
      title: fileName.replace(/\.[^.]+$/, ''),
      html: `<div class="comic-page"><img src="${dataUrl}" alt="${escHtml(fileName)}" /></div>`,
      text: '',
    });
  }

  const now = Date.now();
  return {
    book: {
      id,
      lang,
      title: fileName.replace(/\.[^.]+$/, ''),
      format: isCbz ? 'cbz' : 'image',
      folderId: null,
      chapters,
      chapterIndex: 0,
      scrollRatio: 0,
      totalWords: 0,
      uniqueWords: 0,
      createdAt: now,
      updatedAt: now,
    },
    rawBytes: bytes,
  };
}

export async function parseAnyBookFile(file: File, lang: LangCode): Promise<ParsedBookResult> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.epub')) return parseEpubFile(bytes, file.name, lang);
  if (lower.endsWith('.pdf')) return parsePdfFile(bytes, file.name, lang);
  if (lower.endsWith('.srt') || lower.endsWith('.vtt') || lower.endsWith('.ass')) {
    return parseSubtitleAsBook(bytes, file.name, lang);
  }
  if (lower.endsWith('.cbz') || /\.(png|jpe?g|webp|gif)$/i.test(lower)) {
    return parseComicOrImageBook(bytes, file.name, lang);
  }
  return parsePlainTextBook(bytes, file.name.replace(/\.txt$/i, ''), lang, 'txt');
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
