import { describe, expect, it } from 'vitest';
import { compareFunding, selectRound } from './compare';

describe('selectRound', () => {
  const cur = { a: 'aya', b: 'kora' };
  it('sets a side', () => expect(selectRound(cur, 'a', 'zuri')).toEqual({ a: 'zuri', b: 'kora' }));
  it('swaps when the other side already has it', () => expect(selectRound(cur, 'a', 'kora')).toEqual({ a: 'kora', b: 'aya' }));
  it('keeps the same pick unchanged', () => expect(selectRound(cur, 'a', 'aya')).toEqual(cur));
  it('works for side b', () => expect(selectRound(cur, 'b', 'aya')).toEqual({ a: 'kora', b: 'aya' }));
});

describe('compareFunding', () => {
  it('finds the leader', () => expect(compareFunding({ fundedPct: 64 }, { fundedPct: 38 })).toEqual({ lead: 'a', tie: false, leadPct: 64, trailPct: 38 }));
  it('finds the leader on side b', () => expect(compareFunding({ fundedPct: 21 }, { fundedPct: 38 })).toEqual({ lead: 'b', tie: false, leadPct: 38, trailPct: 21 }));
  it('flags a tie', () => expect(compareFunding({ fundedPct: 50 }, { fundedPct: 50 }).tie).toBe(true));
});
