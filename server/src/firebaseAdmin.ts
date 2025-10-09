import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from './config.js';

export function initFirebase() {
  if (getApps().length === 0) {
    if (!config.firebaseProjectId || !config.firebaseClientEmail || !config.firebasePrivateKey) {
      console.warn('Firebase credentials incomplete - skipping initialization');
      return null;
    }
    initializeApp({
      credential: cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: config.firebasePrivateKey,
      }),
    });
  }
  return getFirestore();
}
