import Link from 'next/link';
import { AiLabel, buttonClass } from '@meridian/ui';
import { news } from '@meridian/domain';
import { format, getMessages } from '@meridian/i18n';
import { getStory } from '@/lib/data';
import { PageBar } from '@/components/shell/PageBar';
import { Meta, SourceTile } from './StoryRow';
import { ReportProblem } from './ReportProblem';
import { StoryText } from './StoryText';
import styles from './News.module.css';

export async function StoryScreen({ locale, id }: { locale: string; id: string }) {
  const t = getMessages(locale).news as Record<string, string>;
  const s = await getStory(id);
  const now = Date.now();
  return (
    <>
      <PageBar title={t.storyTitle ?? ''} backLabel={t.back ?? ''} fallbackHref={`/${locale}/news`} />
      <main className={`${styles.wrap} ${styles.story}`}>
        <div className={styles.storyTop}><Meta story={s} now={now} locale={locale} t={t} /></div>
        <StoryText original={{ title: s.title, snippet: s.snippet }} translation={s.translation ?? null} lang={s.lang} t={t} />

        {s.africaNote ? (
          <div className={styles.why}>
            <AiLabel label={t.whyTitle ?? ''} sources={t.whyNote}>{s.africaNote}</AiLabel>
          </div>
        ) : null}

        {s.mentions.length ? (
          <>
            <h2 className={styles.h2}>{t.mentioned}</h2>
            <div className={styles.ent}>
              {s.mentions.map((m) => (
                <Link key={m.id} href={`/${locale}/${m.kind === 'person' ? 'people' : 'companies'}/${m.id}`} className={styles.entLink}>
                  <small>{t[`kind_${m.kind}`]}</small>{m.name}
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <div className={styles.act}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className={buttonClass('go')}>
            {format(t.readAt ?? '', { source: s.source })}<span className={styles.sr}> {t.newTab}</span>
          </a>
          <Link href={`/${locale}/compose?story=${encodeURIComponent(s.id)}`} className={buttonClass('outline')}>{t.share}</Link>
        </div>

        {s.sources.length > 1 ? (
          <>
            <h2 className={styles.h2}>{format(t.coverage ?? '', { n: s.sources.length })}</h2>
            <div>
              {s.sources.map((x) => (
                <a key={x.source} href={x.url} target="_blank" rel="noopener noreferrer" className={styles.src}>
                  <SourceTile name={x.source} />
                  <span><b>{x.title}</b><small>{x.source}, {news.relativeAgo(Date.parse(x.at), now, locale)}</small></span>
                </a>
              ))}
            </div>
          </>
        ) : null}

        <p className={styles.rights}>{format(t.rights ?? '', { source: s.source })}</p>
        <ReportProblem label={t.report ?? ''} thanks={t.reportThanks ?? ''} />
        <p className={styles.note}>{t.sampleNote}</p>
      </main>
    </>
  );
}
