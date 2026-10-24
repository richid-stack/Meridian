import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function CompanyPage({ params }: { params: Promise<{ companyId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Company" legacy="v-company / v-gorg" />;
}
