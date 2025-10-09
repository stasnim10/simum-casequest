# CaseQuest - Gamified Consulting Prep Web App

**© 2025 stasnim10. All Rights Reserved.**

⚠️ **PROPRIETARY SOFTWARE** - This project is protected by copyright law. Unauthorized copying, distribution, or use is strictly prohibited. See [LICENSE](./LICENSE) for details.

---

CaseQuest is a gamified, mobile-first learning platform designed to make consulting and case interview preparation engaging and effective, inspired by the learning model of Duolingo.

## Features

- **Gamified Learning**: XP system, levels, streaks, and achievements
- **Structured Learning Path**: Progressive modules from basics to advanced topics
- **Interactive Case Simulator**: Practice with real consulting case studies
- **Progress Tracking**: Comprehensive analytics and progress visualization
- **Mobile-First Design**: Responsive design optimized for all devices
- **Firebase Integration**: Real-time data sync and user authentication

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth + Firestore)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom gradient backgrounds

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project (for backend services)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd casequest-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config and update `src/firebase.js`

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Firebase Setup

### Authentication
Enable Email/Password authentication in your Firebase console.

### Firestore Database
Create the following collections:

- `users` - User profiles and progress data
- `modules` - Learning modules (optional, currently using sample data)
- `lessons` - Individual lessons (optional, currently using sample data)
- `cases` - Case studies (optional, currently using sample data)

### Sample Data Structure

The app includes sample data for modules, lessons, and cases. In production, you would store this data in Firestore collections.

## Key Components

- **AuthScreen**: User authentication (login/signup)
- **Dashboard**: Overview of user progress and quick actions
- **LearningPath**: Structured learning modules and lessons
- **CaseSimulator**: Interactive case study practice
- **Progress**: Detailed progress tracking and analytics
- **Sidebar**: Navigation and user profile

## Learning Content

The app includes content derived from professional consulting training materials:

### Module 1: The Consulting Mindset
- What is a Case Interview?
- Structured Problem Solving (MECE)

### Module 2: Core Framework - Profitability
- The Profit Equation (Revenue - Costs)
- Breaking Down Revenues (Price × Volume)

### Module 3: Market Study Framework
- Market Sizing Techniques
- Competitive Landscape Analysis

## Customization

### Adding New Modules
Update the `SAMPLE_MODULES` array in `App.js` with new learning content.

### Adding New Cases
Update the `SAMPLE_CASES` array in `App.js` with new case studies.

### Styling
Modify `tailwind.config.js` and CSS classes to customize the appearance.

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Analytics

CaseQuest uses PostHog for product analytics and behavioral insights.

### Setup
1. Sign up at [PostHog](https://posthog.com)
2. Create a new project
3. Copy your Project API Key
4. Add to `.env.local`:
```env
VITE_POSTHOG_KEY=your_project_api_key
VITE_POSTHOG_HOST=https://app.posthog.com
```

### Tracked Events
- `lesson_started` - User begins a lesson
- `lesson_completed` - User completes a lesson with score
- `sim_case_started` - User starts case simulation
- `sim_case_completed` - User completes case with duration
- `ai_feedback_received` - User receives AI feedback (cached status)
- `next_best_lesson_clicked` - User clicks adaptive recommendation
- `xp_gained` - User earns XP

### Disable Analytics
To disable analytics, remove or clear `VITE_POSTHOG_KEY` in `.env.local`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
