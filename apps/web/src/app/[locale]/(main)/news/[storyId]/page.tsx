import type { Metadata } from 'next';
import { StoryScreen } from '@/features/news';
import { getStory } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; storyId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storyId } = await params;
  const s = await getStory(storyId);
  return { title: `${s.title} · Meridian`, description: s.snippet };
}

export default async function StoryPage({ params }: Props) {
  const { locale, storyId } = await params;
  return <StoryScreen locale={locale} id={storyId} />;
}
