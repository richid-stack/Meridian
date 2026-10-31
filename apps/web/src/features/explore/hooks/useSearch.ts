'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SearchHit } from '@meridian/contracts';
import { api } from '@/lib/api';

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; hits: SearchHit[] }
  | { status: 'error' };

/** Debounced search. Cancels the previous request and ignores stale answers. */
export function useSearch(query: string, delayMs = 150) {
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setState({ status: 'idle' });
      return;
    }
    setState((s) => (s.status === 'ready' ? s : { status: 'loading' }));
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      api.search
        .query(q, { signal: ctrl.signal })
        .then((r) => { if (!ctrl.signal.aborted) setState({ status: 'ready', hits: r.hits }); })
        .catch(() => { if (!ctrl.signal.aborted) setState({ status: 'error' }); });
    }, delayMs);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [query, delayMs, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
