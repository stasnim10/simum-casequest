import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Award } from 'lucide-react';
import useStore from '../state/store';
import { useFeedbackEnv } from '../hooks/useFeedbackEnv';
import { useCaseFeedback } from '../hooks/useCaseFeedback';
import FeedbackPanel from '../components/FeedbackPanel';
import { track } from '../lib/analytics';

const frameworks = [
  {
    id: 'profit',
    name: 'Profit Tree',
    points: ['Revenue = Price × Volume', 'Costs = Fixed + Variable', 'Profit = Revenue - Costs', 'Identify key drivers'],
  },
  {
    id: 'market',
    name: 'Market Entry',
    points: ['Market attractiveness', 'Competitive landscape', 'Company capabilities', 'Entry strategy'],
  },
  {
    id: '4cp',
    name: '4C+P',
    points: ['Company strengths', 'Customers needs', 'Competitors position', 'Collaborators ecosystem'],
  },
];

export default function CaseSimulator() {
  const navigate = useNavigate();
  const { user, setXP, setCoins } = useStore();
  const { base, secret } = useFeedbackEnv();
  const { loading: feedbackLoading, data: feedbackData, error: feedbackError, requestFeedback, reset: resetFeedback } = useCaseFeedback(base, secret);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [responses, setResponses] = useState({
    clarifyingQuestion: '',
    hypothesis: '',
    framework: '',
    customStructure: '',
    profit: '',
    margin: '',
    recommendation: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState(null);
  const [caseStartTime] = useState(Date.now());

  // Track case start
  useEffect(() => {
    track('sim_case_started', { caseId: 'gamebox-profitability' });
  }, []);

  // Load saved responses
  useEffect(() => {
    const saved = localStorage.getItem('case-progress');
    if (saved) {
      setResponses(JSON.parse(saved));
    }
  }, []);

  // Save responses
  useEffect(() => {
    localStorage.setItem('case-progress', JSON.stringify(responses));
  }, [responses]);

  const updateResponse = (field, value) => {
    setResponses({ ...responses, [field]: value });
  };

  const canContinue = (panelIndex) => {
    switch (panelIndex) {
      case 0:
        return responses.clarifyingQuestion.length > 0;
      case 1:
        return responses.hypothesis.length > 20;
      case 2:
        return responses.framework || responses.customStructure.length > 20;
      case 3:
        return responses.profit && responses.margin;
      case 4:
        return responses.recommendation.length > 100;
      default:
        return false;
    }
  };

  const handleContinue = (panelIndex) => {
    if (canContinue(panelIndex)) {
      setActivePanel(panelIndex + 1);
    }
  };

  const calculateScores = () => {
    const communication = responses.clarifyingQuestion && responses.hypothesis && responses.recommendation.length > 100 ? 5 : 3;
    const structure = responses.framework || responses.customStructure.length > 20 ? 5 : 2;
    
    const profitCorrect = Math.abs(parseFloat(responses.profit) - 30) <= 3;
    const marginCorrect = Math.abs(parseFloat(responses.margin) - 20) <= 2;
    const quant = profitCorrect && marginCorrect ? 5 : profitCorrect || marginCorrect ? 3 : 1;
    
    const recommendation = responses.recommendation.length > 100 ? 5 : 3;

    const total = communication + structure + quant + recommendation;
    const percentage = Math.round((total / 20) * 100);

    return {
      communication,
      structure,
      quant,
      recommendation,
      total,
      percentage,
      feedback: [
        quant === 5 ? 'Strong quantitative skills' : 'Review profit calculations',
        structure === 5 ? 'Good structure clarity' : 'Practice frameworks',
        communication >= 4 ? 'Clear communication' : 'Be more thorough',
      ],
    };
  };

  const handleSubmit = () => {
    const calculatedScores = calculateScores();
    setScores(calculatedScores);
    setShowResults(true);

    // Track case completion
    const durationSec = Math.floor((Date.now() - caseStartTime) / 1000);
    track('sim_case_completed', { 
      caseId: 'gamebox-profitability', 
      durationSec,
      score: calculatedScores.percentage 
    });

    // Award XP and coins
    const xpGained = 50;
    setXP(user.xp + xpGained);
    setCoins(user.coins + 25);
    track('xp_gained', { amount: xpGained, total: user.xp + xpGained });

    // Clear saved progress
    localStorage.removeItem('case-progress');
  };

  const handleGetFeedback = async () => {
    try {
      const userId = user?.id ?? 'local-demo';
      const caseId = 'gamebox-profitability';
      
      const steps = [
        { name: 'clarifying', content: responses.clarifyingQuestion },
        { name: 'hypothesis', content: responses.hypothesis },
        { name: 'structure', content: responses.framework || responses.customStructure },
        { name: 'quant', content: `Profit: ${responses.profit}M, Margin: ${responses.margin}%` },
        { name: 'recommendation', content: responses.recommendation }
      ];
      
      const result = await requestFeedback(userId, caseId, steps);
      track('ai_feedback_received', { caseId, cached: result?.cached ?? false });
      setShowFeedback(true);
    } catch (e) {
      setShowFeedback(true);
    }
  };

  const progress = ((activePanel + 1) / 5) * 100;

  const Panel = ({ index, title, children }) => {
    const isActive = activePanel === index;
    const isCompleted = activePanel > index;

    return (
      <div className="mb-4">
        <button
          onClick={() => setActivePanel(index)}
          className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
            isActive ? 'border-blue-600 bg-blue-50' : isCompleted ? 'border-green-600 bg-green-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
            <span className="font-semibold text-gray-900">
              {index + 1}. {title}
            </span>
          </div>
          {isActive ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white rounded-b-lg border-x-2 border-b-2 border-blue-600">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GameBox Profitability</h1>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}% Complete</p>
      </div>

      <Panel index={0} title="Clarifying Questions">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Suggested questions:</p>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li>• What is the time period for this analysis?</li>
              <li>• Are there any external market changes?</li>
              <li>• What are the main revenue streams?</li>
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your question:</label>
            <input
              type="text"
              value={responses.clarifyingQuestion}
              onChange={(e) => updateResponse('clarifyingQuestion', e.target.value)}
              placeholder="What additional information would you need?"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleContinue(0)}
            disabled={!canContinue(0)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </Panel>

      <Panel index={1} title="Hypothesis">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your hypothesis:</label>
            <textarea
              value={responses.hypothesis}
              onChange={(e) => updateResponse('hypothesis', e.target.value)}
              placeholder="My hypothesis is that..."
              rows={3}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Examples of strong hypotheses:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• "Revenue declined due to pricing pressure from competitors"</li>
              <li>• "Costs increased from supply chain disruptions"</li>
              <li>• "Customer churn increased in key segments"</li>
            </ul>
          </div>
          <button
            onClick={() => handleContinue(1)}
            disabled={!canContinue(1)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </Panel>

      <Panel index={2} title="Structure">
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Select a framework:</p>
          <div className="grid gap-3">
            {frameworks.map((fw) => (
              <div key={fw.id}>
                <button
                  onClick={() => updateResponse('framework', fw.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    responses.framework === fw.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-2">{fw.name}</div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {fw.points.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or describe your custom structure:</label>
            <textarea
              value={responses.customStructure}
              onChange={(e) => updateResponse('customStructure', e.target.value)}
              placeholder="Describe your approach..."
              rows={3}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleContinue(2)}
            disabled={!canContinue(2)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </Panel>

      <Panel index={3} title="Quantitative Analysis">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900 font-medium mb-2">Problem:</p>
            <p className="text-gray-700">
              Revenue dropped from <strong>$200M</strong> to <strong>$150M</strong>.
              <br />
              Costs stayed at <strong>$120M</strong>.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Profit ($M):</label>
              <input
                type="number"
                value={responses.profit}
                onChange={(e) => updateResponse('profit', e.target.value)}
                placeholder="30"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
              />
              {responses.profit && (
                <div className="mt-1 flex items-center gap-1">
                  {Math.abs(parseFloat(responses.profit) - 30) <= 3 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Try again</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Margin (%):</label>
              <input
                type="number"
                value={responses.margin}
                onChange={(e) => updateResponse('margin', e.target.value)}
                placeholder="20"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
              />
              {responses.margin && (
                <div className="mt-1 flex items-center gap-1">
                  {Math.abs(parseFloat(responses.margin) - 20) <= 2 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Try again</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => handleContinue(3)}
            disabled={!canContinue(3)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </Panel>

      <Panel index={4} title="Recommendation">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Write your final 3-bullet summary:
            </label>
            <textarea
              value={responses.recommendation}
              onChange={(e) => updateResponse('recommendation', e.target.value)}
              placeholder="1. Diagnose the root cause...&#10;2. Quantify the impact...&#10;3. Recommend next steps..."
              rows={6}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{responses.recommendation.length} / 100 characters minimum</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Example structure:</p>
            <p className="text-sm text-gray-600">
              1️⃣ Diagnose: Revenue declined 25% while costs remained flat
              <br />
              2️⃣ Quantify: Profit margin dropped from 40% to 20%
              <br />
              3️⃣ Recommend: Investigate pricing strategy and customer retention
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canContinue(4)}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Case
          </button>
          <button
            onClick={handleGetFeedback}
            disabled={!canContinue(4)}
            className="w-full mt-3 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get AI Feedback
          </button>
        </div>
      </Panel>

      {/* AI Feedback Panel */}
      {showFeedback && (
        <div className="mt-4">
          <FeedbackPanel 
            data={feedbackData} 
            error={feedbackError} 
            loading={feedbackLoading} 
            onClose={() => { setShowFeedback(false); resetFeedback(); }} 
          />
        </div>
      )}

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && scores && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowResults(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Case Complete!</h2>
                <div className="text-5xl font-bold text-blue-600 mb-2">{scores.percentage}%</div>
                <p className="text-gray-600">Total Score</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Communication</span>
                  <span className="font-semibold text-gray-900">{scores.communication}/5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Structure</span>
                  <span className="font-semibold text-gray-900">{scores.structure}/5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Quantitative</span>
                  <span className="font-semibold text-gray-900">{scores.quant}/5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Recommendation</span>
                  <span className="font-semibold text-gray-900">{scores.recommendation}/5</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium text-gray-900 mb-2">Feedback:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {scores.feedback.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+50 XP</div>
                  <div className="text-sm text-gray-600">Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">+25 Coins</div>
                  <div className="text-sm text-gray-600">Earned</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-center text-gray-700">
                  🏆 <strong>Badge Unlocked:</strong> First Case Complete!
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
