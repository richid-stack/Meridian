import type { Metadata } from 'next';
import { getMessages } from '@meridian/i18n';
import { CommunityScreen, parseTab } from '@/features/community';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${(getMessages(locale).community as Record<string, string>).title} · Meridian` };
}

export default async function CommunityPage({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  return <CommunityScreen locale={locale} tab={parseTab(sp.tab)} />;
}
