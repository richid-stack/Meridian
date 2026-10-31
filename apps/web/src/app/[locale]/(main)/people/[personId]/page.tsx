import type { Metadata } from 'next';
import { PersonScreen } from '@/features/people';
import { getPerson } from '@/lib/data';

type Props = { params: Promise<{ locale: string; personId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { personId } = await params;
  const p = await getPerson(personId);
  return { title: `${p.name} · Meridian`, description: `${p.role}. ${p.location}` };
}

export default async function PersonPage({ params }: Props) {
  const { locale, personId } = await params;
  return <PersonScreen locale={locale} id={personId} />;
}
