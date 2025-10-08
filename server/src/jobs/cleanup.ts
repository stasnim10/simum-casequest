import { initFirebase } from '../firebaseAdmin.js';
import { config } from '../config.js';

async function run() {
  // Safety: exit early if Firebase creds are not present
  if (!config.firebaseProjectId || !config.firebaseClientEmail || !config.firebasePrivateKey) {
    console.log('Cleanup: Firebase credentials missing. Skipping cleanup.');
    process.exit(0);
  }

  const db = initFirebase();
  if (!db) {
    console.log('Cleanup: Firebase initialization failed. Skipping cleanup.');
    process.exit(0);
  }

  const col = db.collection('ai_feedback_cache');

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  // Delete in batches to avoid timeouts
  let totalDeleted = 0;
  while (true) {
    const snap = await col.where('createdAt', '<', cutoff).limit(500).get();
    if (snap.empty) break;

    const batch = db.batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    totalDeleted += snap.size;
    console.log(`Cleanup: deleted ${snap.size} docs in this batch`);
  }

  console.log(`Cleanup complete. Total deleted: ${totalDeleted}`);
}

run().catch(err => {
  console.error('Cleanup job failed:', err);
  process.exit(1);
});
