import type { CefrBand, LangCode, PlacementAssessment, VerbaSettings, WordRecord } from '../shared/types';
import { LANGUAGES, LANG_MAP } from '../shared/languages';
import type { LoadedLangIndex } from '../shared/dictionary';
import {
  CEFR_BANDS,
  CEFR_META,
  type PlacementSession,
  buildPlacementCalibrationWords,
  createPlacementSession,
  finalizePlacementSession,
  submitPlacementAnswer,
} from '../shared/placement';
import {
  getAssessmentsByLang,
  getWordsByLang,
  putAssessment,
  putWordRecordsBatch,
} from '../shared/db';
import { sendBgMessage } from '../shared/messaging';
import { speakText } from '../shared/tts';
import { setHtmlContent } from '../shared/dom';

export interface PlacementViewContext {
  settings: VerbaSettings;
  dictIndex: LoadedLangIndex;
  words: WordRecord[];
  onSwitchLanguage: (lang: LangCode) => Promise<void>;
  onRefreshData: () => Promise<void>;
  onNotify: (msg: string) => void;
}

interface CalibrationSnapshot {
  assessmentId: string;
  lang: LangCode;
  previousRecords: Map<string, WordRecord | null>;
  touchedWords: string[];
}

export class PlacementViewController {
  private session: PlacementSession | null = null;
  private latestResult: PlacementAssessment | null = null;
  private lastFeedback: {
    wasCorrect: boolean;
    unsure: boolean;
    word: string;
    meaning: string;
  } | null = null;
  private undoSnapshot: CalibrationSnapshot | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  public render(container: HTMLElement, ctx: PlacementViewContext): void {
    this.unbindKeys();
    const lang = ctx.settings.activeLang;
    const langMeta = LANG_MAP[lang];
    const langName = langMeta?.name || lang;

    if (this.session && this.session.activeQuestion) {
      this.renderActiveQuiz(container, ctx);
      return;
    }

    getAssessmentsByLang(lang).then((history) => {
      const displayAssessment =
        this.latestResult && this.latestResult.lang === lang
          ? this.latestResult
          : history[0] ?? null;

      const knownCount = ctx.words.filter((w) => !w.deleted && w.status === 5).length;
      const learningCount = ctx.words.filter(
        (w) => !w.deleted && w.status >= 1 && w.status <= 4
      ).length;

      setHtmlContent(
        container,
        `
        <div class="pl-wrap">
          <div class="card pl-hero-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
              <div>
                <div class="pl-eyebrow">ADAPTIVE DIAGNOSTIC · ALL 24 LANGUAGES</div>
                <h1 class="page-heading" style="margin:4px 0 8px;font-size:26px;">
                  ${esc(langName)} Vocabulary &amp; CEFR Placement Test
                </h1>
                <p style="margin:0;color:var(--ink-2);max-width:680px;font-size:13.5px;line-height:1.55;">
                  An adaptive 12-question staircase assessment across CEFR bands <b>A1 → C2</b>.
                  Verba estimates your passive vocabulary size, identifies your comprehension frontier,
                  and can calibrate your known vocabulary in one click so only unfamiliar words at your edge stay highlighted.
                </p>
              </div>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <select id="pl-lang-select" class="select" aria-label="Placement test language">
                  ${LANGUAGES.map(
                    (l) =>
                      `<option value="${l.code}" ${
                        l.code === lang ? 'selected' : ''
                      }>${esc(l.name)} (${esc(l.nativeName)})</option>`
                  ).join('')}
                </select>
                <button type="button" class="btn btn-primary" id="pl-start-btn" style="padding:9px 18px;font-size:13.5px;">
                  ${displayAssessment ? '↻ Retake Placement Test' : '▶ Start Placement Test'}
                </button>
              </div>
            </div>

            <div class="pl-band-strip">
              ${CEFR_BANDS.map((band) => {
                const info = CEFR_META[band];
                return `
                  <div class="pl-band-pill">
                    <span class="pl-band-code">${band}</span>
                    <span class="pl-band-desc">${esc(info.title)}</span>
                    <span class="pl-band-range">~${info.approxVocab.toLocaleString()} words</span>
                  </div>`;
              }).join('')}
            </div>
          </div>

          ${
            displayAssessment
              ? this.renderResultMarkup(displayAssessment, knownCount, learningCount)
              : `
            <div class="card" style="text-align:center;padding:36px 24px;">
              <div style="font-size:36px;margin-bottom:10px;">🎯</div>
              <h2 class="card-title" style="margin:0 0 8px;">No Placement Assessment Yet for ${esc(langName)}</h2>
              <p style="margin:0 auto 18px;max-width:520px;color:var(--ink-2);font-size:13.5px;">
                Take a quick 90-second adaptive test (12 questions) to benchmark your ${esc(langName)} level
                and automatically pre-mark foundational vocabulary you already know.
              </p>
              <button type="button" class="btn btn-primary" id="pl-start-empty-btn" style="padding:9px 20px;">
                ▶ Begin 12-Question Adaptive Test
              </button>
            </div>
          `
          }

          ${
            history.length > 0
              ? `
            <div class="card">
              <h2 class="card-title">Assessment History (${esc(langName)})</h2>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>CEFR Level</th>
                    <th>Est. Vocabulary</th>
                    <th>Frontier Rank</th>
                    <th>Accuracy</th>
                    <th>Confidence</th>
                    <th>Calibrated</th>
                  </tr>
                </thead>
                <tbody>
                  ${history
                    .map((h) => {
                      const totalAns = Object.values(h.bandScores).reduce((s, b) => s + b.total, 0);
                      const totalCor = Object.values(h.bandScores).reduce((s, b) => s + b.correct, 0);
                      return `
                      <tr>
                        <td>${new Date(h.completedAt).toLocaleString()}</td>
                        <td><span class="pl-cefr-chip" data-level="${h.cefrLevel}">${h.cefrLevel} · ${esc(h.cefrTitle)}</span></td>
                        <td>~${h.estimatedVocab.toLocaleString()} words</td>
                        <td>${h.recommendedRankFrontier > 0 ? `Top ${h.recommendedRankFrontier.toLocaleString()}` : 'Start fresh'}</td>
                        <td>${totalCor} / ${totalAns}</td>
                        <td>${h.confidencePct}%</td>
                        <td>${h.appliedCalibration ? '✓ Applied' : '—'}</td>
                      </tr>`;
                    })
                    .join('')}
                </tbody>
              </table>
            </div>`
              : ''
          }
        </div>
      `
      );

      container.querySelector<HTMLSelectElement>('#pl-lang-select')?.addEventListener('change', async (e) => {
        const nextLang = (e.target as HTMLSelectElement).value as LangCode;
        this.session = null;
        this.latestResult = null;
        await ctx.onSwitchLanguage(nextLang);
      });

      const startQuiz = () => {
        this.lastFeedback = null;
        this.session = createPlacementSession(ctx.dictIndex, { totalQuestions: 12 });
        this.render(container, ctx);
      };

      container.querySelector('#pl-start-btn')?.addEventListener('click', startQuiz);
      container.querySelector('#pl-start-empty-btn')?.addEventListener('click', startQuiz);

      if (displayAssessment) {
        this.bindResultEvents(container, ctx, displayAssessment);
      }
    });
  }

