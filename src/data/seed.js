export const modules = [
  {
    id: 'm1',
    title: 'Consulting Mindset',
    summary: 'Case flow, MECE, hypothesis',
    lessons: ['l1', 'l2', 'l3', 'l4', 'l5']
  },
  {
    id: 'm2',
    title: 'Profitability Basics',
    summary: 'Revenue, cost, drivers',
    prereq: 'm1',
    lessons: ['l6', 'l7', 'l8', 'l9', 'l10']
  },
  {
    id: 'm3',
    title: 'Market Sizing Mastery',
    summary: 'Top-down, bottom-up, practice cases',
    prereq: 'm2',
    lessons: ['ms1', 'ms2', 'ms3']
  }
];

export const lessons = [
  {
    id: 'l1',
    moduleId: 'm1',
    title: 'What is a case interview',
    objectives: ['Purpose', 'Assessment areas', 'Typical flow'],
    quiz: [
      {
        id: 'q1',
        type: 'mcq',
        stem: 'Main goal of a case interview?',
        options: ['Charisma', 'Structured problem solving', 'Memory'],
        answer: 'Structured problem solving',
        rationale: 'Assesses thinking process'
      },
      {
        id: 'q2',
        type: 'fill',
        stem: 'MECE stands for ____ Exclusive, Collectively Exhaustive',
        accept: ['Mutually'],
        rationale: 'Framework for structured thinking'
      },
      {
        id: 'q3',
        type: 'calc',
        stem: 'Revenue $20M, margin 25%. Profit?',
        unit: '$',
        correct: 5,
        tolerance: 0.5,
        rationale: '20 * 0.25 = 5'
      }
    ]
  },
  {
    id: 'l2',
    moduleId: 'm1',
    title: 'MECE Framework',
    objectives: ['Mutually Exclusive', 'Collectively Exhaustive', 'Application'],
    quiz: [
      {
        id: 'q4',
        type: 'mcq',
        stem: 'Which is MECE for customer segments?',
        options: ['Young, Old, Rich', 'B2B, B2C', 'North, South, East'],
        answer: 'B2B, B2C',
        rationale: 'Mutually exclusive and covers all customers'
      },
      {
        id: 'q5',
        type: 'fill',
        stem: 'MECE helps avoid ____ and gaps',
        accept: ['overlap', 'overlaps', 'duplication'],
        rationale: 'Ensures complete coverage without redundancy'
      },
      {
        id: 'q6',
        type: 'mcq',
        stem: 'Why use MECE?',
        options: ['Impress interviewer', 'Organize thinking clearly', 'Memorize frameworks'],
        answer: 'Organize thinking clearly',
        rationale: 'Core principle of structured problem solving'
      }
    ]
  },
  {
    id: 'l3',
    moduleId: 'm1',
    title: 'Hypothesis-Driven Approach',
    objectives: ['Form hypothesis', 'Test systematically', 'Iterate'],
    quiz: [
      {
        id: 'q7',
        type: 'mcq',
        stem: 'A hypothesis is:',
        options: ['A wild guess', 'An educated assumption to test', 'The final answer'],
        answer: 'An educated assumption to test',
        rationale: 'Guides investigation efficiently'
      },
      {
        id: 'q8',
        type: 'fill',
        stem: 'Start with a ____, then gather data to validate',
        accept: ['hypothesis'],
        rationale: 'Hypothesis-driven approach'
      },
      {
        id: 'q9',
        type: 'mcq',
        stem: 'If hypothesis is wrong:',
        options: ['Give up', 'Revise and test again', 'Hide the mistake'],
        answer: 'Revise and test again',
        rationale: 'Iterative process'
      }
    ]
  },
  {
    id: 'l4',
    moduleId: 'm1',
    title: 'Case Interview Structure',
    objectives: ['Opening', 'Analysis', 'Recommendation'],
    quiz: [
      {
        id: 'q10',
        type: 'mcq',
        stem: 'First step in a case?',
        options: ['Give answer', 'Clarify the question', 'Start calculating'],
        answer: 'Clarify the question',
        rationale: 'Ensure you understand the problem'
      },
      {
        id: 'q11',
        type: 'fill',
        stem: 'Always end with a clear ____',
        accept: ['recommendation', 'answer', 'conclusion'],
        rationale: 'Synthesize findings into action'
      },
      {
        id: 'q12',
        type: 'mcq',
        stem: 'During analysis, you should:',
        options: ['Work silently', 'Think out loud', 'Rush to answer'],
        answer: 'Think out loud',
        rationale: 'Show your thought process'
      }
    ]
  },
  {
    id: 'l5',
    moduleId: 'm1',
    title: 'Communication Skills',
    objectives: ['Clarity', 'Structure', 'Confidence'],
    quiz: [
      {
        id: 'q13',
        type: 'mcq',
        stem: 'Best way to present findings?',
        options: ['Ramble through details', 'Top-down: answer first, then support', 'Bottom-up: data then conclusion'],
        answer: 'Top-down: answer first, then support',
        rationale: 'Pyramid principle'
      },
      {
        id: 'q14',
        type: 'fill',
        stem: 'Use ____ language, avoid jargon',
        accept: ['simple', 'clear', 'plain'],
        rationale: 'Ensure understanding'
      },
      {
        id: 'q15',
        type: 'mcq',
        stem: 'If you don\'t know something:',
        options: ['Make it up', 'Admit it and explain your approach', 'Change topic'],
        answer: 'Admit it and explain your approach',
        rationale: 'Honesty and problem-solving ability'
      }
    ]
  },
  {
    id: 'l6',
    moduleId: 'm2',
    title: 'Profit Equation',
    objectives: ['Revenue - Cost = Profit', 'Key drivers', 'Break-even'],
    quiz: [
      {
        id: 'q16',
        type: 'calc',
        stem: 'Revenue $100M, Costs $80M. Profit?',
        unit: '$M',
        correct: 20,
        tolerance: 1,
        rationale: '100 - 80 = 20'
      },
      {
        id: 'q17',
        type: 'fill',
        stem: 'Profit = Revenue - ____',
        accept: ['Cost', 'Costs', 'Expenses'],
        rationale: 'Basic profit equation'
      },
      {
        id: 'q18',
        type: 'calc',
        stem: 'Fixed costs $50K, variable cost per unit $10, price $30. Break-even units?',
        unit: 'units',
        correct: 2500,
        tolerance: 100,
        rationale: '50000 / (30-10) = 2500'
      }
    ]
  },
  {
    id: 'l7',
    moduleId: 'm2',
    title: 'Revenue Drivers',
    objectives: ['Price × Volume', 'Market size', 'Market share'],
    quiz: [
      {
        id: 'q19',
        type: 'calc',
        stem: 'Price $50, Volume 1000 units. Revenue?',
        unit: '$',
        correct: 50000,
        tolerance: 100,
        rationale: '50 * 1000 = 50000'
      },
      {
        id: 'q20',
        type: 'fill',
        stem: 'Revenue = ____ × Volume',
        accept: ['Price'],
        rationale: 'Basic revenue formula'
      },
      {
        id: 'q21',
        type: 'calc',
        stem: 'Market size $1B, your share 5%. Your revenue?',
        unit: '$M',
        correct: 50,
        tolerance: 5,
        rationale: '1000 * 0.05 = 50'
      }
    ]
  },
  {
    id: 'l8',
    moduleId: 'm2',
    title: 'Cost Structure',
    objectives: ['Fixed vs Variable', 'Direct vs Indirect', 'Cost drivers'],
    quiz: [
      {
        id: 'q22',
        type: 'mcq',
        stem: 'Which is a fixed cost?',
        options: ['Raw materials', 'Rent', 'Sales commissions'],
        answer: 'Rent',
        rationale: 'Does not vary with production volume'
      },
      {
        id: 'q23',
        type: 'fill',
        stem: '____ costs change with production volume',
        accept: ['Variable'],
        rationale: 'Opposite of fixed costs'
      },
      {
        id: 'q24',
        type: 'calc',
        stem: 'Fixed costs $100K, variable cost $20/unit, 5000 units. Total cost?',
        unit: '$K',
        correct: 200,
        tolerance: 10,
        rationale: '100 + (20 * 5) = 200'
      }
    ]
  },
  {
    id: 'l9',
    moduleId: 'm2',
    title: 'Margin Analysis',
    objectives: ['Gross margin', 'Operating margin', 'Net margin'],
    quiz: [
      {
        id: 'q25',
        type: 'calc',
        stem: 'Revenue $200, COGS $120. Gross margin %?',
        unit: '%',
        correct: 40,
        tolerance: 2,
        rationale: '(200-120)/200 * 100 = 40%'
      },
      {
        id: 'q26',
        type: 'fill',
        stem: 'Gross margin = (Revenue - ____) / Revenue',
        accept: ['COGS', 'Cost of Goods Sold'],
        rationale: 'Measures production efficiency'
      },
      {
        id: 'q27',
        type: 'calc',
        stem: 'Revenue $500K, Operating profit $100K. Operating margin %?',
        unit: '%',
        correct: 20,
        tolerance: 1,
        rationale: '100/500 * 100 = 20%'
      }
    ]
  },
  {
    id: 'l10',
    moduleId: 'm2',
    title: 'Profitability Levers',
    objectives: ['Increase revenue', 'Decrease costs', 'Improve efficiency'],
    quiz: [
      {
        id: 'q28',
        type: 'mcq',
        stem: 'To improve profitability:',
        options: ['Only cut costs', 'Only raise prices', 'Optimize revenue and costs'],
        answer: 'Optimize revenue and costs',
        rationale: 'Balanced approach'
      },
      {
        id: 'q29',
        type: 'fill',
        stem: 'Quick wins often come from ____ reduction',
        accept: ['cost', 'expense'],
        rationale: 'Easier to control than revenue'
      },
      {
        id: 'q30',
        type: 'calc',
        stem: 'Current profit $50K, increase revenue 20% and cut costs 10%. Revenue $200K, costs $150K. New profit?',
        unit: '$K',
        correct: 105,
        tolerance: 5,
        rationale: '(200*1.2) - (150*0.9) = 240 - 135 = 105'
      }
    ]
  },
  {
    id: 'ms1',
    moduleId: 'm3',
    title: 'Top-Down Market Sizing',
    objectives: ['Define target population', 'Apply funnel filters', 'Cross-check results'],
    quiz: [
      {
        id: 'q31',
        type: 'mcq',
        stem: 'First step in a top-down market sizing?',
        options: ['List product features', 'Start with total population or TAM', 'Jump to revenue'],
        answer: 'Start with total population or TAM',
        rationale: 'Anchor the problem with a broad base before narrowing.'
      },
      {
        id: 'q32',
        type: 'fill',
        stem: 'Each filter in a funnel should be both ____ and data-backed.',
        accept: ['mece', 'MECE'],
        rationale: 'Keeps the logic mutually exclusive and collectively exhaustive.'
      },
      {
        id: 'q33',
        type: 'calc',
        stem: 'If US population is 330M and 60% drink bottled water weekly, how many consumers?',
        unit: 'M',
        correct: 198,
        tolerance: 10,
        rationale: '330 × 0.6 ≈ 198 million.'
      }
    ]
  },
  {
    id: 'ms2',
    moduleId: 'm3',
    title: 'Bottom-Up Market Sizing',
    objectives: ['Build unit economics', 'Stress-test assumptions', 'Scale results logically'],
    quiz: [
      {
        id: 'q34',
        type: 'mcq',
        stem: 'Bottom-up sizing typically starts with:',
        options: ['Industry revenue reports', 'Unit-level assumptions like customers/day', 'Competitor pricing decks'],
        answer: 'Unit-level assumptions like customers/day',
        rationale: 'You build the market from granular drivers.'
      },
      {
        id: 'q35',
        type: 'fill',
        stem: 'Always sanity check your answer with a ____ range.',
        accept: ['reasonable', 'plausible', 'sense'],
        rationale: 'Make sure the output passes a smell test.'
      },
      {
        id: 'q36',
        type: 'calc',
        stem: 'A pizza shop serves 120 pies/day at $14, open 360 days. Annual revenue?',
        unit: '$M',
        correct: 0.6,
        tolerance: 0.05,
        rationale: '120 × 14 × 360 ≈ $604,800 (≈$0.6M).'
      }
    ]
  },
  {
    id: 'ms3',
    moduleId: 'm3',
    title: 'Market Sizing Mastery Quiz',
    objectives: ['Blend top-down & bottom-up', 'Check math robustness', 'Communicate recommendations'],
    quiz: [
      {
        id: 'q37',
        type: 'fill',
        stem: 'A great market sizing answer always ends with a clear ____ and confidence level.',
        accept: ['recommendation', 'next step'],
        rationale: 'Close with takeaways and context.'
      },
      {
        id: 'q38',
        type: 'mcq',
        stem: 'When numbers don\'t align, you should:',
        options: ['Ignore the discrepancy', 'State the gap, revisit assumptions, triangulate', 'Restart from scratch silently'],
        answer: 'State the gap, revisit assumptions, triangulate',
        rationale: 'Consultants surface risks and reconcile.'
      },
      {
        id: 'q39',
        type: 'calc',
        stem: 'You estimate 5,000 customers monthly spending $45 each. Annual market size?',
        unit: '$M',
        correct: 2.7,
        tolerance: 0.2,
        rationale: '5000 × 45 × 12 ≈ $2,700,000 (≈$2.7M).'
      }
    ]
  }
];

export const seedDemoData = () => {
  const demoUser = {
    id: 'demo',
    name: 'Demo',
    xp: 120,
    streak: 3,
    coins: 50,
    badges: ['🎯', '🔥', '⭐']
  };
  
  const demoProgress = {
    'l1': { status: 'mastered', crownLevel: 3 },
    'l2': { status: 'in_progress', crownLevel: 1 }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
  
  const demoStreakHistory = {
    [twoDaysAgo]: true,
    [yesterday]: true,
    [today]: true
  };
  
  localStorage.setItem('casequest-storage', JSON.stringify({
    state: { 
      user: demoUser,
      lessonProgress: demoProgress,
      streakHistory: demoStreakHistory
    },
    version: 0
  }));
  
  return demoUser;
};
