import { describe, expect, it } from 'vitest';
import { sparkPoints } from './Sparkline';

describe('sparkPoints', () => {
  it('maps the highest value to the top', () => {
    const pts = sparkPoints([0, 10]).split(' ');
    expect(pts[0]).toBe('0.0,18.0');
    expect(pts[1]).toBe('60.0,2.0');
  });
  it('centres a flat series', () => expect(sparkPoints([5, 5, 5])).toBe('0.0,10.0 30.0,10.0 60.0,10.0'));
  it('returns nothing for one point', () => expect(sparkPoints([1])).toBe(''));
});
