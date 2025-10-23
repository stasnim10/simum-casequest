import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Award,
  Mic,
  RefreshCcw,
  ClipboardList,
  BookOpen,
  BarChart3
} from 'lucide-react';
import useStore from '../state/store';
import { track } from '../lib/analytics';
import VoiceBar from '../components/VoiceBar';
import MVPAnalytics from '../components/MVPAnalytics';
import MascotCoach from '../components/MascotCoach';
import ConfettiBurst from '../components/ConfettiBurst';

const STAGES = ['intro', 'lesson1', 'lesson2', 'lesson3', 'practice', 'review'];

const QUOTES = {
  intro: '“Good sizing is 80% structure, 20% math, 100% confidence.” — CaseQuest Coach',
  completion: '“Nail the logic, own the numbers, sell the insight.” — CaseQuest Coach'
};

const practiceFields = [
  {
    key: 'structure',
    label: 'Structure & Drivers',
    placeholder: 'Break the market into segments or funnels. Mention top-down vs bottom-up blend.'
  },
  {
    key: 'assumptions',
    label: 'Key Assumptions',
    placeholder: 'State volumes, pricing, frequency, and adoption assumptions with justifications.'
  },
  {
    key: 'math',
    label: 'Math & Sizing',
    placeholder: 'Show the calculation clearly. Include units and annualize the total.'
  },
  {
    key: 'insight',
    label: 'Insights & Risks',
    placeholder: 'What does the number mean? Highlight sensitivity, next steps, or strategic takeaways.'
  }
];

const lesson3Questions = [
  {
    id: 'recap',
    prompt: 'Describe one scenario where you would combine top-down and bottom-up in the same answer.',
    rubric: ['combine', 'cross-check', 'triangulate'],
    weight: 35
  },
  {
    id: 'math',
    prompt: 'If a niche app has 1.2M users, 25% premium adoption, ARPU $48 monthly, what is annual revenue?',
    expected: 17280000,
    formatter: (value) => `$${(value / 1_000_000).toFixed(1)}M`,
    weight: 35
  },
  {
    id: 'communication',
    prompt: 'Write a one-sentence recommendation summarizing your sizing with confidence level.',
    rubric: ['recommendation', 'confidence', 'range'],
    weight: 30
  }
];

function parseNumber(value) {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : null;
}

function evaluateTopDown(inputs) {
  const expected = {
    population: 330,
    percent: 60,
    bottles: 3,
    price: 1.5
  };

  const population = parseNumber(inputs.population);
  const percent = parseNumber(inputs.percent);
  const bottles = parseNumber(inputs.bottles);
  const price = parseNumber(inputs.price);

  const structureMessages = [];
  const mathMessages = [];
  const insightMessages = [];

  let structureScore = 30;
  let mathScore = 40;
  let insightScore = 30;

  if (!population || population < 200 || population > 400) {
    structureScore -= 10;
    structureMessages.push('Start with a full population anchor (≈330M).');
  }
  if (!percent || percent < 30 || percent > 90) {
    structureScore -= 10;
    structureMessages.push('Filter the population with a realistic adoption rate (~60%).');
  }
  if (!bottles || bottles < 1 || bottles > 7) {
    structureScore -= 5;
    mathMessages.push('Use 2-4 bottles/week as a reasonable benchmark.');
  }
  if (!price || price < 0.5 || price > 4) {
    structureScore -= 5;
    mathMessages.push('Typical premium bottled water averages ~$1.5 per bottle.');
  }

  const annualized = population && percent && bottles && price
    ? population * 1_000_000 * (percent / 100) * bottles * price * 52
    : null;

  const expectedAnnual = 46_332_000_000; // ~$46B reference

  if (annualized) {
    const variance = Math.abs(annualized - expectedAnnual) / expectedAnnual;
    if (variance > 0.4) {
      mathScore -= 20;
      mathMessages.push('Sanity check: market should land around $40-50B annually.');
    }
    if (variance > 0.25) {
      insightScore -= 10;
      insightMessages.push('Triangulate with an alternate source or justify large swings.');
    } else {
      insightMessages.push('Nice! Your estimate triangulates with typical industry ranges.');
    }
  } else {
    mathScore -= 20;
    mathMessages.push('Complete each step so we can calculate the annual market.');
  }

  const totalScore = Math.max(structureScore, 0) + Math.max(mathScore, 0) + Math.max(insightScore, 0);
  return {
    score: Math.round(totalScore),
    annualized,
    feedback: {
      structure: structureMessages.length ? structureMessages : ['Strong funnel logic.'],
      math: mathMessages.length ? mathMessages : ['Math checks out.'],
      insight: insightMessages.length ? insightMessages : ['Good job contextualizing the size.']
    }
  };
}

