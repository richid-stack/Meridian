/** Raw feed shapes from two provider kinds, and the one internal shape they are turned into. Pure, no I/O. */

export const AFRICAN_REGIONS = ['west', 'east', 'south', 'north', 'pan'] as const;
export const GLOBAL_REGIONS = ['europe', 'asia', 'americas'] as const;
export const TOPICS = ['markets', 'startups', 'fintech', 'energy', 'health', 'logistics', 'policy', 'tech', 'retail'] as const;

/** Provider kind A: an aggregator with one language per item. */
export interface RawAggregatorItem {
  id: string;
  source: { name: string };
  title: string;
  description?: string;
  url: string;
  publishedAt: string;
  category?: string;
  region?: string;
  tags?: string[];
  language?: string;
  africaRel?: boolean;
  africaNote?: string;
}

/** Provider kind B: an events feed with per-language titles and summaries. */
export interface RawEventsItem {
  id: string;
  src: string;
  title: Record<string, string>;
  summary?: Record<string, string>;
  link: string;
  pub: string;
  cat?: string;
  loc?: string;
  ents?: string[];
  lang?: string;
}

export interface NormStory {
  id: string;
  title: string;
  /** English title, used for clustering whatever the display language is. */
  titleEn: string;
  snippet: string;
  source: string;
  url: string;
  at: number;
  region: string;
  topic: string;
  lang: string;
  entities: string[];
  africaRel: boolean;
  africaNote: string | null;
  translation: { title: string; snippet: string } | null;
}

export function normalizeAggregator(r: RawAggregatorItem): NormStory {
  return {
    id: r.id, title: r.title, titleEn: r.title, snippet: r.description ?? '', source: r.source.name || 'Unknown source', url: r.url,
    at: Date.parse(r.publishedAt), region: r.region ?? 'pan', topic: r.category ?? 'markets', lang: r.language ?? 'en',
    entities: r.tags ?? [], africaRel: Boolean(r.africaRel), africaNote: r.africaNote ?? null, translation: null,
  };
}

export function normalizeEvents(r: RawEventsItem): NormStory {
  const lang = r.lang ?? 'en';
  const titleEn = r.title.en ?? Object.values(r.title)[0] ?? '';
  const snippetEn = r.summary?.en ?? '';
  return {
    id: r.id, title: r.title[lang] ?? titleEn, titleEn, snippet: r.summary?.[lang] ?? snippetEn, source: r.src, url: r.link,
    at: Date.parse(r.pub), region: r.loc ?? 'pan', topic: r.cat ?? 'markets', lang, entities: r.ents ?? [], africaRel: false, africaNote: null,
    translation: lang === 'en' ? null : { title: titleEn, snippet: snippetEn },
  };
}
