import { z } from 'zod';

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  dates: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  tech: z.array(z.string()),
});
export type Experience = z.infer<typeof experienceSchema>;
