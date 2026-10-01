import { z } from 'zod';

export const skillsSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string(),
      items: z.array(
        z.object({ name: z.string(), proficiency: z.number().min(0).max(1).optional() }),
      ),
    }),
  ),
});

export const skills = skillsSchema.parse({
  groups: [
    {
      name: 'Build',
      items: [
        { name: 'TypeScript', proficiency: 0.95 },
        { name: 'React', proficiency: 0.95 },
        { name: 'Next.js', proficiency: 0.9 },
      ],
    },
    {
      name: 'Shape',
      items: [
        { name: 'Design systems', proficiency: 0.9 },
        { name: 'Motion', proficiency: 0.85 },
        { name: 'WebGL', proficiency: 0.7 },
      ],
    },
  ],
});
