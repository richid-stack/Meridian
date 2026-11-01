'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { DealSummary } from '@meridian/contracts';
import { deals, money } from '@meridian/domain';
import { format, plural } from '@meridian/i18n';
import { buttonClass, EmptyState, Switch } from '@meridian/ui';
import { api } from '@/lib/api';
import { capitalHref, dealHref } from '@/lib/capital';
import { SAMPLE_MODE } from '@/lib/sample';
import { readSample, setSampleAlerts, setSampleWatch } from '@/lib/sampleStore';
import styles from './Watchlist.module.css';

interface Props { locale: string; nl: string; now: number; t: Record<string, string>; rounds: DealSummary[]; watching: string[]; alerts: boolean }

export function WatchlistView({ locale, nl, now, t, rounds, watching, alerts: baseAlerts }: Props) {
  const [ids, setIds] = useState(watching);
  const [alerts, setAlerts] = useState(baseAlerts);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!SAMPLE_MODE) return;
    const mine = readSample();
    setIds(deals.effectiveWatch(watching, mine.watch));
    if (mine.alerts !== undefined) setAlerts(mine.alerts);
  }, [watching]);

  const unwatch = async (id: string) => {
    const before = ids;
    setIds(ids.filter((x) => x !== id));
    try {
      const r = await api.capital.setWatch(id, false);
      if (SAMPLE_MODE) setSampleWatch(id, false);
      else setIds(r.dealIds);
      setNote(t.watchRemoved ?? '');
    } catch {
      setIds(before);
    }
  };

  const toggleAlerts = async (next: boolean) => {
    const before = alerts;
    setAlerts(next);
    try {
      const r = await api.capital.setAlerts(next);
      if (SAMPLE_MODE) setSampleAlerts(next);
      else setAlerts(r.alerts);
    } catch {
      setAlerts(before);
    }
  };

  const shown = rounds.filter((r) => ids.includes(r.id));

  return (
    <>
      <div className={styles.alerts}><Switch checked={alerts} onChange={toggleAlerts}>{t.notifyMe}</Switch></div>
      {shown.length === 0 ? (
        <EmptyState title={t.watchEmptyTitle ?? ''} action={<Link href={capitalHref(locale)} className={buttonClass('outline')}>{t.browseRounds}</Link>}>{t.watchEmptyBody}</EmptyState>
      ) : (
        <ul className={styles.list}>
          {shown.map((r) => {
            const days = deals.daysLeft(r.closesAt, now);
            return (
              <li key={r.id} className={styles.item}>
                <Link href={dealHref(locale, r.id)} className={styles.link}>
                  <h2>{r.name}</h2>
                  <p>{r.tagline}</p>
                  <p>{format(t.raisedLeft ?? '', { raised: money.formatCompactMoney(r.raisedMinor, r.currency, nl), days: r.status === 'closed' ? (t.closedBadge ?? '') : plural(t, 'daysLeft', days, locale, { n: days }) })}</p>
                </Link>
                <button type="button" className={styles.un} aria-label={format(t.stopWatching ?? '', { name: r.name })} onClick={() => unwatch(r.id)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z" /></svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <span className={styles.sr} role="status">{note}</span>
    </>
  );
}
