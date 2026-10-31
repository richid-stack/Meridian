import { describe, expect, it } from 'vitest';
import { NewsPageSchema, StorySchema } from '@meridian/contracts';
import { news } from '@meridian/domain';
import { mockApi } from './api';
import { catalogue } from './mocks/catalogue';
import { homeFixture } from './mocks/home';
import { buildClusters, mockNewsGet, mockNewsList } from './mocks/news';
import { newsFeeds } from './mocks/news-feeds';
import { companiesFixture } from './mocks/profiles';

const NOW = Date.parse('2026-10-31T12:00:00.000Z');

describe('news sample data', () => {
  it('first page matches the contract', () => {
    const page = mockNewsList({ region: 'africa', topic: 'all', page: 1 }, NOW);
    expect(NewsPageSchema.safeParse(page).success).toBe(true);
    expect(page.items).toHaveLength(news.PAGE_SIZE);
    expect(page.more).toBe(true);
  });
  it('every story matches the contract', () => {
    for (const c of buildClusters(NOW)) expect(StorySchema.safeParse(mockNewsGet(c.id, NOW)).success, c.id).toBe(true);
  });
  it('item ids are unique', () => {
    const f = newsFeeds(NOW);
    const ids = [...f.aggregator, ...f.events].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('the Kora corridor story is covered by several outlets', () => {
    const s = mockNewsGet('kora-abidjan-corridor', NOW);
    expect(s.sources.length).toBeGreaterThanOrEqual(2);
    expect(s.mentions.map((m) => m.id)).toEqual(['kora-freight', 'ama-boateng']);
  });
  it('a French story carries its English translation', () => {
    const s = mockNewsGet('freight-gains-ground', NOW);
    expect(s.lang).toBe('fr');
    expect(s.translation?.title).toBe('Cross-border freight gains ground in West Africa');
  });
  it('global stories are not in the Africa feed unless relevant to Africa', () => {
    const ids = mockNewsList({ region: 'africa', topic: 'all', page: 5 }, NOW).items.map((s) => s.id);
    expect(ids).not.toContain('helix-low-power-chips');
    expect(ids).toContain('lumen-battery-plant');
  });
  it('is fresh: newest story is under an hour old', () => {
    const [first] = mockNewsList({ region: 'africa', topic: 'all', page: 1 }, NOW).items;
    expect(NOW - Date.parse(first?.at ?? '')).toBeLessThan(3600_000);
  });
  it('unknown ids are 404', async () => {
    await expect(mockApi.news.get('nope')).rejects.toMatchObject({ status: 404 });
  });
});

describe('no dead story links', () => {
  const all = new Map(buildClusters(NOW).map((c) => [c.id, c]));
  it('every story in search exists, with the same title', () => {
    for (const item of catalogue.filter((c) => c.kind === 'story')) {
      expect(all.get(item.id)?.primary.title, item.id).toBe(item.title);
    }
  });
  it('the Home lead story exists, with the same title', () => {
    expect(all.get(homeFixture.lead.id)?.primary.title).toBe(homeFixture.lead.title);
  });
  it('company news links exist, with the same title', () => {
    for (const c of Object.values(companiesFixture)) for (const n of c.news) expect(all.get(n.id)?.primary.title, n.id).toBe(n.title);
  });
  it('every mention points at a real profile', async () => {
    for (const id of all.keys()) {
      for (const m of mockNewsGet(id, NOW).mentions) {
        const call = m.kind === 'person' ? mockApi.entities.getPerson(m.id) : mockApi.entities.getCompany(m.id);
        await expect(call, m.id).resolves.toBeDefined();
      }
    }
  });
});
