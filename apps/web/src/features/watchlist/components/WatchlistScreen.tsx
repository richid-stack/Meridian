import { getMessages, numberLocale } from '@meridian/i18n';
import { api } from '@/lib/api';
import { capitalHref } from '@/lib/capital';
import { PageBar } from '@/components/shell/PageBar';
import { WatchlistView } from './WatchlistView';
import styles from './Watchlist.module.css';

export async function WatchlistScreen({ locale }: { locale: string }) {
  const t = getMessages(locale).capital as Record<string, string>;
  const [watch, list] = await Promise.all([api.capital.watchlist(), api.capital.listDeals('any')]);
  return (
    <>
      <PageBar title={t.watchlistTitle ?? ''} backLabel={t.back ?? ''} fallbackHref={capitalHref(locale)} />
      <main className={styles.wrap}>
        <div className={styles.top}>
          <h1 className={styles.h1}>{t.watchingH1}</h1>
          <p className={styles.sub}>{t.watchingBody}</p>
        </div>
        <WatchlistView locale={locale} nl={numberLocale(locale)} now={Date.now()} t={t} rounds={list.deals} watching={watch.dealIds} alerts={watch.alerts} />
        <p className={styles.note}>{t.watchSample}</p>
      </main>
    </>
  );
}
