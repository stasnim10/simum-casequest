import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { leaderboardUsers } from '../data/leaderboardSeed';

const useStore = create(
  persist(
    (set, get) => ({
      user: {
        name: 'Demo',
        xp: 0,
        streak: 0,
        coins: 0,
      },
      lessonProgress: {},
      lastCompletionDate: null,
      badges: [],
      streakHistory: [], // Array of dates when user completed lessons

      setXP: (xp) => set((state) => ({ user: { ...state.user, xp } })),
      setStreak: (streak) => set((state) => ({ user: { ...state.user, streak } })),
      setCoins: (coins) => set((state) => ({ user: { ...state.user, coins } })),
      setUser: (user) => set({ user }),

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge) ? state.badges : [...state.badges, badge],
        })),

      startLesson: (id) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [id]: state.lessonProgress[id] || { status: 'in_progress', crownLevel: 0 },
          },
        })),

      completeLesson: (id, { correct, total }) => {
        const state = get();
        const currentProgress = state.lessonProgress[id] || { status: 'new', crownLevel: 0 };
        
        // Calculate XP: +10 per correct, +20 bonus for completion
        const xpGained = correct * 10 + 20;
        const newXP = state.user.xp + xpGained;

        // Update crown level if perfect score
        let newCrownLevel = currentProgress.crownLevel;
        if (correct === total && newCrownLevel < 5) {
          newCrownLevel += 1;
        }

        // Update status
        const newStatus = newCrownLevel >= 3 ? 'mastered' : 'in_progress';

        // Update streak if first completion today
        const today = new Date().toDateString();
        let newStreak = state.user.streak;
        let newStreakHistory = [...state.streakHistory];
        if (state.lastCompletionDate !== today) {
          newStreak += 1;
          newStreakHistory.push(today);
        }

        set({
          user: { ...state.user, xp: newXP, streak: newStreak },
          lessonProgress: {
            ...state.lessonProgress,
            [id]: { status: newStatus, crownLevel: newCrownLevel },
          },
          lastCompletionDate: today,
          streakHistory: newStreakHistory,
        });

        return { xpGained, crownLevel: newCrownLevel, previousCrownLevel: currentProgress.crownLevel };
      },

      getLeaderboard: () => {
        const state = get();
        const allUsers = [
          { name: 'You', xp: state.user.xp, isCurrentUser: true },
          ...leaderboardUsers,
        ];
        return allUsers.sort((a, b) => b.xp - a.xp).map((user, index) => ({
          ...user,
          rank: index + 1,
        }));
      },

      computeWeeklyXP: () => {
        const state = get();
        // Mock: assume 70% of total XP was earned this week
        return Math.floor(state.user.xp * 0.7);
      },

      resetDemo: () => {
        set({
          user: { name: 'Demo', xp: 0, streak: 0, coins: 0 },
          lessonProgress: {},
          lastCompletionDate: null,
          badges: [],
          streakHistory: [],
        });
        localStorage.removeItem('casequest-store');
      },
    }),
    {
      name: 'casequest-store',
    }
  )
);

export default useStore;
