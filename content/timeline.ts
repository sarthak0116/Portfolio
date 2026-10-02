import { z } from 'zod';

const entrySchema = z.object({
  dates: z.string().min(1),
  title: z.string().min(1),
  /** Short label after the title, e.g. a course or the kind of project. */
  kind: z.string().min(1),
  description: z.string().min(1),
});

/** Most recent first. Dates come from the commit history of each repository. */
export const timeline = z.array(entrySchema).parse([
  {
    dates: 'Jul 2026 — now',
    title: 'Meld',
    kind: 'Full-stack project',
    description:
      'A matchmaking platform for games: React on the front, Express and MongoDB behind it, Socket.IO for the real-time parts.',
  },
  {
    dates: 'May — Jul 2026',
    title: 'The Odin Project',
    kind: 'Web curriculum',
    description:
      'Worked through the foundations and into React, building a calculator, a library app, tic-tac-toe, a to-do app, a weather app and a message board along the way.',
  },
  {
    dates: 'May 2026',
    title: 'Resume analyser',
    kind: 'Python CLI',
    description:
      'A command-line tool that reads a PDF resume and scores it against a job description, using spaCy and fuzzy matching.',
  },
  {
    dates: 'Mar 2026',
    title: 'Zypr and the ARM64 digit recognizer',
    kind: 'Low-level projects',
    description:
      'A ZIP extractor in C with a hand-written DEFLATE decoder, and neural-network inference written in assembly.',
  },
]);
