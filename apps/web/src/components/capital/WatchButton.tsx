'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { SAMPLE_MODE } from '@/lib/sample';
import { readSample, setSampleWatch } from '@/lib/sampleStore';
import styles from './Capital.module.css';

interface Props { dealId: string; baselineWatched: boolean; t: Record<string, string> }

/** Bookmark that follows a round. Sample mode keeps the choice in this browser; with a backend the server answer wins. */
export function WatchButton({ dealId, baselineWatched, t }: Props) {
  const [on, setOn] = useState(baselineWatched);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!SAMPLE_MODE) return;
    const mine = readSample().watch[dealId];
    if (mine !== undefined) setOn(mine);
  }, [dealId]);

  const toggle = async () => {
    if (busy) return;
    const next = !on;
    setOn(next);
    setBusy(true);
    try {
      const r = await api.capital.setWatch(dealId, next);
      if (SAMPLE_MODE) setSampleWatch(dealId, next);
      else setOn(r.dealIds.includes(dealId));
      setNote(next ? (t.watchAdded ?? '') : (t.watchRemoved ?? ''));
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" className={styles.watch} aria-pressed={on} aria-label={on ? t.unwatch : t.watch} onClick={toggle}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z" /></svg>
      </button>
      <span className={styles.sr} role="status">{note}</span>
    </>
  );
}
