import { nextBestLesson } from './adaptive';

export function pickNextLesson(input: {
  lessons: Array<{ id: string; title: string; difficulty: number }>;
  userRatings: Record<string, number>; // per-lesson Elo-like rating
}) {
  const candidates = input.lessons.map(l => ({
    id: l.id,
    title: l.title,
    rating: input.userRatings[l.id] ?? 1500,
    difficulty: l.difficulty ?? 1500,
  }));
  const id = nextBestLesson(candidates.map(c => ({ id: c.id, rating: c.rating, difficulty: c.difficulty })));
  const chosen = candidates.find(c => c.id === id) ?? candidates[0];
  return { chosen, candidates };
}
