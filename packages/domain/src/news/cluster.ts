import type { NormStory } from './normalize';

export interface Cluster {
  id: string;
  /** The most recent story in the cluster. */
  primary: NormStory;
  /** One story per outlet, primary first. */
  sources: NormStory[];
  topic: string;
  region: string;
  at: number;
  africaRel: boolean;
  africaNote: string | null;
}

const STOP = new Set('the and for with from into over that this are was were has have its new says say after as in on of to a an at by is'.split(' '));

const stem = (w: string): string => w.replace(/(ies)$/, 'y').replace(/(ing|ed|es|s)$/, (m) => (w.length > 5 ? '' : m));

export function tokens(title: string): string[] {
  return title.toLowerCase().replace(/[^a-z0-9\- ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)).map(stem);
}

/** Jaccard similarity of two token lists, 0 to 1. */
export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  let n = 0;
  for (const x of A) if (B.has(x)) n++;
  const union = A.size + B.size - n;
  return union ? n / union : 0;
}

/** Groups near-duplicate headlines of the same topic into one story with several sources. Newest first. */
export function cluster(list: NormStory[], threshold = 0.3): Cluster[] {
  const groups: { topic: string; tokens: string[]; all: NormStory[] }[] = [];
  const sorted = [...list].sort((a, b) => b.at - a.at || a.id.localeCompare(b.id));
  for (const s of sorted) {
    const t = tokens(s.titleEn);
    const hit = groups.find((g) => g.topic === s.topic && jaccard(g.tokens, t) >= threshold);
    if (hit) { hit.all.push(s); hit.tokens = hit.tokens.concat(t); } else groups.push({ topic: s.topic, tokens: t, all: [s] });
  }
  return groups.map((g) => {
    const primary = g.all[0] as NormStory;
    const seen = new Set<string>();
    const sources = g.all.filter((x) => (seen.has(x.source) ? false : (seen.add(x.source), true)));
    return {
      id: primary.id, primary, sources, topic: primary.topic, region: primary.region,
      at: Math.max(...g.all.map((x) => x.at)), africaRel: g.all.some((x) => x.africaRel),
      africaNote: g.all.find((x) => x.africaNote)?.africaNote ?? null,
    };
  });
}
