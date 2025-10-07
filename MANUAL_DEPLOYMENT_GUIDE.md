# Phase 1 Manual Deployment Guide

## ✅ Build Complete
The application has been successfully built with Phase 1 UX features integrated behind feature flags.

**Build Output**: `/Users/simum/casequest-app/simum-casequest/build/`

## 🚀 Deployment Steps

### Step 1: Deploy to Firebase Hosting

Since Firebase CLI is not available locally, deploy using one of these methods:

**Option A: Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

**Option B: Manual Upload**
1. Go to [Firebase Console](https://console.firebase.google.com/project/casequest-62b9b/hosting)
2. Click "Add another site" or use existing site
3. Upload the entire `build/` folder contents
4. Set as active deployment

**Option C: GitHub Actions (Recommended)**
The repository already has GitHub Actions configured. Push to main branch to auto-deploy.

### Step 2: Configure Remote Config (CRITICAL)

⚠️ **All features are disabled by default. Must enable in Firebase Console.**

1. Go to [Firebase Remote Config](https://console.firebase.google.com/project/casequest-62b9b/config)

2. **Add these parameters** (copy from `firebase-remote-config-setup.json`):

```json
{
  "ux_enhanced_onboarding_enabled": false,
  "ux_next_best_action_enabled": false, 
  "ux_session_summary_enabled": false,
  "ux_rollout_percentage": 0,
  "endowed_progress_percent": 10,
  "next_action_policy": "weakness_first",
  "streak_grace_hours": 48,
  "review_batch_size": 10
}
```

3. **Enable 10% rollout**:
   - Set `ux_rollout_percentage` = `10`
   - Set `ux_enhanced_onboarding_enabled` = `true`
   - Set `ux_next_best_action_enabled` = `true`
   - Set `ux_session_summary_enabled` = `true`
   - **PUBLISH** changes

### Step 3: Create A/B Tests

1. Go to [Firebase A/B Testing](https://console.firebase.google.com/project/casequest-62b9b/abtesting)

2. **Create "Endowed Progress" Experiment**:
   - Name: "Endowed Progress Onboarding"
   - Parameter: `endowed_progress_percent`
   - Variants: 0, 10, 25
   - Targeting: 10% of users
   - Goal metric: `first_lesson_complete`

3. **Create "Next Action Policy" Experiment**:
   - Name: "Next Action Recommendation Policy"  
   - Parameter: `next_action_policy`
   - Variants: "weakness_first", "time_budget_first"
   - Targeting: Users with >3 completed lessons
   - Goal metric: `next_action_taken`

### Step 4: Set Up GA4 Monitoring

1. Go to [GA4 Console](https://analytics.google.com/analytics/web/)

2. **Configure Custom Dimensions**:
   - `cohort_week` (User scope)
   - `onboarding_complete` (User scope)
   - `ux_variant` (User scope)
   - `action_type` (Event scope)
   - `urgency` (Event scope)

3. **Create Cohort Analysis**:
   - Explore → Cohort Exploration
   - Cohort by: `first_visit`
   - Return criteria: `active_users`
   - Segment by: `onboarding_complete`

4. **Set Up Alerts**:
   - Daily retention drops >10%
   - Session duration drops >15%
   - Error rate increases >2%

## 📊 24-Hour Monitoring Plan

### Real-Time Checks (Every 4 hours)
- [ ] Remote Config fetch success rate >95%
- [ ] No JavaScript errors in console
- [ ] Feature flags activating correctly
- [ ] User segmentation working (10% in rollout)

### Daily Metrics (Check each morning)
- [ ] **Onboarding completion**: Target >80% (baseline: 70%)
- [ ] **First lesson conversion**: Target >60% (baseline: 50%)
- [ ] **Day 1 retention**: Target >40% (baseline: 35%)
- [ ] **Session duration**: Maintain >8 minutes
- [ ] **Error rate**: Keep <1%

### A/B Test Monitoring
- [ ] Experiment traffic splitting correctly
- [ ] Goal events firing in GA4
- [ ] No interaction effects between tests
- [ ] Sample sizes accumulating properly

## 🚨 Rollback Procedure

**Immediate Rollback Triggers:**
- Any primary KPI drops >10% vs baseline
- Error rate increases >2%
- User complaints about broken UI

**Rollback Steps (2 minutes):**
1. Firebase Console → Remote Config
2. Set `ux_rollout_percentage` = `0`
3. **PUBLISH** immediately
4. Monitor recovery for 30 minutes
5. Investigate root cause before re-enabling

## 🎯 Success Criteria for 25% Ramp-Up

After 24 hours, proceed to 25% rollout if:
- [ ] All primary KPIs meet or exceed targets
- [ ] No stability issues or user complaints
- [ ] A/B tests showing positive trends
- [ ] Feature usage metrics healthy

**Next Steps:**
- Set `ux_rollout_percentage` = `25`
- Continue monitoring with same criteria
- Plan Phase 2 features (spaced repetition, notifications)

## 📞 Emergency Contacts

- **Firebase Console**: https://console.firebase.google.com/project/casequest-62b9b
- **GA4 Dashboard**: https://analytics.google.com/analytics/web/
- **GitHub Repository**: https://github.com/stasnim10/simum-casequest

---

## ✅ Deployment Checklist

- [ ] Application built successfully
- [ ] Remote Config parameters added
- [ ] 10% rollout enabled
- [ ] A/B tests created and running
- [ ] GA4 monitoring configured
- [ ] Rollback procedure documented
- [ ] 24-hour monitoring plan active

**Status**: Ready for activation in Firebase Console
**Next Action**: Enable Remote Config flags and monitor for 24 hours
