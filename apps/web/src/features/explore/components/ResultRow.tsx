import Link from 'next/link';
import type { SearchHit } from '@meridian/contracts';
import { Avatar, ProgressRing } from '@meridian/ui';
import { hrefFor, kindKey } from '../lib';
import styles from './ResultRow.module.css';

function Icon({ hit, kindLabel }: { hit: SearchHit; kindLabel: string }) {
  switch (hit.kind) {
    case 'person': return <Avatar kind="person" name={hit.title} />;
    case 'company':
    case 'story': return <Avatar kind="company" name={hit.initials ?? hit.title} />;
    case 'book': return <span className={styles.book} style={{ background: hit.spine ?? '#5B3A29' }} aria-hidden="true" />;
    case 'episode':
      return (
        <span className={styles.play} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
        </span>
      );
    case 'deal': return <ProgressRing value={hit.pct ?? 0} label={kindLabel} />;
    case 'topic': return <span className={styles.play} aria-hidden="true">#</span>;
  }
}

export function ResultRow({ hit, locale, t, rank }: { hit: SearchHit; locale: string; t: Record<string, string>; rank?: number }) {
  const kindLabel = t[kindKey(hit)] ?? '';
  return (
    <Link href={hrefFor(hit, locale)} className={styles.row}>
      {rank ? <span className={styles.rank} aria-hidden="true">{rank}</span> : null}
      <span className={styles.icon}><Icon hit={hit} kindLabel={kindLabel} /></span>
      <span className={styles.main}>
        <b className={styles.title}>{hit.title}</b>
        <span className={styles.sub}>{hit.subtitle}</span>
      </span>
      {rank ? null : <span className={styles.kind}>{kindLabel}</span>}
    </Link>
  );
}
