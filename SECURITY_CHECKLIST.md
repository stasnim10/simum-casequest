# Security Hardening Checklist

## 🔒 **Firestore Security Rules (CRITICAL)**

### Current Rules Audit
- [ ] Review existing `firestore.rules` file
- [ ] Test rules with Firebase Emulator
- [ ] Ensure no open read/write access

### Enhanced Security Rules
```javascript
// firestore.rules - Enhanced version
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId
        && validateUserData(request.resource.data);
    }
    
    // Lessons are read-only for authenticated users
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins via backend
    }
    
    // Rate limiting for writes
    match /users/{userId}/progress/{progressId} {
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && request.time > resource.data.lastUpdate + duration.value(1, 's');
    }
  }
  
  function validateUserData(data) {
    return data.keys().hasAll(['email', 'total_xp', 'current_streak'])
      && data.total_xp is number
      && data.total_xp >= 0
      && data.current_streak is number
      && data.current_streak >= 0;
  }
}
```

## 🛡️ **Firebase App Check Setup**

### Enable App Check
1. Firebase Console → Project Settings → App Check
2. Enable for Web app
3. Use reCAPTCHA v3 for production

### Implementation
```javascript
// src/firebase.js - Add App Check
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Initialize App Check
if (process.env.NODE_ENV === 'production') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
    isTokenAutoRefreshEnabled: true
  });
}
```

## 🔐 **Authentication Security**

### Password Requirements
- [ ] Minimum 8 characters
- [ ] Require email verification
- [ ] Implement password reset flow

### Session Management
```javascript
// Add session timeout
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

useEffect(() => {
  const checkSession = () => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
      signOut(auth);
    }
  };
  
  const interval = setInterval(checkSession, 60000); // Check every minute
  return () => clearInterval(interval);
}, []);
```

## 📊 **Data Validation**

### Client-Side Validation
```javascript
// Validate user inputs
const validateLessonCompletion = (data) => {
  return {
    xp: Math.max(0, Math.min(1000, data.xp)), // Cap XP gains
    timeSpent: Math.max(1, Math.min(3600, data.timeSpent)), // 1s to 1hr
    accuracy: Math.max(0, Math.min(100, data.accuracy))
  };
};
```

### Server-Side Validation (Cloud Functions)
```javascript
// functions/index.js
exports.validateProgress = functions.firestore
  .document('users/{userId}/progress/{progressId}')
  .onWrite((change, context) => {
    const data = change.after.data();
    
    // Validate XP gains aren't excessive
    if (data.xpGained > 500) {
      console.warn(`Suspicious XP gain: ${data.xpGained} for user ${context.params.userId}`);
      // Flag for review or cap the value
    }
    
    return null;
  });
```

## 🚨 **Monitoring & Alerts**

### Error Tracking
```javascript
// Add Sentry for error monitoring
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});

// Wrap app with error boundary
<Sentry.ErrorBoundary fallback={ErrorFallback}>
  <App />
</Sentry.ErrorBoundary>
```

### Security Monitoring
- [ ] Set up Firebase Security Rules alerts
- [ ] Monitor failed authentication attempts
- [ ] Track unusual data access patterns
- [ ] Set up quota alerts to prevent abuse

## ✅ **Implementation Timeline**

**Day 1: Security Rules**
- [ ] Update firestore.rules with enhanced validation
- [ ] Test with Firebase Emulator
- [ ] Deploy rules to production

**Day 2: App Check**
- [ ] Set up reCAPTCHA v3
- [ ] Enable App Check in Firebase Console
- [ ] Add App Check to client code

**Day 3: Authentication**
- [ ] Add session timeout logic
- [ ] Implement password requirements
- [ ] Test password reset flow

**Day 4: Monitoring**
- [ ] Set up Sentry error tracking
- [ ] Configure Firebase alerts
- [ ] Create security monitoring dashboard

**Day 5: Testing**
- [ ] Penetration testing with Firebase Emulator
- [ ] Test all security rules scenarios
- [ ] Verify App Check is blocking unauthorized requests
