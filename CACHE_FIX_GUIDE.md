# 🔧 Cache Issue Fix Guide

## Problem: Seeing Old Version of CaseQuest

If you're seeing an outdated version of the home page that fixes itself after navigating to another page, this is a service worker caching issue.

---

## ✅ **FIXED in Latest Version**

The latest deployment includes:
- **Network-first strategy** for HTML pages (always fetches latest)
- **Automatic update detection** with refresh banner
- **Improved cache versioning** (v1.0.1)
- **Instant activation** of new service worker

---

## 🚀 Quick Fix for Users

### Option 1: Hard Refresh (Recommended)
**Mac:** `Cmd + Shift + R`  
**Windows/Linux:** `Ctrl + Shift + R`

### Option 2: Clear Cache via Browser
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage**
4. Check all boxes
5. Click **Clear site data**
6. Refresh page

### Option 3: Use Cache Clear Tool
Visit: `https://stasnim10.github.io/simum-casequest/clear-cache.html`
- Click "Clear Cache & Reload"
- Automatically clears everything and reloads

### Option 4: Incognito/Private Mode
- Open in incognito/private window
- This bypasses all cache

---

## 🔍 For Developers: What Was Fixed

### Before (Problem):
```javascript
// Cache-first strategy - served old HTML from cache
caches.match(event.request)
  .then(response => response || fetch(event.request))
```

### After (Solution):
```javascript
// Network-first for HTML - always fetches latest
if (event.request.mode === 'navigate') {
  fetch(event.request)
    .then(response => {
      // Cache for offline, but network is primary
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    })
    .catch(() => caches.match(event.request)) // Fallback to cache if offline
}
```

### Additional Improvements:
1. **Cache versioning**: `casequest-v1.0.1` (increment on each deploy)
2. **Immediate activation**: `self.skipWaiting()` + `self.clients.claim()`
3. **Update notification**: Banner appears when new version detected
4. **Auto-update check**: Checks for updates every 60 seconds

---

## 📝 Deployment Checklist

When deploying updates:

1. **Increment cache version** in `public/sw.js`:
   ```javascript
   const CACHE_VERSION = 'v1.0.2'; // Increment this
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

3. **Test in incognito** to verify new version loads

4. **Existing users** will see update banner automatically

---

## 🎯 Testing Cache Behavior

### Test Update Flow:
1. Deploy version A
2. Visit site (loads version A)
3. Deploy version B
4. Wait 60 seconds OR refresh page
5. Should see "New version available!" banner
6. Click "Refresh Now"
7. Version B loads

### Verify Network-First:
1. Open DevTools → Network tab
2. Navigate to home page
3. Should see network request for HTML (not from cache)
4. Assets (JS/CSS) can be from cache

---

## 🚨 Emergency Cache Clear

If users report persistent cache issues:

### Share this link:
`https://stasnim10.github.io/simum-casequest/clear-cache.html`

### Or provide these instructions:
1. Visit the site
2. Press F12 (open DevTools)
3. Right-click the refresh button
4. Select "Empty Cache and Hard Reload"

---

## ✅ Verification

After fix, users should:
- ✅ See latest home page on first load
- ✅ Get update banner when new version deployed
- ✅ Never see "old then new" behavior
- ✅ Work offline with cached version

---

**Status:** ✅ Cache issues resolved in latest build  
**Version:** 1.0.1  
**Last Updated:** October 7, 2025
