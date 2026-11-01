import {
  CommitInputSchema, DealListSchema, DealSchema, InvestmentSchema, PortfolioSchema, WatchlistSchema,
  type CommitInput, type Deal, type DealFilter, type DealList, type Investment, type Portfolio, type Watchlist,
} from '@meridian/contracts';
import { deals } from '@meridian/domain';
import { ApiError } from '../errors';

// Fictional sample rounds (prototype HANDOVER section 7). Real rounds need a licensed partner and legal review.
const DAY = 86_400_000;
const iso = (ms: number) => new Date(ms).toISOString();

interface Row extends Omit<Deal, 'closesAt' | 'latestUpdate' | 'updateBody'> { days: number; update: { title: string; by: string; body: string; daysAgo: number } }

const ROWS: Row[] = [
  {
    id: 'aya-health-seed', companyId: 'aya-health', name: 'Aya Health', letter: 'A', sector: 'Health', tagline: 'Solar-powered clinics', round: 'seed', instrument: 'SAFE',
    valuationCapMinor: 1_200_000_000, minInvestMinor: 10_000, raisedMinor: 128_000_000, targetMinor: 200_000_000, currency: 'USD', investors: 38, days: 11, status: 'open', isNew: false,
    blurb: 'Seed capital to put solar-powered diagnostics in 60 rural clinics.',
    strengths: ['Live in 14 clinics, with 4,200 patient visits a month.', 'Pilot partnerships with two regional health services.', 'The founder ran clinic operations for six years.'],
    risks: ['Depends on public health procurement, which can move slowly.', 'Early stage, with a short revenue history.', 'Your investment is illiquid and you could lose all of it.'],
    useOfFunds: [{ label: 'Clinic rollout', pct: 55 }, { label: 'Equipment and solar', pct: 30 }, { label: 'Training and operations', pct: 15 }],
    documents: [{ title: 'Investment terms', verified: true }, { title: 'Pilot results report', verified: true }, { title: 'Pitch deck', verified: false }],
    update: { title: 'First 14 clinics run on solar with no outages', by: 'Nia Mensah', daysAgo: 5, body: 'Our clinics stayed open through three grid failures last month.' },
  },
  {
    id: 'kora-freight-round', companyId: 'kora-freight', name: 'Kora Freight', letter: 'K', sector: 'Logistics', tagline: 'Three new freight corridors', round: 'community', instrument: 'SAFE',
    valuationCapMinor: 18_000_000_000, minInvestMinor: 10_000, raisedMinor: 76_000_000, targetMinor: 200_000_000, currency: 'USD', investors: 215, days: 19, status: 'open', isNew: false,
    blurb: 'Growth capital to open three new freight corridors across West Africa.',
    strengths: ['Revenue run rate grew 212% over five years.', 'Existing backers, including Continental Growth Fund, are joining the round.', 'Operating in three countries, with a clear path to a fourth.'],
    risks: ['Concentrated in road freight, which is sensitive to fuel prices.', 'Rival Nakala has more operators in Nigeria.', 'Your investment is illiquid and you could lose all of it.'],
    useOfFunds: [{ label: 'New corridors', pct: 45 }, { label: 'Product and matching engine', pct: 35 }, { label: 'Working capital', pct: 20 }],
    documents: [{ title: 'Investment terms', verified: true }, { title: 'Audited financials, 2025', verified: true }, { title: 'Pitch deck', verified: false }],
    update: { title: 'Q3 update: Kumasi to Abidjan is live', by: 'Ama Boateng', daysAgo: 14, body: 'Our first cross-border corridor is carrying 140 loads a week, ahead of plan.' },
  },
  {
    id: 'zuri-energy-round', companyId: 'zuri-energy', name: 'Zuri Energy', letter: 'Z', sector: 'Energy', tagline: 'Solar for small businesses', round: 'community', instrument: 'SAFE',
    valuationCapMinor: 2_400_000_000, minInvestMinor: 10_000, raisedMinor: 31_000_000, targetMinor: 150_000_000, currency: 'USD', investors: 74, days: 26, status: 'open', isNew: true,
    blurb: 'Working capital to finance solar systems for small businesses in Kumasi and Tamale.',
    strengths: ['Recurring monthly payments from 1,900 business customers.', 'Repayment rate above 96% over 18 months.', 'The CFO previously led finance at a listed utility.'],
    risks: ['Equipment is priced in dollars while revenue is in cedis.', 'Concentrated in two cities.', 'Your investment is illiquid and you could lose all of it.'],
    useOfFunds: [{ label: 'Equipment financing', pct: 60 }, { label: 'Sales and installers', pct: 25 }, { label: 'Working capital', pct: 15 }],
    documents: [{ title: 'Investment terms', verified: true }, { title: 'Audited financials, 2025', verified: true }, { title: 'Pitch deck', verified: false }],
    update: { title: 'Tamale branch reaches 300 customers', by: 'Tunde Dlamini', daysAgo: 7, body: 'We opened the branch on schedule and installed 40 systems in the first month.' },
  },
];

