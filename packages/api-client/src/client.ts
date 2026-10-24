export interface ClientOptions {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
  fetchImpl?: typeof fetch;
}

// TODO(phase5): request(), retry, timeout, abort, error mapping to ApiError.
export function createClient(_opts: ClientOptions) {
  return {};
}
