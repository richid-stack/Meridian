import Link from 'next/link';
import type { Story } from '@meridian/contracts';
import { time } from '@meridian/domain';
import { plural } from '@meridian/i18n';
import styles from './News.module.css';

const GLOBAL = new Set(['europe', 'asia', 'americas']);

export function SourceTile({ name }: { name: string }) {
  return <span className={styles.tile} aria-hidden="true">{name.charAt(0)}</span>;
}

export function Meta({ story, now, locale, t }: { story: Story; now: number; locale: string; t: Record<string, string> }) {
  return (
    <div className={styles.meta}>
      <SourceTile name={story.source} />
      <b>{story.source}</b>
      <span>{time.relativeAgo(Date.parse(story.at), now, locale)}</span>
      {story.lang !== 'en' ? <span className={styles.badge}>{story.lang.toUpperCase()}</span> : null}
      {GLOBAL.has(story.region) ? <span className={styles.badge}>{t.badgeGlobal}</span> : null}
    </div>
  );
}

export function StoryRow({ story, locale, now, t, lead }: { story: Story; locale: string; now: number; t: Record<string, string>; lead?: boolean }) {
  const others = story.sources.length - 1;
  const Heading = lead ? 'h2' : 'h3';
  return (
    <Link href={`/${locale}/news/${story.id}`} className={`${styles.item} ${lead ? styles.first : ''}`}>
      <Meta story={story} now={now} locale={locale} t={t} />
      <Heading>{story.title}</Heading>
      {lead ? <p>{story.snippet}</p> : null}
      {others > 0 ? (
        <span className={styles.cov}>
          <span className={styles.stack} aria-hidden="true">{story.sources.slice(0, 3).map((s) => <SourceTile key={s.source} name={s.source} />)}</span>
          <span>{plural(t, 'alsoCovered', others, locale)}</span>
        </span>
      ) : null}
    </Link>
  );
}
