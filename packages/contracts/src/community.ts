import { z } from 'zod';

export const AuthorSchema = z.object({ id: z.string(), name: z.string(), initials: z.string(), role: z.string(), verified: z.boolean() });
export type Author = z.infer<typeof AuthorSchema>;

export const AttachmentSchema = z.object({
  kind: z.enum(['deal', 'company', 'book', 'story']),
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  /** Deal progress, 0 to 100. */
  pct: z.number().min(0).max(100).optional(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

const count = z.number().int().min(0);
const base = {
  id: z.string(),
  author: AuthorSchema,
  at: z.string().datetime(),
  text: z.string().min(1).max(500),
  replies: count,
  reposts: count,
  likes: count,
  likedByMe: z.boolean(),
  attachment: AttachmentSchema.optional(),
};

export const PostSchema = z.discriminatedUnion('type', [
  z.object({ ...base, type: z.literal('insight') }),
  z.object({ ...base, type: z.literal('question'), topAnswer: z.object({ by: z.string(), text: z.string() }).optional() }),
  z.object({
    ...base,
    type: z.literal('poll'),
    options: z.array(z.object({ id: z.string(), label: z.string().min(1).max(80), votes: count })).min(2).max(4),
    myVote: z.string().optional(),
    endsAt: z.string().datetime(),
  }),
]);
export type Post = z.infer<typeof PostSchema>;
export type PollPost = Extract<Post, { type: 'poll' }>;

export const LiveNowSchema = z.object({ id: z.string(), title: z.string(), blurb: z.string(), listeners: count, startedAt: z.string().datetime() });
export type LiveNow = z.infer<typeof LiveNowSchema>;

export const CommunityTabSchema = z.enum(['for-you', 'following', 'groups']);
export type CommunityTab = z.infer<typeof CommunityTabSchema>;

export const CommunityFeedSchema = z.object({ live: LiveNowSchema.nullable(), posts: z.array(PostSchema) });
export type CommunityFeed = z.infer<typeof CommunityFeedSchema>;

export const CreatePostInputSchema = z
  .object({
    type: z.enum(['insight', 'question', 'poll']),
    text: z.string().trim().min(1).max(500),
    audience: z.enum(['everyone', 'followers', 'group']),
    groupId: z.string().optional(),
    options: z.array(z.string().trim().min(1).max(80)).min(2).max(4).optional(),
    pollDays: z.union([z.literal(1), z.literal(3), z.literal(7)]).optional(),
    attachment: z.object({ kind: z.enum(['deal', 'company', 'book', 'story']), id: z.string() }).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.type === 'poll' && (!v.options || !v.pollDays)) ctx.addIssue({ code: 'custom', message: 'A poll needs options and a length', path: ['options'] });
    if (v.type !== 'poll' && (v.options || v.pollDays)) ctx.addIssue({ code: 'custom', message: 'Only polls have options', path: ['options'] });
    if (v.audience === 'group' && !v.groupId) ctx.addIssue({ code: 'custom', message: 'A group post needs a group', path: ['groupId'] });
  });
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export const LikeResultSchema = z.object({ likes: count, likedByMe: z.boolean() });
export type LikeResult = z.infer<typeof LikeResultSchema>;
