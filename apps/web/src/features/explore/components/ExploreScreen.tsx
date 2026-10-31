import { api } from '@/lib/api';
import { getMessages } from '@meridian/i18n';
import { TopBar } from '@meridian/ui';
import { ExploreClient } from './ExploreClient';

export async function ExploreScreen({ locale, initialQuery }: { locale: string; initialQuery: string }) {
  const t = getMessages(locale).explore as Record<string, string>;
  const data = await api.explore.get();
  return (
    <>
      <TopBar />
      <ExploreClient key={initialQuery} locale={locale} t={t} data={data} initialQuery={initialQuery} />
    </>
  );
}
