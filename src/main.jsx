import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import './index.css';
import './styles/globals.css';
import App from './App.jsx';
import { ensureSeededOnce } from './lib/seed';
import { initAnalytics, track } from './lib/analytics';

// Initialize Sentry for error tracking
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration()
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  });
}

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
