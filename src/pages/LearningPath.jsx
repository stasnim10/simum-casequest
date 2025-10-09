import { Link } from 'react-router-dom';
import { Lock, CheckCircle, Crown } from 'lucide-react';
import useStore from '../state/store';

export default function LearningPath() {
  const { lessonProgress } = useStore();
  
  const lessons = [
    { id: '1', title: 'Introduction to Case Interviews', locked: false },
    { id: '2', title: 'Market Sizing Basics', locked: false },
    { id: '3', title: 'Profitability Framework', locked: false }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Learning Path</h2>
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const progress = lessonProgress[lesson.id];
          const isMastered = progress?.status === 'mastered';
          const crownLevel = progress?.crownLevel || 0;
          
          return (
            <div
              key={lesson.id}
              className={`bg-white rounded-lg p-4 border-2 ${
                lesson.locked ? 'border-gray-200 opacity-50' : 
                isMastered ? 'border-green-200' : 'border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{lesson.title}</h3>
                  {progress && (
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Crown 
                          key={i} 
                          className={`w-4 h-4 ${i < crownLevel ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {isMastered ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : lesson.locked ? (
                  <Lock className="w-6 h-6 text-gray-400" />
                ) : (
                  <Link
                    to={`/lesson/${lesson.id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
                  >
                    {progress ? 'Continue' : 'Start'}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
