import { describe, expect, it } from 'vitest';
import { barLayout } from './TrendBars';

describe('barLayout', () => {
  it('scales the tallest bar to 78', () => {
    const [a, b] = barLayout([{ label: 'a', value: 10 }, { label: 'b', value: 20 }]);
    expect(b?.height).toBe(78);
    expect(a?.height).toBe(39);
  });
  it('rests every bar on the baseline', () => {
    for (const b of barLayout([{ label: 'a', value: 3 }, { label: 'b', value: 9 }, { label: 'c', value: 5 }])) expect(b.y + b.height).toBe(92);
  });
  it('marks only the last bar', () => {
    expect(barLayout([{ label: 'a', value: 1 }, { label: 'b', value: 2 }]).map((b) => b.last)).toEqual([false, true]);
  });
  it('handles empty data', () => expect(barLayout([])).toEqual([]));
});
