import { describe, expect, it } from 'vitest';
import { trendPoints } from './TrendLine';

describe('trendPoints', () => {
  it('puts the low point at the bottom and the high point at the top', () => {
    expect(trendPoints([0, 10])).toBe('2,44 298,4');
  });
  it('centres a flat series', () => expect(trendPoints([3, 3, 3])).toBe('2,24 150,24 298,24'));
  it('returns nothing for one point', () => expect(trendPoints([1])).toBe(''));
});
