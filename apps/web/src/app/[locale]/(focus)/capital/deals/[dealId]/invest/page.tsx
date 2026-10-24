import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function InvestPage({ params }: { params: Promise<{ dealId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Invest" legacy="v-invest" />;
}
