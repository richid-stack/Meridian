import type { Metadata } from 'next';
import { getMessages } from '@meridian/i18n';
import { WatchlistScreen } from '@/features/watchlist';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${(getMessages(locale).capital as Record<string, string>).watchlistTitle} · Meridian` };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <WatchlistScreen locale={locale} />;
}
