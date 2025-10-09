import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, User, BookOpen, Trophy, Star, Flame, 
  Menu, X, Play, CheckCircle, Lock, ArrowRight,
  BarChart3, TrendingUp, ChevronRight,
  Award, ShoppingCart
} from 'lucide-react';
import LandingPage from './LandingPage';
import GuidedPath from './GuidedPath';
import LessonScreen from './LessonScreen';
import GamificationHeader from './GamificationHeader';
import Store from './Store';
import Leaderboard from './Leaderboard'; // Import Leaderboard
import AICaseSimulator from './AICaseSimulator'; // Import AICaseSimulator
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
import Layout from './components/Layout';
import { initAnalytics } from './lib/analytics';
import useStore from './state/store';

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
          email: userCredential.user.email // Store email
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
    { id: 'dashboard', label: 'Home', icon: Target },
    { id: 'home', label: 'Dashboard', icon: BarChart3 },
    { id: 'learning', label: 'Learning Path', icon: BookOpen },
    { id: 'cases', label: 'Case Simulator', icon: Play },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'store', label: 'Store', icon: ShoppingCart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }, // Add Leaderboard
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
                  <button onClick={() => { setCurrentPage(item.id); setIsOpen(false); }} className={`w-full flex items-center p-3 rounded-lg ${currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
                    <item.icon className="h-5 w-5 mr-3" /> {item.label}
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

const Dashboard = ({ user }) => (
  <div>
    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0] || 'Consultant'}! 👋</h1>
  </div>
);

const MainLearningScreen = ({ user, lessons, onStartLesson }) => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Guided Mastery Path</h1>
      <p className="text-gray-600">Complete lessons in order to unlock new challenges and skills.</p>
    </div>
    <GuidedPath lessons={lessons} userProgress={user} onStartLesson={onStartLesson} />
  </div>
);

const Progress = ({ user, lessons }) => { return <div>Progress</div> };

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const [lessons, setLessons] = useState([]);
  const [cases, setCases] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const { setUser: setStoreUser } = useStore();

  useEffect(() => {
    // Initialize analytics
    initAnalytics(import.meta.env.VITE_POSTHOG_KEY, import.meta.env.VITE_POSTHOG_HOST);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
        setStoreUser(user); // Also set user in Zustand store
      } else {
        setUser(null);
        setUserData(null);
        setStoreUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setStoreUser]);


  const fetchUserData = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };
  
  const handleLogin = () => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
      unsubscribe();
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handlePurchaseItem = async (item) => {
    if (!userData || userData.caseCoins < item.cost) {
      alert("Not enough CaseCoins!");
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

      setCurrentLesson(null);
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <LandingPage user={userData} onNavigate={setCurrentPage} />;
      case 'home':
        return <Dashboard user={userData} />;
      case 'learning':
        return <MainLearningScreen user={userData} lessons={lessons} onStartLesson={handleStartLesson} />;
      case 'cases':
        return <AICaseSimulator />;
      case 'progress':
        return <Progress user={userData} lessons={lessons} />;
      case 'store':
        return <Store user={userData} onPurchase={handlePurchaseItem} />;
      case 'leaderboard': // Render Leaderboard
        return <Leaderboard currentUser={userData} />;
      default:
        return <LandingPage user={userData} onNavigate={setCurrentPage} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
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
          <LessonScreen lesson={currentLesson} onComplete={handleCompleteLesson} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage user={userData} onNavigate={setCurrentPage} />} />
        <Route
          path="/learn"
          element={
            <Layout>
              <MainLearningScreen user={userData} lessons={lessons} onStartLesson={handleStartLesson} />
            </Layout>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <Layout>
              <LessonScreen lesson={currentLesson} onComplete={handleCompleteLesson} />
            </Layout>
          }
        />
        <Route
          path="/case"
          element={
            <Layout>
              <AICaseSimulator />
            </Layout>
          }
        />
        <Route
          path="/review"
          element={
            <Layout>
              <Review />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard user={userData} />
            </Layout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <Layout>
              <Leaderboard currentUser={userData} />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;