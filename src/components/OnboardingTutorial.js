import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, BookOpen, Bot, Trophy, Star } from 'lucide-react';

const OnboardingTutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to CaseQuest! 👋",
      description: "Your journey to mastering consulting case interviews starts here. Let's show you around!",
      icon: Star
    },
    {
      title: "Learn Step-by-Step 📚",
      description: "Follow our guided learning path. Complete lessons to earn XP (experience points) and unlock new content.",
      icon: BookOpen
    },
    {
      title: "Practice with AI 🤖",
      description: "Interview with our AI coach. Get real-time feedback on your case-solving approach.",
      icon: Bot
    },
    {
      title: "Track Your Progress 📊",
      description: "Build streaks, level up, and earn Case Coins. Use coins in the store for helpful items!",
      icon: Trophy
    }
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
          <p className="text-gray-600">{currentStep.description}</p>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
          ) : (
            <div />
          )}
          
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Get Started! 🚀
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingTutorial;
