import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useStore from '../state/store';

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startLesson, completeLesson, lessonProgress } = useStore();
  const [answers, setAnswers] = useState({ correct: 0, total: 3 });
  
  const progress = lessonProgress[id];

  useEffect(() => {
    startLesson(id);
  }, [id, startLesson]);

  const handleComplete = () => {
    completeLesson(id, answers);
    navigate('/learn');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Learning Path
      </button>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lesson {id}</h2>
          {progress && (
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < progress.crownLevel ? 'text-yellow-500' : 'text-gray-300'}>
                  👑
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="text-gray-600 mb-4">
            Lesson content will be displayed here. This is a placeholder for lesson {id}.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo: Adjust your score</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <span>Correct:</span>
                <input
                  type="number"
                  min="0"
                  max={answers.total}
                  value={answers.correct}
                  onChange={(e) => setAnswers({ ...answers, correct: parseInt(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 border rounded"
                />
              </label>
              <label className="flex items-center gap-2">
                <span>Total:</span>
                <input
                  type="number"
                  min="1"
                  value={answers.total}
                  onChange={(e) => setAnswers({ ...answers, total: parseInt(e.target.value) || 1 })}
                  className="w-16 px-2 py-1 border rounded"
                />
              </label>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleComplete}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Complete Lesson (+{answers.correct * 10 + 20} XP)
        </button>
      </div>
    </div>
  );
}
