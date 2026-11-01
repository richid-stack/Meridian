import { describe, expect, it } from 'vitest';
import { feeMinor, isGhanaMomoNumber, MAX_COMMIT_MINOR, parseDollars, paymentReady, totalMinor, validateAmount } from './invest';

describe('fees', () => {
  it('is 2% of the amount', () => {
    expect(feeMinor(25000)).toBe(500);
    expect(feeMinor(10000)).toBe(200);
    expect(totalMinor(25000)).toBe(25500);
  });
  it('rounds to a whole cent', () => expect(feeMinor(12345)).toBe(247));
  it('is 0 for 0', () => expect(feeMinor(0)).toBe(0));
});

describe('parseDollars', () => {
  it('reads digits only', () => {
    expect(parseDollars('250')).toBe(250);
    expect(parseDollars('$1,200')).toBe(1200);
    expect(parseDollars('12abc')).toBe(12);
  });
  it('is 0 for nothing', () => {
    expect(parseDollars('')).toBe(0);
    expect(parseDollars('abc')).toBe(0);
  });
  it('caps at the maximum', () => expect(parseDollars('999999999')).toBe(MAX_COMMIT_MINOR / 100));
});

describe('validateAmount', () => {
  it('accepts the minimum and the maximum', () => {
    expect(validateAmount(10000, 10000)).toBeNull();
    expect(validateAmount(MAX_COMMIT_MINOR, 10000)).toBeNull();
  });
  it('rejects below the minimum, including zero', () => {
    expect(validateAmount(9999, 10000)).toBe('tooLow');
    expect(validateAmount(0, 10000)).toBe('tooLow');
  });
  it('rejects above the maximum', () => expect(validateAmount(MAX_COMMIT_MINOR + 1, 10000)).toBe('tooHigh'));
});

describe('momo numbers', () => {
  it.each(['0241234567', '024 123 4567', ' 0201234567 '.trim()])('accepts %s', (n) => expect(isGhanaMomoNumber(n)).toBe(true));
  it.each(['', '241234567', '02412345678', '+233241234567', '024-123-4567', '0241234abc'])('rejects %s', (n) => expect(isGhanaMomoNumber(n)).toBe(false));
});

describe('paymentReady', () => {
  it('needs a method', () => expect(paymentReady({ method: null, provider: null, phone: '' })).toBe(false));
  it('card and bank need nothing more', () => {
    expect(paymentReady({ method: 'card', provider: null, phone: '' })).toBe(true);
    expect(paymentReady({ method: 'bank', provider: null, phone: '' })).toBe(true);
  });
  it('mobile money needs a provider and a valid number', () => {
    expect(paymentReady({ method: 'momo', provider: null, phone: '0241234567' })).toBe(false);
    expect(paymentReady({ method: 'momo', provider: 'MTN MoMo', phone: '123' })).toBe(false);
    expect(paymentReady({ method: 'momo', provider: 'MTN MoMo', phone: '024 123 4567' })).toBe(true);
  });
});
