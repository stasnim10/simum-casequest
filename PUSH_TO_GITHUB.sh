#!/bin/bash

# Step-by-step deployment to GitHub
# Run this script to push everything to GitHub

set -e

echo "🚀 CaseQuest GitHub Deployment"
echo "=============================="
echo ""

# Check if we're on demo branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "demo" ]; then
    echo "❌ Not on demo branch. Switching..."
    git checkout demo
fi

echo "📊 Current status:"
git status --short
echo ""

# Push demo branch
echo "📤 Pushing demo branch to GitHub..."
git push -u origin demo

echo ""
echo "✅ Demo branch pushed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/stasnim10/simum-casequest/settings/pages"
echo "2. Set Source: GitHub Actions"
echo "3. Set Custom domain: www.casequestapp.com"
echo "4. Wait for deployment: https://github.com/stasnim10/simum-casequest/actions"
echo ""
echo "🌐 Your site will be live at: https://www.casequestapp.com"
echo ""
