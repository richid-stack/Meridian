import { z } from 'zod';

export const SearchKindSchema = z.enum(['person', 'company', 'book', 'episode', 'deal', 'story', 'topic']);
export type SearchKind = z.infer<typeof SearchKindSchema>;

export const SearchHitSchema = z.object({
  kind: SearchKindSchema,
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  /** Two-letter monogram for people, one letter for companies and outlets. */
  initials: z.string().optional(),
  /** Book spine colour. */
  spine: z.string().optional(),
  /** Deal progress, 0 to 100. */
  pct: z.number().min(0).max(100).optional(),
  /** Episode media type. */
  media: z.enum(['audio', 'video']).optional(),
});
export type SearchHit = z.infer<typeof SearchHitSchema>;

export const SearchResponseSchema = z.object({ query: z.string(), hits: z.array(SearchHitSchema) });
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
