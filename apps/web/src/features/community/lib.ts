import { CommunityTabSchema, type CommunityTab } from '@meridian/contracts';

export function parseTab(value: string | string[] | undefined): CommunityTab {
  const v = Array.isArray(value) ? value[0] : value;
  const parsed = CommunityTabSchema.safeParse(v);
  return parsed.success ? parsed.data : 'for-you';
}

export function tabHref(locale: string, tab: CommunityTab): string {
  return tab === 'for-you' ? `/${locale}/community` : `/${locale}/community?tab=${tab}`;
}
