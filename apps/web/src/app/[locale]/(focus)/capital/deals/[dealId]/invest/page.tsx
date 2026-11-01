import type { Metadata } from 'next';
import Link from 'next/link';
import { format, getMessages, numberLocale } from '@meridian/i18n';
import { buttonClass, EmptyState } from '@meridian/ui';
import { InvestFlow } from '@/features/invest';
import { PageBar } from '@/components/shell/PageBar';
import { dealHref, parseAmountParam } from '@/lib/capital';
import { getDeal } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; dealId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dealId } = await params;
  const deal = await getDeal(dealId);
  return { title: `${format((getMessages(locale).invest as Record<string, string>).investIn ?? '', { name: deal.name })} · Meridian` };
}

export default async function InvestPage({ params, searchParams }: Props) {
  const [{ locale, dealId }, sp] = await Promise.all([params, searchParams]);
  const deal = await getDeal(dealId);
  const t = getMessages(locale).invest as Record<string, string>;
  const c = getMessages(locale).capital as Record<string, string>;
  if (deal.status !== 'open') {
    return (
      <>
        <PageBar title={deal.name} backLabel={t.back ?? ''} fallbackHref={dealHref(locale, deal.id)} />
        <main style={{ maxWidth: 560, margin: '0 auto', padding: '24px var(--margin)' }}>
          <EmptyState title={t.closedTitle ?? ''} action={<Link href={dealHref(locale, deal.id)} className={buttonClass('outline')}>{c.viewRound}</Link>}>{t.closedBody}</EmptyState>
        </main>
      </>
    );
  }
  return <InvestFlow locale={locale} nl={numberLocale(locale)} deal={deal} startDollars={parseAmountParam(sp.amount)} t={t} />;
}
