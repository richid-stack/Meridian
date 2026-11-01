import Link from 'next/link';
import type { Attachment } from '@meridian/contracts';
import styles from './Community.module.css';

export function attachmentHref(a: Pick<Attachment, 'kind' | 'id'>, locale: string): string {
  const path = { deal: 'capital/deals', company: 'companies', book: 'books', story: 'news' }[a.kind];
  return `/${locale}/${path}/${a.id}`;
}

export function AttachmentIcon({ a }: { a: Attachment }) {
  if (a.kind === 'deal') return <span className={styles.dl} aria-hidden="true">{Math.round(a.pct ?? 0)}%</span>;
  if (a.kind === 'book') return <span className={styles.bk} aria-hidden="true" />;
  return <span className={styles.cs} aria-hidden="true">{a.title.charAt(0)}</span>;
}

export function AttachmentCard({ a, locale }: { a: Attachment; locale: string }) {
  return (
    <Link href={attachmentHref(a, locale)} className={styles.emb}>
      <AttachmentIcon a={a} />
      <span><b>{a.title}</b><small>{a.subtitle}</small></span>
    </Link>
  );
}
