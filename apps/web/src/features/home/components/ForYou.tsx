import Link from 'next/link';
import { Avatar, ProgressBar } from '@meridian/ui';
import { money } from '@meridian/domain';
import { format, plural } from '@meridian/i18n';
import type { FeedItem } from '@meridian/contracts';
import styles from './ForYou.module.css';

type Dict = Record<string, string>;

export function ForYou({ items, locale, numberLocale, t }: { items: FeedItem[]; locale: string; numberLocale: string; t: Dict }) {
  return (
    <div>
      {items.map((item) => {
        switch (item.kind) {
          case 'raise': {
            const pct = Math.round((item.raisedMinor / item.targetMinor) * 100);
            return (
              <article key={item.id} className={styles.item}>
                <span className={styles.kind}>{t.kind_raise}</span>
                <h3 className={styles.title}><Link href={`/${locale}/capital/deals/${item.id}`} className={styles.link}>{item.title}</Link></h3>
                <p className={styles.meta}>{plural(t, 'backers', item.backers, locale)}</p>
                <div className={styles.bar}><ProgressBar value={pct} label={item.title} /></div>
                <div className={styles.fund}>
                  <span><b>{format(t.raised ?? '', { amount: money.formatCompactMoney(item.raisedMinor, item.currency, numberLocale) })}</b></span>
                  <span>{plural(t, 'daysLeft', item.daysLeft, locale, { pct })}</span>
                </div>
              </article>
            );
          }
          case 'interview':
            return (
              <article key={item.id} className={styles.item}>
                <span className={styles.kind}>{t.kind_interview}</span>
                <Link href={`/${locale}/episodes/${item.id}`} className={styles.iv}>
                  <span className={styles.play} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
                  </span>
                  <span>
                    <span className={styles.ivTitle}>{item.title}</span>
                    <span className={styles.meta}>{format(t.interviewMeta ?? '', { guest: item.guest, n: item.minutes })}</span>
                  </span>
                </Link>
              </article>
            );
          case 'book':
            return (
              <article key={item.id} className={styles.item}>
                <span className={styles.kind}>{t.kind_book}</span>
                <Link href={`/${locale}/books/${item.id}`} className={styles.book}>
                  <span className={styles.spine} style={{ background: item.spine }} aria-hidden="true">{item.title}</span>
                  <span>
                    <span className={styles.ivTitle}>{item.title}</span>
                    <span className={styles.meta}>{plural(t, 'bookMeta', item.readers, locale, { author: item.author })}</span>
                  </span>
                </Link>
              </article>
            );
          case 'question':
            return (
              <article key={item.id} className={styles.item}>
                <span className={styles.kind}>{t.kind_question}</span>
                <h3 className={styles.title}><Link href={`/${locale}/community`} className={styles.link}>{item.title}</Link></h3>
                <div className={styles.q}>
                  <span>{plural(t, 'replies', item.replies, locale)}</span>
                  <span>{format(t.topAnswer ?? '', { name: item.topAnswerBy })}</span>
                </div>
              </article>
            );
        }
      })}
    </div>
  );
}
export { Avatar };
