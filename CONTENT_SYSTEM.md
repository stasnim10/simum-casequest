# 📚 CaseQuest Content System

Complete lesson and progress tracking implementation.

---

## 📦 Content Structure

### Modules
```javascript
{
  id: 'm1',
  title: 'Consulting Mindset',
  summary: 'How case interviews work and MECE',
  lessons: ['l1', 'l2', 'l3', 'l4', 'l5'],
  prereq: 'm0' // optional - must complete this module first
}
```

### Lessons
```javascript
{
  id: 'l1',
  moduleId: 'm1',
  title: 'What is a case interview',
  objectives: ['Purpose', 'What interviewers assess', 'Typical flow'],
  quiz: [
    // MCQ
    {
      id: 'q1',
      type: 'mcq',
      stem: 'Question text?',
      options: ['Option A', 'Option B', 'Option C'],
      answer: 'Option B',
      rationale: 'Explanation of correct answer'
    },
    // Fill-in-blank
    {
      id: 'q2',
      type: 'fill',
      stem: 'MECE stands for ____ Exclusive',
      accept: ['Mutually', 'mutually'], // case-insensitive matching
      rationale: 'Explanation'
    },
    // Calculation
    {
      id: 'q3',
      type: 'calc',
      stem: 'If revenue is $20 and margin is 25%, profit is?',
      unit: '$',
      correct: 5,
      tolerance: 0.5, // accepts 4.5 to 5.5
      rationale: '20 x 0.25 = 5'
    }
  ]
}
```

---

## 🎓 Current Content

### Module 1: Consulting Mindset (5 lessons)
1. **What is a case interview** - Purpose, assessment, flow
2. **Structured thinking with MECE** - MECE principle, breaking down problems
3. **Issue trees and frameworks** - Building trees, common frameworks
4. **Hypothesis-driven approach** - Forming hypotheses, testing, pivoting
5. **Communication and synthesis** - Clear communication, recommendations

### Module 2: Profitability Basics (5 lessons)
*Prerequisite: Complete Module 1*

6. **The profit equation** - Profit = Revenue - Costs, drivers
7. **Revenue drivers** - Price × Volume, growth levers
8. **Cost structure** - Fixed vs Variable, break-even
9. **Margin analysis** - Gross vs Net, improvement strategies
10. **Profitability case practice** - Diagnose issues, prioritize, recommend

---

## 🎮 Progress System

### Lesson Status
- **new** - Not started
- **in_progress** - Started but not mastered
- **mastered** - Crown level ≥ 3

### Crown Levels (0-5)
- Earn 1 crown per perfect quiz score
- Max 5 crowns per lesson
- Mastery achieved at 3+ crowns

### XP Calculation
```javascript
XP = (correct × 10) + 20
// Example: 3/3 correct = 30 + 20 = 50 XP
```

### Streak Logic
- Increments on first completion each day
- Tracked by `lastCompletionDate`
- Persists across sessions

---

## 🔒 Lock Logic

### Module Unlocking
- First module always unlocked
- Subsequent modules require:
  - All lessons in prerequisite module mastered (3+ crowns)

### Lesson Unlocking
- First lesson in module always unlocked (if module unlocked)
- Subsequent lessons require:
  - Previous lesson mastered (3+ crowns)

---

## 🎯 Quiz Grading

### MCQ (Multiple Choice)
```javascript
isCorrect = userAnswer === question.answer
```

### Fill-in-blank
```javascript
isCorrect = question.accept.some(a => 
  a.toLowerCase() === userAnswer.toLowerCase()
)
```

### Calculation
```javascript
isCorrect = Math.abs(parseFloat(userAnswer) - question.correct) 
  <= question.tolerance
```

---

## 📊 Data Flow

### 1. Learning Path Page
```javascript
import { getModuleList, getLessonsByModule } from '../data/api';
import useStore from '../state/store';

const modules = getModuleList();
const { lessonProgress } = useStore();

// Check if lesson is unlocked
const isUnlocked = checkPrereqs(lesson, lessonProgress);

// Display crown level
const crownLevel = lessonProgress[lesson.id]?.crownLevel || 0;
```

