# Add GitHub Actions Workflow via Web Interface

Your code is now on GitHub! To enable auto-deployment, add the workflow file via the web interface:

## Steps:

1. **Go to your repository:**
   https://github.com/stasnim10/simum-casequest

2. **Switch to the `demo` branch** (dropdown at top left)

3. **Create the workflow file:**
   - Click "Add file" → "Create new file"
   - Name it: `.github/workflows/pages.yml`
   - Paste this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ demo ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

4. **Commit the file:**
   - Scroll down
   - Commit message: "ci: add GitHub Pages workflow"
   - Click "Commit new file"

5. **Configure GitHub Pages:**
   - Go to Settings → Pages
   - Source: **GitHub Actions**
   - Custom domain: **www.casequestapp.com**
   - Save

6. **Watch deployment:**
   - Go to Actions tab
   - You should see "Deploy to GitHub Pages" running
   - Wait 2-3 minutes

7. **Visit your site:**
   https://www.casequestapp.com

## Alternative: Use GitHub CLI

If you have GitHub CLI installed:

```bash
gh auth login --scopes workflow
cd /Users/simum/casequest
git checkout demo
# Re-add the workflow file
git push origin demo
```

## Your Site URLs:

- Normal: https://www.casequestapp.com/#/
- Demo mode: https://www.casequestapp.com/#/?demo=1
- Pitch mode: https://www.casequestapp.com/#/?pitch=1
