import { NewsPageSchema, StorySchema, type NewsPage, type NewsQuery, type Story } from '@meridian/contracts';
import { news } from '@meridian/domain';
import { ApiError } from '../errors';
import { newsFeeds } from './news-feeds';

/** Names the sample feeds tag, mapped to profile ids. The real backend resolves mentions during ingestion. */
const MENTIONS: Record<string, { id: string; kind: 'person' | 'company' }> = {
  'Kora Freight': { id: 'kora-freight', kind: 'company' },
  'Ama Boateng': { id: 'ama-boateng', kind: 'person' },
  'Aya Health': { id: 'aya-health', kind: 'company' },
  'Helix Semiconductors': { id: 'helix-semiconductors', kind: 'company' },
  'Aurora Retail Group': { id: 'aurora-retail-group', kind: 'company' },
  'Lumen Grid': { id: 'lumen-grid', kind: 'company' },
};

const iso = (ms: number) => new Date(ms).toISOString();

function toStory(c: news.Cluster): Story {
  const p = c.primary;
  const mentions = p.entities.flatMap((name) => { const m = MENTIONS[name]; return m ? [{ ...m, name }] : []; });
  return StorySchema.parse({
    id: c.id, title: p.title, snippet: p.snippet, source: p.source, url: p.url, at: iso(c.at), region: c.region, topic: c.topic, lang: p.lang,
    ...(p.translation ? { translation: p.translation } : {}), africaRel: c.africaRel, ...(c.africaNote ? { africaNote: c.africaNote } : {}),
    sources: c.sources.map((s) => ({ source: s.source, title: s.title, url: s.url, at: iso(s.at) })), mentions,
  });
}

export function buildClusters(now: number): news.Cluster[] {
  const feeds = newsFeeds(now);
  return news.cluster([...feeds.aggregator.map(news.normalizeAggregator), ...feeds.events.map(news.normalizeEvents)]);
}

export function mockNewsList(q: NewsQuery, now = Date.now()): NewsPage {
  const r = news.queryClusters(buildClusters(now), q);
  return NewsPageSchema.parse({ items: r.items.map(toStory), total: r.total, more: r.more, updatedAt: iso(now) });
}

export function mockNewsGet(id: string, now = Date.now()): Story {
  const c = buildClusters(now).find((x) => x.id === id);
  if (!c) throw new ApiError(404, 'not_found', `No story "${id}"`);
  return toStory(c);
}
