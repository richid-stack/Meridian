import { describe, expect, it } from 'vitest';
import { CreatePostInputSchema, PostSchema } from '@meridian/contracts';
import { community } from '@meridian/domain';
import { mockApi } from './api';
import { catalogue } from './mocks/catalogue';
import { attachables, mockCreatePost, mockFeed, mockGroup, mockGroups, mockLike, mockMembership, mockVote, sampleAuthorIds } from './mocks/community';
import { peopleFixture } from './mocks/profiles';

const NOW = Date.parse('2026-10-31T12:00:00.000Z');

describe('community sample data', () => {
  it('For you has a live card and four posts of each kind', () => {
    const f = mockFeed('for-you', NOW);
    expect(f.live?.id).toBe('building-across-borders');
    expect(f.posts.map((p) => p.type)).toEqual(['insight', 'question', 'poll', 'insight']);
  });
  it('Following only has people the viewer follows, and no live card', () => {
    const f = mockFeed('following', NOW);
    expect(f.live).toBeNull();
    expect(f.posts.map((p) => p.author.id).sort()).toEqual(['kunle-okafor', 'nia-mensah']);
  });
  it('every author has a profile', () => {
    for (const id of sampleAuthorIds) expect(peopleFixture[id], id).toBeDefined();
  });
  it('every attachment exists in the catalogue', () => {
    const ids = new Set(catalogue.map((c) => `${c.kind}:${c.id}`));
    for (const p of mockFeed('for-you', NOW).posts) if (p.attachment) expect(ids.has(`${p.attachment.kind}:${p.attachment.id}`)).toBe(true);
    const titles = new Map(catalogue.map((c) => [`${c.kind}:${c.id}`, c.title]));
    for (const p of mockFeed('for-you', NOW).posts) if (p.attachment) expect(p.attachment.title).toBe(titles.get(`${p.attachment.kind}:${p.attachment.id}`));
    for (const a of attachables()) expect(ids.has(`${a.kind}:${a.id}`), a.id).toBe(true);
  });
  it('the sample poll adds up to 100 percent', () => {
    const poll = mockFeed('for-you', NOW).posts.find((p) => p.type === 'poll');
    if (poll?.type !== 'poll') throw new Error('no poll');
    expect(community.pollPercents(poll.options.map((o) => o.votes))).toEqual([41, 27, 22, 10]);
    expect(community.totalVotes(poll.options)).toBe(1204);
  });
});

describe('groups', () => {
  it('splits joined and discoverable groups', () => {
    const g = mockGroups();
    expect(g.mine.map((x) => x.id)).toEqual(['logistics', 'accra']);
    expect(g.discover.map((x) => x.id)).toEqual(['fintech', 'angels']);
  });
  it('every group post author has a profile', () => {
    for (const s of [...mockGroups().mine, ...mockGroups().discover]) for (const p of mockGroup(s.id, NOW).posts) expect(peopleFixture[p.author.id], p.id).toBeDefined();
  });
  it('joining changes the member count by one', () => {
    expect(mockMembership('fintech', true).members).toBe(1208);
    expect(mockMembership('logistics', false).members).toBe(2417);
    expect(mockMembership('logistics', true).members).toBe(2418);
  });
  it('restricted groups refuse sample joins without verification', () => {
    expect(() => mockMembership('angels', true)).toThrowError(/Verified investors only/);
  });
  it('unknown groups are 404', async () => {
    await expect(mockApi.groups.get('nope')).rejects.toMatchObject({ status: 404 });
  });
});

describe('like and vote', () => {
  it('like adds one, unlike takes it back', () => {
    expect(mockLike('p-nia-worst-hour', true, NOW)).toEqual({ likes: 341, likedByMe: true });
    expect(mockLike('p-nia-worst-hour', false, NOW)).toEqual({ likes: 340, likedByMe: false });
  });
  it('liking your own new post works', () => expect(mockLike('local-123', true, NOW)).toEqual({ likes: 1, likedByMe: true }));
  it('vote adds one vote and records mine', () => {
    const p = mockVote('p-fatou-constraint', 'currency', NOW);
    if (p.type !== 'poll') throw new Error('no poll');
    expect(p.myVote).toBe('currency');
    expect(community.totalVotes(p.options)).toBe(1205);
  });
  it('vote rejects unknown options', () => expect(() => mockVote('p-fatou-constraint', 'zzz', NOW)).toThrowError(/Unknown option/));
});

describe('createPost', () => {
  const ok = { type: 'insight', text: 'Hello', audience: 'everyone' } as const;
  it('returns a valid post from you', () => {
    const p = mockCreatePost(ok, NOW);
    expect(PostSchema.safeParse(p).success).toBe(true);
    expect(p.author.id).toBe('me');
    expect(p.likes).toBe(0);
  });
  it('builds a poll', () => {
    const p = mockCreatePost({ type: 'poll', text: 'Which?', audience: 'everyone', options: ['A', 'B'], pollDays: 3 }, NOW);
    if (p.type !== 'poll') throw new Error('no poll');
    expect(p.options.map((o) => o.votes)).toEqual([0, 0]);
    expect(Date.parse(p.endsAt) - NOW).toBe(3 * 86400000);
  });
  it('attaches a real item', () => {
    const p = mockCreatePost({ ...ok, attachment: { kind: 'company', id: 'kora-freight' } }, NOW);
    expect(p.attachment?.title).toBe('Kora Freight');
  });
  it('attaches a news story', () => {
    const p = mockCreatePost({ ...ok, attachment: { kind: 'story', id: 'kora-abidjan-corridor' } }, NOW);
    expect(p.attachment).toMatchObject({ kind: 'story', title: 'Kora Freight opens its Abidjan corridor', subtitle: 'West Africa Wire' });
  });
  it('rejects bad input', () => {
    expect(() => mockCreatePost({ ...ok, text: '   ' }, NOW)).toThrow();
    expect(() => mockCreatePost({ ...ok, type: 'poll' }, NOW)).toThrow();
    expect(() => mockCreatePost({ ...ok, audience: 'group' }, NOW)).toThrow();
    expect(() => mockCreatePost({ ...ok, attachment: { kind: 'company', id: 'nope' } }, NOW)).toThrow(/Unknown attachment/);
  });
  it('blocks return promises on posts about a deal', () => {
    expect(() => mockCreatePost({ ...ok, text: 'Guaranteed returns!', attachment: { kind: 'deal', id: 'aya-health-seed' } }, NOW)).toThrowError(/must not promise returns/);
  });
  it('the contract and the domain draft rules agree on the limits', () => {
    expect(CreatePostInputSchema.safeParse({ ...ok, text: 'a'.repeat(500) }).success).toBe(true);
    expect(CreatePostInputSchema.safeParse({ ...ok, text: 'a'.repeat(501) }).success).toBe(false);
  });
});
