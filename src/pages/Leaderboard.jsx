import { Trophy } from 'lucide-react';

export default function Leaderboard() {
  const leaders = [
    { rank: 1, name: 'Alex Chen', xp: 2450, avatar: '👨‍💼' },
    { rank: 2, name: 'Sarah Kim', xp: 2100, avatar: '👩‍💼' },
    { rank: 3, name: 'Mike Johnson', xp: 1890, avatar: '👨‍💻' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      
      <div className="space-y-3">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4"
          >
            <div className={`text-2xl font-bold ${
              leader.rank === 1 ? 'text-yellow-500' :
              leader.rank === 2 ? 'text-gray-400' :
              'text-orange-600'
            }`}>
              #{leader.rank}
            </div>
            <div className="text-3xl">{leader.avatar}</div>
            <div className="flex-1">
              <h3 className="font-semibold">{leader.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Trophy className="w-4 h-4" />
                <span>{leader.xp} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
