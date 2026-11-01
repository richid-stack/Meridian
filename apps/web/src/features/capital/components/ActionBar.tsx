'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pill, buttonClass } from '@meridian/ui';
import { investHref, usd } from '@/lib/capital';
import styles from './Capital.module.css';

const QUICK = [100, 250, 500, 1000];

/** Sticky bar at the bottom of the deal room: pick a starting amount, then review it on the next step. */
export function ActionBar({ locale, nl, dealId, minDollars, t }: { locale: string; nl: string; dealId: string; minDollars: number; t: Record<string, string> }) {
  const amounts = QUICK.filter((a) => a >= minDollars);
  const [amount, setAmount] = useState(amounts.includes(250) ? 250 : (amounts[0] ?? minDollars));
  return (
    <div className={styles.actionBar}>
      <div className={styles.actionIn}>
        <div className={styles.chips} role="group" aria-label={t.amountGroup}>
          {amounts.map((a) => <Pill key={a} selected={a === amount} onClick={() => setAmount(a)}>{usd(a * 100, nl)}</Pill>)}
        </div>
        <Link href={investHref(locale, dealId, amount)} className={`${buttonClass('go', true)} ${styles.go}`}>{t.continueWith?.replace('{amount}', usd(amount * 100, nl))}</Link>
        <p className={styles.hint}>{t.reviewNext}</p>
      </div>
    </div>
  );
}
