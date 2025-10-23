export const cases = [
  {
    id: 'profitability-001',
    title: 'Profitability Decline',
    description: 'Our client, a mid-size retailer, saw a 20% profit drop this year despite stable sales.',
    questions: [
      'What segments were most affected?',
      'How did cost structure change?',
      'Are there seasonal variations?'
    ],
    structureOptions: ['Profitability', 'Market Entry', 'Cost Optimization'],
    metrics: { revenue: 100, cost: 80, margin: 20 }
  },
  {
    id: 'growth-001',
    title: 'Market Expansion Strategy',
    description: 'A SaaS platform wants to expand into APAC within 12 months.',
    questions: ['What is the TAM?', 'What competitors operate regionally?'],
    structureOptions: ['Market Sizing', 'Pricing', 'Partnerships'],
    metrics: { TAM: 300, penetration: 0.1 }
  },
  {
    id: 'market-sizing-001',
    title: 'E-Scooter Maintenance Market',
    description: 'Estimate the annual US market size for third-party electric scooter maintenance services.',
    questions: [
      'How many scooters require maintenance each year?',
      'What is the average service frequency and ticket size?',
      'Who are the primary customer segments?'
    ],
    structureOptions: ['Top-Down Funnel', 'Bottom-Up Build', 'Hybrid Cross-Check'],
    metrics: { scooters: 1200, avgTickets: 85, frequency: 2 }
  }
];
