# CaseQuest UX Integration Guide

## Phase 1: Core Integration (Week 1)

### 1. Firebase Schema Updates

Update your Firestore user document structure:

```javascript
// users/{uid}
{
  // Existing fields...
  
  // New UX fields
  hasCompletedOnboarding: boolean,
  dailyGoalMinutes: number, // 5, 10, or 20
  preferredStudyTime: string, // 'morning', 'afternoon', 'evening'
  lastActiveAt: timestamp,
  cohortWeek: string, // e.g., "2025-W41"
  onboardingCompletedAt: timestamp,
  
  // Streak protection
  streakFreezes: number,
  streakProtection: {
    state: string, // 'inactive', 'freeze-equipped', 'grace-eligible', 'repaired'
    lastUsed: timestamp,
    gracePeriodEnd: timestamp
  },
  
  // Spaced repetition
  reviewItems: array, // [{id, name, sr: {ef, reps, intervalDays, dueAt, history}}]
  weakAreas: array, // [{name, strength, lastReviewed}]
  reviewStats: {
    totalReviews: number,
    correctReviews: number,
    reviewAccuracy: number,
    lastReviewSession: timestamp
  }
}
```

### 2. App.js Integration

```javascript
// Add to imports
import EnhancedOnboarding from './components/EnhancedOnboarding';
import SessionSummary from './components/SessionSummary';
import remoteConfig from './services/remoteConfig';
import analytics from './services/analytics';

// Add state
const [showOnboarding, setShowOnboarding] = useState(false);
const [showSessionSummary, setShowSessionSummary] = useState(false);
const [sessionSummaryData, setSessionSummaryData] = useState(null);

// Initialize Remote Config
useEffect(() => {
  remoteConfig.initialize();
}, []);

// Check onboarding status
useEffect(() => {
  if (user && !user.hasCompletedOnboarding) {
    setShowOnboarding(true);
  }
}, [user]);

// Track daily returns
useEffect(() => {
  if (user?.lastActiveAt) {
    const daysSince = (Date.now() - user.lastActiveAt) / (1000 * 60 * 60 * 24);
    if (daysSince >= 1) {
      analytics.trackDailyReturn(Math.floor(daysSince));
    }
  }
}, [user]);

// Onboarding completion handler
const handleOnboardingComplete = async (settings) => {
  await updateDoc(doc(db, 'users', user.uid), {
    ...settings,
    lastActiveAt: Date.now()
  });
  setShowOnboarding(false);
  analytics.trackFirstLessonStart();
};

// Session completion handler
const handleLessonComplete = (results) => {
  const isFirstLesson = !user.hasCompletedOnboarding;
  
  setSessionSummaryData({
    ...results,
    isFirstLesson,
    nextRecommendation: getNextRecommendation(results)
  });
  setShowSessionSummary(true);
  
  // Update user activity
  updateDoc(doc(db, 'users', user.uid), {
    lastActiveAt: Date.now(),
    streak: results.streakExtended ? (user.streak || 0) + 1 : user.streak
  });
};

// Add to render
{showOnboarding && (
  <EnhancedOnboarding onComplete={handleOnboardingComplete} />
)}

{showSessionSummary && (
  <SessionSummary 
    sessionData={sessionSummaryData}
    onContinue={() => {
      setShowSessionSummary(false);
      // Navigate to next recommended action
    }}
    onClose={() => setShowSessionSummary(false)}
  />
)}
```

### 3. Firebase Remote Config Setup

In Firebase Console → Remote Config, add these parameters:

```json
{
  "endowed_progress_percent": 10,
  "streak_grace_hours": 48,
  "next_action_policy": "weakness_first",
  "review_batch_size": 10,
  "notification_hour_morning": 9,
  "notification_hour_afternoon": 15,
  "notification_hour_evening": 19,
  "sm2_initial_ease": 2.5,
  "sm2_first_interval": 1,
  "sm2_second_interval": 6
}
```

### 4. GA4 Custom Events Setup

In GA4 → Configure → Custom Definitions, add these events:
- `onboarding_start`
- `goal_set` (with `goal_minutes` parameter)
- `first_lesson_start`
- `first_lesson_complete` (with `time_spent_seconds`)
- `summary_viewed`
- `next_action_shown` (with `action_type`, `urgency`)
- `next_action_taken` (with `action_type`)
- `daily_return` (with `days_since_last_visit`)
- `streak_complete` (with `streak_length`)

## Phase 2: A/B Testing Setup (Week 2)

### 1. Create Remote Config Experiments

In Firebase Console → A/B Testing:

**Experiment 1: Endowed Progress**
- Parameter: `endowed_progress_percent`
- Variants: 0%, 10%, 25%
- Target: New users (first 7 days)
- Goal: `first_lesson_complete` conversion rate

**Experiment 2: Next Action Policy**
- Parameter: `next_action_policy`
- Variants: "weakness_first", "time_budget_first"
- Target: Users with >3 completed lessons
- Goal: Daily return rate

