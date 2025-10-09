# Deploy CaseQuest API to Render

## Prerequisites
- GitHub repo: https://github.com/stasnim10/simum-casequest
- Render account: https://render.com

## Step 1: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `stasnim10/simum-casequest`
4. Configure service:
   - **Name**: `casequest-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Starter` (free tier)

## Step 2: Environment Variables

Add these in Render dashboard → Environment:

```
NODE_ENV=production
DEV_MOCK=0
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

Optional (for future AI integration):
```
OPENAI_API_KEY=sk-...
API_SECRET=your-secret-key
```

## Step 3: Deploy

1. Click "Create Web Service"
2. Wait for build and deploy (~2-3 minutes)
3. Note your service URL: `https://casequest-api.onrender.com`

## Step 4: Verify Deployment

### Health Check
```bash
curl https://casequest-api.onrender.com/api/health
```

Expected response:
```json
{"ok":true,"ts":1760050270034}
```

### Test Feedback Endpoint
```bash
curl -X POST https://casequest-api.onrender.com/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "demo",
    "caseId": "profitability-001",
    "steps": {
      "clarifying": ["What segments?"],
      "hypothesis": "Cost increase",
      "structure": "Profitability",
      "quant": {"revenue": 100, "cost": 80},
      "recommendation": "Reduce costs"
    }
  }'
```

Expected response:
```json
{
  "strengths": [...],
  "gaps": [...],
  "actionItems": [...],
  "scorecard": {
    "communication": 4,
    "structure": 4,
    "quantitative": 4,
    "synthesis": 3,
    "overall": "15"
  }
}
```

## Step 5: Update Frontend

Update `.env.local` in the main repo:
```
VITE_FEEDBACK_URL=https://casequest-api.onrender.com/api/feedback
```

Rebuild and redeploy frontend:
```bash
npm run build
npm run deploy
```

## CORS Configuration

The server allows requests from:
- https://www.casequestapp.com
- https://stasnim10.github.io
- http://localhost:5173 (dev)
- http://localhost:5174 (dev)

## Rate Limiting

- Window: 60 seconds
- Max requests: 60 per window
- Applies to all `/api/*` routes

## Monitoring

Check logs in Render dashboard:
- Dashboard → Your Service → Logs
- Look for: "CaseQuest API listening on port..."
- Monitor feedback requests: "Feedback request: userId=..."

## Troubleshooting

### Build fails
- Check Node version (requires >=18)
- Verify `npm ci && npm run build` works locally

### CORS errors
- Verify origin in CORS config matches your domain
- Check browser console for specific error

### 500 errors
- Check Render logs for stack traces
- Verify request payload matches expected format

## Custom Domain (Optional)

To use `api.casequestapp.com`:
1. Render Dashboard → Your Service → Settings → Custom Domain
2. Add `api.casequestapp.com`
3. Update DNS with provided CNAME record
4. Wait for SSL certificate provisioning (~5 minutes)
