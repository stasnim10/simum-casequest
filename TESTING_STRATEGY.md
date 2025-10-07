# Testing Strategy - CaseQuest

## 🧪 **Testing Pyramid**

### Unit Tests (70% coverage target)
**Tools**: Jest + React Testing Library

**Priority Components to Test:**
- [ ] `EnhancedOnboarding` - goal setting, progress flow
- [ ] `NextBestAction` - recommendation logic
- [ ] `SessionSummary` - XP calculation, streak logic
- [ ] `spacedRepetitionService` - SM-2 algorithm
- [ ] `remoteConfig` - feature flag logic

### Integration Tests (20% coverage)
**Tools**: Jest + Firebase Emulator

**Key Flows to Test:**
- [ ] User registration → onboarding → first lesson
- [ ] Lesson completion → XP gain → streak update
- [ ] Remote Config → feature flag activation
- [ ] Firestore security rules validation

### E2E Tests (10% coverage)
**Tools**: Cypress or Playwright

**Critical User Journeys:**
- [ ] Complete onboarding flow
- [ ] Complete first lesson and see summary
- [ ] Maintain streak across multiple days
- [ ] Feature flags work correctly

## 🔧 **Implementation Plan**

### Week 1: Unit Tests Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/jest-dom @testing-library/user-event
```

**Example Unit Test:**
```javascript
// src/components/__tests__/EnhancedOnboarding.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedOnboarding from '../EnhancedOnboarding';

describe('EnhancedOnboarding', () => {
  test('allows user to set daily goal', () => {
    const mockOnComplete = jest.fn();
    render(<EnhancedOnboarding onComplete={mockOnComplete} />);
    
    // Click 10 minute goal
    fireEvent.click(screen.getByText('10 min'));
    
    // Navigate through steps
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Evening (7-9 PM)'));
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Start Learning!'));
    
    expect(mockOnComplete).toHaveBeenCalledWith({
      dailyGoalMinutes: 10,
      preferredStudyTime: 'evening',
      hasCompletedOnboarding: true,
      endowedProgress: { firstModuleProgress: 10 }
    });
  });
});
```

### Week 2: Firebase Emulator Tests
```javascript
// src/services/__tests__/firestore.test.js
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Firestore Security Rules', () => {
  let testEnv;
  
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'casequest-test',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
    });
  });
  
  test('users can only read their own data', async () => {
    const alice = testEnv.authenticatedContext('alice');
    const bob = testEnv.authenticatedContext('bob');
    
    // Alice can read her own data
    await alice.firestore().doc('users/alice').get();
    
    // Alice cannot read Bob's data
    await expect(
      alice.firestore().doc('users/bob').get()
    ).rejects.toThrow();
  });
});
```

### Week 3: E2E Tests
```javascript
// cypress/e2e/onboarding.cy.js
describe('User Onboarding', () => {
  it('completes enhanced onboarding flow', () => {
    cy.visit('/');
    
    // Sign up
    cy.get('[data-testid="signup-email"]').type('test@example.com');
    cy.get('[data-testid="signup-password"]').type('password123');
    cy.get('[data-testid="signup-button"]').click();
    
    // Enhanced onboarding should appear
    cy.contains('Set Your Daily Goal');
    cy.get('[data-testid="goal-10min"]').click();
    cy.get('[data-testid="next-button"]').click();
    
    // Select study time
    cy.contains('Evening (7-9 PM)').click();
    cy.get('[data-testid="next-button"]').click();
    
    // Complete onboarding
    cy.get('[data-testid="start-learning"]').click();
    
    // Should see dashboard with next best action
    cy.contains('Recommended for You');
    cy.contains('Continue Learning');
  });
});
```

## 📊 **Test Coverage Goals**

### Phase 1 (Week 1-2)
- [ ] 50% unit test coverage on new components
- [ ] Security rules tested with emulator
- [ ] Basic E2E smoke test

### Phase 2 (Week 3-4)
- [ ] 70% unit test coverage
- [ ] Integration tests for all Firebase operations
- [ ] Complete E2E test suite

### Phase 3 (Ongoing)
- [ ] 80%+ coverage maintained
- [ ] Performance regression tests
- [ ] Accessibility automated testing

## 🚀 **CI/CD Integration**

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage --watchAll=false
      
      - name: Start Firebase Emulator
        run: npm run emulator &
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 🎯 **Testing Priorities**

**Critical (Must Test):**
1. User authentication and data security
2. Onboarding flow completion
3. XP/streak calculation accuracy
4. Feature flag activation logic

**Important (Should Test):**
1. Spaced repetition algorithm
2. Session summary calculations
3. Mobile responsive behavior
4. Error handling and recovery

**Nice to Have (Could Test):**
1. Animation performance
2. Accessibility compliance
3. Cross-browser compatibility
4. Load testing scenarios
