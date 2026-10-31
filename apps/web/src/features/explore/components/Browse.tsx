import Link from 'next/link';
import type { Explore } from '@meridian/contracts';
import { format } from '@meridian/i18n';
import { ResultRow } from './ResultRow';
import styles from './Browse.module.css';

export function Browse({ data, locale, t }: { data: Explore; locale: string; t: Record<string, string> }) {
  return (
    <div>
      <h2 className={styles.h2}>{t.trending}</h2>
      <div>{data.trending.map((h, i) => <ResultRow key={`${h.kind}:${h.id}`} hit={h} locale={locale} t={t} rank={i + 1} />)}</div>

      <h2 className={styles.h2}>{t.companiesToKnow}</h2>
      <div>{data.companies.map((h) => <ResultRow key={h.id} hit={h} locale={locale} t={t} />)}</div>

      <h2 className={styles.h2}>{t.sectors}</h2>
      <div className={styles.sectors}>
        {data.sectors.map((s) => (
          <Link key={s.id} href={`/${locale}/explore?q=${encodeURIComponent(s.label)}`} className={styles.sector} aria-label={`${s.label}, ${format(t.sectorCount ?? '', { n: s.count })}`}>
            {s.label}<span className={styles.count}>{s.count.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}</span>
          </Link>
        ))}
      </div>

      <h2 className={styles.h2}>{t.booksShelf}</h2>
      <div className={styles.shelf} role="region" aria-label={t.booksShelf} tabIndex={0}>
        {data.books.map((b) => (
          <Link key={b.id} href={`/${locale}/books/${b.id}`} className={styles.book}>
            <span className={styles.cover} style={{ background: b.spine }}>{b.title}</span>
            <span className={styles.author}>{b.author}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
