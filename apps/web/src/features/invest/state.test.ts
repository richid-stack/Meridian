import { describe, expect, it } from 'vitest';
import type { Investment } from '@meridian/contracts';
import { amountError, amountMinor, failureOf, initialState, reduce, type Action, type State } from './state';

const MIN = 10_000;
const run = (s: State, ...as: Action[]) => as.reduce((st, a) => reduce(st, a, MIN), s);
const acked = (s: State) => run(s, { type: 'ack', index: 0 }, { type: 'ack', index: 1 }, { type: 'ack', index: 2 });
const receipt: Investment = { id: 'i', dealId: 'd', amountMinor: 25_000, feeMinor: 500, status: 'committed', ref: 'MRD-AAAAAA', at: '2026-11-01T12:00:00.000Z' };

describe('amount', () => {
  it('starts from the amount given', () => expect(amountMinor(initialState(250))).toBe(25_000));
  it('keeps digits only and at most six of them', () => {
    expect(run(initialState(250), { type: 'amount', text: '$1,2x00' }).amountText).toBe('1200');
    expect(run(initialState(250), { type: 'amount', text: '12345678' }).amountText).toBe('123456');
  });
  it('flags too low and too high, never blocks typing', () => {
    expect(amountError(run(initialState(250), { type: 'amount', text: '50' }), MIN)).toBe('tooLow');
    expect(amountError(run(initialState(250), { type: 'amount', text: '' }), MIN)).toBe('tooLow');
    expect(amountError(run(initialState(250), { type: 'amount', text: '999999' }), MIN)).toBe('tooHigh');
    expect(amountError(initialState(100), MIN)).toBeNull();
  });
});

describe('flow', () => {
  it('cannot leave the amount step until all three acknowledgements are ticked', () => {
    const s = initialState(250);
    expect(run(s, { type: 'next' }).step).toBe('amount');
    expect(run(s, { type: 'ack', index: 0 }, { type: 'ack', index: 1 }, { type: 'next' }).step).toBe('amount');
    expect(run(acked(s), { type: 'next' }).step).toBe('payment');
  });
  it('un-ticking brings the block back', () => {
    expect(run(acked(initialState(250)), { type: 'ack', index: 1 }, { type: 'next' }).step).toBe('amount');
  });
  it('cannot leave the amount step with an amount out of range', () => {
    expect(run(acked(initialState(250)), { type: 'amount', text: '50' }, { type: 'next' }).step).toBe('amount');
  });
  it('card needs nothing more; mobile money needs a provider and number', () => {
    const pay = run(acked(initialState(250)), { type: 'next' });
    expect(run(pay, { type: 'next' }).step).toBe('payment');
    expect(run(pay, { type: 'method', method: 'card' }, { type: 'next' }).step).toBe('confirm');
    const momo = run(pay, { type: 'method', method: 'momo' });
    expect(run(momo, { type: 'next' }).step).toBe('payment');
    expect(run(momo, { type: 'provider', provider: 'MTN MoMo' }, { type: 'phone', value: '123' }, { type: 'next' }).step).toBe('payment');
    expect(run(momo, { type: 'provider', provider: 'MTN MoMo' }, { type: 'phone', value: '024 123 4567' }, { type: 'next' }).step).toBe('confirm');
  });
  it('phone keeps digits and spaces only', () => {
    const pay = run(acked(initialState(250)), { type: 'next' });
    expect(run(pay, { type: 'phone', value: '+24-1a' }).phone).toBe('241');
  });
  it('goes back one step at a time and keeps what was entered', () => {
    const conf = run(acked(initialState(300)), { type: 'next' }, { type: 'method', method: 'card' }, { type: 'next' });
    const back = run(conf, { type: 'back' }, { type: 'back' });
    expect(back.step).toBe('amount');
    expect(back.amountText).toBe('300');
    expect(back.acks).toEqual([true, true, true]);
    expect(run(back, { type: 'back' }).step).toBe('amount');
  });
  it('only a complete confirm step can submit, and only once', () => {
    const conf = run(acked(initialState(250)), { type: 'next' }, { type: 'method', method: 'card' }, { type: 'next' });
    const sending = run(conf, { type: 'submit' });
    expect(sending.step).toBe('processing');
    expect(run(sending, { type: 'submit' })).toBe(sending);
    expect(run(initialState(250), { type: 'submit' }).step).toBe('amount');
  });
  it('processing ends in a receipt or a failure', () => {
    const sending = run(acked(initialState(250)), { type: 'next' }, { type: 'method', method: 'card' }, { type: 'next' }, { type: 'submit' });
    expect(run(sending, { type: 'succeeded', receipt })).toMatchObject({ step: 'done', receipt });
    expect(run(sending, { type: 'failed', failure: 'declined' })).toMatchObject({ step: 'failed', failure: 'declined' });
    expect(run(initialState(250), { type: 'succeeded', receipt }).step).toBe('amount');
  });
  it('after a failure the person can retry or change how they pay, keeping their inputs', () => {
    const failed = run(acked(initialState(250)), { type: 'next' }, { type: 'method', method: 'card' }, { type: 'next' }, { type: 'submit' }, { type: 'failed', failure: 'offline' });
    expect(run(failed, { type: 'retry' })).toMatchObject({ step: 'confirm', failure: null, amountText: '250' });
    expect(run(failed, { type: 'changeMethod' }).step).toBe('payment');
  });
  it('back does nothing while processing or on the receipt', () => {
    const sending = run(acked(initialState(250)), { type: 'next' }, { type: 'method', method: 'card' }, { type: 'next' }, { type: 'submit' });
    expect(run(sending, { type: 'back' }).step).toBe('processing');
    expect(run(sending, { type: 'succeeded', receipt }, { type: 'back' }).step).toBe('done');
  });
});

describe('failureOf', () => {
  it('offline wins', () => expect(failureOf(new Error('x'), false)).toBe('offline'));
  it('402 is a declined payment', () => expect(failureOf({ status: 402 }, true)).toBe('declined'));
  it('a network TypeError is offline', () => expect(failureOf(new TypeError('Failed to fetch'), true)).toBe('offline'));
  it('anything else is a general error', () => {
    expect(failureOf({ status: 500 }, true)).toBe('error');
    expect(failureOf('boom', true)).toBe('error');
  });
});
