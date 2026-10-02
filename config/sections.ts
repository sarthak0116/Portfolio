export type SectionId = 'hero' | 'about' | 'projects' | 'experience' | 'contact';

export type Point3 = readonly [number, number, number];

export type SectionConfig = {
  id: SectionId;
  title: string;
  eyebrow: string;
  range: readonly [number, number];
  room: string;
  controlPoints: readonly Point3[];
};

/** The single source of truth for page order, navigation, line work and future rooms. */
export const sections = [
  {
    id: 'hero',
    title: 'Home',
    eyebrow: '01 / Intro',
    range: [0, 0.2],
    room: 'hero',
    controlPoints: [
      [0, 0, 0],
      [1, 0.2, -1],
    ],
  },
  {
    id: 'about',
    title: 'About',
    eyebrow: '02 / About',
    range: [0.2, 0.4],
    room: 'about',
    controlPoints: [
      [1, 0.2, -1],
      [-1, 0.4, -3],
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    eyebrow: '03 / Projects',
    range: [0.4, 0.65],
    room: 'projects',
    controlPoints: [
      [-1, 0.4, -3],
      [1, 0.55, -5],
      [0, 0.65, -7],
    ],
  },
  {
    id: 'experience',
    title: 'Timeline',
    eyebrow: '04 / Timeline',
    range: [0.65, 0.84],
    room: 'experience',
    controlPoints: [
      [0, 0.65, -7],
      [-1, 0.75, -9],
      [1, 0.84, -11],
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    eyebrow: '05 / Contact',
    range: [0.84, 1],
    room: 'contact',
    controlPoints: [
      [1, 0.84, -11],
      [0, 1, -13],
    ],
  },
] as const satisfies readonly SectionConfig[];

export function sectionById(id: SectionId): SectionConfig {
  const section = sections.find((item) => item.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}
