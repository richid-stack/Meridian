import { describe, expect, it } from 'vitest';
import { findReturnPromise, validateDraft, type Draft } from './draft';

const base: Draft = { type: 'insight', text: 'Design for the worst hour.', options: ['', ''], hasDeal: false };

describe('findReturnPromise', () => {
  it.each([
    'Guaranteed returns of 20% a year',
    'This is a risk-free investment',
    'We guarantee profits for early backers',
    'You cannot lose with this one',
    'Double your money in six months',
    'It will return 30% in a year',
    'Rendement garanti pour les premiers investisseurs',
    'Un placement sans risque',
  ])('flags: %s', (t) => expect(findReturnPromise(t)).toBe(true));
  it.each([
    'Backing this one personally. The founders ship.',
    'Investing involves risk, including loss of capital.',
    'We reduce risk by diversifying routes.',
    'The fund returned to profit last quarter.',
  ])('allows: %s', (t) => expect(findReturnPromise(t)).toBe(false));
});

describe('validateDraft', () => {
  it('accepts a normal post', () => expect(validateDraft(base)).toEqual([]));
  it('rejects empty and whitespace-only text', () => {
    expect(validateDraft({ ...base, text: '' })).toEqual(['empty']);
    expect(validateDraft({ ...base, text: '   \n ' })).toEqual(['empty']);
  });
  it('rejects text over 500 characters', () => expect(validateDraft({ ...base, text: 'a'.repeat(501) })).toEqual(['tooLong']));
  it('allows exactly 500', () => expect(validateDraft({ ...base, text: 'a'.repeat(500) })).toEqual([]));
  it('needs two filled poll options', () => {
    expect(validateDraft({ ...base, type: 'poll', options: ['Yes', ''] })).toEqual(['pollOptions']);
    expect(validateDraft({ ...base, type: 'poll', options: ['Yes', 'No'] })).toEqual([]);
    expect(validateDraft({ ...base, type: 'poll', options: ['Yes', ' ', 'No'] })).toEqual([]);
  });
  it('rejects a poll option over 80 characters', () => {
    expect(validateDraft({ ...base, type: 'poll', options: ['Yes', 'n'.repeat(81)] })).toEqual(['pollOptions']);
  });
  it('ignores poll options for other post types', () => expect(validateDraft({ ...base, options: ['', ''] })).toEqual([]));
  it('blocks return promises only when a deal is attached', () => {
    const text = 'Guaranteed returns for everyone';
    expect(validateDraft({ ...base, text })).toEqual([]);
    expect(validateDraft({ ...base, text, hasDeal: true })).toEqual(['returnPromise']);
  });
});
