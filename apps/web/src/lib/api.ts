import { createApi } from '@meridian/api-client';

/** Sample data until NEXT_PUBLIC_API_BASE_URL is set. */
export const api = createApi({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL });
