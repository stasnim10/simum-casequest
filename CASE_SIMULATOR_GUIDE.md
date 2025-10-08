# 🎯 CaseQuest Case Simulator Guide

Complete guided case interview simulator with scoring and feedback.

---

## 📋 Overview

The Case Simulator provides a structured, 5-panel flow that guides users through a complete case interview:

1. **Clarifying Questions** - Gather information
2. **Hypothesis** - Form initial assumptions
3. **Structure** - Choose analytical framework
4. **Quantitative Analysis** - Solve calculations
5. **Recommendation** - Synthesize findings

---

## 🎮 User Flow

### Panel 1: Clarifying Questions
**Purpose:** Teach users to ask good questions before diving in

**Features:**
- 3 suggested questions displayed
- User input field for custom question
- Continue button unlocks when question entered

**Example Questions:**
- "What is the time period for this analysis?"
- "Are there any external market changes?"
- "What are the main revenue streams?"

---

### Panel 2: Hypothesis
**Purpose:** Practice hypothesis-driven thinking

**Features:**
- Textarea for user's hypothesis
- 3 example hypotheses shown
- Minimum 20 characters required

**Example Hypotheses:**
- "Revenue declined due to pricing pressure from competitors"
- "Costs increased from supply chain disruptions"
- "Customer churn increased in key segments"

---

### Panel 3: Structure
**Purpose:** Apply consulting frameworks

**Features:**
- 3 selectable framework cards:
  - **Profit Tree:** Revenue/Cost breakdown
  - **Market Entry:** Attractiveness/Competition/Capabilities
  - **4C+P:** Company/Customers/Competitors/Collaborators
- Each card shows 3-4 key points
- Alternative: Custom structure textarea
- Continue when framework selected OR custom structure entered

---

### Panel 4: Quantitative Analysis
**Purpose:** Test calculation skills

**Problem Statement:**
```
Revenue dropped from $200M to $150M
Costs stayed at $120M
```

**Questions:**
1. New Profit ($M): **30** (tolerance ±3)
2. New Margin (%): **20** (tolerance ±2)

**Features:**
- Instant validation with green check or red X
- Visual feedback as user types
- Continue when both answers entered

**Calculations:**
- Profit = $150M - $120M = $30M
- Margin = $30M / $150M = 20%

---

### Panel 5: Recommendation
**Purpose:** Synthesize and communicate findings

**Features:**
- Textarea for 3-bullet summary
- Example structure shown
- Minimum 100 characters required
- Submit button completes case

**Example Structure:**
```
1️⃣ Diagnose: Revenue declined 25% while costs remained flat
2️⃣ Quantify: Profit margin dropped from 40% to 20%
3️⃣ Recommend: Investigate pricing strategy and customer retention
```

---

## 📊 Scoring System

### Section Scores (each out of 5)

**Communication (5 points):**
- All fields filled: 5 points
- Missing fields: 3 points

**Structure (5 points):**
- Framework selected OR custom structure: 5 points
- Neither: 2 points

**Quantitative (5 points):**
- Both answers correct (within tolerance): 5 points
- One answer correct: 3 points
- Neither correct: 1 point

**Recommendation (5 points):**
- 100+ characters: 5 points
- Less than 100: 3 points

### Total Score
```javascript
totalScore = (communication + structure + quant + recommendation) / 20 * 100
// Example: (5 + 5 + 5 + 5) / 20 * 100 = 100%
```

---

## 🎉 Results Modal

### Displays:
1. **Total Score** - Large percentage (e.g., 85%)
2. **Section Breakdown** - Each category with score
3. **Feedback** - 3 personalized bullets:
   - "Strong quantitative skills" (if quant = 5)
   - "Good structure clarity" (if structure = 5)
   - "Clear communication" (if communication ≥ 4)
4. **Rewards:**
   - +50 XP
   - +25 Coins
5. **Badge:** "First Case Complete" 🏆
6. **Action:** Return to Dashboard button

---

## 💾 Progress Persistence

### Auto-Save
- All responses saved to `localStorage` as `case-progress`
- Saves on every input change
- Survives page refresh

### Clear on Complete
- Progress cleared when case submitted
- Allows fresh start on next attempt

### Storage Structure
```javascript
{
  clarifyingQuestion: "string",
  hypothesis: "string",
  framework: "profit" | "market" | "4cp" | "",
  customStructure: "string",
  profit: "30",
  margin: "20",
  recommendation: "string"
}
```

---

## 🎨 Visual Design

### Progress Bar
- Top of page
- Fills 20% per panel completed
- Smooth animation with Framer Motion

