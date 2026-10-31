/** Typo-tolerant, accent-insensitive search over a small catalogue. Pure; runs in the browser or on the server. */

export interface Searchable {
  kind: string;
  id: string;
  title: string;
  subtitle: string;
  /** Extra words that should match (sector, city, role...). */
  text: string;
  /** Ranking weight: people and companies rank above the rest. */
  boost: number;
}

/** Lowercase, strip accents and punctuation, split into words. */
export function normalize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Optimal string alignment distance: edits and adjacent swaps ("frieght" is 1 away from "freight"). */
export function osa(a: string, b: string): number {
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 1; j <= b.length; j++) (d[0] as number[])[j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const row = d[i] as number[];
      const prev = d[i - 1] as number[];
      row[j] = Math.min((prev[j] as number) + 1, (row[j - 1] as number) + 1, (prev[j - 1] as number) + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        row[j] = Math.min(row[j] as number, ((d[i - 2] as number[])[j - 2] as number) + 1);
      }
    }
  }
  return (d[a.length] as number[])[b.length] as number;
}

function bestMatch(q: string, keys: string[]): number {
  let best = 0;
  for (const k of keys) {
    if (k === q) return 3;
    if (k.startsWith(q)) best = Math.max(best, 2.4);
    else if (q.length > 2 && k.includes(q)) best = Math.max(best, 1.2);
    else if (q.length >= 4 && k.length >= 4) {
      const max = q.length >= 7 ? 2 : 1;
      if (osa(q, k) <= max) best = Math.max(best, 1.8);
    }
  }
  return best;
}

/** Sum of the best match per query word. Every query word must match something, otherwise 0. */
export function tokenScore(keys: string[], query: string[]): number {
  let total = 0;
  for (const q of query) {
    const m = bestMatch(q, keys);
    if (m === 0) return 0;
    total += m;
  }
  return total;
}

export function score(item: Searchable, query: string[]): number {
  const all = tokenScore(normalize(`${item.title} ${item.subtitle} ${item.text}`), query);
  if (all === 0) return 0;
  const titleTokens = normalize(item.title);
  const title = tokenScore(titleTokens, query);
  const prefix = titleTokens.join(' ').startsWith(query.join(' ')) ? 3 : 0;
  return (all + title * 2 + prefix) * item.boost;
}

export function search<T extends Searchable>(items: T[], q: string, limit = 14): T[] {
  const query = normalize(q);
  if (query.length === 0) return [];
  return items
    .map((it) => ({ it, s: score(it, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.it);
}
