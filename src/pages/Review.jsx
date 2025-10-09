import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Star } from 'lucide-react';
import useStore from '../state/store';
import { getDueItems } from '../services/spacedRepetition';
import { getLesson } from '../data/api';

export default function Review() {
  const { reviewItems, updateReviewItem, addReviewItem, addXP } = useStore();
  const [dueItems, setDueItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    // Get due items or seed some if none exist
    let items = getDueItems(reviewItems);
    
    if (items.length === 0) {
      // Seed some review items from completed lessons
      const lesson = getLesson('l1');
      if (lesson) {
        lesson.quiz.slice(0, 3).forEach((q, i) => {
          addReviewItem(`l1-q${i}`, 'l1', q);
        });
        items = getDueItems(reviewItems);
      }
    }
    
    setDueItems(items);
  }, [reviewItems, addReviewItem]);

  if (dueItems.length === 0 && !sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Review</h2>
        
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <RotateCcw className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No Reviews Due</h3>
          <p className="text-gray-600 mb-6">
            Complete some lessons to build your review queue. Items will appear here based on spaced repetition.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-left">
            <p className="font-semibold mb-2">Review Schedule:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• First review: 1 day after learning</li>
              <li>• Second review: 3 days later</li>
              <li>• Third review: 7 days later</li>
              <li>• Final review: 14 days later</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const checkAnswer = (question, userAnswer) => {
    if (question.type === 'mcq') {
      return userAnswer === question.answer;
    }
    if (question.type === 'fill') {
      return question.accept.some(a => 
        userAnswer?.toLowerCase().trim() === a.toLowerCase()
      );
    }
    if (question.type === 'calc') {
      const num = parseFloat(userAnswer);
      return !isNaN(num) && Math.abs(num - question.correct) <= question.tolerance;
    }
    return false;
  };

  const handleCheck = () => {
    const item = dueItems[currentIndex];
    const question = item.questionData;
    const correct = checkAnswer(question, answer);
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Update quality: 5=perfect, 3=okay, 0=wrong
    const quality = correct ? 5 : 0;
    updateReviewItem(item.id, quality);
    
    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    if (currentIndex < dueItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      // Session complete
      const xpGained = sessionStats.correct * 5 + 10;
      addXP(xpGained);
      setSessionComplete(true);
    }
  };

  if (sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-8 shadow-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-8xl mb-4"
          >
            ✅
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-2">Review Complete!</h2>
          <p className="text-xl text-gray-600 mb-6">
            You got {sessionStats.correct} out of {sessionStats.total} correct
          </p>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 flex items-center justify-center gap-3 mb-6"
          >
            <div className="bg-yellow-500 rounded-full p-3">
              <Star className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">XP Gained</p>
              <p className="text-2xl font-bold">+{sessionStats.correct * 5 + 10}</p>
            </div>
          </motion.div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const item = dueItems[currentIndex];
  const question = item.questionData;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Review Session</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-white rounded-xl p-8 shadow-lg"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-500">
                Question {currentIndex + 1} of {dueItems.length}
              </span>
              <div className="flex gap-1">
                {dueItems.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < currentIndex ? 'bg-green-500' :
                      i === currentIndex ? 'bg-indigo-600' :
                      'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-6">{question.stem}</h3>

            {/* MCQ */}
            {question.type === 'mcq' && (
              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = answer === option;
                  const showCorrect = showFeedback && option === question.answer;
                  const showWrong = showFeedback && isSelected && !isCorrect;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => setAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        showCorrect
                          ? 'border-green-500 bg-green-50'
                          : showWrong
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill */}
            {question.type === 'fill' && (
              <div>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={showFeedback}
                  placeholder="Type your answer..."
                  className={`w-full p-4 border-2 rounded-lg text-lg ${
                    showFeedback
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-indigo-500 focus:outline-none'
                  }`}
                />
                {showFeedback && !isCorrect && (
                  <p className="mt-2 text-sm text-red-600">
                    Correct answer: {question.accept[0]}
                  </p>
                )}
              </div>
            )}

            {/* Calc */}
            {question.type === 'calc' && (
              <div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="any"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={showFeedback}
                    placeholder="Enter number..."
                    className={`flex-1 p-4 border-2 rounded-lg text-lg ${
                      showFeedback
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-indigo-500 focus:outline-none'
                    }`}
                  />
                  <div className="flex items-center px-4 bg-gray-100 rounded-lg font-semibold">
                    {question.unit}
                  </div>
                </div>
                {showFeedback && !isCorrect && (
                  <p className="mt-2 text-sm text-red-600">
                    Correct answer: {question.correct} {question.unit}
                  </p>
                )}
              </div>
            )}

            {/* Rationale */}
            {showFeedback && question.rationale && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
              >
                <p className="text-sm text-blue-900">
                  <strong>Explanation:</strong> {question.rationale}
                </p>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            {!showFeedback ? (
              <button
                onClick={handleCheck}
                disabled={!answer}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                {currentIndex < dueItems.length - 1 ? 'Next Question' : 'Complete Review'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
