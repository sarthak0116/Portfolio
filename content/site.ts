import { z } from 'zod';

const siteSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  pitch: z.string().min(1),
  availability: z.string().min(1),
  email: z.string().email(),
  bookingUrl: z.string().url().optional(),
  resumePath: z.string().startsWith('/').optional(),
  socials: z.object({
    linkedin: z.string().url(),
    github: z.string().url(),
    leetcode: z.string().url(),
  }),
  seo: z.object({ title: z.string(), description: z.string(), url: z.string().url() }),
});

export const site = siteSchema.parse({
  name: 'Sarthak Singh',
  role: 'Developer',
  pitch:
    'A ZIP extractor in C. A neural network in ARM64 assembly. A matchmaking app in React. I learn by building the thing myself.',
  availability: 'Open to roles',
  email: 'sarthaksingh0116@gmail.com',
  socials: {
    linkedin: 'https://www.linkedin.com/in/sarthak-singh-6a1b92362',
    github: 'https://github.com/sarthak0116',
    leetcode: 'https://leetcode.com/u/DN1lKN4VpW/',
  },
  seo: {
    title: 'Sarthak Singh — Developer',
    description:
      'Sarthak Singh is a developer who builds things from scratch: a ZIP extractor in C, a neural network in ARM64 assembly, and web apps in React.',
    url: 'https://example.com', // TODO: set to the real domain once deployed
  },
});

export type Site = z.infer<typeof siteSchema>;
