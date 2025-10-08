// Safe no-op hook for build-time.
// Replace with real environment wiring when ready.
import { useMemo } from 'react';

export function useFeedbackEnv() {
  // Provide defaults that won't break the UI
  return useMemo(() => ({
    enabled: false,
    apiBase: '/api',
    apiKey: null,
    model: 'gpt-4o-mini', // placeholder
  }), []);
}

export default useFeedbackEnv;
