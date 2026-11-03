# Verba — Immersion Reader, Adaptive Placement & Dual Captions

**Verba** is a local-first, cross-browser **Manifest V3 WebExtension** for **Chrome / Brave / Edge / Chromium** and **Firefox (`121+`)** that turns web articles, EPUB/PDF/MOBI books, and streaming or local videos into an interactive language-learning environment across **24 languages**.

---

## Quick Install (No Build Required)

Pre-built bundles and all 24 offline dictionaries are included directly in this repository, so you can load the extension immediately without installing Node.js.

### 1. Download the Extension
Clone the repository or download the ZIP archive from GitHub:
```bash
git clone https://github.com/WordsGPT/testextension.git
cd testextension
```
*(Or click **Code → Download ZIP** on GitHub and extract the folder anywhere on your computer.)*

### 2A. Install in Chrome / Brave / Edge / Chromium
1. Open `chrome://extensions` (or `brave://extensions` / `edge://extensions`) in your browser.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** (top-left) and select the `testextension` folder you cloned or extracted.
4. Pin **Verba** from your browser's extensions toolbar puzzle icon.

### 2B. Install in Firefox (`109+` / Developer Edition / Nightly)
> [!IMPORTANT]
> Do **not** use `about:addons` (*"Install Add-on From File…"*) and do **not** pass GitHub's `testextension-main.zip` directly into Firefox—GitHub wraps the repository inside a `testextension-main/` subfolder, and `about:addons` requires a Mozilla-signed `.xpi`, both of which cause Firefox to show **"This add-on could not be installed because it appears to be corrupt."**

Instead, load it via **`about:debugging`**:
1. Open **`about:debugging#/runtime/this-firefox`** in your Firefox address bar.
2. Click **Load Temporary Add-on…**.
3. Select **either**:
   - `manifest.json` inside your unzipped `testextension` folder, **or**
   - `dist/verba-firefox.zip` ([Direct Download Link](https://raw.githubusercontent.com/WordsGPT/testextension/main/dist/verba-firefox.zip)).

---

## Key Features

1. **24 Languages & Bundled Offline Dictionaries**
   - Italian, Spanish, French, German, Portuguese, Dutch, Swedish, Norwegian, Danish, Finnish, Polish, Russian, Ukrainian, Greek, Turkish, Arabic, Mandarin Chinese (Simplified & Traditional), Cantonese, Japanese, Korean, Vietnamese, Thai, Indonesian, and English.
   - Word segmentation for spaceless scripts (Japanese, Chinese, Thai) via `Intl.Segmenter` + dictionary longest-prefix matching.
   - Automatic Furigana, Pinyin, Jyutping, Korean romanization, and character decomposition breakdowns.

2. **Adaptive CEFR Placement Test (`A0` → `C2`)**
   - 12-question computer-adaptive staircase assessment across 6 CEFR frequency bands (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`) for all 24 languages.
   - Mixes **Word → Meaning** and **Meaning → Word** questions with 4 choices + an `"I'm not sure yet"` option (`Space` / `0`).
   - Reports diagnosed CEFR level (`A0`–`C2`), estimated passive vocabulary size, per-band accuracy breakdown, and **1-Click Vocabulary Calibration** (with 1-click Undo).

3. **Web Highlighting, Inline Word Replacement ("Diglot Weave"), Reader View & Sentence Mode**
   - Highlights target-language words using `<verba-w>` custom elements with customizable styles.
   - **Inline Word Replacement / Diglot Weave (`Shift+W`)**: Grounded in *Trusty & Truong (ACM CHI 2011)* and *VocabEncounter (ACM CHI 2022)*, passively weaves target-language content words (prioritizing active Learning `1–4` and $i+1$ vocabulary) directly into English/native-language web pages you browse daily, with hover/click Word Panel lookup, optional inline L1 hints, and 1-click single-word or full-page revert.
   - **Reader View (`Shift+L`)**: Distraction-free reading with Dark, Sepia, and White paper themes, typography controls, and automatic saving to your Bookshelf.
   - **Sentence-by-Sentence (`Shift+S`)**: Step through articles or books one sentence at a time with instant translation and TTS audio.
   - **Read Aloud (`Shift+R`)**: Synchronized sentence-by-sentence speech synthesis.

4. **Dual Captions & Local Video Player**
   - Works on YouTube, Netflix, and HTML5 videos, plus the built-in local video player (`video.html`) with drag-and-drop `.srt` / `.vtt` / `.ass` support.
   - Independent target/translation blur modes (`E` to peek), auto-pause after each line (`Q`), line stepping (`A` / `S` / `D`), and a live transcript & vocabulary drawer (`W`).

5. **Two-Way AnkiConnect, E2EE Backups & Vocabulary Importers**
   - Two-way AnkiConnect integration (`127.0.0.1:8765`), PBKDF2-SHA256 / AES-256-GCM encrypted backup bundles, and importers for LingQ, Language Reactor, HanziHero, Yomitan, and CSV/TSV word lists.

---

## Keyboard Shortcuts

| Action | Default Shortcut |
| :--- | :--- |
| Grade word `1`–`4` / `Known` / `Ignore` / `New` | `1` `2` `3` `4` / `K` / `X` / `0` |
| Open Reader View | `Shift+L` |
| Sentence-by-Sentence Mode | `Shift+S` |
| Read Aloud (TTS) | `Shift+R` |
| Toggle Page Highlights | `Shift+H` |
| Toggle Inline Word Replacement (Diglot Weave) | `Shift+W` |
| Mark All Page Blue Words Known | `Shift+K` |
| Video: Previous / Replay / Next Subtitle Line | `A` / `S` / `D` |
| Video: Peek Blurred Subtitle / Translation | `E` |
| Video: Toggle Auto-Pause After Each Line | `Q` |
| Video: Open Transcript & Video Words Drawer | `W` |

---

## Building from Source (Mozilla AMO Reviewer Instructions)

### Environment Requirements
- **OS**: Linux, macOS, or Windows
- **Node.js**: `v20.x` or `v22.x` LTS (includes `npm`)

### Step-by-Step Build Reproduction
```bash
npm ci
npm run build
```

Running `npm run build` executes:
1. `npm run build:icons` (`node scripts/build-icons.mjs`) — generates PNG/SVG icons in `icons/`
2. `npm run build:dicts` (`node scripts/build-dictionaries.mjs`) — generates offline dictionaries in `dictionaries/` and sample reading/subtitle files in `samples/`
3. `npm run build:js` (`node scripts/build.mjs`) — compiles TypeScript (`src/**/*.ts`) via `esbuild` into `dist/*.js` and copies `dist/pdf.worker.min.mjs`
4. `npm run package:firefox` (`node scripts/package-firefox.mjs`) — packages the reproducible Firefox add-on archive at `dist/verba-firefox.zip`

### Running Tests
```bash
npm run typecheck
npm run test:unit
npm run test:e2e
```
