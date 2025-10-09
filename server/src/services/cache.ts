import type { Firestore } from 'firebase-admin/firestore';
import type { FeedbackResponse } from '../types/feedback.js';

const memory = new Map<string, FeedbackResponse & { caseId: string; rubricVersion: string; createdAt: number }>();

export async function getCache(db: Firestore | null, key: string) {
  try {
    if (db) {
      const snap = await db.collection('ai_feedback_cache').doc(key).get();
      if (snap.exists) return snap.data() as any;
      return null;
    }
  } catch { /* fall through */ }
  return memory.get(key) ?? null;
}

export async function setCache(db: Firestore | null, key: string, value: FeedbackResponse & { caseId: string; rubricVersion: string; createdAt: number }) {
  try {
    if (db) {
      await db.collection('ai_feedback_cache').doc(key).set(value, { merge: false });
      return;
    }
  } catch { /* fall through */ }
  memory.set(key, value);
}
