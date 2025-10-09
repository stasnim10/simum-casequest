export type Mastery = 0|1|2|3|4|5;

export function nextIntervalDays(history: Array<{ correct: boolean; t: number }>) {
  // Simple SM-2 inspired rule
  if (history.length === 0) return 1;
  const streak = history.reduce((s, h) => h.correct ? s + 1 : 0, 0);
  const base = Math.min(5 + streak * 2, 21);
  const last = history[history.length - 1];
  return last.correct ? base : 1;
}

export function expectedScore(my: number, item: number) {
  // Elo expectation
  return 1 / (1 + Math.pow(10, (item - my) / 400));
}

export function eloUpdate(rating: number, expected: number, score: 0|0.5|1, k=24) {
  const updated = Math.round(rating + k * (score - expected));
  return Math.max(600, Math.min(2400, updated));
}

export function nextBestLesson(candidates: Array<{ id: string; rating: number; difficulty: number }>) {
  if (!candidates.length) return null;
  let best = candidates[0];
  let bestDelta = -1;
  for (const c of candidates) {
    const e = expectedScore(c.rating, c.difficulty);
    const delta = Math.abs(0.5 - e);
    if (delta > bestDelta) { best = c; bestDelta = delta; }
  }
  return best.id;
}
