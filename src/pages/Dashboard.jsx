import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, Trophy, Target, RotateCcw } from 'lucide-react';
import useStore from '../state/store';

export default function Dashboard() {
  const { user, resetDemo } = useStore();
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pitch') === '1') {
      const sequence = [0, 1, 2];
      let index = 0;
      const interval = setInterval(() => {
        if (index < sequence.length) {
          setHighlightIndex(sequence[index]);
          index++;
        } else {
          clearInterval(interval);
          setHighlightIndex(-1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const stats = [
    { icon: Star, label: 'Total XP', value: user.xp, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { icon: Flame, label: 'Streak', value: `${user.streak} days`, color: 'text-orange-500', bg: 'bg-orange-100' },
    { icon: Trophy, label: 'Badges', value: user.badges.length, color: 'text-purple-500', bg: 'bg-purple-100' },
    { icon: Target, label: 'Level', value: Math.floor(user.xp / 100) + 1, color: 'text-indigo-500', bg: 'bg-indigo-100' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          onClick={resetDemo}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            animate={{
              scale: highlightIndex === index ? 1.1 : 1,
              boxShadow: highlightIndex === index ? '0 10px 30px rgba(99, 102, 241, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-600">Your learning progress will appear here.</p>
      </div>

      {user.badges.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Badges</h3>
          <div className="flex gap-3">
            {user.badges.map((badge, i) => (
              <div key={i} className="text-4xl">{badge}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
