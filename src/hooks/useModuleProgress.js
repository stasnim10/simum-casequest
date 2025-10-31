import { useMemo } from 'react';
import useStore from '../state/store';
import { getModuleList, getLessonsByModule } from '../data/api';

const moduleCatalog = getModuleList();

function deriveStatus(lessonId, lessonProgress, isUnlocked) {
  const entry = lessonProgress[lessonId];
  if (entry?.status === 'completed') return 'completed';
  if (!isUnlocked) return 'locked';
  if (entry?.contentComplete && !entry?.quizPassed) return 'quiz_pending';
  if (entry?.status === 'in_progress') return 'in_progress';
  return 'available';
}

export default function useModuleProgress() {
  const lessonProgress = useStore((state) => state.lessonProgress);
  const getNextLessonId = useStore((state) => state.getNextLessonId);

  const modules = useMemo(() => {
    let previousModuleCompleted = true;

    return moduleCatalog.map((module) => {
      const lessons = getLessonsByModule(module.id);
      const lessonStates = lessons.map((lesson) => {
        const status = deriveStatus(lesson.id, lessonProgress, previousModuleCompleted);
        const entry = lessonProgress[lesson.id];
        return {
          id: lesson.id,
          title: lesson.title,
          status,
          action: status === 'quiz_pending' ? 'quiz' : 'lesson',
          contentComplete: entry?.contentComplete ?? false,
          quizPassed: entry?.quizPassed ?? false,
          quizScore: entry?.quizScore ?? null,
          totalQuestions: entry?.totalQuestions ?? null
        };
      });

      const completedCount = lessonStates.filter((lesson) => lesson.status === 'completed').length;
      const inProgressCount = lessonStates.filter((lesson) => ['in_progress', 'quiz_pending'].includes(lesson.status)).length;
      const nextLesson = lessonStates.find((lesson) =>
        ['quiz_pending', 'in_progress', 'available'].includes(lesson.status)
      );

      const moduleCompleted = completedCount === lessonStates.length && lessonStates.length > 0;
      previousModuleCompleted = moduleCompleted;

      return {
        module,
        lessons: lessonStates,
        completedCount,
        inProgressCount,
        totalLessons: lessonStates.length,
        nextLesson,
        isFullyComplete: moduleCompleted
      };
    });
  }, [lessonProgress]);

  const nextLessonId = getNextLessonId();
  const flatLessons = modules.flatMap((item) => item.lessons);
  const nextLessonState = flatLessons.find((lesson) => lesson.id === nextLessonId);

  return {
    modules,
    nextLessonId,
    nextLessonState,
    allCompleted: !nextLessonId
  };
}
