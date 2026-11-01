import type { VerbaSettings } from '../shared/types';

function hexToRgbTuple(hex: string, fallback = '56 189 248'): string {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return `${r} ${g} ${b}`;
    }
  }
  return fallback;
}

function darkenHexRgb(hex: string, factor = 0.75): string {
  const parts = hexToRgbTuple(hex, '245 158 11').split(' ').map(Number);
  return parts.map((v) => Math.max(0, Math.round(v * factor))).join(' ');
}

export function buildPageHighlightStyles(settings: VerbaSettings): string {
  const s = settings.highlightStrength || 1.0;
  const newRgb = hexToRgbTuple(settings.colors.newWord, '56 189 248');
  const learnRgb = hexToRgbTuple(settings.colors.learning, '245 158 11');
  const learnLineRgb = darkenHexRgb(settings.colors.learning, 0.75);
  const crossRgb = hexToRgbTuple(settings.colors.crossScript, '16 185 129');
  const selRgb = hexToRgbTuple(settings.colors.selectedPhrase, '249 115 22');
  const selLineRgb = darkenHexRgb(settings.colors.selectedPhrase, 0.75);
  const specRgb = hexToRgbTuple(settings.colors.specialWord, '168 85 247');

  const hideColors = !settings.highlightWords;
  const ulOnly = settings.underlineInsteadOfFill;

  return `
verba-w {
  display: inline;
  border-radius: 3px;
  padding: 0 1px;
  margin: 0 -1px;
  cursor: pointer;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  transition: background-color 0.12s ease, box-shadow 0.12s ease;
  position: relative;
}
${
  hideColors
    ? `verba-w[data-s] { background-color: transparent !important; box-shadow: none !important; }`
    : ulOnly
    ? `
verba-w[data-s="0"] { box-shadow: inset 0 -2px 0 rgb(${newRgb} / ${Math.min(1, 0.65 * s).toFixed(2)}); }
verba-w[data-s="1"] { box-shadow: inset 0 -2.5px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.95 * s).toFixed(2)}); }
verba-w[data-s="2"] { box-shadow: inset 0 -2px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.75 * s).toFixed(2)}); }
verba-w[data-s="3"] { box-shadow: inset 0 -1.5px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.55 * s).toFixed(2)}); }
verba-w[data-s="4"] { box-shadow: inset 0 -1px 0 rgb(${learnLineRgb} / ${Math.min(1, 0.4 * s).toFixed(2)}); }
verba-w[data-s="green"] { box-shadow: inset 0 -2px 0 rgb(${crossRgb} / 0.75); }
verba-w[data-s="special"] { box-shadow: inset 0 -2px 0 rgb(${specRgb} / 0.6); }
`
    : `
verba-w[data-s="0"] { background-color: rgb(${newRgb} / ${Math.min(0.6, 0.20 * s).toFixed(2)}); }
verba-w[data-s="1"] { background-color: rgb(${learnRgb} / ${Math.min(0.9, 0.60 * s).toFixed(2)}); }
verba-w[data-s="2"] { background-color: rgb(${learnRgb} / ${Math.min(0.8, 0.40 * s).toFixed(2)}); }
verba-w[data-s="3"] { background-color: rgb(${learnRgb} / ${Math.min(0.6, 0.24 * s).toFixed(2)}); box-shadow: inset 0 -2px 0 rgb(${learnLineRgb}); }
verba-w[data-s="4"] { background-color: transparent; box-shadow: inset 0 -2px 0 rgb(${learnLineRgb}); }
verba-w[data-s="green"] { background-color: rgb(${crossRgb} / 0.26); }
verba-w[data-s="special"] { background-color: rgb(${specRgb} / 0.20); }
`
}
verba-w[data-s="5"], verba-w[data-s="-1"] {
  background-color: transparent;
  box-shadow: none;
}
verba-w[data-pinned="1"], verba-w:hover {
  outline: 1px solid rgb(56 189 248 / 0.55);
}
verba-w[data-selected="1"] {
  background-color: rgb(${selRgb} / 0.35) !important;
  box-shadow: inset 0 -2px 0 rgb(${selLineRgb}) !important;
}
verba-w[data-freq-ring="1"] {
  outline: 2px solid #eab308 !important;
  outline-offset: 2px;
  border-radius: 4px;
}
verba-w[data-speaking="1"] {
  background-color: rgb(56 189 248 / 0.38) !important;
  box-shadow: inset 0 -2px 0 #38bdf8 !important;
}
verba-w ruby.verba-ruby {
  ruby-position: over;
}
verba-w ruby.verba-ruby > rt {
  font-size: 0.58em;
  line-height: 1.1;
  color: inherit;
  opacity: 0.78;
  font-weight: 400;
  user-select: none;
}
[data-verba-reading-sentence="1"] {
  text-decoration: underline;
  text-decoration-color: #38bdf8;
  text-underline-offset: 4px;
}
`;
}

