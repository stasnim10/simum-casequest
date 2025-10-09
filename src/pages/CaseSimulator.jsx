import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, Star, Trophy } from 'lucide-react';
import useStore from '../state/store';

const frameworks = [
  { id: 'profitability', name: 'Profitability', desc: 'Revenue - Costs = Profit' },
  { id: 'market-entry', name: 'Market Entry', desc: 'Market, Competition, Company' },
  { id: '4p', name: '4Ps', desc: 'Product, Price, Place, Promotion' },
  { id: 'custom', name: 'Custom', desc: 'Build your own framework' }
];

export default function CaseSimulator() {
  const { addXP, addBadge, user } = useStore();
  const [expanded, setExpanded] = useState({ 1: true });
  const [responses, setResponses] = useState({
    clarifying: ['', '', ''],
    customQuestion: '',
    hypothesis: '',
    framework: '',
    customFramework: '',
    profit: '',
    margin: '',
    recommendation: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState(null);

  const togglePanel = (panel) => {
    setExpanded({ ...expanded, [panel]: !expanded[panel] });
  };

  const updateResponse = (field, value) => {
    setResponses({ ...responses, [field]: value });
  };

  const updateClarifying = (index, value) => {
    const newClarifying = [...responses.clarifying];
    newClarifying[index] = value;
    setResponses({ ...responses, clarifying: newClarifying });
  };

  const scoreCase = () => {
    // Communication: based on clarifying questions
    const clarifyingFilled = responses.clarifying.filter(q => q.trim()).length + 
                             (responses.customQuestion.trim() ? 1 : 0);
    const communicationScore = Math.min(5, Math.ceil(clarifyingFilled * 1.25));

    // Structure: based on hypothesis and framework
    const hasHypothesis = responses.hypothesis.trim().length > 20;
    const hasFramework = responses.framework || responses.customFramework.trim().length > 20;
    const structureScore = (hasHypothesis ? 2.5 : 0) + (hasFramework ? 2.5 : 0);

    // Quant: validate profit and margin
    // Correct: Revenue $200M -> $150M, Cost $120M
    // Profit = 150 - 120 = 30M
    // Margin = 30/150 = 20%
    const profitInput = parseFloat(responses.profit);
    const marginInput = parseFloat(responses.margin);
    const profitCorrect = !isNaN(profitInput) && Math.abs(profitInput - 30) <= 3; // ±10%
    const marginCorrect = !isNaN(marginInput) && Math.abs(marginInput - 20) <= 2; // ±10%
    const quantScore = (profitCorrect ? 2.5 : 0) + (marginCorrect ? 2.5 : 0);

    // Recommendation: based on length and structure
    const recLength = responses.recommendation.trim().length;
    const hasBullets = responses.recommendation.includes('-') || responses.recommendation.includes('•');
    const recommendationScore = recLength > 50 ? (hasBullets ? 5 : 3) : (recLength > 20 ? 2 : 0);

    const total = communicationScore + structureScore + quantScore + recommendationScore;
    const percentage = Math.round((total / 20) * 100);

    const feedback = [];
    if (communicationScore >= 4) feedback.push('Strong clarifying questions');
    else if (communicationScore >= 2) feedback.push('Good start on clarifying');
    else feedback.push('Ask more clarifying questions');

    if (structureScore >= 4) feedback.push('Excellent structure and hypothesis');
    else if (structureScore >= 2) feedback.push('Decent framework approach');
    else feedback.push('Develop stronger structure');

    if (quantScore >= 4) feedback.push('Strong quantitative skills');
    else if (quantScore >= 2) feedback.push('Good attempt at calculations');
    else feedback.push('Review profit and margin formulas');

    if (recommendationScore >= 4) feedback.push('Clear, actionable recommendation');
    else if (recommendationScore >= 2) feedback.push('Recommendation needs more detail');
    else feedback.push('Provide structured recommendation');

    return {
      communication: communicationScore,
      structure: structureScore,
      quant: quantScore,
      recommendation: recommendationScore,
      total,
      percentage,
      feedback
    };
  };

  const handleSubmit = () => {
    const caseScores = scoreCase();
    setScores(caseScores);
    
    // Award XP and badge
    addXP(50);
    if (!user.badges.includes('🎯')) {
      addBadge('🎯');
    }
    
    setShowResults(true);
  };

  const handleClose = () => {
    // Clear responses
    setResponses({
      clarifying: ['', '', ''],
      customQuestion: '',
      hypothesis: '',
      framework: '',
      customFramework: '',
      profit: '',
      margin: '',
      recommendation: ''
    });
    setShowResults(false);
    setScores(null);
    setExpanded({ 1: true });
  };

  const Panel = ({ number, title, children, isComplete }) => (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <button
        onClick={() => togglePanel(number)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {isComplete ? <CheckCircle className="w-5 h-5" /> : number}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {expanded[number] ? <ChevronUp /> : <ChevronDown />}
      </button>
      
      <AnimatePresence>
        {expanded[number] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Case Simulator</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-900">
            <strong>Case:</strong> A retail company's revenue dropped from $200M to $150M. 
            Costs remain at $120M. What's happening and what should they do?
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Panel 1: Clarifying Questions */}
        <Panel 
          number={1} 
          title="Clarifying Questions"
          isComplete={responses.clarifying.some(q => q.trim()) || responses.customQuestion.trim()}
        >
          <p className="text-sm text-gray-600 mb-4">Ask questions to understand the problem better</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Suggested questions (select or modify):</label>
              <input
                type="text"
                value={responses.clarifying[0]}
                onChange={(e) => updateClarifying(0, e.target.value)}
                placeholder="What caused the revenue decline?"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <input
              type="text"
              value={responses.clarifying[1]}
              onChange={(e) => updateClarifying(1, e.target.value)}
              placeholder="Is this affecting all product lines?"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              value={responses.clarifying[2]}
              onChange={(e) => updateClarifying(2, e.target.value)}
              placeholder="What's the competitive landscape?"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              value={responses.customQuestion}
              onChange={(e) => updateResponse('customQuestion', e.target.value)}
              placeholder="Add your own question..."
              className="w-full p-3 border rounded-lg border-indigo-300"
            />
          </div>
        </Panel>

        {/* Panel 2: Hypothesis */}
        <Panel 
          number={2} 
          title="Hypothesis"
          isComplete={responses.hypothesis.trim().length > 20}
        >
          <p className="text-sm text-gray-600 mb-4">What's your initial hypothesis about the problem?</p>
          <textarea
            value={responses.hypothesis}
            onChange={(e) => updateResponse('hypothesis', e.target.value)}
            placeholder="Example: I hypothesize that the revenue decline is due to increased competition leading to lost market share..."
            rows={4}
            className="w-full p-3 border rounded-lg"
          />
        </Panel>

        {/* Panel 3: Structure/Framework */}
        <Panel 
          number={3} 
          title="Structure & Framework"
          isComplete={responses.framework || responses.customFramework.trim().length > 20}
        >
          <p className="text-sm text-gray-600 mb-4">Choose a framework to structure your analysis</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {frameworks.map((fw) => (
              <button
                key={fw.id}
                onClick={() => updateResponse('framework', fw.id)}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  responses.framework === fw.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold mb-1">{fw.name}</h4>
                <p className="text-sm text-gray-600">{fw.desc}</p>
              </button>
            ))}
          </div>
          {responses.framework === 'custom' && (
            <textarea
              value={responses.customFramework}
              onChange={(e) => updateResponse('customFramework', e.target.value)}
              placeholder="Describe your custom framework..."
              rows={3}
              className="w-full p-3 border rounded-lg"
            />
          )}
        </Panel>

        {/* Panel 4: Quantitative Analysis */}
        <Panel 
          number={4} 
          title="Quantitative Analysis"
          isComplete={responses.profit && responses.margin}
        >
          <p className="text-sm text-gray-600 mb-4">
            Calculate key metrics: Revenue dropped from $200M to $150M, Costs are $120M
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Profit (in $M):</label>
              <input
                type="number"
                value={responses.profit}
                onChange={(e) => updateResponse('profit', e.target.value)}
                placeholder="Calculate: Revenue - Costs"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current Profit Margin (%):</label>
              <input
                type="number"
                value={responses.margin}
                onChange={(e) => updateResponse('margin', e.target.value)}
                placeholder="Calculate: (Profit / Revenue) × 100"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        </Panel>

        {/* Panel 5: Recommendation */}
        <Panel 
          number={5} 
          title="Recommendation"
          isComplete={responses.recommendation.trim().length > 50}
        >
          <p className="text-sm text-gray-600 mb-4">Provide a clear, actionable recommendation</p>
          <div className="bg-gray-50 p-3 rounded mb-3 text-sm">
            <p className="font-medium mb-1">Template:</p>
            <p>- What should they do?</p>
            <p>- Why this approach?</p>
            <p>- Expected impact?</p>
          </div>
          <textarea
            value={responses.recommendation}
            onChange={(e) => updateResponse('recommendation', e.target.value)}
            placeholder="Based on my analysis, I recommend..."
            rows={6}
            className="w-full p-3 border rounded-lg"
          />
        </Panel>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
      >
        Submit Case
      </button>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && scores && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-8xl mb-4"
                >
                  🎯
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Case Complete!</h2>
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  {scores.percentage}%
                </div>
                <p className="text-gray-600">Total Score: {scores.total}/20</p>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Communication</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < scores.communication ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Structure</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < scores.structure ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quantitative</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < scores.quant ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Recommendation</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < scores.recommendation ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Feedback:</h3>
                <ul className="space-y-1">
                  {scores.feedback.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700">• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Rewards */}
              <div className="space-y-3 mb-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 flex items-center gap-3"
                >
                  <div className="bg-yellow-500 rounded-full p-3">
                    <Star className="w-6 h-6 text-white" fill="white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">XP Gained</p>
                    <p className="text-2xl font-bold">+50 XP</p>
                  </div>
                </motion.div>

                {!user.badges.includes('🎯') && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 flex items-center gap-3"
                  >
                    <div className="bg-purple-500 rounded-full p-3">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Badge Earned</p>
                      <p className="text-2xl font-bold">🎯 First Case</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Start New Case
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
