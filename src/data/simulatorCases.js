export const simulatorCases = [
  {
    id: 'profitability-case-1',
    slug: 'profitability-case-1',
    category: 'Profitability',
    title: 'Profit Decline - Clothing Manufacturer',
    description: 'Diagnose a mall-based apparel retailer and manufacturer that is experiencing a sharp drop in profits.',
    steps: [
      {
        id: 'prompt',
        type: 'prompt',
        title: 'Case Prompt',
        body: `A clothing manufacturer and retailer with company-owned stores in malls worldwide is seeing a sharp drop in profits after years of success. They sell daily-wear men's and women's clothing. Your job: Figure out the root cause(s) of the profit decline and recommend solutions.`,
        cta: 'Continue'
      },
      {
        id: 'problem-recap',
        type: 'recap',
        title: 'Problem Recap',
        prompt: 'Rephrase the case in your own words. Why is the client here, and what do you need to solve?',
        placeholder: 'Summarize the client situation in 2-3 sentences...'
      },
      {
        id: 'clarifying',
        type: 'clarifying',
        title: 'Clarifying Questions',
        prompt: 'Ask up to three clarifying questions to sharpen the problem statement.',
        maxQuestions: 3,
        questions: [
          {
            id: 'revenues-vs-costs',
            question: 'Have revenues declined, costs increased, or both?',
            acceptedPhrases: [
              'have revenues declined, costs increased, or both',
              'revenue decline or cost increase',
              'are revenues down or costs up',
              'have sales fallen or costs gone up'
            ],
            answer: 'Revenues are down slightly, but costs are up significantly more than revenue has fallen.'
          },
          {
            id: 'competition-shift',
            question: 'Is there increased competition or a market shift?',
            acceptedPhrases: [
              'is there increased competition',
              'any market shift',
              'competition or market shift',
              'what about fast fashion competitors',
              'is fast fashion or ecommerce impacting them'
            ],
            answer: 'Yes - fast-fashion chains and e-commerce pure plays are taking share, especially with quicker refresh cycles.'
          },
          {
            id: 'segment-region',
            question: 'Is a specific segment or region hit hardest?',
            acceptedPhrases: [
              'which segment is hit hardest',
              'specific segment or region',
              'what region is most affected',
              'which stores are declining most'
            ],
            answer: "Women's apparel is declining the most, particularly in enclosed mall stores in secondary cities."
          }
        ],
        fallbackAnswer: 'No information available - try a different approach.',
        suggestionLabel: 'Quick picks'
      },
      {
        id: 'framework',
        type: 'framework',
        title: 'Framework Builder',
        prompt: 'Build a profitability structure. Select at least two main buckets and note what you would explore.',
        minBuckets: 2,
        buckets: [
          {
            id: 'revenue',
            label: 'Revenue',
            subBuckets: [
              { id: 'price', label: 'Price / ticket size' },
              { id: 'volume', label: 'Volume / traffic' },
              { id: 'mix', label: 'Product / channel mix' }
            ],
            helperText: 'How are sales trending across segments and channels?'
          },
          {
            id: 'costs',
            label: 'Costs',
            subBuckets: [
              { id: 'cogs', label: 'COGS / sourcing' },
              { id: 'rent', label: 'Rent & occupancy' },
              { id: 'labor', label: 'Store operations / labor' }
            ],
            helperText: 'Where are costs drifting up? Fixed vs variable?'
          },
          {
            id: 'market',
            label: 'Market & Competition',
            subBuckets: [
              { id: 'share', label: 'Market share shifts' },
              { id: 'positioning', label: 'Brand & value prop' }
            ],
            helperText: 'How are competitors reshaping expectations?'
          },
          {
            id: 'customer',
            label: 'Customer Preferences',
            subBuckets: [
              { id: 'experience', label: 'Store experience' },
              { id: 'omni', label: 'Omnichannel expectations' }
            ],
            helperText: 'What are customers asking for that we lack?'
          }
        ],
        allowCustomBuckets: true,
        customBucketPlaceholder: 'Add a custom bucket (e.g., Supply Chain)...'
      },
      {
        id: 'hypothesis',
        type: 'hypothesis',
        title: 'Initial Hypothesis',
        prompt: 'Based on what you know so far, what is your top hypothesis?',
        placeholder: 'Share a leading hypothesis (you can revise later).',
        optional: true
      },
      {
        id: 'analysis',
        type: 'analysis',
        title: 'Analysis Blocks',
        prompt: 'Step through each data card. Capture insights before revealing the model answer.',
        cards: [
          {
            id: 'analysis-revenue',
            title: 'Revenue Snapshot',
            summary: [
              "Total sales down 5% YoY; women's apparel down 12%",
              'Store traffic down 18% in enclosed malls, flat in outlets',
              'Online sales up 20% but only 15% of total revenue'
            ],
            question: 'What could be driving the revenue softness? What do you want to investigate next?',
            modelAnswer: "Women's in-mall traffic is eroding faster than expected. Investigate assortment freshness, marketing, and whether online browsing converts elsewhere (fast fashion). Consider rebalancing channel mix and improving digital conversion."
          },
          {
            id: 'analysis-costs',
            title: 'Cost Structure',
            summary: [
              'COGS at 58% vs 52% last year',
              'Fabric costs up 9% due to supply shortages',
              'Rent escalators adding $25M annually; labor costs up 6%'
            ],
            question: 'Identify the pressure points in the cost base. What actions sound promising?',
            modelAnswer: 'Sourcing costs from slower supplier renegotiations and rent escalators are the big drivers. Explore near-shoring or alternative suppliers and negotiate underperforming leases. Optimize store labor scheduling tied to traffic.'
          },
          {
            id: 'analysis-competition',
            title: 'Market Shifts',
            summary: [
              'Fast-fashion competitors refreshing assortment every 2-3 weeks',
              'E-commerce peers offering same-day delivery in major cities',
              'Customer NPS dropping from 42 -> 31, citing "dated styles"'
            ],
            question: 'How does the competitive context sharpen your diagnosis?',
            modelAnswer: 'Competition is resetting expectations around speed and convenience. Our slower assortment refresh and mall-centric footprint leave us exposed. Need to invest in merchandise agility and omnichannel experience.'
          },
          {
            id: 'analysis-customer',
            title: 'Customer Voice',
            summary: [
              'Surveys: 48% of lapsed customers prefer online-only competitors',
              'Top complaint: "Styles arrive too late in season"',
              'Loyal customers respond well to limited online drops'
            ],
            question: 'What does the customer feedback confirm or challenge?',
            modelAnswer: 'Customers confirm style freshness and omnichannel convenience gaps. Consider piloting rapid online capsules and improving inventory visibility to keep loyalists engaged.'
          }
        ]
      },
      {
        id: 'recommendation',
        type: 'recommendation',
        title: 'Final Recommendation',
        prompt: 'Deliver a CEO-ready recommendation using Situation -> Key Findings -> Actions -> Risks -> Next Steps.',
        placeholder: 'Structure your final answer. Hit the findings, actions, risks, and immediate next steps.',
        modelAnswer: `Situation: Profits fell as women's mall traffic slowed and costs rose.\nKey findings: Women's apparel traffic -18% in malls; sourcing costs +9%; rent escalators +$25M; assortment refresh lagging competitors.\nActions: Rebalance channel mix toward online with limited drops, renegotiate/exit underperforming leases, accelerate supplier diversification, and launch a rapid-design pod for women's.\nRisks: Execution complexity, store morale.\nNext steps: Stand up a 90-day rent negotiation plan, launch test capsules online, and build sourcing taskforce.`
      },
      {
        id: 'feedback',
        type: 'feedback',
        title: 'AI Coach Feedback',
        prompt: 'Here is how your approach stacks up. You can replay the case or export your notes.',
        rubric: [
          {
            id: 'coverage',
            label: 'Covered revenue and cost drivers',
            success: 'You addressed both sides of the profit equation - nice balance.',
            failure: 'Add depth on both revenue and cost to round out your profitability story.',
            keywords: ['revenue', 'sales', 'cost', 'cogs', 'margin']
          },
          {
            id: 'competition',
            label: 'Incorporated competitive and channel insights',
            success: 'You recognized the fast-fashion / e-commerce threat.',
            failure: 'Call out how competition and channel shift impact the client.',
            keywords: ['competition', 'competitor', 'channel', 'e-commerce', 'omni', 'fast fashion']
          },
          {
            id: 'recommendation-structure',
            label: 'Delivered a structured, MECE recommendation',
            success: 'Your final recommendation followed a crisp Situation-Findings-Actions-Risks-Next steps flow.',
            failure: 'Tighten the final summary so it walks leadership through situation, findings, actions, risks, and next steps.',
            keywords: ['situation', 'findings', 'actions', 'risks', 'next steps']
          }
        ]
      }
    ]
  }
];

export function getSimulatorCaseBySlug(slug) {
  return simulatorCases.find((c) => c.slug === slug);
}

export function getSimulatorCases() {
  return simulatorCases;
}
