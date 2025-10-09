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
  }
];
