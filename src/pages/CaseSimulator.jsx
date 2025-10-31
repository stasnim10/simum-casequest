import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Download, Lightbulb, RefreshCcw, XCircle } from 'lucide-react';
import { track } from '../lib/analytics';
import { getSimulatorCase } from '../data/api';

const DEFAULT_CASE_SLUG = 'profitability-case-1';

const primaryButtonClass = 'inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed';
const secondaryButtonClass = 'inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed';

const stepRegistry = {
  prompt: PromptStep,
  recap: RecapStep,
  clarifying: ClarifyingStep,
  framework: FrameworkStep,
  hypothesis: HypothesisStep,
  analysis: AnalysisStep,
  recommendation: RecommendationStep,
  feedback: FeedbackStep
};

export default function CaseSimulator() {
  const { caseSlug } = useParams();
  const navigate = useNavigate();
  const slug = caseSlug ?? DEFAULT_CASE_SLUG;
  const caseData = useMemo(() => getSimulatorCase(slug), [slug]);

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [caseCompleted, setCaseCompleted] = useState(false);

  useEffect(() => {
    if (!caseData) return;
    setResponses({});
    setCompletedSteps({});
    setActiveStepIdx(0);
    setCaseCompleted(false);
    track('simulator_case_started', { caseId: caseData.id });
  }, [caseData]);

  useEffect(() => {
    if (!caseData) return;
    const step = caseData.steps[activeStepIdx];
    if (!step) return;
    track('simulator_step_viewed', { caseId: caseData.id, stepId: step.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [caseData, activeStepIdx]);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-2">Case not found</h2>
          <p className="text-gray-600 mb-6">The simulator case you requested does not exist yet.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={primaryButtonClass}
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  const steps = caseData.steps;
  const currentStep = steps[activeStepIdx];
  const StepComponent = stepRegistry[currentStep.type] ?? UnknownStep;

  const handleStepChange = (stepId, value) => {
    setResponses((prev) => ({ ...prev, [stepId]: value }));
  };

  const handleStepComplete = (stepId, value) => {
    setResponses((prev) => ({
      ...prev,
      [stepId]: value !== undefined ? value : prev[stepId]
    }));
    setCompletedSteps((prev) => ({ ...prev, [stepId]: true }));

    const nextIdx = Math.min(activeStepIdx + 1, steps.length - 1);
    track('simulator_step_completed', { caseId: caseData.id, stepId });

    if (nextIdx !== activeStepIdx) {
      setActiveStepIdx(nextIdx);
      if (nextIdx === steps.length - 1 && !caseCompleted) {
        track('simulator_case_completed', { caseId: caseData.id });
        setCaseCompleted(true);
      }
    }
  };

  const handleBack = () => {
    if (activeStepIdx === 0) return;
    const fromStep = steps[activeStepIdx]?.id;
    setActiveStepIdx((prev) => Math.max(prev - 1, 0));
    if (fromStep) {
      track('simulator_step_back', { caseId: caseData.id, fromStep });
    }
  };

  const handleRestart = () => {
    setResponses({});
    setCompletedSteps({});
    setActiveStepIdx(0);
    setCaseCompleted(false);
    track('simulator_case_restarted', { caseId: caseData.id });
  };

  const handleExit = () => {
    track('simulator_case_exit', { caseId: caseData.id });
    navigate('/learn');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white shadow-sm rounded-3xl border border-indigo-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">
                {caseData.category} Simulator
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{caseData.title}</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">{caseData.description}</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 text-sm text-indigo-700">
              <p className="font-semibold">Step {activeStepIdx + 1} of {steps.length}</p>
              <p>{currentStep.title}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex-1 h-2 bg-gray-100 rounded-full mr-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                style={{ width: `${((activeStepIdx) / (steps.length - 1 || 1)) * 100}%` }}
              />
            </div>
            <div className="flex gap-2">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    idx === activeStepIdx
                      ? 'bg-indigo-600 text-white'
                      : completedSteps[step.id]
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-white/40 p-8">
          <StepComponent
            step={currentStep}
            value={responses[currentStep.id]}
            onChange={(value) => handleStepChange(currentStep.id, value)}
            onContinue={(value) => handleStepComplete(currentStep.id, value)}
            responses={responses}
            caseData={caseData}
            caseId={caseData.id}
            onRestart={handleRestart}
            onExit={handleExit}
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={activeStepIdx === 0}
            className={`${secondaryButtonClass} ${activeStepIdx === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {currentStep.type !== 'feedback' && (
            <p className="text-sm text-gray-500">
              Continue using the button on each card when you are ready.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PromptStep({ step, onContinue, caseId }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{step.body}</p>
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => {
            track('simulator_prompt_acknowledged', { caseId });
            onContinue({ acknowledged: true });
          }}
          className={primaryButtonClass}
        >
          {step.cta || 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function RecapStep({ step, value, onChange, onContinue, caseId }) {
  const [error, setError] = useState('');
  const recapText = value ?? '';

  const handleContinue = () => {
    if (!recapText || recapText.trim().length < 15) {
      setError('Capture at least one or two sentences so you can reference them later.');
      return;
    }
    setError('');
    track('simulator_recap_recorded', { caseId, length: recapText.trim().length });
    onContinue(recapText.trim());
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h2>
      <p className="text-gray-600 mb-4">{step.prompt}</p>
      <textarea
        value={recapText}
        onChange={(e) => {
          setError('');
          onChange(e.target.value);
        }}
        rows={6}
        placeholder={step.placeholder}
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
      />
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleContinue} className={primaryButtonClass}>
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ClarifyingStep({ step, value, onChange, onContinue, caseId }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const asked = value ?? [];

  const normalize = (text = '') =>
    text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

  const handleAsk = (rawQuestion) => {
    const questionText = rawQuestion?.toString().trim();
    if (!questionText) {
      setError('Type or select a question first.');
      return;
    }
    if (asked.length >= step.maxQuestions) {
      setError(`You already used all ${step.maxQuestions} clarifying questions.`);
      return;
    }

    const normalized = normalize(questionText);
    const match = step.questions.find((q) => {
      const phrases = [q.question, ...(q.acceptedPhrases || [])];
      return phrases.some((phrase) => {
        const normalizedPhrase = normalize(phrase);
        return (
          normalized === normalizedPhrase ||
          normalized.includes(normalizedPhrase) ||
          normalizedPhrase.includes(normalized)
        );
      });
    });

    if (match && asked.some((item) => item.id === match.id)) {
      setError('You already asked that question.');
      return;
    }

    const entry = match
      ? {
          id: match.id,
          question: match.question,
          userQuestion: questionText,
          answer: match.answer,
          matched: true
        }
      : {
          id: `custom-${Date.now()}`,
          question: questionText,
          userQuestion: questionText,
          answer: step.fallbackAnswer,
          matched: false
    };

    const updated = [...asked, entry];
    onChange(updated);
    track('simulator_clarifying_question', {
      caseId,
      question: questionText,
      answerId: entry.matched ? entry.id : null,
      matched: entry.matched
    });
    setInput('');
    setError('');
  };

  const handleContinue = () => {
    if (!asked.length) {
      setError('Ask at least one clarifying question to move on.');
      return;
    }
    setError('');
    track('simulator_clarifying_continue', { caseId, questionsAsked: asked.length });
    onContinue(asked);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h2>
      <p className="text-gray-600 mb-6">{step.prompt}</p>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2 text-indigo-700 text-sm font-medium">
          <Lightbulb className="w-4 h-4" />
          {step.suggestionLabel || 'Suggested'}
        </div>
        <div className="flex flex-wrap gap-2">
          {step.questions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => handleAsk(q.question)}
              className="px-3 py-2 rounded-full bg-white border border-indigo-200 text-sm text-indigo-700 hover:border-indigo-400"
            >
              {q.question}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ask another question
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setError('');
              setInput(e.target.value);
            }}
            placeholder="Type a clarifying question..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={() => handleAsk(input)}
            className={`${secondaryButtonClass} md:self-start`}
          >
            Ask
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {step.maxQuestions - asked.length} question(s) remaining.
        </p>
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      {!!asked.length && (
        <div className="mt-6 space-y-4">
          {asked.map((item) => (
            <div key={item.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">You asked</p>
              <p className="text-gray-800">{item.userQuestion}</p>
              <div className="mt-3 rounded-xl bg-white border border-indigo-100 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">
                  Case info
                </p>
                <p className="text-gray-700 mt-1">{item.answer}</p>
                {!item.matched && (
                  <p className="text-xs text-gray-500 mt-2">
                    We don't have that detail - try reframing toward revenues, costs, competition, or customers.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleContinue} className={primaryButtonClass}>
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function FrameworkStep({ step, value, onChange, onContinue, caseId }) {
  const [expanded, setExpanded] = useState({});
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');
  const state = value ?? { buckets: {}, customBuckets: [] };

  const toggleBucket = (bucketId, isCustom = false) => {
    if (isCustom) {
      const target = state.customBuckets.find((bucket) => bucket.id === bucketId);
      const nextSelected = !target?.selected;
      const updated = {
        ...state,
        customBuckets: state.customBuckets.map((bucket) =>
          bucket.id === bucketId ? { ...bucket, selected: !bucket.selected } : bucket
        )
      };
      onChange(updated);
      track('simulator_framework_bucket_toggled', {
        caseId,
        bucketId,
        isCustom: true,
        selected: nextSelected
      });
    } else {
      const nextSelected = !state.buckets?.[bucketId]?.selected;
      const updated = {
        ...state,
        buckets: {
          ...state.buckets,
          [bucketId]: {
            selected: !state.buckets?.[bucketId]?.selected,
            subBuckets: state.buckets?.[bucketId]?.subBuckets || [],
            notes: state.buckets?.[bucketId]?.notes || ''
          }
        }
      };
      onChange(updated);
      track('simulator_framework_bucket_toggled', {
        caseId,
        bucketId,
        isCustom: false,
        selected: nextSelected
      });
    }
  };

  const toggleSubBucket = (bucketId, subId) => {
    const current = state.buckets?.[bucketId] || { selected: false, subBuckets: [], notes: '' };
    const exists = current.subBuckets?.includes(subId);
    const subBuckets = exists
      ? current.subBuckets.filter((item) => item !== subId)
      : [...(current.subBuckets || []), subId];
    onChange({
      ...state,
      buckets: {
        ...state.buckets,
        [bucketId]: {
          ...current,
          selected: true,
          subBuckets
        }
      }
    });
    track('simulator_framework_subbucket_toggled', {
      caseId,
      bucketId,
      subBucketId: subId,
      selected: !exists
    });
  };

  const updateNotes = (bucketId, notes, isCustom = false) => {
    if (isCustom) {
      onChange({
        ...state,
        customBuckets: state.customBuckets.map((bucket) =>
          bucket.id === bucketId ? { ...bucket, notes } : bucket
        )
      });
    } else {
      onChange({
        ...state,
        buckets: {
          ...state.buckets,
          [bucketId]: {
            ...state.buckets?.[bucketId],
            selected: true,
            notes,
            subBuckets: state.buckets?.[bucketId]?.subBuckets || []
          }
        }
      });
    }
  };

  const handleAddCustom = () => {
    if (!customName.trim()) {
      setError('Name your custom bucket before adding it.');
      return;
    }
    if (state.customBuckets.some((bucket) => bucket.label.toLowerCase() === customName.trim().toLowerCase())) {
      setError('That custom bucket already exists.');
      return;
    }
    const newBucket = {
      id: `custom-${Date.now()}`,
      label: customName.trim(),
      selected: true,
      notes: '',
      subBuckets: []
    };
    onChange({
      ...state,
      customBuckets: [...state.customBuckets, newBucket]
    });
    setCustomName('');
    setError('');
    track('simulator_framework_custom_added', {
      caseId,
      label: newBucket.label
    });
  };

  const selectedCount =
    Object.values(state.buckets || {}).filter((bucket) => bucket.selected).length +
    (state.customBuckets || []).filter((bucket) => bucket.selected).length;

  const handleContinue = () => {
    if (selectedCount < (step.minBuckets || 1)) {
      setError(`Select at least ${step.minBuckets} main buckets to cover the problem fully.`);
      return;
    }
    setError('');
    track('simulator_framework_continue', { caseId, selectedBuckets: selectedCount });
    onContinue(state);
  };

  const renderBucket = (bucket, isCustom = false) => {
    const isSelected = isCustom ? bucket.selected : Boolean(state.buckets?.[bucket.id]?.selected);
    const isExpanded = expanded[bucket.id] ?? isSelected;
    const notesValue = isCustom ? bucket.notes : state.buckets?.[bucket.id]?.notes || '';
    const subSelections = isCustom ? [] : state.buckets?.[bucket.id]?.subBuckets || [];

    return (
      <div
        key={bucket.id}
        className={`border rounded-2xl p-4 transition ${isSelected ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-white'}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleBucket(bucket.id, isCustom)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <p className="text-lg font-semibold text-gray-800">{bucket.label}</p>
            </div>
            {bucket.helperText && (
              <p className="text-sm text-gray-500 mt-1">{bucket.helperText}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [bucket.id]: !isExpanded }))
            }
            className="text-gray-500 hover:text-gray-800"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {!isCustom && bucket.subBuckets?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {bucket.subBuckets.map((sub) => {
                  const checked = subSelections.includes(sub.id);
                  return (
                    <label
                      key={sub.id}
                      className={`inline-flex items-center gap-2 px-3 py-2 border rounded-xl text-sm ${
                        checked ? 'border-indigo-500 bg-indigo-100 text-indigo-700' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSubBucket(bucket.id, sub.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                      />
                      {sub.label}
                    </label>
                  );
                })}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                What will you explore here?
              </label>
              <textarea
                rows={3}
                value={notesValue}
                onChange={(e) => updateNotes(bucket.id, e.target.value, isCustom)}
                placeholder="Note hypotheses, analyses, or data pulls for this bucket..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h2>
      <p className="text-gray-600 mb-6">{step.prompt}</p>

      <div className="space-y-4">
        {step.buckets.map((bucket) => renderBucket(bucket))}
        {(state.customBuckets || []).map((bucket) => renderBucket(bucket, true))}
      </div>

      {step.allowCustomBuckets && (
        <div className="mt-6 border border-dashed border-indigo-200 rounded-2xl p-4 bg-indigo-50/40">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {step.customBucketPlaceholder || 'Add a custom bucket'}
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={customName}
              onChange={(e) => {
                setError('');
                setCustomName(e.target.value);
              }}
              placeholder="e.g., Supply Chain, Org & Capabilities"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className={`${secondaryButtonClass} md:self-start`}
            >
              Add bucket
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleContinue} className={primaryButtonClass}>
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function HypothesisStep({ step, value, onChange, onContinue, caseId }) {
  const [error, setError] = useState('');
  const hypothesis = value ?? '';

  const handleContinue = () => {
    if (!step.optional && (!hypothesis || hypothesis.trim().length < 10)) {
      setError('Jot a short hypothesis so you can revisit it later.');
      return;
    }
    setError('');
    const trimmed = hypothesis.trim();
    track('simulator_hypothesis_submitted', {
      caseId,
      provided: Boolean(trimmed),
      length: trimmed.length
    });
    onContinue(trimmed);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h2>
      <p className="text-gray-600 mb-6">
        {step.prompt}
        {step.optional && <span className="text-xs block text-gray-500 mt-1">(Optional - you can skip or refine later.)</span>}
      </p>
      <textarea
        rows={5}
        value={hypothesis}
        onChange={(e) => {
          setError('');
          onChange(e.target.value);
        }}
        placeholder={step.placeholder}
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
      />
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleContinue} className={primaryButtonClass}>
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AnalysisStep({ step, value, onChange, onContinue, caseId }) {
  const [error, setError] = useState('');
  const cards = step.cards || [];
  const state = value ?? { activeCard: 0, responses: {} };
  const [activeCard, setActiveCard] = useState(state.activeCard ?? 0);

  useEffect(() => {
    setActiveCard(state.activeCard ?? 0);
  }, [state.activeCard]);

  if (!cards.length) {
    return <p className="text-gray-600">Analysis cards coming soon.</p>;
  }

  const current = cards[activeCard];
  const cardReaction = state.responses?.[current.id] || { response: '', revealed: false };

  const updateState = (partial) => {
    const merged = {
      ...state,
      ...partial
    };
    onChange(merged);
  };

  const handleResponseChange = (text) => {
    setError('');
    updateState({
      activeCard,
      responses: {
        ...state.responses,
        [current.id]: {
          ...cardReaction,
          response: text
        }
      }
    });
  };

  const handleReveal = () => {
    if (!cardReaction.revealed) {
      track('simulator_analysis_reveal', { caseId, cardId: current.id });
    }
    updateState({
      activeCard,
      responses: {
        ...state.responses,
        [current.id]: {
          ...cardReaction,
          revealed: true
        }
      }
    });
  };

  const handleContinue = () => {
    const missing = cards.filter(
      (card) => !state.responses?.[card.id]?.response?.trim()
    );
    if (missing.length) {
      setError('Add a quick takeaway for each card before moving on.');
      return;
    }
    setError('');
    track('simulator_analysis_continue', {
      caseId,
      answeredCards: cards.length - missing.length,
      totalCards: cards.length
    });
    onContinue({
      ...state,
      activeCard
    });
  };

  const moveCard = (direction) => {
    const nextIndex =
      direction === 'next'
        ? Math.min(activeCard + 1, cards.length - 1)
        : Math.max(activeCard - 1, 0);
    if (nextIndex === activeCard) return;
    setActiveCard(nextIndex);
    updateState({ activeCard: nextIndex });
    track('simulator_analysis_card_navigated', {
      caseId,
      from: cards[activeCard]?.id,
      to: cards[nextIndex]?.id,
      direction
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h2>
      <p className="text-gray-600 mb-6">{step.prompt}</p>

      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-700">
          Data Card {activeCard + 1} of {cards.length}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => moveCard('prev')}
            disabled={activeCard === 0}
            className={`${secondaryButtonClass} ${activeCard === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => moveCard('next')}
            disabled={activeCard === cards.length - 1}
            className={`${secondaryButtonClass} ${activeCard === cards.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="border border-indigo-100 rounded-2xl p-6 bg-indigo-50/50">
        <h3 className="text-xl font-semibold text-indigo-900">{current.title}</h3>
        <ul className="mt-4 space-y-2 text-indigo-800 text-sm">
          {current.summary.map((line, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">{current.question}</p>
        <textarea
          rows={4}
          value={cardReaction.response || ''}
          onChange={(e) => handleResponseChange(e.target.value)}
          placeholder="Capture the likely root causes or next analysis steps..."
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReveal}
            className={`${secondaryButtonClass} ${cardReaction.revealed ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : ''}`}
          >
            {cardReaction.revealed ? 'Model answer shown' : 'Reveal model answer'}
          </button>
        </div>
        {cardReaction.revealed && (
          <div className="mt-4 border border-indigo-100 bg-indigo-50 rounded-2xl p-4 text-sm text-indigo-900 whitespace-pre-line">
            {current.modelAnswer}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleContinue} className={primaryButtonClass}>
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function RecommendationStep({ step, value, onChange, onContinue, caseId }) {
  const [showModel, setShowModel] = useState(false);
  const [error, setError] = useState('');
  const recommendation = value ?? '';

  const handleContinue = () => {
    if (!recommendation || recommendation.trim().length < 25) {
      setError('Draft a structured recommendation before wrapping up.');
      return;
    }
    setError('');
    const trimmed = recommendation.trim();
    track('simulator_recommendation_submitted', {
      caseId,
      length: trimmed.length
    });
    onContinue(trimmed);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h2>
      <p className="text-gray-600 mb-6">{step.prompt}</p>
      <textarea
        rows={8}
        value={recommendation}
        onChange={(e) => {
          setError('');
          onChange(e.target.value);
        }}
        placeholder={step.placeholder}
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={() =>
            setShowModel((prev) => {
              const next = !prev;
              track('simulator_recommendation_example_toggled', { caseId, showing: next });
              return next;
            })
          }
        >
          {showModel ? 'Hide example' : 'View example'}
        </button>
      </div>
      {showModel && (
        <div className="mt-4 border border-indigo-100 bg-indigo-50 rounded-2xl p-4 text-sm text-indigo-900 whitespace-pre-line">
          {step.modelAnswer}
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleContinue} className={primaryButtonClass}>
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function FeedbackStep({ step, responses, onRestart, onExit, caseData, caseId }) {
  const [showNotes, setShowNotes] = useState(false);
  const recap = responses?.['problem-recap'] || '';
  const clarifying = responses?.clarifying || [];
  const framework = responses?.framework || { buckets: {}, customBuckets: [] };
  const hypothesis = responses?.hypothesis || '';
  const analysis = responses?.analysis || { responses: {} };
  const recommendation = responses?.recommendation || '';

  const evaluation = (step.rubric || []).map((rule) =>
    evaluateRubric(rule, { framework, analysis, recap, recommendation })
  );

  const score = Math.round(
    (evaluation.filter((item) => item.passed).length / (evaluation.length || 1)) * 100
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{step.title}</h2>
      <p className="text-gray-600 mb-6">{step.prompt}</p>

      <div className="border border-indigo-100 rounded-3xl p-6 bg-gradient-to-r from-white via-indigo-50 to-purple-50">
        <p className="text-sm uppercase tracking-wide text-indigo-500 font-semibold mb-2">
          Case scorecard
        </p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-4xl font-bold text-indigo-600">{score}%</p>
            <p className="text-sm text-gray-600">
              {evaluation.filter((item) => item.passed).length} of {evaluation.length}{' '}
              rubric checks met
            </p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onRestart} className={secondaryButtonClass}>
              <RefreshCcw className="w-4 h-4" />
              Replay case
            </button>
            <button type="button" onClick={onExit} className={secondaryButtonClass}>
              Finish & return
            </button>
            <button type="button" className={`${secondaryButtonClass} opacity-60 cursor-not-allowed`} disabled>
              <Download className="w-4 h-4" />
              Export notes (soon)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {evaluation.map((item) => (
          <div
            key={item.rule.id}
            className={`border rounded-2xl p-4 flex items-start gap-3 ${
              item.passed ? 'border-emerald-200 bg-emerald-50/60' : 'border-amber-200 bg-amber-50/60'
            }`}
          >
            {item.passed ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
            )}
            <div>
              <p className="font-semibold text-gray-800">{item.rule.label}</p>
              <p className="text-sm text-gray-700 mt-1">{item.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-gray-200 rounded-2xl">
        <button
          type="button"
          onClick={() =>
            setShowNotes((prev) => {
              const next = !prev;
              track('simulator_feedback_notes_toggled', { caseId, showing: next });
              return next;
            })
          }
          className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-700"
        >
          Your notes and answers
          {showNotes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {showNotes && (
          <div className="px-5 pb-6 space-y-6 text-sm text-gray-700">
            <section>
              <p className="font-semibold text-gray-800 mb-1">Recap</p>
              <p>{recap || '--'}</p>
            </section>
            {!!clarifying.length && (
              <section>
                <p className="font-semibold text-gray-800 mb-2">Clarifying questions</p>
                <ul className="space-y-2">
                  {clarifying.map((item) => (
                    <li key={item.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                      <p className="font-medium text-gray-800">{item.userQuestion}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.answer}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section>
              <p className="font-semibold text-gray-800 mb-2">Framework</p>
              <FrameworkSummary framework={framework} caseData={caseData} />
            </section>
            {hypothesis && (
              <section>
                <p className="font-semibold text-gray-800 mb-1">Initial hypothesis</p>
                <p>{hypothesis}</p>
              </section>
            )}
            <section>
              <p className="font-semibold text-gray-800 mb-2">Analysis notes</p>
              {Object.keys(analysis.responses || {}).length === 0 && <p>--</p>}
              <div className="space-y-3">
                {caseData.steps
                  .find((s) => s.id === 'analysis')
                  ?.cards.map((card) => {
                    const entry = analysis.responses?.[card.id];
                    return (
                      <div key={card.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                        <p className="font-semibold text-gray-800">{card.title}</p>
                        <p className="mt-1">{entry?.response || '--'}</p>
                      </div>
                    );
                  })}
              </div>
            </section>
            <section>
              <p className="font-semibold text-gray-800 mb-1">Final recommendation</p>
              <p className="whitespace-pre-line">{recommendation || '--'}</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function FrameworkSummary({ framework, caseData }) {
  const preconfiguredBuckets = caseData.steps.find((s) => s.id === 'framework')?.buckets || [];
  const bucketMap = Object.fromEntries(preconfiguredBuckets.map((bucket) => [bucket.id, bucket.label]));
  const selectedDefaults = Object.entries(framework.buckets || {})
    .filter(([, bucket]) => bucket.selected)
    .map(([id, bucket]) => ({
      id,
      label: bucketMap[id] || id,
      notes: bucket.notes || ''
    }));
  const selectedCustoms = (framework.customBuckets || []).filter((bucket) => bucket.selected);

  if (!selectedDefaults.length && !selectedCustoms.length) {
    return <p>--</p>;
  }

  return (
    <ul className="space-y-2">
      {[...selectedDefaults, ...selectedCustoms].map((bucket) => (
        <li key={bucket.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
          <p className="font-semibold text-gray-800">{bucket.label}</p>
          <p className="text-xs text-gray-500 mt-1">{bucket.notes || 'No notes captured.'}</p>
        </li>
      ))}
    </ul>
  );
}

function UnknownStep({ step }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h2>
      <p className="text-gray-600">This step type is not supported yet.</p>
    </div>
  );
}

function evaluateRubric(rule, context) {
  const { framework, analysis, recap, recommendation } = context;
  const textPool = [
    recap,
    recommendation,
    ...Object.values(analysis.responses || {}).map((entry) => entry?.response || '')
  ]
    .join(' ')
    .toLowerCase();

  if (rule.id === 'coverage') {
    const selectedDefaults = Object.entries(framework.buckets || {}).filter(
      ([, bucket]) => bucket.selected
    );
    const selectedCustoms = (framework.customBuckets || []).filter((bucket) => bucket.selected);
    const selectedIds = new Set([
      ...selectedDefaults.map(([id]) => id),
      ...selectedCustoms.map((bucket) => bucket.id)
    ]);

    const hasRevenueBucket = selectedIds.has('revenue');
    const hasCostBucket = selectedIds.has('costs');

    const hasRevenueKeywords = /revenue|sales|top line|pricing|tickets/.test(textPool);
    const hasCostKeywords = /cost|cogs|margin|expense|rent|labor/.test(textPool);

    const passed =
      (hasRevenueBucket && hasCostBucket) || (hasRevenueKeywords && hasCostKeywords);

    return {
      rule,
      passed,
      message: passed ? rule.success : rule.failure
    };
  }

  if (rule.id === 'competition') {
    const keywords = rule.keywords || [];
    const passed = keywords.some((keyword) => textPool.includes(keyword));
    return {
      rule,
      passed,
      message: passed ? rule.success : rule.failure
    };
  }

  if (rule.id === 'recommendation-structure') {
    const structureKeywords = ['situation', 'findings', 'actions', 'risks', 'next steps'];
    const matches = structureKeywords.filter((keyword) =>
      recommendation.toLowerCase().includes(keyword)
    );
    const passed = matches.length >= 3;
    return {
      rule,
      passed,
      message: passed ? rule.success : rule.failure
    };
  }

  return {
    rule,
    passed: false,
    message: rule.failure
  };
}
