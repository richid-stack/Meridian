import { describe, expect, it } from 'vitest';
import { CommitInputSchema, DealSchema, PortfolioSchema } from '@meridian/contracts';
import { deals, money } from '@meridian/domain';
import { mockApi } from './api';
import { catalogue } from './mocks/catalogue';
import { mockCommit, mockDeal, mockDeals, mockPortfolio, mockSetWatch, mockWatchlist } from './mocks/capital';
import { mockFeed } from './mocks/community';
import { companiesFixture } from './mocks/profiles';

const NOW = Date.parse('2026-11-01T12:00:00.000Z');
const ids = ['aya-health-seed', 'kora-freight-round', 'zuri-energy-round'];
const ok = { dealId: 'aya-health-seed', amountMinor: 25_000, method: 'card', acknowledged: true } as const;

describe('rounds', () => {
  it('lists three open rounds, soonest tab and new tab filter them', () => {
    expect(mockDeals('all', NOW).deals.map((d) => d.id)).toEqual(ids);
    expect(mockDeals('soon', NOW).deals.map((d) => d.id)).toEqual(['aya-health-seed']);
    expect(mockDeals('new', NOW).deals.map((d) => d.id)).toEqual(['zuri-energy-round']);
    expect(mockDeals('closed', NOW).deals).toEqual([]);
  });
  it('every round matches the contract and lists a risk', () => {
    for (const id of ids) {
      const d = mockDeal(id, NOW);
      expect(DealSchema.safeParse(d).success, id).toBe(true);
      expect(d.risks.length).toBeGreaterThan(0);
      expect(d.risks.at(-1)).toMatch(/lose all of it/);
    }
  });
  it('unknown rounds are 404', async () => {
    await expect(mockApi.capital.getDeal('nope')).rejects.toMatchObject({ status: 404 });
  });
});

describe('rounds agree with the rest of the sample data', () => {
  it('search results match: title, progress, summary line', () => {
    for (const id of ids) {
      const d = mockDeal(id, NOW);
      const hit = catalogue.find((c) => c.kind === 'deal' && c.id === id);
      expect(hit?.title, id).toBe(`${d.name}${d.round === 'seed' ? ' seed' : ''} round`);
      expect(hit?.hit.pct, id).toBe(deals.fundedPct(d.raisedMinor, d.targetMinor));
      const days = deals.daysLeft(d.closesAt, NOW);
      expect(hit?.subtitle, id).toBe(`${money.formatCompactMoney(d.raisedMinor, d.currency, 'en-US')} of ${money.formatCompactMoney(d.targetMinor, d.currency, 'en-US')}, ${days} days left`);
    }
  });
  it('company pages show the same raise', () => {
    for (const id of ids) {
      const d = mockDeal(id, NOW);
      const r = companiesFixture[d.companyId]?.round;
      expect(r, id).toMatchObject({ dealId: id, raisedMinor: d.raisedMinor, targetMinor: d.targetMinor, backers: d.investors });
    }
  });
  it('the deal card in the community feed matches', () => {
    const att = mockFeed('for-you', NOW).posts.find((p) => p.attachment?.kind === 'deal')?.attachment;
    const d = mockDeal('aya-health-seed', NOW);
    expect(att?.pct).toBe(deals.fundedPct(d.raisedMinor, d.targetMinor));
  });
  it('every round has a company profile', () => {
    for (const id of ids) expect(companiesFixture[mockDeal(id, NOW).companyId]).toBeDefined();
  });
});

describe('portfolio and watchlist', () => {
  it('portfolio matches the contract and refers to real rounds', () => {
    const p = mockPortfolio();
    expect(PortfolioSchema.safeParse(p).success).toBe(true);
    for (const x of [...p.positions, ...p.activity]) expect(ids).toContain(x.dealId);
    expect(deals.totalInvested(p.positions)).toBe(75_000);
  });
  it('activity is newest first', () => {
    const [a, b] = mockPortfolio().activity;
    expect(a && b && a.at > b.at).toBe(true);
  });
  it('watchlist starts with every round and alerts on', () => expect(mockWatchlist()).toEqual({ dealIds: ids, alerts: true }));
  it('unwatching and watching', () => {
    expect(mockSetWatch('zuri-energy-round', false).dealIds).toEqual(ids.slice(0, 2));
    expect(mockSetWatch('zuri-energy-round', true).dealIds).toEqual(ids);
    expect(() => mockSetWatch('nope', true)).toThrowError(/No round/);
  });
});

describe('commit', () => {
  it('returns a receipt with the fee', async () => {
    const r = await mockCommit(ok, NOW, 0);
    expect(r).toMatchObject({ dealId: 'aya-health-seed', amountMinor: 25_000, feeMinor: 500, status: 'committed' });
    expect(r.ref).toMatch(/^MRD-[0-9A-F]{6}$/);
  });
  it('mobile money needs a provider and a valid number', async () => {
    await expect(mockCommit({ ...ok, method: 'momo' }, NOW, 0)).rejects.toMatchObject({ status: 422 });
    await expect(mockCommit({ ...ok, method: 'momo', provider: 'MTN MoMo', phone: '123' }, NOW, 0)).rejects.toMatchObject({ code: 'invalid_phone' });
    await expect(mockCommit({ ...ok, method: 'momo', provider: 'MTN MoMo', phone: '024 123 4567' }, NOW, 0)).resolves.toBeDefined();
  });
  it('declines a number ending in 0000', async () => {
    await expect(mockCommit({ ...ok, method: 'momo', provider: 'MTN MoMo', phone: '0240000000' }, NOW, 0)).rejects.toMatchObject({ status: 402, code: 'payment_declined' });
  });
  it('enforces the minimum and maximum', async () => {
    await expect(mockCommit({ ...ok, amountMinor: 9_999 }, NOW, 0)).rejects.toMatchObject({ code: 'amount_too_low' });
    await expect(mockCommit({ ...ok, amountMinor: 10_000_001 }, NOW, 0)).rejects.toMatchObject({ code: 'amount_too_high' });
  });
  it('refuses without the risk acknowledgements', async () => {
    await expect(mockCommit({ ...ok, acknowledged: false } as never, NOW, 0)).rejects.toMatchObject({ status: 422 });
    expect(CommitInputSchema.safeParse({ ...ok, acknowledged: false }).success).toBe(false);
  });
  it('unknown rounds are 404', async () => {
    await expect(mockCommit({ ...ok, dealId: 'nope' }, NOW, 0)).rejects.toMatchObject({ status: 404 });
  });
});
