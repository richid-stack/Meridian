'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { buttonClass, EmptyState } from '@meridian/ui';
import { getMessages } from '@meridian/i18n';

export default function NotFound() {
  const { locale } = useParams<{ locale: string }>();
  const t = getMessages(locale ?? 'en').common as Record<string, string>;
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '56px var(--margin)' }}>
      <EmptyState title={t.notFoundTitle ?? ''} action={<Link href={`/${locale ?? 'en'}`} className={buttonClass('outline')}>{t.goHome}</Link>}>{t.notFoundBody}</EmptyState>
    </main>
  );
}
