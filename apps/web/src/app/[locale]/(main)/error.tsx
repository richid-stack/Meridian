'use client';

import { useParams } from 'next/navigation';
import { Button, ErrorState } from '@meridian/ui';
import { getMessages } from '@meridian/i18n';

export default function MainError({ reset }: { error: Error; reset: () => void }) {
  const { locale } = useParams<{ locale: string }>();
  const t = getMessages(locale ?? 'en').home as Record<string, string>;
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '0 var(--margin)' }}>
      <ErrorState title={t.errorTitle ?? ''} action={<Button variant="outline" onClick={reset}>{t.retry}</Button>}>{t.errorBody}</ErrorState>
    </main>
  );
}
