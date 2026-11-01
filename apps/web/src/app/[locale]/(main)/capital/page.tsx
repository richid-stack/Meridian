import type { Metadata } from 'next';
import { getMessages } from '@meridian/i18n';
import { CapitalScreen } from '@/features/capital';
import { parseDealTab } from '@/lib/capital';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${(getMessages(locale).capital as Record<string, string>).title} · Meridian` };
}

export default async function CapitalPage({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  return <CapitalScreen locale={locale} tab={parseDealTab(sp.filter)} />;
}
