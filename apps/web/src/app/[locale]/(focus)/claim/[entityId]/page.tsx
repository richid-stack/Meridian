import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function ClaimPage({ params }: { params: Promise<{ entityId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Claim" legacy="v-claim" />;
}
