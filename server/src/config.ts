import 'dotenv/config';

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 8787,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  openaiKey: process.env.OPENAI_API_KEY ?? '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(','),
};

if (!config.openaiKey) console.warn('Warning: OPENAI_API_KEY missing');
if (!config.firebaseProjectId) console.warn('Warning: FIREBASE_PROJECT_ID missing');
