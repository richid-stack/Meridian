import { describe, expect, it } from 'vitest';
import { daysLeft, filterDeals, fundedPct } from './rounds';

const NOW = Date.parse('2026-11-01T12:00:00.000Z');
const day = 86_400_000;
const deal = (id: string, days: number, extra: Partial<{ status: 'open' | 'closed'; isNew: boolean }> = {}) => ({
  id, status: 'open' as const, isNew: false, closesAt: new Date(NOW + days * day).toISOString(), ...extra,
});

describe('fundedPct', () => {
  it('rounds', () => {
    expect(fundedPct(128_000_000, 200_000_000)).toBe(64);
    expect(fundedPct(31_000_000, 150_000_000)).toBe(21);
  });
  it('stays within 0 and 100', () => {
    expect(fundedPct(300, 200)).toBe(100);
    expect(fundedPct(-5, 200)).toBe(0);
  });
  it('is 0 for a missing target', () => expect(fundedPct(100, 0)).toBe(0));
});

describe('daysLeft', () => {
  it('rounds up so the last day still counts', () => expect(daysLeft(new Date(NOW + 0.2 * day).toISOString(), NOW)).toBe(1));
  it('counts whole days', () => expect(daysLeft(new Date(NOW + 11 * day).toISOString(), NOW)).toBe(11));
  it('is 0 once closed', () => expect(daysLeft(new Date(NOW - 3 * day).toISOString(), NOW)).toBe(0));
});

describe('filterDeals', () => {
  const all = [deal('a', 11), deal('b', 19), deal('c', 26, { isNew: true }), deal('d', 0, { status: 'closed' })];
  it('all means open rounds', () => expect(filterDeals(all, 'all', NOW).map((d) => d.id)).toEqual(['a', 'b', 'c']));
  it('soon is 14 days or fewer', () => expect(filterDeals(all, 'soon', NOW).map((d) => d.id)).toEqual(['a']));
  it('new', () => expect(filterDeals(all, 'new', NOW).map((d) => d.id)).toEqual(['c']));
  it('closed', () => expect(filterDeals(all, 'closed', NOW).map((d) => d.id)).toEqual(['d']));
  it('any keeps everything', () => expect(filterDeals(all, 'any', NOW)).toHaveLength(4));
  it('a closed round is never "soon"', () => expect(filterDeals([deal('x', 2, { status: 'closed' })], 'soon', NOW)).toEqual([]));
});