export const SHADOW_UI_CSS = `
:host {
  all: initial;
  --bg: #0f172a;
  --surface-1: #162032;
  --surface-2: #1e293b;
  --field: #0b1120;
  --fill-hover: rgb(241 245 249 / .07);
  --fill-selected: rgb(241 245 249 / .11);
  --fill-press: rgb(241 245 249 / .15);
  --control-thumb: #475569;
  --ink: #f1f5f9;
  --body: #cbd5e1;
  --ink-2: #94a3b8;
  --ink-3: #64748b;
  --border-subtle: rgb(255 255 255 / .08);
  --border: #334155;
  --border-control: #475569;
  --primary: #38bdf8;
  --primary-hover: #7dd3fc;
  --on-primary: #082f49;
  --focus: #38bdf8;
  --blue: #38bdf8;
  --amber: #f59e0b;
  --green: #10b981;
  --red: #f43f5e;
  --serif: "Iowan Old Style", "Charter", Georgia, serif;
  --sans: system-ui, -apple-system, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace;
  font-family: var(--sans);
  color: var(--body);
}

*, *::before, *::after {
  box-sizing: border-box;
}

kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border: 1px solid var(--border);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--ink);
  font: 500 11px/1 var(--mono);
}

button {
  font-family: var(--sans);
  cursor: pointer;
}

/* Counter Island (bottom-right pill) */
.verba-island {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483640;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgb(22 32 50 / .95);
  border: 1px solid var(--border);
  box-shadow: 0 12px 32px rgb(0 0 0 / .45);
  color: var(--body);
  font-size: 12.5px;
  backdrop-filter: blur(10px);
  user-select: none;
}
.verba-island[hidden] { display: none !important; }
.island-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
  padding: 0 7px;
  border: 0;
  border-radius: 999px;
  background: var(--fill-selected);
  color: var(--ink);
  font-size: 12px;
  font-weight: 500;
  transition: background 0.12s;
}
.island-btn:hover { background: var(--fill-press); }
.island-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.island-dot.new { background: #3b82f6; }
.island-dot.learn { background: #f7a800; }
.island-stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}
.island-stat b { color: var(--ink); font-weight: 600; }

.island-tally-drawer {
  position: fixed;
  right: 16px;
  bottom: 60px;
  z-index: 2147483640;
  width: 260px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 18px 40px rgb(0 0 0 / .55);
  color: var(--body);
  font-size: 13px;
}
.island-tally-drawer[hidden] { display: none !important; }
.tally-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: var(--ink-2);
}
.tally-row b { color: var(--ink); }

.auto-switch-note {
  position: fixed;
  right: 16px;
  bottom: 58px;
  z-index: 2147483641;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border-radius: 8px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 10px 28px rgb(0 0 0 / .45);
  font-size: 12.5px;
  color: var(--ink-2);
}

/* Word Panel (Hover & Pinned) */
.verba-panel {
  position: fixed;
  z-index: 2147483645;
  width: 356px;
  max-width: calc(100vw - 20px);
  max-height: min(520px, calc(100vh - 24px));
  overflow-y: auto;
  border-radius: 12px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 0 0 1px rgb(255 255 255 / .08), 0 24px 48px rgb(0 0 0 / .65);
  color: var(--body);
  padding: 13px 15px;
  font-size: 14px;
  line-height: 1.5;
}
.verba-panel[hidden] { display: none !important; }
.verba-panel[data-size="S"] { width: 300px; font-size: 12.5px; padding: 10px 12px; }
.verba-panel[data-size="L"] { width: 410px; font-size: 15.5px; padding: 15px 18px; }
.verba-panel[data-size="XL"] { width: 470px; font-size: 17px; padding: 18px 20px; }

.wp-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.wp-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 7px;
}
.wp-word {
  font-family: var(--serif);
  font-size: 1.45em;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.15;
}
.wp-word[data-gender="m"] { color: #60a5fa; } /* German der = blue */
.wp-word[data-gender="f"] { color: #f87171; } /* German die = red */
.wp-word[data-gender="n"] { color: #4ade80; } /* German das = green */

.wp-alt {
  font-size: 1.05em;
  color: var(--ink-3);
}
.wp-badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--fill-selected);
  color: var(--ink-2);
}
.wp-badge[data-s="0"] { background: rgb(59 130 246 / .22); color: #93c5fd; }
.wp-badge[data-s="1"], .wp-badge[data-s="2"], .wp-badge[data-s="3"], .wp-badge[data-s="4"] {
  background: rgb(247 168 0 / .24);
  color: #fcd34d;
}
.wp-badge[data-s="5"] { background: rgb(34 197 94 / .2); color: #86efac; }

.wp-actions {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}
.wp-icon-btn {
  display: inline-grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ink-2);
  font-size: 13px;
  transition: background 0.12s, color 0.12s;
}
.wp-icon-btn:hover, .wp-icon-btn[aria-expanded="true"] {
  background: var(--fill-selected);
  color: var(--ink);
}

.wp-sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.9em;
  color: var(--ink-2);
}
.wp-pitch {
  font-family: var(--mono);
  font-size: 0.82em;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--ink-2);
}
.wp-rank {
  color: var(--ink-3);
  font-size: 0.85em;
}

.wp-tabs {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 6px;
}
.wp-tab {
  height: 25px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ink-3);
  font-size: 12px;
  font-weight: 500;
}
.wp-tab[aria-selected="true"] {
  background: var(--fill-selected);
  color: var(--ink);
}

.wp-meanings {
  margin: 9px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 5px;
}
.wp-meaning-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: var(--body);
}
.wp-tag {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}
.wp-tag.yours { background: rgb(59 130 246 / .22); color: #93c5fd; }
.wp-tag.ai { background: rgb(168 85 247 / .24); color: #d8b4fe; }

.wp-pager {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  font-size: 12px;
  color: var(--ink-3);
}
.wp-section {
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
  font-size: 12.5px;
}
.wp-section-title {
  font-weight: 600;
  color: var(--ink-3);
  font-size: 11.5px;
  margin-bottom: 4px;
}

.wp-custom-box {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}
.wp-input {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 0 9px;
  border: 1px solid var(--border-control);
  border-radius: 6px;
  background: var(--field);
  color: var(--ink);
  font: 400 13px var(--sans);
}
.wp-input:focus {
  outline: 2px solid var(--focus);
  outline-offset: -1px;
}
.wp-btn-sm {
  height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 12.5px;
  font-weight: 600;
}
.wp-btn-ghost {
  height: 28px;
  padding: 0 9px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--ink);
  font-size: 12px;
}
.wp-btn-ghost:hover { background: var(--fill-press); }

.wp-grades {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 4px;
  margin-top: 11px;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
}
.wp-grade-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 11.5px;
  font-weight: 600;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.wp-grade-btn:hover {
  background: var(--fill-press);
  color: var(--ink);
}
.wp-grade-btn[aria-pressed="true"] {
  border-color: var(--focus);
  background: rgb(107 155 255 / .18);
  color: var(--ink);
}
.wp-swatch {
  width: 14px;
  height: 4px;
  border-radius: 2px;
}
.wp-swatch.s1 { background: rgb(247 168 0 / .95); }
.wp-swatch.s2 { background: rgb(247 168 0 / .65); }
.wp-swatch.s3 { background: rgb(247 168 0 / .38); border-bottom: 1.5px solid #b97e00; }
.wp-swatch.s4 { border-bottom: 2px solid #b97e00; }
.wp-swatch.sk { background: #22c55e; }
.wp-swatch.sx { background: #7c7b74; }

.wp-hint-foot {
  margin-top: 7px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: var(--ink-3);
}

/* Reader View Overlay (Shift+L) */
.verba-reader-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483635;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  color: #e2e8f0;
  overflow: hidden;
}
.verba-reader-overlay[hidden] { display: none !important; }
.verba-reader-overlay[data-paper="white"] { background: #ffffff; color: #0f172a; }
.verba-reader-overlay[data-paper="sepia"] { background: #fbf5e6; color: #2b251c; }

.reader-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 50px;
  padding: 0 18px;
  border-bottom: 1px solid rgb(128 128 128 / .2);
  background: inherit;
  flex-shrink: 0;
}
.reader-bar-title {
  font: 600 16px/1 var(--sans);
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.reader-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 40px 24px 100px;
}
.reader-article {
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.78;
}
.reader-article h1 {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 2.1em;
  line-height: 1.15;
  margin: 0 0 24px;
}
.reader-article p { margin: 0 0 1.2em; }
.reader-article img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }

/* Sentence-by-Sentence Card (Shift+S) */
.verba-sentence-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483638;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / .92);
  backdrop-filter: blur(8px);
  padding: 24px;
}
.verba-sentence-modal[hidden] { display: none !important; }
.sentence-card {
  width: min(780px, 100%);
  padding: 36px 40px 28px;
  border-radius: 16px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 24px 64px rgb(0 0 0 / .7);
  color: var(--ink);
}
.sentence-card[data-paper="white"] { background: #ffffff; color: #0f172a; border-color: #d4d4d8; }
.sentence-card[data-paper="sepia"] { background: #fbf5e6; color: #2b251c; border-color: #e4d5b7; }
.sentence-body {
  font-size: 28px;
  line-height: 1.6;
  margin: 18px 0;
  min-height: 90px;
}
.sentence-trans {
  font-size: 17px;
  color: var(--ink-2);
  padding-top: 14px;
  border-top: 1px solid rgb(128 128 128 / .2);
  margin-bottom: 16px;
}
.sentence-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  font-size: 13px;
  color: var(--ink-3);
}

/* Read Aloud Floating Bar (Shift+R) */
.verba-tts-bar {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 2147483642;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 16px 40px rgb(0 0 0 / .6);
  color: var(--ink);
  font-size: 13px;
}
.verba-tts-bar[hidden] { display: none !important; }

/* Ask Your AI Chat Modal (Shift+I) */
.verba-ask-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / .62);
  padding: 20px;
}
.verba-ask-modal[hidden] { display: none !important; }
.ask-box {
  width: min(520px, 100%);
  padding: 22px 24px;
  border-radius: 12px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 24px 48px rgb(0 0 0 / .7);
  color: var(--body);
}
.ask-quote {
  padding: 10px 12px;
  border-left: 2px solid var(--blue);
  background: var(--surface-2);
  border-radius: 4px;
  font-size: 14px;
  color: var(--ink);
  margin: 10px 0 14px;
}
.ask-textarea {
  width: 100%;
  min-height: 76px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-control);
  background: var(--field);
  color: var(--ink);
  font: 400 14px/1.45 var(--sans);
  resize: vertical;
}

/* Verba Dual Captions & Transcript */
.vc-stage {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483630;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: min(88vw, 920px);
  pointer-events: auto;
}
.vc-stage[hidden] { display: none !important; }
.vc-box {
  padding: 10px 18px;
  border-radius: 10px;
  text-align: center;
  color: #f1f5f9;
  box-shadow: 0 8px 28px rgb(0 0 0 / .5);
}
.vc-line {
  font-size: 24px;
  line-height: 1.42;
  font-weight: 500;
}
.vc-line[data-size="S"] { font-size: 18px; }
.vc-line[data-size="L"] { font-size: 30px; }
.vc-line[data-size="XL"] { font-size: 36px; }
.vc-line.blurred { filter: blur(6px); transition: filter 0.15s; }
.vc-line.blurred:hover { filter: none; }

.vc-trans {
  margin-top: 5px;
  font-size: 16px;
  color: #cbd5e1;
  transition: filter 0.15s;
}
.vc-trans[data-size="S"] { font-size: 13px; }
.vc-trans[data-size="L"] { font-size: 20px; }
.vc-trans[data-size="XL"] { font-size: 24px; }
.vc-trans.blurred { filter: blur(5px); cursor: pointer; }
.vc-trans.blurred:hover { filter: none; }

.vc-side-btns {
  display: flex;
  flex-direction: column;
  gap: 3px;
  opacity: 0.35;
  transition: opacity 0.15s;
}
.vc-stage:hover .vc-side-btns { opacity: 1; }
.vc-mini-btn {
  width: 26px;
  height: 24px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: rgb(15 23 42 / .9);
  color: var(--ink);
  font-size: 11px;
  display: grid;
  place-items: center;
}

.vc-pill {
  position: fixed;
  z-index: 2147483632;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgb(22 32 50 / .92);
  border: 1px solid var(--border);
  color: var(--ink);
  font-size: 12px;
  box-shadow: 0 6px 20px rgb(0 0 0 / .45);
}
.vc-pill[hidden] { display: none !important; }

.vc-menu {
  position: fixed;
  z-index: 2147483644;
  width: 310px;
  max-height: 440px;
  overflow-y: auto;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: 0 20px 48px rgb(0 0 0 / .7);
  color: var(--body);
  font-size: 13px;
}
.vc-menu[hidden] { display: none !important; }
.cc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 4px;
  border-bottom: 1px solid var(--border-subtle);
}
.cc-row:last-child { border-bottom: 0; }

.vc-drawer {
  position: fixed;
  top: 64px;
  right: 16px;
  width: 340px;
  max-height: calc(100vh - 140px);
  z-index: 2147483633;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: rgb(22 32 50 / .96);
  border: 1px solid var(--border);
  box-shadow: 0 20px 48px rgb(0 0 0 / .65);
  color: var(--body);
  overflow: hidden;
}
.vc-drawer[hidden] { display: none !important; }
.cc-drawer-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-subtle);
}
.cc-drawer-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.cc-cue-item {
  display: flex;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13.5px;
}
.cc-cue-item:hover { background: var(--fill-hover); }
.cc-cue-item.active { background: rgb(56 189 248 / .18); border-left: 2px solid #38bdf8; }
.cc-cue-time {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-3);
  padding-top: 2px;
  flex-shrink: 0;
}
.vc-toast {
  position: fixed;
  z-index: 2147483644;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgb(22 32 50 / .92);
  border: 1px solid var(--border);
  color: var(--ink);
  font-size: 12px;
  pointer-events: none;
}
.vc-toast[hidden] {
  display: none !important;
}
`;
