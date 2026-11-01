import { z } from 'zod';

export const PayMethodSchema = z.enum(['momo', 'card', 'bank']);
export const MomoProviders = ['MTN MoMo', 'Telecel Cash', 'AirtelTigo'] as const;

/** A commitment to a round. `acknowledged` is the three risk confirmations the person ticked; the API refuses without it. */
export const CommitInputSchema = z
  .object({
    dealId: z.string(),
    amountMinor: z.number().int().positive(),
    method: PayMethodSchema,
    provider: z.enum(MomoProviders).optional(),
    phone: z.string().optional(),
    acknowledged: z.literal(true),
  })
  .superRefine((v, ctx) => {
    if (v.method === 'momo' && (!v.provider || !v.phone)) ctx.addIssue({ code: 'custom', message: 'Mobile money needs a provider and a number', path: ['phone'] });
  });
export type CommitInput = z.infer<typeof CommitInputSchema>;

export const InvestmentSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  amountMinor: z.number().int().positive(),
  feeMinor: z.number().int().min(0),
  status: z.enum(['committed', 'in_review', 'funded']),
  ref: z.string(),
  at: z.string().datetime(),
});
export type Investment = z.infer<typeof InvestmentSchema>;
