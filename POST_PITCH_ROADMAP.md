# 🚀 CaseQuest Post-Pitch Enhancement Roadmap

**Status:** Ready for implementation after funding  
**Timeline:** 12-16 weeks  
**Priority:** High-impact features for user growth and monetization

---

## 📋 Overview

Four phases of enhancements to transform CaseQuest from MVP to scalable product:

1. **AI Integration** - Real AI feedback (4 weeks)
2. **Adaptive Learning** - Personalized recommendations (3 weeks)
3. **Analytics & Engagement** - Data-driven insights (3 weeks)
4. **Monetization Prep** - Revenue infrastructure (2 weeks)

---

## 🤖 Phase 1: AI Integration (4 weeks)

### Goal
Replace mock feedback with real AI-powered evaluation using OpenAI GPT-4o-mini.

### Implementation

#### 1.1 Node.js Backend (Week 1)
**Branch:** `ai-feedback`

**Setup:**
```bash
mkdir backend
cd backend
npm init -y
npm install express cors openai firebase-admin dotenv
```

**File Structure:**
```
backend/
├── server.js
├── routes/
│   └── feedback.js
├── services/
│   ├── openai.js
│   └── firestore.js
├── .env
└── package.json
```

**server.js:**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedback');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', feedbackRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### 1.2 OpenAI Integration (Week 2)
**services/openai.js:**
```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function evaluateCaseResponse(caseData) {
  const prompt = `
You are an expert consulting case interviewer. Evaluate this case response:

Case: ${caseData.caseTitle}
User's Hypothesis: ${caseData.hypothesis}
Framework Used: ${caseData.framework}
Quantitative Answer: ${caseData.quantAnswer}
Recommendation: ${caseData.recommendation}

