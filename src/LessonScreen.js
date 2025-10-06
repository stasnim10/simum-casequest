
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react';
import CaseMascot from './components/CaseMascot';
import CelebrationAnimation from './components/CelebrationAnimation';

const LessonScreen = ({ lesson, onComplete }) => {
  const [view, setView] = useState('LEARNING');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStatus, setQuizStatus] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mascotMood, setMascotMood] = useState('thinking');

  const quiz = lesson.quiz && lesson.quiz.length > 0 ? lesson.quiz[0] : null;

  useEffect(() => {
    // If a lesson has no content and no quiz, it's considered empty.
    // Call onComplete immediately with 0 XP and stop further execution.
    if (!lesson.content && !quiz) {
      onComplete(0);
      return;
    }

    // When the lesson prop changes, reset the component's state.
    // Set the initial view based on whether content is present.
    setView(lesson.content ? 'LEARNING' : 'QUIZ');
    setSelectedAnswer(null);
    setQuizStatus(null);
  }, [lesson, quiz, onComplete]);

  const handleSelectAnswer = (option) => {
    if (quizStatus === 'incorrect') {
      setQuizStatus(null); // Allow user to re-try after an incorrect answer
    }
    setSelectedAnswer(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === quiz.correctAnswer) {
      setQuizStatus('correct');
      setMascotMood('celebrating');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setQuizStatus('incorrect');
      setMascotMood('sad');
    }
  };

  const handleFinish = () => {
    onComplete(lesson.xp_reward);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      {showCelebration && <CelebrationAnimation />}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">{lesson.title}</h1>
              <div className="inline-flex items-center text-yellow-500 font-semibold bg-yellow-100 px-3 py-1 rounded-full mt-2">
                <Star className="w-5 h-5 mr-1" /> {lesson.xp_reward} XP
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* --- LEARNING VIEW --- */}
              {view === 'LEARNING' && lesson.content && (
                <motion.div
                  key="learning-view"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                >
                  <p>{lesson.content}</p>
                </motion.div>
              )}

              {/* --- QUIZ VIEW --- */}
              {view === 'QUIZ' && quiz && (
                <motion.div
                  key="quiz-view"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-center mb-4">
                    <CaseMascot 
                      mood={mascotMood} 
                      message={quizStatus === 'correct' ? 'Great job! 🎉' : quizStatus === 'incorrect' ? 'Try again!' : 'You got this!'} 
                      size="md" 
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">{quiz.question}</h2>
                  <div className="space-y-3">
                    {quiz.options.map((option, index) => {
                      const isSelected = selectedAnswer === option;
                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleSelectAnswer(option)}
                          className={`w-full text-left p-5 rounded-lg border-2 text-lg transition-all duration-200 font-medium
                            ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                                : 'border-gray-300 bg-white hover:border-blue-400'
                            }
                            ${quizStatus ? 'cursor-not-allowed' : ''}`}
                          disabled={quizStatus === 'correct'}
                          whileHover={{ scale: quizStatus ? 1 : 1.02 }}
                          whileTap={{ scale: quizStatus ? 1 : 0.98 }}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- FOOTER & ACTIONS --- */}
          <div className="h-32">
            <AnimatePresence>
              {quizStatus && (
                <motion.div
                  key="feedback"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`h-full p-6 flex items-center justify-between text-white font-bold text-xl ${
                    quizStatus === 'correct' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  <div className="flex items-center">
                    {quizStatus === 'correct' ? (
                      <CheckCircle className="w-8 h-8 mr-3" />
                    ) : (
                      <XCircle className="w-8 h-8 mr-3" />
                    )}
                    {quizStatus === 'correct' ? 'Correct!' : 'Incorrect, try again.'}
                  </div>

                  {quizStatus === 'correct' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={handleFinish}
                      className="px-6 py-2 bg-white text-green-600 rounded-lg shadow-md font-bold"
                    >
                      Finish
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="mt-6">
          {view === 'LEARNING' && !quizStatus && (
            quiz ? (
              // If there's a quiz, show "Continue" to proceed to the quiz
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setView('QUIZ')}
                className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              // If there's no quiz, show "Finish" to complete the lesson
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleFinish}
                className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-colors"
              >
                Finish
              </motion.button>
            )
          )}
          {view === 'QUIZ' && !quizStatus && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
              className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonScreen;