### 2. Lesson Player
```javascript
import { getLesson } from '../data/api';
import useStore from '../state/store';

const lesson = getLesson(id);
const { startLesson, completeLesson } = useStore();

// On mount
startLesson(id);

// On quiz complete
const result = completeLesson(id, { correct, total });
// Returns: { xpGained, crownLevel, previousCrownLevel }
```

---

## 🔧 API Functions

### getModuleList()
Returns all modules in order.

### getModule(id)
Returns single module by ID.

### getLesson(id)
Returns single lesson with full quiz data.

### getLessonsByModule(moduleId)
Returns all lessons for a module in order.

---

## 💾 Store Structure

```javascript
{
  user: {
    name: 'Demo',
    xp: 0,
    streak: 0,
    coins: 0
  },
  lessonProgress: {
    'l1': { status: 'mastered', crownLevel: 3 },
    'l2': { status: 'in_progress', crownLevel: 1 }
  },
  lastCompletionDate: '2025-10-07'
}
```

---

## 🎨 UI Components

### Crown Display
```jsx
{[...Array(crownLevel)].map((_, i) => (
  <Crown key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
))}
```

### Lock Indicator
```jsx
{!unlocked && <Lock className="w-5 h-5 text-gray-400" />}
```

### Status Colors
- **Mastered**: Green background (`bg-green-50`)
- **In Progress**: Blue background (`bg-blue-50`)
- **New**: White background (`bg-white`)

---

## 📈 Adding New Content

### Add a Module
```javascript
// In src/data/seed.js
modules.push({
  id: 'm3',
  title: 'Market Entry Strategy',
  summary: 'Evaluating new market opportunities',
  prereq: 'm2', // optional
  lessons: ['l11', 'l12', 'l13']
});
```

### Add a Lesson
```javascript
// In src/data/seed.js
lessons.push({
  id: 'l11',
  moduleId: 'm3',
  title: 'Market Attractiveness',
  objectives: ['Market size', 'Growth rate', 'Competition'],
  quiz: [
    {
      id: 'q1',
      type: 'mcq',
      stem: 'Key factor in market attractiveness?',
      options: ['Size', 'Color', 'Name'],
      answer: 'Size',
      rationale: 'Market size indicates opportunity'
    },
    // Add 2-3 more questions
  ]
});
```

---

## 🧪 Testing Scenarios

### Test Perfect Score
1. Complete lesson with all correct answers
2. Verify: +50 XP (3 correct × 10 + 20)
3. Verify: Crown level +1
4. Verify: Streak +1 (if first today)

### Test Partial Score
1. Complete lesson with 2/3 correct
2. Verify: +40 XP (2 × 10 + 20)
3. Verify: Crown level unchanged
4. Verify: Status = in_progress

### Test Mastery
1. Complete same lesson 3 times with perfect scores
2. Verify: Crown level = 3
3. Verify: Status = mastered
4. Verify: Next lesson unlocked

### Test Module Lock
1. Start Module 2 without completing Module 1
2. Verify: All lessons show lock icon
3. Verify: Cannot navigate to lessons
4. Complete Module 1 fully
5. Verify: Module 2 unlocks

---

## 📱 Demo Mode Integration

Visit with `?demo=1` to see:
- XP: 120 (Level 2)
- Streak: 3 days
- Some lessons in progress

Perfect for investor demos!

---

## 🎯 Success Metrics

### Engagement
- Lessons completed per session
- Crown levels earned
- Streak maintenance rate

### Learning
- Quiz accuracy by question type
- Time per lesson
- Retry patterns

### Progression
- Module completion rate
- Days to mastery per lesson
- Drop-off points

---

## 🚀 Future Enhancements

### Content
- [ ] Module 3: Market Entry
- [ ] Module 4: Operations
- [ ] Module 5: M&A
- [ ] Video explanations
- [ ] Interactive diagrams

### Features
- [ ] Spaced repetition review
- [ ] Adaptive difficulty
- [ ] Peer comparison
- [ ] Lesson notes
- [ ] Bookmarks

### Gamification
- [ ] Achievements for crown milestones
- [ ] Bonus XP for streaks
- [ ] Daily challenges
- [ ] Module completion badges

---

**Status:** ✅ Production-ready  
**Modules:** 2 (10 lessons)  
**Question Types:** 3 (MCQ, Fill, Calc)  
**Progress Tracking:** Full implementation  
**Lock Logic:** Complete
