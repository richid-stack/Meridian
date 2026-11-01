import {
  AttachmentSchema, CommunityFeedSchema, CompanyProfileSchema, DealListSchema, DealSchema, InvestmentSchema, PortfolioSchema, WatchlistSchema, ExploreSchema, GroupListSchema, GroupSchema, HomeSchema, LikeResultSchema, MembershipResultSchema, PostSchema, NewsPageSchema, PersonProfileSchema, SearchResponseSchema, StorySchema,
  type Attachment, type CommitInput, type CommunityFeed, type CompanyProfile, type CreatePostInput, type Deal, type DealFilter, type DealList, type Investment, type Portfolio, type Watchlist, type Explore, type Group, type GroupList, type LikeResult, type MembershipResult, type Post, type Home, type NewsPage, type NewsQuery, type PersonProfile, type SearchResponse, type Story,
} from '@meridian/contracts';
import { entities } from '@meridian/domain';
import { z } from 'zod';
import { createClient } from './client';
import { ApiError } from './errors';
import { catalogue, exploreFixture } from './mocks/catalogue';
import { homeFixture } from './mocks/home';
import { mockCommit, mockDeal, mockDeals, mockPortfolio, mockSetAlerts, mockSetWatch, mockWatchlist } from './mocks/capital';
import { attachables, mockCreatePost, mockFeed, mockGroup, mockGroups, mockLike, mockMembership, mockVote } from './mocks/community';
import { mockNewsGet, mockNewsList } from './mocks/news';
import { companiesFixture, peopleFixture } from './mocks/profiles';

/** What the UI is allowed to call. Same shape for the real backend and for sample data. */
export interface Api {
  feed: { getHome(): Promise<Home> };
  explore: { get(): Promise<Explore> };
  search: { query(q: string, opts?: { signal?: AbortSignal }): Promise<SearchResponse> };
  entities: { getPerson(id: string): Promise<PersonProfile>; getCompany(id: string): Promise<CompanyProfile> };
  news: { list(q: NewsQuery): Promise<NewsPage>; get(id: string): Promise<Story> };
  community: {
    feed(tab: 'for-you' | 'following'): Promise<CommunityFeed>;
    createPost(input: CreatePostInput): Promise<Post>;
    like(postId: string, liked: boolean): Promise<LikeResult>;
    vote(postId: string, optionId: string): Promise<Post>;
    /** Things a post can attach: companies, books and deals. */
    attachables(): Promise<Attachment[]>;
  };
  capital: {
    listDeals(filter: DealFilter): Promise<DealList>;
    getDeal(id: string): Promise<Deal>;
    /** Commit money to a round. Sample mode charges nothing. */
    commit(input: CommitInput): Promise<Investment>;
    portfolio(): Promise<Portfolio>;
    watchlist(): Promise<Watchlist>;
    setWatch(dealId: string, on: boolean): Promise<Watchlist>;
    setAlerts(on: boolean): Promise<Watchlist>;
  };
  groups: { list(): Promise<GroupList>; get(id: string): Promise<Group>; setMembership(id: string, joined: boolean): Promise<MembershipResult> };
}

export interface ApiOptions {
  /** Set to talk to the real backend. Leave empty to use built-in sample data. */
  baseUrl?: string;
  getToken?: () => string | null | Promise<string | null>;
}

function found<T>(table: Record<string, T>, id: string): T {
  const hit = Object.prototype.hasOwnProperty.call(table, id) ? table[id] : undefined;
  if (!hit) throw new ApiError(404, 'not_found', `No profile "${id}"`);
  return hit;
}

