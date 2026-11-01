import type { Investment } from '@meridian/contracts';
import { deals } from '@meridian/domain';

export type Step = 'amount' | 'payment' | 'confirm' | 'processing' | 'done' | 'failed';
export type Failure = 'declined' | 'offline' | 'error';
export type Acks = [boolean, boolean, boolean];

export interface State {
  step: Step;
  /** What was typed, digits only, in whole dollars. */
  amountText: string;
  acks: Acks;
  method: deals.PayMethod | null;
  provider: string | null;
  phone: string;
  receipt: Investment | null;
  failure: Failure | null;
}

export type Action =
  | { type: 'amount'; text: string }
  | { type: 'ack'; index: 0 | 1 | 2 }
  | { type: 'method'; method: deals.PayMethod }
  | { type: 'provider'; provider: string }
  | { type: 'phone'; value: string }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'submit' }
  | { type: 'succeeded'; receipt: Investment }
  | { type: 'failed'; failure: Failure }
  | { type: 'retry' }
  | { type: 'changeMethod' };

export const initialState = (amountDollars: number): State => ({
  step: 'amount', amountText: String(amountDollars), acks: [false, false, false], method: null, provider: null, phone: '', receipt: null, failure: null,
});

/** Not capped here: an amount over the maximum must show the "too high" message rather than quietly change. */
export const amountMinor = (s: State): number => deals.parseDollars(s.amountText, Number.POSITIVE_INFINITY) * 100;
export const amountError = (s: State, minMinor: number) => deals.validateAmount(amountMinor(s), minMinor);
export const allAcked = (s: State): boolean => s.acks.every(Boolean);
export const canLeaveAmount = (s: State, minMinor: number): boolean => amountError(s, minMinor) === null && allAcked(s);
export const canLeavePayment = (s: State): boolean => deals.paymentReady({ method: s.method, provider: s.provider, phone: s.phone });

/** The next screen only when the current one is complete; otherwise the same state. `minMinor` is the round's minimum. */
export function reduce(s: State, a: Action, minMinor: number): State {
  switch (a.type) {
    case 'amount': return s.step === 'amount' ? { ...s, amountText: a.text.replace(/\D/g, '').slice(0, 6) } : s;
    case 'ack': return s.step === 'amount' ? { ...s, acks: s.acks.map((v, i) => (i === a.index ? !v : v)) as Acks } : s;
    case 'method': return s.step === 'payment' ? { ...s, method: a.method } : s;
    case 'provider': return s.step === 'payment' ? { ...s, provider: a.provider } : s;
    case 'phone': return s.step === 'payment' ? { ...s, phone: a.value.replace(/[^\d\s]/g, '').slice(0, 13) } : s;
    case 'next':
      if (s.step === 'amount' && canLeaveAmount(s, minMinor)) return { ...s, step: 'payment' };
      if (s.step === 'payment' && canLeavePayment(s)) return { ...s, step: 'confirm' };
      return s;
    case 'back':
      if (s.step === 'payment') return { ...s, step: 'amount' };
      if (s.step === 'confirm') return { ...s, step: 'payment' };
      return s;
    case 'submit': return s.step === 'confirm' && canLeaveAmount(s, minMinor) && canLeavePayment(s) ? { ...s, step: 'processing', failure: null } : s;
    case 'succeeded': return s.step === 'processing' ? { ...s, step: 'done', receipt: a.receipt } : s;
    case 'failed': return s.step === 'processing' ? { ...s, step: 'failed', failure: a.failure } : s;
    case 'retry': return s.step === 'failed' ? { ...s, step: 'confirm', failure: null } : s;
    case 'changeMethod': return s.step === 'failed' ? { ...s, step: 'payment', failure: null } : s;
  }
}

/** Which kind of failure an error from the API is. 402 is a declined payment; no connection is offline. */
export function failureOf(e: unknown, online: boolean): Failure {
  if (!online) return 'offline';
  const status = typeof e === 'object' && e !== null && 'status' in e ? (e as { status: unknown }).status : undefined;
  if (status === 402) return 'declined';
  if (e instanceof TypeError) return 'offline';
  return 'error';
}

export const PROVIDERS = ['MTN MoMo', 'Telecel Cash', 'AirtelTigo'] as const;
