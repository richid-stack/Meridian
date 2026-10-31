import {
  CompanyProfileSchema, ExploreSchema, HomeSchema, PersonProfileSchema, SearchResponseSchema,
  type CompanyProfile, type Explore, type Home, type PersonProfile, type SearchResponse,
} from '@meridian/contracts';
import { entities } from '@meridian/domain';
import { createClient } from './client';
import { ApiError } from './errors';
import { catalogue, exploreFixture } from './mocks/catalogue';
import { homeFixture } from './mocks/home';
import { companiesFixture, peopleFixture } from './mocks/profiles';

/** What the UI is allowed to call. Same shape for the real backend and for sample data. */
export interface Api {
  feed: { getHome(): Promise<Home> };
  explore: { get(): Promise<Explore> };
  search: { query(q: string, opts?: { signal?: AbortSignal }): Promise<SearchResponse> };
  entities: { getPerson(id: string): Promise<PersonProfile>; getCompany(id: string): Promise<CompanyProfile> };
}

export interface ApiOptions {
  /** Set to talk to the real backend. Leave empty to use built-in sample data. */
  baseUrl?: string;
  getToken?: () => string | null | Promise<string | null>;
}

function found<T>(table: Record<string, T>, id: string): T {
  const hit = Object.prototype.hasOwnProperty.call(table, id) ? table[id] : undefined;
  if (!hit) throw new ApiError(404, 'not_found', `No profile "${id}"`);
  return hit;
}

export const mockApi: Api = {
  feed: { getHome: async () => HomeSchema.parse(homeFixture) },
  explore: { get: async () => ExploreSchema.parse(exploreFixture) },
  search: {
    query: async (q) => ({ query: q, hits: entities.search(catalogue, q).map((c) => c.hit) }),
  },
  entities: {
    getPerson: async (id) => PersonProfileSchema.parse(found(peopleFixture, id)),
    getCompany: async (id) => CompanyProfileSchema.parse(found(companiesFixture, id)),
  },
};

export function createApi({ baseUrl, getToken }: ApiOptions = {}): Api {
  if (!baseUrl) return mockApi;
  const http = createClient({ baseUrl, getToken });
  const id = encodeURIComponent;
  return {
    feed: { getHome: () => http.get('/v1/feed/home', HomeSchema) },
    explore: { get: () => http.get('/v1/explore', ExploreSchema) },
    search: {
      query: (q, opts) => http.get(`/v1/search?q=${encodeURIComponent(q)}`, SearchResponseSchema, { signal: opts?.signal }),
    },
    entities: {
      getPerson: (pid) => http.get(`/v1/people/${id(pid)}`, PersonProfileSchema),
      getCompany: (cid) => http.get(`/v1/companies/${id(cid)}`, CompanyProfileSchema),
    },
  };
}
