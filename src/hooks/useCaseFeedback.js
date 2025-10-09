import { useCallback, useMemo, useState } from 'react';

// Safe no-op feedback hook for build-time.
// Replace with real API wiring later.
export function useCaseFeedback() {
  const [status, setStatus] = useState('idle');     // idle | sending | done | error
  const [error, setError] = useState(null);

  const sendFeedback = useCallback(async (payload) => {
    try {
      setStatus('sending');
      // Simulate success path
      await Promise.resolve();
      setStatus('done');
      return { ok: true };
    } catch (e) {
      setError(e);
      setStatus('error');
      return { ok: false, error: e };
    }
  }, []);

  const state = useMemo(() => ({ status, error }), [status, error]);
  return { sendFeedback, ...state };
}

export default useCaseFeedback;
