import type { SectionId } from './sections';

/**
 * Letterbox per act, 1 closed (scope, intimate) to 0 open (full frame, IMAX). The bars ease
 * between acts as the camera travels, the way a film swaps aspect ratio between scenes.
 */
export const letterbox: Record<SectionId, number> = {
  hero: 1,
  about: 1,
  projects: 0,
  experience: 1,
  contact: 0,
};

/** The film's running time, so scroll progress can be read as a timecode. */
export const RUNTIME_SECONDS = 180;
