import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Flame, Trophy, Target, RotateCcw, ArrowRight, TrendingUp, TrendingDown, Settings, Shield, Sparkles } from 'lucide-react';
import useStore from '../state/store';
import { getModuleList, getLessonsByModule } from '../data/api';
import { getDueItems } from '../services/spacedRepetition';
import NextBestLessonCard from '../components/NextBestLessonCard';
import { pickNextLesson } from '../lib/adaptiveSelector';
import MVPAnalytics from '../components/MVPAnalytics';
import { track } from '../lib/analytics';

export default function Dashboard() {
  const { user, lessonProgress, reviewItems, resetDemo, setDailyGoal } = useStore();
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [isPitchMode, setIsPitchMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pitchMode = params.get('pitch') === '1';
    setIsPitchMode(pitchMode);
    
    if (pitchMode) {
      // Looping sequence: streak (1) -> XP (0) -> badges (2)
      const sequence = [1, 0, 2];
      let index = 0;
      
      const interval = setInterval(() => {
        setHighlightIndex(sequence[index]);
        index = (index + 1) % sequence.length; // Loop
      }, 3000);
      
      return () => clearInterval(interval);
    }

    // Check for daily goal reminder at 8 PM
    const checkReminder = () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toISOString().split('T')[0];
      
      if (hour === 20 && user.lastActiveDate === today && user.dailyXP < user.dailyGoal) {
        console.log('Reminder: Complete your daily goal!');
      }
    };
    
    const reminderInterval = setInterval(checkReminder, 60000);
    return () => clearInterval(reminderInterval);
  }, [user]);

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
        active: i <= user.streak - 1
      });
    }
    return days;
  };

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

  const lessons = useMemo(() => {
    const modules = getModuleList();
    return modules.flatMap(m => getLessonsByModule(m.id));
  }, []);

  const userRatings = useMemo(() => {
    try {
      const raw = localStorage.getItem('casequest-storage');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed?.state?.userRatings || {};
    } catch { return {}; }
  }, []);

  const { chosen, candidates } = useMemo(
    () => pickNextLesson({ lessons, userRatings }),
    [lessons, userRatings]
  );

  const stats = [
    { icon: Star, label: 'Total XP', value: user.xp, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { icon: Flame, label: 'Streak', value: `${user.streak} days`, color: 'text-orange-500', bg: 'bg-orange-100' },
    { icon: Trophy, label: 'Badges', value: user.badges.length, color: 'text-purple-500', bg: 'bg-purple-100' },
    { icon: Target, label: 'Level', value: Math.floor(user.xp / 100) + 1, color: 'text-indigo-500', bg: 'bg-indigo-100' }
  ];

  const streakDays = getStreakHeatMap();
  const nextLesson = getNextLesson();
  const performance = getPerformance();
  const dueReviews = getDueItems(reviewItems);
  const dailyProgress = Math.min((user.dailyXP / user.dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Welcome back, {user.name}! 👋</h2>
            <p className="text-gray-600">Keep up the great work</p>
          </div>
          {!isPitchMode && (
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg bg-white"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Demo
            </button>
          )}
        </div>

        {/* Daily Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold">Daily Goal</h3>
              <p className="text-sm text-gray-600">
                {user.dailyXP} / {user.dailyGoal} XP
              </p>
            </div>
            {!isPitchMode && (
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
            />
          </div>
        </motion.div>

        {/* Market Sizing Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 uppercase text-xs tracking-wide text-indigo-100 mb-2">
                <Sparkles className="w-4 h-4" />
                Featured MVP Flow
              </div>
              <h3 className="text-2xl font-semibold mb-1">Market Sizing Masterclass</h3>
              <p className="text-indigo-100 text-sm max-w-xl">
                Learn top-down and bottom-up sizing, then tackle a voice-enabled practice case with instant feedback. Perfect highlight for investor demos.
              </p>
            </div>
            <Link
              to="/market-sizing"
              onClick={() => track('market_sizing_card_clicked')}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-indigo-50"
            >
              Launch Module
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Next Best Lesson */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <NextBestLessonCard
            candidates={candidates}
            selectedId={chosen?.id}
            onGo={(id) => navigate(`/lesson/${id}`)}
          />
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
                scale: highlightIndex === index ? 1.1 : 1,
                boxShadow: highlightIndex === index 
                  ? '0 20px 40px rgba(99, 102, 241, 0.4)' 
                  : '0 1px 3px rgba(0,0,0,0.1)'
              }}
              transition={{ 
                delay: index * 0.1,
                scale: { duration: 0.3 },
                boxShadow: { duration: 0.3 }
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

        {/* Streak with Freeze */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Your Streak</h3>
              {user.streakFreezeAvailable && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3" />
                  Freeze Available
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-orange-500">
              <Flame className="w-5 h-5" fill="currentColor" />
              <span className="font-bold">{user.streak} days</span>
            </div>
          </div>
          <div className="flex gap-2">
            {streakDays.map((day, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`h-12 rounded-lg mb-2 ${
                  day.active ? 'bg-orange-500' : 'bg-gray-200'
                }`} />
                <p className="text-xs text-gray-600">{day.day}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {user.badges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
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
            transition={{ delay: 0.7 }}
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
            transition={{ delay: 0.8 }}
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

        {/* Review Banner */}
        {dueReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Review Time!</h4>
                  <p className="text-sm text-blue-700">{dueReviews.length} items ready for review</p>
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
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6"
        >
          <MVPAnalytics />
        </motion.div>

        {/* Daily Goal Modal */}
        {showGoalModal && !isPitchMode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGoalModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold mb-4">Set Daily Goal</h3>
              <p className="text-sm text-gray-600 mb-4">Choose your daily XP target</p>
              <div className="space-y-2">
                {[10, 20, 30, 50].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      setDailyGoal(goal);
                      setShowGoalModal(false);
                    }}
                    className={`w-full p-3 rounded-lg border-2 transition ${
                      user.dailyGoal === goal
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold">{goal} XP</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({Math.ceil(goal / 30)} lessons)
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
