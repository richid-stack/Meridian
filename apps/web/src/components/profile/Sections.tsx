import Link from 'next/link';
import { format } from '@meridian/i18n';
import styles from './Profile.module.css';

type Dict = Record<string, string>;

export function FactList({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <dl className={styles.dl}>
      {facts.map((f) => (<div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>))}
    </dl>
  );
}

export function Timeline({ items }: { items: { year: string; title: string; detail: string }[] }) {
  return (
    <ol className={styles.tl}>
      {items.map((x) => (
        <li key={x.year + x.title}><time>{x.year}</time><p><b>{x.title}</b><span>{x.detail}</span></p></li>
      ))}
    </ol>
  );
}

export function BookList({ books, locale, recommended }: { books: { id: string; title: string; author: string; spine: string; note?: string }[]; locale: string; recommended: string }) {
  return (
    <div>
      {books.map((b) => (
        <Link key={b.id} href={`/${locale}/books/${b.id}`} className={styles.bk}>
          <span className={styles.spine} style={{ background: b.spine }} aria-hidden="true">{b.title}</span>
          <span>
            <b>{b.title}</b>
            <span className={styles.sub}>{b.author}</span>
            <span className={styles.note}>{b.note ? `\u201c${b.note}\u201d` : recommended}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function InterviewList({ items, locale, t }: { items: { id: string; title: string; media: 'audio' | 'video'; minutes: number }[]; locale: string; t: Dict }) {
  return (
    <div>
      {items.map((i) => (
        <Link key={i.id} href={`/${locale}/episodes/${i.id}`} className={styles.iv}>
          <span className={styles.play} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg></span>
          <span><b>{i.title}</b><span className={styles.sub}>{format(t.interviewMeta ?? '', { kind: t[`kind_${i.media}`] ?? '', n: i.minutes })}</span></span>
        </Link>
      ))}
    </div>
  );
}

export function RowList({ rows }: { rows: { left: string; right: string }[] }) {
  return (
    <div>
      {rows.map((r) => (<div key={r.left} className={styles.bkr}><span>{r.left}</span><em>{r.right}</em></div>))}
    </div>
  );
}
