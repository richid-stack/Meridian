import { ExploreSchema, HomeSchema, SearchResponseSchema, type Explore, type Home, type SearchResponse } from '@meridian/contracts';
import { entities } from '@meridian/domain';
import { createClient } from './client';
import { catalogue, exploreFixture } from './mocks/catalogue';
import { homeFixture } from './mocks/home';

/** What the UI is allowed to call. Same shape for the real backend and for sample data. */
export interface Api {
  feed: { getHome(): Promise<Home> };
  explore: { get(): Promise<Explore> };
  search: { query(q: string, opts?: { signal?: AbortSignal }): Promise<SearchResponse> };
}

export interface ApiOptions {
  /** Set to talk to the real backend. Leave empty to use built-in sample data. */
  baseUrl?: string;
  getToken?: () => string | null | Promise<string | null>;
}

export const mockApi: Api = {
  feed: { getHome: async () => HomeSchema.parse(homeFixture) },
  explore: { get: async () => ExploreSchema.parse(exploreFixture) },
  search: {
    query: async (q) => ({ query: q, hits: entities.search(catalogue, q).map((c) => c.hit) }),
  },
};

export function createApi({ baseUrl, getToken }: ApiOptions = {}): Api {
  if (!baseUrl) return mockApi;
  const http = createClient({ baseUrl, getToken });
  return {
    feed: { getHome: () => http.get('/v1/feed/home', HomeSchema) },
    explore: { get: () => http.get('/v1/explore', ExploreSchema) },
    search: {
      query: (q, opts) => http.get(`/v1/search?q=${encodeURIComponent(q)}`, SearchResponseSchema, { signal: opts?.signal }),
    },
  };
}
