import { z } from 'zod';

export const MoneySchema = z.object({ amountMinor: z.number().int(), currency: z.string().length(3) });
export type Money = z.infer<typeof MoneySchema>;

export const PageQuerySchema = z.object({ cursor: z.string().optional(), limit: z.coerce.number().int().min(1).max(50).default(20) });
export const pageOf = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ items: z.array(item), nextCursor: z.string().nullable() });

export const ApiErrorSchema = z.object({ status: z.number(), code: z.string(), message: z.string() });
export type ApiErrorShape = z.infer<typeof ApiErrorSchema>;
