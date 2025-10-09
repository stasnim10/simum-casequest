import { RotateCcw } from 'lucide-react';

export default function Review() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Review</h2>
      
      <div className="bg-white rounded-lg p-6 shadow-sm text-center">
        <RotateCcw className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
        <h3 className="text-xl font-semibold mb-2">Spaced Repetition</h3>
        <p className="text-gray-600 mb-6">
          Review completed lessons to reinforce your learning.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
          Start Review Session
        </button>
      </div>
    </div>
  );
}
