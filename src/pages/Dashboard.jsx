import { Link } from 'react-router-dom';
import { BookOpen, Bot, TrendingUp, Star, Coins, Flame, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../state/store';
import { getLesson } from '../data/api';

export default function Dashboard() {
  const { user, lessonProgress, badges, getLeaderboard } = useStore();

  // Streak heatmap (last 7 days)
  const getStreakDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        active: i === 0 ? user.streak > 0 : Math.random() > 0.5, // Mock for demo
      });
    }
    return days;
  };

  // Compute strengths and weaknesses
  const getStrengthsWeaknesses = () => {
    const lessons = Object.entries(lessonProgress);
    const strengths = [];
    const weaknesses = [];

    // Mock analysis based on crown levels
    lessons.forEach(([id, progress]) => {
      if (progress.crownLevel >= 4) {
        const lesson = getLesson(id);
        if (lesson && !strengths.includes(lesson.moduleId)) {
          strengths.push(lesson.title.split(' ')[0]); // First word as topic
        }
      } else if (progress.crownLevel <= 1 && progress.status === 'in_progress') {
        const lesson = getLesson(id);
        if (lesson && !weaknesses.includes(lesson.moduleId)) {
          weaknesses.push(lesson.title.split(' ')[0]);
        }
      }
    });

    return { strengths: strengths.slice(0, 3), weaknesses: weaknesses.slice(0, 3) };
  };

  // Find next unlocked lesson
  const getNextLesson = () => {
    // Simple: find first in_progress or new lesson
    const inProgress = Object.entries(lessonProgress).find(
      ([_, p]) => p.status === 'in_progress'
    );
    if (inProgress) {
      return getLesson(inProgress[0]);
    }
    // Return first lesson if none in progress
    return getLesson('l1');
  };

  const streakDays = getStreakDays();
  const { strengths, weaknesses } = getStrengthsWeaknesses();
  const nextLesson = getNextLesson();
  const leaderboard = getLeaderboard();
  const userRank = leaderboard.find((u) => u.isCurrentUser)?.rank || '?';

  const allBadges = [
    { id: 'first-lesson', name: 'First Lesson', emoji: '📚', unlocked: badges.includes('first-lesson') },
    { id: 'first-case', name: 'First Case', emoji: '🎯', unlocked: badges.includes('first-case') },
    { id: 'week-streak', name: '7-Day Streak', emoji: '🔥', unlocked: user.streak >= 7 },
    { id: 'master', name: 'Master', emoji: '👑', unlocked: Object.values(lessonProgress).filter(p => p.status === 'mastered').length >= 5 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Greeting & Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-4">Hi, {user.name}! 👋</h1>
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5" />
          <span className="font-semibold">{user.streak} Day Streak</span>
        </div>
        <div className="flex gap-2">
          {streakDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  day.active ? 'bg-orange-500' : 'bg-white bg-opacity-20'
                }`}
              >
                {day.active ? '🔥' : ''}
              </div>
              <span className="text-xs mt-1 opacity-80">{day.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">XP</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{user.xp}</div>
          <div className="text-xs text-gray-500">Level {Math.floor(user.xp / 100) + 1}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Coins</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{user.coins}</div>
          <div className="text-xs text-gray-500">Spend in shop</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Badges</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {allBadges.filter((b) => b.unlocked).length}
          </div>
          <div className="text-xs text-gray-500">of {allBadges.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Rank</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">#{userRank}</div>
          <div className="text-xs text-gray-500">This week</div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                badge.unlocked
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{badge.emoji}</div>
              <div className="text-sm font-medium text-gray-900">{badge.name}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {strengths.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-700 mb-2">💪 Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {weaknesses.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-orange-700 mb-2">📈 Practice More</h3>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map((w, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Continue Learning */}
      {nextLesson && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="block bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium opacity-90 mb-1">Continue Learning</div>
                <div className="text-xl font-bold mb-2">{nextLesson.title}</div>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <BookOpen className="w-4 h-4" />
                  <span>Ready to start</span>
                </div>
              </div>
              <ArrowRight className="w-8 h-8" />
            </div>
          </Link>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          to="/learn"
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Learning Path</h3>
          <p className="text-sm text-gray-600">Continue your lessons</p>
        </Link>

        <Link
          to="/case"
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Bot className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Case Practice</h3>
          <p className="text-sm text-gray-600">Solve a case study</p>
        </Link>

        <Link
          to="/leaderboard"
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Leaderboard</h3>
          <p className="text-sm text-gray-600">See your ranking</p>
        </Link>
      </div>
    </div>
  );
}
