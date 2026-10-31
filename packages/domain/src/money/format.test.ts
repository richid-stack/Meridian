import { describe, expect, it } from 'vitest';
import { formatCompactMoney, formatNumber, formatSignedPercent } from './format';

describe('formatNumber', () => {
  it('groups thousands', () => expect(formatNumber(121540, 0, 'en-US')).toBe('121,540'));
  it('keeps decimals', () => expect(formatNumber(12.18, 2, 'en-US')).toBe('12.18'));
});

describe('formatSignedPercent', () => {
  it('shows plus for gains', () => expect(formatSignedPercent(0.84, 'en-US')).toBe('+0.84%'));
  it('shows minus for losses', () => expect(formatSignedPercent(-0.31, 'en-US')).toMatch(/^[-\u2212]0\.31%$/));
  it('shows no sign at zero', () => expect(formatSignedPercent(0, 'en-US')).toBe('0.00%'));
});

describe('formatCompactMoney', () => {
  it('compacts millions', () => expect(formatCompactMoney(128_000_000, 'USD', 'en-US')).toBe('$1.28M'));
});
