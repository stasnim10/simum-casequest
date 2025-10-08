import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useStore from '../state/store';

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setXP } = useStore();

  const handleComplete = () => {
    setXP(user.xp + 10);
    navigate('/learn');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Path
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Lesson {id}</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p className="text-gray-700 mb-4">
          This is lesson content for lesson {id}. In a real implementation, this would contain
          interactive learning materials, quizzes, and exercises.
        </p>
      </div>
      <button
        onClick={handleComplete}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Complete Lesson (+10 XP)
      </button>
    </div>
  );
}
