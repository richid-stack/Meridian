import type { ZodType } from 'zod';
import { ApiError } from './errors';

export interface ClientOptions {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
  fetchImpl?: typeof fetch;
}

/** Minimal typed HTTP client. Every response is validated against its contract schema. */
export function createClient({ baseUrl, getToken, fetchImpl }: ClientOptions) {
  const doFetch = fetchImpl ?? fetch;
  return {
    async get<T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> {
      const token = getToken ? await getToken() : null;
      const res = await doFetch(`${baseUrl}${path}`, {
        ...init,
        headers: { accept: 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...init?.headers },
      });
      if (!res.ok) throw new ApiError(res.status, 'http_error', `GET ${path} failed with ${res.status}`);
      return schema.parse(await res.json());
    },
  };
}
export type Client = ReturnType<typeof createClient>;
