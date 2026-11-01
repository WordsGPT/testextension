import type { CefrBand, CefrLevel, DictEntry, LangCode, PlacementAssessment } from './types';
import type { LoadedLangIndex } from './dictionary';

export const CEFR_BANDS: CefrBand[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const CEFR_META: Record<
  CefrLevel,
  { title: string; summary: string; approxVocab: number; frontierRatio: number }
> = {
  A0: {
    title: 'First Steps',
    summary: 'Starting from scratch — focus on core high-frequency words and short dialogues.',
    approxVocab: 80,
    frontierRatio: 0.0,
  },
  A1: {
    title: 'Beginner',
    summary: 'Recognizes foundational everyday words, pronouns, and basic connectors.',
    approxVocab: 550,
    frontierRatio: 0.12,
  },
  A2: {
    title: 'Elementary',
    summary: 'Follows routine stories, concrete descriptions, and common conversational vocabulary.',
    approxVocab: 1350,
    frontierRatio: 0.25,
  },
  B1: {
    title: 'Intermediate',
    summary: 'Reads graded articles, narrative fiction, and everyday subtitles with moderate lookup support.',
    approxVocab: 2800,
    frontierRatio: 0.42,
  },
  B2: {
    title: 'Upper Intermediate',
    summary: 'Handles native news, essays, and unadapted novels with strong core lexical coverage.',
    approxVocab: 5400,
    frontierRatio: 0.62,
  },
  C1: {
    title: 'Advanced',
    summary: 'Comprehends nuanced, abstract, and domain-specific writing with minimal friction.',
    approxVocab: 9800,
    frontierRatio: 0.82,
  },
  C2: {
    title: 'Mastery',
    summary: 'Near-native lexical breadth across literary, academic, and idiomatic registers.',
    approxVocab: 15500,
    frontierRatio: 0.95,
  },
};

export interface PlacementOption {
  id: string;
  label: string;
  sublabel?: string;
  isCorrect: boolean;
}

export interface PlacementQuestion {
  index: number;
  total: number;
  band: CefrBand;
  direction: 'word_to_meaning' | 'meaning_to_word';
  targetEntry: DictEntry;
  prompt: string;
  reading?: string;
  pos?: string;
  options: PlacementOption[];
}

export interface PlacementHistoryStep {
  band: CefrBand;
  word: string;
  meaning: string;
  correct: boolean;
  skipped: boolean;
}

export interface PlacementSession {
  lang: LangCode;
  totalQuestions: number;
  currentIndex: number;
  currentBandIdx: number; // 0..5 -> A1..C2
  pools: Record<CefrBand, DictEntry[]>;
  allRealEntries: DictEntry[];
  usedWords: Set<string>;
  bandScores: Record<CefrBand, { correct: number; total: number }>;
  correctWords: string[];
  missedWords: string[];
  steps: PlacementHistoryStep[];
  activeQuestion: PlacementQuestion | null;
  seed: number;
}

function isAuthenticLexicalEntry(entry: DictEntry): boolean {
  if (!entry.w || !entry.m || entry.m.length === 0) return false;
  if (entry.special === 'name' || entry.special === 'place') return false;
  const firstMeaning = entry.m[0] || '';
  if (/vocabulary item #\d+/i.test(firstMeaning)) return false;
  return true;
}

function cleanMeaningGloss(entry: DictEntry): string {
  const raw = (entry.m[0] || '').trim();
  return raw.length > 68 ? `${raw.slice(0, 65)}…` : raw;
}

function nextRand(session: PlacementSession): number {
  // Deterministic LCG step
  session.seed = (session.seed * 1664525 + 1013904223) >>> 0;
  return session.seed / 0x100000000;
}

export function buildBandPools(dictIndex: LoadedLangIndex): {
  pools: Record<CefrBand, DictEntry[]>;
  allRealEntries: DictEntry[];
} {
  const realRanked = dictIndex.byRank.filter(isAuthenticLexicalEntry);
  const realAll = realRanked.length >= 18 ? realRanked : dictIndex.entries.filter(isAuthenticLexicalEntry);

  const pools: Record<CefrBand, DictEntry[]> = {
    A1: [],
    A2: [],
    B1: [],
    B2: [],
    C1: [],
    C2: [],
  };

  const n = realAll.length;
  for (let i = 0; i < n; i++) {
    const ratio = i / Math.max(1, n);
    let band: CefrBand = 'C2';
    if (ratio < 0.16) band = 'A1';
    else if (ratio < 0.33) band = 'A2';
    else if (ratio < 0.5) band = 'B1';
    else if (ratio < 0.67) band = 'B2';
    else if (ratio < 0.84) band = 'C1';
    pools[band].push(realAll[i]);
  }

  return { pools, allRealEntries: realAll };
}

export function createPlacementSession(
  dictIndex: LoadedLangIndex,
  options?: { totalQuestions?: number; seed?: number }
): PlacementSession {
  const { pools, allRealEntries } = buildBandPools(dictIndex);
  const totalQuestions = Math.max(6, Math.min(20, options?.totalQuestions ?? 12));
  const seed = options?.seed ?? (Date.now() ^ 0x9e3779b9) >>> 0;

  const session: PlacementSession = {
    lang: dictIndex.lang,
    totalQuestions,
    currentIndex: 0,
    currentBandIdx: 1, // Start at A2
    pools,
    allRealEntries,
    usedWords: new Set<string>(),
    bandScores: {
      A1: { correct: 0, total: 0 },
      A2: { correct: 0, total: 0 },
      B1: { correct: 0, total: 0 },
      B2: { correct: 0, total: 0 },
      C1: { correct: 0, total: 0 },
      C2: { correct: 0, total: 0 },
    },
    correctWords: [],
    missedWords: [],
    steps: [],
    activeQuestion: null,
    seed,
  };

  session.activeQuestion = generateNextQuestion(session);
  return session;
}

function generateNextQuestion(session: PlacementSession): PlacementQuestion | null {
  if (session.currentIndex >= session.totalQuestions) return null;

  // Find candidate pool from currentBandIdx or nearest available band
  let chosenBandIdx = session.currentBandIdx;
  let candidates: DictEntry[] = [];
  for (let dist = 0; dist < CEFR_BANDS.length; dist++) {
    for (const dir of [0, 1, -1]) {
      const idx = session.currentBandIdx + dir * dist;
      if (idx < 0 || idx >= CEFR_BANDS.length) continue;
      const band = CEFR_BANDS[idx];
      const avail = session.pools[band].filter((e) => !session.usedWords.has(e.w));
      if (avail.length > 0) {
        chosenBandIdx = idx;
        candidates = avail;
        break;
      }
    }
    if (candidates.length > 0) break;
  }

  if (candidates.length === 0) {
    candidates = session.allRealEntries.filter((e) => !session.usedWords.has(e.w));
    if (candidates.length === 0) candidates = session.allRealEntries;
  }

  const band = CEFR_BANDS[chosenBandIdx];
  const pickIdx = Math.floor(nextRand(session) * candidates.length);
  const target = candidates[pickIdx] || candidates[0];
  session.usedWords.add(target.w);

  const targetGloss = cleanMeaningGloss(target);
  const direction: 'word_to_meaning' | 'meaning_to_word' =
    session.currentIndex % 3 === 2 ? 'meaning_to_word' : 'word_to_meaning';

  // Select 3 plausible distractors (preferring nearby bands & same POS)
  const distractorPool = session.allRealEntries.filter(
    (e) => e.w !== target.w && cleanMeaningGloss(e).toLowerCase() !== targetGloss.toLowerCase()
  );
  const samePos = distractorPool.filter((e) => e.pos && e.pos === target.pos);
  const sourcePool = samePos.length >= 6 ? samePos : distractorPool;

  const chosenDistractors: DictEntry[] = [];
  const usedGlosses = new Set<string>([targetGloss.toLowerCase()]);
  const usedWordsLocal = new Set<string>([target.w]);

  const maxAttempts = sourcePool.length * 2 + 12;
  for (let attempt = 0; attempt < maxAttempts && chosenDistractors.length < 3; attempt++) {
    const d = sourcePool[Math.floor(nextRand(session) * sourcePool.length)];
    if (!d) continue;
    const g = cleanMeaningGloss(d).toLowerCase();
    if (!usedWordsLocal.has(d.w) && !usedGlosses.has(g)) {
      usedWordsLocal.add(d.w);
      usedGlosses.add(g);
      chosenDistractors.push(d);
    }
  }

  // Fallback if pool is tiny
  for (const d of distractorPool) {
    if (chosenDistractors.length >= 3) break;
    const g = cleanMeaningGloss(d).toLowerCase();
    if (!usedWordsLocal.has(d.w) && !usedGlosses.has(g)) {
      usedWordsLocal.add(d.w);
      usedGlosses.add(g);
      chosenDistractors.push(d);
    }
  }

  const rawOptions: PlacementOption[] = [
    {
      id: 'opt_correct',
      label: direction === 'word_to_meaning' ? targetGloss : target.w,
      sublabel: direction === 'meaning_to_word' ? target.r : undefined,
      isCorrect: true,
    },
    ...chosenDistractors.map((d, idx) => ({
      id: `opt_dist_${idx}`,
      label: direction === 'word_to_meaning' ? cleanMeaningGloss(d) : d.w,
      sublabel: direction === 'meaning_to_word' ? d.r : undefined,
      isCorrect: false,
    })),
  ];

  // Deterministic shuffle of the 4 options
  for (let i = rawOptions.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand(session) * (i + 1));
    const tmp = rawOptions[i];
    rawOptions[i] = rawOptions[j];
    rawOptions[j] = tmp;
  }

  return {
    index: session.currentIndex,
    total: session.totalQuestions,
    band,
    direction,
    targetEntry: target,
    prompt: direction === 'word_to_meaning' ? target.w : targetGloss,
    reading: direction === 'word_to_meaning' ? target.r : undefined,
    pos: target.pos,
    options: rawOptions,
  };
}

export function submitPlacementAnswer(
  session: PlacementSession,
  selectedOptionId: string | 'unsure'
): { correct: boolean; finished: boolean; nextQuestion: PlacementQuestion | null } {
  const q = session.activeQuestion;
  if (!q) {
    return { correct: false, finished: true, nextQuestion: null };
  }

  const skipped = selectedOptionId === 'unsure';
  const chosenOpt = q.options.find((o) => o.id === selectedOptionId);
  const correct = !skipped && Boolean(chosenOpt?.isCorrect);

  session.bandScores[q.band].total += 1;
  if (correct) {
    session.bandScores[q.band].correct += 1;
    if (!session.correctWords.includes(q.targetEntry.w)) {
      session.correctWords.push(q.targetEntry.w);
    }
    session.currentBandIdx = Math.min(CEFR_BANDS.length - 1, session.currentBandIdx + 1);
  } else {
    if (!session.missedWords.includes(q.targetEntry.w)) {
      session.missedWords.push(q.targetEntry.w);
    }
    session.currentBandIdx = Math.max(0, session.currentBandIdx - 1);
  }

  session.steps.push({
    band: q.band,
    word: q.targetEntry.w,
    meaning: cleanMeaningGloss(q.targetEntry),
    correct,
    skipped,
  });

  session.currentIndex += 1;
  session.activeQuestion = generateNextQuestion(session);

  return {
    correct,
    finished: session.activeQuestion === null,
    nextQuestion: session.activeQuestion,
  };
}

export function finalizePlacementSession(
  session: PlacementSession,
  dictIndex: LoadedLangIndex
): PlacementAssessment {
  const totalAnswered = session.steps.length;
  const totalCorrect = session.steps.filter((s) => s.correct).length;

  // Compute weighted score across bands (A1=1 .. C2=6)
  const weights: Record<CefrBand, number> = { A1: 1.0, A2: 1.35, B1: 1.75, B2: 2.2, C1: 2.7, C2: 3.2 };
  let earnedWeight = 0;
  let maxPossibleWeight = 0;
  let highestMasteredBandIdx = -1;

  for (let i = 0; i < CEFR_BANDS.length; i++) {
    const b = CEFR_BANDS[i];
    const sc = session.bandScores[b];
    const w = weights[b];
    earnedWeight += sc.correct * w;
    maxPossibleWeight += sc.total * w;
    if (sc.total > 0 && sc.correct / sc.total >= 0.5) {
      highestMasteredBandIdx = i;
    }
  }

  const overallAccuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
  const weightedRatio = maxPossibleWeight > 0 ? earnedWeight / maxPossibleWeight : 0;

  // Combine final staircase position, highest mastered band, and accuracy
  let level: CefrLevel = 'A0';
  if (totalCorrect === 0 || (overallAccuracy < 0.2 && highestMasteredBandIdx < 0)) {
    level = 'A0';
  } else {
    const compositeBand = Math.round(
      session.currentBandIdx * 0.55 + Math.max(0, highestMasteredBandIdx) * 0.45
    );
    const clampedIdx = Math.max(0, Math.min(CEFR_BANDS.length - 1, compositeBand));
    // Require strong accuracy for C1/C2
    if (clampedIdx >= 5 && overallAccuracy < 0.78) {
      level = 'C1';
    } else if (clampedIdx >= 4 && overallAccuracy < 0.6) {
      level = 'B2';
    } else {
      level = CEFR_BANDS[clampedIdx];
    }
  }

  const meta = CEFR_META[level];
  const jitter = Math.round((weightedRatio - 0.5) * 280);
  const estimatedVocab =
    level === 'A0'
      ? Math.max(0, totalCorrect * 45)
      : Math.max(120, meta.approxVocab + jitter);

  const totalRanked = Math.max(1, dictIndex.byRank.length);
  const recommendedRankFrontier =
    level === 'A0'
      ? 0
      : Math.max(15, Math.min(totalRanked, Math.round(totalRanked * meta.frontierRatio)));

  // Confidence scales with number of questions and consistency
  const consistencyBonus = Math.round(Math.abs(overallAccuracy - 0.5) * 18);
  const confidencePct = Math.min(97, Math.max(68, 72 + Math.min(14, totalAnswered) + consistencyBonus));

  return {
    id: `assess_${session.lang}_${Date.now()}`,
    lang: session.lang,
    cefrLevel: level,
    cefrTitle: meta.title,
    estimatedVocab,
    recommendedRankFrontier,
    confidencePct,
    bandScores: session.bandScores,
    correctWords: [...session.correctWords],
    missedWords: [...session.missedWords],
    appliedCalibration: false,
    completedAt: Date.now(),
  };
}

export function buildPlacementCalibrationWords(
  assessment: PlacementAssessment,
  dictIndex: LoadedLangIndex
): { knownWords: string[]; learningWords: string[] } {
  const missedSet = new Set(assessment.missedWords);
  const knownSet = new Set<string>(assessment.correctWords);

  const frontierSlice = dictIndex.byRank.slice(0, assessment.recommendedRankFrontier);
  for (const entry of frontierSlice) {
    if (!missedSet.has(entry.w)) {
      knownSet.add(entry.w);
    }
  }

  return {
    knownWords: Array.from(knownSet),
    learningWords: Array.from(missedSet),
  };
}
