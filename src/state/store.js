import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: {
        xp: 0,
        streak: 0,
        coins: 0,
        level: 1,
        badges: []
      },
      setUser: (user) => set({ user }),
      addXP: (amount) => set((state) => ({
        user: { ...state.user, xp: state.user.xp + amount }
      })),
      updateStreak: (streak) => set((state) => ({
        user: { ...state.user, streak }
      }))
    }),
    { name: 'casequest-storage' }
  )
);

export default useStore;
