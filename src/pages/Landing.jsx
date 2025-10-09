import { Link } from 'react-router-dom';
import { Target, BookOpen, Trophy } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-4xl">
        <h1 className="text-6xl font-bold mb-4">CaseQuest</h1>
        <p className="text-2xl mb-12">Master Case Interviews, Gamified</p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
            <p>Follow a proven path</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Cases</h3>
            <p>Practice real scenarios</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <Trophy className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p>Earn XP and compete</p>
          </div>
        </div>
        
        <Link
          to="/learn"
          className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
