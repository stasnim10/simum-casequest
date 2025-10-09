import { Link } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';

export default function LearningPath() {
  const lessons = [
    { id: 1, title: 'Introduction to Case Interviews', completed: false, locked: false },
    { id: 2, title: 'Market Sizing Basics', completed: false, locked: true },
    { id: 3, title: 'Profitability Framework', completed: false, locked: true }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Learning Path</h2>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`bg-white rounded-lg p-4 border-2 ${
              lesson.locked ? 'border-gray-200 opacity-50' : 'border-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{lesson.title}</h3>
              </div>
              {lesson.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : lesson.locked ? (
                <Lock className="w-6 h-6 text-gray-400" />
              ) : (
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Start
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
