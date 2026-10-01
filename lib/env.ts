import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://example.com'),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  ANALYTICS_DOMAIN: z.string().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  ANALYTICS_DOMAIN: process.env.ANALYTICS_DOMAIN,
});
