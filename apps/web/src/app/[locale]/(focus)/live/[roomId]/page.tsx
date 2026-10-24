import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function LivePage({ params }: { params: Promise<{ roomId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Live" legacy="v-live" />;
}
