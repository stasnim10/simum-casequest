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
    title: 'Market Sizing Foundations',
    microLesson: [
      {
        type: 'info',
        title: 'What is market sizing?',
        content: 'Market sizing is a quick estimate of how big an opportunity may be. It helps consultants decide if an idea is worth chasing.',
        visual: '📊 Milo holds a clipboard labelled “Opportunity?”',
        milo: 'We size markets to answer: “Is this a small pond or an ocean?”'
      },
      {
        type: 'info',
        title: 'Why it matters',
        content: 'Interviewers use market sizing to see your structure, math, and logic. A calm approach beats a memorized trick every time.',
        visual: '🎯 Target icon with calm waves',
        milo: 'Nervous? Totally normal. We’ll keep each step simple and human.'
      },
      {
        type: 'info',
        title: 'Top-down at a glance',
        content: 'Start wide, then filter down. Think of a funnel: everyone in the population → narrow to your target.',
        visual: '🔽 Funnel made of emoji (👥 → 🔽 → 🛍️)',
        milo: 'Picture pouring sand through a funnel. We only keep the grains that match our customer.'
      },
      {
        type: 'example',
        title: 'Top-down worked example',
        content: [
          'Goal: Estimate weekly bottled water buyers in a city.',
          '1. City population: 500,000 people',
          '2. % who buy bottled water weekly: 30%',
          '3. Weekly buyers: 500,000 × 0.30 = 150,000 people'
        ],
        visual: '🧮 Milo pointing at a three-step ladder',
        milo: 'We just moved from “everyone” to “people who actually buy.” Nice funnel!'
      },
      {
        type: 'practice',
        title: 'Practice: top-down funnel',
        content: 'If 40% of a city with 200,000 people drinks coffee daily, how many daily coffee drinkers is that?',
        visual: '☕️',
        input: 'number',
        answer: 80000,
        hint: 'Multiply the total population by the daily coffee percentage.',
        feedbackCorrect: 'Exactly! 200,000 × 0.40 = 80,000 daily coffee lovers.',
        feedbackIncorrect: 'Try multiplying 200,000 by 0.40. The funnel keeps only coffee fans.',
        milo: 'Say it aloud or type it—either way we’re flexing that math muscle!'
      },
      {
        type: 'info',
        title: 'Bottom-up at a glance',
        content: 'Bottom-up starts from one unit (store, customer, product) and scales up. Think LEGO bricks stacking together.',
        visual: '🧱 LEGO tower with Milo stacking bricks',
        milo: 'One shop, then another, then another… tiny pieces make the big picture!'
      },
      {
        type: 'example',
        title: 'Bottom-up worked example',
        content: [
          'Goal: Estimate annual revenue for a small pizza shop.',
          '1. Pizzas per day: 120',
          '2. Price per pizza: $12',
          '3. Open days: 360',
          '4. Revenue: 120 × $12 × 360 = $518,400'
        ],
        visual: '🍕 Calculator with pizza slices',
        milo: 'Feel how each assumption is grounded? Customers × price × days = revenue.'
      },
      {
        type: 'practice',
        title: 'Practice: build it up',
        content: 'A juice bar sells 80 smoothies a day at $6 and opens 340 days a year. What’s the annual revenue?',
        visual: '🥤',
        input: 'number',
        answer: 163200,
        hint: 'Multiply daily smoothies × price × open days.',
        feedbackCorrect: 'Smooth! 80 × 6 × 340 = $163,200.',
        feedbackIncorrect: 'Multiply daily smoothies × price × open days. Stack those LEGO bricks.',
        milo: 'Want Milo’s pep tip? Say the formula before you crunch it.'
      },
      {
        type: 'recap',
        title: 'Mini-quiz: choose the best move',
        questions: [
          {
            prompt: 'Which approach starts with the whole population and filters down?',
            type: 'mcq',
            options: ['Top-down', 'Bottom-up', 'Sideways analysis'],
            answer: 'Top-down',
            feedbackCorrect: 'Yes! Top-down is the funnel approach.',
            feedbackIncorrect: 'Remember: top-down = wide to narrow.'
          },
          {
            prompt: 'Estimate: 150,000 people × $20 monthly. What’s the annual market size?',
            type: 'calc',
            placeholder: 'Enter a number in dollars',
            answer: 36000000,
            tolerance: 1000000,
            feedbackCorrect: 'Nice! 150,000 × $20 × 12 = $36,000,000.',
            feedbackIncorrect: 'Try multiplying people × price × 12 months.'
          }
        ],
        visual: '✅ Milo giving a high-five',
        milo: 'Look at you—funnels + LEGO bricks = market sizing superpowers!'
      },
      {
        type: 'info',
        title: 'Summary & next steps',
        content: 'Top-down filters a big population. Bottom-up builds from unit economics. Your job: pick the sharper tool for the case.',
        visual: '🛠️ Toolbox labelled “Consultant Kit”',
        milo: 'Next up we’ll practice switching between methods like a pro. Ready when you are!'
      }
    ]
  },
  {
    id: 'ms2',
    moduleId: 'm3',
    title: 'Top-Down Playbook',
    microLesson: [
      {
        type: 'info',
        title: 'Today’s goal',
        content: 'Become fluent with top-down sizing, and cross-check with a quick bottom-up to sanity check yourself.',
        visual: '🎯 Milo aiming at a target marked “Confidence”',
        milo: 'Every great case answer starts with a calm plan. Let’s build one.'
      },
      {
        type: 'info',
        title: 'Top-down roadmap',
        content: 'Use the PEEL steps: Population, Engagement, Expected purchase, Likely spend.',
        visual: '🗺️ Milo unfolding a roadmap with P → E → E → L markers',
        milo: 'PEEL is like peeling an onion—layer by layer till you reach real demand.'
      },
      {
        type: 'example',
        title: 'Worked example: streaming subscribers',
        content: [
          '1. Country households: 10 million',
          '2. % with high-speed internet: 70% → 7 million',
          '3. % who stream video daily: 50% → 3.5 million',
          '4. Target platform conversion: 25% → 875,000 paying users'
        ],
        visual: '📺 Funnel decorated with movie icons',
        milo: 'See how each filter trims fluff? We only keep potential superfans.'
      },
      {
        type: 'practice',
        title: 'Practice: smart speaker sales',
        content: 'A nation has 80 million households. 60% have Wi-Fi. 40% of those are curious about smart speakers this year. How many target households is that?',
        visual: '🗣️🔊',
        input: 'number',
        answer: 19200000,
        hint: 'Multiply total households by each percentage filter in order.',
        feedbackCorrect: 'Exactly! 80M × 0.60 × 0.40 = 19.2M households.',
        feedbackIncorrect: 'Multiply total households × Wi-Fi adoption × curiosity. Keep peeling!',
        milo: 'Imagine each Wi-Fi home raising a hand. Only the curious ones stick around.'
      },
      {
        type: 'info',
        title: 'Triangulate bottom-up',
        content: 'Cross-check by estimating how many devices retailers can actually sell.',
        visual: '⚖️ Milo balancing two estimates on a scale',
        milo: 'Top-down says “huge!” Bottom-up asks, “Do suppliers agree?”'
      },
      {
        type: 'example',
        title: 'Bottom-up cross-check',
        content: [
          '1. Big-box stores: 2,000; average monthly units: 120 → 240,000 units/month',
          '2. Online retailers: 50; monthly units: 10,000 → 500,000 units/month',
          '3. Total annual units: (240,000 + 500,000) × 12 = 8,880,000 devices'
        ],
        visual: '📦 Delivery trucks full of speakers',
        milo: 'Boom! If suppliers ship ~9M devices, our 19M interested households look plausible.'
      },
      {
        type: 'practice',
        title: 'Practice: cross-check your funnel',
        content: 'You estimated 10M potential buyers. Retail data shows stores can stock 600k units/month plus 200k online. What’s the annual supply?',
        visual: '🔁',
        input: 'number',
        answer: 9600000,
        hint: 'Add both channels first, then multiply by 12 months.',
        feedbackCorrect: 'Correct! (600k + 200k) × 12 = 9.6M units.',
        feedbackIncorrect: 'Add both channels, then multiply by 12 months. Sanity check time!',
        milo: 'If supply ~ demand, great! If not, revisit assumptions.'
      },
      {
        type: 'recap',
        title: 'Mini-quiz: top-down mastery',
        questions: [
          {
            prompt: 'Which filter in PEEL turns “interested” into “ready to buy”?',
            type: 'mcq',
            options: ['Population', 'Engagement', 'Expected purchase', 'Likely spend'],
            answer: 'Expected purchase',
            feedbackCorrect: 'Yes! Expected purchase shows real buyers, not just window shoppers.',
            feedbackIncorrect: 'Expected purchase is where we ask, “Who actually buys?”'
          },
          {
            prompt: 'If 5M people × $15 monthly subscription × 12 months, what’s the annual revenue?',
            type: 'calc',
            placeholder: 'Enter a number in dollars',
            answer: 900000000,
            tolerance: 20000000,
            feedbackCorrect: 'Nailed it: $900,000,000.',
            feedbackIncorrect: 'Multiply people × price × 12 months. Same funnel logic!'
          }
        ],
        visual: '💡 Milo holding a “Top-Down Pro” badge',
        milo: 'Look at you—filtering like a pro and checking the math twice!'
      },
      {
        type: 'info',
        title: 'Summary & next steps',
        content: 'Lead with top-down, sense-check bottom-up, and explicitly call out your confidence. Interviewers love thoughtful math.',
        visual: '📝 Checklist with “State method” → “Run math” → “Share confidence”',
        milo: 'Up next we’ll make a bottom-up build feel just as comfy. Ready to stack bricks?'
      }
    ]
  },
  {
    id: 'ms3',
    moduleId: 'm3',
    title: 'Hybrid & Mastery',
    microLesson: [
      {
        type: 'info',
        title: 'Hybrid sizing: the best of both',
        content: 'Hybrids blend top-down and bottom-up. Start with a funnel, then cross-check with unit economics so your number feels grounded.',
        visual: '🔄 Funnel icon connected to LEGO bricks',
        milo: 'Think of it as double-lock security—you’ll sound confident and credible.'
      },
      {
        type: 'info',
        title: 'Top-down refresher',
        content: 'Population → filter to target → estimate purchase frequency → multiply by spend.',
        visual: '🧠 Milo pointing to a 4-step ladder',
        milo: 'We’ve got this pattern down! Keep your filters MECE and reasonable.'
      },
      {
        type: 'example',
        title: 'Hybrid case: bike-sharing revenue',
        content: [
          'Top-down: City pop 4M; 25% likely cyclists → 1M; 30% try bike share → 300k; 40% become regulars → 120k riders.',
          'Average rides per rider: 8/month; price per ride: $3 → revenue ≈ 120k × 8 × $3 × 12 = $34.6M.'
        ],
        visual: '🚲 Milo riding a city bike with revenue chart trailing',
        milo: 'Now let’s see if bikes and stations supply that many rides.'
      },
      {
        type: 'practice',
        title: 'Practice: rider funnel',
        content: 'If 18% of a 10M city use bike share weekly, how many weekly riders is that?',
        visual: '🚲🔢',
        input: 'number',
        answer: 1800000,
        hint: 'Multiply total population by the usage percentage.',
        feedbackCorrect: 'Yes! 10M × 0.18 = 1.8M weekly riders.',
        feedbackIncorrect: 'Multiply population by the usage percentage. Our funnel keeps only riders.',
        milo: 'Say the multiplication out loud—it helps catch tiny slips.'
      },
      {
        type: 'info',
        title: 'Bottom-up cross-check',
        content: 'Inventory: 15 bike docks × 25 bikes each × 6 rides per bike per day × 330 days = 742,500 rides/day. That’s 271M rides/year.',
        visual: '📦 Warehouse filled with bikes',
        milo: 'Plenty of bikes! Our top-down estimate is much lower than capacity—sounds plausible.'
      },
      {
        type: 'example',
        title: 'Hybrid insight',
        content: [
          'Top-down revenue: $34.6M',
          'Bottom-up capacity revenue: 271M rides/year × $3 = $813M possible',
          'Interpretation: Plenty of room to grow; our top-down usage is realistic.'
        ],
        visual: '🧠 Milo comparing two bar charts',
        milo: 'Always explain the gap: maybe low adoption today, but infrastructure can handle more!'
      },
      {
        type: 'practice',
        title: 'Practice: reconcile estimates',
        content: 'Your top-down says 50M rides/year. Supply can support 80M rides/year. What’s your takeaway?',
        visual: ' ⚖️',
        input: 'mcq',
        options: [
          'Demand exceeds supply—add more bikes immediately',
          'Demand is lower than supply—focus on marketing and adoption',
          'Both estimates match perfectly—no action needed'
        ],
        answer: 'Demand is lower than supply—focus on marketing and adoption',
        hint: 'Compare your demand estimate to the supply capacity.',
        feedbackCorrect: 'Yes! Supply is ready; the task is boosting usage.',
        feedbackIncorrect: 'Compare your demand vs capacity. Lower demand means growth levers.',
        milo: 'Point this out in the interview: it proves you’re thinking business, not just math.'
      },
      {
        type: 'recap',
        title: 'Mini-quiz: hybrid mastery',
        questions: [
          {
            prompt: 'Why mix top-down and bottom-up?',
            type: 'mcq',
            options: [
              'To confuse the interviewer',
              'To check if both methods tell a consistent story',
              'Because one method is never enough math'
            ],
            answer: 'To check if both methods tell a consistent story',
            feedbackCorrect: 'Exactly! The goal is confidence, not math for math’s sake.',
            feedbackIncorrect: 'Hybrids show you understand demand AND supply sides.'
          },
          {
            prompt: 'Calculate: 200k riders × 5 rides/month × $2/ride × 12 months = ?',
            type: 'calc',
            placeholder: 'Enter annual revenue',
            answer: 24000000,
            tolerance: 1000000,
            feedbackCorrect: 'Nice! $24,000,000 annual revenue.',
            feedbackIncorrect: 'Multiply riders × rides × price × 12. Say it step-by-step.'
          },
          {
            prompt: 'If top-down demand is far bigger than bottom-up capacity, what might be wrong?',
            type: 'mcq',
            options: [
              'You double-counted segments in the funnel',
              'Supply is too low',
              'Prices are always wrong'
            ],
            answer: 'You double-counted segments in the funnel',
            feedbackCorrect: 'Exactly—overlapping filters inflate top-down demand.',
            feedbackIncorrect: 'Check whether any filters overlapped. That often inflates the funnel.'
          }
        ],
        visual: '🏅 Milo handing you a “Hybrid Hero” badge',
        milo: 'This is senior-level thinking—interviewers will notice!'
      },
      {
        type: 'info',
        title: 'Summary & next challenge',
        content: 'Lead with a clear structure, sanity-check it, and state your confidence. Next: we’ll apply the same micro-lesson style to tailored case practice.',
        visual: '🚀 Milo pointing toward the next module',
        milo: 'Grab a sip of water—you just mastered hybrid sizing!'
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
