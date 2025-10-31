import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useModuleProgress from '../hooks/useModuleProgress';
import { getLesson } from '../data/api';

const STATUS_META = {
  completed: {
    label: 'Completed',
    badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
    rowClass: 'border-emerald-200 bg-emerald-50',
    ctaLabel: 'Review lesson',
    description: 'Feel free to revisit any time.',
    disabled: false
  },
  in_progress: {
    label: 'In progress',
    badgeClass: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
    rowClass: 'border-indigo-200 bg-indigo-50',
    ctaLabel: 'Continue lesson',
    description: 'Pick up right where you left off.',
    disabled: false
  },
  available: {
    label: 'Ready to start',
    badgeClass: 'text-slate-600 bg-slate-50 border border-slate-200',
    rowClass: 'border-slate-200 bg-white',
    ctaLabel: 'Start lesson',
    description: 'Open the learning module when you are ready.',
    disabled: false
  },
  quiz_pending: {
    label: 'Quiz ready',
    badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200',
    rowClass: 'border-amber-200 bg-amber-50',
    ctaLabel: 'Take quiz',
    description: 'A quick 3-question check to lock in the lesson.',
    disabled: false
  },
  locked: {
    label: 'Locked',
    badgeClass: 'text-slate-400 bg-slate-100 border border-slate-200',
    rowClass: 'border-slate-200 bg-slate-50 text-slate-400',
    ctaLabel: 'Locked',
    description: 'Complete the previous learning module to unlock this one.',
    disabled: true
  }
};

function LessonCard({ lessonState, onOpen }) {
  const meta = STATUS_META[lessonState.status];
  const lesson = getLesson(lessonState.id);

  return (
    <div className={`rounded-2xl border p-4 transition ${meta.rowClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Lesson</p>
          <h3 className="text-base font-semibold text-gray-900">{lesson?.title}</h3>
          <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badgeClass}`}>
            {lessonState.status === 'locked' ? <Lock className="h-3 w-3" /> : null}
            {meta.label}
          </span>
          {meta.description && (
            <p className="mt-3 text-xs text-slate-500 max-w-sm">{meta.description}</p>
          )}
        </div>
        <button
          type="button"
          disabled={meta.disabled}
          onClick={onOpen}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
            meta.disabled
              ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
              : 'border border-indigo-200 bg-white text-indigo-600 hover:border-indigo-300 hover:text-indigo-700'
          }`}
        >
          {meta.ctaLabel}
          {!meta.disabled && <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

export default function LearningPath() {
  const navigate = useNavigate();
  const location = useLocation();
  const { modules } = useModuleProgress();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastData, setToastData] = useState(null);
  const hideTimerRef = useRef(null);
  const clearTimerRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.celebration) {
      setToastData(location.state.celebration);
      navigate('.', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!toastData) {
      setToastVisible(false);
      return undefined;
    }

    setToastVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      clearTimerRef.current = setTimeout(() => {
        setToastData(null);
      }, 300);
    }, 5000);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, [toastData]);

  const dismissToast = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    setToastVisible(false);
    clearTimerRef.current = setTimeout(() => {
      setToastData(null);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-100 px-4 pb-24 pt-10">
      {toastData && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div
            className={`${toastVisible ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-3'} flex w-full max-w-md items-start gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-4 text-white shadow-xl transition-all duration-300 ease-out`}
            role="status"
            aria-live="polite"
          >
            <div className="text-2xl" aria-hidden>
              🎉
            </div>
            <div className="flex-1 text-sm leading-snug">
              <p className="font-semibold">
                Great job! You&apos;ve mastered {toastData.lessonTitle || 'this lesson'}!
              </p>
              <p className="text-xs text-white/80">+{toastData.xpAwarded || 5} XP added to your streak.</p>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <header className="flex flex-col gap-3 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-600">
            <Sparkles className="h-4 w-4" /> Learning Modules Path
          </span>
          <h1 className="text-3xl font-semibold text-gray-900">Choose your next learning step</h1>
          <p className="text-sm text-gray-600 md:text-base">
            Four small learning modules, one calm path. Milo unlocks the next lesson as soon as you finish the current one.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {modules.map(({ module, lessons, completedCount, totalLessons, nextLesson, isFullyComplete }) => (
            <div key={module.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm">
              <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-indigo-100">Learning module</span>
                    <h2 className="mt-1 text-xl font-semibold md:text-2xl">{module.title}</h2>
                    <p className="mt-2 text-sm text-indigo-100">{module.summary}</p>
                  </div>
                  {isFullyComplete && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Mastered
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-indigo-100">
                    <span>Progress</span>
                    <span>{completedCount}/{totalLessons} lessons</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-indigo-400/60">
                    <div
                      className="h-full rounded-full bg-white/90"
                      style={{ width: `${totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                {lessons.map((lessonState) => (
                  <LessonCard
                    key={lessonState.id}
                    lessonState={lessonState}
                    onOpen={() =>
                      navigate(lessonState.status === 'quiz_pending' ? `/quiz/${lessonState.id}` : `/lesson/${lessonState.id}`)
                    }
                  />
                ))}
              </div>

              <div className="border-t border-indigo-50 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                {nextLesson ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Next up</p>
                      <p className="text-xs text-slate-500">{getLesson(nextLesson.id)?.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(nextLesson.status === 'quiz_pending' ? `/quiz/${nextLesson.id}` : `/lesson/${nextLesson.id}`)
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      {nextLesson.status === 'quiz_pending' ? 'Launch quiz' : 'Resume with Milo'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> All lessons done! You’re ready for the Case Simulator.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
