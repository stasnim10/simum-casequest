# CaseQuest Server
- Dev: `cd server && npm i && npm run dev`
- Health: GET /api/health
- Config: copy `.env.example` to `.env` and fill values
- Do not commit .env

## Feedback API
- POST /api/feedback
- Body: `{ userId, caseId, steps: [{ name, content }], exhibits?, rubricVersion }`
- Optional header: `x-casequest-secret` when `FEEDBACK_API_SECRET` is set
- Set `DEV_MOCK=1` to use mock responses without OpenAI/Firebase credentials
- Responses are cached by deterministic hash of case content

## Cache Cleanup
- Purpose: delete ai_feedback_cache docs older than 30 days
- Local run: `npm run clean:cache`
- CI: .github/workflows/cache-clean.yml runs daily at 03:15 UTC
- Required GitHub repo secrets:
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY  (use the full multiline key. Wrap in GitHub Secrets as-is. No quotes needed)
