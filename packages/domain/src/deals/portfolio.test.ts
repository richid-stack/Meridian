import { describe, expect, it } from 'vitest';
import { allocationBySector, mergePositions, totalByStatus, totalInvested, type PositionLike } from './portfolio';

const pos = (dealId: string, amountMinor: number, status: PositionLike['status'] = 'committed', ref = 'R'): PositionLike => ({ dealId, amountMinor, status, at: '2026-09-12T00:00:00.000Z', ref });

describe('mergePositions', () => {
  const base = [pos('aya', 25000, 'committed', 'A1'), pos('kora', 50000, 'in_review', 'K1')];
  it('adds a new round as a new position', () => expect(mergePositions(base, [pos('zuri', 10000, 'committed', 'Z1')]).map((p) => p.dealId)).toEqual(['aya', 'kora', 'zuri']));
  it('grows an existing position and keeps its status and reference', () => {
    const [aya] = mergePositions(base, [pos('aya', 10000, 'committed', 'NEW')]);
    expect(aya).toMatchObject({ amountMinor: 35000, status: 'committed', ref: 'A1' });
  });
  it('combines several additions to one round', () => {
    expect(mergePositions([], [pos('x', 100), pos('x', 250)]).map((p) => p.amountMinor)).toEqual([350]);
  });
  it('does not change its inputs', () => {
    mergePositions(base, [pos('aya', 1)]);
    expect(base[0]?.amountMinor).toBe(25000);
  });
});

describe('totals', () => {
  const all = [pos('a', 25000), pos('b', 50000, 'in_review'), pos('c', 10000, 'funded')];
  it('adds up', () => expect(totalInvested(all)).toBe(85000));
  it('by status', () => {
    expect(totalByStatus(all, 'in_review')).toBe(50000);
    expect(totalByStatus(all, 'funded')).toBe(10000);
    expect(totalByStatus([], 'committed')).toBe(0);
  });
});

describe('allocationBySector', () => {
  const sector = (id: string) => ({ aya: 'Health', kora: 'Logistics', kora2: 'Logistics' })[id] ?? 'Other';
  it('groups, sorts largest first and adds up to 100', () => {
    const a = allocationBySector([pos('aya', 25000), pos('kora', 50000), pos('kora2', 25000)], sector);
    expect(a).toEqual([{ sector: 'Logistics', pct: 75 }, { sector: 'Health', pct: 25 }]);
  });
  it('always adds up to 100', () => {
    const a = allocationBySector([pos('aya', 1), pos('kora', 1), pos('zzz', 1)], sector);
    expect(a.reduce((s, r) => s + r.pct, 0)).toBe(100);
  });
  it('is empty with no positions', () => expect(allocationBySector([], sector)).toEqual([]));
});