function evaluateBottomUp(inputs) {
  const expected = {
    traffic: 120,
    price: 14,
    upsell: 0.2,
    days: 360
  };

  const traffic = parseNumber(inputs.traffic);
  const price = parseNumber(inputs.price);
  const upsell = parseNumber(inputs.upsell);
  const days = parseNumber(inputs.days);

  let structureScore = 35;
  let mathScore = 40;
  let insightScore = 25;
  const structureMessages = [];
  const mathMessages = [];
  const insightMessages = [];

  if (!traffic || traffic < 50 || traffic > 250) {
    structureScore -= 10;
    structureMessages.push('Estimate daily demand in the 100-150 range for a busy shop.');
  }
  if (!price || price < 8 || price > 25) {
    structureScore -= 5;
    mathMessages.push('Average ticket ~$14 keeps the math grounded.');
  }
  if (!upsell || upsell < 0 || upsell > 0.6) {
    insightScore -= 5;
    insightMessages.push('Layer in modest upsell (10-30%) to capture drinks/sides.');
  }
  if (!days || days < 300 || days > 365) {
    structureScore -= 5;
    structureMessages.push('Assume ~360 operating days allowing for downtime.');
  }

  const baseRevenue = traffic && price && days ? traffic * price * days : null;
  const upsellRevenue = baseRevenue && upsell !== null ? baseRevenue * upsell : null;
  const annual = baseRevenue && upsellRevenue !== null ? baseRevenue + upsellRevenue : null;
  const expectedAnnual = 604_800 + 120_960; // ≈ $0.72M

  if (annual) {
    const variance = Math.abs(annual - expectedAnnual) / expectedAnnual;
    if (variance > 0.5) {
      mathScore -= 20;
      mathMessages.push('Your build should land close to ~$0.6-0.8M annually.');
    } else {
      insightMessages.push('Great sense-check: your answer is in the realistic band.');
    }
  } else {
    mathScore -= 20;
    mathMessages.push('Fill each assumption to compute annual revenue.');
  }

  const score = Math.max(structureScore, 0) + Math.max(mathScore, 0) + Math.max(insightScore, 0);
  return {
    score: Math.round(score),
    annual,
    feedback: {
      structure: structureMessages.length ? structureMessages : ['Clear assumption build.'],
      math: mathMessages.length ? mathMessages : ['Numbers look tight.'],
      insight: insightMessages.length ? insightMessages : ['Nice mention of upsell/risks.']
    }
  };
}

function evaluateLesson3(answers) {
  let score = 0;
  const feedback = [];

  lesson3Questions.forEach((question) => {
    const response = answers[question.id];
    if (!response) {
      feedback.push({ id: question.id, ok: false, message: 'Add a response to capture the learning.' });
      return;
    }

    if (question.expected) {
      const value = parseNumber(response.replace(/[$,mMkK]/gi, ''));
      if (!value) {
        feedback.push({ id: question.id, ok: false, message: 'Include the numeric answer with units.' });
        return;
      }
      const variance = Math.abs(value - question.expected) / question.expected;
      if (variance <= 0.2) {
        score += question.weight;
        feedback.push({ id: question.id, ok: true, message: `Great — roughly ${question.formatter(question.expected)} is on point.` });
      } else {
        feedback.push({ id: question.id, ok: false, message: `Revisit your math: aim for ${question.formatter(question.expected)}.` });
      }
      return;
    }

    const hit = question.rubric.some((keyword) => response.toLowerCase().includes(keyword));
    if (hit) {
      score += question.weight;
      feedback.push({ id: question.id, ok: true, message: 'Strong coverage of the key ideas.' });
    } else {
      feedback.push({ id: question.id, ok: false, message: 'Mention triangulation, confidence, and next steps explicitly.' });
    }
  });

  return { score, feedback };
}

