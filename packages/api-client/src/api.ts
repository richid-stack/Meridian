import { HomeSchema, type Home } from '@meridian/contracts';
import { createClient } from './client';
import { homeFixture } from './mocks/home';

/** What the UI is allowed to call. Same shape for the real backend and for sample data. */
export interface Api {
  feed: { getHome(): Promise<Home> };
}

export interface ApiOptions {
  /** Set to talk to the real backend. Leave empty to use built-in sample data. */
  baseUrl?: string;
  getToken?: () => string | null | Promise<string | null>;
}

export const mockApi: Api = {
  feed: { getHome: async () => HomeSchema.parse(homeFixture) },
};

export function createApi({ baseUrl, getToken }: ApiOptions = {}): Api {
  if (!baseUrl) return mockApi;
  const http = createClient({ baseUrl, getToken });
  return { feed: { getHome: () => http.get('/v1/feed/home', HomeSchema) } };
}
