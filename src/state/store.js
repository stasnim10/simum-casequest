import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: {
        name: 'Demo',
        xp: 0,
        streak: 0,
        coins: 0,
      },
      setXP: (xp) => set((state) => ({ user: { ...state.user, xp } })),
      setStreak: (streak) => set((state) => ({ user: { ...state.user, streak } })),
      setCoins: (coins) => set((state) => ({ user: { ...state.user, coins } })),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'casequest-store',
    }
  )
);

export default useStore;
