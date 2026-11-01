'use client';

import { useRouter } from 'next/navigation';
import { Pill } from '@meridian/ui';
import { capitalHref, DEAL_TABS, type DealTab } from '@/lib/capital';
import styles from './Capital.module.css';

/** Chips that change the URL, so a filtered list can be shared and the back button works. */
export function CapitalFilters({ locale, tab, t }: { locale: string; tab: DealTab; t: Record<string, string> }) {
  const router = useRouter();
  return (
    <div className={styles.filters} role="group" aria-label={t.filterLabel}>
      {DEAL_TABS.map((x) => <Pill key={x} selected={x === tab} onClick={() => router.push(capitalHref(locale, x), { scroll: false })}>{t[`f_${x}`]}</Pill>)}
    </div>
  );
}
