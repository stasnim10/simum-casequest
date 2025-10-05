import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Bot, Trophy, TrendingUp, 
  Target, Star, Flame, Award, 
  ArrowRight, Play, BarChart3 
} from 'lucide-react';

const QuickStatCard = ({ icon: Icon, title, value, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </motion.div>
);

const ActionCard = ({ icon: Icon, title, description, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all group"
  >
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-lg bg-${color}-100 group-hover:bg-${color}-200 transition-colors`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex items-center text-blue-600 text-sm font-medium">
          Get Started <ArrowRight className="h-4 w-4 ml-1" />
        </div>
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

const Dashboard = ({ user, onNavigate }) => {
  const completedLessons = user?.completed_lessons?.length || 0;
  const totalLessons = 20; // Assuming 20 total lessons
  const completionPercentage = (completedLessons / totalLessons) * 100;
  const currentLevel = user?.current_level || 1;
  const currentLevelXP = (user?.total_xp || 0) % 100;

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard
          icon={Target}
          title="Current Level"
          value={currentLevel}
          color="blue"
          onClick={() => onNavigate('progress')}
        />
        <QuickStatCard
          icon={BookOpen}
          title="Lessons Completed"
          value={completedLessons}
          color="green"
          onClick={() => onNavigate('learning')}
        />
        <QuickStatCard
          icon={Flame}
          title="Current Streak"
          value={`${user?.current_streak || 0} days`}
          color="orange"
          onClick={() => onNavigate('progress')}
        />
        <QuickStatCard
          icon={Star}
          title="Case Coins"
          value={user?.caseCoins || 0}
          color="purple"
          onClick={() => onNavigate('store')}
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
    </div>
  );
};

export default Dashboard;
