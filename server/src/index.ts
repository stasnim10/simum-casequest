import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 8787;

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: ['https://www.casequestapp.com', 'https://stasnim10.github.io', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '60'),
  message: { error: 'Too many requests' }
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { userId, caseId, steps } = req.body;

    // Validate required fields
    if (!userId || !caseId || !steps) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock AI feedback response
    const feedback = {
      strengths: [
        'Clear problem identification',
        'Structured approach to analysis',
        'Quantitative reasoning demonstrated'
      ],
      gaps: [
        'Could explore alternative frameworks',
        'Missing competitive analysis',
        'Recommendation lacks implementation timeline'
      ],
      actionItems: [
        'Practice MECE framework application',
        'Include 2-3 specific action steps in recommendations',
        'Quantify expected impact of recommendations'
      ],
      scorecard: {
        communication: 4,
        structure: 4,
        quantitative: 4,
        synthesis: 3,
        overall: '15'
      }
    };

    // Log for debugging
    console.log(`Feedback request: userId=${userId}, caseId=${caseId}`);

    res.json(feedback);
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`CaseQuest API listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
