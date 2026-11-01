import { z } from 'zod';
import { InvestmentSchema, PostSchema, type Investment, type Post } from '@meridian/contracts';

/**
 * Sample mode only: keeps likes, votes, group joins and the person's own posts in this browser so every
 * interaction works end to end before the backend exists. Replaced by the real API; never used when a backend URL is set.
 */
const KEY = 'meridian:sample:v1';
const MAX_POSTS = 50;

export interface SampleState {
  liked: string[];
  votes: Record<string, string>;
  groups: Record<string, boolean>;
  posts: { post: Post; groupId?: string }[];
  /** Commitments made in this browser (sample payments only). */
  investments: Investment[];
  /** Rounds watched (true) or unwatched (false) by this browser, on top of the starting list. */
  watch: Record<string, boolean>;
  alerts?: boolean;
}

const StoredSchema = z.object({
  liked: z.array(z.string()).default([]),
  votes: z.record(z.string()).default({}),
  groups: z.record(z.boolean()).default({}),
  posts: z.array(z.object({ post: z.unknown(), groupId: z.string().optional() })).default([]),
  investments: z.array(z.unknown()).default([]),
  watch: z.record(z.boolean()).default({}),
  alerts: z.boolean().optional(),
});

const empty = (): SampleState => ({ liked: [], votes: {}, groups: {}, posts: [], investments: [], watch: {} });

let memory: SampleState | null = null;

/** Never throws: private windows and blocked storage fall back to memory for this page. */
export function readSample(): SampleState {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = StoredSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return empty();
    const posts = parsed.data.posts.flatMap((p) => {
      const ok = PostSchema.safeParse(p.post);
      return ok.success ? [{ post: ok.data, ...(p.groupId ? { groupId: p.groupId } : {}) }] : [];
    });
    const investments = parsed.data.investments.flatMap((i) => {
      const ok = InvestmentSchema.safeParse(i);
      return ok.success ? [ok.data] : [];
    });
    return { ...parsed.data, posts, investments };
  } catch {
    return empty();
  }
}

export function updateSample(fn: (s: SampleState) => SampleState): void {
  const next = fn(readSample());
  next.posts = next.posts.slice(0, MAX_POSTS);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    memory = null;
  } catch {
    memory = next;
  }
}

export function addSamplePost(post: Post, groupId?: string): void {
  updateSample((s) => ({ ...s, posts: [{ post, ...(groupId ? { groupId } : {}) }, ...s.posts] }));
}

/** A group's joined state and member count with this browser's changes applied. */
export function applyMembership(g: { id: string; joined: boolean; members: number }): { joined: boolean; members: number } {
  const mine = readSample().groups[g.id];
  if (mine === undefined || mine === g.joined) return { joined: g.joined, members: g.members };
  return { joined: mine, members: g.members + (mine ? 1 : -1) };
}

export function addSampleInvestment(inv: Investment): void {
  updateSample((s) => ({ ...s, investments: [...s.investments, inv] }));
}

export function setSampleWatch(dealId: string, on: boolean): void {
  updateSample((s) => ({ ...s, watch: { ...s.watch, [dealId]: on } }));
}

export function setSampleAlerts(on: boolean): void {
  updateSample((s) => ({ ...s, alerts: on }));
}
