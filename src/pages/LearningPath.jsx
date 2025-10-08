import { Link } from 'react-router-dom';
import { BookOpen, Lock, CheckCircle } from 'lucide-react';

export default function LearningPath() {
  const lessons = [
    { id: 1, title: 'Introduction to Case Interviews', completed: true },
    { id: 2, title: 'Framework Fundamentals', completed: false, active: true },
    { id: 3, title: 'Market Sizing', completed: false, locked: true },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Learning Path</h1>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={lesson.locked ? '#' : `/lesson/${lesson.id}`}
            className={`block p-4 rounded-lg border ${
              lesson.completed
                ? 'bg-green-50 border-green-200'
                : lesson.active
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-100 border-gray-200'
            } ${lesson.locked ? 'cursor-not-allowed opacity-60' : 'hover:shadow-md transition-shadow'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {lesson.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : lesson.locked ? (
                  <Lock className="w-6 h-6 text-gray-400" />
                ) : (
                  <BookOpen className="w-6 h-6 text-blue-600" />
                )}
                <span className="font-medium text-gray-900">{lesson.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
