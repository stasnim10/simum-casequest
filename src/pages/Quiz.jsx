import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLesson } from '../data/api';
import useStore from '../state/store';
import useModuleProgress from '../hooks/useModuleProgress';
import { track } from '../lib/analytics';

const PASS_THRESHOLD = 0.7;

export default function Quiz() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = getLesson(lessonId);

  const submitQuizAttempt = useStore((state) => state.submitQuizAttempt);
  const retryQuiz = useStore((state) => state.retryQuiz);
  const startLesson = useStore((state) => state.startLesson);
  const logQuizMistake = useStore((state) => state.logQuizMistake);
  const lessonProgress = useStore((state) => state.lessonProgress[lessonId]);

  const { nextLessonId, nextLessonState } = useModuleProgress();

  const questions = lesson?.quiz ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('quiz'); // quiz | result
  const [score, setScore] = useState(0);
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    if (lessonId) {
      startLesson(lessonId);
    }
  }, [lessonId, startLesson]);

  const totalQuestions = questions.length;

  useEffect(() => {
    if (lessonProgress?.quizPassed && stage !== 'result') {
      setStage('result');
      setScore(lessonProgress.quizScore ?? totalQuestions);
    }
  }, [lessonProgress?.quizPassed, lessonProgress?.quizScore, stage, totalQuestions]);

  const currentQuestion = questions[currentIndex];
  const hasFeedback = Boolean(feedback);
  const answeredCount = Object.keys(answers).length;
  const passed = useMemo(() => (totalQuestions > 0 ? score / totalQuestions >= PASS_THRESHOLD : false), [score, totalQuestions]);

  useEffect(() => {
    if (stage === 'result' && passed) {
      if (confettiFired) return;
      setConfettiFired(true);
      const colors = ['#6366f1', '#8b5cf6', '#3b82f6'];
      confetti({
        particleCount: 100,
        spread: 70,
        startVelocity: 35,
        gravity: 0.8,
        origin: { y: 0.6 },
        colors
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          decay: 0.9,
          scalar: 0.9,
          origin: { y: 0.3 },
          colors
        });
      }, 250);
      return () => clearTimeout(timeout);
    }
    if (confettiFired) {
      setConfettiFired(false);
    }
    return undefined;
  }, [stage, passed, confettiFired]);

  if (!lesson || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-100 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border border-indigo-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Quiz not available</h1>
          <p className="mt-2 text-sm text-gray-600">
            We don&apos;t have quiz questions for this learning module yet. Please head back to the learning modules path.
          </p>
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Return to learning modules
          </button>
        </div>
      </div>
    );
  }

  const nextUpLessonId = nextLessonId && nextLessonId !== lessonId ? nextLessonId : null;

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      setError('Pick the option that feels best before checking.');
      return;
    }

    setError('');
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        selected: selectedOption,
        correct: isCorrect
      }
    };
    setAnswers(updatedAnswers);
    setFeedback({
      correct: isCorrect,
      explanation: currentQuestion.explanation
    });
    if (!isCorrect) {
      const selectedValue = currentQuestion.options?.[selectedOption] ?? selectedOption;
      const correctValue = currentQuestion.options?.[currentQuestion.correctAnswer] ?? currentQuestion.correctAnswer;
      logQuizMistake({
        lessonId,
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        selectedAnswer: selectedValue,
        correctAnswer: correctValue
      });
    }
    track('quiz_question_answered', {
      lessonId,
      questionId: currentQuestion.id,
      correct: isCorrect
    });
  };

  const handleNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    setFeedback(null);
    setSelectedOption(null);

    if (nextIndex < totalQuestions) {
      setCurrentIndex(nextIndex);
      return;
    }

    const finalScore = Object.values(answers).reduce(
      (total, entry) => total + (entry.correct ? 1 : 0),
      0
    );
    const passedQuiz = totalQuestions > 0 ? finalScore / totalQuestions >= PASS_THRESHOLD : false;
    setScore(finalScore);
    setStage('result');
    submitQuizAttempt(lessonId, { score: finalScore, totalQuestions });
    track('quiz_completed', {
      lessonId,
      score: finalScore,
      totalQuestions,
      passed: passedQuiz
    });
  };

  const resetQuizState = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setFeedback(null);
    setError('');
    setScore(0);
    setStage('quiz');
  };

  const handleRetry = () => {
    retryQuiz(lessonId);
    resetQuizState();
    track('quiz_retry', { lessonId });
  };

  const handleReviewLesson = () => {
    track('quiz_review_lesson', { lessonId });
    navigate(`/lesson/${lessonId}`);
  };

  const handleReturnToLearning = () => {
    const celebration = passed
      ? {
          lessonTitle: lesson.title,
          xpAwarded: 5,
          completedAt: new Date().toISOString()
        }
      : null;

    if (celebration) {
      navigate('/learn', { state: { celebration } });
    } else {
      navigate('/learn');
    }
  };

  const handleGoToNextLesson = () => {
    if (nextUpLessonId) {
      const targetStatus = nextLessonState?.status;
      if (targetStatus === 'quiz_pending') {
        navigate(`/quiz/${nextUpLessonId}`);
      } else {
        navigate(`/lesson/${nextUpLessonId}`);
      }
    } else {
      navigate('/simulator');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-100 px-4 pb-24 pt-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to learning modules
          </button>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            <Sparkles className="h-4 w-4" />
            Milo quiz
          </span>
        </div>

        <header className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">Learning module quiz</p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{lesson.title}</h1>
          <p className="mt-3 text-sm text-gray-600">
            {stage === 'quiz'
              ? 'Three quick questions to celebrate what you just learned.'
              : passed
              ? 'You can jump back into the learning path whenever you are ready.'
              : 'Review the notes or retry—every attempt strengthens your toolkit.'}
          </p>
        </header>

        {stage === 'quiz' ? (
          <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span>
                {answeredCount}/{totalQuestions} answered
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = hasFeedback && idx === currentQuestion.correctAnswer;
                  const isIncorrectSelection = hasFeedback && isSelected && !isCorrectOption;

                  const baseClass =
                    'w-full rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-300';
                  let stateClass = 'border-gray-200 hover:border-indigo-200';

                  if (isSelected && !hasFeedback) {
                    stateClass = 'border-indigo-400 bg-indigo-50 text-indigo-700';
                  }
                  if (isCorrectOption) {
                    stateClass = 'border-emerald-300 bg-emerald-50 text-emerald-700';
                  }
                  if (isIncorrectSelection) {
                    stateClass = 'border-rose-300 bg-rose-50 text-rose-700';
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (hasFeedback) return;
                        setSelectedOption(idx);
                        setError('');
                      }}
                      className={`${baseClass} ${stateClass}`}
                      disabled={hasFeedback}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>

              {error && <p className="text-sm text-rose-500">{error}</p>}

              {hasFeedback ? (
                <div
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                    feedback.correct
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {feedback.correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <div>
                    <p className="font-semibold">
                      {feedback.correct ? 'Nice! You nailed it.' : 'Almost there—here’s the nudge you need.'}
                    </p>
                    <p className="mt-1 leading-relaxed">{feedback.explanation}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end">
              {hasFeedback ? (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  {currentIndex === totalQuestions - 1 ? 'See results' : 'Next question'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Check answer
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              {passed ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Sparkles className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">Quiz summary</p>
                <h2 className="text-xl font-semibold text-gray-900">
                  {passed ? `Great job! You’ve mastered ${lesson.title}.` : 'Almost there! Let’s keep the momentum.'}
                </h2>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-indigo-900">
              <p>
                Score: <span className="font-semibold">{score}</span> out of {totalQuestions}{' '}
                ({totalQuestions ? Math.round((score / totalQuestions) * 100) : 0}%)
              </p>
              <p className="mt-1 text-indigo-700">
                {passed
                  ? 'Milo: “Streak saved and XP earned—let’s carry this confidence forward!”'
                  : 'Milo: “Try once more or revisit the lesson. Every pass makes your map clearer.”'}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {passed ? (
                <>
                  <button
                    type="button"
                    onClick={handleReturnToLearning}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Back to learning modules
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToNextLesson}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    {nextUpLessonId ? 'Continue your journey' : 'Open the simulator'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Retry quiz
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReviewLesson}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    Review lesson
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReturnToLearning}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Back to learning modules
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
