import Link from 'next/link';
import { Avatar, EmptyState, TopBar } from '@meridian/ui';
import { api } from '@/lib/api';
import { dateLocale, format, getMessages, numberLocale as numLocale } from '@meridian/i18n';
import { AskBar } from './AskBar';
import { ForYou } from './ForYou';
import { Greeting } from './Greeting';
import { LeadStory } from './LeadStory';
import { MarketsStrip } from './MarketsStrip';
import { PeopleRail } from './PeopleRail';
import { Section } from './Section';
import styles from './HomeScreen.module.css';

export async function HomeScreen({ locale }: { locale: string }) {
  const t = getMessages(locale).home as Record<string, string>;
  const home = await api.feed.getHome();
  const nl = numLocale(locale);
  const dateText = new Intl.DateTimeFormat(dateLocale(locale), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <>
      <TopBar actions={
        <Link href={`/${locale}/you`} aria-label={t.yourProfile} className={styles.me}>
          <Avatar kind="round" name="Rich" size={32} fontSize={14} />
        </Link>
      } />
      <main className={styles.wrap}>
        <Greeting morning={t.greetingMorning ?? ''} afternoon={t.greetingAfternoon ?? ''} evening={t.greetingEvening ?? ''} initial={t.greetingMorning ?? ''} dateText={dateText} />
        <AskBar locale={locale} label={t.askLabel ?? ''} placeholder={t.askPlaceholder ?? ''} />
        <MarketsStrip ticks={home.markets.ticks} isSample={home.markets.isSample} title={t.markets ?? ''} sampleLabel={t.sample ?? ''} numberLocale={nl} />
        <LeadStory
          story={home.lead}
          href={`/${locale}/news/${home.lead.id}`}
          kicker={t.leadKicker ?? ''}
          briefLabel={t.inBrief ?? ''}
          by={format(t.by ?? '', { author: home.lead.author })}
          readTime={format(t.readMinutes ?? '', { n: home.lead.readMinutes })}
        />
        <Section title={t.peopleToWatch ?? ''} linkLabel={t.seeAll} href={`/${locale}/explore`}>
          <PeopleRail people={home.people} locale={locale} label={t.peopleRegion ?? ''} />
        </Section>
        <Section title={t.forYou ?? ''}>
          {home.forYou.length > 0
            ? <ForYou items={home.forYou} locale={locale} numberLocale={nl} t={t} />
            : <EmptyState title={t.emptyTitle ?? ''}>{t.emptyBody}</EmptyState>}
        </Section>
      </main>
    </>
  );
}
