import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Clock, Star, ArrowRight, 
  CheckCircle, Trophy, Flame 
} from 'lucide-react';
import remoteConfig from '../services/remoteConfig';
import analytics from '../services/analytics';

const EnhancedOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [preferredTime, setPreferredTime] = useState('evening');
  const [endowedProgress, setEndowedProgress] = useState(10);

  useEffect(() => {
    analytics.trackOnboardingStart();
    setEndowedProgress(remoteConfig.getEndowedProgressPercent());
  }, []);

  const steps = [
    {
      title: "Welcome to CaseQuest!",
      subtitle: "Let's set you up for success",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="p-6 bg-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
          >
            <Trophy className="h-12 w-12 text-blue-600" />
          </motion.div>
          <p className="text-gray-600 mb-6">
            You're about to start your consulting prep journey. Let's make it effective and fun!
          </p>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Star className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Head Start Bonus!</span>
            </div>
            <p className="text-sm text-green-700">
              We've already unlocked {endowedProgress}% of your first module to get you started faster
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Set Your Daily Goal",
      subtitle: "How much time can you commit each day?",
      content: (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[5, 10, 20].map((minutes) => (
              <motion.button
                key={minutes}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDailyGoal(minutes)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  dailyGoal === minutes
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="font-semibold text-gray-900">{minutes} min</p>
                <p className="text-xs text-gray-500">
                  {minutes === 5 ? 'Quick' : minutes === 10 ? 'Balanced' : 'Intensive'}
                </p>
              </motion.button>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Start small and build consistency. You can always adjust later!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "When do you prefer to study?",
      subtitle: "We'll send gentle reminders at the right time",
      content: (
        <div>
          <div className="space-y-3 mb-6">
            {[
              { value: 'morning', label: 'Morning (8-10 AM)', emoji: '🌅' },
              { value: 'afternoon', label: 'Afternoon (2-4 PM)', emoji: '☀️' },
              { value: 'evening', label: 'Evening (7-9 PM)', emoji: '🌙' }
            ].map((time) => (
              <motion.button
                key={time.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreferredTime(time.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  preferredTime === time.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{time.emoji}</span>
                  <span className="font-medium text-gray-900">{time.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      subtitle: "Ready to start your first lesson?",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="p-6 bg-green-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Your Learning Plan:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{dailyGoal} minutes daily</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700">Study in the {preferredTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">Build your streak starting today</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>🎯 First Goal:</strong> Complete your first 3-minute lesson to start your streak!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step === 1) {
      analytics.trackGoalSet(dailyGoal);
    }
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const cohortWeek = `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`;
      analytics.setUserCohort(cohortWeek);
      analytics.setOnboardingComplete(true);
      
      onComplete({
        dailyGoalMinutes: dailyGoal,
        preferredStudyTime: preferredTime,
        hasCompletedOnboarding: true,
        endowedProgress: { firstModuleProgress: endowedProgress },
        cohortWeek,
        onboardingCompletedAt: Date.now()
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {currentStep.title}
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              {currentStep.subtitle}
            </p>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`px-4 py-2 rounded-lg ${
              step === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            disabled={step === 0}
          >
            Back
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            {step === steps.length - 1 ? 'Start Learning!' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedOnboarding;
