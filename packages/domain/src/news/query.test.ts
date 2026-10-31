import { describe, expect, it } from 'vitest';
import { inRegion, PAGE_SIZE, queryClusters } from './query';
import type { Cluster } from './cluster';
import type { NormStory } from './normalize';

const base = { lang: 'en', entities: [], africaNote: null, translation: null, snippet: '', url: '', titleEn: '', title: '' };
const mk = (id: string, region: string, topic: string, at: number, extra = 0, africaRel = false): Cluster => {
  const p = { ...base, id, source: id, at, region, topic, africaRel } as NormStory;
  return { id, primary: p, sources: [p, ...Array.from({ length: extra }, (_, i) => ({ ...p, source: `${id}${i}` }))], topic, region, at, africaRel, africaNote: null };
};

describe('inRegion', () => {
  it('africa includes African regions, pan, and Africa-relevant global stories', () => {
    expect(inRegion(mk('a', 'west', 't', 1), 'africa')).toBe(true);
    expect(inRegion(mk('b', 'pan', 't', 1), 'africa')).toBe(true);
    expect(inRegion(mk('c', 'asia', 't', 1, 0, true), 'africa')).toBe(true);
    expect(inRegion(mk('d', 'asia', 't', 1), 'africa')).toBe(false);
  });
  it('a named region includes pan-African stories', () => {
    expect(inRegion(mk('a', 'west', 't', 1), 'west')).toBe(true);
    expect(inRegion(mk('b', 'pan', 't', 1), 'west')).toBe(true);
    expect(inRegion(mk('c', 'east', 't', 1), 'west')).toBe(false);
  });
  it('global is only the non-African regions', () => {
    expect(inRegion(mk('a', 'europe', 't', 1), 'global')).toBe(true);
    expect(inRegion(mk('b', 'west', 't', 1), 'global')).toBe(false);
  });
});

describe('queryClusters', () => {
  const all = Array.from({ length: 8 }, (_, i) => mk(`s${i}`, 'west', i % 2 ? 'tech' : 'health', 1000 - i));
  it('filters by topic', () => expect(queryClusters(all, { region: 'africa', topic: 'tech', page: 1 }).items.every((c) => c.topic === 'tech')).toBe(true));
  it('pages by PAGE_SIZE and says if there is more', () => {
    const p1 = queryClusters(all, { region: 'africa', topic: 'all', page: 1 });
    expect(p1.items).toHaveLength(PAGE_SIZE);
    expect(p1.more).toBe(true);
    const p2 = queryClusters(all, { region: 'africa', topic: 'all', page: 2 });
    expect(p2.items).toHaveLength(8);
    expect(p2.more).toBe(false);
    expect(p2.total).toBe(8);
  });
  it('ranks wider coverage above slightly newer stories', () => {
    const items = queryClusters([mk('new', 'west', 't', 1_000_000), mk('wide', 'west', 't', 1_000_000 - 60_000, 2)], { region: 'africa', topic: 'all', page: 1 }).items;
    expect(items.map((c) => c.id)).toEqual(['wide', 'new']);
  });
  it('returns nothing, not an error, for an empty match', () => {
    expect(queryClusters(all, { region: 'global', topic: 'all', page: 1 })).toEqual({ items: [], total: 0, more: false });
  });
});