function evaluatePractice(responses) {
  const structureHits = ['funnel', 'segments', 'top', 'bottom', 'triang'];
  const mathHits = ['$', 'm', 'x', 'times', 'per', '%'];
  const insightHits = ['recommend', 'confidence', 'risk', 'next', 'sensitivity'];

  const structureScore = structureHits.filter((k) => responses.structure.toLowerCase().includes(k)).length * 10;
  const assumptionScore = mathHits.filter((k) => responses.assumptions.toLowerCase().includes(k)).length * 5;
  const mathScore = mathHits.filter((k) => responses.math.toLowerCase().includes(k)).length * 6;
  const insightScore = insightHits.filter((k) => responses.insight.toLowerCase().includes(k)).length * 8;

  const total = Math.min(structureScore + assumptionScore + mathScore + insightScore, 100);

  const feedback = {
    structure: structureScore >= 30
      ? 'Nice structure — you split the drivers clearly.'
      : 'Start with a crisp funnel or segmentation before jumping into math.',
    math: mathScore >= 30
      ? 'Calculations are replicable. Consider adding a quick triangulation.'
      : 'Show the math line by line with units so the interviewer can follow.',
    insight: insightScore >= 24
      ? 'Great synthesis! You surfaced confidence and next steps.'
      : 'Close with a recommendation, confidence range, and top risks.'
  };

  return { score: total, feedback };
}

