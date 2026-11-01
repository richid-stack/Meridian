import { getMessages, numberLocale } from '@meridian/i18n';
import { getGroup } from '@/lib/data';
import { PageBar } from '@/components/shell/PageBar';
import { PostCard } from '@/components/community/PostCard';
import { YourPosts } from '@/components/community/YourPosts';
import { GroupHeader } from './GroupHeader';
import styles from './Group.module.css';

export async function GroupScreen({ locale, id }: { locale: string; id: string }) {
  const t = getMessages(locale).community as Record<string, string>;
  const g = await getGroup(id);
  const nl = numberLocale(locale);
  const now = Date.now();
  const { pinned, posts, ...summary } = g;
  return (
    <>
      <PageBar title={t.groupTitle ?? ''} backLabel={t.back ?? ''} fallbackHref={`/${locale}/community?tab=groups`} />
      <main className={styles.wrap}>
        <GroupHeader group={summary} locale={locale} nl={nl} t={t} />
        <div className={styles.pin}><small>{t.pinned}</small><p>{pinned}</p></div>
        <h2 className={styles.h2}>{t.recentPosts}</h2>
        <YourPosts locale={locale} nl={nl} t={t} groupId={g.id} />
        {posts.length ? posts.map((p) => <PostCard key={p.id} post={p} locale={locale} now={now} nl={nl} t={t} />) : <p className={styles.empty}>{t.noGroupPosts}</p>}
        <p className={styles.note}>{t.groupSample}</p>
      </main>
    </>
  );
}
