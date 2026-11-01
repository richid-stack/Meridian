import { z } from 'zod';

export const WatchlistSchema = z.object({ dealIds: z.array(z.string()), alerts: z.boolean() });
export type Watchlist = z.infer<typeof WatchlistSchema>;