Provide structured feedback in JSON format:
{
  "structure": { "score": 0-5, "feedback": "..." },
  "quantitative": { "score": 0-5, "feedback": "..." },
  "communication": { "score": 0-5, "feedback": "..." },
  "overall": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { evaluateCaseResponse };
```

#### 1.3 Feedback Endpoint (Week 2)
**routes/feedback.js:**
```javascript
const express = require('express');
const router = express.Router();
const { evaluateCaseResponse } = require('../services/openai');
const { cacheFeedback, getCachedFeedback } = require('../services/firestore');

router.post('/feedback', async (req, res) => {
  try {
    const { userId, caseId, responses } = req.body;
    
    // Check cache first
    const cached = await getCachedFeedback(userId, caseId);
    if (cached) {
      return res.json({ feedback: cached, cached: true });
    }

    // Generate new feedback
    const feedback = await evaluateCaseResponse(responses);
    
    // Cache in Firestore
    await cacheFeedback(userId, caseId, feedback);
    
    res.json({ feedback, cached: false });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

module.exports = router;
```

#### 1.4 Firestore Caching (Week 3)
**services/firestore.js:**
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('../serviceAccountKey.json')),
});

const db = admin.firestore();

async function cacheFeedback(userId, caseId, feedback) {
  await db.collection('case_feedback').doc(`${userId}_${caseId}`).set({
    userId,
    caseId,
    feedback,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function getCachedFeedback(userId, caseId) {
  const doc = await db.collection('case_feedback').doc(`${userId}_${caseId}`).get();
  return doc.exists ? doc.data().feedback : null;
}

module.exports = { cacheFeedback, getCachedFeedback };
```

#### 1.5 Frontend Integration (Week 4)
**Update CaseSimulator.jsx:**
```javascript
const handleSubmit = async () => {
  // ... existing scoring logic ...
  
  // Call AI feedback API
  try {
    const response = await fetch('https://your-backend.com/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        caseId: 'gamebox-profitability',
        responses: {
          caseTitle: 'GameBox Profitability',
          hypothesis: responses.hypothesis,
          framework: responses.framework,
          quantAnswer: `Profit: ${responses.profit}, Margin: ${responses.margin}`,
          recommendation: responses.recommendation,
        },
      }),
    });
    
    const { feedback } = await response.json();
    setAiFeedback(feedback);
  } catch (error) {
    console.error('AI feedback failed:', error);
  }
  
  setShowResults(true);
};
```

### Deliverables
- ✅ Node.js backend deployed (Railway/Render)
- ✅ OpenAI integration working
- ✅ Feedback cached in Firestore
- ✅ Frontend displays AI feedback
- ✅ Video demo of AI feedback

### Success Metrics
- AI feedback response time < 3 seconds
- 95%+ feedback quality (manual review)
- Cost per feedback < $0.05

---

## 🎯 Phase 2: Adaptive Learning (3 weeks)

### Goal
Personalize learning path based on user performance and mastery data.

### Implementation

#### 2.1 Enhanced Spaced Repetition (Week 1)
**Branch:** `adaptive-learning`

**Update services/spacedRepetition.js:**
```javascript
class AdaptiveSpacedRepetition {
  calculateNextReview(lessonId, accuracy, previousInterval) {
    // SM-2 algorithm with accuracy adjustment
    const easeFactor = this.calculateEaseFactor(accuracy);
    const interval = previousInterval * easeFactor;
    
    return {
      nextReviewDate: new Date(Date.now() + interval * 24 * 60 * 60 * 1000),
      interval,
      easeFactor,
    };
  }

  calculateEaseFactor(accuracy) {
    // accuracy: 0-1
    // easeFactor: 1.3 (hard) to 2.5 (easy)
    return 1.3 + (accuracy * 1.2);
  }

  getReviewQueue(lessonProgress) {
    const today = new Date();
    const dueItems = [];
    
    Object.entries(lessonProgress).forEach(([lessonId, progress]) => {
      if (progress.nextReviewDate && new Date(progress.nextReviewDate) <= today) {
        dueItems.push({
          lessonId,
          priority: this.calculatePriority(progress),
        });
      }
    });
    
    return dueItems.sort((a, b) => b.priority - a.priority);
  }

  calculatePriority(progress) {
    const daysSinceReview = (Date.now() - progress.lastReviewDate) / (1000 * 60 * 60 * 24);
    const masteryScore = progress.crownLevel / 5;
    return daysSinceReview * (1 - masteryScore);
  }
}

export default new AdaptiveSpacedRepetition();
```

#### 2.2 Next Best Lesson Algorithm (Week 2)
**services/recommendations.js:**
```javascript
export function getNextBestLesson(lessonProgress, allLessons) {
  // Priority factors:
  // 1. Review due items (highest priority)
  // 2. In-progress lessons
  // 3. Unlocked new lessons
  // 4. Weak areas (low crown levels)
  
  const reviewQueue = spacedRepetition.getReviewQueue(lessonProgress);
  if (reviewQueue.length > 0) {
    return {
      type: 'review',
      lesson: allLessons.find(l => l.id === reviewQueue[0].lessonId),
      reason: 'Due for review',
    };
  }
  
  const inProgress = Object.entries(lessonProgress)
    .filter(([_, p]) => p.status === 'in_progress')
    .sort((a, b) => a[1].crownLevel - b[1].crownLevel);
  
  if (inProgress.length > 0) {
    return {
      type: 'continue',
      lesson: allLessons.find(l => l.id === inProgress[0][0]),
      reason: 'Continue your progress',
    };
  }
  
  // Find next unlocked lesson
  const nextUnlocked = allLessons.find(l => 
    !lessonProgress[l.id] && isLessonUnlocked(l, lessonProgress)
  );
  
  return {
    type: 'new',
    lesson: nextUnlocked,
    reason: 'Start something new',
  };
}
```

#### 2.3 Dashboard Integration (Week 3)
**Update Dashboard.jsx:**
```javascript
import { getNextBestLesson } from '../services/recommendations';

const nextBest = getNextBestLesson(lessonProgress, allLessons);

// Display personalized recommendation
<div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
  <div className="text-sm opacity-90 mb-2">{nextBest.reason}</div>
  <h3 className="text-2xl font-bold mb-4">{nextBest.lesson.title}</h3>
  <Link to={`/lesson/${nextBest.lesson.id}`} className="btn-primary">
    {nextBest.type === 'review' ? 'Review Now' : 'Start Lesson'}
  </Link>
</div>
```

### Deliverables
- ✅ Adaptive spaced repetition algorithm
- ✅ Next best lesson recommendations
- ✅ Dashboard shows personalized suggestions
- ✅ Review queue functionality
- ✅ Video demo of adaptive learning

### Success Metrics
- 30% increase in lesson completion rate
- 20% increase in daily active users
- 50% of users follow recommendations

---

## 📊 Phase 3: Analytics & Engagement (3 weeks)

### Goal
Track user behavior and send weekly insights to drive engagement.

### Implementation

#### 3.1 Analytics Setup (Week 1)
**Branch:** `analytics`

**Option A: Mixpanel**
```bash
npm install mixpanel-browser
```

**services/analytics.js:**
```javascript
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);

export const analytics = {
  track(event, properties) {
    mixpanel.track(event, properties);
  },
  
  identify(userId) {
    mixpanel.identify(userId);
  },
  
  setUserProperties(properties) {
    mixpanel.people.set(properties);
  },
};

// Track key events
export const trackEvents = {
  lessonStarted: (lessonId) => analytics.track('Lesson Started', { lessonId }),
  lessonCompleted: (lessonId, score) => analytics.track('Lesson Completed', { lessonId, score }),
  caseStarted: (caseId) => analytics.track('Case Started', { caseId }),
  caseCompleted: (caseId, score) => analytics.track('Case Completed', { caseId, score }),
  dailyActive: () => analytics.track('Daily Active'),
};
```

**Option B: Custom Firestore Logs**
```javascript
export async function logEvent(userId, event, data) {
  await db.collection('analytics_events').add({
    userId,
    event,
    data,
    timestamp: serverTimestamp(),
  });
}

export async function getDailyActiveUsers(date) {
  const snapshot = await db.collection('analytics_events')
    .where('event', '==', 'daily_active')
    .where('timestamp', '>=', startOfDay(date))
    .where('timestamp', '<', endOfDay(date))
    .get();
  
  return new Set(snapshot.docs.map(doc => doc.data().userId)).size;
}
```

#### 3.2 Key Metrics Dashboard (Week 2)
**Create admin dashboard at /admin:**
```javascript
function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    async function fetchMetrics() {
      const data = await fetch('/api/metrics').then(r => r.json());
      setMetrics(data);
    }
    fetchMetrics();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard title="DAU" value={metrics?.dau} />
        <MetricCard title="Lesson Completion" value={`${metrics?.completionRate}%`} />
        <MetricCard title="Case Usage" value={metrics?.caseUsage} />
        <MetricCard title="Avg Session" value={`${metrics?.avgSession}m`} />
      </div>
      
      <Chart data={metrics?.dailyTrend} />
    </div>
  );
}
```

#### 3.3 Weekly Insights Email (Week 3)
**Backend: services/email.js**
```javascript
const nodemailer = require('nodemailer');

async function sendWeeklyInsights(userId, insights) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const html = `
    <h2>Your Weekly CaseQuest Insights 📊</h2>
    <p>Hi ${insights.userName}!</p>
    
    <h3>This Week's Progress:</h3>
    <ul>
      <li>✅ ${insights.lessonsCompleted} lessons completed</li>
      <li>⭐ ${insights.xpEarned} XP earned</li>
      <li>🔥 ${insights.streakDays} day streak</li>
      <li>🏆 Rank: #${insights.rank}</li>
    </ul>
    
    <h3>Next Steps:</h3>
    <p>${insights.recommendation}</p>
    
    <a href="https://casequest.app/dashboard">Continue Learning →</a>
  `;
  
  await transporter.sendMail({
    from: 'CaseQuest <noreply@casequest.app>',
    to: insights.email,
    subject: `Your Weekly Progress - ${insights.xpEarned} XP Earned! 🎉`,
    html,
  });
}

// Cron job (runs every Monday)
cron.schedule('0 9 * * 1', async () => {
  const users = await getActiveUsers();
  for (const user of users) {
    const insights = await calculateWeeklyInsights(user.id);
    await sendWeeklyInsights(user.id, insights);
  }
});
```

### Deliverables
- ✅ Analytics tracking implemented
- ✅ Admin dashboard for metrics
- ✅ Weekly insights email system
- ✅ Key metrics: DAU, completion rate, engagement
- ✅ Video demo of analytics

### Success Metrics
- 95%+ event tracking accuracy
- 40% email open rate
- 15% click-through rate
- 10% increase in weekly retention

---

## 💰 Phase 4: Monetization Prep (2 weeks)

### Goal
Infrastructure for freemium model and premium subscriptions.

### Implementation

#### 4.1 Premium Flag & State (Week 1)
**Branch:** `monetization`

**Update store.js:**
```javascript
user: {
  name: 'Demo',
  xp: 0,
  streak: 0,
  coins: 0,
  isPremium: false,
  premiumExpiry: null,
  subscriptionId: null,
}

setPremium: (isPremium, expiryDate, subscriptionId) => 
  set((state) => ({
    user: {
      ...state.user,
      isPremium,
      premiumExpiry: expiryDate,
      subscriptionId,
    },
  })),
```

#### 4.2 Content Gating (Week 1)
**Create PremiumGate component:**
```javascript
function PremiumGate({ children, feature }) {
  const { user } = useStore();
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  if (!user.isPremium) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl"
          >
            🔓 Unlock {feature} - Upgrade to Premium
          </button>
        </div>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </div>
    );
  }
  
  return children;
}

// Usage
<PremiumGate feature="Advanced Modules">
  <Module id="m3" title="Market Entry Strategy" />
</PremiumGate>
```

#### 4.3 Upgrade Screen (Week 1)
**components/UpgradeModal.jsx:**
```javascript
function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl">
        <h2 className="text-3xl font-bold mb-4">Upgrade to Premium 🚀</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <PricingCard
            title="Monthly"
            price="$9.99"
            period="/month"
            features={[
              'Unlimited AI interviews',
              'All advanced modules',
              'Priority support',
              'Detailed analytics',
            ]}
          />
          <PricingCard
            title="Annual"
            price="$79"
            period="/year"
            badge="Save 34%"
            features={[
              'Everything in Monthly',
              '2 months free',
              'Exclusive content',
              'Early access to features',
            ]}
            highlighted
          />
        </div>
        
        <button onClick={onClose} className="text-gray-600">
          Maybe later
        </button>
      </div>
    </div>
  );
}
```

#### 4.4 Stripe Integration Stub (Week 2)
**Backend: routes/checkout.js:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { userId, priceId } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    customer_email: req.body.email,
    payment_method_types: ['card'],
    line_items: [{
      price: priceId, // price_monthly or price_annual
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard`,
    metadata: { userId },
  });
  
  res.json({ sessionId: session.id });
});

router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    
    // Update user to premium
    await db.collection('users').doc(userId).update({
      isPremium: true,
      premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subscriptionId: session.subscription,
    });
  }
  
  res.json({ received: true });
});
```

**Frontend integration:**
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

async function handleUpgrade(priceId) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.uid, priceId, email: user.email }),
  });
  
  const { sessionId } = await response.json();
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId });
}
```

### Deliverables
- ✅ Premium flag in user state
- ✅ Content gating for advanced features
- ✅ Upgrade modal with pricing
- ✅ Stripe checkout integration
- ✅ Webhook for subscription updates
- ✅ Video demo of upgrade flow

### Success Metrics
- 15% free-to-paid conversion
- $9.99 average revenue per user
- 80% annual plan selection
- <5% churn rate

---

## 🔄 Development Workflow

### Branch Strategy
```bash
main (production)
├── ai-feedback (Phase 1)
├── adaptive-learning (Phase 2)
├── analytics (Phase 3)
└── monetization (Phase 4)
```

### Pull Request Template
```markdown
## Phase: [Phase Name]

