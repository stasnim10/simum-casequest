import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import './styles/globals.css';
import App from './App.jsx';
import { ensureSeededOnce } from './lib/seed';
import { initAnalytics, track } from './lib/analytics';

ensureSeededOnce({ storeKey: 'casequest-storage' });
initAnalytics(import.meta.env.VITE_POSTHOG_KEY, import.meta.env.VITE_POSTHOG_HOST);
track('app_started');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
