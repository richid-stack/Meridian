import { z } from 'zod';

export const DealFilterSchema = z.enum(['all', 'soon', 'new', 'closed', 'any']);
export type DealFilter = z.infer<typeof DealFilterSchema>;

const money = z.number().int().min(0);

/** A community round, as shown in lists. Amounts are minor units (cents). */
export const DealSummarySchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string(),
  letter: z.string().min(1).max(2),
  sector: z.string(),
  tagline: z.string(),
  round: z.enum(['seed', 'community']),
  instrument: z.string(),
  valuationCapMinor: money,
  minInvestMinor: money,
  raisedMinor: money,
  targetMinor: z.number().int().positive(),
  currency: z.string().length(3),
  investors: z.number().int().min(0),
  closesAt: z.string().datetime(),
  status: z.enum(['open', 'closed']),
  isNew: z.boolean(),
  latestUpdate: z.object({ title: z.string(), by: z.string(), at: z.string().datetime() }),
});
export type DealSummary = z.infer<typeof DealSummarySchema>;

export const DealSchema = DealSummarySchema.extend({
  blurb: z.string(),
  strengths: z.array(z.string()).min(1),
  /** Risks are never optional: every round lists at least one. */
  risks: z.array(z.string()).min(1),
  useOfFunds: z.array(z.object({ label: z.string(), pct: z.number().int().min(0).max(100) })).min(1)
    .refine((u) => u.reduce((a, x) => a + x.pct, 0) === 100, { message: 'Use of funds must add up to 100%' }),
  documents: z.array(z.object({ title: z.string(), verified: z.boolean() })),
  updateBody: z.string(),
});
export type Deal = z.infer<typeof DealSchema>;

export const DealListSchema = z.object({ deals: z.array(DealSummarySchema) });
export type DealList = z.infer<typeof DealListSchema>;