export const mockApi: Api = {
  feed: { getHome: async () => HomeSchema.parse(homeFixture) },
  explore: { get: async () => ExploreSchema.parse(exploreFixture) },
  search: {
    query: async (q) => ({ query: q, hits: entities.search(catalogue, q).map((c) => c.hit) }),
  },
  entities: {
    getPerson: async (id) => PersonProfileSchema.parse(found(peopleFixture, id)),
    getCompany: async (id) => CompanyProfileSchema.parse(found(companiesFixture, id)),
  },
  news: { list: async (q) => mockNewsList(q), get: async (id) => mockNewsGet(id) },
  community: {
    feed: async (tab) => mockFeed(tab),
    createPost: async (input) => mockCreatePost(input),
    like: async (postId, liked) => mockLike(postId, liked),
    vote: async (postId, optionId) => mockVote(postId, optionId),
    attachables: async () => attachables(),
  },
  capital: {
    listDeals: async (filter) => mockDeals(filter),
    getDeal: async (id) => mockDeal(id),
    commit: (input) => mockCommit(input),
    portfolio: async () => mockPortfolio(),
    watchlist: async () => mockWatchlist(),
    setWatch: async (dealId, on) => mockSetWatch(dealId, on),
    setAlerts: async (on) => mockSetAlerts(on),
  },
  groups: { list: async () => mockGroups(), get: async (id) => mockGroup(id), setMembership: async (id, joined) => mockMembership(id, joined) },
};

export function createApi({ baseUrl, getToken }: ApiOptions = {}): Api {
  if (!baseUrl) return mockApi;
  const http = createClient({ baseUrl, getToken });
  const id = encodeURIComponent;
  return {
    feed: { getHome: () => http.get('/v1/feed/home', HomeSchema) },
    explore: { get: () => http.get('/v1/explore', ExploreSchema) },
    search: {
      query: (q, opts) => http.get(`/v1/search?q=${encodeURIComponent(q)}`, SearchResponseSchema, { signal: opts?.signal }),
    },
    entities: {
      getPerson: (pid) => http.get(`/v1/people/${id(pid)}`, PersonProfileSchema),
      getCompany: (cid) => http.get(`/v1/companies/${id(cid)}`, CompanyProfileSchema),
    },
    news: {
      list: (q) => http.get(`/v1/news?${new URLSearchParams({ region: q.region, topic: q.topic, page: String(q.page) })}`, NewsPageSchema),
      get: (sid) => http.get(`/v1/news/${id(sid)}`, StorySchema),
    },
    community: {
      feed: (tab) => http.get(`/v1/community/feed?tab=${tab}`, CommunityFeedSchema),
      createPost: (input) => http.send('POST', '/v1/community/posts', input, PostSchema),
      like: (pid, liked) => http.send(liked ? 'PUT' : 'DELETE', `/v1/community/posts/${id(pid)}/like`, {}, LikeResultSchema),
      vote: (pid, optionId) => http.send('POST', `/v1/community/posts/${id(pid)}/vote`, { optionId }, PostSchema),
      attachables: () => http.get('/v1/community/attachables', z.array(AttachmentSchema)),
    },
    capital: {
      listDeals: (filter) => http.get(`/v1/deals?filter=${filter}`, DealListSchema),
      getDeal: (did) => http.get(`/v1/deals/${id(did)}`, DealSchema),
      commit: (input) => http.send('POST', `/v1/deals/${id(input.dealId)}/investments`, input, InvestmentSchema),
      portfolio: () => http.get('/v1/portfolio', PortfolioSchema),
      watchlist: () => http.get('/v1/watchlist', WatchlistSchema),
      setWatch: (did, on) => http.send(on ? 'PUT' : 'DELETE', `/v1/watchlist/${id(did)}`, {}, WatchlistSchema),
      setAlerts: (on) => http.send('PUT', '/v1/watchlist/alerts', { on }, WatchlistSchema),
    },
    groups: {
      list: () => http.get('/v1/groups', GroupListSchema),
      get: (gid) => http.get(`/v1/groups/${id(gid)}`, GroupSchema),
      setMembership: (gid, joined) => http.send('PUT', `/v1/groups/${id(gid)}/membership`, { joined }, MembershipResultSchema),
    },
  };
}
