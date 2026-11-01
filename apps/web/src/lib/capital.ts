import { deals, money } from '@meridian/domain';
import { dateLocale } from '@meridian/i18n';

type SP = string | string[] | undefined;
const first = (v: SP) => (Array.isArray(v) ? v[0] : v);

export const DEAL_TABS = ['all', 'soon', 'new', 'closed'] as const;
export type DealTab = (typeof DEAL_TABS)[number];

/** Reads ?filter= from the URL. Anything unknown means "All open". */
export function parseDealTab(v: SP): DealTab {
  const x = first(v) ?? '';
  return (DEAL_TABS as readonly string[]).includes(x) ? (x as DealTab) : 'all';
}

export const capitalHref = (locale: string, tab: DealTab = 'all') => `/${locale}/capital${tab === 'all' ? '' : `?filter=${tab}`}`;
export const dealHref = (locale: string, id: string) => `/${locale}/capital/deals/${id}`;
export const investHref = (locale: string, id: string, dollars?: number) => `${dealHref(locale, id)}/invest${dollars ? `?amount=${dollars}` : ''}`;

export function compareHref(locale: string, a?: string, b?: string): string {
  const q = new URLSearchParams();
  if (a) q.set('a', a);
  if (b) q.set('b', b);
  const qs = q.toString();
  return `/${locale}/compare${qs ? `?${qs}` : ''}`;
}

/** Two different rounds to compare, from ?a= and ?b=. Unknown or repeated ids fall back to the first rounds that fit. */
export function parseCompare(sp: { a?: SP; b?: SP }, ids: string[]): { a: string; b: string } {
  const pick = (v: SP) => { const x = first(v); return x && ids.includes(x) ? x : undefined; };
  const a = pick(sp.a) ?? ids[0] ?? '';
  const asked = pick(sp.b);
  const b = asked && asked !== a ? asked : (ids.find((i) => i !== a) ?? a);
  return { a, b };
}

/** Whole dollars from ?amount=. Missing or empty gives the fallback. */
export function parseAmountParam(v: SP, fallback = 250): number {
  const n = deals.parseDollars(first(v) ?? '');
  return n > 0 ? n : fallback;
}

/** $250, or $510.50 when there are cents. */
export function usd(amountMinor: number, nl: string): string {
  return money.formatMoney(amountMinor, 'USD', nl, amountMinor % 100 === 0 ? 0 : 2);
}

/** Same date on the server and in the browser: always UTC. */
export function dateShort(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(dateLocale(locale), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
}
