import { nextBestLesson } from './adaptive';

export function pickNextLesson({ lessons, userRatings }) {
  const candidates = (lessons || []).map((l, i) => ({
    id: l.id,
    title: l.title,
    rating: (userRatings && userRatings[l.id]) || 1500,
    difficulty: l.difficulty || 1300 + i * 50
  }));
  if (!candidates.length) return { chosen: null, candidates: [] };
  const chosenId = nextBestLesson(candidates);
  const chosen = candidates.find(c => c.id === chosenId) || candidates[0];
  return { chosen, candidates };
}
