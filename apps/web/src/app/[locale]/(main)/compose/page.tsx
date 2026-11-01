import type { Metadata } from 'next';
import type { Attachment } from '@meridian/contracts';
import { getMessages } from '@meridian/i18n';
import { ComposeScreen } from '@/features/compose';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${(getMessages(locale).compose as Record<string, string>).title} · Meridian`, robots: { index: false } };
}

export default async function ComposePage({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const [list, attachables] = await Promise.all([api.groups.list(), api.community.attachables()]);
  const groups = [...list.mine, ...list.discover].filter((g) => !g.restricted);

  // "Share to community" from a news story arrives as ?story=<id>. An unknown id is ignored.
  let initialAttachment: Attachment | null = null;
  const storyId = first(sp.story);
  if (storyId) {
    try {
      const s = await api.news.get(storyId);
      initialAttachment = { kind: 'story', id: s.id, title: s.title, subtitle: s.source };
    } catch { /* not found: compose without it */ }
  }
  const groupId = first(sp.group);
  return <ComposeScreen locale={locale} groups={groups} attachables={attachables} initialAttachment={initialAttachment} initialGroupId={groups.some((g) => g.id === groupId) ? (groupId ?? null) : null} t={getMessages(locale).compose as Record<string, string>} />;
}
