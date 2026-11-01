import type { Metadata } from 'next';
import { getMessages } from '@meridian/i18n';
import { CompareScreen } from '@/features/compare';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${(getMessages(locale).capital as Record<string, string>).compareTitle} · Meridian` };
}

export default async function ComparePage({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  return <CompareScreen locale={locale} a={sp.a} b={sp.b} />;
}
