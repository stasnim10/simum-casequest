/*
 * CaseQuest App
 * Copyright (c) 2025 stasnim10
 * Licensed under MIT License
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, User, BookOpen, Trophy, Star, Flame, 
  Menu, X, Play, CheckCircle, Lock, ArrowRight,
  BarChart3, Users, TrendingUp, DollarSign,
  Clock, Award, Activity, ChevronRight
} from 'lucide-react';
import LandingPage from './LandingPage';
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Context for global state management
const AppContext = createContext();

// Sample data for modules, lessons, and cases
const SAMPLE_MODULES = [
  {
    id: 'module-1',
    title: 'The Consulting Mindset',
    description: 'Master the fundamentals of structured problem solving and case interview basics',
    category: 'fundamentals',
    difficulty: 'beginner',
    xp_reward: 100,
    prerequisites: [],
    order_index: 1,
    estimated_duration: 45,
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'What is a Case Interview?',
        content: 'A case interview is a job interview in which the candidate is given a business scenario and asked to solve a business problem. This format is commonly used by consulting firms to assess analytical thinking, problem-solving skills, and communication abilities.',
        xp_reward: 25,
        order_index: 1
      },
      {
        id: 'lesson-1-2',
        title: 'Structured Problem Solving (MECE)',
        content: 'MECE stands for Mutually Exclusive, Collectively Exhaustive. This principle ensures that your analysis covers all possibilities without overlap. It\'s the foundation of consulting problem-solving methodology.',
        xp_reward: 25,
        order_index: 2
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Core Framework: Profitability',
    description: 'Learn to analyze business profitability using structured frameworks',
    category: 'frameworks',
    difficulty: 'beginner',
    xp_reward: 150,
    prerequisites: ['module-1'],
    order_index: 2,
    estimated_duration: 60,
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'The Profit Equation',
        content: 'Profit = Revenue - Costs. This simple equation is the foundation of profitability analysis. Understanding how to break down each component is crucial for case interviews.',
        xp_reward: 30,
        order_index: 1
      },
      {
        id: 'lesson-2-2',
        title: 'Breaking Down Revenues',
        content: 'Revenue = Price × Volume. Learn how to analyze pricing strategies and volume drivers to understand revenue generation.',
        xp_reward: 30,
        order_index: 2
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Market Study Framework',
    description: 'Master market analysis and competitive landscape evaluation',
    category: 'frameworks',
    difficulty: 'intermediate',
    xp_reward: 200,
    prerequisites: ['module-2'],
    order_index: 3,
    estimated_duration: 75,
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Market Sizing Techniques',
        content: 'Learn top-down and bottom-up approaches to estimate market size. Practice with real examples and develop your quantitative reasoning skills.',
        xp_reward: 40,
        order_index: 1
      }
    ]
  }
];

const SAMPLE_CASES = [
  {
    id: 'case-1',
    title: 'GameBox Profitability',
    industry: 'Entertainment',
    difficulty: 'beginner',
    case_prompt: 'GameBox is a video game retailer that has been experiencing declining profits over the past two years. The CEO has hired you to identify the root causes and recommend solutions. How would you approach this problem?',
    key_questions: [
      'What are the main drivers of profitability?',
      'How has the gaming industry changed recently?',
      'What are GameBox\'s competitive advantages?'
    ],
    sample_solution: 'I would structure this as a profitability problem using the Profit = Revenue - Costs framework. First, I\'d analyze revenue trends by examining: 1) Price changes in their product mix, 2) Volume changes in units sold, 3) Market share shifts. Then I\'d examine cost structure including: 1) Fixed costs (rent, salaries), 2) Variable costs (inventory, shipping). Finally, I\'d consider external factors like digital gaming trends and competitive landscape.'
  }
];

// Authentication Component
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          total_xp: 0,
          current_streak: 0,
          longest_streak: 0,
          current_level: 1,
          last_active_date: null,
          completed_lessons: [],
          completed_modules: [],
          skill_level: 'beginner'
        });
      }
      onLogin();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CaseQuest</h1>
          <p className="text-gray-600 mt-2">Master consulting case interviews</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Target },
    { id: 'home', label: 'Dashboard', icon: BarChart3 },
    { id: 'learning', label: 'Learning Path', icon: BookOpen },
    { id: 'cases', label: 'Case Simulator', icon: Play },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white rounded-lg p-2 shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: 0 }}
        className={`static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center p-6 border-b">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">CaseQuest</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">Level {user?.current_level || 1}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full text-left text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`${bgColor} rounded-xl p-6 shadow-sm`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
  </motion.div>
);

// Dashboard Component
const Dashboard = ({ user }) => {
  const stats = [
    {
      title: 'Current Streak',
      value: `${user?.current_streak || 0} days`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Total XP',
      value: user?.total_xp || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Current Level',
      value: user?.current_level || 1,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Modules Completed',
      value: user?.completed_modules?.length || 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'Consultant'}! 👋
        </h1>
        <p className="text-gray-600">Ready to continue your consulting journey?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Play className="h-6 w-6 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Continue Learning</p>
              <p className="text-sm text-gray-600">Pick up where you left off</p>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Target className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Practice Cases</p>
              <p className="text-sm text-gray-600">Solve real case studies</p>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View Progress</p>
              <p className="text-sm text-gray-600">Track your improvement</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {user?.completed_lessons?.length > 0 ? (
            user.completed_lessons.slice(-3).map((lessonId, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Completed Lesson</p>
                  <p className="text-sm text-gray-600">Lesson ID: {lessonId}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity yet. Start learning to see your progress here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Module Card Component
const ModuleCard = ({ module, isLocked, onStart, userProgress }) => {
  const completedLessons = userProgress?.completed_lessons || [];
  const moduleProgress = module.lessons ? 
    (module.lessons.filter(lesson => completedLessons.includes(lesson.id)).length / module.lessons.length) * 100 : 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      className={`bg-white rounded-xl shadow-sm p-6 ${isLocked ? 'opacity-60' : 'hover:shadow-md'} transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{module.description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
              {module.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {module.category}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              {module.xp_reward} XP
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {module.estimated_duration} min
            </div>
          </div>
        </div>
        
        {isLocked ? (
          <Lock className="h-6 w-6 text-gray-400" />
        ) : (
          <button
            onClick={() => onStart(module)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Start
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${moduleProgress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{Math.round(moduleProgress)}% complete</p>
    </motion.div>
  );
};

// Learning Path Component
const LearningPath = ({ user, onUpdateUser }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  const isModuleLocked = (module) => {
    if (module.prerequisites.length === 0) return false;
    return !module.prerequisites.every(prereq => 
      user?.completed_modules?.includes(prereq)
    );
  };

  const startModule = (module) => {
    setSelectedModule(module);
    setCurrentLesson(module.lessons[0]);
  };

  const completeLesson = async (lesson) => {
    const updatedUser = {
      ...user,
      completed_lessons: [...(user.completed_lessons || []), lesson.id],
      total_xp: (user.total_xp || 0) + lesson.xp_reward
    };

    // Check if module is complete
    const moduleComplete = selectedModule.lessons.every(l => 
      updatedUser.completed_lessons.includes(l.id)
    );

    if (moduleComplete && !updatedUser.completed_modules?.includes(selectedModule.id)) {
      updatedUser.completed_modules = [...(updatedUser.completed_modules || []), selectedModule.id];
      updatedUser.total_xp += selectedModule.xp_reward;
    }

    // Update level based on XP
    updatedUser.current_level = Math.floor(updatedUser.total_xp / 100) + 1;

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), updatedUser);
      onUpdateUser(updatedUser);
      
      // Move to next lesson or back to module list
      const currentIndex = selectedModule.lessons.findIndex(l => l.id === lesson.id);
      if (currentIndex < selectedModule.lessons.length - 1) {
        setCurrentLesson(selectedModule.lessons[currentIndex + 1]);
      } else {
        setSelectedModule(null);
        setCurrentLesson(null);
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };

  if (currentLesson) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentLesson(null)}
              className="text-blue-600 hover:text-blue-700 mb-4"
            >
              ← Back to {selectedModule.title}
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 mr-1" />
              {currentLesson.xp_reward} XP
            </div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">{currentLesson.content}</p>
          </div>
          
          <button
            onClick={() => completeLesson(currentLesson)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            Complete Lesson
            <CheckCircle className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <button
            onClick={() => setSelectedModule(null)}
            className="text-blue-600 hover:text-blue-700 mb-6"
          >
            ← Back to Learning Path
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedModule.title}</h1>
          <p className="text-gray-600 mb-6">{selectedModule.description}</p>
          
          <div className="space-y-4">
            {selectedModule.lessons.map((lesson, index) => {
              const isCompleted = user?.completed_lessons?.includes(lesson.id);
              const isAccessible = index === 0 || user?.completed_lessons?.includes(selectedModule.lessons[index - 1].id);
              
              return (
                <motion.div
                  key={lesson.id}
                  whileHover={{ scale: isAccessible ? 1.01 : 1 }}
                  className={`border rounded-lg p-4 ${
                    isCompleted ? 'bg-green-50 border-green-200' :
                    isAccessible ? 'bg-white border-gray-200 hover:border-blue-300' :
                    'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                      ) : isAccessible ? (
                        <Play className="h-6 w-6 text-blue-600 mr-3" />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400 mr-3" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 mr-1" />
                          {lesson.xp_reward} XP
                        </div>
                      </div>
                    </div>
                    
                    {isAccessible && !isCompleted && (
                      <button
                        onClick={() => setCurrentLesson(lesson)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path</h1>
        <p className="text-gray-600">Master consulting skills through structured modules</p>
      </div>

      <div className="grid gap-6">
        {SAMPLE_MODULES.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isLocked={isModuleLocked(module)}
            onStart={startModule}
            userProgress={user}
          />
        ))}
      </div>
    </div>
  );
};
// Case Card Component
const CaseCard = ({ caseStudy, onSelect }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onSelect(caseStudy)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{caseStudy.title}</h3>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(caseStudy.difficulty)}`}>
              {caseStudy.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {caseStudy.industry}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-3">{caseStudy.case_prompt}</p>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-400 ml-4" />
      </div>
    </motion.div>
  );
};

// Case Simulator Component
const CaseSimulator = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const handleSubmitResponse = () => {
    setShowSolution(true);
  };

  const resetCase = () => {
    setSelectedCase(null);
    setUserResponse('');
    setShowSolution(false);
  };

  if (selectedCase) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <button
            onClick={resetCase}
            className="text-blue-600 hover:text-blue-700 mb-6"
          >
            ← Back to Cases
          </button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCase.title}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedCase.industry}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {selectedCase.difficulty}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Prompt</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">{selectedCase.case_prompt}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Questions to Consider</h2>
            <ul className="space-y-2">
              {selectedCase.key_questions.map((question, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Response</h2>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Structure your approach to solving this case. Think about frameworks, key issues, and your analysis..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={showSolution}
            />
          </div>

          {!showSolution ? (
            <button
              onClick={handleSubmitResponse}
              disabled={!userResponse.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Response
            </button>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Model Answer</h3>
                <p className="text-green-800 leading-relaxed">{selectedCase.sample_solution}</p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={resetCase}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Another Case
                </button>
                <button
                  onClick={() => {
                    setUserResponse('');
                    setShowSolution(false);
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Simulator</h1>
        <p className="text-gray-600">Practice with real consulting case studies</p>
      </div>

      <div className="grid gap-6">
        {SAMPLE_CASES.map((caseStudy) => (
          <CaseCard
            key={caseStudy.id}
            caseStudy={caseStudy}
            onSelect={setSelectedCase}
          />
        ))}
      </div>
    </div>
  );
};

// Progress Component
const Progress = ({ user }) => {
  const totalLessons = SAMPLE_MODULES.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
  const completedLessons = user?.completed_lessons?.length || 0;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const categoryProgress = SAMPLE_MODULES.reduce((acc, module) => {
    const category = module.category;
    if (!acc[category]) {
      acc[category] = { completed: 0, total: 0 };
    }
    acc[category].total += module.lessons?.length || 0;
    acc[category].completed += module.lessons?.filter(lesson => 
      user?.completed_lessons?.includes(lesson.id)
    ).length || 0;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your consulting skills development</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Lessons Completed</span>
              <span>{completedLessons}/{totalLessons}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Level</h3>
            <Trophy className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-2">{user?.current_level || 1}</p>
          <p className="text-sm text-gray-600">
            {((user?.total_xp || 0) % 100)} / 100 XP to next level
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((user?.total_xp || 0) % 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
            <Flame className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-2">{user?.current_streak || 0}</p>
          <p className="text-sm text-gray-600">
            Longest: {user?.longest_streak || 0} days
          </p>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress by Category</h2>
        <div className="space-y-4">
          {Object.entries(categoryProgress).map(([category, progress]) => {
            const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 capitalize">{category}</span>
                  <span className="text-sm text-gray-600">
                    {progress.completed}/{progress.total} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{Math.round(percentage)}% complete</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h2>
        <div className="space-y-4">
          {user?.completed_modules?.length > 0 ? (
            user.completed_modules.map((moduleId, index) => {
              const module = SAMPLE_MODULES.find(m => m.id === moduleId);
              return module ? (
                <div key={index} className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-600 mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">Module Completed!</p>
                    <p className="text-sm text-gray-600">{module.title}</p>
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Complete your first module to earn achievements!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    // This will be handled by the auth state change listener
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserData = (newData) => {
    setUserData(newData);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <LandingPage user={userData} onNavigate={setCurrentPage} />;
      case 'home':
        return <Dashboard user={userData} />;
      case 'learning':
        return <LearningPath user={userData} onUpdateUser={updateUserData} />;
      case 'cases':
        return <CaseSimulator />;
      case 'progress':
        return <Progress user={userData} />;
      default:
        return <LandingPage user={userData} onNavigate={setCurrentPage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading CaseQuest...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <AppContext.Provider value={{ user: userData, updateUser: updateUserData }}>
      <div className="min-h-screen gradient-bg">
        {currentPage === 'dashboard' ? (
          // Full-screen Duolingo-style layout for dashboard
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        ) : (
          // Traditional sidebar layout for other pages
          <div className="flex">
            <Sidebar
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              user={userData}
              onLogout={handleLogout}
            />
            
            <main className="flex-1 lg:ml-0 p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderCurrentPage()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
