import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, ArrowRight, Zap, Repeat, BarChart3 } from 'lucide-react';
import useStore from '../state/store';
import { getModuleList, getLessonsByModule } from '../data/api';
import MascotCoach from '../components/MascotCoach';

const tutorialSteps = [
  {
    id: 'progress',
    title: 'This is your home base',
    message: 'Check your streak, XP, and daily goal at a glance.'
  },
  {
    id: 'cta',
    title: 'Continue learning',
    message: 'Tap here any time—Milo will guide you to the next lesson.'
  },
  {
    id: 'actions',
    title: 'Quick shortcuts',
    message: 'Jump into a quick practice, review lessons, or view your progress.'
  },
  {
    id: 'coach',
    title: 'Coach Milo',
    message: 'I’ll keep you motivated and let you know what to do next!'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, lessonProgress, onboarding, finishTutorial } = useStore();

  const [tourActive, setTourActive] = useState(onboarding.needsTutorial);
  const [tourStep, setTourStep] = useState(0);

  const progressRef = useRef(null);
  const ctaRef = useRef(null);
  const actionsRef = useRef(null);
  const coachRef = useRef(null);

  useEffect(() => {
    if (onboarding.needsTutorial) {
      setTourActive(true);
      setTourStep(0);
    }
  }, [onboarding.needsTutorial]);

  useEffect(() => {
    const handler = () => {
      setTourActive(true);
      setTourStep(0);
    };
    window.addEventListener('casequest:tutorial:replay', handler);
    return () => window.removeEventListener('casequest:tutorial:replay', handler);
  }, []);

  const modules = useMemo(() => getModuleList(), []);

  const journey = useMemo(() => {
    let activeModule = modules[0];
    let activeLesson = null;
    let completedLessons = 0;
    let totalLessons = 0;

    for (const module of modules) {
      const lessons = getLessonsByModule(module.id);
      totalLessons = lessons.length;
      const incomplete = lessons.find((lesson) => {
        const status = lessonProgress[lesson.id];
        return !(status && (status.status === 'mastered' || status.crownLevel >= 1));
      });
      completedLessons = lessons.filter((lesson) => {
        const status = lessonProgress[lesson.id];
        return status && (status.status === 'mastered' || status.crownLevel >= 1);
      }).length;

      if (incomplete) {
        activeModule = module;
        activeLesson = incomplete;
        break;
      }
    }

    return {
      activeModule,
      activeLesson,
      completedLessons,
      totalLessons
    };
  }, [lessonProgress, modules]);

  const dailyGoalProgress = Math.min((user.dailyXP / user.dailyGoal) * 100, 100);

  const hasStarted = useMemo(() => {
    return Object.values(lessonProgress).some((progress) => progress && progress.status);
  }, [lessonProgress]);

  const coachMessage = useMemo(() => {
    if (!journey.activeLesson) {
      return {
        message: 'You have completed the available lessons—stellar work!',
        subtext: 'Hop into Quick Practice whenever you want to keep the streak alive.',
        mood: 'celebrate'
      };
    }
    if (dailyGoalProgress >= 100) {
      return {
        message: `You hit today’s goal. Want to bank extra XP on ${journey.activeLesson.title}?`,
        subtext: 'Even five more minutes keeps momentum going.',
        mood: 'celebrate'
      };
    }
    return {
      message: `Next up: ${journey.activeLesson.title}. I’ll walk you through each step.`,
      subtext: 'Finish one micro-lesson to keep your streak glowing.',
      mood: 'encourage'
    };
  }, [journey.activeLesson, dailyGoalProgress]);

  const quickActions = [
    {
      title: 'Quick practice',
      description: '2-minute market sizing drill.',
      icon: <Zap className="w-5 h-5" />,
      onClick: () => navigate('/lesson/ms1')
    },
    {
      title: 'Review lessons',
      description: 'Refresh what you already learned.',
      icon: <Repeat className="w-5 h-5" />,
      onClick: () => navigate('/learn')
    },
    {
      title: 'See progress',
      description: 'Your streak, XP, and milestones.',
      icon: <BarChart3 className="w-5 h-5" />,
      onClick: () => navigate('/progress')
    }
  ];

  const handleContinue = () => {
    if (journey.activeLesson) {
      navigate(`/lesson/${journey.activeLesson.id}`);
    } else {
      navigate('/learn');
    }
  };

  const advanceTour = () => {
    if (tourStep >= tutorialSteps.length - 1) {
      setTourActive(false);
      finishTutorial();
    } else {
      setTourStep((prev) => prev + 1);
    }
  };

  const highlight = tutorialSteps[tourStep]?.id;

  return (
    <div className="min-h-screen px-4 pt-8 pb-24 bg-gradient-to-br from-slate-50 via-white to-indigo-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.section
          ref={progressRef}
          animate={{ scale: tourActive && highlight === 'progress' ? 1.02 : 1 }}
          className={`relative rounded-3xl bg-white shadow-xl border ${
            tourActive && highlight === 'progress'
              ? 'border-indigo-400 ring-4 ring-indigo-200 z-50'
              : 'border-indigo-100'
          } p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Welcome back</p>
              <h1 className="text-2xl font-semibold text-gray-900">Hi {user.name}! 👋</h1>
            </div>
            <div className="text-right text-sm text-indigo-500 font-medium flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {user.streak}-day streak
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Daily goal</span>
              <span>{user.dailyXP}/{user.dailyGoal} XP</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${dailyGoalProgress}%` }}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={ctaRef}
          animate={{ scale: tourActive && highlight === 'cta' ? 1.02 : 1 }}
          className={`relative rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-xl p-6 ${
            tourActive && highlight === 'cta' ? 'ring-4 ring-indigo-200 z-50' : ''
          }`}
        >
          <p className="text-xs uppercase tracking-wide text-indigo-100">Next lesson</p>
          <h2 className="text-2xl font-semibold mt-1">
            {journey.activeModule ? journey.activeModule.title : 'All modules complete!'}
          </h2>
          {journey.activeLesson && (
            <p className="text-indigo-100 text-sm mt-2">
              {journey.completedLessons}/{journey.totalLessons} lessons complete · Up next: {journey.activeLesson.title}
            </p>
          )}
          <button
            type="button"
            onClick={handleContinue}
            className="mt-6 w-full inline-flex items-center justify-center gap-3 px-6 py-4 text-lg font-semibold bg-white text-indigo-600 rounded-2xl shadow-lg hover:bg-indigo-50"
          >
            {hasStarted ? 'Continue learning' : 'Start your first lesson'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.section>

        <motion.section
          ref={actionsRef}
          animate={{ scale: tourActive && highlight === 'actions' ? 1.02 : 1 }}
          className={`relative grid grid-cols-1 md:grid-cols-3 gap-3 ${
            tourActive && highlight === 'actions'
              ? 'ring-4 ring-indigo-200 rounded-3xl bg-white p-2 shadow-lg z-50'
              : ''
          }`}
        >
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              className="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-left hover:border-indigo-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 text-indigo-600 font-medium">
                {action.icon}
                {action.title}
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{action.description}</p>
            </button>
          ))}
        </motion.section>

        <div ref={coachRef} className={tourActive && highlight === 'coach' ? 'relative z-50' : 'relative'}>
          <MascotCoach
            message={coachMessage.message}
            subtext={coachMessage.subtext}
            mood={coachMessage.mood}
          />
        </div>
      </div>

      <AnimatePresence>
        {tourActive && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" onClick={advanceTour} />
            <motion.div
              key={tourStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative z-50 max-w-sm w-full mx-4 mb-12 md:mb-0 bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="text-sm text-indigo-500 font-semibold mb-1">
                Step {tourStep + 1} of {tutorialSteps.length}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{tutorialSteps[tourStep].title}</h3>
              <p className="text-sm text-gray-600 mt-2">{tutorialSteps[tourStep].message}</p>
              <button
                type="button"
                onClick={advanceTour}
                className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                {tourStep === tutorialSteps.length - 1 ? 'Let’s start learning!' : 'Got it!'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
