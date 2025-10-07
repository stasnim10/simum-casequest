import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Bot, Trophy, TrendingUp, 
  Target, Star, Flame, Award, 
  ArrowRight, Play, BarChart3, HelpCircle 
} from 'lucide-react';
import Tooltip from './components/Tooltip';
import CaseMascot from './components/CaseMascot';
import NextBestAction from './components/NextBestAction';
import StreakProtection from './components/StreakProtection';
import spacedRepetitionService from './services/spacedRepetition';

const QuickStatCard = ({ icon: Icon, title, value, color, onClick, tooltip }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0"
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    <div className="flex items-center justify-between relative z-10">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <motion.p 
          className="text-2xl font-bold text-gray-900 mt-1"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {value}
        </motion.p>
      </div>
      <motion.div 
        className={`p-3 rounded-lg bg-${color}-100`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </motion.div>
    </div>
  </motion.div>
);

const ActionCard = ({ icon: Icon, title, description, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-xl transition-all group relative overflow-hidden"
  >
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br from-${color}-50 to-transparent opacity-0`}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    <div className="flex items-start space-x-4 relative z-10">
      <motion.div 
        className={`p-3 rounded-lg bg-${color}-100 group-hover:bg-${color}-200 transition-colors`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </motion.div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <motion.div 
          className="flex items-center text-blue-600 text-sm font-medium"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Get Started <ArrowRight className="h-4 w-4 ml-1" />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color = "#3B82F6" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onNavigate, featureFlags = {} }) => {
  const [mascotMood, setMascotMood] = useState('happy');
  const [mascotMessage, setMascotMessage] = useState('');
  
  const completedLessons = user?.completed_lessons?.length || 0;
  const totalLessons = 20;
  const completionPercentage = (completedLessons / totalLessons) * 100;
  const currentLevel = user?.current_level || 1;
  const currentLevelXP = (user?.total_xp || 0) % 100;

  useEffect(() => {
    const streak = user?.current_streak || 0;
    
    if (streak >= 7) {
      setMascotMood('celebrating');
      setMascotMessage('Amazing streak! 🔥');
    } else if (completedLessons === 0) {
      setMascotMood('excited');
      setMascotMessage("Let's start learning!");
    } else if (completedLessons > 5) {
      setMascotMood('happy');
      setMascotMessage("You're doing great!");
    } else {
      setMascotMood('happy');
      setMascotMessage('Ready to learn?');
    }
  }, [user, completedLessons]);

  const quickActions = [
    {
      icon: BookOpen,
      title: "Continue Learning",
      description: "Pick up where you left off in your learning path",
      color: "blue",
      onClick: () => onNavigate('learning')
    },
    {
      icon: Bot,
      title: "AI Interview",
      description: "Practice with our AI interviewer for realistic case prep",
      color: "purple",
      onClick: () => onNavigate('ai-interview')
    },
    {
      icon: Play,
      title: "Case Simulator",
      description: "Solve real consulting cases from top firms",
      color: "green",
      onClick: () => onNavigate('cases')
    },
    {
      icon: BarChart3,
      title: "View Progress",
      description: "Track your learning journey and skill development",
      color: "orange",
      onClick: () => onNavigate('progress')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="mb-4"
        >
          <CaseMascot mood={mascotMood} message={mascotMessage} size="lg" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-2"
        >
          Welcome back, {user?.email?.split('@')[0] || 'Consultant'}! 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg"
        >
          Ready to level up your consulting skills today?
        </motion.p>
      </div>

      {/* Next Best Action - Feature Flagged */}
      {featureFlags.nextBestAction && (
        <NextBestAction 
          userStats={user}
          weakAreas={user?.weakAreas || []}
          onAction={(actionType, data) => {
            switch(actionType) {
              case 'quick_lesson':
                onNavigate('learning');
                break;
              case 'review':
                onNavigate('review', data);
                break;
              case 'continue_module':
                onNavigate('learning');
                break;
              case 'new_case':
                onNavigate('cases');
                break;
            }
          }}
        />
      )}

      {/* Streak Protection - Feature Flagged */}
      {featureFlags.nextBestAction && (
        <StreakProtection 
          userStats={user}
          onUseFreeze={() => {
            console.log('Using streak freeze');
          }}
          onBuyFreeze={() => {
            onNavigate('store');
          }}
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard
          icon={Target}
          title="Current Level"
          value={currentLevel}
          color="blue"
          onClick={() => onNavigate('progress')}
          tooltip="Your level increases as you earn XP. Each level = 100 XP!"
        />
        <QuickStatCard
          icon={BookOpen}
          title="Lessons Completed"
          value={completedLessons}
          color="green"
          onClick={() => onNavigate('learning')}
          tooltip="Track how many lessons you've finished. Keep going!"
        />
        <QuickStatCard
          icon={Flame}
          title="Current Streak"
          value={`${user?.current_streak || 0} days`}
          color="orange"
          onClick={() => onNavigate('progress')}
          tooltip="Practice daily to build your streak. Don't break the chain!"
        />
        <QuickStatCard
          icon={Star}
          title="Case Coins"
          value={user?.caseCoins || 0}
          color="purple"
          onClick={() => onNavigate('store')}
          tooltip="Earn coins by completing lessons. Spend them in the store!"
        />
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Progress</h2>
            <p className="text-gray-600 mb-4">
              You've completed {completedLessons} out of {totalLessons} lessons
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level {currentLevel} Progress</span>
                <span>{currentLevelXP}/100 XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentLevelXP}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-blue-600 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <ProgressRing percentage={completionPercentage} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What would you like to do?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ActionCard {...action} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Beginner Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Getting Started Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Start with Learning Path:</strong> Follow structured lessons to build your foundation</li>
              <li>• <strong>Practice Daily:</strong> Even 10 minutes a day helps build your streak and skills</li>
              <li>• <strong>Try AI Interview:</strong> Get comfortable with case interviews in a safe environment</li>
              <li>• <strong>Earn & Spend Coins:</strong> Complete lessons to earn coins, use them for helpful items</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
