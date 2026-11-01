'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Activity, DealSummary, Position } from '@meridian/contracts';
import { deals, time } from '@meridian/domain';
import { format, plural } from '@meridian/i18n';
import { buttonClass, EmptyState } from '@meridian/ui';
import { capitalHref, dateShort, dealHref, usd } from '@/lib/capital';
import { SAMPLE_MODE } from '@/lib/sample';
import { readSample } from '@/lib/sampleStore';
import styles from './Portfolio.module.css';

interface Props {
  locale: string; nl: string; now: number; t: Record<string, string>;
  positions: Position[]; activity: Activity[]; rounds: DealSummary[];
}

export function PortfolioView({ locale, nl, now, t, positions: basePositions, activity: baseActivity, rounds }: Props) {
  const [view, setView] = useState({ positions: basePositions as deals.PositionLike[], activity: baseActivity });
  const [open, setOpen] = useState<string | null>(null);

  // Sample mode: add what this browser committed.
  useEffect(() => {
    if (!SAMPLE_MODE) return;
    const mine = readSample().investments;
    setView({
      positions: deals.mergePositions(basePositions, mine.map((i) => ({ dealId: i.dealId, amountMinor: i.amountMinor, status: i.status, at: i.at, ref: i.ref }))),
      activity: [...baseActivity, ...mine.map((i) => ({ dealId: i.dealId, amountMinor: i.amountMinor, at: i.at }))].sort((a, b) => b.at.localeCompare(a.at)),
    });
  }, [basePositions, baseActivity]);

  const byId = new Map(rounds.map((r) => [r.id, r]));
  const sectorOf = (id: string) => byId.get(id)?.sector ?? '';
  const total = deals.totalInvested(view.positions);
  const alloc = deals.allocationBySector(view.positions, sectorOf);
  const nameOf = (id: string) => byId.get(id)?.name ?? id;

  if (view.positions.length === 0) {
    return (
      <EmptyState title={t.portfolioEmptyTitle ?? ''} action={<Link href={capitalHref(locale)} className={buttonClass('outline')}>{t.browseRounds}</Link>}>{t.portfolioEmptyBody}</EmptyState>
    );
  }

  return (
    <>
      <section className={styles.total} aria-label={t.totalInvested}>
        <span className={styles.big}>{usd(total, nl)}</span>
        <p>{t.totalInvested} {plural(t, 'inRounds', view.positions.length, locale, { n: view.positions.length })}</p>
      </section>
      <dl className={styles.byStatus}>
        {(['committed', 'in_review', 'funded'] as const).map((st) => <div key={st}><dt>{t[`status_${st}`]}</dt><dd>{usd(deals.totalByStatus(view.positions, st), nl)}</dd></div>)}
      </dl>

      <section className={styles.sec} aria-labelledby="alloc-h">
        <h2 id="alloc-h">{t.allocation}</h2>
        <ul className={styles.alloc}>
          {alloc.map((a) => (
            <li key={a.sector}>
              <span>{a.sector}<b>{a.pct}%</b></span>
              <div className={styles.bar} aria-hidden="true"><i style={{ width: `${a.pct}%` }} /></div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.sec} aria-labelledby="pos-h">
        <h2 id="pos-h">{t.positions}</h2>
        {view.positions.map((p) => {
          const r = byId.get(p.dealId);
          const isOpen = open === p.dealId;
          return (
            <div className={styles.pos} key={p.dealId}>
              <button type="button" className={styles.posBtn} aria-expanded={isOpen} aria-controls={`pos-${p.dealId}`} aria-label={format(t.showDetails ?? '', { name: nameOf(p.dealId) })} onClick={() => setOpen(isOpen ? null : p.dealId)}>
                <span className={styles.posName}><b>{nameOf(p.dealId)}</b><small>{sectorOf(p.dealId)}</small></span>
                <span className={styles.posAmt}><b>{usd(p.amountMinor, nl)}</b><small>{t[`status_${p.status}`]}</small></span>
                <svg className={styles.chev} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
              {isOpen ? (
                <div className={styles.detail} id={`pos-${p.dealId}`}>
                  <dl>
                    {r ? <div><dt>{t.communityRound}</dt><dd>{format(t.positionRound ?? '', { round: r.round === 'seed' ? (t.round_seed ?? '') : (t.round_community ?? ''), instrument: r.instrument })}</dd></div> : null}
                    <div><dt>{t.reference}</dt><dd>{p.ref}</dd></div>
                    <div><dt>{t.date}</dt><dd>{dateShort(p.at, locale)}</dd></div>
                  </dl>
                  {r ? (
                    <div className={styles.upd}>
                      <b>{r.latestUpdate.title}</b>
                      <small>{format(t.updateBy ?? '', { by: r.latestUpdate.by, ago: time.relativeAgo(Date.parse(r.latestUpdate.at), now, locale) })}</small>
                    </div>
                  ) : null}
                  <div><Link href={dealHref(locale, p.dealId)} className={buttonClass('outline')}>{t.viewRound}</Link></div>
                </div>
              ) : null}
            </div>
          );
        })}
      </section>

      <section className={styles.sec} aria-labelledby="act-h">
        <h2 id="act-h">{t.activity}</h2>
        <ul className={styles.act}>
          {view.activity.map((a) => (
            <li key={`${a.dealId}-${a.at}-${a.amountMinor}`}>
              <span>{format(t.activityCommitted ?? '', { amount: usd(a.amountMinor, nl), name: nameOf(a.dealId) })}</span>
              <time dateTime={a.at}>{dateShort(a.at, locale)}</time>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
