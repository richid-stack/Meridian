import { describe, expect, it } from 'vitest';
import { formatMoney } from './MoneyText';

describe('formatMoney', () => {
  it('formats USD minor units', () => expect(formatMoney(25000, 'USD')).toBe('$250'));
  it('formats large amounts with grouping', () => expect(formatMoney(18_000_000_00, 'USD')).toBe('$18,000,000'));
});
