import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function IntroPage({ params }: { params: Promise<{ personId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Intro" legacy="v-intro" />;
}
