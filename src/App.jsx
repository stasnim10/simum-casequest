import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import LearningPath from './pages/LearningPath';
import LessonPlayer from './pages/LessonPlayer';
import CaseSimulator from './pages/CaseSimulator';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Review from './pages/Review';
import MarketSizing from './pages/MarketSizing';
import { seedDemoData } from './data/seed';
import useStore from './state/store';

function App() {
  const navigate = useNavigate();
  const { setUser } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('demo') === '1') {
      const demoUser = seedDemoData();
      setUser(demoUser);
    }
    
    if (params.get('pitch') === '1') {
      const demoUser = seedDemoData();
      setUser(demoUser);
      navigate('/dashboard?pitch=1');
    }
  }, [navigate, setUser]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/learn" element={<LearningPath />} />
        <Route path="/lesson/:id" element={<LessonPlayer />} />
        <Route path="/case" element={<CaseSimulator />} />
        <Route path="/market-sizing" element={<MarketSizing />} />
        <Route path="/review" element={<Review />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
