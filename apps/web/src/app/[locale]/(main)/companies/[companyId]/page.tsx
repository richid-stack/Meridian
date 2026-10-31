import type { Metadata } from 'next';
import { CompanyScreen } from '@/features/companies';
import { getCompany } from '@/lib/data';

type Props = { params: Promise<{ locale: string; companyId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companyId } = await params;
  const c = await getCompany(companyId);
  return { title: `${c.name} · Meridian`, description: `${c.tagline}. ${c.location}` };
}

export default async function CompanyPage({ params }: Props) {
  const { locale, companyId } = await params;
  return <CompanyScreen locale={locale} id={companyId} />;
}
