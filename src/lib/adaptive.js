export function expectedScore(my, item) {
  return 1 / (1 + Math.pow(10, (item - my) / 400));
}

export function eloUpdate(rating, expected, score, k = 24) {
  const next = Math.round(rating + k * (score - expected));
  return Math.max(600, Math.min(2400, next));
}

export function nextBestLesson(cands = []) {
  if (!cands.length) return null;
  let best = cands[0], bestDelta = -1;
  for (const c of cands) {
    const e = expectedScore(c.rating, c.difficulty);
    const delta = Math.abs(0.5 - e);
    if (delta > bestDelta) { best = c; bestDelta = delta; }
  }
  return best.id;
}

export function nextIntervalDays(history = []) {
  if (!history.length) return 1;
  const streak = history.reduce((s, h) => (h.correct ? s + 1 : 0), 0);
  return Math.min(21, 5 + 2 * streak);
}
