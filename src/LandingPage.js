import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Star, Flame, Trophy, Play, BookOpen, 
  BarChart3, Users, Clock, Award, ChevronDown,
  Mic, PenTool, Headphones, FileText
} from 'lucide-react';

const LandingPage = ({ user, onNavigate }) => {
  const progressPercent = user ? Math.min((user.total_xp || 0) / 100 * 100, 100) : 0;
  const dailyGoal = 50; // XP
  const dailyProgress = user ? Math.min((user.total_xp || 0) % dailyGoal, dailyGoal) : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Target className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-blue-600">CaseQuest</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
              <Flame className="text-orange-500 w-4 h-4 animate-pulse" />
              <span className="ml-2 font-semibold text-orange-800">{user?.current_streak || 0}</span>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">{user?.current_level || 1}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back! 👋</h2>
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-2 rounded-full">
            <Star className="mr-2 text-blue-600 w-5 h-5" />
            <span className="text-gray-700 font-medium">Ready to level up your consulting skills?</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Daily Goal</h3>
              <span className="text-sm text-gray-500">{dailyGoal} XP</span>
            </div>
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                  strokeDashoffset={100 - (dailyProgress / dailyGoal) * 100}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">{dailyProgress}/{dailyGoal}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Current Streak</h3>
              <Flame className="text-orange-500 w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-800">{user?.current_streak || 0}</span>
              <p className="text-sm text-gray-500 mt-1">days in a row</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Level</h3>
              <span className="text-sm text-gray-500">Consultant</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                <Trophy className="text-white w-6 h-6" />
              </div>
              <div className="ml-4">
                <span className="block font-bold text-gray-800">Level {user?.current_level || 1}</span>
                <span className="text-xs text-gray-500">{user?.total_xp || 0} XP total</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Learning Modules */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800">Consulting Mindset</h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">New</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Master structured problem solving</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                </div>
                <button 
                  onClick={() => onNavigate('learning', { module: 'consulting-mindset' })}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  Start
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800">Profitability</h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Review</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Analyze business profitability</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                </div>
                <button 
                  onClick={() => onNavigate('learning', { module: 'profitability' })}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  Practice
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800">Market Study</h3>
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">Hard</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Master market analysis</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                </div>
                <button 
                  onClick={() => onNavigate('learning')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Practice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Practice</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button 
              onClick={() => onNavigate('cases')}
              className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center h-24 hover:bg-gray-50 transition transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Mic className="text-green-600 w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Case Practice</span>
            </button>
            <button 
              onClick={() => onNavigate('learning')}
              className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center h-24 hover:bg-gray-50 transition transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <PenTool className="text-blue-600 w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Continue Path</span>
            </button>
            <button 
              onClick={() => onNavigate('progress')}
              className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center h-24 hover:bg-gray-50 transition transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <BarChart3 className="text-yellow-600 w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Progress</span>
            </button>
            <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center h-24 hover:bg-gray-50 transition transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="text-purple-600 w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Resources</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex flex-col items-center text-blue-600"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => onNavigate('progress')}
              className="flex flex-col items-center text-gray-500"
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs mt-1">Progress</span>
            </button>
            <button 
              onClick={() => onNavigate('learning')}
              className="flex flex-col items-center text-gray-500"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs mt-1">Learn</span>
            </button>
            <button 
              onClick={() => onNavigate('cases')}
              className="flex flex-col items-center text-gray-500"
            >
              <Play className="w-6 h-6" />
              <span className="text-xs mt-1">Cases</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LandingPage;
