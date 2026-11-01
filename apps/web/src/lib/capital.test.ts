import { describe, expect, it } from 'vitest';
import { capitalHref, compareHref, dateShort, investHref, parseAmountParam, parseCompare, parseDealTab, usd } from './capital';

describe('filter in the URL', () => {
  it('defaults to All open', () => {
    expect(parseDealTab(undefined)).toBe('all');
    expect(parseDealTab('nonsense')).toBe('all');
  });
  it('reads known filters, first value wins', () => {
    expect(parseDealTab('soon')).toBe('soon');
    expect(parseDealTab(['new', 'closed'])).toBe('new');
  });
  it('builds links', () => {
    expect(capitalHref('en', 'all')).toBe('/en/capital');
    expect(capitalHref('fr', 'closed')).toBe('/fr/capital?filter=closed');
  });
});

describe('compare in the URL', () => {
  const ids = ['aya', 'kora', 'zuri'];
  it('defaults to the first two rounds', () => expect(parseCompare({}, ids)).toEqual({ a: 'aya', b: 'kora' }));
  it('reads valid picks', () => expect(parseCompare({ a: 'zuri', b: 'aya' }, ids)).toEqual({ a: 'zuri', b: 'aya' }));
  it('never compares a round with itself', () => {
    expect(parseCompare({ a: 'kora', b: 'kora' }, ids)).toEqual({ a: 'kora', b: 'aya' });
    expect(parseCompare({ a: 'aya', b: 'aya' }, ids)).toEqual({ a: 'aya', b: 'kora' });
  });
  it('ignores unknown ids but keeps the valid one', () => expect(parseCompare({ a: 'nope', b: 'zuri' }, ids)).toEqual({ a: 'aya', b: 'zuri' }));
  it('builds links', () => {
    expect(compareHref('en')).toBe('/en/compare');
    expect(compareHref('en', 'aya', 'zuri')).toBe('/en/compare?a=aya&b=zuri');
  });
});

describe('amounts and money', () => {
  it('reads the amount from the URL', () => {
    expect(parseAmountParam('500')).toBe(500);
    expect(parseAmountParam(undefined)).toBe(250);
    expect(parseAmountParam('abc')).toBe(250);
    expect(parseAmountParam('999999999')).toBe(100_000);
  });
  it('builds invest links', () => {
    expect(investHref('en', 'aya-health-seed')).toBe('/en/capital/deals/aya-health-seed/invest');
    expect(investHref('en', 'aya-health-seed', 500)).toBe('/en/capital/deals/aya-health-seed/invest?amount=500');
  });
  it('shows cents only when there are some', () => {
    expect(usd(25000, 'en-US')).toBe('$250');
    expect(usd(51050, 'en-US')).toBe('$510.50');
  });
  it('formats dates in UTC', () => expect(dateShort('2026-11-12T23:30:00.000Z', 'en')).toBe('12 Nov 2026'));
});