function toDeal(r: Row, now: number): Deal {
  const { days, update, ...rest } = r;
  return DealSchema.parse({ ...rest, closesAt: iso(now + days * DAY), latestUpdate: { title: update.title, by: update.by, at: iso(now - update.daysAgo * DAY) }, updateBody: update.body });
}

export function mockDeals(filter: DealFilter, now = Date.now()): DealList {
  const all = ROWS.map((r) => toDeal(r, now));
  const picked = deals.filterDeals(all, filter, now).map(({ blurb: _b, strengths: _s, risks: _r, useOfFunds: _u, documents: _d, updateBody: _x, ...summary }) => summary);
  return DealListSchema.parse({ deals: picked });
}

export function mockDeal(id: string, now = Date.now()): Deal {
  const r = ROWS.find((x) => x.id === id);
  if (!r) throw new ApiError(404, 'not_found', `No round "${id}"`);
  return toDeal(r, now);
}

const BASELINE_POSITIONS = [
  { dealId: 'aya-health-seed', amountMinor: 25_000, status: 'committed' as const, at: '2026-09-12T10:00:00.000Z', ref: 'MRD-1A7C20' },
  { dealId: 'kora-freight-round', amountMinor: 50_000, status: 'in_review' as const, at: '2026-09-28T10:00:00.000Z', ref: 'MRD-7D93E1' },
];

export function mockPortfolio(): Portfolio {
  return PortfolioSchema.parse({
    positions: BASELINE_POSITIONS,
    activity: [...BASELINE_POSITIONS].sort((a, b) => b.at.localeCompare(a.at)).map(({ dealId, amountMinor, at }) => ({ dealId, amountMinor, at })),
  });
}

const BASELINE_WATCH = ['aya-health-seed', 'kora-freight-round', 'zuri-energy-round'];

export function mockWatchlist(): Watchlist {
  return WatchlistSchema.parse({ dealIds: BASELINE_WATCH, alerts: true });
}

export function mockSetWatch(dealId: string, on: boolean): Watchlist {
  if (!ROWS.some((r) => r.id === dealId)) throw new ApiError(404, 'not_found', `No round "${dealId}"`);
  const ids = on ? [...new Set([...BASELINE_WATCH, dealId])] : BASELINE_WATCH.filter((x) => x !== dealId);
  return WatchlistSchema.parse({ dealIds: ids, alerts: true });
}

export function mockSetAlerts(on: boolean): Watchlist {
  return WatchlistSchema.parse({ dealIds: BASELINE_WATCH, alerts: on });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Pretends to take a payment. Nothing is charged and nothing is stored.
 * A mobile money number ending in 0000 is declined, so the failure screen can be tried.
 */
export async function mockCommit(input: CommitInput, now = Date.now(), delayMs = 1200): Promise<Investment> {
  const v = CommitInputSchema.safeParse(input);
  if (!v.success) throw new ApiError(422, 'invalid', v.error.issues[0]?.message ?? 'Invalid commitment');
  const d = v.data;
  const row = ROWS.find((r) => r.id === d.dealId);
  if (!row) throw new ApiError(404, 'not_found', `No round "${d.dealId}"`);
  if (row.status !== 'open') throw new ApiError(409, 'round_closed', 'This round is closed');
  const bad = deals.validateAmount(d.amountMinor, row.minInvestMinor);
  if (bad) throw new ApiError(422, bad === 'tooLow' ? 'amount_too_low' : 'amount_too_high', 'Amount outside the allowed range');
  if (d.method === 'momo' && !deals.isGhanaMomoNumber(d.phone ?? '')) throw new ApiError(422, 'invalid_phone', 'Invalid mobile money number');
  if (delayMs > 0) await sleep(delayMs);
  if (d.method === 'momo' && (d.phone ?? '').replace(/\s/g, '').endsWith('0000')) throw new ApiError(402, 'payment_declined', 'The payment was declined');
  const ref = `MRD-${Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0')}`;
  return InvestmentSchema.parse({ id: `inv-${ref}`, dealId: d.dealId, amountMinor: d.amountMinor, feeMinor: deals.feeMinor(d.amountMinor), status: 'committed', ref, at: iso(now) });
}
