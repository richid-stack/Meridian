import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function EpisodePage({ params }: { params: Promise<{ episodeId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Episode" legacy="v-player" />;
}