### Panel States
- **Active:** Blue border, blue background
- **Completed:** Green border, green background, checkmark
- **Inactive:** Gray border, white background

### Validation Feedback
- **Correct:** Green checkmark + "Correct!"
- **Incorrect:** Red X + "Try again"
- **Real-time:** Updates as user types

### Accordion Animation
- Smooth expand/collapse
- ChevronDown when open, ChevronRight when closed
- Height animation with Framer Motion

---

## 🔧 Technical Implementation

### State Management
```javascript
const [activePanel, setActivePanel] = useState(0);
const [responses, setResponses] = useState({...});
const [showResults, setShowResults] = useState(false);
const [scores, setScores] = useState(null);
```

### Validation Logic
```javascript
const canContinue = (panelIndex) => {
  switch (panelIndex) {
    case 0: return responses.clarifyingQuestion.length > 0;
    case 1: return responses.hypothesis.length > 20;
    case 2: return responses.framework || responses.customStructure.length > 20;
    case 3: return responses.profit && responses.margin;
    case 4: return responses.recommendation.length > 100;
  }
};
```

### Scoring Calculation
```javascript
const calculateScores = () => {
  const communication = /* logic */;
  const structure = /* logic */;
  const quant = /* logic */;
  const recommendation = /* logic */;
  const total = communication + structure + quant + recommendation;
  const percentage = Math.round((total / 20) * 100);
  return { communication, structure, quant, recommendation, total, percentage };
};
```

---

## 🎯 User Experience Flow

1. **Start:** User navigates to `/case`
2. **Panel 1:** Enter clarifying question → Continue
3. **Panel 2:** Write hypothesis → Continue
4. **Panel 3:** Select framework → Continue
5. **Panel 4:** Solve calculations → Continue
6. **Panel 5:** Write recommendation → Submit
7. **Results:** View score and feedback
8. **Complete:** Return to dashboard with XP/coins

**Total Time:** 5-10 minutes per case

---

## 📈 Metrics to Track

### Engagement
- Completion rate per panel
- Time spent per panel
- Drop-off points

### Performance
- Average score by section
- Most common mistakes
- Framework preferences

### Learning
- Score improvement over time
- Retry patterns
- Correlation between structure choice and score

---

## 🚀 Future Enhancements

### Content
- [ ] Multiple case scenarios
- [ ] Different industries (tech, retail, healthcare)
- [ ] Varying difficulty levels
- [ ] Video explanations

### Features
- [ ] Timer mode (pressure practice)
- [ ] Hints system (costs coins)
- [ ] Peer comparison
- [ ] AI feedback on text responses
- [ ] Voice input option

### Gamification
- [ ] Case-specific badges
- [ ] Leaderboard for case scores
- [ ] Streak for daily cases
- [ ] Unlock advanced cases with crowns

---

## 🎓 Educational Value

### Skills Practiced
1. **Structured Thinking** - Framework selection
2. **Hypothesis Formation** - Critical thinking
3. **Quantitative Analysis** - Mental math
4. **Communication** - Clear recommendations
5. **Time Management** - Complete flow efficiently

### Real Interview Alignment
- Mirrors actual case interview structure
- Teaches best practices
- Builds confidence
- Provides immediate feedback

---

## 🧪 Testing Checklist

### Functionality
- [ ] All panels open/close correctly
- [ ] Continue buttons enable/disable properly
- [ ] Validation works for all inputs
- [ ] Scoring calculates correctly
- [ ] Modal displays all information
- [ ] XP and coins update in store
- [ ] Progress saves to localStorage
- [ ] Progress clears on completion

### Edge Cases
- [ ] Refresh mid-case (should restore)
- [ ] Submit without completing all fields
- [ ] Enter invalid numbers in quant
- [ ] Very long text in textareas
- [ ] Navigate away and return

### Visual
- [ ] Progress bar animates smoothly
- [ ] Panel transitions are smooth
- [ ] Validation feedback is clear
- [ ] Modal is centered and readable
- [ ] Mobile responsive (390px+)

---

## 💡 Tips for Users

1. **Take Your Time** - No timer, focus on quality
2. **Use Frameworks** - They provide structure
3. **Show Your Work** - Explain your thinking
4. **Be Specific** - Concrete recommendations
5. **Practice Daily** - Build muscle memory

---

**Status:** ✅ Production-ready  
**Case:** GameBox Profitability  
**Panels:** 5 complete  
**Scoring:** Automated  
**Rewards:** XP, Coins, Badge
