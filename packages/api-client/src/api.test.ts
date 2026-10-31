import { describe, expect, it } from 'vitest';
import { FeedItemSchema, HomeSchema } from '@meridian/contracts';
import { homeFixture } from './mocks/home';
import { createApi } from './api';

describe('sample data', () => {
  it('matches the Home contract', () => expect(HomeSchema.safeParse(homeFixture).success).toBe(true));
  it('covers every feed item kind', () => {
    const kinds = new Set(homeFixture.forYou.map((i) => i.kind));
    expect([...kinds].sort()).toEqual(['book', 'interview', 'question', 'raise']);
  });
  it('rejects an unknown feed item kind', () => expect(FeedItemSchema.safeParse({ kind: 'nope', id: '1' }).success).toBe(false));
});

describe('createApi', () => {
  it('uses sample data without a base url', async () => {
    const home = await createApi().feed.getHome();
    expect(home.markets.ticks.length).toBeGreaterThan(0);
  });
  it('calls the backend and validates the response when a base url is set', async () => {
    const calls: string[] = [];
    const fetchImpl = (async (url: string) => {
      calls.push(url);
      return new Response(JSON.stringify(homeFixture), { status: 200 });
    }) as unknown as typeof fetch;
    const { createClient } = await import('./client');
    const http = createClient({ baseUrl: 'http://x', fetchImpl });
    await http.get('/v1/feed/home', HomeSchema);
    expect(calls).toEqual(['http://x/v1/feed/home']);
  });
});
