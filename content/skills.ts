import { z } from 'zod';

export const skillsSchema = z.object({
  groups: z.array(z.object({ name: z.string(), items: z.array(z.string().min(1)).min(1) })).min(1),
});

/** Only things used in the projects on this site. */
export const skills = skillsSchema.parse({
  groups: [
    { name: 'Languages', items: ['C', 'Python', 'JavaScript', 'ARM64 assembly'] },
    { name: 'Web', items: ['React', 'Express', 'MongoDB', 'Socket.IO', 'Tailwind CSS'] },
    { name: 'Tools', items: ['Git', 'Make', 'TensorFlow/Keras'] },
  ],
});
