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
import ProgressOverview from './pages/ProgressOverview';
import Onboarding from './pages/Onboarding';
import { seedDemoData } from './data/seed';
import useStore from './state/store';

function ProtectedRoutes() {
  const onboarding = useStore((state) => state.onboarding);
  if (!onboarding.completed) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Layout />;
}

function OnboardingRoute() {
  const completed = useStore((state) => state.onboarding.completed);
  if (completed) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Onboarding />;
}

function App() {
  const navigate = useNavigate();
  const { setUser, onboarding } = useStore();

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

    if (!onboarding.completed && window.location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate, setUser, onboarding.completed]);

  const defaultFallback = onboarding.completed ? '/dashboard' : '/onboarding';

  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route
        path="/"
        element={
          onboarding.completed
            ? <Landing />
            : <Navigate to="/onboarding" replace />
        }
      />
      <Route element={<ProtectedRoutes />}>
        <Route path="/learn" element={<LearningPath />} />
        <Route path="/lesson/:id" element={<LessonPlayer />} />
        <Route path="/case" element={<Navigate to="/simulator/profitability-case-1" replace />} />
        <Route path="/simulator/:caseSlug" element={<CaseSimulator />} />
        <Route path="/market-sizing" element={<Navigate to="/lesson/ms1" replace />} />
        <Route path="/review" element={<Review />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/progress" element={<ProgressOverview />} />
      </Route>
      <Route path="*" element={<Navigate to={defaultFallback} replace />} />
    </Routes>
  );
}

export default App;
