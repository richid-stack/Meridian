import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function StoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Story" legacy="v-story" />;
}
