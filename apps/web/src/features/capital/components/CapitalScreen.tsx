import Link from 'next/link';
import { buttonClass, EmptyState, TopBar } from '@meridian/ui';
import { format, getMessages, numberLocale } from '@meridian/i18n';
import { money } from '@meridian/domain';
import { api } from '@/lib/api';
import { capitalHref, type DealTab } from '@/lib/capital';
import { CapitalFilters } from './CapitalFilters';
import { DealRow } from './DealRow';
import { PortfolioSummary } from './PortfolioSummary';
import styles from './Capital.module.css';

export async function CapitalScreen({ locale, tab }: { locale: string; tab: DealTab }) {
  const t = getMessages(locale).capital as Record<string, string>;
  const nl = numberLocale(locale);
  const now = Date.now();
  const [list, portfolio, watch] = await Promise.all([api.capital.listDeals(tab), api.capital.portfolio(), api.capital.watchlist()]);
  const min = money.formatMoney(10_000, 'USD', nl, 0);
  return (
    <>
      <TopBar />
      <main className={styles.wrap}>
        <div className={styles.top}>
          <h1 className={styles.h1}>{t.title}</h1>
          <p className={styles.sub}>{t.sub}</p>
        </div>
        <PortfolioSummary locale={locale} nl={nl} t={t} positions={portfolio.positions} watching={watch.dealIds} />
        <CapitalFilters locale={locale} tab={tab} t={t} />
        {list.deals.length === 0 ? (
          <EmptyState title={(tab === 'closed' ? t.emptyClosedTitle : t.emptyTitle) ?? ''} action={tab === 'all' ? undefined : <Link href={capitalHref(locale, 'all')} className={buttonClass('outline')}>{t.seeOpen}</Link>}>{t.emptyBody}</EmptyState>
        ) : (
          <div>{list.deals.map((d) => <DealRow key={d.id} deal={d} locale={locale} nl={nl} now={now} t={t} />)}</div>
        )}
        <section className={styles.how} aria-labelledby="how-h">
          <h2 id="how-h">{t.howTitle}</h2>
          <ol>
            <li>{t.how1}</li>
            <li>{format(t.how2 ?? '', { min })}</li>
            <li>{t.how3}</li>
          </ol>
        </section>
        <p className={styles.note}>{t.sampleNote}</p>
      </main>
    </>
  );
}
