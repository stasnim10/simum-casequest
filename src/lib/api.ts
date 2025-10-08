export async function postFeedback(baseUrl: string, payload: unknown, secret?: string) {
  const res = await fetch(`${baseUrl}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-casequest-secret': secret } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Feedback API error: ${res.status} - ${text}`);
  }
  return res.json();
}
