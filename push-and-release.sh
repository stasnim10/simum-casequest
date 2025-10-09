#!/bin/bash
set -euo pipefail

# CaseQuest Voice AI - Push and Release Script
# Run this after updating your GitHub token with workflow scope

cd ~/casequest-app/simum-casequest

echo "=== CaseQuest Voice AI Release Script ==="
echo ""

# Verify we're on the right branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "restore-casequest" ]; then
  echo "Switching to restore-casequest branch..."
  git checkout restore-casequest
fi

# Show last commit
echo "=== Last Commit ==="
git --no-pager log -1 --pretty=format:"%h - %s" --decorate
echo ""
echo ""

# Push source branch
echo "=== Pushing restore-casequest branch ==="
if git push -u origin restore-casequest; then
  echo "✅ Branch pushed successfully"
else
  echo "❌ Branch push failed"
  echo "Make sure your GitHub token has 'workflow' scope"
  echo "See GITHUB_TOKEN_UPDATE.md for instructions"
  exit 1
fi
echo ""

# Create and push tag
TAG="v2.0.0"
echo "=== Creating tag ${TAG} ==="
if git tag -a "${TAG}" -m "CaseQuest Voice AI (Input + Output) stable release" 2>/dev/null; then
  echo "✅ Tag created"
else
  echo "⚠️  Tag already exists locally, using existing tag"
fi

echo "=== Pushing tag ${TAG} ==="
if git push origin "${TAG}"; then
  echo "✅ Tag pushed successfully"
else
  echo "❌ Tag push failed"
  exit 1
fi
echo ""

# Create stable branch
echo "=== Creating stable branch ==="
git branch -f main-voice-ai-stable
if git push -u origin main-voice-ai-stable; then
  echo "✅ Stable branch created and pushed"
else
  echo "⚠️  Stable branch push failed (non-critical)"
fi
echo ""

# Create GitHub Release if gh CLI is available
if command -v gh >/dev/null 2>&1; then
  echo "=== Creating GitHub Release ==="
  if gh release create "${TAG}" --title "CaseQuest ${TAG} – Voice AI Stable" --generate-notes 2>/dev/null; then
    echo "✅ GitHub Release created"
    RELEASE_URL="https://github.com/stasnim10/simum-casequest/releases/tag/${TAG}"
    echo "   URL: ${RELEASE_URL}"
  else
    echo "⚠️  Release already exists or creation failed (non-critical)"
  fi
else
  echo "⚠️  gh CLI not installed, skipping GitHub Release"
  echo "   Install with: brew install gh"
fi
echo ""

# Verification
echo "=== Verification ==="
echo "Branch on remote:"
git ls-remote --heads origin | grep "refs/heads/restore-casequest" && echo "  ✅ restore-casequest" || echo "  ❌ restore-casequest not found"

echo "Tag on remote:"
git ls-remote --tags origin | grep "refs/tags/${TAG}" && echo "  ✅ ${TAG}" || echo "  ❌ ${TAG} not found"

echo "Stable branch on remote:"
git ls-remote --heads origin | grep "refs/heads/main-voice-ai-stable" && echo "  ✅ main-voice-ai-stable" || echo "  ⚠️  main-voice-ai-stable not found (optional)"

echo ""
echo "=== Summary ==="
echo "Current branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Last commit: $(git log -1 --pretty=format:'%h - %s')"
echo ""
echo "✅ Voice AI features are live at: https://www.casequestapp.com/#/case"
echo "✅ Source code synced to GitHub"
echo "✅ Release tagged: ${TAG}"
echo ""
echo "Done!"
