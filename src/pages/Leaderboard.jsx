import { useState } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../state/store';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('weekly');
  const { getLeaderboard, computeWeeklyXP } = useStore();

  const allTimeLeaderboard = getLeaderboard();
  
  // Mock weekly leaderboard (70% of all-time XP)
  const weeklyLeaderboard = allTimeLeaderboard.map((user) => ({
    ...user,
    xp: user.isCurrentUser ? computeWeeklyXP() : Math.floor(user.xp * 0.7),
  })).sort((a, b) => b.xp - a.xp).map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  const leaderboard = activeTab === 'weekly' ? weeklyLeaderboard : allTimeLeaderboard;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Leaderboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
            activeTab === 'weekly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setActiveTab('alltime')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
            activeTab === 'alltime'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All-Time
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {leaderboard.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-4 border-b last:border-b-0 ${
              user.isCurrentUser ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Rank */}
              <div className="w-12 text-center">
                {user.rank <= 3 ? (
                  <div className="flex items-center justify-center">
                    {user.rank === 1 && <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
                    {user.rank === 2 && <Crown className="w-6 h-6 text-gray-400 fill-gray-400" />}
                    {user.rank === 3 && <Crown className="w-6 h-6 text-orange-600 fill-orange-600" />}
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-600">#{user.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  user.isCurrentUser ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              >
                {user.name[0]}
              </div>

              {/* Name */}
              <div className="flex-1">
                <div className={`font-semibold ${user.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                  {user.name}
                  {user.isCurrentUser && (
                    <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <div className="font-bold text-gray-900">{user.xp}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>

              {/* Trophy for top 3 */}
              {user.rank <= 3 && (
                <Trophy
                  className={`w-5 h-5 ${
                    user.rank === 1
                      ? 'text-yellow-500'
                      : user.rank === 2
                      ? 'text-gray-400'
                      : 'text-orange-600'
                  }`}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          💡 <strong>Tip:</strong> Complete lessons and cases to earn XP and climb the leaderboard!
        </p>
      </div>
    </div>
  );
}
