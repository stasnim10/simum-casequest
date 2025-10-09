import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import useStore from '../state/store';
import { leaderboardUsers } from '../data/leaderboardSeed';

export default function Leaderboard() {
  const { user } = useStore();
  const [tab, setTab] = useState('weekly'); // weekly | alltime

  // Add current user to leaderboard
  const currentUserEntry = {
    id: user.id,
    name: user.name,
    avatar: '🎓',
    xp: user.xp,
    weeklyXP: Math.floor(user.xp * 0.3) // Simulate weekly XP
  };

  // Combine and sort
  const allUsers = [...leaderboardUsers, currentUserEntry];
  const sortedUsers = tab === 'weekly'
    ? [...allUsers].sort((a, b) => b.weeklyXP - a.weeklyXP)
    : [...allUsers].sort((a, b) => b.xp - a.xp);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" fill="currentColor" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" fill="currentColor" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" fill="currentColor" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Leaderboard</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('weekly')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            tab === 'weekly'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setTab('alltime')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            tab === 'alltime'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All-Time
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedUsers.map((leader, index) => {
          const rank = index + 1;
          const isCurrentUser = leader.id === user.id;
          const xpValue = tab === 'weekly' ? leader.weeklyXP : leader.xp;

          return (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-lg p-4 shadow-sm flex items-center gap-4 ${
                isCurrentUser
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-500'
                  : 'bg-white'
              }`}
            >
              {/* Rank */}
              <div className={`text-2xl font-bold w-12 text-center ${getRankColor(rank)}`}>
                {rank <= 3 ? getRankIcon(rank) : `#${rank}`}
              </div>

              {/* Avatar */}
              <div className="text-4xl">{leader.avatar}</div>

              {/* Info */}
              <div className="flex-1">
                <h3 className={`font-semibold ${isCurrentUser ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {leader.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Trophy className="w-4 h-4" />
                  <span>
                    {xpValue} {tab === 'weekly' ? 'weekly' : 'total'} XP
                  </span>
                </div>
              </div>

              {/* Badge for top 3 */}
              {rank <= 3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    rank === 1
                      ? 'bg-yellow-100 text-yellow-700'
                      : rank === 2
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  Top {rank}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6"
      >
        <h3 className="font-semibold mb-3">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Weekly Rank</p>
            <p className="text-2xl font-bold text-indigo-600">
              #{sortedUsers.findIndex(u => u.id === user.id) + 1}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total XP</p>
            <p className="text-2xl font-bold text-indigo-600">{user.xp}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
