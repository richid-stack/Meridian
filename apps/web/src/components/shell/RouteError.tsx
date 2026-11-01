'use client';

import { useParams } from 'next/navigation';
import { Button, ErrorState } from '@meridian/ui';
import { getMessages } from '@meridian/i18n';

/** The error state every route shows when loading fails. Never a blank page. */
export function RouteError({ reset }: { reset: () => void }) {
  const { locale } = useParams<{ locale: string }>();
  const t = getMessages(locale ?? 'en').common as Record<string, string>;
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '56px var(--margin) 0' }}>
      <ErrorState title={t.errorTitle ?? ''} action={<Button variant="outline" onClick={reset}>{t.retry}</Button>}>{t.errorBody}</ErrorState>
    </main>
  );
}
