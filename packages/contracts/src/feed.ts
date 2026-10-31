import { z } from 'zod';

export const MarketTickSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  decimals: z.number().int().min(0).max(4),
  changePct: z.number(),
  series: z.array(z.number()).min(2),
});
export type MarketTick = z.infer<typeof MarketTickSchema>;

export const LeadStorySchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  readMinutes: z.number().int().positive(),
  brief: z.array(z.string()).min(1).max(5),
});
export type LeadStory = z.infer<typeof LeadStorySchema>;

export const PersonTeaserSchema = z.object({ id: z.string(), name: z.string(), role: z.string() });
export type PersonTeaser = z.infer<typeof PersonTeaserSchema>;

export const FeedItemSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('raise'), id: z.string(), title: z.string(), backers: z.number().int(),
    raisedMinor: z.number().int(), targetMinor: z.number().int().positive(), currency: z.string().length(3), daysLeft: z.number().int(),
  }),
  z.object({ kind: z.literal('interview'), id: z.string(), title: z.string(), guest: z.string(), minutes: z.number().int() }),
  z.object({ kind: z.literal('book'), id: z.string(), title: z.string(), author: z.string(), readers: z.number().int(), spine: z.string() }),
  z.object({ kind: z.literal('question'), id: z.string(), title: z.string(), replies: z.number().int(), topAnswerBy: z.string() }),
]);
export type FeedItem = z.infer<typeof FeedItemSchema>;

export const HomeSchema = z.object({
  markets: z.object({ isSample: z.boolean(), ticks: z.array(MarketTickSchema) }),
  lead: LeadStorySchema,
  people: z.array(PersonTeaserSchema),
  forYou: z.array(FeedItemSchema),
});
export type Home = z.infer<typeof HomeSchema>;
