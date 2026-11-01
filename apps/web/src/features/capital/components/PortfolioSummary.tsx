'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { deals } from '@meridian/domain';
import { buttonClass } from '@meridian/ui';
import { usd } from '@/lib/capital';
import { SAMPLE_MODE } from '@/lib/sample';
import { readSample } from '@/lib/sampleStore';
import styles from './Capital.module.css';

interface Props {
  locale: string;
  nl: string;
  t: Record<string, string>;
  positions: deals.PositionLike[];
  watching: string[];
}

/** The "Your investments" strip. Sample mode adds what this browser committed and watched; with a backend the server numbers are final. */
export function PortfolioSummary({ locale, nl, t, positions, watching }: Props) {
  const [view, setView] = useState({ positions, watching });
  useEffect(() => {
    if (!SAMPLE_MODE) return;
    const mine = readSample();
    setView({
      positions: deals.mergePositions(positions, mine.investments.map((i) => ({ dealId: i.dealId, amountMinor: i.amountMinor, status: i.status, at: i.at, ref: i.ref }))),
      watching: deals.effectiveWatch(watching, mine.watch),
    });
  }, [positions, watching]);

  return (
    <section className={styles.mine} aria-labelledby="mine-h">
      <div className={styles.mineHead}>
        <h2 id="mine-h">{t.yourInvestments}</h2>
        <Link href={`/${locale}/portfolio`} className={styles.mineLink}>{t.viewPortfolio}</Link>
      </div>
      <dl className={styles.stats}>
        <div><dt>{t.invested}</dt><dd>{usd(deals.totalInvested(view.positions), nl)}</dd></div>
        <div><dt>{t.rounds}</dt><dd>{view.positions.length}</dd></div>
        <div><dt>{t.watching}</dt><dd>{view.watching.length}</dd></div>
      </dl>
      <div className={styles.links}>
        <Link href={`/${locale}/watchlist`} className={buttonClass('outline')}>{t.watchlist}</Link>
        <Link href={`/${locale}/compare`} className={buttonClass('outline')}>{t.compareRounds}</Link>
      </div>
    </section>
  );
}
