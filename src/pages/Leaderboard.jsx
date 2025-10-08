import { Trophy } from 'lucide-react';
import useStore from '../state/store';

export default function Leaderboard() {
  const { user } = useStore();

  const leaders = [
    { rank: 1, name: 'Alex Chen', xp: 450 },
    { rank: 2, name: 'Sarah Kim', xp: 380 },
    { rank: 3, name: user.name, xp: user.xp },
    { rank: 4, name: 'Mike Johnson', xp: 95 },
    { rank: 5, name: 'Emma Davis', xp: 80 },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Leaderboard</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className={`flex items-center justify-between p-4 border-b last:border-b-0 ${
              leader.name === user.name ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 text-center font-bold text-gray-900">#{leader.rank}</div>
              {leader.rank <= 3 && <Trophy className="w-5 h-5 text-yellow-500" />}
              <span className="font-medium text-gray-900">{leader.name}</span>
            </div>
            <span className="font-semibold text-gray-900">{leader.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