  private renderResultMarkup(
    res: PlacementAssessment,
    currentKnown: number,
    currentLearning: number
  ): string {
    const info = CEFR_META[res.cefrLevel] || CEFR_META.A0;
    const canUndo = Boolean(this.undoSnapshot && this.undoSnapshot.assessmentId === res.id);
    const totalAnswered = Object.values(res.bandScores).reduce((s, b) => s + b.total, 0);
    const totalCorrect = Object.values(res.bandScores).reduce((s, b) => s + b.correct, 0);

    return `
      <div class="card pl-result-card" id="pl-result-card">
        <div class="pl-result-grid">
          <div class="pl-level-box">
            <div class="pl-cefr-badge" id="pl-cefr-badge" data-level="${res.cefrLevel}">${res.cefrLevel}</div>
            <div>
              <div style="font-size:11.5px;color:var(--ink-3);text-transform:uppercase;font-weight:700;letter-spacing:0.05em;">
                Diagnosed Proficiency
              </div>
              <div style="font-size:20px;font-weight:700;color:var(--ink);margin-top:2px;">
                ${esc(res.cefrTitle || info.title)}
              </div>
              <div style="font-size:13px;color:var(--ink-2);margin-top:4px;line-height:1.45;">
                ${esc(info.summary)}
              </div>
            </div>
          </div>

          <div class="pl-metrics-row">
            <div class="pl-metric">
              <div class="pl-metric-val">~${res.estimatedVocab.toLocaleString()}</div>
              <div class="pl-metric-lbl">Estimated Vocabulary</div>
            </div>
            <div class="pl-metric">
              <div class="pl-metric-val">${
                res.recommendedRankFrontier > 0
                  ? `Top ${res.recommendedRankFrontier.toLocaleString()}`
                  : 'Start Fresh'
              }</div>
              <div class="pl-metric-lbl">Recommended Frontier</div>
            </div>
            <div class="pl-metric">
              <div class="pl-metric-val">${totalCorrect}/${totalAnswered}</div>
              <div class="pl-metric-lbl">Correct (${res.confidencePct}% conf.)</div>
            </div>
          </div>
        </div>

        <div class="pl-calibration-banner">
          <div>
            <strong style="color:var(--ink);font-size:14.5px;">
              1-Click Vocabulary Calibration
            </strong>
            <div style="font-size:12.5px;color:var(--ink-2);margin-top:3px;">
              ${
                res.recommendedRankFrontier > 0
                  ? `Mark top <b>${res.recommendedRankFrontier.toLocaleString()}</b> high-frequency words + your <b>${res.correctWords.length}</b> verified words as <b>Known</b>, and add <b>${res.missedWords.length}</b> missed test words to <b>Learning (Stage 1)</b>.`
                  : `Mark your <b>${res.correctWords.length}</b> verified words as <b>Known</b> and add <b>${res.missedWords.length}</b> missed words to <b>Learning (Stage 1)</b>.`
              }
              <span style="color:var(--ink-3);"> (Current profile: ${currentKnown.toLocaleString()} Known · ${currentLearning} Learning)</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;flex-wrap:wrap;">
            ${
              canUndo
                ? `<button type="button" class="btn btn-amber" id="pl-undo-calibration">↶ Undo Calibration</button>`
                : ''
            }
            <button type="button" class="btn btn-primary" id="pl-apply-calibration">
              ${res.appliedCalibration ? '✓ Re-Apply Calibration' : '⚡ Calibrate My Vocabulary'}
            </button>
          </div>
        </div>

        <div id="pl-calibration-msg" style="font-size:13px;color:var(--green);margin-top:8px;" hidden></div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:18px;">
          <div>
            <h3 style="margin:0 0 10px;font-size:12.5px;color:var(--ink-2);text-transform:uppercase;letter-spacing:0.04em;">
              Accuracy by CEFR Band
            </h3>
            <div class="pl-bars">
              ${CEFR_BANDS.map((band: CefrBand) => {
                const stat = res.bandScores[band] ?? { correct: 0, total: 0 };
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                return `
                  <div class="pl-bar-row">
                    <span class="pl-bar-band">${band}</span>
                    <div class="pl-bar-track">
                      <div class="pl-bar-fill" style="width:${pct}%;background:${
                  stat.total === 0 ? 'transparent' : pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--amber)' : 'var(--danger)'
                }"></div>
                    </div>
                    <span class="pl-bar-stat">${
                      stat.total > 0 ? `${stat.correct}/${stat.total} (${pct}%)` : 'Not sampled'
                    }</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div>
            <h3 style="margin:0 0 10px;font-size:12.5px;color:var(--ink-2);text-transform:uppercase;letter-spacing:0.04em;">
              Sampled Words Breakdown
            </h3>
            <div style="margin-bottom:10px;">
              <div style="font-size:12px;color:var(--green);font-weight:600;margin-bottom:4px;">
                ✓ Verified Known (${res.correctWords.length})
              </div>
              <div class="pl-word-chips">
                ${
                  res.correctWords.length > 0
                    ? res.correctWords.map((w) => `<span class="w-chip" data-s="5">${esc(w)}</span>`).join('')
                    : '<span style="color:var(--ink-3);font-size:12.5px;">None</span>'
                }
              </div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--amber);font-weight:600;margin-bottom:4px;">
                ✦ Frontier / To Learn (${res.missedWords.length})
              </div>
              <div class="pl-word-chips">
                ${
                  res.missedWords.length > 0
                    ? res.missedWords.map((w) => `<span class="w-chip" data-s="1">${esc(w)}</span>`).join('')
                    : '<span style="color:var(--ink-3);font-size:12.5px;">None — 100% score!</span>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private bindResultEvents(
    container: HTMLElement,
    ctx: PlacementViewContext,
    assessment: PlacementAssessment
  ): void {
    container.querySelector('#pl-apply-calibration')?.addEventListener('click', async () => {
      const lang = ctx.settings.activeLang;
      const { knownWords, learningWords } = buildPlacementCalibrationWords(
        assessment,
        ctx.dictIndex
      );
      const existingWords = await getWordsByLang(lang);
      const existingMap = new Map<string, WordRecord>();
      for (const w of existingWords) existingMap.set(w.word, w);

      const previousRecords = new Map<string, WordRecord | null>();
      const touchedWords: string[] = [];
      const now = Date.now();
      const batch: WordRecord[] = [];

      for (const word of knownWords) {
        if (!word) continue;
        const prev = existingMap.get(word) ?? null;
        if (!previousRecords.has(word)) {
          previousRecords.set(word, prev ? { ...prev } : null);
          touchedWords.push(word);
        }
        batch.push({
          id: `${lang}:${word}`,
          lang,
          word,
          status: 5,
          isPhrase: false,
          isCustomSegment: prev?.isCustomSegment ?? false,
          lookupCount: prev?.lookupCount ?? 0,
          source: 'bulk',
          ...(prev?.customMeaning ? { customMeaning: prev.customMeaning } : {}),
          ...(prev?.reading ? { reading: prev.reading } : {}),
          deleted: false,
          createdAt: prev?.createdAt ?? now,
          updatedAt: now,
        });
      }

      for (const word of learningWords) {
        if (!word) continue;
        const prev = existingMap.get(word) ?? null;
        if (prev?.status === 5) continue; // Do not downgrade already-known words
        if (!previousRecords.has(word)) {
          previousRecords.set(word, prev ? { ...prev } : null);
          touchedWords.push(word);
        }
        batch.push({
          id: `${lang}:${word}`,
          lang,
          word,
          status: 1,
          isPhrase: false,
          isCustomSegment: prev?.isCustomSegment ?? false,
          lookupCount: prev?.lookupCount ?? 0,
          source: 'bulk',
          ...(prev?.customMeaning ? { customMeaning: prev.customMeaning } : {}),
          ...(prev?.reading ? { reading: prev.reading } : {}),
          deleted: false,
          createdAt: prev?.createdAt ?? now,
          updatedAt: now,
        });
      }

      await putWordRecordsBatch(batch);
      assessment.appliedCalibration = true;
      await putAssessment(assessment);
      this.latestResult = assessment;
      this.undoSnapshot = {
        assessmentId: assessment.id,
        lang,
        previousRecords,
        touchedWords,
      };

      sendBgMessage({ type: 'BROADCAST_WORDS_REFRESH', lang }).catch(() => {});
      await ctx.onRefreshData();
      ctx.onNotify(
        `Calibrated ${knownWords.length.toLocaleString()} words as Known and ${learningWords.length} frontier words as Learning!`
      );
    });

    container.querySelector('#pl-undo-calibration')?.addEventListener('click', async () => {
      if (!this.undoSnapshot) return;
      const snap = this.undoSnapshot;
      const now = Date.now();
      const restoreBatch: WordRecord[] = [];
      for (const word of snap.touchedWords) {
        const prev = snap.previousRecords.get(word);
        if (prev) {
          restoreBatch.push({ ...prev, updatedAt: now });
        } else {
          restoreBatch.push({
            id: `${snap.lang}:${word}`,
            lang: snap.lang,
            word,
            status: 0,
            isPhrase: false,
            isCustomSegment: false,
            lookupCount: 0,
            source: 'bulk',
            deleted: true,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
      if (restoreBatch.length > 0) {
        await putWordRecordsBatch(restoreBatch);
      }
      assessment.appliedCalibration = false;
      await putAssessment(assessment);
      this.latestResult = assessment;
      this.undoSnapshot = null;
      sendBgMessage({ type: 'BROADCAST_WORDS_REFRESH', lang: snap.lang }).catch(() => {});
      await ctx.onRefreshData();
      ctx.onNotify('Undid placement vocabulary calibration.');
    });
  }

  private renderActiveQuiz(container: HTMLElement, ctx: PlacementViewContext): void {
    const session = this.session!;
    const q = session.activeQuestion;
    if (!q) {
      this.finishQuiz(container, ctx);
      return;
    }

    const stepNum = q.index + 1;
    const progressPct = Math.round(((stepNum - 1) / q.total) * 100);
    const bandInfo = CEFR_META[q.band];
    const langMeta = LANG_MAP[ctx.settings.activeLang];
    const langName = langMeta?.name || ctx.settings.activeLang;

    setHtmlContent(
      container,
      `
      <div class="pl-wrap">
        <div class="card pl-quiz-card" id="pl-quiz-card">
          <div class="pl-quiz-top">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <span class="pl-eyebrow">QUESTION ${stepNum} OF ${q.total}</span>
              <span class="pl-band-tag" data-band="${q.band}">Band ${q.band} · ${esc(bandInfo.title)}</span>
            </div>
            <button type="button" class="btn btn-sm" id="pl-cancel-quiz">✕ Quit Test</button>
          </div>

          <div class="progress-track" style="margin:10px 0 16px;">
            <div class="progress-fill" style="width:${progressPct}%;background:var(--blue)"></div>
          </div>

          ${
            this.lastFeedback
              ? `<div class="pl-feedback-pill ${this.lastFeedback.wasCorrect ? 'ok' : 'miss'}">
                  ${
                    this.lastFeedback.wasCorrect
                      ? `✓ Correct! "${esc(this.lastFeedback.word)}" = ${esc(this.lastFeedback.meaning)}`
                      : this.lastFeedback.unsure
                      ? `↷ Skipped "${esc(this.lastFeedback.word)}" (${esc(this.lastFeedback.meaning)})`
                      : `✕ "${esc(this.lastFeedback.word)}" means "${esc(this.lastFeedback.meaning)}"`
                  }
                </div>`
              : ''
          }

          <div class="pl-question-box">
            <div class="pl-mode-label">
              ${
                q.direction === 'word_to_meaning'
                  ? `Select the correct meaning for this ${esc(langName)} word:`
                  : `Select the ${esc(langName)} word that matches this meaning:`
              }
            </div>
            <div class="pl-prompt-row">
              <div class="pl-prompt-main" id="pl-prompt-text">${esc(q.prompt)}</div>
              ${
                q.direction === 'word_to_meaning'
                  ? `<button type="button" class="btn btn-sm" id="pl-speak-prompt" title="Listen to pronunciation">🔊</button>`
                  : ''
              }
            </div>
            <div class="pl-prompt-sub">
              ${q.reading && q.reading !== q.prompt ? `<span>[${esc(q.reading)}]</span>` : ''}
              ${q.pos ? `<span class="pl-pos-tag">${esc(q.pos)}</span>` : ''}
            </div>
          </div>

          <div class="pl-options-grid" role="group" aria-label="Answer choices">
            ${q.options
              .map(
                (opt, idx) => `
              <button type="button" class="pl-option-btn" id="pl-opt-${idx}" data-idx="${idx}" data-opt-id="${esc(opt.id)}">
                <span class="pl-opt-key">${idx + 1}</span>
                <span class="pl-opt-label">
                  ${esc(opt.label)}
                  ${opt.sublabel ? `<small style="color:var(--ink-3);margin-left:6px">[${esc(opt.sublabel)}]</small>` : ''}
                </span>
              </button>`
              )
              .join('')}
          </div>

          <div class="pl-quiz-foot">
            <button type="button" class="btn" id="pl-skip-btn">
              I'm not sure yet (Space / 0)
            </button>
            <span style="font-size:12px;color:var(--ink-3);">
              Tip: Press keys <b>1–4</b> to answer or <b>Space</b> if unsure (guessing lowers placement accuracy).
            </span>
          </div>
        </div>
      </div>
    `
    );

    const handleChoice = async (optionId: string | 'unsure') => {
      const targetWord = q.targetEntry.w;
      const targetMeaning = q.targetEntry.m[0] || '';
      const out = submitPlacementAnswer(session, optionId);
      this.lastFeedback = {
        wasCorrect: out.correct,
        unsure: optionId === 'unsure',
        word: targetWord,
        meaning: targetMeaning,
      };
      if (out.finished) {
        await this.finishQuiz(container, ctx);
      } else {
        this.renderActiveQuiz(container, ctx);
      }
    };

    container.querySelectorAll<HTMLButtonElement>('.pl-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const optId = btn.dataset.optId || 'unsure';
        handleChoice(optId);
      });
    });

    container.querySelector('#pl-skip-btn')?.addEventListener('click', () => {
      handleChoice('unsure');
    });

    container.querySelector('#pl-speak-prompt')?.addEventListener('click', () => {
      speakText(q.targetEntry.w, ctx.settings.activeLang, ctx.settings);
    });

    container.querySelector('#pl-cancel-quiz')?.addEventListener('click', () => {
      this.session = null;
      this.lastFeedback = null;
      this.render(container, ctx);
    });

    this.keyHandler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
        e.preventDefault();
        const opt = q.options[Number(e.key) - 1];
        if (opt) handleChoice(opt.id);
      } else if (e.key === '0' || e.key === ' ') {
        e.preventDefault();
        handleChoice('unsure');
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  private async finishQuiz(container: HTMLElement, ctx: PlacementViewContext): Promise<void> {
    this.unbindKeys();
    if (!this.session) return;
    const result = finalizePlacementSession(this.session, ctx.dictIndex);
    await putAssessment(result);
    this.latestResult = result;
    this.session = null;
    this.lastFeedback = null;
    this.render(container, ctx);
  }

  private unbindKeys(): void {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }
}

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
