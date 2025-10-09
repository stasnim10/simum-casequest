#!/bin/bash

# CaseQuest Deployment Script
# Merges main into demo and pushes to trigger GitHub Pages deployment

set -e

echo "🚀 CaseQuest Deployment"
echo "======================="
echo ""

# Ensure we're on main and up to date
echo "📥 Updating main branch..."
git checkout main
git pull origin main

# Switch to demo and merge
echo "🔄 Merging main into demo..."
git checkout demo
git merge main -m "deploy: merge main into demo for deployment"

# Push to trigger deployment
echo "📤 Pushing to demo branch..."
git push origin demo

echo ""
echo "✅ Deployment triggered!"
echo "📊 Check progress: https://github.com/stasnim10/simum-casequest/actions"
echo "🌐 Live site: https://www.casequestapp.com"
echo ""
