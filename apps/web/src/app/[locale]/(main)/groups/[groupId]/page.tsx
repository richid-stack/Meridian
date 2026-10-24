import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Group" legacy="v-group" />;
}
