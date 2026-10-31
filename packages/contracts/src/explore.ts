import { z } from 'zod';
import { SearchHitSchema } from './search';

export const ExploreSchema = z.object({
  isSample: z.boolean(),
  trending: z.array(SearchHitSchema),
  companies: z.array(SearchHitSchema),
  sectors: z.array(z.object({ id: z.string(), label: z.string(), count: z.number().int() })),
  books: z.array(z.object({ id: z.string(), title: z.string(), author: z.string(), spine: z.string() })),
});
export type Explore = z.infer<typeof ExploreSchema>;
