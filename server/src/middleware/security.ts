import helmet from 'helmet';
import cors from 'cors';
import type { RequestHandler } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from '../config.js';

export const securityHeaders = helmet();
export const corsPolicy = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (config.corsOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked'), false);
  },
  credentials: false,
});

const limiter = new RateLimiterMemory({
  points: 60,
  duration: 60,
});

export const rateLimit: RequestHandler = async (req, res, next) => {
  try {
    await limiter.consume(req.ip ?? 'anonymous');
    next();
  } catch {
    res.status(429).json({ error: 'Too Many Requests' });
  }
};
