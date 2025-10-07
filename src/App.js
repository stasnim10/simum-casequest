
import React, { useState, useEffect, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, User, BookOpen, Trophy, Star, Flame, 
  Menu, X, Play, CheckCircle, Lock, ArrowRight,
  BarChart3, TrendingUp, ChevronRight,
  Award, ShoppingCart, Bot, Mic
} from 'lucide-react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import GuidedPath from './GuidedPath';
import LessonScreen from './LessonScreen';
import GamificationHeader from './GamificationHeader';
import Store from './Store';
import Leaderboard from './Leaderboard';
import Progress from './Progress';
import CaseSimulator from './CaseSimulator';
import AICaseInterview from './components/AICaseInterview';
import OnboardingTutorial from './components/OnboardingTutorial';
import EnhancedOnboarding from './components/EnhancedOnboarding';
import SessionSummary from './components/SessionSummary';
import ReviewSession from './components/ReviewSession';
import HelpButton from './components/HelpButton';
import CelebrationAnimation from './components/CelebrationAnimation';
import remoteConfig from './services/remoteConfig';
import analytics from './services/analytics';
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
  increment,
  writeBatch
} from 'firebase/firestore';

const AppContext = createContext();

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
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          total_xp: 0,
          current_streak: 0,
          longest_streak: 0,
          current_level: 1,
          last_active_date: null,
          completed_lessons: [],
          skill_level: 'beginner',
          caseCoins: 0,
          inventory: {},
          email: userCredential.user.email,
          hasSeenOnboarding: false
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
          <h1 className="text-3xl font-bold text-gray-900">CaseQuest</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 mt-6">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { id: 'home', label: 'Home', icon: Target, desc: 'Your main hub' },
    { id: 'learning', label: 'Learn', icon: BookOpen, desc: 'Structured lessons' },
    { id: 'cases', label: 'Cases', icon: Play, desc: 'Practice cases' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, desc: 'Track growth' },
  ];

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50">
        {isOpen ? <X /> : <Menu />}
      </button>
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b"><h1 className="text-xl font-bold">CaseQuest</h1></div>
          <nav className="flex-1 p-4">
            <ul>
              {menuItems.map(item => (
                <li key={item.id}>
                  <button onClick={() => { setCurrentPage(item.id); setIsOpen(false); }} className={`w-full flex items-center p-3 rounded-lg mb-1 ${currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <p>{user?.email?.split('@')[0] || 'User'}</p>
            <button onClick={onLogout}>Sign Out</button>
          </div>
        </div>
      </div>
      {isOpen && <div onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 bg-black opacity-50 z-30" />} 
    </>
  );
};

// Dashboard component is now imported from separate file

const MainLearningScreen = ({ user, lessons, onStartLesson }) => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Guided Mastery Path</h1>
      <p className="text-gray-600">Complete lessons in order to unlock new challenges and skills.</p>
    </div>
    <GuidedPath lessons={lessons} userProgress={user} onStartLesson={onStartLesson} />
  </div>
);

const AIInterviewSelector = ({ onStartInterview }) => {
  const caseTypes = [
    { 
      id: 'market-sizing', 
      name: 'Market Sizing', 
      description: 'Estimate market size and potential',
      beginner: 'Great for beginners! Learn to estimate numbers logically.',
      difficulty: 'Beginner Friendly'
    },
    { 
      id: 'profitability', 
      name: 'Profitability', 
      description: 'Analyze profit drivers and optimization',
      beginner: 'Understand how businesses make money.',
      difficulty: 'Intermediate'
    },
    { 
      id: 'market-entry', 
      name: 'Market Entry', 
      description: 'Strategic market entry decisions',
      beginner: 'Learn how companies decide to enter new markets.',
      difficulty: 'Intermediate'
    },
    { 
      id: 'operations', 
      name: 'Operations', 
      description: 'Operational efficiency and process improvement',
      beginner: 'Improve business processes and efficiency.',
      difficulty: 'Advanced'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Case Interview Practice</h1>
        <p className="text-gray-600 mb-4">Practice with our AI interviewer. Get real-time feedback on your approach.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            💡 <strong>How it works:</strong> Choose a case type, then speak or type your answers. 
            The AI will guide you through the case and provide feedback on your problem-solving approach.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseTypes.map((caseType) => (
          <motion.div
            key={caseType.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onStartInterview(caseType.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                {caseType.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseType.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{caseType.beginner}</p>
            <div className="flex items-center text-blue-600 text-sm">
              <Mic className="w-4 h-4 mr-2" />
              <span>Voice & Text Enabled</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Components are now imported from separate files

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // New UX states
  const [showEnhancedOnboarding, setShowEnhancedOnboarding] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionSummaryData, setSessionSummaryData] = useState(null);
  const [featureFlags, setFeatureFlags] = useState({});
  
  const [lessons, setLessons] = useState([]);
  const [cases, setCases] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentAIInterview, setCurrentAIInterview] = useState(null);

  // Initialize Remote Config on app start
  useEffect(() => {
    const initializeRemoteConfig = async () => {
      await remoteConfig.initialize();
      if (user) {
        setFeatureFlags({
          enhancedOnboarding: remoteConfig.isEnhancedOnboardingEnabled(user.uid),
          nextBestAction: remoteConfig.isNextBestActionEnabled(user.uid),
          sessionSummary: remoteConfig.isSessionSummaryEnabled(user.uid)
        });
      }
    };
    initializeRemoteConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Set feature flags for this user
        setFeatureFlags({
          enhancedOnboarding: remoteConfig.isEnhancedOnboardingEnabled(user.uid),
          nextBestAction: remoteConfig.isNextBestActionEnabled(user.uid),
          sessionSummary: remoteConfig.isSessionSummaryEnabled(user.uid)
        });
        
        // Track feature flag states for cohort analysis
        analytics.setFeatureFlagState('enhanced_onboarding', remoteConfig.isEnhancedOnboardingEnabled(user.uid));
        analytics.setFeatureFlagState('next_best_action', remoteConfig.isNextBestActionEnabled(user.uid));
        analytics.setFeatureFlagState('session_summary', remoteConfig.isSessionSummaryEnabled(user.uid));
        
        // Track experiment variants
        analytics.setExperimentVariant('endowed_progress', `${remoteConfig.getEndowedProgressPercent()}pct`);
        analytics.setExperimentVariant('next_action_policy', remoteConfig.getNextActionPolicy());
        
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = { ...userDoc.data(), uid: user.uid };
            setUserData(data);
            
            // Track daily return
            if (data.lastActiveAt) {
              const daysSince = (Date.now() - data.lastActiveAt) / (1000 * 60 * 60 * 24);
              if (daysSince >= 1) {
                analytics.trackDailyReturn(Math.floor(daysSince));
              }
            }
            
            // Show appropriate onboarding
            if (!data.hasSeenOnboarding && !data.hasCompletedOnboarding) {
              if (featureFlags.enhancedOnboarding) {
                setShowEnhancedOnboarding(true);
              } else {
                setShowOnboarding(true);
              }
            }
          } else {
             await setDoc(doc(db, 'users', user.uid), {
              total_xp: 0,
              current_streak: 0,
              longest_streak: 0,
              current_level: 1,
              last_active_date: null,
              lastActiveAt: Date.now(),
              completed_lessons: [],
              skill_level: 'beginner',
              caseCoins: 0,
              inventory: {},
              email: user.email,
              hasSeenOnboarding: false,
              hasCompletedOnboarding: false
            });
            const newUserDoc = await getDoc(doc(db, 'users', user.uid));
            setUserData({ ...newUserDoc.data(), uid: user.uid });
            setShowOnboarding(true);
          }

          const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
          setLessons(lessonsSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));

          const casesSnapshot = await getDocs(collection(db, 'cases'));
          setCases(casesSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {};

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          hasSeenOnboarding: true
        });
      } catch (error) {
        console.error('Error updating onboarding status:', error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage('dashboard');
    setCurrentLesson(null);
    setCurrentAIInterview(null);
  };

  const updateUserData = (newData) => setUserData(newData);

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handlePurchaseItem = async (item) => {
    if (!userData || userData.caseCoins < item.cost) {
      console.log("Cannot purchase item");
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);

    try {
      const newCaseCoins = userData.caseCoins - item.cost;
      const newInventory = { ...userData.inventory };
      newInventory[item.itemId] = (newInventory[item.itemId] || 0) + 1;

      await updateDoc(userRef, {
        caseCoins: increment(-item.cost),
        inventory: newInventory
      });

      setUserData(prevData => ({
        ...prevData,
        caseCoins: newCaseCoins,
        inventory: newInventory
      }));

      alert(`${item.name} purchased successfully!`);

    } catch (error) {
      console.error("Error purchasing item:", error);
      alert("Failed to purchase item.");
    }
  };

  const handleCompleteLesson = async (xpEarned) => {
    if (!userData || !currentLesson) return;

    const userRef = doc(db, 'users', auth.currentUser.uid);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let { last_active_date, current_streak = 0, longest_streak = 0, inventory = {} } = userData;

    let newStreak = current_streak;
    const updateData = {
      completed_lessons: [...new Set([...(userData.completed_lessons || []), currentLesson.id])],
      total_xp: increment(xpEarned),
      caseCoins: increment(5),
      last_active_date: todayStr,
    };

    let usedStreakFreeze = false;

    if (last_active_date !== todayStr) {
      if (last_active_date === yesterdayStr) {
        newStreak = current_streak + 1;
      } else {
        if (inventory.streak_freeze && inventory.streak_freeze > 0) {
          updateData['inventory.streak_freeze'] = increment(-1);
          usedStreakFreeze = true;
        } else {
          newStreak = 1;
        }
      }
    }

    updateData.current_streak = newStreak;
    updateData.longest_streak = Math.max(newStreak, longest_streak);

    try {
      await updateDoc(userRef, updateData);

      const newTotalXp = (userData.total_xp || 0) + xpEarned;
      const newInventory = { ...inventory };
      if(usedStreakFreeze) {
        newInventory.streak_freeze = (newInventory.streak_freeze || 1) - 1;
      }

      setUserData(prevData => ({
        ...prevData,
        ...updateData,
        total_xp: newTotalXp,
        caseCoins: prevData.caseCoins + 5,
        current_level: Math.floor(newTotalXp / 100) + 1,
        inventory: newInventory,
        current_streak: newStreak,
        longest_streak: updateData.longest_streak
      }));

      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
      setCurrentLesson(null);
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  // Enhanced onboarding completion handler
  const handleEnhancedOnboardingComplete = async (settings) => {
    try {
      const cohortWeek = `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`;
      
      await updateDoc(doc(db, 'users', user.uid), {
        ...settings,
        lastActiveAt: Date.now(),
        cohortWeek,
        hasCompletedOnboarding: true
      });
      
      setUserData(prev => ({ ...prev, ...settings, hasCompletedOnboarding: true }));
      setShowEnhancedOnboarding(false);
      
      analytics.setUserCohort(cohortWeek);
      analytics.setOnboardingComplete(true);
      analytics.trackFirstLessonStart();
    } catch (error) {
      console.error("Error completing enhanced onboarding:", error);
    }
  };

  // Enhanced lesson completion with session summary
  const handleEnhancedLessonComplete = (lessonResults) => {
    const isFirstLesson = !userData.hasCompletedOnboarding || userData.completed_lessons?.length === 0;
    
    // Complete lesson with existing logic
    handleCompleteLesson(lessonResults.xpEarned || 50);
    
    // Show session summary if enabled
    if (featureFlags.sessionSummary) {
      const sessionData = {
        xpEarned: lessonResults.xpEarned || 50,
        streakExtended: true,
        skillsImproved: lessonResults.skillsImproved || [],
        sessionLength: lessonResults.timeSpent || 5,
        accuracy: lessonResults.accuracy || 0,
        nextRecommendation: "Continue with your next lesson",
        isFirstLesson
      };
      
      setSessionSummaryData(sessionData);
      setShowSessionSummary(true);
      
      if (isFirstLesson) {
        analytics.trackFirstLessonComplete(lessonResults.timeSpent * 60 || 300);
      }
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <LandingPage user={userData} onNavigate={setCurrentPage} />;
      case 'home':
        return <Dashboard user={userData} onNavigate={setCurrentPage} featureFlags={featureFlags} />;
      case 'learning':
        return <MainLearningScreen user={userData} lessons={lessons} onStartLesson={handleStartLesson} />;
      case 'cases':
        return <CaseSimulator cases={cases} onNavigate={setCurrentPage} />;
      case 'progress':
        return <Progress user={userData} lessons={lessons} />;
      // Redirect removed pages to main sections
      case 'ai-interview':
        return <AIInterviewSelector onStartInterview={setCurrentAIInterview} />;
      case 'store':
        return <Dashboard user={userData} onNavigate={setCurrentPage} featureFlags={featureFlags} />;
      case 'leaderboard':
        return <Progress user={userData} lessons={lessons} />;
      default:
        return <Dashboard user={userData} onNavigate={setCurrentPage} featureFlags={featureFlags} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (currentAIInterview) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="ai-interview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <AICaseInterview 
            caseType={currentAIInterview} 
            onComplete={() => setCurrentAIInterview(null)} 
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (currentLesson) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="lesson-screen"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <LessonScreen 
            lesson={currentLesson} 
            onComplete={handleCompleteLesson}
            onBack={() => setCurrentLesson(null)}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AppContext.Provider value={{ user: userData, updateUser: updateUserData }}>
      <div className="min-h-screen gradient-bg">
        {showOnboarding && <OnboardingTutorial onComplete={handleOnboardingComplete} />}
        {showCelebration && <CelebrationAnimation />}
        <HelpButton />
        {currentPage === 'dashboard' ? (
          <AnimatePresence mode="wait">
            <motion.div key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} user={userData} onLogout={handleLogout} />
            <main className="flex-1 p-8">
              <GamificationHeader user={userData} /> 
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div key={currentPage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    {renderCurrentPage()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        )}
        
        {/* Enhanced UX Components */}
        {showEnhancedOnboarding && (
          <EnhancedOnboarding onComplete={handleEnhancedOnboardingComplete} />
        )}
        
        {showSessionSummary && (
          <SessionSummary 
            sessionData={sessionSummaryData}
            onContinue={() => {
              setShowSessionSummary(false);
              analytics.trackNextActionTaken('continue_from_summary');
            }}
            onClose={() => {
              setShowSessionSummary(false);
              analytics.trackNextActionTaken('close_summary');
            }}
          />
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
