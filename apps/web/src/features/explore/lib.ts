import type { SearchHit, SearchKind } from '@meridian/contracts';

export type Filter = 'all' | Exclude<SearchKind, 'topic'>;
export const FILTERS: Filter[] = ['all', 'person', 'company', 'book', 'episode', 'deal', 'story'];

export function applyFilter(hits: SearchHit[], filter: Filter): SearchHit[] {
  return filter === 'all' ? hits : hits.filter((h) => h.kind === filter);
}

export function hrefFor(hit: Pick<SearchHit, 'kind' | 'id' | 'title'>, locale: string): string {
  switch (hit.kind) {
    case 'person': return `/${locale}/people/${hit.id}`;
    case 'company': return `/${locale}/companies/${hit.id}`;
    case 'book': return `/${locale}/books/${hit.id}`;
    case 'episode': return `/${locale}/episodes/${hit.id}`;
    case 'deal': return `/${locale}/capital/deals/${hit.id}`;
    case 'story': return `/${locale}/news/${hit.id}`;
    case 'topic': return `/${locale}/explore?q=${encodeURIComponent(hit.title)}`;
  }
}

/** Translation key for the kind label shown at the end of a result row. */
export function kindKey(hit: Pick<SearchHit, 'kind' | 'media'>): string {
  return hit.kind === 'episode' ? `kind_episode_${hit.media ?? 'audio'}` : `kind_${hit.kind}`;
}
