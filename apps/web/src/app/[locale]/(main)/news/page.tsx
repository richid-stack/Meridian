import type { Metadata } from 'next';
import { getMessages } from '@meridian/i18n';
import { NewsScreen, parseNewsQuery } from '@/features/news';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(locale).news as Record<string, string>;
  return { title: `${t.heading} · Meridian` };
}

export default async function NewsPage({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  return <NewsScreen locale={locale} query={parseNewsQuery(sp)} />;
}
