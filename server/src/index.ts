import express from 'express';
import { securityHeaders, corsPolicy, rateLimit } from './middleware/security.js';
import health from './routes/health.js';
import feedback from './routes/feedback.js';
import { config } from './config.js';
import { initFirebase } from './firebaseAdmin.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(securityHeaders);
app.use(corsPolicy);
app.use(rateLimit);

initFirebase();
app.use('/api', health);
app.use('/api', feedback);

app.listen(config.port, () => {
  console.log(`CaseQuest server listening on http://localhost:${config.port}`);
});
