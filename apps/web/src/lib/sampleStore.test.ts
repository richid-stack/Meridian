import { beforeEach, describe, expect, it } from 'vitest';
import { addSamplePost, applyMembership, readSample, updateSample } from './sampleStore';

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(), key: () => null, length: 0,
  } as Storage;
});

const post = { type: 'insight', id: 'local-1', author: { id: 'me', name: 'You', initials: 'Y', role: '', verified: false }, at: '2026-10-31T12:00:00.000Z', text: 'Hi', replies: 0, reposts: 0, likes: 0, likedByMe: false } as const;

describe('sample store', () => {
  it('starts empty', () => expect(readSample()).toEqual({ liked: [], votes: {}, groups: {}, posts: [] }));
  it('saves and reads back', () => {
    updateSample((s) => ({ ...s, liked: ['a'], votes: { p: 'o1' } }));
    expect(readSample()).toMatchObject({ liked: ['a'], votes: { p: 'o1' } });
  });
  it('keeps new posts first', () => {
    addSamplePost(post);
    addSamplePost({ ...post, id: 'local-2' }, 'logistics');
    expect(readSample().posts.map((p) => [p.post.id, p.groupId])).toEqual([['local-2', 'logistics'], ['local-1', undefined]]);
  });
  it('ignores corrupt storage', () => {
    store.set('meridian:sample:v1', '{not json');
    expect(readSample().posts).toEqual([]);
    store.set('meridian:sample:v1', JSON.stringify({ liked: 5 }));
    expect(readSample().liked).toEqual([]);
  });
  it('drops stored posts that no longer match the contract', () => {
    store.set('meridian:sample:v1', JSON.stringify({ posts: [{ post: { id: 'x' } }, { post }] }));
    expect(readSample().posts.map((p) => p.post.id)).toEqual(['local-1']);
  });
  it('applies a join on top of a group', () => {
    updateSample((s) => ({ ...s, groups: { fintech: true, logistics: false, accra: true } }));
    expect(applyMembership({ id: 'fintech', joined: false, members: 1207 })).toEqual({ joined: true, members: 1208 });
    expect(applyMembership({ id: 'logistics', joined: true, members: 2418 })).toEqual({ joined: false, members: 2417 });
    expect(applyMembership({ id: 'accra', joined: true, members: 3905 })).toEqual({ joined: true, members: 3905 });
    expect(applyMembership({ id: 'angels', joined: false, members: 642 })).toEqual({ joined: false, members: 642 });
  });
});