export default function MarketSizing() {
  const navigate = useNavigate();
  const {
    marketSizing,
    markMarketIntro,
    completeMarketLesson,
    recordMarketHint,
    recordMarketFeedback,
    saveMarketAttempt,
    recordMarketReview,
    unlockMarketMastery,
    addBadge,
    addXP
  } = useStore();

  const [stage, setStage] = useState(STAGES[0]);
  const [lesson1Inputs, setLesson1Inputs] = useState({ population: '330', percent: '60', bottles: '3', price: '1.5' });
  const [lesson1Result, setLesson1Result] = useState(null);
  const [lesson2Inputs, setLesson2Inputs] = useState({ traffic: '120', price: '14', upsell: '0.2', days: '360' });
  const [lesson2Result, setLesson2Result] = useState(null);
  const [lesson3Answers, setLesson3Answers] = useState({});
  const [lesson3Result, setLesson3Result] = useState(null);
  const [selectedPracticeField, setSelectedPracticeField] = useState(practiceFields[0].key);
  const [practiceResponses, setPracticeResponses] = useState(
    () => practiceFields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
  );
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const masteryRef = useRef(marketSizing.masteryUnlocked);

  const currentIndex = STAGES.indexOf(stage);
  const progress = ((currentIndex + 1) / STAGES.length) * 100;
  const voiceAllowed = (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition))
    && import.meta.env.VITE_ENABLE_VOICE !== '0';

  useEffect(() => {
    track('market_sizing_stage_viewed', { stage });
    if (stage === 'review') {
      recordMarketReview();
    }
  }, [stage, recordMarketReview]);

  useEffect(() => {
    if (marketSizing.masteryUnlocked && !masteryRef.current) {
      setShowConfetti(true);
    }
    masteryRef.current = marketSizing.masteryUnlocked;
  }, [marketSizing.masteryUnlocked]);

  const goToStage = (target) => {
    setStage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLesson1Check = () => {
    const result = evaluateTopDown(lesson1Inputs);
    setLesson1Result(result);
    recordMarketFeedback();
    completeMarketLesson('lesson1', { score: result.score });
    addXP(10);
    track('market_sizing_lesson_scored', { lesson: 'top_down', score: result.score });
  };

  const handleLesson2Check = () => {
    const result = evaluateBottomUp(lesson2Inputs);
    setLesson2Result(result);
    recordMarketFeedback();
    completeMarketLesson('lesson2', { score: result.score });
    addXP(10);
    track('market_sizing_lesson_scored', { lesson: 'bottom_up', score: result.score });
  };

  const handleLesson3Check = () => {
    const result = evaluateLesson3(lesson3Answers);
    setLesson3Result(result);
    recordMarketFeedback();
    completeMarketLesson('lesson3', { score: result.score });
    addXP(15);
    track('market_sizing_lesson_scored', { lesson: 'recap_quiz', score: result.score });
  };

  const handlePracticeFeedback = () => {
    const result = evaluatePractice(practiceResponses);
    setPracticeFeedback(result);
    recordMarketFeedback();
    const attempt = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      responses: practiceResponses,
      feedback: result.feedback,
      score: result.score
    };
    saveMarketAttempt(attempt);
    addXP(20);
    track('market_sizing_practice_submitted', { score: result.score });

    if (result.score >= 70) {
      setShowConfetti(true);
    }

    if (result.score >= 75 && !marketSizing.masteryUnlocked) {
      unlockMarketMastery();
      addBadge('🏆 Market Sizing Pro');
      track('market_sizing_badge_awarded', { score: result.score });
    }
  };

  const lessonComplete = (lessonKey) => marketSizing.lessonStatus[lessonKey].completed;

  const canAdvance = useMemo(() => {
    switch (stage) {
      case 'intro':
        return true;
      case 'lesson1':
        return lessonComplete('lesson1');
      case 'lesson2':
        return lessonComplete('lesson2');
      case 'lesson3':
        return lessonComplete('lesson3');
      case 'practice':
        return Boolean(practiceFeedback);
      default:
        return false;
    }
  }, [stage, marketSizing.lessonStatus, practiceFeedback]);

  const motivationalBanner = stage === 'intro' ? QUOTES.intro : marketSizing.masteryUnlocked ? QUOTES.completion : null;

  const coachDetails = useMemo(() => {
    switch (stage) {
      case 'intro':
        return { message: 'Welcome to the Market Sizing dojo. I have a funnel of tips ready for you!', mood: 'encourage' };
      case 'lesson1':
        return { message: 'Start wide, filter smart. A crisp funnel beats guessing every time.', mood: 'focus' };
      case 'lesson2':
        return { message: 'Bottom-up brilliance starts with believable unit economics.', mood: 'focus' };
      case 'lesson3':
        return { message: 'Blend your approaches and keep the math tidy. Consultants love triangulation.', mood: 'focus' };
      case 'practice':
        return practiceFeedback
          ? {
              message: practiceFeedback.score >= 75
                ? `Score ${practiceFeedback.score}! That insight section is pitch-ready.`
                : `Let’s refine that insight. Try adding confidence levels and next steps.`,
              mood: practiceFeedback.score >= 75 ? 'celebrate' : 'encourage'
            }
          : { message: 'Craft your structure first, then speak it out loud. I’m listening.', mood: 'encourage' };
      case 'review':
        return { message: 'Replay your attempt and note what to celebrate vs tweak. Reflection compounds.', mood: 'encourage' };
      default:
        return { message: 'Ready for your next sizing adventure?', mood: 'encourage' };
    }
  }, [stage, practiceFeedback]);

  const handleVoiceTranscript = (transcript) => {
    setPracticeResponses((prev) => ({
      ...prev,
      [selectedPracticeField]: `${prev[selectedPracticeField]} ${transcript}`.trim()
    }));
  };

  const hints = {
    lesson1: [
      'Start at the widest level: total population or households.',
      'Filter logically: age, income, or behavior-based adoption.',
      'Cross-check your final number with a quick sanity estimate.'
    ],
    lesson2: [
      'Anchor on unit drivers (customers, baskets, price).',
      'Layer modest upsell or frequency assumptions.',
      'Remember to annualize: multiply by operating days.'
    ],
    practice: [
      'Segment scooter owners (shared fleets vs private).',
      'Decide service frequency (e.g., twice a year).',
      'Use a hybrid: top-down volume × bottom-up pricing to triangulate.'
    ]
  };

  const requestHint = (lessonKey) => {
    recordMarketHint();
    track('market_sizing_hint_requested', { lessonKey });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-5xl mx-auto">
        <ConfettiBurst active={showConfetti} onDone={() => setShowConfetti(false)} />
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs uppercase tracking-wide">
            Investor Demo MVP
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market Sizing Masterclass</h1>
              <p className="text-gray-600 mt-1">Learn the core frameworks, practice with AI-style feedback, and showcase mastery.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progress</p>
              <div className="w-48 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          {motivationalBanner && (
            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-800 text-sm">
              {motivationalBanner}
            </div>
          )}
        </div>

        <div className="mb-6">
          <MascotCoach
            message={coachDetails.message}
            subtext={stage === 'practice' ? 'Tip: Speak your structure, then refine the text version.' : 'Coach Milo is cheering from the sidelines.'}
            mood={coachDetails.mood}
            footer={stage === 'practice' && practiceFeedback ? `Latest score: ${practiceFeedback.score}/100` : undefined}
          />
        </div>

        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Why Market Sizing?</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Market sizing questions test how quickly you can structure ambiguity, make grounded assumptions, and communicate a confident answer. We will tackle both top-down and bottom-up approaches, then apply them to a realistic investor-ready case.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <h3 className="font-semibold text-indigo-900 mb-2">Top-Down</h3>
                  <ul className="text-sm text-indigo-700 space-y-2">
                    <li>Start broad (population/TAM) → filter logically</li>
                    <li>Use MECE funnel layers and quick benchmarks</li>
                    <li>Triangulate against known market datapoints</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Bottom-Up</h3>
                  <ul className="text-sm text-purple-700 space-y-2">
                    <li>Build from unit economics and customer behavior</li>
                    <li>Stress-test assumptions with ranges</li>
                    <li>Scale thoughtfully and sanity check the output</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => {
                  markMarketIntro();
                  track('market_sizing_intro_started');
                  goToStage('lesson1');
                }}
                className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-indigo-700"
              >
                Start Lesson 1
              </button>
            </motion.div>
          )}

          {stage === 'lesson1' && (
            <motion.div
              key="lesson1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm p-6 mb-6"
            >
              <SectionHeader
                icon={BookOpen}
                title="Lesson 1 · Top-Down Approach"
                subtitle="Estimate the US bottled water market using a MECE funnel."
              />
              <div className="grid md:grid-cols-2 gap-4">
                <LessonInputCard
                  label="1. Start with population (millions)"
                  value={lesson1Inputs.population}
                  onChange={(value) => setLesson1Inputs((prev) => ({ ...prev, population: value }))}
                />
                <LessonInputCard
                  label="2. % of people buying weekly"
                  value={lesson1Inputs.percent}
                  suffix="%"
                  onChange={(value) => setLesson1Inputs((prev) => ({ ...prev, percent: value }))}
                />
                <LessonInputCard
                  label="3. Bottles per buyer per week"
                  value={lesson1Inputs.bottles}
                  onChange={(value) => setLesson1Inputs((prev) => ({ ...prev, bottles: value }))}
                />
                <LessonInputCard
                  label="4. Avg price per bottle"
                  prefix="$"
                  value={lesson1Inputs.price}
                  onChange={(value) => setLesson1Inputs((prev) => ({ ...prev, price: value }))}
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleLesson1Check}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
                >
                  Check my build
                </button>
                <HintButton hints={hints.lesson1} onHint={() => requestHint('lesson1')} />
              </div>
              {lesson1Result && (
                <FeedbackPanel
                  title="Top-Down Feedback"
                  result={lesson1Result}
                  annualLabel="Estimated Annual Market"
                />
              )}
            </motion.div>
          )}

          {stage === 'lesson2' && (
            <motion.div
              key="lesson2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm p-6 mb-6"
            >
              <SectionHeader
                icon={ClipboardList}
                title="Lesson 2 · Bottom-Up Approach"
                subtitle="Size annual revenue for a city pizza shop."
              />
              <div className="grid md:grid-cols-2 gap-4">
                <LessonInputCard
                  label="1. Customers per day"
                  value={lesson2Inputs.traffic}
                  onChange={(value) => setLesson2Inputs((prev) => ({ ...prev, traffic: value }))}
                />
                <LessonInputCard
                  label="2. Avg ticket ($)"
                  prefix="$"
                  value={lesson2Inputs.price}
                  onChange={(value) => setLesson2Inputs((prev) => ({ ...prev, price: value }))}
                />
                <LessonInputCard
                  label="3. Upsell / Add-on rate"
                  value={lesson2Inputs.upsell}
                  suffix="x"
                  onChange={(value) => setLesson2Inputs((prev) => ({ ...prev, upsell: value }))}
                />
                <LessonInputCard
                  label="4. Operating days"
                  value={lesson2Inputs.days}
                  onChange={(value) => setLesson2Inputs((prev) => ({ ...prev, days: value }))}
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleLesson2Check}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
                >
                  Calculate revenue
                </button>
                <HintButton hints={hints.lesson2} onHint={() => requestHint('lesson2')} />
              </div>
              {lesson2Result && (
                <FeedbackPanel
                  title="Bottom-Up Feedback"
                  result={lesson2Result}
                  annualLabel="Annual Revenue"
                />
              )}
            </motion.div>
          )}

          {stage === 'lesson3' && (
            <motion.div
              key="lesson3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm p-6 mb-6"
            >
              <SectionHeader
                icon={BarChart3}
                title="Lesson 3 · Mastery Quiz"
                subtitle="Blend approaches, validate math, and communicate clearly."
              />
              <div className="space-y-4">
                {lesson3Questions.map((question) => (
                  <div key={question.id} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">{question.prompt}</p>
                    <textarea
                      value={lesson3Answers[question.id] || ''}
                      onChange={(e) => setLesson3Answers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                      rows={question.expected ? 2 : 3}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your answer"
                    />
                    {lesson3Result && (
                      <p className={`text-xs mt-2 ${lesson3Result.feedback.find((f) => f.id === question.id)?.ok ? 'text-green-600' : 'text-red-600'}`}>
                        {lesson3Result.feedback.find((f) => f.id === question.id)?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleLesson3Check}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
                >
                  Submit answers
                </button>
                <HintButton hints={["State how you\'d triangulate", 'Always end with confidence level', 'Keep math visible and neat']} onHint={() => requestHint('lesson3')} />
              </div>
              {lesson3Result && (
                <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-900 text-sm">
                  You scored {lesson3Result.score}/100. {lesson3Result.score >= 70 ? 'Ready for the practice case!' : 'Review the feedback and adjust before moving on.'}
                </div>
              )}
            </motion.div>
          )}

          {stage === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm p-6 mb-6"
            >
              <SectionHeader
                icon={Sparkles}
                title="Practice Case · E-Scooter Maintenance"
                subtitle="Estimate the US annual market for third-party e-scooter maintenance."
              />
              <p className="text-sm text-gray-600 mb-4">
                Use the fields below to capture your structure, assumptions, math, and synthesis. Answer via text or switch on voice capture. Hints available if you stall.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    disabled={!voiceAllowed}
                    checked={voiceMode}
                    onChange={(e) => setVoiceMode(e.target.checked)}
                  />
                  Voice capture
                </label>
                {!voiceAllowed && (
                  <span className="text-xs text-gray-500">Voice requires browser SpeechRecognition support.</span>
                )}
              </div>
              {voiceMode && voiceAllowed && (
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Mic className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">Send transcript to:</span>
                    <select
                      value={selectedPracticeField}
                      onChange={(e) => setSelectedPracticeField(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1 text-sm"
                    >
                      {practiceFields.map((field) => (
                        <option key={field.key} value={field.key}>{field.label}</option>
                      ))}
                    </select>
                  </div>
                  <VoiceBar
                    onComplete={handleVoiceTranscript}
                    onCancel={() => setVoiceMode(false)}
                  />
                </div>
              )}

              <div className="space-y-4">
                {practiceFields.map((field) => (
                  <div key={field.key} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-700">{field.label}</h3>
                      <span className="text-xs text-gray-400">Investor-friendly format</span>
                    </div>
                    <textarea
                      value={practiceResponses[field.key]}
                      onChange={(e) => setPracticeResponses((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      rows={field.key === 'math' ? 5 : 3}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handlePracticeFeedback}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
                >
                  Get instant feedback
                </button>
                <HintButton hints={hints.practice} onHint={() => requestHint('practice')} />
                <button
                  onClick={() => {
                    setPracticeResponses(practiceFields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
                    setPracticeFeedback(null);
                    track('market_sizing_practice_reset');
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset fields
                </button>
              </div>
              {practiceFeedback && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">Feedback Summary · Score {practiceFeedback.score}/100</h3>
                  </div>
                  <ul className="text-sm text-emerald-700 space-y-2">
                    <li><strong>Structure:</strong> {practiceFeedback.feedback.structure}</li>
                    <li><strong>Math:</strong> {practiceFeedback.feedback.math}</li>
                    <li><strong>Insight:</strong> {practiceFeedback.feedback.insight}</li>
                  </ul>
                  {marketSizing.masteryUnlocked && (
                    <div className="mt-3 bg-white border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Badge unlocked: <strong>Market Sizing Pro</strong> 🎉 — this now appears on your profile.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {stage === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <SectionHeader
                  icon={Lightbulb}
                  title="Review Mode"
                  subtitle="Replay your market sizing attempts with feedback."
                />
                {marketSizing.practiceAttempts.length === 0 ? (
                  <p className="text-sm text-gray-600">Complete the practice case to unlock review mode.</p>
                ) : (
                  <div className="space-y-4">
                    {marketSizing.practiceAttempts.map((attempt) => (
                      <div key={attempt.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{new Date(attempt.timestamp).toLocaleString()}</span>
                          <span className="font-semibold text-indigo-600">Score {attempt.score}/100</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700 mt-3">
                          {practiceFields.map((field) => (
                            <div key={field.key}>
                              <p className="font-semibold text-gray-800">{field.label}</p>
                              <p className="whitespace-pre-wrap text-gray-600">{attempt.responses[field.key] || '—'}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <p><strong>Feedback recap:</strong></p>
                          <ul className="list-disc list-inside">
                            <li>Structure — {attempt.feedback.structure}</li>
                            <li>Math — {attempt.feedback.math}</li>
                            <li>Insight — {attempt.feedback.insight}</li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <MVPAnalytics />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => goToStage(STAGES[Math.max(currentIndex - 1, 0)])}
            disabled={stage === 'intro'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {stage !== 'review' && (
            <button
              onClick={() => goToStage(STAGES[currentIndex + 1])}
              disabled={!canAdvance}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="bg-indigo-100 text-indigo-600 rounded-xl p-2">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function LessonInputCard({ label, value, onChange, prefix, suffix }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
        {prefix ? <span className="text-gray-500">{prefix}</span> : null}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="number"
          className="flex-1 outline-none text-sm"
        />
        {suffix ? <span className="text-gray-500">{suffix}</span> : null}
      </div>
    </div>
  );
}

function HintButton({ hints, onHint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) {
            onHint();
          }
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
      >
        <Lightbulb className="w-4 h-4" />
        {open ? 'Hide hints' : 'Need a hint?'}
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-indigo-100 rounded-xl shadow-lg p-3 text-xs text-gray-600">
          <ul className="space-y-2">
            {hints.map((hint, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-500 font-semibold">{idx + 1}.</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FeedbackPanel({ title, result, annualLabel }) {
  return (
    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-indigo-900 mb-2">{title}</h3>
      {result.annualized || result.annual ? (
        <p className="text-xs text-indigo-700 mb-3">
          {annualLabel}:{' '}
          <strong>
            {result.annualized
              ? `$${(result.annualized / 1_000_000_000).toFixed(1)}B`
              : `$${(result.annual / 1_000_000).toFixed(2)}M`}
          </strong>
        </p>
      ) : null}
      <div className="grid md:grid-cols-3 gap-3 text-sm text-indigo-800">
        <div>
          <p className="font-semibold text-indigo-900">Structure</p>
          <ul className="text-xs text-indigo-700 space-y-1">
            {result.feedback.structure.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-indigo-900">Math</p>
          <ul className="text-xs text-indigo-700 space-y-1">
            {result.feedback.math.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-indigo-900">Insight</p>
          <ul className="text-xs text-indigo-700 space-y-1">
            {result.feedback.insight.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-indigo-700">Score: {result.score}/100</p>
    </div>
  );
}
