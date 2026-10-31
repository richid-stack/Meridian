import Link from 'next/link';
import type { NewsQuery } from '@meridian/contracts';
import { buttonClass, EmptyState } from '@meridian/ui';
import { getMessages } from '@meridian/i18n';
import { api } from '@/lib/api';
import { PageBar } from '@/components/shell/PageBar';
import { newsHref } from '../lib';
import { NewsFilters } from './NewsFilters';
import { StoryRow } from './StoryRow';
import styles from './News.module.css';

export async function NewsScreen({ locale, query }: { locale: string; query: NewsQuery }) {
  const t = getMessages(locale).news as Record<string, string>;
  const page = await api.news.list(query);
  const now = Date.now();
  return (
    <>
      <PageBar title={t.pageTitle ?? ''} backLabel={t.back ?? ''} fallbackHref={`/${locale}`} />
      <main className={styles.wrap}>
        <div className={styles.top}><h1 className={styles.h1}>{t.heading}</h1></div>
        <NewsFilters locale={locale} region={query.region} topic={query.topic} t={t} />
        {page.items.length === 0 ? (
          <EmptyState title={t.emptyTitle ?? ''} action={<Link href={newsHref(locale, {})} className={buttonClass('outline')}>{t.clearFilters}</Link>}>{t.emptyBody}</EmptyState>
        ) : (
          <div>
            {page.items.map((s, i) => <StoryRow key={s.id} story={s} locale={locale} now={now} t={t} lead={i === 0} />)}
            {page.more
              ? <div className={styles.more}><Link href={newsHref(locale, { ...query, page: query.page + 1 })} scroll={false} className={buttonClass('outline')}>{t.loadMore}</Link></div>
              : <div className={styles.end} />}
          </div>
        )}
        <p className={styles.note}>{t.sampleNote}</p>
      </main>
    </>
  );
}
