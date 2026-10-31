import { describe, expect, it } from 'vitest';
import { ExploreSchema, SearchResponseSchema } from '@meridian/contracts';
import { exploreFixture } from './mocks/catalogue';
import { mockApi } from './api';

describe('explore sample data', () => {
  it('matches the contract', () => expect(ExploreSchema.safeParse(exploreFixture).success).toBe(true));
  it('every sector has at least one result (no dead-end links)', async () => {
    for (const s of exploreFixture.sectors) {
      const r = await mockApi.search.query(s.label);
      expect(r.hits.length, s.label).toBeGreaterThan(0);
    }
  });
});

describe('mock search', () => {
  it('returns contract-shaped responses', async () => {
    expect(SearchResponseSchema.safeParse(await mockApi.search.query('kora')).success).toBe(true);
  });
  it('finds a company despite a typo', async () => {
    const r = await mockApi.search.query('Kora Frieght');
    expect(r.hits[0]?.id).toBe('kora-freight');
  });
  it('returns nothing for gibberish', async () => expect((await mockApi.search.query('qqqzzz')).hits).toEqual([]));
});
