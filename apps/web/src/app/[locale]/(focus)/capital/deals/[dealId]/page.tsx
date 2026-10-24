import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function DealPage({ params }: { params: Promise<{ dealId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Deal" legacy="v-deal" />;
}
