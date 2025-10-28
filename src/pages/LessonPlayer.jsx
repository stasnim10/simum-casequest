import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Star, Crown, Flame } from 'lucide-react';
import useStore from '../state/store';
import { getLesson } from '../data/api';
import { track } from '../lib/analytics';
import MicroLesson from '../components/MicroLesson';

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const startLesson = useStore((state) => state.startLesson);
  const completeLesson = useStore((state) => state.completeLesson);
  const lessonProgress = useStore((state) => state.lessonProgress);
  const user = useStore((state) => state.user);
  const lesson = getLesson(id);
  const isMicro = Boolean(lesson?.microLesson);

  const [stage, setStage] = useState('concept'); // concept | quiz | results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => setStage('concept'), [id]);

  useEffect(() => {
    if (!lesson || isMicro) return;
    startLesson(id);
    track('lesson_started', { lessonId: id, title: lesson.title });
  }, [id, lesson, startLesson, isMicro]);

  if (isMicro) {
    return <MicroLesson lesson={lesson} lessonId={id} />;
  }

  const progress = lessonProgress[id];
  const prevXP = user.xp;
  const prevCrownLevel = progress?.crownLevel || 0;

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p>Lesson not found</p>
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

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleCheckAnswer = () => {
    const question = lesson.quiz[currentQuestion];
    const isCorrect = checkAnswer(question, answers[question.id]);
    setFeedback({ ...feedback, [question.id]: isCorrect });
  };

  const handleNext = () => {
    if (currentQuestion < lesson.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const correct = lesson.quiz.filter(q => 
        checkAnswer(q, answers[q.id])
      ).length;
      const total = lesson.quiz.length;
      
      // Complete lesson and get rewards
      completeLesson(id, { correct, total });
      
      // Calculate rewards
      const xpGained = correct * 10 + 20;
      const isPerfect = correct === total;
      const newCrownLevel = isPerfect 
        ? Math.min(prevCrownLevel + 1, 5) 
        : prevCrownLevel;
      
      track('lesson_completed', { 
        lessonId: id, 
        score: correct, 
        total,
        crowns: newCrownLevel 
      });
      
      setResults({
        correct,
        total,
        xpGained,
        newXP: prevXP + xpGained,
        crownChange: newCrownLevel - prevCrownLevel,
        newCrownLevel,
        isPerfect
      });
      
      setStage('results');
    }
  };

  const question = stage === 'quiz' ? lesson.quiz[currentQuestion] : null;
  const userAnswer = question ? answers[question.id] : null;
  const hasFeedback = question ? feedback[question.id] !== undefined : false;
  const isCorrect = question ? feedback[question.id] : false;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Learning Path
      </button>

      <AnimatePresence mode="wait">
        {/* Concept Card */}
        {stage === 'concept' && (
          <motion.div
            key="concept"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{lesson.title}</h2>
                {progress && (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Crown 
                        key={i} 
                        className={`w-5 h-5 ${i < progress.crownLevel ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-900">Learning Objectives</h3>
              <ul className="space-y-2">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Ready to test your knowledge?</strong> You'll answer {lesson.quiz.length} questions. 
                Get them all right to earn a crown! 👑
              </p>
            </div>

            <button
              onClick={() => setStage('quiz')}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
            >
              Start Quiz
            </button>
          </motion.div>
        )}

        {/* Quiz */}
        {stage === 'quiz' && question && (
          <motion.div
            key={`quiz-${currentQuestion}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-500">
                  Question {currentQuestion + 1} of {lesson.quiz.length}
                </span>
                <div className="flex gap-1">
                  {lesson.quiz.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < currentQuestion ? 'bg-green-500' :
                        i === currentQuestion ? 'bg-indigo-600' :
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
                    const isSelected = userAnswer === option;
                    const showCorrect = hasFeedback && option === question.answer;
                    const showWrong = hasFeedback && isSelected && !isCorrect;
                    
                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(question.id, option)}
                        disabled={hasFeedback}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${
                          showCorrect
                            ? 'border-green-500 bg-green-50'
                            : showWrong
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${hasFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
                    value={userAnswer || ''}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    disabled={hasFeedback}
                    placeholder="Type your answer..."
                    className={`w-full p-4 border-2 rounded-lg text-lg ${
                      hasFeedback
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-indigo-500 focus:outline-none'
                    }`}
                  />
                  {hasFeedback && (
                    <div className="flex items-center gap-2 mt-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-semibold">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-600 font-semibold">
                            Correct answer: {question.accept[0]}
                          </span>
                        </>
                      )}
                    </div>
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
                      value={userAnswer || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      disabled={hasFeedback}
                      placeholder="Enter number..."
                      className={`flex-1 p-4 border-2 rounded-lg text-lg ${
                        hasFeedback
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
                  {hasFeedback && (
                    <div className="flex items-center gap-2 mt-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-semibold">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-600 font-semibold">
                            Correct answer: {question.correct} {question.unit}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Rationale */}
              {hasFeedback && question.rationale && (
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
              {!hasFeedback ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!userAnswer}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  {currentQuestion < lesson.quiz.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {stage === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-block"
              >
                {results.isPerfect ? (
                  <div className="text-8xl mb-4">🎉</div>
                ) : results.correct / results.total >= 0.7 ? (
                  <div className="text-8xl mb-4">👏</div>
                ) : (
                  <div className="text-8xl mb-4">💪</div>
                )}
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2">
                {results.isPerfect ? 'Perfect Score!' : 'Lesson Complete!'}
              </h2>
              <p className="text-xl text-gray-600">
                You got {results.correct} out of {results.total} correct
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {/* XP Gained */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500 rounded-full p-3">
                    <Star className="w-6 h-6 text-white" fill="white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">XP Gained</p>
                    <p className="text-2xl font-bold text-gray-900">+{results.xpGained}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total XP</p>
                  <p className="text-xl font-bold text-gray-900">{results.newXP}</p>
                </div>
              </motion.div>

              {/* Crown Change */}
              {results.crownChange > 0 && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 rounded-full p-3">
                      <Crown className="w-6 h-6 text-white" fill="white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Crown Earned!</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Crown 
                            key={i} 
                            className={`w-5 h-5 ${i < results.newCrownLevel ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Streak */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="bg-orange-500 rounded-full p-3">
                  <Flame className="w-6 h-6 text-white" fill="white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{user.streak} days</p>
                </div>
              </motion.div>
            </div>

            <button
              onClick={() => navigate('/learn')}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
            >
              Back to Learning Path
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
