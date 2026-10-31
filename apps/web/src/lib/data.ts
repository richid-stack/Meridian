import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ApiError } from '@meridian/api-client';
import { api } from './api';

/** Fetches once per request and turns a 404 from the API into the designed not-found page. */
async function orNotFound<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export const getPerson = cache((id: string) => orNotFound(() => api.entities.getPerson(id)));
export const getCompany = cache((id: string) => orNotFound(() => api.entities.getCompany(id)));
