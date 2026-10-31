import Link from 'next/link';
import { money } from '@meridian/domain';
import { Avatar, buttonClass, ProgressBar, RiskNotice, TrendBars } from '@meridian/ui';
import { format, getMessages, numberLocale, plural } from '@meridian/i18n';
import { getCompany } from '@/lib/data';
import { ClaimBanner } from '@/components/profile/ClaimBanner';
import { FollowButton } from '@/components/profile/FollowButton';
import { ProfileHead } from '@/components/profile/ProfileHead';
import { FactList, RowList } from '@/components/profile/Sections';
import { SnapshotPanel } from '@/components/profile/SnapshotPanel';
import { PageBar } from '@/components/shell/PageBar';
import styles from '@/components/profile/Profile.module.css';

export async function CompanyScreen({ locale, id }: { locale: string; id: string }) {
  const t = getMessages(locale).profile as Record<string, string>;
  const c = await getCompany(id);
  const nl = numberLocale(locale);
  const r = c.round;
  const pct = r ? Math.round((r.raisedMinor / r.targetMinor) * 100) : 0;

  return (
    <>
      <PageBar title={t.pageCompany ?? ''} backLabel={t.back ?? ''} fallbackHref={`/${locale}/explore`} />
      <main className={styles.wrap}>
        <ProfileHead kind="company" name={c.name} initials={c.letter} lines={[c.tagline, c.location]} />
        {c.claimed ? null : <ClaimBanner href={`/${locale}/claim/${c.id}`} t={t} />}
        <div className={styles.actions}><FollowButton follow={t.follow ?? ''} following={t.following ?? ''} /></div>

        <SnapshotPanel title={t.snapshot ?? ''} stage={c.stage} stats={c.stats}>
          <div className={styles.chart}>
            <p className={styles.chartTitle}>{c.unit}</p>
            <TrendBars data={c.trend} label={format(t.chartLabel ?? '{unit}', { unit: c.unit })} />
          </div>
        </SnapshotPanel>

        <p className={styles.lede} style={{ marginTop: 24 }}>{c.lede}</p>
        <h2 className={styles.h2}>{t.keyFacts}</h2>
        <FactList facts={c.facts} />

        {c.leaders.length ? (
          <>
            <h2 className={styles.h2}>{t.leadership}</h2>
            <div className={styles.leaders} role="region" aria-label={t.leadership} tabIndex={0}>
              {c.leaders.map((l) => (
                <Link key={l.id} href={`/${locale}/people/${l.id}`} className={styles.leader}>
                  <Avatar kind="person" name={l.name} size={92} fontSize={32} />
                  <b>{l.name}</b>
                  <span className={styles.leaderRole}>{l.role}</span>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {c.news.length ? (
          <>
            <h2 className={styles.h2}>{t.inTheNews}</h2>
            {c.news.map((n) => (
              <Link key={n.id} href={`/${locale}/news/${n.id}`} className={styles.news}><b>{n.title}</b><span>{n.source}</span></Link>
            ))}
          </>
        ) : null}

        {r ? (
          <section className={styles.round} aria-labelledby="round-h">
            <h2 id="round-h" className={styles.h2} style={{ marginTop: 0 }}>{t.communityRound}</h2>
            <p>{plural(t, 'roundBody', r.backers, locale, { name: c.name })}</p>
            <div className={styles.roundBar}><ProgressBar value={pct} label={t.communityRound ?? ''} /></div>
            <div className={styles.fund}>
              <span><b>{format(t.raised ?? '', { amount: money.formatCompactMoney(r.raisedMinor, r.currency, nl) })}</b></span>
              <span>{format(t.target ?? '', { amount: money.formatCompactMoney(r.targetMinor, r.currency, nl) })}</span>
            </div>
            <Link href={`/${locale}/capital/deals/${r.dealId}`} className={buttonClass('primary')}>{t.reviewRound}</Link>
            <div className={styles.risk}><RiskNotice title={t.riskTitle ?? ''}>{t.riskBody}</RiskNotice></div>
          </section>
        ) : null}

        {c.sources.length ? (
          <>
            <h2 className={styles.h2}>{t.tab_sources}</h2>
            <RowList rows={c.sources.map((s) => ({ left: s.title, right: `${s.kind}, ${s.date}` }))} />
            <p className={styles.sourcesNote}>{t.sourcesNote}</p>
          </>
        ) : null}
        <p className={styles.sampleNote}>{t.sampleNote}</p>
      </main>
    </>
  );
}
