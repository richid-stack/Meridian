'use client';

import { useEffect, useState } from 'react';
import { money } from '@meridian/domain';
import { plural } from '@meridian/i18n';
import { api } from '@/lib/api';
import { SAMPLE_MODE } from '@/lib/sample';
import { readSample, updateSample } from '@/lib/sampleStore';
import { HeartIcon, ReplyIcon, RepostIcon } from './icons';
import styles from './Community.module.css';

interface Props { id: string; replies: number; reposts: number; likes: number; likedByMe: boolean; locale: string; nl: string; t: Record<string, string> }

export function PostActions({ id, replies, reposts, likes, likedByMe, locale, nl, t }: Props) {
  const [liked, setLiked] = useState(likedByMe);
  const [count, setCount] = useState(likes);
  const [busy, setBusy] = useState(false);
  const fmt = (n: number) => money.formatNumber(n, 0, nl);

  // Sample mode: bring back what this browser liked before.
  useEffect(() => {
    if (SAMPLE_MODE && !likedByMe && readSample().liked.includes(id)) { setLiked(true); setCount(likes + 1); }
  }, [id, likedByMe, likes]);

  const toggle = async () => {
    if (busy) return;
    const next = !liked;
    const before = { liked, count };
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    setBusy(true);
    try {
      const r = await api.community.like(id, next);
      if (SAMPLE_MODE) updateSample((s) => ({ ...s, liked: next ? [...new Set([...s.liked, id])] : s.liked.filter((x) => x !== id) }));
      else { setLiked(r.likedByMe); setCount(r.likes); }
    } catch {
      setLiked(before.liked);
      setCount(before.count);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.act}>
      <span className={styles.stat}><ReplyIcon /><span aria-hidden="true">{fmt(replies)}</span><span className={styles.sr}>{plural(t, 'replies', replies, locale, { n: fmt(replies) })}</span></span>
      <span className={styles.stat}><RepostIcon /><span aria-hidden="true">{fmt(reposts)}</span><span className={styles.sr}>{plural(t, 'reposts', reposts, locale, { n: fmt(reposts) })}</span></span>
      <button type="button" className={styles.like} aria-pressed={liked} aria-label={`${t.like}: ${plural(t, 'likes', count, locale, { n: fmt(count) })}`} onClick={toggle}>
        <HeartIcon filled={liked} /><span aria-hidden="true">{fmt(count)}</span>
      </button>
    </div>
  );
}
