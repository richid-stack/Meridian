import Link from 'next/link';
import { entities } from '@meridian/domain';
import { buttonClass, TrendLine } from '@meridian/ui';
import { format, getMessages } from '@meridian/i18n';
import { getPerson } from '@/lib/data';
import { ClaimBanner } from '@/components/profile/ClaimBanner';
import { FollowButton } from '@/components/profile/FollowButton';
import { ProfileHead } from '@/components/profile/ProfileHead';
import { ProfileTabs, type TabSection } from '@/components/profile/ProfileTabs';
import { BookList, FactList, InterviewList, RowList, Timeline } from '@/components/profile/Sections';
import { SnapshotPanel } from '@/components/profile/SnapshotPanel';
import { PageBar } from '@/components/shell/PageBar';
import styles from '@/components/profile/Profile.module.css';

export async function PersonScreen({ locale, id }: { locale: string; id: string }) {
  const t = getMessages(locale).profile as Record<string, string>;
  const p = await getPerson(id);
  const pct = entities.growthPct(p.snapshot.series);

  const sections: TabSection[] = [
    {
      id: 'overview', label: t.tab_overview ?? '',
      content: (
        <>
          {p.lede.map((para) => <p key={para} className={styles.lede}>{para}</p>)}
          <h2 className={styles.h2}>{t.keyFacts}</h2>
          <FactList facts={p.facts} />
        </>
      ),
    },
  ];
  if (p.timeline.length) sections.push({ id: 'timeline', label: t.tab_timeline ?? '', content: <Timeline items={p.timeline} /> });
  if (p.books.length) sections.push({ id: 'books', label: t.tab_books ?? '', content: <BookList books={p.books} locale={locale} recommended={t.recommended ?? ''} /> });
  if (p.interviews.length) sections.push({ id: 'interviews', label: t.tab_interviews ?? '', content: <InterviewList items={p.interviews} locale={locale} t={t} /> });
  if (p.backers.length) sections.push({ id: 'backers', label: t.tab_backers ?? '', content: <RowList rows={p.backers.map((b) => ({ left: b.name, right: b.role }))} /> });
  if (p.sources.length) {
    sections.push({
      id: 'sources', label: t.tab_sources ?? '',
      content: (<><RowList rows={p.sources.map((s) => ({ left: s.title, right: `${s.kind}, ${s.date}` }))} /><p className={styles.sourcesNote}>{t.sourcesNote}</p></>),
    });
  }

  return (
    <>
      <PageBar title={t.pageProfile ?? ''} backLabel={t.back ?? ''} fallbackHref={`/${locale}/explore`} />
      <main className={styles.wrap}>
        <ProfileHead kind="person" name={p.name} initials={p.initials} lines={[`${p.role}.`, p.location]} />
        {p.claimed ? null : <ClaimBanner href={`/${locale}/claim/${p.id}`} t={t} />}
        <div className={styles.actions}>
          <FollowButton follow={t.follow ?? ''} following={t.following ?? ''} />
          {p.claimed ? (
            <>
              <Link href={`/${locale}/messages/${p.id}`} className={buttonClass('outline')}>{t.message}</Link>
              <Link href={`/${locale}/people/${p.id}/intro`} className={buttonClass('outline')}>{t.requestIntro}</Link>
            </>
          ) : null}
        </div>
        <SnapshotPanel title={p.snapshot.title} stage={p.snapshot.stage} stats={p.snapshot.stats}>
          <div className={styles.spark}>
            <TrendLine series={p.snapshot.series} />
            <p className={styles.sparkLabel} aria-label={`${p.snapshot.seriesLabel}: ${format(t.growthLabel ?? '', { pct: `${pct >= 0 ? '+' : ''}${pct}` })}`}>
              {p.snapshot.seriesLabel}<b>{pct >= 0 ? '+' : ''}{pct}%</b>
            </p>
          </div>
        </SnapshotPanel>
        <ProfileTabs sections={sections} label={t.tabsLabel ?? ''} />
        <p className={styles.sampleNote}>{t.sampleNote}</p>
      </main>
    </>
  );
}