### 2. Cohort Analysis Setup

Create GA4 Cohort Exploration:
1. Go to Explore → Cohort Exploration
2. Set cohort by `first_visit` date
3. Add custom parameter `onboarding_complete`
4. Measure retention at 1, 7, 14, 28 days
5. Segment by experiment variants

### 3. Success Metrics Dashboard

Track these key metrics:
- **Onboarding Funnel**: Start → Goal Set → First Lesson → Summary Viewed
- **Daily Return Rate**: % users returning next day
- **Streak Completion**: % users maintaining 7+ day streaks
- **Session Length**: Median time per session
- **Review Engagement**: % users completing review sessions

## Phase 3: Spaced Repetition Integration (Week 3)

### 1. Create Review Items from Lessons

```javascript
// In LessonScreen.js completion handler
const createReviewItems = (lessonContent) => {
  const reviewItems = lessonContent.concepts.map(concept => 
    spacedRepetitionService.createReviewItem({
      id: `${lessonId}_${concept.id}`,
      name: concept.name,
      type: 'concept',
      content: concept.content,
      question: concept.question,
      answer: concept.answer
    })
  );
  
  // Add to user's review queue
  await updateDoc(doc(db, 'users', user.uid), {
    reviewItems: arrayUnion(...reviewItems)
  });
};
```

### 2. Daily Review Check

```javascript
// Add to App.js useEffect
useEffect(() => {
  const checkDueReviews = async () => {
    if (!user?.reviewItems) return;
    
    const session = spacedRepetitionService.generateReviewSession(user.reviewItems);
    if (session.items.length > 0) {
      // Update weak areas for NextBestAction
      const weakAreas = session.items
        .filter(item => item.strength < 70)
        .sort((a, b) => a.strength - b.strength)
        .slice(0, 3);
        
      await updateDoc(doc(db, 'users', user.uid), { weakAreas });
    }
  };
  
  checkDueReviews();
}, [user]);
```

### 3. Review Session Integration

```javascript
// Add review navigation to App.js
case 'review':
  const reviewSession = spacedRepetitionService.generateReviewSession(
    user.reviewItems, 
    remoteConfig.getReviewBatchSize()
  );
  setCurrentScreen('review');
  setReviewData(reviewSession);
  break;

// Review completion handler
const handleReviewComplete = async (results) => {
  const updatedItems = results.results.map(r => r.updatedItem);
  const updatedStats = spacedRepetitionService.updateUserStats(user.reviewStats, results.sessionStats);
  
  await updateDoc(doc(db, 'users', user.uid), {
    reviewItems: updatedItems,
    reviewStats: updatedStats,
    lastActiveAt: Date.now()
  });
  
  analytics.trackReviewSessionComplete(results.sessionStats);
  
  // Show session summary
  setSessionSummaryData({
    xpEarned: results.sessionStats.correct * 5,
    accuracy: results.sessionStats.accuracy,
    skillsImproved: results.results.filter(r => r.correct).map(r => ({
      name: r.item.name,
      oldStrength: r.item.strength,
      newStrength: r.updatedItem.strength
    })),
    sessionLength: results.sessionStats.timeSpent,
    nextRecommendation: "Continue with your next lesson"
  });
  setShowSessionSummary(true);
};
```

## Phase 4: Performance & QA (Week 4)

### 1. Code Splitting

```javascript
// Lazy load heavy components
const EnhancedOnboarding = lazy(() => import('./components/EnhancedOnboarding'));
const ReviewSession = lazy(() => import('./components/ReviewSession'));

// Wrap in Suspense
<Suspense fallback={<div>Loading...</div>}>
  {showOnboarding && <EnhancedOnboarding onComplete={handleOnboardingComplete} />}
</Suspense>
```

### 2. Accessibility Checks

- [ ] Keyboard navigation works in all modals
- [ ] Focus management in onboarding flow
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader compatibility for progress indicators

### 3. QA Checklist

- [ ] Onboarding → first lesson → summary flow works
- [ ] Next best action updates based on user state
- [ ] Streak protection states sync correctly
- [ ] Review items schedule properly with SM-2
- [ ] Analytics events fire correctly
- [ ] Remote Config experiments work
- [ ] Performance stays within Core Web Vitals targets

### 4. Rollout Strategy

1. **Week 1**: Deploy to 10% of users with Remote Config flag
2. **Week 2**: Increase to 50% if metrics are positive
3. **Week 3**: Full rollout with A/B tests running
4. **Week 4**: Analyze cohort data and iterate

## Success Criteria

**Primary Metrics (Week 1-2)**:
- Onboarding completion rate >80%
- First lesson completion rate >60%
- Day 1 retention >40%

**Secondary Metrics (Week 3-4)**:
- Day 7 retention >20%
- Average session length >8 minutes
- Review session completion >70%

**Long-term Metrics (Month 1)**:
- Day 28 retention >10%
- 7+ day streak completion >15%
- User satisfaction score >4.0/5.0

Roll back if any primary metric drops >10% from baseline.
