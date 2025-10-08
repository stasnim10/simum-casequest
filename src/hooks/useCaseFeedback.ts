import { useState } from 'react';
import { postFeedback } from '../lib/api';

export type Step = { name: 'clarifying'|'hypothesis'|'structure'|'quant'|'recommendation'; content: string };
export type Exhibit = { id: string; text: string };

export function useCaseFeedback(baseUrl: string, secret?: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<null|string>(null);

  async function requestFeedback(userId: string, caseId: string, steps: Step[], exhibits?: Exhibit[], rubricVersion='v1') {
    setLoading(true); setError(null);
    try {
      const payload = { userId, caseId, steps, exhibits, rubricVersion };
      const res = await postFeedback(baseUrl, payload, secret);
      setData(res);
      return res;
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function reset() { setData(null); setError(null); setLoading(false); }

  return { loading, data, error, requestFeedback, reset };
}
