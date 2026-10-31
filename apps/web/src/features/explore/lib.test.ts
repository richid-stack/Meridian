import { describe, expect, it } from 'vitest';
import type { SearchHit } from '@meridian/contracts';
import { applyFilter, hrefFor, kindKey } from './lib';

const hits: SearchHit[] = [
  { kind: 'person', id: 'ama', title: 'Ama', subtitle: '' },
  { kind: 'company', id: 'kora', title: 'Kora', subtitle: '' },
  { kind: 'episode', id: 'e1', title: 'E', subtitle: '', media: 'video' },
];

describe('applyFilter', () => {
  it('keeps everything for all', () => expect(applyFilter(hits, 'all')).toHaveLength(3));
  it('filters by kind', () => expect(applyFilter(hits, 'company').map((h) => h.id)).toEqual(['kora']));
});

describe('hrefFor', () => {
  it('routes people', () => expect(hrefFor({ kind: 'person', id: 'ama', title: 'Ama' }, 'fr')).toBe('/fr/people/ama'));
  it('routes deals', () => expect(hrefFor({ kind: 'deal', id: 'd', title: 'D' }, 'en')).toBe('/en/capital/deals/d'));
  it('turns topics into searches', () => expect(hrefFor({ kind: 'topic', id: 't', title: 'Cross-border payments' }, 'en')).toBe('/en/explore?q=Cross-border%20payments'));
});

describe('kindKey', () => {
  it('splits episodes by media', () => expect(kindKey({ kind: 'episode', media: 'video' })).toBe('kind_episode_video'));
  it('defaults episodes to audio', () => expect(kindKey({ kind: 'episode' })).toBe('kind_episode_audio'));
  it('uses the kind otherwise', () => expect(kindKey({ kind: 'book' })).toBe('kind_book'));
});
