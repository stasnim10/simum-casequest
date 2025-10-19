import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 8787;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

// AI Follow-ups endpoint
app.post('/api/followups', async (req, res) => {
  try {
    const { step, caseTitle, userAnswer, previousAnswers } = req.body;

    if (step === undefined || !caseTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock mode fallback
    if (!process.env.OPENAI_API_KEY || process.env.DEV_MOCK === '1') {
      const mockFollowups = [
        ['What clarifying questions would help narrow the scope?', 'What assumptions should we validate first?'],
        ['What is your 1-2 sentence hypothesis?', 'Which branch would you test first?'],
        ['Name the top 3 drivers to test.', 'How would you size the impact?'],
        ['Quantify revenue, cost, and margin.', 'What sensitivity would you run?'],
        ['State a crisp recommendation.', 'What metric would you monitor?']
      ];
      return res.json({ followups: mockFollowups[step] || mockFollowups[0] });
    }

    const stepNames = ['Clarifying Questions', 'Hypothesis', 'Framework', 'Quantitative Analysis', 'Recommendation'];
    const prompt = `You are an expert case interview coach. The candidate is working on: "${caseTitle}".
Current step: ${stepNames[step]}
${userAnswer ? `Their answer: "${userAnswer}"` : 'They just started this step.'}
${previousAnswers ? `Previous work: ${JSON.stringify(previousAnswers)}` : ''}

Generate 2 concise follow-up questions (max 15 words each) to guide them. Be specific and actionable.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100
    });

    const text = completion.choices[0].message.content || '';
    const followups = text.split('\n').filter(l => l.trim()).slice(0, 2).map(l => l.replace(/^\d+\.\s*/, '').trim());

    res.json({ followups: followups.length === 2 ? followups : ['What would you explore first?', 'What assumptions matter most?'] });
  } catch (error) {
    console.error('Followups error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
