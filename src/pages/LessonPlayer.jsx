import { useNavigate, useParams } from 'react-router-dom';
import MicroLesson from '../components/MicroLesson';
import { getLesson } from '../data/api';

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = getLesson(id);

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          ← Back to learning modules
        </button>
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Lesson not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            The lesson you were looking for is unavailable. Please return to the learning modules page to pick another micro-lesson.
          </p>
        </div>
      </div>
    );
  }

  if (!lesson.microLesson) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          ← Back to learning modules
        </button>
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Unsupported lesson format</h1>
          <p className="mt-2 text-sm text-gray-600">
            This prototype currently supports Milo micro-lessons only. Please return to the learning modules page to continue learning.
          </p>
        </div>
      </div>
    );
  }

  return <MicroLesson lesson={lesson} lessonId={id} />;
}
