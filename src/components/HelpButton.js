import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, BookOpen, Bot, Trophy, Star } from 'lucide-react';

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpTopics = [
    {
      icon: BookOpen,
      title: "Learning Path",
      description: "Follow structured lessons to build your consulting skills step-by-step. Complete lessons to earn XP and unlock new content."
    },
    {
      icon: Bot,
      title: "AI Interview",
      description: "Practice case interviews with our AI coach. Speak or type your answers and get instant feedback on your approach."
    },
    {
      icon: Star,
      title: "XP & Levels",
      description: "Earn XP (experience points) by completing lessons. Every 100 XP = 1 level up. Higher levels unlock advanced content."
    },
    {
      icon: Trophy,
      title: "Streaks & Coins",
      description: "Practice daily to build your streak. Complete lessons to earn Case Coins. Use coins in the store for helpful items."
    }
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-blue-600 text-white rounded-full shadow-lg flex items-center gap-2 px-4 py-3 z-40 hover:bg-blue-700 transition-colors"
        style={{ minHeight: '48px' }}
      >
        <HelpCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Help</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto z-50 p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Need Help? 🤔</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {helpTopics.map((topic, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <topic.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                      <p className="text-gray-600 text-sm">{topic.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Quick Tip:</strong> Hover over the <HelpCircle className="w-4 h-4 inline text-gray-400" /> icons 
                  throughout the app for quick explanations!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpButton;
