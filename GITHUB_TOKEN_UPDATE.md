# GitHub Token Update Instructions

## Issue
Your current GitHub Personal Access Token lacks the `workflow` scope needed to push branches containing `.github/workflows/` files.

## Solution: Update Your Token

### Step 1: Create New Token with Workflow Scope
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `CaseQuest Development`
4. Select these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Update macOS Keychain
```bash
# Remove old credential
git credential-osxkeychain erase <<EOF
protocol=https
host=github.com
EOF

# The next git push will prompt for username and password
# Username: your GitHub username
# Password: paste the NEW token (not your GitHub password)
```

### Step 3: Push to GitHub
```bash
cd ~/casequest-app/simum-casequest
git checkout restore-casequest
git push -u origin restore-casequest
```

### Step 4: Tag and Release
```bash
# Create annotated tag
git tag -a v2.0.0 -m "CaseQuest Voice AI (Input + Output) stable release"
git push origin v2.0.0

# Create stable branch
git branch -f main-voice-ai-stable
git push -u origin main-voice-ai-stable
```

## Alternative: Use GitHub CLI (Recommended)

### Install gh CLI
```bash
brew install gh
```

### Authenticate
```bash
gh auth login --hostname github.com --git-protocol https --web
# Follow the browser prompts
# Make sure to grant workflow permissions when asked
```

### Push Everything
```bash
cd ~/casequest-app/simum-casequest
git push -u origin restore-casequest
git tag -a v2.0.0 -m "CaseQuest Voice AI (Input + Output) stable release"
git push origin v2.0.0
git branch -f main-voice-ai-stable
git push -u origin main-voice-ai-stable

# Create GitHub Release
gh release create v2.0.0 --title "CaseQuest v2.0.0 – Voice AI Stable" --generate-notes
```

## Verification
```bash
# Check remote branches
git ls-remote --heads origin | grep restore-casequest

# Check tags
git ls-remote --tags origin | grep v2.0.0

# Check stable branch
git ls-remote --heads origin | grep main-voice-ai-stable
```

## Current State
- ✅ Local commit: `a471acb` - Voice AI features
- ✅ Deployed to production: https://www.casequestapp.com/#/case
- ⏳ Pending: Push to GitHub (blocked by token scope)

## What's Already Live
Even though the source isn't pushed yet, the features are **already deployed and working** on production:
- Voice Input (SpeechRecognition)
- Voice Output (TTS)
- Turn-based interview loop
- All analytics tracking

The GitHub push is just for source code backup and collaboration.
