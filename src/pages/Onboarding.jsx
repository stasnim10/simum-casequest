import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Goal, Compass, BookOpenCheck } from 'lucide-react';
import useStore from '../state/store';

const goalOptions = [
  {
    id: 'beginner',
    title: "I'm just starting",
    description: 'Learn the basics from scratch with friendly guidance.',
    icon: '🌱'
  },
  {
    id: 'intermediate',
    title: 'I have some experience',
    description: 'Refresh the fundamentals and polish core skills.',
    icon: '⚙️'
  },
  {
    id: 'advanced',
    title: 'Preparing for interviews',
    description: 'Sharpen your casing skills with tougher drills.',
    icon: '🚀'
  }
];

const styleOptions = [
  {
    id: 'quick',
    title: 'Quick lessons',
    description: '5–10 minute bursts to build momentum.',
    icon: '⚡'
  },
  {
    id: 'deep',
    title: 'Deep practice',
    description: '20–30 minute sessions for focused learning.',
    icon: '🧠'
  },
  {
    id: 'mix',
    title: 'Mix of both',
    description: 'A balanced blend of quick wins and deeper dives.',
    icon: '🥇'
  }
];

const STEP_SEQUENCE = ['welcome', 'goal', 'style', 'ready'];

export default function Onboarding() {
  const navigate = useNavigate();
  const onboarding = useStore((state) => state.onboarding);
  const setOnboardingGoal = useStore((state) => state.setOnboardingGoal);
  const setOnboardingStyle = useStore((state) => state.setOnboardingStyle);
  const completeOnboarding = useStore((state) => state.completeOnboarding);

  const [stepIndex, setStepIndex] = useState(0);
  const [localGoal, setLocalGoal] = useState(onboarding.goal || 'beginner');
  const [localStyle, setLocalStyle] = useState(onboarding.learningStyle || 'quick');

  const currentStep = STEP_SEQUENCE[stepIndex];

  const goNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, STEP_SEQUENCE.length - 1));
  };

  const startJourney = () => {
    completeOnboarding({ goal: localGoal, learningStyle: localStyle });
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {currentStep === 'welcome' && (
              <div className="p-10 text-center space-y-8">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-5xl">
                    🧠
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold text-gray-900">Welcome to CaseQuest! 🎯</h1>
                  <p className="text-gray-600 text-lg">
                    Learn consulting case interviews step-by-step, just like learning a new language.
                  </p>
                </div>
                <button
                  onClick={goNext}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition"
                >
                  Start Your Journey
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            )}

            {currentStep === 'goal' && (
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Goal className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">What brings you to CaseQuest?</h2>
                </div>
                <p className="text-gray-600">Pick one so Coach Milo can tailor your learning path.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {goalOptions.map((option) => {
                    const active = option.id === localGoal;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setLocalGoal(option.id);
                          setOnboardingGoal(option.id);
                        }}
                        className={`text-left rounded-2xl border-2 p-5 transition flex flex-col gap-2 ${
                          active
                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-indigo-200'
                        }`}
                      >
                        <span className="text-3xl" aria-hidden>{option.icon}</span>
                        <span className="text-lg font-semibold text-gray-900">{option.title}</span>
                        <span className="text-sm text-gray-600">{option.description}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={goNext}
                  className="ml-auto inline-flex items-center gap-2 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
                >
                  Continue
                </button>
              </div>
            )}

            {currentStep === 'style' && (
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Compass className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">How do you learn best?</h2>
                </div>
                <p className="text-gray-600">Pick the pace that fits your schedule—Milo will adjust lessons accordingly.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {styleOptions.map((option) => {
                    const active = option.id === localStyle;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setLocalStyle(option.id);
                          setOnboardingStyle(option.id);
                        }}
                        className={`text-left rounded-2xl border-2 p-5 transition flex flex-col gap-2 ${
                          active
                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-indigo-200'
                        }`}
                      >
                        <span className="text-3xl" aria-hidden>{option.icon}</span>
                        <span className="text-lg font-semibold text-gray-900">{option.title}</span>
                        <span className="text-sm text-gray-600">{option.description}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={goNext}
                  className="ml-auto inline-flex items-center gap-2 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
                >
                  Continue
                </button>
              </div>
            )}

            {currentStep === 'ready' && (
              <div className="p-8 md:p-12 space-y-8 text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-4xl">
                    🧠
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-900">Coach Milo has your plan ready!</h2>
                  <p className="text-gray-600 text-lg">
                    We’ll walk through a quick tour so you always know where to go next.
                  </p>
                </div>
                <button
                  onClick={startJourney}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition"
                >
                  Meet Milo & Start Learning
                  <BookOpenCheck className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
