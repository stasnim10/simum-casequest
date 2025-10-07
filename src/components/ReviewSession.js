import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, X, Clock, TrendingUp, 
  ArrowRight, RotateCcw, Star 
} from 'lucide-react';
import spacedRepetitionService from '../services/spacedRepetition';

const ReviewSession = ({ reviewItems, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [startTime] = useState(Date.now());

  const currentItem = reviewItems[currentIndex];
  const progress = ((currentIndex + 1) / reviewItems.length) * 100;

  const handlePerformance = (performance) => {
    const updatedItem = spacedRepetitionService.calculateNextReview(currentItem, performance);
    
    setSessionResults(prev => [...prev, {
      item: currentItem,
      performance,
      updatedItem,
      correct: performance >= 2
    }]);

    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // Session complete
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // minutes
      const correct = sessionResults.filter(r => r.correct).length + (performance >= 2 ? 1 : 0);
      
      onComplete({
        results: [...sessionResults, { 
          item: currentItem, 
          performance, 
          updatedItem, 
          correct: performance >= 2 
        }],
        sessionStats: {
          total: reviewItems.length,
          correct,
          timeSpent,
          accuracy: Math.round((correct / reviewItems.length) * 100)
        }
      });
    }
  };

  if (!currentItem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Review Session</h1>
              <p className="text-sm text-gray-600">
                {currentIndex + 1} of {reviewItems.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{Math.round((Date.now() - startTime) / 1000 / 60)} min</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {currentItem.type || 'Concept'}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {currentItem.strength || 0}% mastery
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentItem.name}
              </h2>
              
              <div className="text-gray-700 mb-6">
                {currentItem.question || currentItem.content}
              </div>
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Show Answer
              </button>
            ) : (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-green-800 mb-2">Answer:</h3>
                  <p className="text-green-700">
                    {currentItem.answer || currentItem.explanation || "Review the concept and rate your understanding."}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-center text-gray-600 font-medium mb-4">
                    How well did you know this?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handlePerformance(0)}
                      className="p-4 border-2 border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <div className="font-medium">Didn't Know</div>
                      <div className="text-sm opacity-75">Need to review again</div>
                    </button>
                    
                    <button
                      onClick={() => handlePerformance(1)}
                      className="p-4 border-2 border-orange-200 text-orange-700 rounded-xl hover:bg-orange-50 transition-colors"
                    >
                      <div className="font-medium">Hard</div>
                      <div className="text-sm opacity-75">Struggled to remember</div>
                    </button>
                    
                    <button
                      onClick={() => handlePerformance(2)}
                      className="p-4 border-2 border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium">Good</div>
                      <div className="text-sm opacity-75">Remembered correctly</div>
                    </button>
                    
                    <button
                      onClick={() => handlePerformance(3)}
                      className="p-4 border-2 border-green-200 text-green-700 rounded-xl hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium">Easy</div>
                      <div className="text-sm opacity-75">Knew it instantly</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Session Stats */}
        <div className="bg-white bg-opacity-50 rounded-xl p-4">
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900">
                {sessionResults.filter(r => r.correct).length}
              </div>
              <div className="text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">
                {sessionResults.length}
              </div>
              <div className="text-gray-600">Reviewed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">
                {reviewItems.length - currentIndex - 1}
              </div>
              <div className="text-gray-600">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSession;
