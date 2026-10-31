import { NewsQuerySchema, type NewsQuery } from '@meridian/contracts';

type SearchParams = Record<string, string | string[] | undefined>;

/** Reads filters from the URL. Anything invalid falls back to the default instead of failing. */
export function parseNewsQuery(sp: SearchParams): NewsQuery {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const parsed = NewsQuerySchema.safeParse({ region: first(sp.region), topic: first(sp.topic), page: first(sp.page) });
  if (parsed.success) return parsed.data;
  // Keep any valid parts. Fixing one bad value should not reset the others.
  const out: Record<string, unknown> = {};
  for (const key of ['region', 'topic', 'page'] as const) {
    const one = NewsQuerySchema.shape[key].safeParse(first(sp[key]));
    if (one.success) out[key] = one.data;
  }
  return NewsQuerySchema.parse(out);
}

export function newsHref(locale: string, q: Partial<NewsQuery>): string {
  const params = new URLSearchParams();
  if (q.region && q.region !== 'africa') params.set('region', q.region);
  if (q.topic && q.topic !== 'all') params.set('topic', q.topic);
  if (q.page && q.page > 1) params.set('page', String(q.page));
  const qs = params.toString();
  return `/${locale}/news${qs ? `?${qs}` : ''}`;
}
