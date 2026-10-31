import { z } from 'zod';

export const StoryRegionSchema = z.enum(['west', 'east', 'south', 'north', 'pan', 'europe', 'asia', 'americas']);
export const StoryTopicSchema = z.enum(['markets', 'startups', 'fintech', 'energy', 'health', 'logistics', 'policy', 'tech', 'retail']);

export const NewsQuerySchema = z.object({
  region: z.enum(['africa', 'west', 'east', 'south', 'north', 'global']).default('africa'),
  topic: z.union([z.literal('all'), StoryTopicSchema]).default('all'),
  page: z.coerce.number().int().min(1).max(50).default(1),
});
export type NewsQuery = z.infer<typeof NewsQuerySchema>;

/** One story, which may be covered by several outlets. Full text is never republished: readers follow `url` to the source. */
export const StorySchema = z.object({
  id: z.string(),
  title: z.string(),
  snippet: z.string(),
  source: z.string(),
  url: z.string().url(),
  at: z.string().datetime(),
  region: StoryRegionSchema,
  topic: StoryTopicSchema,
  lang: z.string().min(2).max(5),
  /** English version of a non-English story. Machine translated. */
  translation: z.object({ title: z.string(), snippet: z.string() }).optional(),
  africaRel: z.boolean(),
  /** AI written "why it matters" note. Always shown with an AI label. */
  africaNote: z.string().optional(),
  sources: z.array(z.object({ source: z.string(), title: z.string(), url: z.string().url(), at: z.string().datetime() })).min(1),
  mentions: z.array(z.object({ id: z.string(), kind: z.enum(['person', 'company']), name: z.string() })),
});
export type Story = z.infer<typeof StorySchema>;

export const NewsPageSchema = z.object({
  items: z.array(StorySchema),
  total: z.number().int().min(0),
  more: z.boolean(),
  updatedAt: z.string().datetime(),
});
export type NewsPage = z.infer<typeof NewsPageSchema>;
