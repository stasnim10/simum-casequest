import React from 'react';

export default function NextBestLessonCard({ candidates = [], onGo, selectedId }) {
  if (!candidates.length) return null;
  const chosen = selectedId
    ? candidates.find(c => c.id === selectedId) || candidates[0]
    : candidates[0];

  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="text-sm text-gray-600">Recommendation</div>
      <div className="text-lg font-semibold mt-1">Next Best Lesson</div>
      <div className="mt-2">{chosen.title}</div>
      <button
        onClick={() => onGo && onGo(chosen.id)}
        className="mt-3 px-4 py-2 rounded-lg border hover:bg-gray-50"
      >
        Start
      </button>
    </div>
  );
}
