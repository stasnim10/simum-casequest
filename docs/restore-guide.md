# CaseQuest Quick Recovery Toolkit

## 1. Local Reset

```bash
npm run clean
npm run build
```

## 2. Redeploy

```bash
npm run redeploy
```

## 3. Domain Restore (if GitHub Pages forgets your domain)

```bash
npm run restore-domain
```

## 4. Check DNS

Visit: https://dnschecker.org/#A/www.casequestapp.com  
Expected: gh-pages.github.io IPs (185.199.x.x)

## 5. Validate Routing

```bash
curl -s "https://www.casequestapp.com/#/learn" | grep -o '<div id="root">' && echo "✅ Route active"
```

## 6. Reset Demo Data

Append `?reset=1` or `?demo=1` to any CaseQuest URL:

https://www.casequestapp.com/#/?demo=1

## 7. PostHog Health Check

Open DevTools → Network → Filter: "/e/"  
If no requests appear, console should show "PostHog disabled: missing key"
