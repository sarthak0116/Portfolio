import { sections } from '@/config/sections';

/**
 * Page progress at which each section is reached: the point where its top crosses 35% of the
 * viewport. Section 0 is always 0. Consumers ease between stops, so the film layer and the 3D
 * world agree on where each act begins.
 */
export function measureStops(): number[] {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  return sections.map((section, index) => {
    if (index === 0) return 0;
    const top = document.getElementById(section.id)?.getBoundingClientRect().top ?? 0;
    return Math.min(1, Math.max(0, (top + window.scrollY - window.innerHeight * 0.35) / max));
  });
}
