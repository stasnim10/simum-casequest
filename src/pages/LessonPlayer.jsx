import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

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
        <h2 className="text-2xl font-bold mb-4">Lesson {id}</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            Lesson content will be displayed here. This is a placeholder for lesson {id}.
          </p>
        </div>
        
        <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
          Complete Lesson
        </button>
      </div>
    </div>
  );
}
