'use client';

import { useState } from 'react';
import type { Explore } from '@meridian/contracts';
import { EmptyState, ErrorState, Button, Field, Pill, Skeleton } from '@meridian/ui';
import { format, plural } from '@meridian/i18n';
import { FILTERS, applyFilter, type Filter } from '../lib';
import { useSearch } from '../hooks/useSearch';
import { Browse } from './Browse';
import { ResultRow } from './ResultRow';
import styles from './ExploreClient.module.css';

export function ExploreClient({ locale, t, data, initialQuery }: { locale: string; t: Record<string, string>; data: Explore; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<Filter>('all');
  const { state, retry } = useSearch(query);

  const update = (q: string) => {
    setQuery(q);
    setFilter('all');
    // Keep the address bar in step so Back and sharing work, without a server round trip.
    const url = q.trim() ? `?q=${encodeURIComponent(q)}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  };
  const searching = query.trim().length > 0;

  return (
    <main className={styles.wrap}>
      <h1 className={styles.h1}>{t.title}</h1>
      <div role="search">
        <Field label={t.searchLabel ?? ''} placeholder={t.placeholder} value={query} onChange={(e) => update(e.target.value)} clearLabel={t.clear} onClear={() => update('')} autoComplete="off" enterKeyHint="search" />
      </div>

      {searching ? (
        <section aria-live="polite">
          {state.status === 'ready' ? (
            <>
              <div className={styles.chips} role="group" aria-label={t.filters}>
                {FILTERS.map((f) => (
                  <Pill key={f} selected={filter === f} onClick={() => setFilter(f)}>{t[`chip_${f}`]}</Pill>
                ))}
              </div>
              <ResultList hits={state.hits} filter={filter} q={query.trim()} locale={locale} t={t} />
            </>
          ) : state.status === 'error' ? (
            <ErrorState title={t.errorTitle ?? ''} action={<Button variant="outline" onClick={retry}>{t.retry}</Button>}>{t.errorBody}</ErrorState>
          ) : (
            <div className={styles.loading} aria-busy="true" aria-label={t.searching}>
              {[0, 1, 2, 3].map((i) => <div key={i} className={styles.skelRow}><Skeleton width={44} height={54} /><div className={styles.skelText}><Skeleton width="60%" height={16} /><Skeleton width="40%" height={12} /></div></div>)}
            </div>
          )}
        </section>
      ) : (
        <Browse data={data} locale={locale} t={t} />
      )}
      {!searching && data.isSample ? <p className={styles.note}>{t.sample}</p> : null}
    </main>
  );
}

function ResultList({ hits, filter, q, locale, t }: { hits: import('@meridian/contracts').SearchHit[]; filter: Filter; q: string; locale: string; t: Record<string, string> }) {
  if (hits.length === 0) {
    return <EmptyState title={format(t.noResultsTitle ?? '', { q })}>{t.noResultsBody}</EmptyState>;
  }
  const shown = applyFilter(hits, filter);
  return (
    <div>
      <h2 className={styles.count}>{plural(t, 'resultCount', hits.length, locale, { q })}</h2>
      {shown.length === 0
        ? <EmptyState title={t.noFilterTitle ?? ''}>{t.noFilterBody}</EmptyState>
        : shown.map((h) => <ResultRow key={`${h.kind}:${h.id}`} hit={h} locale={locale} t={t} />)}
    </div>
  );
}
