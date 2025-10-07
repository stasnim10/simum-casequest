# GA4 Cohort Analysis Setup for CaseQuest UX Rollout

## 1. Custom Events Setup

In GA4 → Configure → Events, mark these as conversions:
- `first_lesson_complete`
- `onboarding_start` 
- `summary_viewed`
- `streak_complete`

## 2. Custom Dimensions

In GA4 → Configure → Custom Definitions → Custom Dimensions:

| Dimension Name | Event Parameter | Scope |
|---|---|---|
| Cohort Week | custom_parameter_cohort_week | User |
| Onboarding Complete | custom_parameter_onboarding_complete | User |
| UX Variant | custom_parameter_ux_variant | User |
| Goal Minutes | goal_minutes | Event |
| Action Type | action_type | Event |
| Urgency Level | urgency | Event |

## 3. Cohort Exploration Setup

### Primary Cohort Analysis
1. Go to Explore → Cohort Exploration
2. **Cohort Definition**: 
   - Cohort by: `first_visit`
   - Cohort size: Daily
3. **Return Criteria**: 
   - Metric: `active_users`
   - Time range: 28 days
4. **Segments**:
   - Create segment: "Enhanced Onboarding Users" 
     - Condition: `custom_parameter_onboarding_complete` = true
   - Create segment: "Control Group"
     - Condition: `custom_parameter_onboarding_complete` = false or null

### Onboarding Funnel Analysis
1. Go to Explore → Funnel Exploration
2. **Steps**:
   1. `onboarding_start`
   2. `goal_set` 
   3. `first_lesson_start`
   4. `first_lesson_complete`
   5. `summary_viewed`
3. **Breakdown**: Custom dimension "UX Variant"

## 4. Key Metrics Dashboard

Create custom report with these metrics:

### Primary KPIs (Week 1)
- **Onboarding Completion Rate**: `goal_set` events / `onboarding_start` events
- **First Lesson Conversion**: `first_lesson_complete` / `first_lesson_start`  
- **Day 1 Retention**: Active users day 1 / Active users day 0
- **Session Duration**: Average session duration by cohort

### Secondary KPIs (Week 2-4)
- **Day 7 Retention**: Active users day 7 / Active users day 0
- **Streak Completion**: `streak_complete` events with `streak_length` >= 7
- **Review Engagement**: `review_session_complete` / `review_session_start`
- **Next Action CTR**: `next_action_taken` / `next_action_shown`

## 5. Rollback Triggers

Set up alerts for:
- **Onboarding completion rate** drops >10% vs baseline
- **Day 1 retention** drops >10% vs baseline  
- **Session duration** drops >15% vs baseline
- **Error rate** increases >5% vs baseline

## 6. Experiment Analysis

### Endowed Progress A/B Test
- **Variants**: 0%, 10%, 25% endowed progress
- **Primary Metric**: `first_lesson_complete` conversion rate
- **Secondary**: Day 1 and Day 7 retention
- **Sample Size**: Minimum 1000 users per variant
- **Runtime**: 14 days minimum

### Next Action Policy A/B Test  
- **Variants**: "weakness_first" vs "time_budget_first"
- **Primary Metric**: `next_action_taken` CTR
- **Secondary**: Daily return rate, session length
- **Audience**: Users with >3 completed lessons
- **Runtime**: 21 days minimum

## 7. Weekly Review Process

### Week 1 Checklist
- [ ] Baseline cohort established (pre-rollout users)
- [ ] 10% rollout cohort tracking properly
- [ ] Onboarding funnel conversion rates measured
- [ ] No significant drops in primary KPIs
- [ ] Remote Config parameters activating correctly

### Week 2-4 Checklist  
- [ ] Retention curves show positive trend vs baseline
- [ ] A/B test results reaching statistical significance
- [ ] Feature usage metrics trending upward
- [ ] No performance regressions in Core Web Vitals
- [ ] User feedback sentiment remains positive

## 8. Success Criteria

**Go/No-Go for 25% Rollout:**
- Onboarding completion rate ≥80% (vs 70% baseline)
- First lesson conversion ≥60% (vs 50% baseline)  
- Day 1 retention ≥40% (vs 35% baseline)
- No increase in crash/error rates

**Go/No-Go for 50% Rollout:**
- Day 7 retention ≥20% (vs 15% baseline)
- Session duration maintains or improves
- Positive statistical significance in A/B tests
- User satisfaction score ≥4.0/5.0

**Full Rollout Criteria:**
- All primary and secondary KPIs positive
- A/B test winners identified and implemented
- 28-day retention shows sustained improvement
- Performance metrics within acceptable bounds
