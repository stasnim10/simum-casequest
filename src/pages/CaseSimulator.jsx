import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import useStore from '../state/store';
import useCaseFeedback from '../hooks/useCaseFeedback';
import FeedbackPanel from '../components/FeedbackPanel';
import VoiceBar from '../components/VoiceBar';
import { track } from '../lib/analytics';
import { getAllCases } from '../data/api';
import { suggestFollowups } from '../lib/voiceFollowups';
import { speak, cancelSpeech, pauseSpeech, resumeSpeech, hasTTSSupport } from '../lib/voiceTTS';

const steps = [
  { id: 0, title: 'Clarifying Questions', desc: 'Ask questions to understand the problem' },
  { id: 1, title: 'Hypothesis', desc: 'State your initial hypothesis' },
  { id: 2, title: 'Framework', desc: 'Choose your analysis structure' },
  { id: 3, title: 'Quantitative Analysis', desc: 'Analyze the numbers' },
  { id: 4, title: 'Recommendation', desc: 'Provide your final recommendation' }
];

export default function CaseSimulator() {
  const { addXP, user, setUser } = useStore();
  const { loading, data, error, requestFeedback } = useCaseFeedback();
  const [activeStep, setActiveStep] = useState(0);
  const [currentCase] = useState(getAllCases()[0]);
  const [answers, setAnswers] = useState({
    clarifying: ['', '', ''],
    hypothesis: '',
    structure: '',
    quant: {},
    recommendation: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const hasSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const voiceEnabled = import.meta.env.VITE_ENABLE_VOICE !== '0';
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceConsent, setVoiceConsent] = useState(() => localStorage.getItem('cq_voice_consent') === '1');
  
  const ttsEnabled = import.meta.env.VITE_ENABLE_TTS !== '0';
  const hasTTS = hasTTSSupport();
  const [ttsMode, setTtsMode] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');

  useEffect(() => {
    track('sim_case_started', { caseId: currentCase.id });
  }, [currentCase.id]);

  const handleVoiceConsent = (checked) => {
    setVoiceConsent(checked);
    localStorage.setItem('cq_voice_consent', checked ? '1' : '0');
  };

  const handleVoiceToggle = (checked) => {
    setVoiceMode(checked);
    if (checked) track('voice_mode_enabled', { caseId: currentCase.id });
  };

  const processTranscript = (full) => {
    track('voice_transcript_captured', { step: activeStep, lengthChars: full.length });
    
    if (activeStep === 0) {
      const sentences = full.split(/[.?!]\s+/).filter(Boolean);
      setAnswers(a => ({...a, clarifying: sentences.slice(0, 3).concat(a.clarifying.slice(sentences.length))}));
    }
    if (activeStep === 1) {
      setAnswers(a => ({...a, hypothesis: full}));
    }
    if (activeStep === 2) {
      const mapStructure = (txt) => {
        const t = txt.toLowerCase();
        if (t.includes('profit')) return 'Profitability';
        if (t.includes('market')) return 'Market Entry';
        if (t.includes('cost')) return 'Cost Optimization';
        return answers.structure || 'Profitability';
      };
      setAnswers(a => ({...a, structure: mapStructure(full)}));
    }
    if (activeStep === 3) {
      const nums = Object.fromEntries(
        Array.from(full.matchAll(/(revenue|cost|margin)\s*[:=]?\s*(\d+(\.\d+)?)/gi))
          .map(m => [m[1].toLowerCase(), m[2]])
      );
      setAnswers(a => ({...a, quant: {...a.quant, ...nums}}));
    }
    if (activeStep === 4) {
      setAnswers(a => ({...a, recommendation: full}));
    }
  };

  const handleTtsToggle = (checked) => {
    setTtsMode(checked);
    if (checked) {
      track('tts_enabled', { caseId: currentCase.id });
    } else {
      cancelSpeech();
      setCurrentSpokenText('');
    }
  };

  const speakFollowups = async () => {
    if (!ttsMode || !hasTTS) return;
    const followups = suggestFollowups({ step: activeStep, answers, caseData: currentCase });
    for (let i = 0; i < followups.length; i++) {
      setCurrentSpokenText(followups[i]);
      speak(followups[i]);
      await new Promise(resolve => setTimeout(resolve, followups[i].length * 50 + 1000));
    }
    setCurrentSpokenText('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.shiftKey) {
        e.preventDefault();
        pauseSpeech();
      }
      if (e.code === 'Enter' && e.shiftKey) {
        e.preventDefault();
        resumeSpeech();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (ttsMode && activeStep < steps.length) {
      speakFollowups();
    }
    return () => cancelSpeech();
  }, [activeStep, ttsMode]);

  const updateAnswer = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const updateClarifying = (index, value) => {
    const newClarifying = [...answers.clarifying];
    newClarifying[index] = value;
    updateAnswer('clarifying', newClarifying);
  };

  const updateQuant = (key, value) => {
    updateAnswer('quant', { ...answers.quant, [key]: value });
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const result = await requestFeedback({
      userId: user?.id || 'demo',
      caseId: currentCase.id,
      steps: answers
    });
    
    if (result) {
      track('ai_feedback_received', { caseId: currentCase.id, cached: !!result.cached });
      const xpGain = result.scorecard?.overall ? parseInt(result.scorecard.overall) * 10 : 50;
      addXP(xpGain);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setAnswers({
      clarifying: ['', '', ''],
      hypothesis: '',
      structure: '',
      quant: {},
      recommendation: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-3xl font-bold">Case Simulator</h2>
            <div className="flex gap-4">
              {voiceEnabled && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={voiceMode}
                    onChange={(e) => handleVoiceToggle(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Voice Input</span>
                </label>
              )}
              {ttsEnabled && hasTTS && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttsMode}
                    onChange={(e) => handleTtsToggle(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Voice Output</span>
                  {ttsMode ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </label>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{currentCase.title}</h3>
            <p className="text-gray-600">{currentCase.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between mb-2">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex-1 text-center">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  idx <= activeStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx < activeStep ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                <p className="text-xs mt-1 hidden md:block">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Spoken Text Subtitle */}
        {ttsMode && currentSpokenText && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600 animate-pulse" />
              <p className="text-sm text-blue-900 italic">{currentSpokenText}</p>
            </div>
            <p className="text-xs text-blue-600 mt-1">Shift+Space to pause • Shift+Enter to resume</p>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6"
          >
            <h3 className="text-xl font-semibold mb-4">{steps[activeStep].title}</h3>
            <p className="text-gray-600 mb-6">{steps[activeStep].desc}</p>

            {/* Voice Consent */}
            {voiceMode && !voiceConsent && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={voiceConsent}
                    onChange={(e) => handleVoiceConsent(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to process my microphone audio locally via browser SpeechRecognition. No raw audio is uploaded.
                  </span>
                </label>
              </div>
            )}

            {/* Voice Bar */}
            {voiceMode && voiceConsent && hasSR && (
              <div className="mb-4">
                <VoiceBar
                  onComplete={processTranscript}
                  onCancel={() => {}}
                />
              </div>
            )}

            {/* Fallback for no SR */}
            {voiceMode && voiceConsent && !hasSR && (
              <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Speech recognition not available. Paste dictation text here:</p>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  onBlur={(e) => processTranscript(e.target.value)}
                  placeholder="Paste your dictated text..."
                />
              </div>
            )}

            {/* Follow-up hints */}
            {voiceMode && voiceConsent && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-900 mb-2">💡 Suggested prompts:</p>
                <ul className="text-xs text-purple-700 space-y-1">
                  {suggestFollowups({ step: activeStep, answers, caseData: currentCase }).map((hint, i) => (
                    <li key={i}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 0: Clarifying Questions */}
            {activeStep === 0 && (
              <div className="space-y-4">
                {currentCase.questions.map((q, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium mb-2">{q}</label>
                    <textarea
                      value={answers.clarifying[idx]}
                      onChange={(e) => updateClarifying(idx, e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      rows="2"
                      placeholder="Your answer..."
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Hypothesis */}
            {activeStep === 1 && (
              <div>
                <label className="block text-sm font-medium mb-2">Your Hypothesis</label>
                <textarea
                  value={answers.hypothesis}
                  onChange={(e) => updateAnswer('hypothesis', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="State your initial hypothesis about the problem..."
                />
              </div>
            )}

            {/* Step 2: Framework */}
            {activeStep === 2 && (
              <div className="space-y-3">
                {currentCase.structureOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateAnswer('structure', option)}
                    className={`w-full p-4 rounded-lg border-2 transition ${
                      answers.structure === option
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-semibold">{option}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Quantitative Analysis */}
            {activeStep === 3 && (
              <div className="space-y-4">
                {Object.keys(currentCase.metrics).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 capitalize">{key}</label>
                    <input
                      type="number"
                      value={answers.quant[key] || ''}
                      onChange={(e) => updateQuant(key, e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Enter ${key}...`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Recommendation */}
            {activeStep === 4 && (
              <div>
                <label className="block text-sm font-medium mb-2">Final Recommendation</label>
                <textarea
                  value={answers.recommendation}
                  onChange={(e) => updateAnswer('recommendation', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="6"
                  placeholder="Provide your structured recommendation with action items..."
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {!submitted && (
          <div className="flex justify-between mb-6">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {activeStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Get AI Feedback'}
              </button>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Feedback Panel */}
        {data && (
          <div className="mb-6">
            <FeedbackPanel feedback={data} />
            <button
              onClick={handleReset}
              className="mt-4 w-full px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Try Another Case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
