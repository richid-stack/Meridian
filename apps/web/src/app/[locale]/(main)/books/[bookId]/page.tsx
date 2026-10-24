import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
  await params;
  return <ScreenPlaceholder name="Book" legacy="v-book" />;
}
