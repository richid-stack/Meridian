import { notFound } from 'next/navigation';
import {
  AiLabel, Avatar, Button, EmptyState, ErrorState, Field, ListRow, MoneyText, Pill, ProgressBar,
  RiskNotice, Rule, Skeleton, SourceLabel, StatPanel,
} from '@meridian/ui';
import { ThemeToggle } from '@/components/dev/ThemeToggle';
import { DesignTabs } from './DesignTabs';
import s from './design.module.css';

export const metadata = { title: 'Design system (dev)' };

export default function DesignPage() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_DEV_ROUTES !== 'true') notFound();
  return (
    <main className={s.wrap}>
      <header className={s.head}>
        <span className={s.logo}>Meridian<i /></span>
        <ThemeToggle />
      </header>
      <h1 className={s.h1}>Design system</h1>
      <p className={s.lede}>One language for a product that reads like a newspaper and works like a terminal.</p>

      <section data-demo="buttons"><h2 className={s.h2}>Buttons and chips</h2>
        <div className={s.row}><Button>Follow</Button><Button variant="outline">Save</Button><Button variant="go">Continue with $250</Button></div>
        <div className={s.row}><Pill selected>All</Pill><Pill>People</Pill><Pill>Companies</Pill></div>
      </section>

      <section data-demo="tabs"><h2 className={s.h2}>Tabs</h2><DesignTabs /></section>

      <section data-demo="entities"><h2 className={s.h2}>Entities</h2>
        <div className={s.row}><Avatar kind="person" name="Ama Boateng" /><Avatar kind="company" name="Kora Freight" /><Avatar kind="round" name="Kunle Okafor" /></div>
        <ListRow leading={<Avatar kind="company" name="Kora Freight" />} title="Kora Freight" meta="Digital freight network, Accra" />
        <ListRow leading={<Avatar kind="person" name="Nia Mensah" />} title="Nia Mensah" meta="Founder, Aya Health" />
      </section>

      <section data-demo="data"><h2 className={s.h2}>Data</h2>
        <StatPanel stats={[{ label: 'Valuation', value: '$180M' }, { label: 'Total raised', value: '$64M' }]} caption="+212% revenue, five years" />
        <div className={s.gap}><ProgressBar value={64} label="Round progress" /></div>
        <p>Minimum ticket <MoneyText amountMinor={25000} currency="USD" /></p>
      </section>

      <section data-demo="search"><h2 className={s.h2}>Search</h2><Field label="Search people and companies" placeholder="Search people and companies" /></section>

      <section data-demo="trust"><h2 className={s.h2}>Trust</h2>
        <AiLabel label="Summary" sources={<SourceLabel label="Drawn from" source="2 sources" href="#" />}>
          Freight in West Africa is consolidating around a few digital networks.
        </AiLabel>
        <div className={s.gap}><RiskNotice title="Risk">Investment is illiquid and you could lose all of it.</RiskNotice></div>
      </section>

      <section data-demo="states"><h2 className={s.h2}>States</h2>
        <div className={s.gap}><Skeleton height={18} width="60%" /><div className={s.gap}><Skeleton height={14} /></div></div>
        <EmptyState title="Nothing saved yet" action={<Button variant="outline">Browse news</Button>}>Stories you save will appear here.</EmptyState>
        <ErrorState title="Could not load deals" action={<Button variant="outline">Try again</Button>}>Check your connection and try again.</ErrorState>
      </section>
      <Rule />
    </main>
  );
}
