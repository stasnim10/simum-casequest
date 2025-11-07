import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { modules } from '../data/seed';

const normalizeUser = (user = {}) => ({
  ...user,
  dailyGoal: user?.dailyGoal && user.dailyGoal > 0 ? user.dailyGoal : 20
});

const defaultUser = {
  id: 'demo',
  name: 'Demo',
  xp: 0,
  streak: 0,
  badges: [],
  dailyGoal: 20,
  dailyXP: 0,
  lastActiveDate: null
};

const orderedLessonIds = modules.flatMap((module) => module.lessons);

const defaultProgressEntry = () => ({
  status: 'in_progress',
  contentComplete: false,
  quizScore: null,
  quizPassed: false,
  attempts: 0,
  completedAt: null,
  quizLastTriedAt: null,
  totalQuestions: null
});

const defaultQuizStats = () => ({
  totalAttempts: 0,
  totalPassed: 0,
  totalQuestions: 0,
  totalCorrect: 0
});

const QUIZ_INSIGHTS_KEY = 'quiz-insights';
const QUIZ_INSIGHTS_LIMIT = 200;

const appendQuizInsight = (entry) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(QUIZ_INSIGHTS_KEY);
    const parsedRaw = raw ? JSON.parse(raw) : [];
    const insights = Array.isArray(parsedRaw) ? parsedRaw : [];
    insights.push(entry);
    if (insights.length > QUIZ_INSIGHTS_LIMIT) {
      insights.splice(0, insights.length - QUIZ_INSIGHTS_LIMIT);
    }
    window.localStorage.setItem(QUIZ_INSIGHTS_KEY, JSON.stringify(insights));
  } catch (error) {
    console.warn('Failed to log quiz insight', error);
  }
};

const useStore = create(
  persist(
    (set, get) => ({
      user: defaultUser,
      lessonProgress: {},
      streakHistory: {},
      quizStats: defaultQuizStats(),
      hintUsage: {},

      setUser: (user) => set({ user: normalizeUser(user) }),

      resetProgress: () =>
        set({
          lessonProgress: {},
          streakHistory: {},
          quizStats: defaultQuizStats(),
          hintUsage: {},
          user: normalizeUser(get().user)
        }),

      setDailyGoal: (goal) =>
        set((state) => ({
          user: { ...state.user, dailyGoal: goal }
        })),

      addXP: (amount) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          user: {
            ...state.user,
            xp: state.user.xp + amount,
            dailyXP: state.user.lastActiveDate === today ? state.user.dailyXP + amount : amount,
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
          const newStreak = hadYesterday ? user.streak + 1 : 1;

          set({
            user: {
              ...user,
              streak: newStreak
            },
            streakHistory: { ...streakHistory, [today]: true }
          });
        }
      },

      startLesson: (id) =>
        set((state) => {
          if (state.lessonProgress[id]) {
            return state;
          }
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [id]: defaultProgressEntry()
            }
          };
        }),

      markLessonContentComplete: (id) =>
        set((state) => {
          const existing = state.lessonProgress[id] || defaultProgressEntry();
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [id]: {
                ...existing,
                contentComplete: true
              }
            }
          };
        }),

      completeLesson: (id) => {
        const today = new Date().toISOString().split('T')[0];
        const { lessonProgress } = get();
        const existing = lessonProgress[id] || defaultProgressEntry();
        const alreadyCompleted = existing.status === 'completed';

        set({
          lessonProgress: {
            ...lessonProgress,
            [id]: {
              ...existing,
              status: 'completed',
              completedAt: today,
              quizPassed: true
            }
          }
        });

        if (!alreadyCompleted && !existing.quizPassed) {
          get().addXP(5);
          get().incrementStreakIfFirstCompletionToday();
        }
      },

      submitQuizAttempt: (id, { score, totalQuestions }) => {
        const { lessonProgress } = get();
        const quizStats = get().quizStats || defaultQuizStats();
        const existing = lessonProgress[id] || defaultProgressEntry();
        const attempts = (existing.attempts || 0) + 1;
        const passed = totalQuestions > 0 ? score / totalQuestions >= 0.7 : false;
        const today = new Date().toISOString().split('T')[0];
        const alreadyEarnedXP = Boolean(existing.completedAt);
        const safeScore = Number.isFinite(score) ? score : 0;
        const safeTotal = Number.isFinite(totalQuestions) ? totalQuestions : 0;
        const updatedQuizPassed = passed || existing.quizPassed;
        const newCompletedAt = updatedQuizPassed ? (existing.completedAt || (passed ? today : existing.completedAt)) : existing.completedAt;
        const nextStatus = updatedQuizPassed ? 'completed' : 'in_progress';

        const updatedStats = {
          totalAttempts: quizStats.totalAttempts + 1,
          totalPassed: quizStats.totalPassed + (passed && !alreadyEarnedXP ? 1 : 0),
          totalQuestions: quizStats.totalQuestions + safeTotal,
          totalCorrect: quizStats.totalCorrect + safeScore
        };

        set({
          lessonProgress: {
            ...lessonProgress,
            [id]: {
              ...existing,
              status: nextStatus,
              completedAt: newCompletedAt,
              contentComplete: true,
              quizScore: safeScore,
              quizPassed: updatedQuizPassed,
              attempts,
              totalQuestions: safeTotal,
              quizLastTriedAt: today
            }
          },
          quizStats: updatedStats
        });

        if (passed && !alreadyEarnedXP) {
          get().addXP(5);
          get().incrementStreakIfFirstCompletionToday();
        }
      },

      retryQuiz: (id) =>
        set((state) => {
          const existing = state.lessonProgress[id];
          if (!existing) return state;
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [id]: {
                ...existing,
                quizScore: null,
                quizPassed: existing.quizPassed,
                totalQuestions: existing.totalQuestions,
                status: existing.status === 'completed' ? 'completed' : 'in_progress'
              }
            }
          };
        }),

      trackHintUsage: (caseId = 'global', hintText = '') =>
        set((state) => {
          const current = state.hintUsage[caseId] || { hintsUsed: 0, lastHint: '' };
          return {
            hintUsage: {
              ...state.hintUsage,
              [caseId]: {
                hintsUsed: current.hintsUsed + 1,
                lastHint: hintText
              }
            }
          };
        }),

      getHintUsage: (caseId = 'global') => {
        const current = get().hintUsage[caseId];
        return current ? current.hintsUsed : 0;
      },

      resetHintUsage: (caseId = 'global') =>
        set((state) => {
          if (!state.hintUsage[caseId]) return state;
          const next = { ...state.hintUsage };
          delete next[caseId];
          return { hintUsage: next };
        }),

      logQuizMistake: (payload) => {
        appendQuizInsight({
          ...payload,
          occurredAt: new Date().toISOString()
        });
        // TODO: Build insights dashboard showing most-missed topics.
      },

      getNextLessonId: () => {
        const progress = get().lessonProgress;
        for (const lessonId of orderedLessonIds) {
          if (!progress[lessonId] || progress[lessonId].status !== 'completed') {
            return lessonId;
          }
        }
        return null;
      }
    }),
    {
      name: 'casequest-storage',
      partialize: (state) => ({
        user: state.user,
        lessonProgress: state.lessonProgress,
        streakHistory: state.streakHistory,
        quizStats: state.quizStats,
        hintUsage: state.hintUsage
      }),
      merge: undefined
    }
  )
);

export default useStore;
