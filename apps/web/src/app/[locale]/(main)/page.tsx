import { HomeScreen } from '@/features/home';

// Rendered per request: the date and the feed change every day.
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Meridian' };

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomeScreen locale={locale} />;
}
