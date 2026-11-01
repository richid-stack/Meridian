import { describe, expect, it } from 'vitest';
import { addVote, pollPercents, totalVotes } from './poll';

describe('pollPercents', () => {
  it('adds up to 100', () => {
    for (const v of [[494, 325, 265, 120], [1, 1, 1], [1, 2], [0, 5], [33, 33, 34], [7, 7, 7, 7]]) {
      expect(pollPercents(v).reduce((a, b) => a + b, 0), String(v)).toBe(100);
    }
  });
  it('matches the obvious cases', () => {
    expect(pollPercents([1, 1])).toEqual([50, 50]);
    expect(pollPercents([0, 5])).toEqual([0, 100]);
    expect(pollPercents([494, 325, 265, 120])).toEqual([41, 27, 22, 10]);
  });
  it('is all zeros with no votes', () => expect(pollPercents([0, 0, 0])).toEqual([0, 0, 0]));
});

describe('votes', () => {
  const opts = [{ id: 'a', votes: 2 }, { id: 'b', votes: 3 }];
  it('totals', () => expect(totalVotes(opts)).toBe(5));
  it('adds one vote without changing the original', () => {
    expect(addVote(opts, 'a')).toEqual([{ id: 'a', votes: 3 }, { id: 'b', votes: 3 }]);
    expect(opts[0]?.votes).toBe(2);
  });
  it('ignores unknown options', () => expect(addVote(opts, 'zzz')).toEqual(opts));
});
