import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import LearningPath from './pages/LearningPath';
import LessonPlayer from './pages/LessonPlayer';
import CaseSimulator from './pages/CaseSimulator';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Review from './pages/Review';
import useStore from './state/store';

function App() {
  const { setUser } = useStore();

  useEffect(() => {
    // Check for demo mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') {
      const demoUser = {
        name: 'Demo',
        xp: 120,
        streak: 3,
        coins: 50,
      };
      setUser(demoUser);
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/learn"
          element={
            <Layout>
              <LearningPath />
            </Layout>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <Layout>
              <LessonPlayer />
            </Layout>
          }
        />
        <Route
          path="/case"
          element={
            <Layout>
              <CaseSimulator />
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
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <Layout>
              <Leaderboard />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
