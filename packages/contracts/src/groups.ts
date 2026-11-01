import { z } from 'zod';
import { PostSchema } from './community';

export const GroupSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  letter: z.string().min(1).max(2),
  members: z.number().int().min(0),
  blurb: z.string(),
  joined: z.boolean(),
  /** Only verified investors can join. */
  restricted: z.boolean(),
});
export type GroupSummary = z.infer<typeof GroupSummarySchema>;

export const GroupListSchema = z.object({ mine: z.array(GroupSummarySchema), discover: z.array(GroupSummarySchema) });
export type GroupList = z.infer<typeof GroupListSchema>;

export const GroupSchema = GroupSummarySchema.extend({ pinned: z.string(), posts: z.array(PostSchema) });
export type Group = z.infer<typeof GroupSchema>;

export const MembershipResultSchema = z.object({ joined: z.boolean(), members: z.number().int().min(0) });
export type MembershipResult = z.infer<typeof MembershipResultSchema>;
