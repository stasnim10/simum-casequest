# Manual GitHub Sync - Step by Step

## Current Situation
- ✅ All code committed locally (commit: `92d6b4b`)
- ✅ Production deployed and live at https://www.casequestapp.com/#/case
- ❌ Cannot push to GitHub due to token lacking `workflow` scope

## Quick Fix (5 minutes)

### Step 1: Update GitHub Token
1. Open: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Settings:
   - **Name**: `CaseQuest Development`
   - **Expiration**: 90 days (or No expiration)
   - **Scopes** (check these boxes):
     - ✅ `repo` (all sub-items)
     - ✅ `workflow` ← **This is the critical one**
4. Click "Generate token" at bottom
5. **Copy the token** (starts with `ghp_...`)

### Step 2: Update macOS Keychain
Open Terminal and run:
```bash
# Remove old credential
git credential-osxkeychain erase <<EOF
protocol=https
host=github.com
EOF
```

### Step 3: Push Everything
Run these commands in Terminal:
```bash
cd ~/casequest-app/simum-casequest

# Push will prompt for credentials
git push -u origin restore-casequest
# Username: your-github-username
# Password: paste the NEW token (ghp_...)

# Create and push tag
git tag -a v2.0.0 -m "CaseQuest Voice AI (Input + Output) stable release"
git push origin v2.0.0

# Create and push stable branch
git branch -f main-voice-ai-stable
git push -u origin main-voice-ai-stable
```

### Step 4: Verify
```bash
# Check everything is on GitHub
git ls-remote --heads origin | grep restore-casequest
git ls-remote --tags origin | grep v2.0.0
git ls-remote --heads origin | grep main-voice-ai-stable

# Open in browser
open https://github.com/stasnim10/simum-casequest/tree/restore-casequest
open https://github.com/stasnim10/simum-casequest/releases
```

## What Will Be Pushed

### Commits (2)
1. `a471acb` - Voice AI Interviewer features (20 files, 2,448 insertions)
2. `92d6b4b` - GitHub sync helper scripts (3 files, 410 insertions)

### Branches (2)
1. `restore-casequest` - Main development branch
2. `main-voice-ai-stable` - Frozen stable reference

### Tag (1)
- `v2.0.0` - "CaseQuest Voice AI (Input + Output) stable release"

## Expected Output

After successful push:
```
To https://github.com/stasnim10/simum-casequest.git
   2eb1121..92d6b4b  restore-casequest -> restore-casequest
Branch 'restore-casequest' set up to track remote branch 'restore-casequest' from 'origin'.

To https://github.com/stasnim10/simum-casequest.git
 * [new tag]         v2.0.0 -> v2.0.0

To https://github.com/stasnim10/simum-casequest.git
 * [new branch]      main-voice-ai-stable -> main-voice-ai-stable
Branch 'main-voice-ai-stable' set up to track remote branch 'main-voice-ai-stable' from 'origin'.
```

## Troubleshooting

### "Authentication failed"
- Make sure you pasted the token correctly (starts with `ghp_`)
- Token must have `repo` + `workflow` scopes
- Try clearing keychain again

### "refusing to allow a Personal Access Token"
- Token is missing `workflow` scope
- Go back to Step 1 and ensure `workflow` is checked

### "tag already exists"
- Delete local tag: `git tag -d v2.0.0`
- Try again

## Alternative: Create Release on GitHub Web

If you prefer, after pushing the tag:
1. Go to: https://github.com/stasnim10/simum-casequest/releases/new
2. Choose tag: `v2.0.0`
3. Title: `CaseQuest v2.0.0 – Voice AI Stable`
4. Click "Generate release notes"
5. Publish release

## Summary

**Time required**: 5 minutes  
**Risk**: None (production already live)  
**Benefit**: Source code backed up to GitHub  

The features are already working in production. This is just for backup and collaboration.
