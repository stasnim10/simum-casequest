export const modules = [
  {
    id: 'foundations_intro',
    title: 'Case Interviews 101',
    summary: 'Start here to understand what case interviews are and why recruiters love them.',
    lessons: ['foundations_intro']
  },
  {
    id: 'foundations_skills',
    title: 'Consulting Essentials',
    summary: 'Build comfort with communication, structure, and the mindset interviewers expect.',
    lessons: ['foundations_skills']
  },
  {
    id: 'foundations_sizing',
    title: 'Market Sizing Basics',
    summary: 'Learn the intuition behind quick sizing estimates and try a friendly practice funnel.',
    lessons: ['foundations_sizing']
  },
  {
    id: 'foundations_profit',
    title: 'Profitability First Steps',
    summary: 'Meet the profit equation and see how revenue and cost stories come together.',
    lessons: ['foundations_profit']
  }
];

export const lessons = [
  {
    id: 'foundations_intro',
    moduleId: 'foundations_intro',
    title: 'What Is a Case Interview?',
    microLesson: [
      {
        type: 'info',
        title: 'Welcome to the journey',
        content: 'Case interviews are structured conversations about a business problem. You are invited to think aloud, explore options, and make a recommendation.',
        visual: '🗺️',
        milo: 'Treat it like a puzzle we solve together rather than an exam you must pass alone.',
        keyTerms: [
          {
            term: 'Case interview',
            definition: 'A guided problem-solving chat where you partner with the interviewer to tackle a real-world-style challenge.'
          }
        ]
      },
      {
        type: 'info',
        title: 'Why companies use them',
        content: 'Firms care less about the exact answer and more about how you listen, structure ideas, and adapt when information changes.',
        visual: '🎯',
        milo: 'Managers want teammates who stay calm, curious, and collaborative.'
      },
      {
        type: 'example',
        title: 'Mini example: Opening the case',
        visual: '🎙️',
        example: {
          prompt: 'Interviewer: “Our apparel retailer’s profit dropped last quarter. How would you start?”',
          dialogue: [
            { speaker: 'You', line: 'I’d love to confirm the goal. Are we trying to diagnose the drivers behind the drop and recommend fixes?' },
            { speaker: 'Interviewer', line: 'Exactly—that’s the plan.' },
            { speaker: 'You', line: 'Great. I’ll recap the situation, outline how I’ll explore it, and check back as we learn more together.' }
          ]
        },
        takeaway: 'Notice how you clarify the goal, show calm structure, and signal partnership before diving in.',
        keyTerms: [
          { term: 'Clarifying question', definition: 'A quick check to align on goals, scope, or definitions before solving.' },
          { term: 'Recap', definition: 'Your short summary of the situation to show active listening and alignment.' }
        ],
        milo: 'Use warmth and curiosity—you are co-piloting the case.'
      },
      {
        type: 'info',
        title: 'What good feels like',
        content: 'A successful case feels like a friendly brainstorming session. You clarify the goal, lay out a map, and keep checking in.',
        visual: '🤝',
        milo: 'Remember: it is perfectly okay to pause, think, and narrate your map.',
        keyTerms: [
          {
            term: 'Framework',
            definition: 'A simple outline of the key areas you plan to explore. It keeps you and the interviewer aligned.'
          }
        ]
      },
      {
        type: 'practice',
        title: 'Your story so far',
        content: 'Take 20 seconds to say (out loud or in a note) what excites you about casing and one thing that feels fuzzy. Saying it helps you claim the space.',
        visual: '🗣️',
        input: 'text',
        answer: '',
        feedbackCorrect: 'Nice! Awareness is step one. Milo is here whenever you want a boost.',
        feedbackIncorrect: 'There is no wrong answer—just capture a thought to make it real.',
        milo: 'You already took the most important step: showing up.',
        keyTerms: [
          { term: 'Reflection', definition: 'A quick self-check that keeps you mindful of your energy and focus.' }
        ]
      },
      {
        type: 'info',
        title: 'Ready when you are',
        content: 'Up next you\'ll translate this calm mindset into tangible habits. You\'ll see how to communicate clearly, structure a simple map, and stay people-focused.',
        visual: '➡️',
        milo: 'Click finish whenever you feel the message land. Take the pace that works for you.'
      }
    ],
    quiz: [
      {
        id: 'foundations_intro_q1',
        question: 'What is the primary goal of a case interview?',
        options: [
          'To test memorized business trivia',
          'To see how you structure and solve business problems with a partner',
          'To evaluate your ability to win the argument at any cost',
          'To check whether you already know the industry inside out'
        ],
        correctAnswer: 1,
        explanation: 'Interviewers care about your problem-solving approach, collaboration, and structured thinking more than perfect facts.'
      },
      {
        id: 'foundations_intro_q2',
        question: 'When the interviewer first shares the case, what is a helpful first response?',
        options: [
          'Jump straight into brainstorming solutions',
          'Ask a clarifying question to confirm the goal and show partnership',
          'Apologize for needing a moment to think',
          'Request to delay the case until you prepare notes'
        ],
        correctAnswer: 1,
        explanation: 'Clarifying the goal signals calm collaboration and keeps you aligned before you begin solving.'
      },
      {
        id: 'foundations_intro_q3',
        question: 'What does a quick recap accomplish at the start of a case?',
        options: [
          'It lets you repeat the prompt word-for-word to stall for time',
          'It proves you memorized the script ahead of time',
          'It shows active listening and confirms that you and the interviewer share the same understanding',
          'It replaces the need for any framework later on'
        ],
        correctAnswer: 2,
        explanation: 'A short recap demonstrates listening and creates alignment before you explore solutions.'
      }
    ]
  },
  {
    id: 'foundations_skills',
    moduleId: 'foundations_skills',
    title: 'Consulting Essentials',
    microLesson: [
      {
        type: 'info',
        title: 'From mindset to habits',
        content: 'In the intro you saw that cases feel like collaborative puzzles. Now we turn that calm energy into three habits you can rely on in every conversation.',
        visual: '💡',
        milo: 'We practice the habits one at a time—no multitasking needed.',
        keyTerms: [
          { term: 'Structured thinking', definition: 'Breaking a big question into smaller, logical buckets so you stay MECE (Mutually Exclusive, Collectively Exhaustive).' },
          { term: 'MECE', definition: 'A classic consulting shorthand meaning your buckets don’t overlap and together cover the full story.' }
        ]
      },
      {
        type: 'info',
        title: 'Habit 1: communicate simply',
        content: 'Lead with the “headline” then add color. This helps interviewers follow along and keeps you grounded.',
        visual: '🗣️',
        milo: 'Try saying, “My main thought is…” before diving into detail.',
        keyTerms: [
          { term: 'Headline', definition: 'Your top takeaway or answer in one sentence before adding supporting points.' }
        ]
      },
      {
        type: 'info',
        title: 'Habit 2: structure the map',
        content: 'A quick outline of the areas you’ll explore shows you can think broadly before diving deep.',
        visual: '🧭',
        milo: 'Imagine laying out three labeled buckets on the table. You can move between them later.',
        keyTerms: [
          { term: 'Bucket', definition: 'One of the sections in your framework that keeps related ideas together.' },
          { term: 'Driver', definition: 'A factor that moves a result up or down—like volume driving revenue.' }
        ]
      },
      {
        type: 'example',
        title: 'Mini example: MECE structure in action',
        visual: '🧱',
        example: {
          prompt: 'Scenario: “Estimate the impact of a slow coffee shop.”',
          steps: [
            { label: 'Step 1 – Headline', detail: '“I’d look at demand, operations, and customer experience to pinpoint the slow-down.”' },
            { label: 'Step 2 – Clarify buckets', detail: 'Demand (foot traffic), Operations (staffing/process), Experience (wait time, ambiance).' },
            { label: 'Step 3 – Invite feedback', detail: '“Does that cover the areas you’d like me to explore?”' }
          ]
        },
        takeaway: 'Each bucket is distinct (MECE) yet together tells the full story. You stay flexible but grounded.',
        keyTerms: [
          { term: 'Operations', definition: 'The behind-the-scenes processes that deliver the customer experience.' }
        ],
        milo: 'Buckets are simply friendly labels—no fancy jargon required.'
      },
      {
        type: 'practice',
        title: 'Say it out loud',
        content: 'Pick any decision in your day (coffee choice, weekend plan) and outline how you’d structure the decision in 3 buckets.',
        visual: '🧩',
        input: 'text',
        answer: '',
        feedbackCorrect: 'Yes! You just practiced thinking top-down. Keep the outline handy for future cases.',
        feedbackIncorrect: 'No pressure—jot a playful outline. The goal is comfort, not perfection.',
        milo: 'Every tiny repetition pays off.',
        keyTerms: [
          { term: 'Top-down', definition: 'Starting with the high-level structure before zooming into details.' }
        ]
      },
      {
        type: 'info',
        title: 'Habit 3: smile with the client',
        content: 'Interviewers imagine you in front of a real client. Warmth, curiosity, and empathy go a long way.',
        visual: '🙂',
        milo: 'Ask yourself: “If I were the client, what would help me feel heard?”',
        keyTerms: [
          { term: 'Client empathy', definition: 'Thinking about how the person across the table feels and what support they need.' }
        ]
      },
      {
        type: 'info',
        title: 'Nice work',
        content: 'You now have a repeatable trio: headline, structure, empathy. Next, you’ll add a friendly numbers flow that complements these habits.',
        visual: '🚀',
        milo: 'Click finish whenever you feel ready to move on.',
        keyTerms: [
          { term: 'Bridge', definition: 'Linking what you just learned to what comes next so your learning journey feels connected.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'foundations_skills_q1',
        question: 'What does “leading with the headline” mean during a case interview?',
        options: [
          'Delivering every detail before sharing your main takeaway',
          'Starting with your main point or answer, then adding supporting color',
          'Avoiding a recommendation until the interviewer asks',
          'Sending a written summary instead of speaking out loud'
        ],
        correctAnswer: 1,
        explanation: 'A clear headline keeps you and the interviewer oriented before you explain supporting points.'
      },
      {
        id: 'foundations_skills_q2',
        question: 'Which option best demonstrates a MECE framework?',
        options: [
          'Market size, customer happiness, brand awareness',
          'Revenue, cost, external forces—each distinct but together covering the story',
          'Pricing, pricing, and more pricing',
          'Unordered ideas captured as they come to mind'
        ],
        correctAnswer: 1,
        explanation: 'MECE buckets do not overlap and together address the whole problem—like revenue, cost, and external context.'
      },
      {
        id: 'foundations_skills_q3',
        question: 'Why does empathy matter in consulting communication?',
        options: [
          'It replaces the need for analysis',
          'Clients only care about jokes and small talk',
          'It helps you tailor your message so the client feels heard and supported',
          'It convinces interviewers you will accept extra work without question'
        ],
        correctAnswer: 2,
        explanation: 'Empathy keeps your structure human—it ensures recommendations land well with real people.'
      }
    ]
  },
  {
    id: 'foundations_sizing',
    moduleId: 'foundations_sizing',
    title: 'Market Sizing Basics',
    microLesson: [
      {
        type: 'info',
        title: 'Sizing = quick confidence',
        content: 'Market sizing estimates are quick sketches. We combine a funnel and simple math to answer, “Is this idea big enough?”',
        visual: '📈',
        milo: 'We care about the story behind the number, not perfect precision.',
        keyTerms: [
          { term: 'Market sizing', definition: 'A quick estimate of potential demand or revenue using simple, structured math.' }
        ]
      },
      {
        type: 'info',
        title: 'Top-down flow',
        content: 'Start with a population, filter to target customers, estimate how often they buy, and multiply by price.',
        visual: '🔽',
        milo: 'Population → Filter → Frequency → Price. Nice and tidy.',
        keyTerms: [
          { term: 'Assumption', definition: 'A sensible estimate you make explicit so the interviewer can follow your math.' }
        ]
      },
      {
        type: 'example',
        title: 'Mini example: Coffee lovers funnel',
        visual: '☕️',
        example: {
          prompt: 'Let’s estimate weekly cafe spend in a city of 1M people.',
          steps: [
            { label: 'Population', detail: '1,000,000 people' },
            { label: 'Filter', detail: '40% drink coffee → 400,000 people' },
            { label: 'Preference', detail: 'Half prefer cafes → 200,000 guests' },
            { label: 'Frequency', detail: '3 cups/week → 600,000 cups' },
            { label: 'Price', detail: '$4/cup → $2.4M weekly revenue' }
          ],
          dialogue: [
            { speaker: 'You', line: 'I’ll use a top-down funnel so you can see each assumption. We can tweak any layer as needed.' },
            { speaker: 'Interviewer', line: 'Great—call out your math as you go so I can follow.' }
          ]
        },
        takeaway: 'Showing each layer keeps the interviewer close. Invite them to adjust assumptions—it proves you are collaborative.',
        keyTerms: [
          { term: 'Funnel', definition: 'A step-by-step filter that narrows a broad population to the target segment.' }
        ],
        milo: 'Say assumptions with confidence; you can revise them together.'
      },
      {
        type: 'practice',
        title: 'Friendly funnel',
        content: 'Imagine a city with 1M people. 40% drink coffee, 50% prefer cafes, 3 cups per week at $4. What’s the weekly spend? (Say it or jot it.)',
        visual: '☕️',
        input: 'text',
        answer: '',
        feedbackCorrect: 'Awesome! Your math story matters more than the raw digits. You can always refine it later.',
        feedbackIncorrect: 'No worries—walk through each filter and multiply step by step. You got this.',
        milo: 'Celebrate the process, not perfection.',
        keyTerms: [
          { term: 'Sanity check', definition: 'A quick review to ensure your final number feels reasonable compared to the market size.' }
        ]
      },
      {
        type: 'info',
        title: 'Ready for profit stories',
        content: 'With market sizing in your toolkit, the next module shows how revenue and cost fit together in the core profit equation.',
        visual: '➕',
        milo: 'Onward to Profitability First Steps!',
        keyTerms: [
          { term: 'Bridge to profitability', definition: 'Connecting the size of an opportunity to how profit actually gets created.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'foundations_sizing_q1',
        question: 'Which sequence matches the top-down market sizing funnel taught in this lesson?',
        options: [
          'Price → Population → Frequency → Filters',
          'Population → Filters → Frequency → Price',
          'Frequency → Population → Mix → Price',
          'Population → Price → Filters → Mix'
        ],
        correctAnswer: 1,
        explanation: 'Start broad with population, filter to the target group, estimate frequency, then multiply by price.'
      },
      {
        id: 'foundations_sizing_q2',
        question: 'Why do we say assumptions out loud during sizing?',
        options: [
          'To show how quickly we can speak',
          'So the interviewer can challenge or adjust them with you',
          'Because silent math is considered rude',
          'To prove we memorized exact statistics'
        ],
        correctAnswer: 1,
        explanation: 'Sharing assumptions invites collaboration and keeps your math transparent.'
      },
      {
        id: 'foundations_sizing_q3',
        question: 'You estimate 200,000 cafe-goers drinking 3 cups at $4. What is the weekly spend?',
        options: [
          '$240,000',
          '$2.4 million',
          '$600,000',
          '$4.8 million'
        ],
        correctAnswer: 1,
        explanation: '200,000 guests × 3 cups × $4 = 2.4 million dollars per week.'
      }
    ]
  },
  {
    id: 'foundations_profit',
    moduleId: 'foundations_profit',
    title: 'Profitability First Steps',
    microLesson: [
      {
        type: 'info',
        title: 'Profit at a glance',
        content: 'Profit = Revenue – Cost. Cases often ask why profit changed. We look at both sides calmly.',
        visual: '⚖️',
        milo: 'Think of it as a story with two main characters: revenue and cost.',
        keyTerms: [
          { term: 'Profit equation', definition: 'A simple identity: Profit = Revenue – Cost. Investigate both sides to explain changes.' }
        ]
      },
      {
        type: 'info',
        title: 'Revenue story',
        content: 'Revenue is price × volume. If profit drops, we check whether price changed, volume changed, or customer mix shifted.',
        visual: '💵',
        milo: 'Ask “Did fewer people buy? Did we sell cheaper? Did we sell different stuff?”',
        keyTerms: [
          { term: 'Volume', definition: 'How many units or customers you serve.' },
          { term: 'Mix', definition: 'The blend of products or customer segments contributing to revenue.' }
        ]
      },
      {
        type: 'info',
        title: 'Cost story',
        content: 'Costs can be fixed (rent, salaries) or variable (materials, shipping). Understanding which changed guides recommendations.',
        visual: '📦',
        milo: 'Try saying: “Let’s split the cost story into fixed vs. variable to see where the pressure sits.”',
        keyTerms: [
          { term: 'Fixed cost', definition: 'A cost that stays the same regardless of volume in the short term (e.g., rent).' },
          { term: 'Variable cost', definition: 'A cost that scales with activity (e.g., materials per unit).' }
        ]
      },
      {
        type: 'example',
        title: 'Mini example: Linking sizing to profit',
        visual: '🧮',
        example: {
          prompt: 'You estimated a weekly cafe market of $2.4M. Now the interviewer asks why profit shrank.',
          steps: [
            { label: 'Bridge from sizing', detail: '“Earlier we saw strong demand—so let’s see if revenue or cost drivers changed.”' },
            { label: 'Revenue check', detail: 'Less mall foot traffic lowered volume even though price stayed steady.' },
            { label: 'Cost check', detail: 'Ingredient costs spiked, so variable costs rose faster than revenue.' }
          ],
          dialogue: [
            { speaker: 'You', line: '“I’ll explore revenue first—volume, price, and mix—then split costs into fixed versus variable to spot the pressure.”' },
            { speaker: 'Interviewer', line: '“Perfect—connect any findings back to our profit drop.”' }
          ]
        },
        takeaway: 'You reused your funnel mindset (structured, transparent) and tied it to the profit equation. That connection wins trust.',
        keyTerms: [
          { term: 'Driver tree', definition: 'A simple visual that breaks profit into revenue and cost branches so you can test each lever.' }
        ],
        milo: 'Every new concept builds on the last. You’re stacking confidence layer by layer.'
      },
      {
        type: 'practice',
        title: 'Tell the tale',
        content: 'Pick a simple example (lemonade stand, streaming app) and say one sentence about a revenue lever and one about a cost lever.',
        visual: '📝',
        input: 'text',
        answer: '',
        feedbackCorrect: 'Love it! You just described profit like a consultant.',
        feedbackIncorrect: 'Give it a shot—just one sentence per lever is enough. Milo is cheering for you!',
        milo: 'You’re ending this path stronger than you started.',
        keyTerms: [
          { term: 'Lever', definition: 'A knob you can turn—like price, volume, or cost efficiency—to change performance.' }
        ]
      },
      {
        type: 'info',
        title: 'Path complete!',
        content: 'You now have the foundations for Milo’s simulator and deeper lessons. Keep practicing and bring your energy to the next module.',
        visual: '🎉',
        milo: 'Badge unlocked! Ready for the simulator when you are.',
        keyTerms: [
          { term: 'Next step', definition: 'Apply your new toolkit in the Case Simulator or revisit any lesson for a quick confidence boost.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'foundations_profit_q1',
        question: 'Which equation captures the core profitability relationship?',
        options: [
          'Profit = Revenue + Cost',
          'Profit = Revenue – Cost',
          'Profit = Volume × Cost',
          'Profit = Price – Volume'
        ],
        correctAnswer: 1,
        explanation: 'Profit is calculated by subtracting total costs from total revenue.'
      },
      {
        id: 'foundations_profit_q2',
        question: 'If profit falls, which revenue breakdown helps you diagnose the issue?',
        options: [
          'Volume, price, and mix',
          'Rent, utilities, and salaries',
          'Marketing, HR, and legal',
          'Competitors, suppliers, and customers'
        ],
        correctAnswer: 0,
        explanation: 'Looking at volume, price, and mix reveals whether fewer customers bought, prices changed, or the product mix shifted.'
      },
      {
        id: 'foundations_profit_q3',
        question: 'Why do we split costs into fixed and variable buckets?',
        options: [
          'To make the math harder',
          'To distinguish which costs move with volume versus those that stay steady',
          'So we can ignore variable costs entirely',
          'Because investors only care about fixed costs'
        ],
        correctAnswer: 1,
        explanation: 'Separating fixed and variable costs shows whether volume or cost efficiency is pressuring profit.'
      }
    ]
  }
];

export const seedDemoData = () => {
  const demoUser = {
    id: 'demo',
    name: 'Demo',
    xp: 15,
    streak: 2,
    badges: ['🎯'],
    dailyGoal: 20,
    dailyXP: 0,
    lastActiveDate: null
  };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const demoProgress = {
    foundations_intro: {
      status: 'completed',
      contentComplete: true,
      quizPassed: true,
      quizScore: 3,
      totalQuestions: 3,
      attempts: 1,
      completedAt: today,
      quizLastTriedAt: today
    },
    foundations_skills: {
      status: 'in_progress',
      contentComplete: true,
      quizPassed: false,
      quizScore: 2,
      totalQuestions: 3,
      attempts: 1,
      quizLastTriedAt: today
    }
  };

  const demoQuizStats = {
    totalAttempts: 2,
    totalPassed: 1,
    totalQuestions: 6,
    totalCorrect: 5
  };

  const demoStreakHistory = {
    [yesterday]: true,
    [today]: true
  };

  localStorage.setItem('casequest-storage', JSON.stringify({
    state: {
      user: demoUser,
      lessonProgress: demoProgress,
      streakHistory: demoStreakHistory,
      quizStats: demoQuizStats
    },
    version: 0
  }));

  return demoUser;
};
