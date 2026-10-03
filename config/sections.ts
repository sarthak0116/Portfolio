export type SectionId = 'hero' | 'about' | 'projects' | 'experience' | 'contact';

export type SectionConfig = {
  id: SectionId;
  title: string;
  eyebrow: string;
  range: readonly [number, number];
  room: string;
};

/** The single source of truth for page order, navigation, the scrubber and the film's acts. */
export const sections = [
  {
    id: 'hero',
    title: 'Home',
    eyebrow: '01 / Arrival',
    range: [0, 0.2],
    room: 'hero',
  },
  {
    id: 'about',
    title: 'About',
    eyebrow: '02 / Context',
    range: [0.2, 0.4],
    room: 'about',
  },
  {
    id: 'projects',
    title: 'Projects',
    eyebrow: '03 / Selected work',
    range: [0.4, 0.65],
    room: 'projects',
  },
  {
    id: 'experience',
    title: 'Experience',
    eyebrow: '04 / Practice',
    range: [0.65, 0.84],
    room: 'experience',
  },
  {
    id: 'contact',
    title: 'Contact',
    eyebrow: '05 / Next move',
    range: [0.84, 1],
    room: 'contact',
  },
] as const satisfies readonly SectionConfig[];

export function sectionById(id: SectionId): SectionConfig {
  const section = sections.find((item) => item.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}
