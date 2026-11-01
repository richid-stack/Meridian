import {
  CommunityFeedSchema, CreatePostInputSchema, GroupListSchema, GroupSchema, LikeResultSchema, MembershipResultSchema, PostSchema,
  type Attachment, type Author, type CommunityFeed, type CreatePostInput, type Group, type GroupList, type LikeResult, type MembershipResult, type Post,
} from '@meridian/contracts';
import { community } from '@meridian/domain';
import { ApiError } from '../errors';
import { catalogue } from './catalogue';
import { mockNewsGet } from './news';

// Fictional sample data. Real posts come from real members. Counts are invented.

const iso = (ms: number) => new Date(ms).toISOString();
const ago = (now: number, minutes: number) => iso(now - minutes * 60000);

const AUTHORS: Record<string, Author> = {
  'nia-mensah': { id: 'nia-mensah', name: 'Nia Mensah', initials: 'NM', role: 'CEO, Aya Health', verified: true },
  'tunde-dlamini': { id: 'tunde-dlamini', name: 'Tunde Dlamini', initials: 'TD', role: 'CFO, Zuri Energy', verified: false },
  'fatou-keita': { id: 'fatou-keita', name: 'Fatou Keita', initials: 'FK', role: 'Head of operations, Kora Freight', verified: false },
  'kunle-okafor': { id: 'kunle-okafor', name: 'Kunle Okafor', initials: 'KO', role: 'Partner, Sahel Ventures', verified: true },
};
export const ME: Author = { id: 'me', name: 'You', initials: 'Y', role: '', verified: false };

/** People the sample viewer follows (drives the Following tab). */
const FOLLOWING = new Set(['nia-mensah', 'kunle-okafor']);

const AYA_DEAL: Attachment = { kind: 'deal', id: 'aya-health-seed', title: 'Aya Health seed round', subtitle: '$1.28M of $2M, 11 days left', pct: 64 };

function feedPosts(now: number): Post[] {
  const a = AUTHORS as Record<string, Author>;
  return [
    { type: 'insight', id: 'p-nia-worst-hour', author: a['nia-mensah'] as Author, at: ago(now, 120), likedByMe: false, replies: 24, reposts: 61, likes: 340,
      text: 'We spent 14 months building for clinics with no reliable power. The lesson: design for the worst hour of the day, not the average one.' },
    { type: 'question', id: 'p-tunde-pricing', author: a['tunde-dlamini'] as Author, at: ago(now, 300), likedByMe: false, replies: 86, reposts: 12, likes: 129,
      text: 'How do you price a product when your customers pay in cedis but your costs are in dollars?',
      topAnswer: { by: 'Kunle Okafor, Sahel Ventures', text: 'Index your price to a dollar band, review it every quarter, and tell customers the rule upfront.' } },
    { type: 'poll', id: 'p-fatou-constraint', author: a['fatou-keita'] as Author, at: ago(now, 480), likedByMe: false, replies: 0, reposts: 0, likes: 0,
      text: 'What is the biggest constraint on scaling in West Africa right now?', endsAt: iso(now + 2 * 86400000),
      options: [{ id: 'capital', label: 'Access to capital', votes: 494 }, { id: 'talent', label: 'Hiring senior talent', votes: 325 }, { id: 'currency', label: 'Currency risk', votes: 265 }, { id: 'regulation', label: 'Regulation', votes: 120 }] },
    { type: 'insight', id: 'p-kunle-aya', author: a['kunle-okafor'] as Author, at: ago(now, 1440), likedByMe: false, replies: 18, reposts: 34, likes: 212,
      text: 'Backing this one personally. The founders ship, and the clinics they serve had no option before.', attachment: AYA_DEAL },
  ];
}

const LIVE = (now: number) => ({ id: 'building-across-borders', title: 'Building a logistics network across borders', blurb: 'Ask me anything with Ama Boateng, founder of Kora Freight.', listeners: 312, startedAt: ago(now, 12) });

function groupPosts(now: number, rows: [string, number, string][], groupId: string): Post[] {
  return rows.map(([author, minutes, text], i) => ({
    type: 'insight' as const, id: `g-${groupId}-${i}`, author: AUTHORS[author] as Author, at: ago(now, minutes), likedByMe: false, replies: 2 + i, reposts: i, likes: 8 + i * 3, text,
  }));
}

interface GroupRow { id: string; name: string; letter: string; members: number; blurb: string; joined: boolean; restricted: boolean; pinned: string; posts: [string, number, string][] }
const GROUPS: GroupRow[] = [
  { id: 'logistics', name: 'Logistics and supply chain', letter: 'L', members: 2418, blurb: 'Freight, ports, warehousing, and last-mile', joined: true, restricted: false,
    pinned: 'Welcome. Share corridor updates, ask about customs, and keep it practical.',
    posts: [['nia-mensah', 180, 'Rural clinics taught us that cold-chain reliability is a logistics problem first.'], ['fatou-keita', 1440, 'Load matching improved once we began tracking empty return trips by route.'], ['tunde-dlamini', 2880, 'Does anyone have a reliable customs broker contact for Takoradi?']] },
  { id: 'fintech', name: 'Fintech founders under 40', letter: 'F', members: 1207, blurb: 'Building money products across Africa', joined: false, restricted: false,
    pinned: 'A place to swap lessons on licensing, partnerships, and raising your first round.',
    posts: [['kunle-okafor', 300, 'Most early fintech pitches underestimate compliance cost. Budget for it from day one.'], ['tunde-dlamini', 1440, 'Collections improved when we moved repayment reminders to mobile money.']] },
  { id: 'angels', name: 'Angel investors circle', letter: 'A', members: 642, blurb: 'Deal flow and diligence for verified investors', joined: false, restricted: true,
    pinned: 'Verified investors only. Share diligence notes, not promises of returns.',
    posts: [['kunle-okafor', 360, 'When reading a SAFE, check the valuation cap against the last priced round.'], ['nia-mensah', 2880, 'Founders: investors read your risks section first. Write it honestly.']] },
  { id: 'accra', name: 'Accra startup scene', letter: 'C', members: 3905, blurb: 'Events, co-working, and introductions in Accra', joined: true, restricted: false,
    pinned: 'Monthly founder meetups and open office hours are posted here first.',
    posts: [['fatou-keita', 240, 'Hosting open office hours on Thursday. Bring your operations questions.']] },
];

