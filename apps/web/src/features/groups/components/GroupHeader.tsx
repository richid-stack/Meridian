'use client';

import { useEffect, useState } from 'react';
import type { GroupSummary } from '@meridian/contracts';
import { money } from '@meridian/domain';
import { plural } from '@meridian/i18n';
import { changeMembership } from '@/components/community/membership';
import { SAMPLE_MODE } from '@/lib/sample';
import { applyMembership } from '@/lib/sampleStore';
import post from '@/components/community/Community.module.css';
import styles from './Group.module.css';

export function GroupHeader({ group, locale, nl, t }: { group: GroupSummary; locale: string; nl: string; t: Record<string, string> }) {
  const [joined, setJoined] = useState(group.joined);
  const [members, setMembers] = useState(group.members);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!SAMPLE_MODE) return;
    const m = applyMembership(group);
    setJoined(m.joined);
    setMembers(m.members);
  }, [group]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const r = await changeMembership(group.id, !joined);
      setJoined(r.joined);
      setMembers(r.members);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const locked = group.restricted && !joined;
  return (
    <div className={styles.head}>
      <h1 className={styles.h1}>{group.name}</h1>
      <p className={styles.blurb}>{group.blurb}</p>
      <span className={styles.members}>{plural(t, 'members', members, locale, { n: money.formatNumber(members, 0, nl) })}</span>
      <button type="button" className={post.jn} aria-pressed={joined} disabled={locked || busy} onClick={toggle}>{joined ? t.joined : t.joinGroup}</button>
      {locked ? <span className={styles.lock}>{t.restricted}</span> : null}
      {error ? <p className={styles.err} role="alert">{t.joinFailed}</p> : null}
    </div>
  );
}
