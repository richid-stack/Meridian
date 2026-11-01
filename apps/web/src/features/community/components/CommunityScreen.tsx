import Link from 'next/link';
import type { CommunityTab } from '@meridian/contracts';
import { money, time } from '@meridian/domain';
import { Avatar, EmptyState, TopBar } from '@meridian/ui';
import { format, getMessages, numberLocale } from '@meridian/i18n';
import { api } from '@/lib/api';
import { PlusIcon } from '@/components/community/icons';
import { PostCard } from '@/components/community/PostCard';
import { tabHref } from '../lib';
import { GroupsPanel } from './GroupsPanel';
import { YourPosts } from '@/components/community/YourPosts';
import styles from './Community.module.css';

const TABS: CommunityTab[] = ['for-you', 'following', 'groups'];

export async function CommunityScreen({ locale, tab }: { locale: string; tab: CommunityTab }) {
  const t = getMessages(locale).community as Record<string, string>;
  const nl = numberLocale(locale);
  const now = Date.now();
  const [feed, groups] = await Promise.all([
    tab === 'groups' ? Promise.resolve(null) : api.community.feed(tab),
    tab === 'groups' ? api.groups.list() : Promise.resolve(null),
  ]);

  return (
    <>
      <TopBar actions={
        <Link href={`/${locale}/you`} aria-label={t.yourProfile} className={styles.me}><Avatar kind="round" name="Rich" size={32} fontSize={14} /></Link>
      } />
      <main className={styles.wrap}>
        <div className={styles.tabs} role="group" aria-label={t.tabsLabel}>
          {TABS.map((x) => <Link key={x} href={tabHref(locale, x)} className={styles.tab} aria-current={x === tab ? 'page' : undefined} scroll={false}>{t[`tab_${x}`]}</Link>)}
        </div>

        {groups ? <GroupsPanel groups={[...groups.mine, ...groups.discover]} locale={locale} nl={nl} t={t} /> : null}

        {feed ? (
          <>
            {feed.live ? (
              <Link href={`/${locale}/live/${feed.live.id}`} className={styles.live}>
                <span className={styles.liveHead}><i aria-hidden="true" /><b>{t.liveNow}</b><span>{format(t.listening ?? '', { n: money.formatNumber(feed.live.listeners, 0, nl) })}</span></span>
                <h2>{feed.live.title}</h2>
                <p>{feed.live.blurb}</p>
                <span className={styles.liveFoot}>
                  <span>{format(t.startedAgo ?? '', { ago: time.relativeAgo(Date.parse(feed.live.startedAt), now, locale) })}</span>
                  <span className={styles.liveJoin}>{t.joinLive}</span>
                </span>
              </Link>
            ) : null}
            {tab === 'for-you' ? <YourPosts locale={locale} nl={nl} t={t} /> : null}
            {feed.posts.length === 0
              ? <EmptyState title={(tab === 'following' ? t.emptyFollowingTitle : t.emptyFeedTitle) ?? ''}>{tab === 'following' ? t.emptyFollowingBody : t.emptyFeedBody}</EmptyState>
              : feed.posts.map((p) => <PostCard key={p.id} post={p} locale={locale} now={now} nl={nl} t={t} />)}
          </>
        ) : null}

        <p className={styles.note}>{t.sampleNote}</p>
      </main>
      <Link href={`/${locale}/compose`} className={styles.fab} aria-label={t.newPost}><PlusIcon /></Link>
    </>
  );
}
