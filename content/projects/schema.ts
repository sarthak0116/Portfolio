import { z } from 'zod';

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  stack: z.array(z.string()).min(1),
  year: z.number().int(),
  links: z.object({ live: z.string().url().optional(), github: z.string().url().optional() }),
  cover: z.string().startsWith('/'),
  metrics: z.array(z.string()),
  featured: z.boolean(),
  order: z.number().int(),
});
export type Project = z.infer<typeof projectSchema>;
