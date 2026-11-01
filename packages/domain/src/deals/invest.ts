/** Rules for committing money to a round. All amounts are minor units (cents). Pure; the API enforces the same rules again. */

/** Sample platform fee, 2%. Real fees come from the payments partner agreement. */
export const PLATFORM_FEE_BPS = 200;
/** The most one commitment can be, $100,000. */
export const MAX_COMMIT_MINOR = 10_000_000;

export function feeMinor(amountMinor: number, bps: number = PLATFORM_FEE_BPS): number {
  return Math.round((amountMinor * bps) / 10_000);
}

export function totalMinor(amountMinor: number, bps: number = PLATFORM_FEE_BPS): number {
  return amountMinor + feeMinor(amountMinor, bps);
}

/** Whole dollars from what someone typed. Keeps digits only, caps at the maximum. "$1,200" gives 1200. */
export function parseDollars(input: string, maxMinor: number = MAX_COMMIT_MINOR): number {
  const n = parseInt(input.replace(/\D/g, ''), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(n, Math.floor(maxMinor / 100));
}

export type AmountError = 'tooLow' | 'tooHigh';

/** null when the amount can be committed. Zero counts as "not entered yet" and also fails as too low. */
export function validateAmount(amountMinor: number, minMinor: number, maxMinor: number = MAX_COMMIT_MINOR): AmountError | null {
  if (amountMinor < minMinor) return 'tooLow';
  if (amountMinor > maxMinor) return 'tooHigh';
  return null;
}

/** Ghana mobile money numbers: ten digits starting with 0. Spaces are ignored. */
export function isGhanaMomoNumber(input: string): boolean {
  return /^0\d{9}$/.test(input.replace(/\s/g, ''));
}

export type PayMethod = 'momo' | 'card' | 'bank';

export interface PaymentChoice { method: PayMethod | null; provider: string | null; phone: string }

export function paymentReady(p: PaymentChoice): boolean {
  if (!p.method) return false;
  if (p.method !== 'momo') return true;
  return Boolean(p.provider) && isGhanaMomoNumber(p.phone);
}
