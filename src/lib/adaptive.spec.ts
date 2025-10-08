import { describe, it, expect } from 'vitest';
import { nextIntervalDays, expectedScore, eloUpdate, nextBestLesson } from './adaptive';

describe('adaptive', () => {
  it('intervals grow with correct streak', () => {
    const h1 = [];
    const h2 = [{correct:true,t:1}];
    const h3 = [{correct:true,t:1},{correct:true,t:2}];
    expect(nextIntervalDays(h1)).toBe(1);
    expect(nextIntervalDays(h2)).toBeGreaterThanOrEqual(5);
    expect(nextIntervalDays(h3)).toBeGreaterThan(nextIntervalDays(h2));
  });

  it('elo expectation and update behave', () => {
    const e = expectedScore(1500, 1500);
    expect(Math.abs(e - 0.5)).toBeLessThan(0.001);
    const up = eloUpdate(1500, e, 1);
    expect(up).toBeGreaterThan(1500);
  });

  it('nextBestLesson selects highest information gain', () => {
    const id = nextBestLesson([
      { id: 'a', rating: 1500, difficulty: 1500 },
      { id: 'b', rating: 1500, difficulty: 2100 },
      { id: 'c', rating: 1500, difficulty: 900 },
    ]);
    expect(['b','c']).toContain(id);
  });
});
