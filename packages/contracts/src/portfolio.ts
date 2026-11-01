import { z } from 'zod';

export const PositionSchema = z.object({
  dealId: z.string(),
  amountMinor: z.number().int().positive(),
  status: z.enum(['committed', 'in_review', 'funded']),
  at: z.string().datetime(),
  ref: z.string(),
});
export type Position = z.infer<typeof PositionSchema>;

export const ActivitySchema = z.object({ dealId: z.string(), amountMinor: z.number().int().positive(), at: z.string().datetime() });
export type Activity = z.infer<typeof ActivitySchema>;

export const PortfolioSchema = z.object({ positions: z.array(PositionSchema), activity: z.array(ActivitySchema) });
export type Portfolio = z.infer<typeof PortfolioSchema>;
