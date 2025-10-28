import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';
import useStore from '../state/store';
import { getModuleList, getLessonsByModule } from '../data/api';

export default function LearningPath() {
  const navigate = useNavigate();
  const { lessonProgress } = useStore();
  const modules = useMemo(() => getModuleList(), []);

  let activeModuleId = null;

  const moduleStates = modules.map((module) => {
    const lessons = getLessonsByModule(module.id);
    const completedLessons = lessons.filter((lesson) => {
      const progress = lessonProgress[lesson.id];
      return progress && (progress.status === 'mastered' || progress.crownLevel >= 1);
    }).length;

    const isComplete = completedLessons === lessons.length;

    let isUnlocked = !module.prereq;
    if (module.prereq) {
      const prereqLessons = getLessonsByModule(module.prereq);
      isUnlocked = prereqLessons.every((lesson) => {
        const progress = lessonProgress[lesson.id];
        return progress && (progress.status === 'mastered' || progress.crownLevel >= 1);
      });
    }

    if (isUnlocked && !isComplete && !activeModuleId) {
      activeModuleId = module.id;
    }

    const nextLesson = lessons.find((lesson) => {
      const status = lessonProgress[lesson.id];
      return !(status && (status.status === 'mastered' || status.crownLevel >= 1));
    });

    return {
      module,
      lessons,
      completedLessons,
      totalLessons: lessons.length,
      isComplete,
      isUnlocked,
      nextLesson
    };
  });

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 bg-gradient-to-br from-slate-50 via-white to-indigo-100">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Your learning journey</h1>
          <p className="text-sm text-gray-600">Unlock each module by completing the one above it. Milo keeps the path clear.</p>
        </header>

        <div className="relative pl-8">
          <div className="absolute top-3 bottom-3 left-4 w-px bg-indigo-200" />
          <div className="space-y-6">
            {moduleStates.map(({ module, lessons, completedLessons, totalLessons, isComplete, isUnlocked, nextLesson }) => {
              const isActive = activeModuleId === module.id;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative bg-white rounded-3xl border border-indigo-100 p-5 shadow-sm ${
                    isActive ? 'ring-4 ring-indigo-200 shadow-lg' : ''
                  }`}
                >
                  <span className="absolute -left-8 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-indigo-300 text-indigo-600">
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : isUnlocked ? '🔓' : <Lock className="w-5 h-5" />}
                  </span>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">{module.title}</h2>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                            <Sparkles className="w-3 h-3" />
                            You are here
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 max-w-md">{module.summary}</p>
                      <p className="text-xs text-gray-500">{completedLessons}/{totalLessons} lessons complete</p>
                    </div>
                    <div className="shrink-0">
                      {isActive && nextLesson ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                          className="inline-flex items-center gap-2 px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
                        >
                          Continue lesson
                        </button>
                      ) : isComplete ? (
                        <span className="text-sm font-semibold text-emerald-600">Module mastered</span>
                      ) : (
                        <span className="text-sm text-gray-400">Finish the previous module to unlock</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {lessons.map((lesson) => {
                      const status = lessonProgress[lesson.id];
                      const mastered = status && (status.status === 'mastered' || status.crownLevel >= 1);
                      const inProgress = status && !mastered;
                      return (
                        <div
                          key={lesson.id}
                          className={`rounded-2xl px-4 py-3 text-sm ${
                            mastered
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : inProgress
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-gray-50 text-gray-500 border border-gray-100'
                          }`}
                        >
                          {lesson.title} {mastered ? '· mastered' : inProgress ? '· in progress' : '· locked'}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
