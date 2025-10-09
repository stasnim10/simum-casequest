# 🚀 Quick Deploy Commands

## Deploy to GitHub Pages (Recommended)

### One-Command Deploy
```bash
cd /Users/simum/casequest-app/simum-casequest
npm run deploy
```

That's it! Your app will be live at:
**https://stasnim10.github.io/simum-casequest**

---

## First-Time Setup (If gh-pages not installed)

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

---

## Verify Deployment

1. Wait 2-3 minutes after deploy completes
2. Visit: https://stasnim10.github.io/simum-casequest
3. Test login and key features
4. Check mobile responsiveness

---

## Update After Changes

```bash
# Make your changes, then:
git add .
git commit -m "Your update message"
git push origin main

# Deploy updated version
npm run deploy
```

---

## Troubleshooting

### Issue: "gh-pages not found"
```bash
npm install --save-dev gh-pages
```

### Issue: "Permission denied"
```bash
# Re-authenticate with GitHub
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Issue: "Build failed"
```bash
# Check for errors
npm run build

# Fix any errors shown, then deploy again
npm run deploy
```

### Issue: "Page shows 404"
- Wait 5 minutes (GitHub Pages can be slow)
- Check GitHub repo Settings > Pages
- Ensure gh-pages branch exists
- Verify homepage in package.json matches your repo

---

## Post-Deployment Checklist

- [ ] Site loads at GitHub Pages URL
- [ ] Can login/signup
- [ ] All navigation works
- [ ] Mobile view works
- [ ] No console errors
- [ ] Share link with testers

---

**🎉 You're live! Time to gather feedback and iterate.**
