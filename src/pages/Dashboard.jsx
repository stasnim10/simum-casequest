import { Flame, ArrowRight, BookOpen, Workflow, CheckCircle2, BarChart3, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MascotCoach from '../components/MascotCoach';
import useStore from '../state/store';
import useModuleProgress from '../hooks/useModuleProgress';
import { getLesson } from '../data/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const quizStats = useStore((state) => state.quizStats);
  const { modules, nextLessonId, nextLessonState, allCompleted } = useModuleProgress();

  const activeModule = modules.find((module) => module.nextLesson) ?? modules[modules.length - 1];
  const activeLesson = nextLessonId ? getLesson(nextLessonId) : null;
  const nextActionIsQuiz = nextLessonState?.status === 'quiz_pending';

  const goalTarget = Math.max(user.dailyGoal || 0, 20);
  const dailyGoalProgress = Math.min((user.dailyXP / goalTarget) * 100, 100);
  const displayedDailyXP = Math.min(user.dailyXP, goalTarget);
  const streakMessage = user.streak > 0 ? `${user.streak}-day streak` : 'Let’s build your first streak';

  const coachMessage = allCompleted
    ? {
        message: 'Foundations complete! 🎉',
        subtext: 'Try the Case Simulator when you’re ready for a full practice round.',
        mood: 'celebrate'
      }
    : {
        message: activeLesson
          ? nextActionIsQuiz
            ? `Quiz time: ${activeLesson.title}`
            : `Next up: ${activeLesson.title}`
          : 'Ready for the next learning module?',
        subtext: nextActionIsQuiz
          ? 'Take the short quiz to lock in what you just learned. Milo is cheering for you!'
          : 'Open the lesson to keep your momentum going. Little wins stack fast.',
        mood: 'encourage'
      };

  const actions = [
    {
      title: 'Open learning modules',
      description: 'Visit your beginner journey and continue where you left off.',
      icon: <BookOpen className="w-5 h-5" />,
      onClick: () => navigate('/learn')
    },
    {
      title: 'Open case simulator',
      description: 'Try the card-based simulator when you want a full case experience.',
      icon: <Workflow className="w-5 h-5" />,
      onClick: () => navigate('/simulator')
    }
  ];

  const totalQuizzesPassed = quizStats?.totalPassed || 0;
  const totalQuizAttempts = quizStats?.totalAttempts || 0;
  const averageQuizScore = quizStats?.totalQuestions
    ? Math.round((quizStats.totalCorrect / quizStats.totalQuestions) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-100 px-4 pb-24 pt-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Welcome back</p>
              <h1 className="text-2xl font-semibold text-gray-900">Hi {user.name} 👋</h1>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Flame className="h-4 w-4" />
              {streakMessage}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Daily goal</span>
              <span>{displayedDailyXP}/{goalTarget} points</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                style={{ width: `${dailyGoalProgress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 p-6 text-white shadow-xl">
          <p className="text-xs uppercase tracking-wide text-indigo-100">Continue learning</p>
          <h2 className="mt-1 text-2xl font-semibold">
            {activeModule?.module.title || 'Learning Modules'}
          </h2>
          <p className="mt-2 text-sm text-indigo-100">
            {activeModule?.completedCount || 0}/{activeModule?.totalLessons || 1} lessons complete
            {activeLesson ? ` · Next: ${activeLesson.title} (${nextActionIsQuiz ? 'quiz' : 'lesson'})` : ''}
          </p>
          <button
            type="button"
            onClick={() => {
              if (activeLesson) {
                navigate(nextActionIsQuiz ? `/quiz/${activeLesson.id}` : `/lesson/${activeLesson.id}`);
              } else {
                navigate('/learn');
              }
            }}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50"
          >
            {activeLesson
              ? nextActionIsQuiz
                ? 'Take lesson quiz'
                : 'Resume micro-lesson'
              : 'Review learning modules'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {actions.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              className="rounded-2xl border border-indigo-100 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-indigo-600 font-medium">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                  {action.icon}
                </span>
                {action.title}
              </div>
              <p className="mt-2 text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </section>

        <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">Your progress</p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900">Quiz check-ins</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Passed
              </div>
              <p className="mt-2 text-2xl font-bold text-indigo-700">{totalQuizzesPassed}</p>
              <p className="text-xs text-indigo-500 mt-1">Celebrated wins so far</p>
            </div>
            <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
              <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                <RefreshCcw className="h-4 w-4" /> Attempts
              </div>
              <p className="mt-2 text-2xl font-bold text-purple-700">{totalQuizAttempts}</p>
              <p className="text-xs text-purple-500 mt-1">Practice rounds completed</p>
            </div>
            <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4">
              <div className="flex items-center gap-2 text-pink-600 text-sm font-semibold">
                <BarChart3 className="h-4 w-4" /> Average score
              </div>
              <p className="mt-2 text-2xl font-bold text-pink-700">
                {averageQuizScore !== null ? `${averageQuizScore}%` : '—'}
              </p>
              <p className="text-xs text-pink-500 mt-1">Across all quiz questions</p>
            </div>
          </div>
        </section>

        <MascotCoach
          message={coachMessage.message}
          subtext={coachMessage.subtext}
          mood={coachMessage.mood}
        />
      </div>
    </div>
  );
}