### Changes
- [ ] Feature 1
- [ ] Feature 2
- [ ] Tests added
- [ ] Documentation updated

### Demo
[Link to video demo]

### Metrics
- Performance impact: [X]ms
- Bundle size change: [+/-X]KB
- Test coverage: [X]%

### Screenshots
[Add screenshots]

### Testing
- [ ] Manual testing completed
- [ ] Edge cases covered
- [ ] Mobile tested
```

### Video Demo Requirements
- 30-60 seconds per feature
- Show before/after
- Highlight key functionality
- Include metrics/results

---

## 📊 Success Metrics Summary

### Phase 1: AI Integration
- AI response time < 3s
- 95%+ feedback quality
- Cost per feedback < $0.05

### Phase 2: Adaptive Learning
- 30% ↑ lesson completion
- 20% ↑ daily active users
- 50% follow recommendations

### Phase 3: Analytics
- 95%+ tracking accuracy
- 40% email open rate
- 10% ↑ weekly retention

### Phase 4: Monetization
- 15% free-to-paid conversion
- $9.99 ARPU
- <5% churn rate

---

## 💰 Cost Estimates

### Phase 1: AI Integration
- OpenAI API: $0.03/feedback × 1000/day = $30/day = $900/month
- Backend hosting: $20/month (Railway/Render)
- **Total:** ~$920/month

### Phase 2: Adaptive Learning
- No additional costs (client-side logic)

### Phase 3: Analytics
- Mixpanel: $0-25/month (free tier)
- Email service: $10/month (SendGrid)
- **Total:** ~$35/month

### Phase 4: Monetization
- Stripe fees: 2.9% + $0.30 per transaction
- No fixed costs

**Total Monthly Cost:** ~$955/month

---

## 🎯 Timeline

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1: AI | 4 weeks | Week 1 | Week 4 |
| Phase 2: Adaptive | 3 weeks | Week 5 | Week 7 |
| Phase 3: Analytics | 3 weeks | Week 8 | Week 10 |
| Phase 4: Monetization | 2 weeks | Week 11 | Week 12 |
| **Total** | **12 weeks** | | |

---

## ✅ Pre-Implementation Checklist

- [ ] Funding secured
- [ ] Team hired/assigned
- [ ] Infrastructure provisioned
- [ ] API keys obtained (OpenAI, Stripe, etc.)
- [ ] Development environment set up
- [ ] Testing plan created
- [ ] Deployment pipeline ready

---

**Status:** Ready for implementation  
**Next Step:** Secure funding and begin Phase 1  
**Contact:** [Your contact info]
