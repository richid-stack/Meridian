import Link from 'next/link';
import type { Deal } from '@meridian/contracts';
import { deals, money } from '@meridian/domain';
import { format, getMessages, numberLocale, plural } from '@meridian/i18n';
import { buttonClass, EmptyState } from '@meridian/ui';
import { api } from '@/lib/api';
import { capitalHref, dealHref, parseCompare, usd } from '@/lib/capital';
import { PageBar } from '@/components/shell/PageBar';
import { CompareSelect } from './CompareSelect';
import styles from './Compare.module.css';

type SP = string | string[] | undefined;

export async function CompareScreen({ locale, a: askedA, b: askedB }: { locale: string; a: SP; b: SP }) {
  const t = getMessages(locale).capital as Record<string, string>;
  const nl = numberLocale(locale);
  const now = Date.now();
  const list = await api.capital.listDeals('any');
  const ids = list.deals.map((d) => d.id);
  const bar = <PageBar title={t.compareTitle ?? ''} backLabel={t.back ?? ''} fallbackHref={capitalHref(locale)} />;

  if (ids.length < 2) {
    return <>{bar}<main className={styles.wrap}><EmptyState title={t.emptyTitle ?? ''}>{t.emptyBody}</EmptyState></main></>;
  }

  const sel = parseCompare({ a: askedA, b: askedB }, ids);
  const [A, B] = await Promise.all([api.capital.getDeal(sel.a), api.capital.getDeal(sel.b)]);
  const pct = (d: Deal) => deals.fundedPct(d.raisedMinor, d.targetMinor);
  const left = (d: Deal) => deals.daysLeft(d.closesAt, now);
  const daysText = (n: number) => plural(t, 'days', n, locale, { n });
  const compact = (n: number, d: Deal) => money.formatCompactMoney(n, d.currency, nl);
  const funding = deals.compareFunding({ fundedPct: pct(A) }, { fundedPct: pct(B) });
  const lead = funding.lead === 'a' ? A : B;
  const trail = funding.lead === 'a' ? B : A;
  const strip = (s: string | undefined) => (s ?? '').replace(/\.$/, '');

  const rows: [string, (d: Deal) => string][] = [
    [t.row_raised ?? '', (d) => compact(d.raisedMinor, d)],
    [t.row_funded ?? '', (d) => `${pct(d)}%`],
    [t.row_cap ?? '', (d) => compact(d.valuationCapMinor, d)],
    [t.row_min ?? '', (d) => usd(d.minInvestMinor, nl)],
    [t.row_investors ?? '', (d) => money.formatNumber(d.investors, 0, nl)],
    [t.row_days ?? '', (d) => String(left(d))],
    [t.row_sector ?? '', (d) => d.sector],
  ];

  return (
    <>
      {bar}
      <main className={styles.wrap}>
        <div className={styles.top}><h1 className={styles.h1}>{t.sideBySide}</h1></div>
        <CompareSelect locale={locale} options={list.deals.map((d) => ({ id: d.id, name: d.name }))} a={sel.a} b={sel.b} t={t} />

        <table className={styles.tbl}>
          <caption className={styles.sr}>{t.compareTitle}</caption>
          <thead><tr><th scope="col"><span className={styles.sr}>{t.compareTitle}</span></th><th scope="col">{A.name}</th><th scope="col">{B.name}</th></tr></thead>
          <tbody>{rows.map(([label, get]) => <tr key={label}><th scope="row">{label}</th><td>{get(A)}</td><td>{get(B)}</td></tr>)}</tbody>
        </table>

        <section className={styles.sum} aria-labelledby="sum-h">
          <h2 id="sum-h">{t.summaryTitle}</h2>
          <ul>
            <li>{funding.tie
              ? format(t.sum_tie ?? '', { a: A.name, b: B.name, pct: pct(A) })
              : format(t.sum_lead ?? '', { lead: lead.name, leadPct: funding.leadPct, trailPct: funding.trailPct, trail: trail.name })}</li>
            <li>{format(t.sum_days ?? '', { a: A.name, aDays: daysText(left(A)), b: B.name, bDays: daysText(left(B)) })}</li>
            <li>{format(t.sum_cap ?? '', { aCap: compact(A.valuationCapMinor, A), bCap: compact(B.valuationCapMinor, B) })}</li>
            <li>{format(t.sum_risk ?? '', { name: A.name, risk: strip(A.risks[0]) })}</li>
            <li>{format(t.sum_risk ?? '', { name: B.name, risk: strip(B.risks[0]) })}</li>
          </ul>
          <p className={styles.sumNote}>{t.summaryNote}</p>
        </section>

        <div className={styles.open}>
          {[A, B].map((d) => <Link key={d.id} href={dealHref(locale, d.id)} className={buttonClass('outline')}>{format(t.openRound ?? '', { name: d.name })}</Link>)}
        </div>
        <p className={styles.note}>{t.sampleNote}</p>
      </main>
    </>
  );
}
