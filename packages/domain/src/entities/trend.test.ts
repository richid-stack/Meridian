import { describe, expect, it } from 'vitest';
import { growthPct } from './trend';

describe('growthPct', () => {
  it('computes growth', () => expect(growthPct([100, 150, 200, 260, 312])).toBe(212));
  it('can be negative', () => expect(growthPct([10, 5])).toBe(-50));
  it('is zero for one point', () => expect(growthPct([5])).toBe(0));
  it('is zero when the start is zero', () => expect(growthPct([0, 5])).toBe(0));
});
