import type { SectionId } from './sections';

/** One pose of the morphing form. x and y are in half-viewports (-1 left/bottom, 1 right/top). */
export type ShapeState = {
  x: number;
  y: number;
  scale: number;
  /** Displacement amplitude. */
  distort: number;
  /** Noise frequency: low is soft and liquid, high is busy. */
  frequency: number;
  /** 0 smooth shading, 1 hard facets. */
  facet: number;
  /** Stretch along the vertical axis. */
  stretch: number;
  /** Noise flow speed. */
  speed: number;
};

/** The form's pose for each section; it eases from one to the next as the page scrolls. */
export const shapeStates: Record<SectionId, ShapeState> = {
  hero: {
    x: 0.52,
    y: 0.12,
    scale: 1.25,
    distort: 0.22,
    frequency: 1.1,
    facet: 0,
    stretch: 1,
    speed: 0.18,
  },
  about: {
    x: -0.62,
    y: -0.05,
    scale: 0.78,
    distort: 0.34,
    frequency: 1.7,
    facet: 0,
    stretch: 1,
    speed: 0.26,
  },
  projects: {
    x: 0.68,
    y: 0.3,
    scale: 0.7,
    distort: 0.3,
    frequency: 0.9,
    facet: 1,
    stretch: 1,
    speed: 0.12,
  },
  experience: {
    x: 0.6,
    y: -0.1,
    scale: 0.72,
    distort: 0.2,
    frequency: 1.3,
    facet: 0.25,
    stretch: 1.55,
    speed: 0.2,
  },
  contact: {
    x: 0.34,
    y: 0,
    scale: 1.5,
    distort: 0.12,
    frequency: 0.8,
    facet: 0,
    stretch: 1,
    speed: 0.1,
  },
};
