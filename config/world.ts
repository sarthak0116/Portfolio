import type { SectionId } from './sections';

/**
 * One pose of the ring, the film's recurring image. x and y are in half-viewports (-1 left or
 * bottom, 1 right or top); the rest are 0 to 1 unless noted. The ring eases from one pose to the
 * next as the camera travels between acts.
 */
export type WorldPose = {
  x: number;
  y: number;
  scale: number;
  /** Tilt toward the camera, radians. */
  tilt: number;
  /** 0 closed disc (an eclipse), 1 iris wide open onto light. */
  iris: number;
  /** Clock-dial ticks and sweeping hand. */
  dial: number;
  /** Projector beam across the frame. */
  beam: number;
  /** Brightness of the corona around the rim. */
  corona: number;
  /** Anamorphic streak across the frame. */
  flare: number;
  /** 0 on landscape; up to 1 on a portrait screen, where the ring steps back behind the copy. */
  calm: number;
};

/** The ring sits opposite the text for each act so it never covers copy. */
export const poses: Record<SectionId, WorldPose> = {
  // Act I: an eclipse, high on the right, clear of the title.
  hero: {
    x: 0.62,
    y: 0.3,
    scale: 0.85,
    tilt: 0,
    iris: 0,
    dial: 0,
    beam: 0,
    corona: 1,
    flare: 0.15,
    calm: 0,
  },
  // Act II: the closed disc was an iris all along. It opens onto light, between headline and copy.
  about: {
    x: 0.02,
    y: 0.05,
    scale: 0.6,
    tilt: 0.25,
    iris: 1,
    dial: 0,
    beam: 0,
    corona: 0.5,
    flare: 0.05,
    calm: 0,
  },
  // Act III: a projector lens above the work, throwing a beam leftward across it.
  projects: {
    x: 0.8,
    y: 0.52,
    scale: 0.4,
    tilt: 0.35,
    iris: 0.5,
    dial: 0,
    beam: 1,
    corona: 0.45,
    flare: 0.1,
    calm: 0,
  },
  // Act IV: a clock dial, above the timeline's copy. Time.
  experience: {
    x: 0.72,
    y: 0.5,
    scale: 0.55,
    tilt: 0.1,
    iris: 0,
    dial: 1,
    beam: 0,
    corona: 0.5,
    flare: 0.05,
    calm: 0,
  },
  // Act V: totality.
  contact: {
    x: 0.34,
    y: 0.02,
    scale: 1.3,
    tilt: 0,
    iris: 0,
    dial: 0,
    beam: 0,
    corona: 1.8,
    flare: 0.25,
    calm: 0,
  },
};

/** The act at which the diamond-ring flash peaks, as a fractional section index. */
export const FLASH_AT = 3.85;
