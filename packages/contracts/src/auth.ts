import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(10),
  displayName: z.string().min(1).max(80),
});
export const LoginSchema = z.object({ identifier: z.string(), password: z.string() });
export const TokenPairSchema = z.object({ accessToken: z.string(), expiresIn: z.number() });
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
