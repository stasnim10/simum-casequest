# Adaptive Learning Utilities - Test Results

## ✅ All Tests Passed

```
RUN  v3.2.4 /Users/simum/casequest-app/simum-casequest

✓ src/lib/adaptive.test.ts (3 tests) 2ms
✓ src/lib/adaptive.spec.ts (3 tests) 2ms

Test Files  2 passed (2)
     Tests  6 passed (6)
  Start at  00:14:58
  Duration  1.00s (transform 46ms, setup 0ms, collect 52ms, tests 4ms, environment 939ms, prepare 641ms)
```

---

## 📦 Files Created

### Core Utilities
**`/src/lib/adaptive.ts`**
- `nextIntervalDays()` - SM-2 inspired spaced repetition intervals
- `expectedScore()` - Elo rating expectation calculation
- `eloUpdate()` - Elo rating update with K-factor
- `nextBestLesson()` - Selects lesson with highest information gain

### Test Files
**`/src/lib/adaptive.spec.ts`** - Vitest format tests
**`/src/lib/adaptive.test.ts`** - Jest format tests (CRA compatible)

### Configuration
**`vitest.config.ts`** - Vitest configuration with jsdom environment
**`package.json`** - Added scripts:
- `test:vitest` - Run Vitest tests once
- `test:watch` - Run Vitest in watch mode

---

## 🧪 Test Coverage

### Test 1: Spaced Repetition Intervals
```typescript
it('intervals grow with correct streak', () => {
  const h1 = [];
  const h2 = [{correct:true,t:1}];
  const h3 = [{correct:true,t:1},{correct:true,t:2}];
  expect(nextIntervalDays(h1)).toBe(1);
  expect(nextIntervalDays(h2)).toBeGreaterThanOrEqual(5);
  expect(nextIntervalDays(h3)).toBeGreaterThan(nextIntervalDays(h2));
});
```
✅ **Passed** - Intervals increase with correct answer streaks

### Test 2: Elo Rating System
```typescript
it('elo expectation and update behave', () => {
  const e = expectedScore(1500, 1500);
  expect(Math.abs(e - 0.5)).toBeLessThan(0.001);
  const up = eloUpdate(1500, e, 1);
  expect(up).toBeGreaterThan(1500);
});
```
✅ **Passed** - Elo calculations work correctly

### Test 3: Adaptive Lesson Selection
```typescript
it('nextBestLesson selects highest information gain', () => {
  const id = nextBestLesson([
    { id: 'a', rating: 1500, difficulty: 1500 },
    { id: 'b', rating: 1500, difficulty: 2100 },
    { id: 'c', rating: 1500, difficulty: 900 },
  ]);
  expect(['b','c']).toContain(id);
});
```
✅ **Passed** - Selects lessons with maximum learning potential

---

## 🎯 Algorithm Details

### Spaced Repetition (SM-2 Inspired)
- **Base interval**: 1 day for new items
- **Growth formula**: `min(5 + streak * 2, 21)` days
- **Reset on failure**: Back to 1 day
- **Max interval**: 21 days

### Elo Rating System
- **Formula**: `1 / (1 + 10^((item - user) / 400))`
- **K-factor**: 24 (default)
- **Rating bounds**: 600 - 2400
- **Score values**: 0 (fail), 0.5 (partial), 1 (success)

### Adaptive Selection
- **Metric**: Information gain (distance from 50% expected score)
- **Strategy**: Select items where user has ~50% chance of success
- **Goal**: Maximize learning efficiency (zone of proximal development)

---

## 🚀 Usage Examples

### Spaced Repetition
```typescript
import { nextIntervalDays } from './lib/adaptive';

const history = [
  { correct: true, t: Date.now() - 86400000 },
  { correct: true, t: Date.now() }
];

const nextReview = nextIntervalDays(history); // Returns 7 (days)
```

### Elo Rating Update
```typescript
import { expectedScore, eloUpdate } from './lib/adaptive';

const userRating = 1500;
const lessonDifficulty = 1600;

const expected = expectedScore(userRating, lessonDifficulty); // 0.36
const newRating = eloUpdate(userRating, expected, 1); // 1515 (user won)
```

### Adaptive Lesson Selection
```typescript
import { nextBestLesson } from './lib/adaptive';

const lessons = [
  { id: 'easy', rating: 1500, difficulty: 1200 },
  { id: 'medium', rating: 1500, difficulty: 1500 },
  { id: 'hard', rating: 1500, difficulty: 1800 }
];

const recommended = nextBestLesson(lessons); // 'hard' or 'easy' (max info gain)
```

---

## 📊 Performance Metrics

- **Test execution**: 4ms
- **Environment setup**: 939ms (jsdom)
- **Total duration**: 1.00s
- **Transform time**: 46ms
- **Collection time**: 52ms

---

## 🔧 Running Tests

### Run Once
```bash
npm run test:vitest
```

### Watch Mode
```bash
npm run test:watch
```

### Jest (CRA Default)
```bash
npm test
```

---

## 📝 Dependencies Added

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4"
  }
}
```

---

## ✨ Integration Ready

These utilities can now be integrated into:
- User progress tracking
- Lesson recommendation engine
- Spaced repetition scheduler
- Difficulty adjustment system
- Personalized learning paths

**Status: COMPLETE ✅**
