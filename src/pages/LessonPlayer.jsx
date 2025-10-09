import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import useStore from '../state/store';
import { getLesson } from '../data/api';

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startLesson, completeLesson, lessonProgress } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  const lesson = getLesson(id);
  const progress = lessonProgress[id];

  useEffect(() => {
    if (lesson) {
      startLesson(id);
    }
  }, [id, lesson, startLesson]);

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p>Lesson not found</p>
      </div>
    );
  }

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

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
      return Math.abs(num - question.correct) <= question.tolerance;
    }
    return false;
  };

  const handleSubmit = () => {
    const correct = lesson.quiz.filter(q => 
      checkAnswer(q, answers[q.id])
    ).length;
    
    completeLesson(id, { correct, total: lesson.quiz.length });
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentQuestion < lesson.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = lesson.quiz[currentQuestion];
  const userAnswer = answers[question.id];
  const isCorrect = showResults ? checkAnswer(question, userAnswer) : null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Learning Path
      </button>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{lesson.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Question {currentQuestion + 1} of {lesson.quiz.length}
            </p>
          </div>
          {progress && (
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < progress.crownLevel ? 'text-yellow-500' : 'text-gray-300'}>
                  👑
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Objectives:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {lesson.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-lg mb-4">{question.stem}</p>
            
            {question.type === 'mcq' && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(question.id, option)}
                    disabled={showResults}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      userAnswer === option
                        ? showResults
                          ? isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'fill' && (
              <input
                type="text"
                value={userAnswer || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                disabled={showResults}
                placeholder="Type your answer..."
                className={`w-full p-3 border-2 rounded-lg ${
                  showResults
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
            )}

            {question.type === 'calc' && (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={userAnswer || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  disabled={showResults}
                  placeholder="Enter number..."
                  className={`flex-1 p-3 border-2 rounded-lg ${
                    showResults
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-lg">
                  {question.unit}
                </span>
              </div>
            )}

            {showResults && (
              <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-600">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-700">{question.rationale}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentQuestion < lesson.quiz.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Next Question
            </button>
          ) : !showResults ? (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Submit Lesson
            </button>
          ) : (
            <button
              onClick={() => navigate('/learn')}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Back to Learning Path
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
