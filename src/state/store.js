import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultUser = {
  id: 'demo',
  name: 'Demo',
  xp: 0,
  streak: 0,
  coins: 0,
  badges: []
};

const useStore = create(
  persist(
    (set, get) => ({
      user: defaultUser,
      lessonProgress: {},
      streakHistory: {},

      setXP: (delta) => set((state) => ({
        user: { ...state.user, xp: state.user.xp + delta }
      })),

      incrementStreakIfFirstCompletionToday: () => {
        const today = new Date().toISOString().split('T')[0];
        const { streakHistory, user } = get();
        
        if (!streakHistory[today]) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const hadYesterday = streakHistory[yesterday];
          
          set({
            user: { 
              ...user, 
              streak: hadYesterday ? user.streak + 1 : 1 
            },
            streakHistory: { ...streakHistory, [today]: true }
          });
        }
      },

      addBadge: (id) => set((state) => ({
        user: { 
          ...state.user, 
          badges: [...new Set([...state.user.badges, id])]
        }
      })),

      startLesson: (id) => set((state) => ({
        lessonProgress: {
          ...state.lessonProgress,
          [id]: state.lessonProgress[id] || { 
            status: 'in_progress', 
            crownLevel: 0 
          }
        }
      })),

      completeLesson: (id, { correct, total }) => {
        const { lessonProgress, user } = get();
        const current = lessonProgress[id] || { status: 'new', crownLevel: 0 };
        
        // Calculate XP
        const correctXP = correct * 10;
        const completionBonus = 20;
        const totalXP = correctXP + completionBonus;
        
        // Update crown level if perfect
        const isPerfect = correct === total;
        const newCrownLevel = isPerfect 
          ? Math.min(current.crownLevel + 1, 5) 
          : current.crownLevel;
        
        // Determine status
        const newStatus = newCrownLevel >= 3 ? 'mastered' : 'in_progress';
        
        set({
          user: { ...user, xp: user.xp + totalXP },
          lessonProgress: {
            ...lessonProgress,
            [id]: {
              status: newStatus,
              crownLevel: newCrownLevel
            }
          }
        });
        
        // Update streak
        get().incrementStreakIfFirstCompletionToday();
      },

      resetDemo: () => {
        localStorage.removeItem('casequest-storage');
        set({
          user: defaultUser,
          lessonProgress: {},
          streakHistory: {}
        });
      }
    }),
    { 
      name: 'casequest-storage',
      partialize: (state) => ({
        user: state.user,
        lessonProgress: state.lessonProgress,
        streakHistory: state.streakHistory
      })
    }
  )
);

export default useStore;
