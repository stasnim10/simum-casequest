import { BarChart3 } from 'lucide-react';
import useStore from '../state/store';

export default function Review() {
  const { user } = useStore();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Review & Progress</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Your Stats</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Total XP</div>
            <div className="text-2xl font-bold text-gray-900">{user.xp}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Current Level</div>
            <div className="text-2xl font-bold text-gray-900">{Math.floor(user.xp / 100) + 1}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Streak</div>
            <div className="text-2xl font-bold text-gray-900">{user.streak} days</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Coins</div>
            <div className="text-2xl font-bold text-gray-900">{user.coins}</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          💡 Keep practicing daily to maintain your streak and earn more XP!
        </p>
      </div>
    </div>
  );
}
