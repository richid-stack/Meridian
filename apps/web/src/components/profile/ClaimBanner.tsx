'use client';

import Link from 'next/link';
import { useState } from 'react';
import { buttonClass } from '@meridian/ui';
import styles from './Profile.module.css';

export function ClaimBanner({ href, t }: { href: string; t: Record<string, string> }) {
  const [sent, setSent] = useState(false);
  return (
    <aside className={styles.banner} aria-label={t.bannerTitle}>
      <b className={styles.bannerTitle}>{t.bannerTitle}</b>
      <p className={styles.bannerBody}>{t.bannerBody}</p>
      <div className={styles.bannerActions}>
        <Link href={href} className={buttonClass('outline')}>{t.claim}</Link>
        {/* Sample behaviour: nothing is sent until the corrections module exists. */}
        <button type="button" className={styles.linkBtn} onClick={() => setSent(true)}>{t.suggest}</button>
      </div>
      <p className={styles.thanks} role="status">{sent ? t.suggestThanks : ''}</p>
    </aside>
  );
}
