import React from 'react';
import { track } from '../lib/analytics';

type Candidate = { id: string; title: string; rating: number; difficulty: number };
type Props = {
  candidates: Candidate[];
  onGo?: (lessonId: string) => void;
  selectedId?: string | null;
};

export default function NextBestLessonCard({ candidates, onGo, selectedId }: Props) {
  if (!candidates?.length) return null;

  const chosen = selectedId ?? candidates.reduce((best, c) => {
    const e = 1 / (1 + Math.pow(10, (c.difficulty - c.rating) / 400));
    const delta = Math.abs(0.5 - e);
    return delta > (best.delta ?? -1) ? { id: c.id, title: c.title, delta } : best;
  }, {} as any).id;

  const selected = candidates.find(c => c.id === chosen) ?? candidates[0];

  const handleClick = () => {
    track('next_best_lesson_clicked', { lessonId: selected.id, title: selected.title });
    onGo?.(selected.id);
  };

  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="text-sm text-gray-600">Recommendation</div>
      <div className="text-lg font-semibold mt-1">Next Best Lesson</div>
      <div className="mt-2">{selected.title}</div>
      <button
        onClick={handleClick}
        className="mt-3 px-4 py-2 rounded-lg border hover:bg-gray-50"
      >
        Start
      </button>
    </div>
  );
}
