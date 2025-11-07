import { describe, expect, it } from 'vitest';
import { hintService } from '../src/services/hintService.js';

describe('hintService', () => {
  it('returns a profitability hint string', () => {
    const hint = hintService.getHint({ type: 'profitability' }, { hintsUsed: 0 });
    expect(typeof hint).toBe('string');
    expect(hint.length).toBeGreaterThan(10);
  });

  it('rotates hints when hintsUsed increases', () => {
    const first = hintService.getHint({ type: 'profitability' }, { hintsUsed: 0 });
    const second = hintService.getHint({ type: 'profitability' }, { hintsUsed: 1 });
    expect(first).not.toBe(second);
  });

  it('provides multiple hints via getMoreHints', () => {
    const hints = hintService.getMoreHints({ step: 'data_analysis' }, { hintsUsed: 0 }, 2);
    expect(Array.isArray(hints)).toBe(true);
    expect(hints.length).toBeGreaterThan(0);
  });

  it('allows registering custom hints for a specific key', () => {
    const key = 'custom_case';
    hintService.registerHints(key, ['Custom hint A', 'Custom hint B']);
    const merged = hintService.getHintsForKey(key);
    expect(merged).toEqual(expect.arrayContaining(['Custom hint A', 'Custom hint B']));
  });

  it('falls back gracefully when no hints exist', () => {
    const hint = hintService.getHint({ type: 'unknown-type' }, {});
    expect(typeof hint).toBe('string');
    expect(hint.length).toBeGreaterThan(10);
  });
});
