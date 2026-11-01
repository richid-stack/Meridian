import type { Metadata } from 'next';
import { GroupScreen } from '@/features/groups';
import { getGroup } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; groupId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId } = await params;
  const g = await getGroup(groupId);
  return { title: `${g.name} · Meridian`, description: g.blurb };
}

export default async function GroupPage({ params }: Props) {
  const { locale, groupId } = await params;
  return <GroupScreen locale={locale} id={groupId} />;
}
