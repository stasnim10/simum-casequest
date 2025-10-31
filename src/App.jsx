import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import LearningPath from './pages/LearningPath';
import LessonPlayer from './pages/LessonPlayer';
import CaseSimulator from './pages/CaseSimulator';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import { seedDemoData } from './data/seed';
import useStore from './state/store';

function App() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('demo') === '1' || params.get('pitch') === '1') {
      const demoUser = seedDemoData();
      setUser(demoUser);
      if (params.get('pitch') === '1') {
        navigate('/dashboard?pitch=1', { replace: true });
      }
    }
  }, [navigate, setUser]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<LearningPath />} />
        <Route path="/lesson/:id" element={<LessonPlayer />} />
        <Route path="/quiz/:lessonId" element={<Quiz />} />
        <Route path="/simulator" element={<Navigate to="/simulator/profitability-case-1" replace />} />
        <Route path="/simulator/:caseSlug" element={<CaseSimulator />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
