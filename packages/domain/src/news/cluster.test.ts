import { describe, expect, it } from 'vitest';
import { cluster, jaccard, tokens } from './cluster';
import type { NormStory } from './normalize';

const story = (id: string, titleEn: string, over: Partial<NormStory> = {}): NormStory => ({
  id, title: titleEn, titleEn, snippet: '', source: id, url: `https://x.test/${id}`, at: 1000, region: 'west', topic: 'logistics',
  lang: 'en', entities: [], africaRel: false, africaNote: null, translation: null, ...over,
});

describe('tokens and jaccard', () => {
  it('drops stop words and short words', () => expect(tokens('The new plan is on')).toEqual(['plan']));
  it('scores identical sets 1 and disjoint sets 0', () => {
    expect(jaccard(['a', 'b'], ['a', 'b'])).toBe(1);
    expect(jaccard(['a'], ['b'])).toBe(0);
    expect(jaccard([], [])).toBe(0);
  });
});

describe('cluster', () => {
  const a = story('a', 'Freight network opens third corridor', { at: 2000, source: 'Wire' });
  const b = story('b', 'Cross-border freight network opens third corridor', { at: 1000, source: 'Ledger' });

  it('merges near-duplicate headlines and keeps the newest as primary', () => {
    const [c, ...rest] = cluster([b, a]);
    expect(rest).toHaveLength(0);
    expect(c?.id).toBe('a');
    expect(c?.sources.map((s) => s.source)).toEqual(['Wire', 'Ledger']);
    expect(c?.at).toBe(2000);
  });
  it('does not merge across topics', () => {
    expect(cluster([a, { ...b, topic: 'policy' }])).toHaveLength(2);
  });
  it('does not merge unrelated headlines', () => {
    expect(cluster([a, story('z', 'Cocoa prices climb as harvest estimates fall')])).toHaveLength(2);
  });
  it('counts an outlet once', () => {
    const c = cluster([a, { ...b, source: 'Wire' }]);
    expect(c[0]?.sources).toHaveLength(1);
  });
  it('carries the Africa note and relevance from any member', () => {
    const c = cluster([a, { ...b, africaRel: true, africaNote: 'Why it matters' }]);
    expect(c[0]).toMatchObject({ africaRel: true, africaNote: 'Why it matters' });
  });
  it('is stable when stories share a time', () => {
    const x = story('x', 'Alpha beta gamma', { topic: 'tech' });
    const y = story('y', 'Delta epsilon zeta', { topic: 'tech' });
    expect(cluster([y, x]).map((c) => c.id)).toEqual(['x', 'y']);
  });
});
