import { z } from 'zod';

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  /** One line for the card and the top of the project page. */
  summary: z.string().min(1),
  tags: z.array(z.string()).min(1),
  year: z.number().int(),
  role: z.string().min(1),
  stack: z.array(z.string()).min(1),
  status: z.enum(['Shipped', 'In progress']),
  /** What exists today, stated plainly. */
  result: z.string().min(1),
  repo: z.string().url(),
  sections: z.array(z.object({ heading: z.string().min(1), text: z.string().min(1) })).min(1),
});

export type Project = z.infer<typeof projectSchema>;

/** Order here is the order on the page. To add a project, add an entry. */
export const projects = z.array(projectSchema).parse([
  {
    slug: 'zypr',
    title: 'Zypr',
    summary: 'A ZIP extractor written from scratch in C, with no external libraries.',
    tags: ['C', 'Systems'],
    year: 2026,
    role: 'Solo project',
    stack: ['C', 'Make'],
    status: 'Shipped',
    result: 'Extracts stored and DEFLATE-compressed archives from the command line.',
    repo: 'https://github.com/sarthak0116/ZYPR',
    sections: [
      {
        heading: 'The idea',
        text: 'Implement the ZIP format and DEFLATE by hand, without zlib or any other library. Just a C compiler and the spec.',
      },
      {
        heading: 'Reading the archive',
        text: 'A ZIP file keeps its index at the end. Zypr scans backwards from the end of the file to find the End of Central Directory record, walks the central directory to find each entry, then reads that entry’s local header and data.',
      },
      {
        heading: 'The DEFLATE decoder',
        text: 'The inflate side follows RFC 1951: a bit reader, Huffman tree construction and LZ77 back-references. It handles stored blocks, fixed Huffman blocks and dynamic Huffman blocks.',
      },
      {
        heading: 'Using it',
        text: 'Run it on an archive to extract it. A flag lists the contents without extracting, and another picks the output directory.',
      },
    ],
  },
  {
    slug: 'arm64-mnist',
    title: 'ARM64 digit recognizer',
    summary:
      'A handwritten digit recognizer whose neural network runs its forward pass in ARM64 assembly.',
    tags: ['Assembly', 'Machine learning'],
    year: 2026,
    role: 'Solo project',
    stack: ['ARM64 assembly', 'C', 'Python', 'TensorFlow/Keras'],
    status: 'Shipped',
    result: 'Draw a digit in the window and the assembly engine predicts it in real time.',
    repo: 'https://github.com/sarthak0116/ARM64-MNIST-Recognizer',
    sections: [
      {
        heading: 'The idea',
        text: 'I trained the model with TensorFlow/Keras, then wrote the inference by hand to understand how a network actually runs at a low level.',
      },
      {
        heading: 'What is in assembly',
        text: 'The whole forward pass: the dense layers, ReLU, softmax and the final argmax.',
      },
      {
        heading: 'How the parts connect',
        text: 'A Python drawing window captures the digit and hands it to a small C runtime, which calls the assembly inference engine and returns the prediction.',
      },
    ],
  },
  {
    slug: 'meld',
    title: 'Meld',
    summary: 'A matchmaking platform for games, built as a full-stack JavaScript app.',
    tags: ['Web', 'Full stack'],
    year: 2026,
    role: 'Solo project',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Express', 'MongoDB', 'Socket.IO'],
    status: 'In progress',
    result: 'Sign-up and login, a games page, an arena and profiles are in place. Still building.',
    repo: 'https://github.com/sarthak0116/Meld',
    sections: [
      {
        heading: 'Front end',
        text: 'React with React Router and Tailwind, built with Vite. There are pages for the landing screen, login and sign-up, the games list, the arena and profiles.',
      },
      {
        heading: 'Back end',
        text: 'An Express server with MongoDB through Mongoose. Sign-in uses JSON Web Tokens with bcrypt-hashed passwords, and requests are rate-limited.',
      },
      {
        heading: 'Real time',
        text: 'Socket.IO carries the live side of the app between the client and the server.',
      },
    ],
  },
]);

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
