import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { getDeal } from '@/lib/data';
import { DealRoom } from '@/features/capital';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; dealId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealId } = await params;
  const deal = await getDeal(dealId);
  return { title: `${deal.name} · Meridian` };
}

export default async function DealPage({ params }: Props) {
  const { locale, dealId } = await params;
  const [deal, watch] = await Promise.all([getDeal(dealId), api.capital.watchlist()]);
  return <DealRoom locale={locale} deal={deal} watched={watch.dealIds.includes(deal.id)} now={Date.now()} />;
}
