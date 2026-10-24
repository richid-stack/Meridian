import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  S3_ENDPOINT: z.string().url().optional(),
  S3_BUCKET: z.string().default('meridian-uploads'),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  SMTP_URL: z.string().optional(),
  PAYMENTS_PROVIDER: z.string().default('sandbox'),
  KYC_PROVIDER: z.string().default('sandbox'),
  AI_PROVIDER: z.string().default('stub'),
  SENTRY_DSN: z.string().optional(),
});
export type Env = z.infer<typeof envSchema>;

export function loadEnv(raw: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('Invalid environment: ' + JSON.stringify(parsed.error.flatten().fieldErrors));
  }
  return parsed.data;
}
