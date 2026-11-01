export type DealFilter = 'all' | 'soon' | 'new' | 'closed' | 'any';

const DAY_MS = 86_400_000;

/** Percent funded, rounded and kept between 0 and 100. */
export function fundedPct(raisedMinor: number, targetMinor: number): number {
  if (targetMinor <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((raisedMinor / targetMinor) * 100)));
}

/** Whole days until a round closes, rounded up. Never negative. */
export function daysLeft(closesAt: string | number, now: number): number {
  const end = typeof closesAt === 'number' ? closesAt : Date.parse(closesAt);
  return Math.max(0, Math.ceil((end - now) / DAY_MS));
}

export const CLOSING_SOON_DAYS = 14;

export interface FilterableDeal { status: 'open' | 'closed'; closesAt: string; isNew: boolean }

/** 'all' is open rounds. 'any' keeps every round, open or closed (used to look rounds up, not shown as a tab). */
export function filterDeals<T extends FilterableDeal>(deals: T[], filter: DealFilter, now: number): T[] {
  switch (filter) {
    case 'any': return deals;
    case 'closed': return deals.filter((d) => d.status === 'closed');
    case 'soon': return deals.filter((d) => d.status === 'open' && daysLeft(d.closesAt, now) <= CLOSING_SOON_DAYS);
    case 'new': return deals.filter((d) => d.status === 'open' && d.isNew);
    default: return deals.filter((d) => d.status === 'open');
  }
}
