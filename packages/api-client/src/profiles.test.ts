import { describe, expect, it } from 'vitest';
import { CompanyProfileSchema, PersonProfileSchema } from '@meridian/contracts';
import { ApiError } from './errors';
import { mockApi } from './api';
import { catalogue, exploreFixture } from './mocks/catalogue';
import { homeFixture } from './mocks/home';
import { companiesFixture, peopleFixture } from './mocks/profiles';

describe('profile sample data', () => {
  it('every person matches the contract', () => {
    for (const p of Object.values(peopleFixture)) expect(PersonProfileSchema.safeParse(p).success, p.id).toBe(true);
  });
  it('every company matches the contract', () => {
    for (const c of Object.values(companiesFixture)) expect(CompanyProfileSchema.safeParse(c).success, c.id).toBe(true);
  });
  it('keys match ids', () => {
    for (const [k, p] of Object.entries(peopleFixture)) expect(p.id).toBe(k);
    for (const [k, c] of Object.entries(companiesFixture)) expect(c.id).toBe(k);
  });
});

describe('no dead links', () => {
  it('every person and company in search has a profile', () => {
    for (const item of catalogue) {
      if (item.kind === 'person') expect(peopleFixture[item.id], item.id).toBeDefined();
      if (item.kind === 'company') expect(companiesFixture[item.id], item.id).toBeDefined();
    }
  });
  it('every person on Home and Explore has a profile', () => {
    for (const p of homeFixture.people) expect(peopleFixture[p.id], p.id).toBeDefined();
    for (const h of [...exploreFixture.trending, ...exploreFixture.companies]) {
      if (h.kind === 'person') expect(peopleFixture[h.id], h.id).toBeDefined();
      if (h.kind === 'company') expect(companiesFixture[h.id], h.id).toBeDefined();
    }
  });
  it('every company leader has a person profile', () => {
    for (const c of Object.values(companiesFixture)) for (const l of c.leaders) expect(peopleFixture[l.id], `${c.id} -> ${l.id}`).toBeDefined();
  });
  it('every round points at a real deal in the catalogue', () => {
    const deals = new Set(catalogue.filter((c) => c.kind === 'deal').map((c) => c.id));
    for (const c of Object.values(companiesFixture)) if (c.round) expect(deals.has(c.round.dealId), c.id).toBe(true);
  });
  it('every interview and news item points at something in the catalogue', () => {
    const ids = new Set(catalogue.map((c) => c.id));
    for (const p of Object.values(peopleFixture)) for (const i of p.interviews) expect(ids.has(i.id), i.id).toBe(true);
    for (const c of Object.values(companiesFixture)) for (const n of c.news) expect(ids.has(n.id), n.id).toBe(true);
  });
});

describe('mock entities api', () => {
  it('returns a profile', async () => expect((await mockApi.entities.getPerson('nia-mensah')).name).toBe('Nia Mensah'));
  it('throws a 404 ApiError for unknown ids', async () => {
    await expect(mockApi.entities.getCompany('nope')).rejects.toBeInstanceOf(ApiError);
    await expect(mockApi.entities.getPerson('__proto__')).rejects.toMatchObject({ status: 404 });
  });
});
