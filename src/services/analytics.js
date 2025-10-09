import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '../firebase';

const analytics = getAnalytics(app);

class AnalyticsService {
  // Onboarding funnel events
  trackOnboardingStart() {
    logEvent(analytics, 'onboarding_start');
  }

  trackGoalSet(goalMinutes) {
    logEvent(analytics, 'goal_set', { goal_minutes: goalMinutes });
  }

  trackFirstLessonStart() {
    logEvent(analytics, 'first_lesson_start');
  }

  trackFirstLessonComplete(timeSpent) {
    logEvent(analytics, 'first_lesson_complete', { time_spent_seconds: timeSpent });
  }

  trackSummaryViewed(sessionData) {
    logEvent(analytics, 'summary_viewed', {
      xp_earned: sessionData.xpEarned,
      streak_extended: sessionData.streakExtended,
      skills_count: sessionData.skillsImproved?.length || 0
    });
  }

  // Next best action events
  trackNextActionShown(actionType, urgency) {
    logEvent(analytics, 'next_action_shown', { action_type: actionType, urgency });
  }

  trackNextActionTaken(actionType) {
    logEvent(analytics, 'next_action_taken', { action_type: actionType });
  }

  // Streak protection events
  trackStreakProtectionViewed() {
    logEvent(analytics, 'streak_protection_viewed');
  }

  trackStreakFreezeUsed(streakLength) {
    logEvent(analytics, 'streak_freeze_used', { streak_length: streakLength });
  }

  // Review session events
  trackReviewSessionStart(itemCount) {
    logEvent(analytics, 'review_session_start', { item_count: itemCount });
  }

  trackReviewSessionComplete(results) {
    logEvent(analytics, 'review_session_complete', {
      total_items: results.total,
      correct_items: results.correct,
      accuracy: results.accuracy,
      time_spent_seconds: results.timeSpent * 60
    });
  }

  // Retention tracking
  trackDailyReturn(daysSinceLastVisit) {
    logEvent(analytics, 'daily_return', { days_since_last_visit: daysSinceLastVisit });
  }

  trackStreakComplete(streakLength) {
    logEvent(analytics, 'streak_complete', { streak_length: streakLength });
  }

  // Set user properties for cohort analysis
  setUserCohort(cohortWeek) {
    logEvent(analytics, 'set_user_property', {
      custom_parameter_cohort_week: cohortWeek
    });
  }

  setOnboardingComplete(completed) {
    logEvent(analytics, 'set_user_property', {
      custom_parameter_onboarding_complete: completed
    });
  }

  // Track experiment assignment
  setExperimentVariant(experimentName, variant) {
    logEvent(analytics, 'set_user_property', {
      [`custom_parameter_${experimentName}_variant`]: variant
    });
  }

  // Track feature flag state
  setFeatureFlagState(flagName, enabled) {
    logEvent(analytics, 'set_user_property', {
      [`custom_parameter_${flagName}_enabled`]: enabled
    });
  }
}

export default new AnalyticsService();
