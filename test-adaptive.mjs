import { nextBestLesson } from './src/lib/adaptive.ts';

// Simulate lessons with difficulty
const lessons = [
  { id: 'l1', title: 'What is a case interview', difficulty: 1300 },
  { id: 'l2', title: 'Structured thinking with MECE', difficulty: 1350 },
  { id: 'l3', title: 'Issue trees and frameworks', difficulty: 1400 },
  { id: 'l4', title: 'Clarifying questions', difficulty: 1450 },
  { id: 'l5', title: 'Hypothesis-driven approach', difficulty: 1500 },
];

// Simulate user ratings (1500 base, +100 per crown level)
const userRatings = {
  'l1': 1600, // Crown level 1
  'l2': 1500, // Not started
  'l3': 1500,
  'l4': 1500,
  'l5': 1500,
};

const candidates = lessons.map(l => ({
  id: l.id,
  rating: userRatings[l.id] ?? 1500,
  difficulty: l.difficulty,
}));

console.log('=== Adaptive Lesson Selection Test ===\n');
console.log('Candidates:');
candidates.forEach(c => {
  const expected = 1 / (1 + Math.pow(10, (c.difficulty - c.rating) / 400));
  const delta = Math.abs(0.5 - expected);
  console.log(`  ${c.id}: rating=${c.rating}, difficulty=${c.difficulty}, expected=${expected.toFixed(3)}, delta=${delta.toFixed(3)}`);
});

const bestId = nextBestLesson(candidates);
const best = lessons.find(l => l.id === bestId);

console.log(`\nRecommended: ${bestId} - "${best.title}"`);
console.log('\nReason: This lesson has the highest information gain (closest to 50% expected success rate)');
