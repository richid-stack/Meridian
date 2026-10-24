import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function PersonPage({ params }: { params: Promise<{ personId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Person" legacy="v-profile / v-gperson" />;
}
