import { ExploreScreen } from '@/features/explore';

export const metadata = { title: 'Explore · Meridian' };

export default async function ExplorePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string | string[] }> }) {
  const { locale } = await params;
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q) ?? '';
  return <ExploreScreen locale={locale} initialQuery={initialQuery.slice(0, 100)} />;
}
