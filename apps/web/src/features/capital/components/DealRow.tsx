import Link from 'next/link';
import type { DealSummary } from '@meridian/contracts';
import { deals, money } from '@meridian/domain';
import { plural } from '@meridian/i18n';
import { ProgressRing } from '@meridian/ui';
import { dealHref } from '@/lib/capital';
import styles from './Capital.module.css';

export function DealRow({ deal, locale, nl, now, t }: { deal: DealSummary; locale: string; nl: string; now: number; t: Record<string, string> }) {
  const pct = deals.fundedPct(deal.raisedMinor, deal.targetMinor);
  const days = deals.daysLeft(deal.closesAt, now);
  const raised = money.formatCompactMoney(deal.raisedMinor, deal.currency, nl);
  const target = money.formatCompactMoney(deal.targetMinor, deal.currency, nl);
  return (
    <Link href={dealHref(locale, deal.id)} className={styles.row}>
      <ProgressRing value={pct} label={t.fundedLabel ?? ''} />
      <span className={styles.rowBody}>
        <h2>{deal.name}</h2>
        <p>{deal.tagline}</p>
        <span className={styles.rowMeta}>
          <span>{deal.sector}</span>
          <span>{raised} {t.ofTarget?.replace('{amount}', target)}</span>
          {deal.status === 'closed' ? <span className={styles.badge}>{t.closedBadge}</span> : <span>{plural(t, 'daysLeft', days, locale, { n: days })}</span>}
          {deal.isNew && deal.status === 'open' ? <span className={`${styles.badge} ${styles.new}`}>{t.f_new}</span> : null}
        </span>
      </span>
    </Link>
  );
}
