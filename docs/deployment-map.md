# CaseQuest Deployment Map

## Flow: Local → GitHub → Domain → Live

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOCAL DEVELOPMENT                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   npm run dev          │
                    │   (localhost:5173)     │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   npm run build        │
                    │   → dist/              │
                    └────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                         GITHUB PAGES                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   npm run deploy       │
                    │   → gh-pages branch    │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   GitHub Actions       │
                    │   (auto-build)         │
                    └────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                         CUSTOM DOMAIN                            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   CNAME file           │
                    │   www.casequestapp.com │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   DNS Propagation      │
                    │   (2-48 hours)         │
                    └────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                         LIVE SITE                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   https://             │
                    │   www.casequestapp.com │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌──────────────────┐    ┌──────────────────┐
        │   HashRouter     │    │   GitHub Pages   │
        │   /#/learn       │    │   CDN Cache      │
        │   /#/dashboard   │    │   (5-10 min)     │
        │   /#/case        │    │                  │
        └──────────────────┘    └──────────────────┘
```

## Key Components

### 1. Build System
- **Tool**: Vite 7.1.9
- **Output**: `dist/` directory
- **Assets**: Hashed filenames for cache busting
- **Base**: `/` (root path for custom domain)

### 2. Routing
- **Type**: HashRouter (client-side)
- **Why**: GitHub Pages doesn't support server-side routing
- **Format**: `/#/path` (hash-based URLs)

### 3. Deployment
- **Tool**: gh-pages package
- **Target**: `gh-pages` branch
- **Trigger**: `npm run deploy`
- **CNAME**: Preserved in `public/CNAME`

### 4. Domain Configuration
- **Custom Domain**: www.casequestapp.com
- **DNS**: CNAME → stasnim10.github.io
- **HTTPS**: Enforced by GitHub Pages
- **Certificate**: Auto-provisioned by GitHub

### 5. Cache Layers
```
Browser Cache (1 hour)
        ↓
GitHub CDN (5-10 min)
        ↓
Origin (gh-pages branch)
```

## Recovery Scenarios

### Scenario 1: Build Fails
```bash
npm run clean      # Remove dist & node_modules
npm run build      # Fresh build
```

### Scenario 2: Deploy Fails
```bash
npm run redeploy   # Clean + build + deploy
```

### Scenario 3: Domain Lost
```bash
npm run restore-domain   # Fix CNAME on gh-pages
```

### Scenario 4: Cache Issues
- Wait 5-10 minutes for CDN
- Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
- Check: https://www.casequestapp.com/?v=timestamp

### Scenario 5: DNS Issues
- Check: https://dnschecker.org/#A/www.casequestapp.com
- Expected: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- Wait: 2-48 hours for full propagation

## Monitoring

### Health Checks
```bash
# Route validation
curl -s "https://www.casequestapp.com/#/learn" | grep -o '<div id="root">'

# Analytics status
# Open DevTools → Console → Look for "PostHog initialized" or "PostHog disabled"

# Demo reset
# Visit: https://www.casequestapp.com/#/?demo=1
```

### Deploy Log
```bash
./deploy.sh        # Timestamped deploy with logging
tail deploy.log    # View recent deploys
```

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| HashRouter | GitHub Pages doesn't support server-side routing |
| Vite | Fast builds, modern tooling, HMR |
| gh-pages package | Automated branch management |
| Custom domain | Professional branding |
| PostHog | Privacy-friendly analytics with auto-noop |
| localStorage | Client-side persistence, no backend needed |

## Troubleshooting Matrix

| Symptom | Cause | Solution |
|---------|-------|----------|
| 404 on routes | BrowserRouter used | Switch to HashRouter |
| Domain not working | CNAME missing | `npm run restore-domain` |
| Old content showing | CDN cache | Wait 10 min or hard refresh |
| Build errors | Dependency issues | `npm run clean` |
| Deploy fails | Git conflicts | Check gh-pages branch |
| Analytics not tracking | No PostHog key | Add VITE_POSTHOG_KEY to .env.local |

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Deployment
npm run deploy           # Deploy to gh-pages
npm run redeploy         # Clean + build + deploy
./deploy.sh              # Deploy with logging

# Recovery
npm run clean            # Remove dist & node_modules
npm run rebuild          # Clean + build
npm run restore-domain   # Fix CNAME on gh-pages

# Validation
curl -s "https://www.casequestapp.com/#/learn" | grep -o '<div id="root">'
```

## Onboarding Checklist

- [ ] Clone repo: `git clone https://github.com/stasnim10/simum-casequest.git`
- [ ] Install: `npm install`
- [ ] Create `.env.local` (optional PostHog key)
- [ ] Test locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Deploy: `npm run deploy`
- [ ] Verify: Visit https://www.casequestapp.com
- [ ] Read: `docs/restore-guide.md`

## Support

For issues or questions:
1. Check `docs/restore-guide.md`
2. Review `deploy.log` for recent deploy history
3. Validate DNS at https://dnschecker.org
4. Test routes with curl commands above
