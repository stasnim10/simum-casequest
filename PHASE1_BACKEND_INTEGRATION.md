# Phase 1: Backend Integration - AI Follow-ups

**Status**: ✅ Complete  
**Date**: October 19, 2025

## Overview

Replaced static rule-based follow-up questions with dynamic AI-generated prompts using GPT-4o-mini. The system now provides personalized, context-aware follow-up questions based on the user's current answer and previous work.

## Changes Made

### Backend (Server)

#### 1. Added OpenAI SDK
```bash
npm install openai
```

#### 2. New Endpoint: POST /api/followups
**Location**: `server/src/index.ts`

**Request Body**:
```json
{
  "step": 0-4,
  "caseTitle": "Declining Profits at RetailCo",
  "userAnswer": "Current step answer",
  "previousAnswers": { "clarifying": [...], "hypothesis": "..." }
}
```

**Response**:
```json
{
  "followups": [
    "What clarifying questions would help narrow the scope?",
    "What assumptions should we validate first?"
  ]
}
```

**Features**:
- GPT-4o-mini for fast, cost-effective responses
- Context-aware prompts based on case title, current answer, and previous work
- Mock mode when `OPENAI_API_KEY` is not set or `DEV_MOCK=1`
- Fallback to generic questions if API fails
- Max 15 words per question for conciseness
- Temperature 0.7 for balanced creativity

### Frontend

#### 1. New API Client: `src/lib/followupsAPI.js`
- Fetches AI follow-ups from backend
- Graceful error handling with null return on failure
- Uses `VITE_FEEDBACK_URL` environment variable

#### 2. Updated: `src/lib/voiceFollowups.js`
- Changed from synchronous to async function
- Calls `fetchAIFollowups()` with context
- Falls back to static prompts if API fails
- Includes helper functions to extract current/previous answers

#### 3. Updated: `src/pages/CaseSimulator.jsx`
- Added `hints` state to store AI-generated prompts
- Added `useEffect` to fetch hints when step or answers change
- Updated `speakFollowups()` to await async function
- Updated hints display to use state instead of direct function call

## How It Works

### Flow Diagram
```
User enters step → Frontend calls fetchAIFollowups() 
                 ↓
Backend receives: step, caseTitle, userAnswer, previousAnswers
                 ↓
GPT-4o-mini generates 2 contextual questions
                 ↓
Frontend displays hints + TTS speaks them
                 ↓
If API fails → Falls back to static prompts
```

### Example Prompts

**Step 0 (Clarifying Questions)**:
- Static: "What clarifying questions would help narrow the scope?"
- AI: "What is the company's current market position and competitive landscape?"

**Step 1 (Hypothesis)**:
- Static: "What is the 1-2 sentence hypothesis linking drivers to the outcome?"
- AI: "Based on your clarifying questions, what's your initial hypothesis about the root cause?"

**Step 4 (Recommendation)**:
- Static: "State a crisp recommendation with impact, risk, and next step."
- AI: "How would you prioritize your recommendations based on impact and feasibility?"

## Configuration

### Backend Environment Variables
```bash
# Required for AI mode
OPENAI_API_KEY=sk-xxx

# Optional: Force mock mode even with API key
DEV_MOCK=1

# Existing variables
PORT=8787
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,https://stasnim10.github.io
```

### Frontend Environment Variables
```bash
# Uses existing feedback URL, replaces /feedback with /followups
VITE_FEEDBACK_URL=https://api.casequestapp.com/api/feedback
```

## Testing

### Local Testing
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev

# Navigate to http://localhost:5173/#/case
# Enable Voice Input and Voice Output
# Observe AI-generated hints in purple box
```

### Mock Mode Testing
Set `DEV_MOCK=1` in `server/.env` to test without OpenAI API key.

### Production Testing
1. Deploy backend with `OPENAI_API_KEY` set
2. Deploy frontend with `VITE_FEEDBACK_URL` pointing to production API
3. Test on https://www.casequestapp.com/#/case

## Performance

### API Response Time
- GPT-4o-mini: ~500-1000ms per request
- Mock mode: <10ms

### Cost Estimation
- GPT-4o-mini: $0.00015 per request (input) + $0.0006 per response (output)
- Average cost per case (5 steps): ~$0.005
- 1000 cases/month: ~$5

### Caching Strategy (Future)
- Cache follow-ups by (step, caseTitle, userAnswer hash)
- TTL: 24 hours
- Reduces API calls by ~70%

## Error Handling

### Backend Errors
- Missing API key → Mock mode
- OpenAI API error → 500 response
- Invalid request → 400 response

### Frontend Errors
- API timeout → Falls back to static prompts
- Network error → Falls back to static prompts
- Invalid response → Falls back to static prompts

## Analytics

### New Events
- `ai_followups_requested` - When API is called
- `ai_followups_success` - When AI prompts are received
- `ai_followups_fallback` - When static prompts are used

### Existing Events (Still Tracked)
- `voice_mode_enabled`
- `tts_enabled`
- `voice_transcript_captured`
- `tts_spoken`

## Files Modified

### Backend
- `server/src/index.ts` (+45 lines)
- `server/package.json` (+1 dependency)

### Frontend
- `src/lib/followupsAPI.js` (new, 15 lines)
- `src/lib/voiceFollowups.js` (refactored, +25 lines)
- `src/pages/CaseSimulator.jsx` (+5 lines)

### Documentation
- `PHASE1_BACKEND_INTEGRATION.md` (this file)

## Next Steps

### Phase 2: Advanced Voice Features
- [ ] Voice selection dropdown
- [ ] Speech rate slider
- [ ] Transcript editing UI
- [ ] Voice activity detection

### Phase 3: Premium Voices
- [ ] ElevenLabs integration
- [ ] Custom voice cloning
- [ ] Emotion-aware speech

### Phase 4: Multi-language Support
- [ ] Spanish, Mandarin, French
- [ ] Auto-detect language

### Phase 5: Analytics & Insights
- [ ] Voice usage funnel
- [ ] Transcript quality metrics
- [ ] A/B testing

## Deployment Checklist

- [ ] Set `OPENAI_API_KEY` in production backend
- [ ] Deploy backend to Render/AWS/etc
- [ ] Update `VITE_FEEDBACK_URL` in frontend `.env.production`
- [ ] Build and deploy frontend
- [ ] Test on production URL
- [ ] Monitor API costs in OpenAI dashboard
- [ ] Set up alerts for high usage

## Rollback Plan

If issues occur:
1. Set `DEV_MOCK=1` in backend to disable AI
2. Or revert to previous commit before Phase 1
3. Static prompts will continue working

## Success Metrics

- [ ] AI follow-ups load in <1 second
- [ ] Fallback rate <5%
- [ ] User engagement with hints increases by 20%
- [ ] API costs stay under $10/month for first 1000 users

---

**Completed**: October 19, 2025  
**Next Phase**: Phase 2 - Advanced Voice Features
