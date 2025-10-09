export async function postFeedback(payload) {
  return { ok: true, status: 200, data: { received: true, payload } };
}
