# 🚀 ACTIVATE PHASE 1 - Execute Now

## Step 1: Deploy Build (2 minutes)
```bash
# Upload build/ folder to Firebase Hosting
# OR push to GitHub for auto-deploy
```
**Verify**: https://stasnim10.github.io/simum-casequest loads normally

## Step 2: Remote Config Activation (3 minutes)

**Firebase Console → Remote Config**
```json
{
  "ux_rollout_percentage": 10,
  "ux_enhanced_onboarding_enabled": true,
  "ux_next_best_action_enabled": true,
  "ux_session_summary_enabled": true,
  "endowed_progress_percent": 10,
  "next_action_policy": "weakness_first"
}
```
**Action**: PUBLISH immediately after setting values

## Step 3: A/B Tests (5 minutes)

**Firebase Console → A/B Testing**

**Test 1: Endowed Progress**
- Parameter: `endowed_progress_percent`
- Variants: 0%, 10%, 25%
- Target: New users (first 7 days)
- Goal: `first_lesson_complete`

**Test 2: Next Action Policy**  
- Parameter: `next_action_policy`
- Variants: "weakness_first", "time_budget_first"
- Target: Users with >3 lessons
- Goal: `next_action_taken`

**Action**: START both experiments

## Step 4: Verify Activation (5 minutes)

**Check 1: Feature Flags Working**
- Open app in incognito
- Create new account
- Verify 10% of users see enhanced onboarding

**Check 2: Analytics Flowing**
- GA4 → Reports → Realtime
- Look for `onboarding_start` events
- Verify custom dimensions populating

**Check 3: Experiments Running**
- Firebase A/B Testing dashboard
- Confirm traffic splitting
- Check goal events firing

---

## 📊 24-Hour Monitoring Dashboard

### Real-Time Alerts (Check Every 4 Hours)
- [ ] **Error Rate**: <1% (Current: ___%)
- [ ] **Session Duration**: >8 min (Current: ___min)
- [ ] **Active Users**: Stable vs yesterday (Current: ____)
- [ ] **Remote Config Fetch**: >95% success (Current: ___%)

### Daily KPI Scorecard (Check Each Morning)
| Metric | Baseline | Target | Current | Status |
|--------|----------|--------|---------|--------|
| Onboarding Completion | 70% | 80% | ___% | ⚪ |
| First Lesson Conversion | 50% | 60% | ___% | ⚪ |
| Day 1 Retention | 35% | 40% | ___% | ⚪ |
| NextBestAction CTR | N/A | 15% | ___% | ⚪ |

**Status Legend**: 🟢 Above Target | 🟡 On Target | 🔴 Below Target

### A/B Test Scoreboard
| Experiment | Traffic Split | Leading Variant | Confidence | Action |
|------------|---------------|-----------------|------------|--------|
| Endowed Progress | ___% / ___% / ___% | ___% variant | ___% | ⚪ |
| Next Action Policy | ___% / ___% | ___ variant | ___% | ⚪ |

---

## 🚨 ROLLBACK TRIGGERS

**Execute 2-Minute Rollback If:**
- Any primary KPI drops >10% vs baseline
- Error rate >2%
- User complaints about broken features
- Experiment traffic not splitting correctly

**Rollback Procedure:**
1. Firebase Console → Remote Config
2. Set `ux_rollout_percentage = 0`
3. PUBLISH immediately
4. Monitor recovery for 30 minutes

---

## ✅ 25% Ramp-Up Criteria (After 24 Hours)

**Proceed to 25% rollout if ALL true:**
- [ ] Onboarding completion ≥80%
- [ ] First lesson conversion ≥60%
- [ ] Day 1 retention ≥40%
- [ ] No error rate increase
- [ ] No user complaints
- [ ] A/B tests showing positive trends

**Ramp-Up Action:**
- Set `ux_rollout_percentage = 25`
- Continue same monitoring for another 24h

---

## 📞 Quick Links

- **Firebase Console**: https://console.firebase.google.com/project/casequest-62b9b
- **Remote Config**: https://console.firebase.google.com/project/casequest-62b9b/config
- **A/B Testing**: https://console.firebase.google.com/project/casequest-62b9b/abtesting
- **GA4 Dashboard**: https://analytics.google.com/analytics/web/
- **Live App**: https://stasnim10.github.io/simum-casequest

---

**🎯 ACTIVATION STATUS**
- [ ] Build deployed
- [ ] Remote Config enabled (10%)
- [ ] A/B tests running
- [ ] Monitoring active
- [ ] Team notified

**Activated By**: ________________  
**Activation Time**: ________________  
**Next Review**: ________________
