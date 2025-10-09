import { useState } from 'react';

export default function useCaseFeedback() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function requestFeedback(payload) {
    setLoading(true); setError(null);
    try {
      const res = await fetch(
        import.meta.env.VITE_FEEDBACK_URL || 'http://localhost:8787/api/feedback',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const json = await res.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, data, error, requestFeedback };
}
