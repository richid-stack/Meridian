'use client';

import { useRouter } from 'next/navigation';
import { Pill } from '@meridian/ui';
import { newsHref } from '../lib';
import styles from './News.module.css';

const REGIONS = ['africa', 'west', 'east', 'south', 'north', 'global'] as const;
const TOPICS = ['all', 'markets', 'startups', 'fintech', 'energy', 'health', 'logistics', 'policy', 'tech', 'retail'] as const;

/** Chips that change the URL. Changing a filter goes back to the first page. */
export function NewsFilters({ locale, region, topic, t }: { locale: string; region: string; topic: string; t: Record<string, string> }) {
  const router = useRouter();
  const go = (next: { region?: string; topic?: string }) =>
    router.push(newsHref(locale, { region: (next.region ?? region) as never, topic: (next.topic ?? topic) as never, page: 1 }), { scroll: false });
  return (
    <div className={styles.filters}>
      <div className={styles.chips} role="group" aria-label={t.regionLabel}>
        {REGIONS.map((r) => <Pill key={r} selected={r === region} onClick={() => go({ region: r })}>{t[`region_${r}`]}</Pill>)}
      </div>
      <div className={styles.chips} role="group" aria-label={t.topicLabel}>
        {TOPICS.map((x) => <Pill key={x} selected={x === topic} onClick={() => go({ topic: x })}>{t[`topic_${x}`]}</Pill>)}
      </div>
    </div>
  );
}
