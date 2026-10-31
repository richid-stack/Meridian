import Link from 'next/link';
import type { LeadStory as Lead } from '@meridian/contracts';
import styles from './LeadStory.module.css';

export function LeadStory({ story, href, kicker, briefLabel, by, readTime }: {
  story: Lead; href: string; kicker: string; briefLabel: string; by: string; readTime: string;
}) {
  return (
    <article className={styles.root}>
      <small className={styles.kicker}>{kicker}</small>
      <h2 className={styles.title}><Link href={href} className={styles.link}>{story.title}</Link></h2>
      <p className={styles.by}>{by}, {readTime}</p>
      <div className={styles.brief}>
        <b className={styles.briefLabel}>{briefLabel}</b>
        <ul className={styles.list}>{story.brief.map((b) => <li key={b}>{b}</li>)}</ul>
      </div>
    </article>
  );
}
