import { AFRICAN_REGIONS, GLOBAL_REGIONS } from './normalize';
import type { Cluster } from './cluster';

export type RegionFilter = 'africa' | 'west' | 'east' | 'south' | 'north' | 'global';
export const PAGE_SIZE = 6;
/** Each extra source counts as 15 minutes of freshness when ranking. */
const COVERAGE_BOOST_MS = 15 * 60 * 1000;

const has = (list: readonly string[], v: string): boolean => list.includes(v);

export function inRegion(c: Pick<Cluster, 'region' | 'africaRel'>, r: RegionFilter): boolean {
  if (r === 'africa') return has(AFRICAN_REGIONS, c.region) || c.africaRel;
  if (r === 'global') return has(GLOBAL_REGIONS, c.region);
  return c.region === r || c.region === 'pan';
}

export interface NewsQueryInput { region: RegionFilter; topic: string; page: number }

/** Filters, ranks (recency plus coverage) and pages clusters. `page` 1 returns the first PAGE_SIZE items; page 2 the first two pages, and so on. */
export function queryClusters(all: Cluster[], q: NewsQueryInput): { items: Cluster[]; total: number; more: boolean } {
  const rank = (c: Cluster) => c.at + (c.sources.length - 1) * COVERAGE_BOOST_MS;
  const f = all.filter((c) => inRegion(c, q.region) && (q.topic === 'all' || c.topic === q.topic)).sort((a, b) => rank(b) - rank(a) || a.id.localeCompare(b.id));
  const end = Math.max(1, q.page) * PAGE_SIZE;
  return { items: f.slice(0, end), total: f.length, more: f.length > end };
}
