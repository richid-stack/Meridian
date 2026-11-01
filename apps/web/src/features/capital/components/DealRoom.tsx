import type { Deal } from '@meridian/contracts';
import { deals, money, time } from '@meridian/domain';
import { format, getMessages, numberLocale, plural } from '@meridian/i18n';
import { AiLabel, Avatar, EmptyState, RiskNotice } from '@meridian/ui';
import { PageBar } from '@/components/shell/PageBar';
import { WatchButton } from '@/components/capital/WatchButton';
import { capitalHref, dateShort, usd } from '@/lib/capital';
import { ActionBar } from './ActionBar';
import styles from './Capital.module.css';

export function DealRoom({ locale, deal, watched, now }: { locale: string; deal: Deal; watched: boolean; now: number }) {
  const t = getMessages(locale).capital as Record<string, string>;
  const nl = numberLocale(locale);
  const pct = deals.fundedPct(deal.raisedMinor, deal.targetMinor);
  const days = deals.daysLeft(deal.closesAt, now);
  const open = deal.status === 'open';
  const compact = (n: number) => money.formatCompactMoney(n, deal.currency, nl);
  return (
    <>
      <PageBar title={deal.name} backLabel={t.back ?? ''} fallbackHref={capitalHref(locale)} actions={<WatchButton dealId={deal.id} baselineWatched={watched} t={t} />} />
      <main className={styles.room}>
        <div className={styles.head}>
          <Avatar kind="company" name={deal.name} />
          <div>
            <h1>{deal.name}</h1>
            <p>{deal.tagline}</p>
          </div>
        </div>
        <div className={styles.tags}>
          <span className={styles.badge}>{deal.sector}</span>
          <span className={styles.badge}>{deal.round === 'seed' ? t.seedRound : t.communityRound}</span>
          {open ? <span className={styles.badge}>{plural(t, 'daysLeft', days, locale, { n: days })}</span> : <span className={styles.badge}>{t.closedBadge}</span>}
        </div>

        <section className={styles.panel} aria-label={t.fundedLabel}>
          <div><span className={styles.big}>{compact(deal.raisedMinor)}</span><span className={styles.of}>{format(t.ofTarget ?? '', { amount: compact(deal.targetMinor) })}</span></div>
          <div className={styles.bar} role="progressbar" aria-label={t.fundedLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: `${pct}%` }} /></div>
          <div className={styles.line}><b>{format(t.fundedPct ?? '', { pct })}</b><span>{plural(t, 'investors', deal.investors, locale, { n: money.formatNumber(deal.investors, 0, nl) })}</span></div>
          <dl className={styles.facts}>
            <div><dt>{t.valuationCap}</dt><dd>{compact(deal.valuationCapMinor)}</dd></div>
            <div><dt>{t.minimum}</dt><dd>{usd(deal.minInvestMinor, nl)}</dd></div>
            <div><dt>{t.instrument}</dt><dd>{deal.instrument}</dd></div>
            <div><dt>{t.closes}</dt><dd>{dateShort(deal.closesAt, locale)}</dd></div>
          </dl>
        </section>

        <section className={styles.sec} aria-labelledby="dd-h">
          <h2 id="dd-h">{t.ddTitle}</h2>
          <AiLabel label={t.aiLabel ?? ''} sources={t.ddNote}>
            <h3>{t.strengths}</h3>
            <ul>{deal.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
            <h3>{t.risks}</h3>
            <ul>{deal.risks.map((r) => <li key={r}>{r}</li>)}</ul>
          </AiLabel>
        </section>

        <div className={styles.sec}><RiskNotice title={t.riskTitle ?? ''}>{t.riskBody}</RiskNotice></div>

        <section className={styles.sec} aria-labelledby="uf-h">
          <h2 id="uf-h">{t.useOfFunds}</h2>
          <div className={styles.funds} aria-hidden="true">{deal.useOfFunds.map((u) => <i key={u.label} style={{ width: `${u.pct}%` }} />)}</div>
          <ul className={styles.legend}>{deal.useOfFunds.map((u) => <li key={u.label}><span className={styles.sw} aria-hidden="true" />{u.label}<b>{u.pct}%</b></li>)}</ul>
        </section>

        <section className={styles.sec} aria-labelledby="docs-h">
          <h2 id="docs-h">{t.documents}</h2>
          <ul className={styles.docs}>{deal.documents.map((d) => <li key={d.title}><span>{d.title}</span><small>{d.verified ? t.verified : t.founderUpload}</small></li>)}</ul>
        </section>

        <section className={`${styles.sec} ${styles.upd}`} aria-labelledby="up-h">
          <h2 id="up-h">{t.latestUpdate}</h2>
          <b>{deal.latestUpdate.title}</b>
          <small>{format(t.updateBy ?? '', { by: deal.latestUpdate.by, ago: time.relativeAgo(Date.parse(deal.latestUpdate.at), now, locale) })}</small>
          <p>{deal.updateBody}</p>
        </section>

        {open ? null : <div className={styles.closed}><EmptyState title={t.closedTitle ?? ''}>{t.closedBody}</EmptyState></div>}
        <p className={styles.note}>{t.dealSample}</p>
      </main>
      {open ? <ActionBar locale={locale} nl={nl} dealId={deal.id} minDollars={Math.ceil(deal.minInvestMinor / 100)} t={t} /> : null}
    </>
  );
}
