# CaseQuest Deployment Guide

## Custom Domain Setup

**Domain:** www.casequestapp.com  
**Repo:** stasnim10/simum-casequest  
**Deploy Branch:** demo  
**Main Branch:** main (active development)

## DNS Configuration

Configure these records in your domain provider:

| Record Type | Name | Value               |
| ----------- | ---- | ------------------- |
| A           | @    | 185.199.108.153     |
| A           | @    | 185.199.109.153     |
| A           | @    | 185.199.110.153     |
| A           | @    | 185.199.111.153     |
| CNAME       | www  | stasnim10.github.io |

Wait 15-30 minutes for DNS propagation.

## Initial Setup

```bash
# Create demo branch
git checkout main
git pull
git checkout -b demo
git push origin demo
```

## GitHub Pages Settings

1. Go to repo → Settings → Pages
2. Source: GitHub Actions
3. Branch: demo
4. Custom domain: www.casequestapp.com
5. Enforce HTTPS: ✓ (auto-enabled)

## Deploy Process

### Option 1: Deploy from main to demo

```bash
# Merge latest changes to demo
git checkout main
git pull
git checkout demo
git merge main
git push origin demo
```

This triggers automatic deployment via GitHub Actions.

### Option 2: Direct push to demo

```bash
git checkout demo
# Make changes
git add .
git commit -m "your message"
git push origin demo
```

## Verify Deployment

1. Check GitHub Actions: https://github.com/stasnim10/simum-casequest/actions
2. Wait for "Deploy to GitHub Pages" workflow to complete
3. Visit: https://www.casequestapp.com
4. Test routes:
   - https://www.casequestapp.com/#/
   - https://www.casequestapp.com/#/learn
   - https://www.casequestapp.com/#/dashboard
   - https://www.casequestapp.com/#/?demo=1
   - https://www.casequestapp.com/#/?pitch=1

## Demo Modes

- **Normal:** `/#/` - Standard app
- **Demo:** `/#/?demo=1` - Seeded with sample data
- **Pitch:** `/#/?pitch=1` - Auto-dashboard with looping highlights

## Troubleshooting

### Assets not loading
- Verify `vite.config.js` has `base: './'`
- Check CNAME file exists in `public/`
- Rebuild: `npm run build`

### 404 on routes
- HashRouter should prevent this
- Verify routes use `/#/` prefix

### DNS not resolving
- Wait 30 minutes for propagation
- Check DNS with: `dig www.casequestapp.com`
- Verify A records point to GitHub IPs

### HTTPS not working
- GitHub auto-issues certificate after DNS verification
- Can take up to 24 hours
- Check Pages settings for certificate status

## Build Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
casequest/
├── .github/workflows/pages.yml  # Auto-deploy workflow
├── public/CNAME                 # Custom domain
├── vite.config.js               # Base path config
├── src/                         # Source code
└── dist/                        # Build output (gitignored)
```

## Maintenance

### Update demo branch regularly

```bash
# Weekly or before investor meetings
git checkout main
git pull
git checkout demo
git merge main
git push origin demo
```

### Monitor deployments

- GitHub Actions tab shows all deployments
- Each push to demo triggers new build
- Build time: ~2-3 minutes
- Deployment time: ~1 minute

## Success Checklist

- [ ] DNS records configured
- [ ] CNAME file in public/
- [ ] GitHub Pages enabled
- [ ] Custom domain set
- [ ] HTTPS enabled
- [ ] Demo branch created
- [ ] Workflow file added
- [ ] First deployment successful
- [ ] Site loads at www.casequestapp.com
- [ ] All routes work
- [ ] Demo mode works (?demo=1)
- [ ] Pitch mode works (?pitch=1)
