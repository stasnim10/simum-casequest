import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Flame, Trophy, Target, RotateCcw, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import useStore from '../state/store';
import { getModuleList, getLessonsByModule } from '../data/api';

export default function Dashboard() {
  const { user, lessonProgress, resetDemo } = useStore();
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const navigate = useNavigate();

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

  // Get streak heat map (last 7 days)
  const getStreakHeatMap = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        active: false // Would check streakHistory in real implementation
      });
    }
    return days;
  };

  // Get next unlocked lesson
  const getNextLesson = () => {
    const modules = getModuleList();
    for (const module of modules) {
      const lessons = getLessonsByModule(module.id);
      for (const lesson of lessons) {
        const progress = lessonProgress[lesson.id];
        if (!progress || progress.status !== 'mastered') {
          return lesson;
        }
      }
    }
    return null;
  };

  // Calculate strengths/weaknesses
  const getPerformance = () => {
    const completed = Object.entries(lessonProgress)
      .filter(([_, p]) => p.crownLevel > 0)
      .slice(-3);
    
    if (completed.length === 0) return null;

    const avgCrowns = completed.reduce((sum, [_, p]) => sum + p.crownLevel, 0) / completed.length;
    const strengths = [];
    const weaknesses = [];

    if (avgCrowns >= 3) strengths.push('Strong mastery');
    else if (avgCrowns < 2) weaknesses.push('Review fundamentals');

    const masteredCount = completed.filter(([_, p]) => p.status === 'mastered').length;
    if (masteredCount >= 2) strengths.push('Consistent performance');
    else if (masteredCount === 0) weaknesses.push('Focus on perfection');

    return { strengths, weaknesses };
  };

  const stats = [
    { icon: Star, label: 'Total XP', value: user.xp, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { icon: Flame, label: 'Streak', value: `${user.streak} days`, color: 'text-orange-500', bg: 'bg-orange-100' },
    { icon: Trophy, label: 'Badges', value: user.badges.length, color: 'text-purple-500', bg: 'bg-purple-100' },
    { icon: Target, label: 'Level', value: Math.floor(user.xp / 100) + 1, color: 'text-indigo-500', bg: 'bg-indigo-100' }
  ];

  const streakDays = getStreakHeatMap();
  const nextLesson = getNextLesson();
  const performance = getPerformance();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {user.name}! 👋</h2>
          <p className="text-gray-600">Keep up the great work</p>
        </div>
        <button
          onClick={resetDemo}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo
        </button>
      </div>

      {/* Streak Heat Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Streak</h3>
          <div className="flex items-center gap-2 text-orange-500">
            <Flame className="w-5 h-5" fill="currentColor" />
            <span className="font-bold">{user.streak} days</span>
          </div>
        </div>
        <div className="flex gap-2">
          {streakDays.map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`h-12 rounded-lg mb-2 ${
                i < user.streak ? 'bg-orange-500' : 'bg-gray-200'
              }`} />
              <p className="text-xs text-gray-600">{day.day}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: highlightIndex === index ? 1.05 : 1,
              boxShadow: highlightIndex === index ? '0 10px 30px rgba(99, 102, 241, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
            transition={{ delay: index * 0.1 }}
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

      {/* Badges */}
      {user.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {user.badges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-5xl text-center"
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance */}
      {performance && (performance.strengths.length > 0 || performance.weaknesses.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
          <div className="flex flex-wrap gap-2">
            {performance.strengths.map((strength, i) => (
              <div key={i} className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{strength}</span>
              </div>
            ))}
            {performance.weaknesses.map((weakness, i) => (
              <div key={i} className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">{weakness}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue Learning */}
      {nextLesson && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white shadow-lg mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">Continue Learning</h3>
          <p className="mb-4 text-indigo-100">Pick up where you left off</p>
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {nextLesson.title}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      )}

      {/* Review Banner (placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Review Time!</h4>
              <p className="text-sm text-blue-700">3 lessons ready for review</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/review')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Start Review
          </button>
        </div>
      </motion.div>
    </div>
  );
}
