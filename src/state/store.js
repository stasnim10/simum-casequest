import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      setXP: (xp) => set((state) => ({ user: { ...state.user, xp } })),
      setStreak: (streak) => set((state) => ({ user: { ...state.user, streak } })),
      setCoins: (coins) => set((state) => ({ user: { ...state.user, coins } })),
      setUser: (user) => set({ user }),

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
        if (state.lastCompletionDate !== today) {
          newStreak += 1;
        }

        set({
          user: { ...state.user, xp: newXP, streak: newStreak },
          lessonProgress: {
            ...state.lessonProgress,
            [id]: { status: newStatus, crownLevel: newCrownLevel },
          },
          lastCompletionDate: today,
        });

        return { xpGained, crownLevel: newCrownLevel, previousCrownLevel: currentProgress.crownLevel };
      },
    }),
    {
      name: 'casequest-store',
    }
  )
);

export default useStore;
