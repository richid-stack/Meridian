'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { GroupSummary } from '@meridian/contracts';
import { money } from '@meridian/domain';
import { EmptyState } from '@meridian/ui';
import { plural } from '@meridian/i18n';
import { changeMembership } from '@/components/community/membership';
import { SAMPLE_MODE } from '@/lib/sample';
import { applyMembership } from '@/lib/sampleStore';
import post from '@/components/community/Community.module.css';
import styles from './Community.module.css';

/** The Groups tab. Joining moves a group between "Your groups" and "Discover" straight away. */
export function GroupsPanel({ groups, locale, nl, t }: { groups: GroupSummary[]; locale: string; nl: string; t: Record<string, string> }) {
  const [state, setState] = useState(groups);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (SAMPLE_MODE) setState(groups.map((g) => ({ ...g, ...applyMembership(g) })));
  }, [groups]);

  const toggle = async (g: GroupSummary) => {
    if (busy) return;
    setBusy(g.id);
    setError(false);
    try {
      const r = await changeMembership(g.id, !g.joined);
      setState((all) => all.map((x) => (x.id === g.id ? { ...x, joined: r.joined, members: r.members } : x)));
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  };

  const row = (g: GroupSummary) => {
    const locked = g.restricted && !g.joined;
    return (
      <div key={g.id} className={post.gr}>
        <Link href={`/${locale}/groups/${g.id}`} className={post.gl} aria-hidden="true" tabIndex={-1}>{g.letter}</Link>
        <div className={post.gb}>
          <Link href={`/${locale}/groups/${g.id}`}><b>{g.name}</b></Link>
          <small>{g.blurb}</small>
          <em>{locked ? t.restricted : plural(t, 'members', g.members, locale, { n: money.formatNumber(g.members, 0, nl) })}</em>
        </div>
        <button type="button" className={post.jn} aria-pressed={g.joined} disabled={locked || busy === g.id} aria-label={`${g.joined ? t.joined : t.join}: ${g.name}`} onClick={() => toggle(g)}>
          {g.joined ? t.joined : t.join}
        </button>
      </div>
    );
  };

  const mine = state.filter((g) => g.joined);
  const rest = state.filter((g) => !g.joined);
  return (
    <div>
      <section aria-labelledby="groups-mine">
        <h2 id="groups-mine" className={styles.h2}>{t.yourGroups}</h2>
        {mine.length ? mine.map(row) : <EmptyState title={t.noGroupsTitle ?? ''}>{t.noGroupsBody}</EmptyState>}
      </section>
      <section aria-labelledby="groups-discover">
        <h2 id="groups-discover" className={styles.h2}>{t.discover}</h2>
        {rest.map(row)}
      </section>
      {error ? <p className={styles.err} role="alert">{t.joinFailed}</p> : null}
    </div>
  );
}
