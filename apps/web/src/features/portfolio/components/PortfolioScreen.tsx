import { getMessages, numberLocale } from '@meridian/i18n';
import { api } from '@/lib/api';
import { capitalHref } from '@/lib/capital';
import { PageBar } from '@/components/shell/PageBar';
import { PortfolioView } from './PortfolioView';
import styles from './Portfolio.module.css';

export async function PortfolioScreen({ locale }: { locale: string }) {
  const t = getMessages(locale).capital as Record<string, string>;
  const [portfolio, list] = await Promise.all([api.capital.portfolio(), api.capital.listDeals('any')]);
  return (
    <>
      <PageBar title={t.portfolioTitle ?? ''} backLabel={t.back ?? ''} fallbackHref={capitalHref(locale)} />
      <main className={styles.wrap}>
        <div className={styles.top}><h1 className={styles.h1}>{t.portfolioTitle}</h1></div>
        <PortfolioView locale={locale} nl={numberLocale(locale)} now={Date.now()} t={t} positions={portfolio.positions} activity={portfolio.activity} rounds={list.deals} />
        <p className={styles.note}>{t.portfolioSample}</p>
      </main>
    </>
  );
}
