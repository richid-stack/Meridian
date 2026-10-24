import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Thread" legacy="v-thread" />;
}
