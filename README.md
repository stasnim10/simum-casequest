# CaseQuest - Gamified Consulting Prep

**Live Demo:** [www.casequestapp.com](https://www.casequestapp.com)

Master case interviews with gamified learning. Practice consulting frameworks, market sizing, and profitability analysis.

## 🎯 Features

- **Structured Learning Path** - 10 lessons across 2 modules
- **Interactive Quizzes** - MCQ, fill-in-blank, and calculations
- **Case Simulator** - Guided practice with real scenarios
- **Spaced Repetition** - Review system for long-term retention
- **Gamification** - XP, streaks, badges, and leaderboards
- **Progress Tracking** - Crown levels and mastery system
- **Daily Goals** - Customizable XP targets with streak freeze

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🌐 Demo Modes

- **Normal:** [/#/](https://www.casequestapp.com/#/)
- **Demo:** [/#/?demo=1](https://www.casequestapp.com/#/?demo=1) - Pre-loaded with sample data
- **Pitch:** [/#/?pitch=1](https://www.casequestapp.com/#/?pitch=1) - Investor showcase with animations

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router 6** - HashRouter for GitHub Pages
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📦 Project Structure

```
src/
├── pages/          # Route components
├── components/     # Reusable UI components
├── state/          # Zustand store
├── data/           # Seed data and API
├── services/       # Spaced repetition logic
└── utils/          # Helper functions
```

## 🎓 Learning Content

### Module 1: Consulting Mindset
- What is a case interview
- MECE Framework
- Hypothesis-Driven Approach
- Case Interview Structure
- Communication Skills

### Module 2: Profitability Basics
- Profit Equation
- Revenue Drivers
- Cost Structure
- Margin Analysis
- Profitability Levers

## 🎮 Gamification System

- **XP System** - Earn 10 XP per correct answer + 20 bonus
- **Crown Levels** - 0-5 crowns per lesson (perfect score = +1)
- **Streaks** - Daily completion tracking with freeze protection
- **Badges** - Achievements for milestones
- **Leaderboard** - Weekly and all-time rankings

## 📊 Spaced Repetition

Review schedule: 1 day → 3 days → 7 days → 14 days

Items automatically appear in review queue based on performance.

## 🚢 Deployment

This project deploys to GitHub Pages with a custom domain.

### Deploy to Production

```bash
./deploy.sh
```

Or manually:

```bash
git checkout main
git pull
git checkout demo
git merge main
git push origin demo
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

Create `.env` file (optional for local development):

```env
# No environment variables required for basic functionality
# All data stored in localStorage
```

### Custom Domain

Domain: `www.casequestapp.com`  
CNAME file: `public/CNAME`  
DNS configured to point to GitHub Pages

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

## 📄 License

© 2025 stasnim10. All Rights Reserved.

## 🤝 Contributing

This is a personal project for investor demonstration. Not currently accepting contributions.

## 📞 Contact

For inquiries about CaseQuest, please visit [www.casequestapp.com](https://www.casequestapp.com)

---

**Built with ❤️ for aspiring consultants**
