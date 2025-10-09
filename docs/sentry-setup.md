# Sentry Setup Guide

## 1. Create Sentry Project

1. Go to https://sentry.io and create an account
2. Create a new project:
   - Platform: React
   - Project name: `casequest`
3. Copy the DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)

## 2. Generate Auth Token

1. Go to Settings → Auth Tokens
2. Create new token with scopes:
   - `project:releases`
   - `org:read`
3. Copy the token

## 3. Add GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VITE_SENTRY_DSN`: Your Sentry DSN
- `SENTRY_AUTH_TOKEN`: Your auth token from step 2

## 4. Local Development

Add to `.env.local`:
```
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=your_token_here
SENTRY_ORG=casequest
```

## 5. Test Error Tracking

Add a test error in your app:
```javascript
throw new Error("Test Sentry error");
```

Visit the page and check Sentry dashboard for the error.

## 6. Disable Sentry

To disable Sentry (e.g., in development):
- Leave `VITE_SENTRY_DSN` empty in `.env.local`
- Sentry will automatically skip initialization

## Features Enabled

✓ Error tracking with stack traces
✓ Source maps for production debugging
✓ Performance monitoring (traces)
✓ Session replay (10% sample, 100% on errors)
✓ Environment tagging (production/development)
