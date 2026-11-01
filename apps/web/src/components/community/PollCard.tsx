'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import type { PollPost } from '@meridian/contracts';
import { community, money } from '@meridian/domain';
import { plural } from '@meridian/i18n';
import { api } from '@/lib/api';
import { SAMPLE_MODE } from '@/lib/sample';
import { readSample, updateSample } from '@/lib/sampleStore';
import styles from './Community.module.css';

export function PollCard({ post, locale, nl, t }: { post: PollPost; locale: string; nl: string; t: Record<string, string> }) {
  const [options, setOptions] = useState(post.options);
  const [mine, setMine] = useState<string | undefined>(post.myVote);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const fmt = (n: number) => money.formatNumber(n, 0, nl);

  // Sample mode: bring back this browser's vote.
  useEffect(() => {
    if (!SAMPLE_MODE || post.myVote) return;
    const saved = readSample().votes[post.id];
    if (saved && post.options.some((o) => o.id === saved)) { setOptions(community.addVote(post.options, saved)); setMine(saved); }
  }, [post]);

  const vote = async (optionId: string) => {
    if (mine || busy) return;
    const before = { options, mine };
    setFailed(false);
    setOptions((o) => community.addVote(o, optionId));
    setMine(optionId);
    setBusy(true);
    try {
      // In sample mode the person's own polls live only in this browser, so there is nothing to send.
      const own = SAMPLE_MODE && post.author.id === 'me';
      const r = own ? null : await api.community.vote(post.id, optionId);
      if (SAMPLE_MODE) updateSample((s) => ({ ...s, votes: { ...s.votes, [post.id]: optionId } }));
      else if (r?.type === 'poll') { setOptions(r.options); setMine(r.myVote); }
    } catch {
      setOptions(before.options);
      setMine(before.mine);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const total = community.totalVotes(options);
  const percents = community.pollPercents(options.map((o) => o.votes));
  return (
    <div>
      <div className={styles.poll} role="group" aria-label={post.text}>
        {options.map((o, i) => (
          <button
            key={o.id} type="button" disabled={Boolean(mine) || busy} aria-pressed={mine ? mine === o.id : undefined}
            className={`${styles.op} ${mine ? styles.opDone : ''} ${mine === o.id ? styles.opMine : ''}`}
            style={mine ? ({ '--w': `${percents[i] ?? 0}%` } as CSSProperties) : undefined} onClick={() => vote(o.id)}
          >
            <span>{o.label}</span>{mine ? <em>{percents[i] ?? 0}%</em> : null}
          </button>
        ))}
      </div>
      <p className={styles.pv} role="status">{plural(t, mine ? 'voteThanks' : 'voteHint', total, locale, { n: fmt(total) })}</p>
      {failed ? <p className={styles.err} role="alert">{t.voteFailed}</p> : null}
    </div>
  );
}
