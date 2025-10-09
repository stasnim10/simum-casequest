import { Router } from 'express';
import { z } from 'zod';
import { sha256 } from '../utils/hash.js';
import { getFeedbackFromModel } from '../services/openaiService.js';
import { initFirebase } from '../firebaseAdmin.js';
import type { FeedbackPayload, FeedbackResponse } from '../types/feedback.js';
import { getCache, setCache } from '../services/cache.js';

const router = Router();

const payloadSchema = z.object({
  userId: z.string().min(1),
  caseId: z.string().min(1),
  steps: z.array(z.object({
    name: z.enum(['clarifying','hypothesis','structure','quant','recommendation']),
    content: z.string().min(1),
  })).min(1),
  exhibits: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  rubricVersion: z.string().default('v1'),
});

function buildPrompt(p: FeedbackPayload) {
  const lines: string[] = [];
  lines.push('Evaluate this consulting case performance. Return JSON with keys: strengths[], gaps[], actionItems[], scorecard{structuring,quant,insight,communication,overall 0-100}, nextBestLessonId.');
  lines.push(`Rubric version: ${p.rubricVersion}`);
  lines.push(`Case ID: ${p.caseId} | User: ${p.userId}`);
  if (p.exhibits?.length) {
    lines.push('Exhibits:');
    for (const ex of p.exhibits) lines.push(`- [${ex.id}] ${ex.text}`);
  }
  lines.push('Steps:');
  for (const s of p.steps) lines.push(`- ${s.name}: ${s.content}`);
  lines.push('Return strict JSON only, no explanation.');
  return lines.join('\n');
}

function getDbOrNull() {
  try {
    return initFirebase();
  } catch {
    return null;
  }
}

router.post('/feedback', async (req, res) => {
  // Optional shared secret
  const secret = process.env.FEEDBACK_API_SECRET;
  if (secret && req.headers['x-casequest-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const p = parsed.data as FeedbackPayload;

  const cacheKey = sha256(JSON.stringify({ caseId: p.caseId, steps: p.steps, rubricVersion: p.rubricVersion }));
  const db = getDbOrNull();

  const cached = await getCache(db, cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const prompt = buildPrompt(p);
  const raw = await getFeedbackFromModel(prompt);

  let parsedJson: FeedbackResponse | null = null;
  try {
    parsedJson = JSON.parse(raw) as FeedbackResponse;
  } catch {
    return res.status(502).json({ error: 'Model returned invalid JSON', raw });
  }

  const toStore = { ...parsedJson, cached: false, caseId: p.caseId, rubricVersion: p.rubricVersion, createdAt: Date.now() };
  await setCache(db, cacheKey, toStore);
  res.json(toStore);
});

export default router;
