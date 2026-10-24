import { ScreenPlaceholder } from '@/components/dev/ScreenPlaceholder';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  return <ScreenPlaceholder name="Article" legacy="v-article" />;
}
