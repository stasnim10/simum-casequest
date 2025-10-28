import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateNextReview } from '../services/spacedRepetition';

const defaultUser = {
  id: 'demo',
  name: 'Demo',
  xp: 0,
  streak: 0,
  coins: 0,
  badges: [],
  dailyGoal: 20,
  dailyXP: 0,
  lastActiveDate: null,
  streakFreezeAvailable: true
};

const useStore = create(
  persist(
    (set, get) => ({
      user: defaultUser,
      lessonProgress: {},
      streakHistory: {},
      reviewItems: {}, // { questionId: { lessonId, questionData, nextReview, intervalIndex, lastQuality } }
      onboarding: {
        completed: false,
        goal: null,
        learningStyle: null,
        needsTutorial: false
      },
      marketSizing: {
        introSeen: false,
        lessonStatus: {
          lesson1: { completed: false, score: null },
          lesson2: { completed: false, score: null },
          lesson3: { completed: false, score: null }
        },
        practiceAttempts: [],
        hintsUsed: 0,
        feedbackShown: 0,
        reviewCount: 0,
        masteryUnlocked: false
      },

      setUser: (user) => set({ user }),
      
      setDailyGoal: (goal) => set((state) => ({
        user: { ...state.user, dailyGoal: goal }
      })),

      addXP: (amount) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          user: { 
            ...state.user, 
            xp: state.user.xp + amount,
            dailyXP: state.user.lastActiveDate === today 
              ? state.user.dailyXP + amount 
              : amount,
            lastActiveDate: today
          }
        }));
      },

      incrementStreakIfFirstCompletionToday: () => {
        const today = new Date().toISOString().split('T')[0];
        const { streakHistory, user } = get();
        
        if (!streakHistory[today]) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const hadYesterday = streakHistory[yesterday];
          
          let newStreak = user.streak;
          let freezeUsed = false;
          
          if (hadYesterday) {
            // Continue streak
            newStreak = user.streak + 1;
          } else if (user.streak > 0 && user.streakFreezeAvailable) {
            // Use freeze to maintain streak
            newStreak = user.streak;
            freezeUsed = true;
          } else {
            // Start new streak
            newStreak = 1;
          }
          
          set({
            user: { 
              ...user, 
              streak: newStreak,
              streakFreezeAvailable: freezeUsed ? false : user.streakFreezeAvailable
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

      setOnboardingGoal: (goal) => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            goal
          }
        }));
      },

      setOnboardingStyle: (learningStyle) => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            learningStyle
          }
        }));
      },

      completeOnboarding: ({ goal, learningStyle }) => {
        set((state) => ({
          onboarding: {
            completed: true,
            goal: goal ?? state.onboarding.goal,
            learningStyle: learningStyle ?? state.onboarding.learningStyle,
            needsTutorial: true
          }
        }));
      },

      finishTutorial: () => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            needsTutorial: false
          }
        }));
      },

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
        
        const today = new Date().toISOString().split('T')[0];
        
        set({
          user: { 
            ...user, 
            xp: user.xp + totalXP,
            dailyXP: user.lastActiveDate === today 
              ? user.dailyXP + totalXP 
              : totalXP,
            lastActiveDate: today
          },
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

      addReviewItem: (questionId, lessonId, questionData) => {
        const { nextReviewDate, intervalIndex } = calculateNextReview(3, 0);
        
        set((state) => ({
          reviewItems: {
            ...state.reviewItems,
            [questionId]: {
              lessonId,
              questionData,
              nextReview: nextReviewDate,
              intervalIndex,
              lastQuality: 3
            }
          }
        }));
      },

      updateReviewItem: (questionId, quality) => {
        const { reviewItems } = get();
        const item = reviewItems[questionId];
        
        if (!item) return;
        
        const { nextReviewDate, intervalIndex } = calculateNextReview(
          quality, 
          item.intervalIndex
        );
        
        set({
          reviewItems: {
            ...reviewItems,
            [questionId]: {
              ...item,
              nextReview: nextReviewDate,
              intervalIndex,
              lastQuality: quality
            }
          }
        });
      },

      markMarketIntro: () => {
        set((state) => ({
          marketSizing: {
            ...state.marketSizing,
            introSeen: true
          }
        }));
      },

      completeMarketLesson: (lessonKey, { score }) => {
        set((state) => ({
          marketSizing: {
            ...state.marketSizing,
            lessonStatus: {
              ...state.marketSizing.lessonStatus,
              [lessonKey]: { completed: true, score }
            }
          }
        }));
      },

      recordMarketHint: () => {
        set((state) => ({
          marketSizing: {
            ...state.marketSizing,
            hintsUsed: state.marketSizing.hintsUsed + 1
          }
        }));
      },

      recordMarketFeedback: () => {
        set((state) => ({
          marketSizing: {
            ...state.marketSizing,
            feedbackShown: state.marketSizing.feedbackShown + 1
          }
        }));
      },

      saveMarketAttempt: (attempt) => {
        const { marketSizing } = get();
        const nextAttempts = [attempt, ...marketSizing.practiceAttempts].slice(0, 10);
        set({
          marketSizing: {
            ...marketSizing,
            practiceAttempts: nextAttempts
          }
        });
      },

      recordMarketReview: () => {
        set((state) => ({
          marketSizing: {
            ...state.marketSizing,
            reviewCount: state.marketSizing.reviewCount + 1
          }
        }));
      },

      unlockMarketMastery: () => {
        set((state) => ({
          marketSizing: {
            ...state.marketSizing,
            masteryUnlocked: true
          }
        }));
      },

      resetDemo: () => {
        localStorage.removeItem('casequest-storage');
        set({
          user: defaultUser,
          lessonProgress: {},
          streakHistory: {},
          reviewItems: {},
          onboarding: {
            completed: false,
            goal: null,
            learningStyle: null,
            needsTutorial: false
          },
          marketSizing: {
            introSeen: false,
            lessonStatus: {
              lesson1: { completed: false, score: null },
              lesson2: { completed: false, score: null },
              lesson3: { completed: false, score: null }
            },
            practiceAttempts: [],
            hintsUsed: 0,
            feedbackShown: 0,
            reviewCount: 0,
            masteryUnlocked: false
          }
        });
      }
    }),
    { 
      name: 'casequest-storage',
      partialize: (state) => ({
        user: state.user,
        lessonProgress: state.lessonProgress,
        streakHistory: state.streakHistory,
        reviewItems: state.reviewItems,
        onboarding: state.onboarding,
        marketSizing: state.marketSizing
      })
    }
  )
);

export default useStore;