const toGroup = (g: GroupRow, now: number): Group => GroupSchema.parse({ ...g, posts: groupPosts(now, g.posts, g.id) });

export function mockFeed(tab: 'for-you' | 'following', now = Date.now()): CommunityFeed {
  const posts = feedPosts(now).filter((p) => tab === 'for-you' || FOLLOWING.has(p.author.id));
  return CommunityFeedSchema.parse({ live: tab === 'for-you' ? LIVE(now) : null, posts });
}

export function mockGroups(): GroupList {
  const summary = ({ pinned: _p, posts: _q, ...s }: GroupRow) => s;
  return GroupListSchema.parse({ mine: GROUPS.filter((g) => g.joined).map(summary), discover: GROUPS.filter((g) => !g.joined).map(summary) });
}

export function mockGroup(id: string, now = Date.now()): Group {
  const g = GROUPS.find((x) => x.id === id);
  if (!g) throw new ApiError(404, 'not_found', `No group "${id}"`);
  return toGroup(g, now);
}

export function mockMembership(id: string, joined: boolean): MembershipResult {
  const g = GROUPS.find((x) => x.id === id);
  if (!g) throw new ApiError(404, 'not_found', `No group "${id}"`);
  if (joined && g.restricted) throw new ApiError(403, 'verification_required', 'Verified investors only');
  return MembershipResultSchema.parse({ joined, members: g.members + (joined === g.joined ? 0 : joined ? 1 : -1) });
}

export function mockLike(postId: string, liked: boolean, now = Date.now()): LikeResult {
  const all = [...feedPosts(now), ...GROUPS.flatMap((g) => groupPosts(now, g.posts, g.id))];
  const p = all.find((x) => x.id === postId);
  return LikeResultSchema.parse({ likes: (p ? p.likes : 0) + (liked ? 1 : 0), likedByMe: liked });
}

export function mockVote(postId: string, optionId: string, now = Date.now()): Post {
  const p = feedPosts(now).find((x) => x.id === postId);
  if (!p || p.type !== 'poll') throw new ApiError(404, 'not_found', `No poll "${postId}"`);
  if (!p.options.some((o) => o.id === optionId)) throw new ApiError(422, 'invalid', 'Unknown option');
  return PostSchema.parse({ ...p, options: community.addVote(p.options, optionId), myVote: optionId });
}

/** Validates like the server will, then returns the post the server would. Nothing is stored. */
export function mockCreatePost(input: CreatePostInput, now = Date.now()): Post {
  const v = CreatePostInputSchema.safeParse(input);
  if (!v.success) throw new ApiError(422, 'invalid', v.error.issues[0]?.message ?? 'Invalid post');
  const d = v.data;
  if (d.attachment?.kind === 'deal' && community.findReturnPromise(d.text)) throw new ApiError(422, 'return_promise', 'Posts about investments must not promise returns');
  const item = d.attachment ? resolveAttachment(d.attachment) : undefined;
  if (d.attachment && !item) throw new ApiError(422, 'invalid', 'Unknown attachment');
  const common = { id: `local-${now}`, author: ME, at: iso(now), text: d.text, replies: 0, reposts: 0, likes: 0, likedByMe: false, ...(item ? { attachment: item } : {}) };
  if (d.type === 'poll') {
    return PostSchema.parse({ ...common, type: 'poll', options: (d.options ?? []).map((label, i) => ({ id: `o${i + 1}`, label, votes: 0 })), endsAt: iso(now + (d.pollDays ?? 3) * 86400000) });
  }
  return PostSchema.parse({ ...common, type: d.type });
}

function resolveAttachment(a: { kind: Attachment['kind']; id: string }): Attachment | undefined {
  if (a.kind === 'story') {
    try { const s = mockNewsGet(a.id); return { kind: 'story', id: s.id, title: s.title, subtitle: s.source }; } catch { return undefined; }
  }
  return attachables().find((x) => x.kind === a.kind && x.id === a.id);
}

export function attachables(): Attachment[] {
  const out: Attachment[] = [];
  for (const c of catalogue) {
    if (c.kind === 'company') out.push({ kind: 'company', id: c.id, title: c.title, subtitle: c.subtitle ?? '' });
    if (c.kind === 'book') out.push({ kind: 'book', id: c.id, title: c.title, subtitle: c.subtitle ?? '' });
    if (c.kind === 'deal') out.push({ kind: 'deal', id: c.id, title: c.title, subtitle: c.subtitle ?? '', ...(c.hit.pct !== undefined ? { pct: c.hit.pct } : {}) });
  }
  return out;
}

export const sampleAuthorIds = Object.keys(AUTHORS);
