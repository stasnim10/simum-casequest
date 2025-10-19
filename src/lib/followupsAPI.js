const API_URL = import.meta.env.VITE_FEEDBACK_URL?.replace('/feedback', '/followups') || 'https://api.casequestapp.com/api/followups';

export async function fetchAIFollowups({ step, caseTitle, userAnswer, previousAnswers }) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, caseTitle, userAnswer, previousAnswers })
    });
    
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.followups || [];
  } catch (err) {
    console.warn('AI followups failed, using fallback:', err);
    return null;
  }
}
