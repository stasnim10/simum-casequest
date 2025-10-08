import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Crown } from 'lucide-react';
import { getLesson } from '../data/api';
import useStore from '../state/store';
import { track } from '../lib/analytics';

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startLesson, completeLesson } = useStore();
  const [lesson, setLesson] = useState(null);
  const [stage, setStage] = useState('concept'); // concept | quiz | results
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    const lessonData = getLesson(id);
    if (lessonData) {
      setLesson(lessonData);
      startLesson(id);
      track('lesson_started', { lessonId: id, title: lessonData.title });
    }
  }, [id, startLesson]);

  const handleStartQuiz = () => {
    setStage('quiz');
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < lesson.quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      gradeQuiz();
    }
  };

  const gradeQuiz = () => {
    let correct = 0;
    const gradedResults = lesson.quiz.map((q) => {
      const userAnswer = answers[q.id];
      let isCorrect = false;

      if (q.type === 'mcq') {
        isCorrect = userAnswer === q.answer;
      } else if (q.type === 'fill') {
        isCorrect = q.accept.some((a) => a.toLowerCase() === userAnswer?.toLowerCase());
      } else if (q.type === 'calc') {
        const numAnswer = parseFloat(userAnswer);
        isCorrect = Math.abs(numAnswer - q.correct) <= q.tolerance;
      }

      if (isCorrect) correct++;
      return { ...q, userAnswer, isCorrect };
    });

    const completionData = completeLesson(id, { correct, total: lesson.quiz.length });
    track('lesson_completed', { 
      lessonId: id, 
      score: correct, 
      total: lesson.quiz.length,
      crowns: completionData.crownLevel 
    });
    setResults({ gradedResults, correct, total: lesson.quiz.length, ...completionData });
    setStage('results');
  };

  if (!lesson) {
    return <div className="max-w-3xl mx-auto p-4">Loading...</div>;
  }

  const currentQuestion = lesson.quiz[currentQuizIndex];
  const hasAnswered = answers[currentQuestion?.id] !== undefined;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Path
      </button>

      {stage === 'concept' && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Learning Objectives</h2>
            <ul className="space-y-2">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleStartQuiz}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      )}

      {stage === 'quiz' && (
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Question {currentQuizIndex + 1} of {lesson.quiz.length}
              </h2>
              <span className="text-sm text-gray-600">{currentQuestion.type.toUpperCase()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuizIndex + 1) / lesson.quiz.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <p className="text-lg text-gray-900 mb-4">{currentQuestion.stem}</p>

            {currentQuestion.type === 'mcq' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'fill' && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
              />
            )}

            {currentQuestion.type === 'calc' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Enter number..."
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
                {currentQuestion.unit && (
                  <span className="text-gray-600 font-medium">{currentQuestion.unit}</span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!hasAnswered}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {currentQuizIndex < lesson.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}

      {stage === 'results' && results && (
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {results.correct}/{results.total}
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+{results.xpGained} XP</div>
                <div className="text-sm text-gray-600">Earned</div>
              </div>
              {results.crownLevel > results.previousCrownLevel && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(results.crownLevel)].map((_, i) => (
                      <Crown key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">Crown Level {results.crownLevel}</div>
                </div>
              )}
            </div>
            {results.correct === results.total && (
              <p className="text-green-600 font-medium">Perfect score! 🎉</p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {results.gradedResults.map((q, i) => (
              <div
                key={q.id}
                className={`p-4 rounded-lg border-2 ${
                  q.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  {q.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      Question {i + 1}: {q.stem}
                    </p>
                    <p className="text-sm text-gray-700">
                      Your answer: <span className="font-medium">{q.userAnswer || '(no answer)'}</span>
                    </p>
                    {!q.isCorrect && q.type === 'mcq' && (
                      <p className="text-sm text-gray-700">
                        Correct answer: <span className="font-medium text-green-700">{q.answer}</span>
                      </p>
                    )}
                    {!q.isCorrect && q.type === 'calc' && (
                      <p className="text-sm text-gray-700">
                        Correct answer: <span className="font-medium text-green-700">{q.correct} {q.unit}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1 italic">{q.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Learning Path
          </button>
        </div>
      )}
    </div>
  );
}
