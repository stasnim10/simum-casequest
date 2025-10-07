import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { app } from '../firebase';

const remoteConfig = getRemoteConfig(app);

// Set defaults with rollout flags
remoteConfig.defaultConfig = {
  // Rollout flags
  'ux_enhanced_onboarding_enabled': false,
  'ux_next_best_action_enabled': false,
  'ux_session_summary_enabled': false,
  'ux_rollout_percentage': 0,
  
  // Experiment parameters
  'endowed_progress_percent': 10,
  'next_action_policy': 'weakness_first',
  'streak_grace_hours': 48,
  'review_batch_size': 10,
  
  // SM-2 parameters
  'sm2_initial_ease': 2.5,
  'sm2_first_interval': 1,
  'sm2_second_interval': 6,
  
  // Notification timing
  'notification_hour_morning': 9,
  'notification_hour_afternoon': 15,
  'notification_hour_evening': 19
};

class RemoteConfigService {
  constructor() {
    this.isInitialized = false;
    this.cachedValues = {};
  }

  async initialize() {
    if (this.isInitialized) return;
    
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    
    try {
      await fetchAndActivate(remoteConfig);
      this.cacheValues();
      this.isInitialized = true;
      console.log('Remote Config initialized successfully');
      
      // Prevent mid-session activation - only cache values, don't re-activate
      remoteConfig.settings.minimumFetchIntervalMillis = 86400000; // 24 hours
    } catch (error) {
      console.warn('Remote Config initialization failed, using defaults:', error);
      this.isInitialized = true; // Use defaults
    }
  }

  cacheValues() {
    // Cache all values to prevent mid-session changes
    this.cachedValues = {
      uxEnhancedOnboardingEnabled: getValue(remoteConfig, 'ux_enhanced_onboarding_enabled').asBoolean(),
      uxNextBestActionEnabled: getValue(remoteConfig, 'ux_next_best_action_enabled').asBoolean(),
      uxSessionSummaryEnabled: getValue(remoteConfig, 'ux_session_summary_enabled').asBoolean(),
      uxRolloutPercentage: getValue(remoteConfig, 'ux_rollout_percentage').asNumber(),
      endowedProgressPercent: getValue(remoteConfig, 'endowed_progress_percent').asNumber(),
      nextActionPolicy: getValue(remoteConfig, 'next_action_policy').asString(),
      streakGraceHours: getValue(remoteConfig, 'streak_grace_hours').asNumber(),
      reviewBatchSize: getValue(remoteConfig, 'review_batch_size').asNumber(),
      sm2Config: {
        initialEase: getValue(remoteConfig, 'sm2_initial_ease').asNumber(),
        firstInterval: getValue(remoteConfig, 'sm2_first_interval').asNumber(),
        secondInterval: getValue(remoteConfig, 'sm2_second_interval').asNumber()
      }
    };
  }

  // User eligibility check
  isUserInRollout(userId) {
    const rolloutPercentage = this.cachedValues.uxRolloutPercentage || 0;
    if (rolloutPercentage === 0) return false;
    
    // Consistent hash-based assignment
    const hash = this.hashUserId(userId);
    return hash < rolloutPercentage;
  }

  hashUserId(userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }

  // Feature flags
  isEnhancedOnboardingEnabled(userId) {
    return this.isUserInRollout(userId) && this.cachedValues.uxEnhancedOnboardingEnabled;
  }

  isNextBestActionEnabled(userId) {
    return this.isUserInRollout(userId) && this.cachedValues.uxNextBestActionEnabled;
  }

  isSessionSummaryEnabled(userId) {
    return this.isUserInRollout(userId) && this.cachedValues.uxSessionSummaryEnabled;
  }

  // Experiment parameters
  getEndowedProgressPercent() {
    return this.cachedValues.endowedProgressPercent || 10;
  }

  getNextActionPolicy() {
    return this.cachedValues.nextActionPolicy || 'weakness_first';
  }

  getStreakGraceHours() {
    return this.cachedValues.streakGraceHours || 48;
  }

  getReviewBatchSize() {
    return this.cachedValues.reviewBatchSize || 10;
  }

  getSM2Config() {
    return this.cachedValues.sm2Config || {
      initialEase: 2.5,
      firstInterval: 1,
      secondInterval: 6
    };
  }

  getNotificationHour(timePreference) {
    const key = `notification_hour_${timePreference}`;
    return getValue(remoteConfig, key).asNumber();
  }
}

export default new RemoteConfigService();
