# Phase 1 Deployment Checklist - CaseQuest UX Rollout

## Pre-Deployment (Complete Before Deploy)

### Firebase Setup
- [ ] **Remote Config Parameters**: Upload `firebase-remote-config-setup.json` parameters
- [ ] **Default Values**: Verify all flags default to `false` and rollout percentage to `0`
- [ ] **Conditions**: Create percentage-based conditions (10%, 25%, 50%)
- [ ] **A/B Tests**: Create experiments for endowed progress and next action policy
- [ ] **Analytics Integration**: Verify GA4 project linked to Firebase

### GA4 Configuration  
- [ ] **Custom Events**: Mark conversion events (`first_lesson_complete`, `onboarding_start`)
- [ ] **Custom Dimensions**: Create user and event-scoped dimensions
- [ ] **Cohort Reports**: Set up baseline cohort exploration
- [ ] **Funnel Analysis**: Configure onboarding funnel tracking
- [ ] **Alerts**: Set up rollback trigger alerts

### Code Review
- [ ] **Feature Flags**: All new components behind Remote Config flags
- [ ] **Safe Activation**: Values cached on app start, no mid-session changes
- [ ] **Analytics**: All user actions properly instrumented
- [ ] **Error Handling**: Graceful fallbacks if Remote Config fails
- [ ] **Performance**: Lazy loading for new components

## Deployment Steps

### Step 1: Deploy Code (10% Rollout)
```bash
# Deploy with all flags disabled
npm run build
firebase deploy --only hosting

# Verify deployment
curl -I https://your-app.web.app
```

### Step 2: Enable Remote Config (Conservative)
In Firebase Console → Remote Config:
- [ ] Set `ux_rollout_percentage` = `10`
- [ ] Set `ux_enhanced_onboarding_enabled` = `true` 
- [ ] Set `ux_next_best_action_enabled` = `true`
- [ ] Set `ux_session_summary_enabled` = `true`
- [ ] **Publish changes**

### Step 3: Start A/B Tests
- [ ] **Endowed Progress Test**: 0% vs 10% vs 25%, target 10% of new users
- [ ] **Next Action Policy Test**: weakness_first vs time_budget_first, target existing users
- [ ] Verify audience targeting excludes overlap

### Step 4: Monitor Initial Rollout (24 Hours)
- [ ] **Remote Config Fetch Rate**: >95% success
- [ ] **Feature Flag Activation**: Users properly segmented
- [ ] **Analytics Events**: Firing correctly in GA4 DebugView
- [ ] **Error Rates**: No increase in console errors
- [ ] **Performance**: Core Web Vitals stable

## Monitoring Dashboard (Week 1)

### Real-Time Metrics (Check Every 4 Hours)
- [ ] **Active Users**: No significant drop vs baseline
- [ ] **Session Duration**: Maintaining >8 minutes average
- [ ] **Bounce Rate**: Not increasing >5% vs baseline
- [ ] **Error Rate**: <1% of sessions with JS errors

### Daily Metrics (Check Every Morning)
- [ ] **Onboarding Completion**: Target >80% (baseline: 70%)
- [ ] **First Lesson Conversion**: Target >60% (baseline: 50%)
- [ ] **Day 1 Retention**: Target >40% (baseline: 35%)
- [ ] **Feature Usage**: NextBestAction CTR >15%

### Weekly Cohort Analysis
- [ ] **Retention Curves**: 10% rollout cohort vs baseline
- [ ] **A/B Test Results**: Statistical significance trending
- [ ] **User Feedback**: Sentiment analysis from support
- [ ] **Performance Impact**: LCP, FID, CLS within targets

## Rollback Procedures

### Immediate Rollback Triggers
If ANY of these occur, rollback immediately:
- [ ] **Crash Rate** increases >2% vs baseline
- [ ] **Onboarding Completion** drops >15% vs baseline  
- [ ] **Day 1 Retention** drops >15% vs baseline
- [ ] **Session Duration** drops >20% vs baseline

### Rollback Steps (Execute in Order)
1. **Disable Features** (2 minutes):
   ```
   Firebase Console → Remote Config
   - Set ux_rollout_percentage = 0
   - Publish immediately
   ```

2. **Pause A/B Tests** (1 minute):
   ```
   Firebase Console → A/B Testing
   - Pause all running experiments
   - Note current results for analysis
   ```

3. **Monitor Recovery** (30 minutes):
   ```
   - Verify metrics returning to baseline
   - Check error rates decreasing
   - Confirm user experience restored
   ```

4. **Incident Analysis** (24 hours):
   ```
   - Export affected user cohort data
   - Analyze failure mode and root cause
   - Plan remediation before re-enabling
   ```

## Ramp-Up Plan (If Week 1 Successful)

### Week 2: 25% Rollout
**Prerequisites:**
- [ ] All Week 1 KPIs positive vs baseline
- [ ] No unresolved performance issues
- [ ] A/B test results trending positive

**Actions:**
- [ ] Update `ux_rollout_percentage` = `25`
- [ ] Monitor same metrics with larger sample
- [ ] Expand A/B test audience proportionally

### Week 3: 50% Rollout  
**Prerequisites:**
- [ ] Day 7 retention positive vs baseline
- [ ] A/B test statistical significance achieved
- [ ] User satisfaction feedback positive

**Actions:**
- [ ] Update `ux_rollout_percentage` = `50`
- [ ] Begin planning Phase 2 features
- [ ] Prepare winner variants for full rollout

### Week 4: Full Rollout Decision
**Prerequisites:**
- [ ] All primary and secondary KPIs positive
- [ ] A/B test winners identified
- [ ] 28-day retention data available
- [ ] Performance within acceptable bounds

**Actions:**
- [ ] Set winning variants as defaults
- [ ] Update `ux_rollout_percentage` = `100`
- [ ] Begin Phase 2 development
- [ ] Document lessons learned

## Success Metrics Summary

| Metric | Baseline | Week 1 Target | Week 4 Target |
|--------|----------|---------------|---------------|
| Onboarding Completion | 70% | 80% | 85% |
| First Lesson Conversion | 50% | 60% | 70% |
| Day 1 Retention | 35% | 40% | 45% |
| Day 7 Retention | 15% | 20% | 25% |
| Session Duration | 7 min | 8 min | 9 min |
| NextBestAction CTR | N/A | 15% | 25% |

## Emergency Contacts

- **Engineering Lead**: [Your contact]
- **Product Manager**: [Your contact]  
- **Firebase Admin**: [Your contact]
- **GA4 Admin**: [Your contact]

---

**Deployment Authorization:**
- [ ] Engineering Lead Approval
- [ ] Product Manager Approval  
- [ ] QA Sign-off
- [ ] Rollback Plan Reviewed

**Deploy Time:** ___________
**Deployed By:** ___________
**Monitoring Lead:** ___________
