import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lightbulb, Mic, Sparkles, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../state/store';
import { track } from '../lib/analytics';
import MiloExplains from './MiloExplains';

const MotionStep = motion.div;

const recognize = () => {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SpeechRecognition ? new SpeechRecognition() : null;
};

function normalizeNumber(answer) {
  if (answer === undefined || answer === null) return null;
  const num = Number(answer.toString().replace(/[,\s]/g, ''));
  return Number.isFinite(num) ? num : null;
}

export default function MicroLesson({ lesson, lessonId }) {
  const navigate = useNavigate();
  const startLesson = useStore((state) => state.startLesson);
  const markLessonContentComplete = useStore((state) => state.markLessonContentComplete);

  const steps = lesson.microLesson || [];
  const [index, setIndex] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);

  const current = steps[index];

  // Practice state
  const [practiceValue, setPracticeValue] = useState('');
  const [practiceResult, setPracticeResult] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Recap state
  const [recapIndex, setRecapIndex] = useState(0);
  const [recapResults, setRecapResults] = useState([]);
  const [recapFeedback, setRecapFeedback] = useState(null);

  const recognitionRef = useRef(null);
  const hasVoice = useMemo(() => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window), []);
  const currentStepLabel = current?.title || current?.type || 'unknown';

  useEffect(() => {
    startLesson(lessonId);
    track('micro_lesson_started', { lessonId });
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop?.();
        recognitionRef.current = null;
      }
    };
  }, [lessonId, startLesson]);

  // Reset step-specific state when screen changes
  useEffect(() => {
    setPracticeValue('');
    setPracticeResult(null);
    setShowHint(false);
    setRecapFeedback(null);
    setRecapIndex(0);
    if (current?.type === 'recap') {
      setRecapResults([]);
    }
  }, [index, current]);

  const goNext = () => {
    if (index < steps.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const startVoiceCapture = () => {
    if (!hasVoice) return;
    if (!recognitionRef.current) {
      recognitionRef.current = recognize();
      if (recognitionRef.current) {
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setPracticeValue(transcript.trim());
          }
        };
      }
    }
    try {
      recognitionRef.current?.start();
      track('micro_voice_capture_started', { lessonId, step: currentStepLabel });
    } catch (err) {
      console.debug('Voice capture already active', err);
    }
  };

  const stopVoiceCapture = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop?.();
      track('micro_voice_capture_stopped', { lessonId, step: currentStepLabel });
    }
  };

  const handleCheckPractice = (overrideValue) => {
    if (!current) return;
    const { input, answer, tolerance = 0, feedbackCorrect, feedbackIncorrect } = current;
    const valueToUse = overrideValue ?? practiceValue;
    let correct = false;

    if (input === 'number' || input === 'calc') {
      const expected = normalizeNumber(answer);
      const given = normalizeNumber(valueToUse);
      if (expected !== null && given !== null && Math.abs(given - expected) <= tolerance) {
        correct = true;
      }
    } else if (input === 'text') {
      correct = true;
    } else if (input === 'mcq') {
      correct = valueToUse === answer;
    } else {
      correct = valueToUse.toString().trim().toLowerCase() === (answer ?? '').toString().trim().toLowerCase();
    }

    if (correct) {
      setPracticeResult({ status: 'correct', message: feedbackCorrect || 'Nice work!' });
      track('micro_practice_correct', {
        lessonId,
        step: current.title,
        inputType: input,
        valueLength: valueToUse?.toString().length || 0
      });
    } else {
      setPracticeResult({ status: 'incorrect', message: feedbackIncorrect || 'Almost there—try again.' });
      track('micro_practice_incorrect', {
        lessonId,
        step: current.title,
        inputType: input,
        valueLength: valueToUse?.toString().length || 0
      });
    }
  };

  const handleRecapAnswer = (question, value) => {
    let correct = false;
    if (question.type === 'mcq') {
      correct = value === question.answer;
    } else if (question.type === 'calc') {
      const expected = normalizeNumber(question.answer);
      const given = normalizeNumber(value);
      correct = expected !== null && given !== null && Math.abs(given - expected) <= (question.tolerance || 0);
    } else {
      correct = value.toString().trim().toLowerCase() === question.answer.toString().trim().toLowerCase();
    }

    const feedback = correct ? question.feedbackCorrect : question.feedbackIncorrect;
    setRecapResults((prev) => [...prev, { question, value, correct }]);
    setRecapFeedback({ correct, message: feedback });
    track('micro_recap_answered', { lessonId, correct, prompt: question.prompt });
    if (recapIndex < (current.questions?.length || 0) - 1) {
      setTimeout(() => {
        setRecapFeedback(null);
        setRecapIndex((prev) => prev + 1);
      }, 900);
    }
  };

  const handleFinishLesson = () => {
    if (!lessonFinished) {
      markLessonContentComplete(lessonId);
      track('micro_lesson_completed', { lessonId, mode: 'content' });
      setLessonFinished(true);
    }
    navigate(`/quiz/${lessonId}`);
  };

  if (!current) {
    return null;
  }

  const toggleHintVisibility = () => {
    if (!current) return;
    setShowHint((prev) => {
      const next = !prev;
      track('micro_practice_hint_toggled', {
        lessonId,
        step: currentStepLabel,
        showing: next
      });
      return next;
    });
  };

  const renderKeyTerms = () => {
    if (!current?.keyTerms?.length) return null;
    return (
      <div className="space-y-3">
        {current.keyTerms.map((term) => (
          <MiloExplains
            key={term.term}
            term={term.term}
            definition={term.definition}
            label={term.label || 'Milo explains'}
          />
        ))}
      </div>
    );
  };

  const renderPracticeInput = () => {
    if (current.input === 'mcq') {
      return (
        <div className="space-y-2">
          {current.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setPracticeValue(option);
                handleCheckPractice(option);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                practiceResult?.status === 'correct' && option === current.answer
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : practiceValue === option
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white hover:border-indigo-200'
              }`}
            >
              {option}
            </button>
          ))}
          {current.hint && (
            <button
              type="button"
              onClick={toggleHintVisibility}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
          )}
          {showHint && current.hint && (
            <p className="text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">{current.hint}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            value={practiceValue}
            onChange={(e) => setPracticeValue(e.target.value)}
            placeholder={current.input === 'number' ? 'Enter a number' : 'Type your answer'}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            inputMode={current.input === 'number' || current.input === 'calc' ? 'numeric' : 'text'}
          />
          {hasVoice && (
            <button
              type="button"
              onMouseDown={startVoiceCapture}
              onMouseUp={stopVoiceCapture}
              onTouchStart={startVoiceCapture}
              onTouchEnd={stopVoiceCapture}
              className="p-3 rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCheckPractice}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            {current.input === 'text' ? 'Save reflection' : 'Check answer'}
          </button>
          {current.hint && (
            <button
              type="button"
              onClick={toggleHintVisibility}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
          )}
        </div>
        {showHint && current.hint && (
          <p className="text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">{current.hint}</p>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (current.type === 'practice') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{current.title}</h2>
          <p className="text-gray-700 leading-relaxed">{current.content}</p>
        </div>
        <div className="text-3xl" aria-hidden>{current.visual}</div>
        {renderKeyTerms()}
        {renderPracticeInput()}
        {practiceResult && (
            <div
              className={`rounded-2xl border p-4 text-sm leading-relaxed ${
                practiceResult.status === 'correct'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-orange-200 bg-orange-50 text-orange-700'
              }`}
            >
              {practiceResult.message}
            </div>
          )}
          {practiceResult?.status === 'correct' && index < steps.length - 1 && (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      );
    }

    if (current.type === 'recap') {
      const questions = current.questions || [];
      const question = questions[recapIndex];
      const allDone = recapResults.length === questions.length;

      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{current.title}</h2>
          <div className="text-3xl" aria-hidden>{current.visual}</div>
          {!allDone && question && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Question {recapIndex + 1} of {questions.length}</p>
              <p className="text-gray-700 leading-relaxed">{question.prompt}</p>
              {question.type === 'mcq' ? (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleRecapAnswer(question, option)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-200"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <RecapInput
                  question={question}
                  onSubmit={(value) => handleRecapAnswer(question, value)}
                />
              )}
              {recapFeedback && (
                <div
                  className={`rounded-2xl border p-4 text-sm leading-relaxed ${
                    recapFeedback.correct
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-orange-200 bg-orange-50 text-orange-700'
                  }`}
                >
                  {recapFeedback.message}
                </div>
              )}
            </div>
          )}
          {allDone && (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-emerald-600">Great job! Quiz complete.</p>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (current.type === 'example') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">{current.title}</h2>
            <p className="text-gray-700 leading-relaxed">{current.example?.prompt}</p>
          </div>
          <div className="text-3xl" aria-hidden>{current.visual}</div>
          {current.example?.dialogue?.length ? (
            <div className="space-y-2 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-indigo-900">
              {current.example.dialogue.map((line, idx) => (
                <p key={idx} className="leading-relaxed">
                  <span className="font-semibold">{line.speaker}:</span> {line.line}
                </p>
              ))}
            </div>
          ) : null}
          {current.example?.steps?.length ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">How it flows</p>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                {current.example.steps.map((step, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{step.label}</span>
                    {step.detail ? ` — ${step.detail}` : ''}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {current.takeaway ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
              {current.takeaway}
            </div>
          ) : null}
          {renderKeyTerms()}
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-indigo-600 font-semibold">
          <Sparkles className="w-5 h-5" />
          <span>{current.title}</span>
        </div>
        <p className="text-gray-700 leading-relaxed">{Array.isArray(current.content) ? current.content.join('\n') : current.content}</p>
        <div className="text-3xl" aria-hidden>{current.visual}</div>
        {renderKeyTerms()}
        {index < steps.length - 1 && (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  const atLastStep = index === steps.length - 1;

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 bg-gradient-to-br from-slate-50 via-white to-indigo-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to learning modules
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>{lesson.title}</span>
            <span>Step {index + 1} of {steps.length}</span>
          </div>
          <AnimatePresence mode="wait">
            <MotionStep
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="space-y-5"
            >
              {renderContent()}
              <p className="text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                Coach Milo: {current.milo}
              </p>
            </MotionStep>
          </AnimatePresence>
        </div>

        {atLastStep && (
          <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-indigo-100 border border-emerald-200 rounded-3xl p-6 text-center space-y-3">
            <p className="text-lg font-semibold text-emerald-700">You finished {lesson.title}!</p>
            <p className="text-sm text-emerald-600">Milo: “Badge unlocked and XP earned. Ready for the next lesson?”</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={handleFinishLesson}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
              >
                Finish lesson
              </button>
              <button
                type="button"
                onClick={() => {
                  setIndex(0);
                  setLessonFinished(false);
                  setPracticeValue('');
                  setPracticeResult(null);
                  setRecapResults([]);
                  setRecapIndex(0);
                  setRecapFeedback(null);
                  track('micro_lesson_replayed', { lessonId });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <RefreshCcw className="w-4 h-4" />
                Replay lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecapInput({ question, onSubmit }) {
  const [value, setValue] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="space-y-3"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={question.placeholder || 'Type your answer'}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
        inputMode={question.type === 'calc' ? 'numeric' : 'text'}
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  );
}
