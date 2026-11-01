import { describe, expect, it } from 'vitest';
import { effectiveWatch } from './watch';

describe('effectiveWatch', () => {
  const base = ['a', 'b', 'c'];
  it('returns the starting list with no changes', () => expect(effectiveWatch(base, {})).toEqual(base));
  it('removes rounds turned off', () => expect(effectiveWatch(base, { b: false })).toEqual(['a', 'c']));
  it('adds rounds turned on, last', () => expect(effectiveWatch(base, { d: true })).toEqual(['a', 'b', 'c', 'd']));
  it('does not duplicate a round already watched', () => expect(effectiveWatch(base, { a: true })).toEqual(base));
  it('ignores turning off a round that was never watched', () => expect(effectiveWatch(base, { z: false })).toEqual(base));
});
