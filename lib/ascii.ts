import type { WorldPose } from '@/config/world';

/** Glyphs from empty to dense. Index 0 is never drawn. */
export const RAMP = ' .·:-=+*#%@';

/** The 3D world's visible height in world units at the ring's distance, and the ring's radius. */
const VIEW_HEIGHT = 2 * 6 * Math.tan((35 / 2) * (Math.PI / 180));
const RING_RADIUS = 1.15;
/** The projector beam's direction on screen (y grows downward), matching the 3D beam. */
const BEAM = { x: -0.968, y: 0.252 };

export type AsciiFrame = {
  /** Seconds. */
  t: number;
  /** Page progress, 0 to 1. */
  progress: number;
  /** Scroll position in viewport heights. */
  scroll: number;
  /** Scroll velocity, pixels per frame. */
  velocity: number;
  /** Viewport width over height. */
  aspect: number;
  pose: WorldPose;
};

export type AsciiCell = {
  /** 0 to 1: how dense the glyph is. */
  value: number;
  /** 0 to 1: how much of it is light (the ring, beam and dial) rather than ambient field. */
  warm: number;
};

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/**
 * The ASCII picture. (u, v) is a point on screen: u runs 0 to the aspect ratio, v 0 to 1 downward,
 * so a unit is one viewport height. The picture is an ambient field of slow waves that the page
 * scroll carries past, and, where the 3D ring is, the ring itself: its rim, its halo, the dial's
 * ticks and sweeping hand, and the projector beam. Writing into `out` keeps the hot loop
 * allocation-free.
 */
export function sampleAscii(u: number, v: number, f: AsciiFrame, out: AsciiCell): void {
  const p = f.pose;
  const reach = Math.min(1, f.aspect / 1.4);
  const cx = (0.5 + p.x * reach * 0.5) * f.aspect;
  const cy = 0.5 - p.y * 0.5;
  const r = (RING_RADIUS * p.scale * Math.min(1, 0.55 + f.aspect * 0.3)) / VIEW_HEIGHT;
  const dx = u - cx;
  const dy = v - cy;
  const d = Math.hypot(dx, dy);

  // Ambient field. Scroll slides it vertically, at a fraction of the page's speed, so it reads as
  // depth; progress pushes its phase, so scrubbing the page scrubs the waves.
  const sv = v + f.scroll * 0.4;
  const a =
    Math.sin(u * 2.6 + f.t * 0.25 + f.progress * 6) +
    Math.sin(sv * 5.2 - f.t * 0.18 + u * 1.3) +
    Math.sin(u * 1.7 - sv * 2.1 + f.progress * 9);
  const n = (a / 3) * 0.5 + 0.5;
  // Fast scrolling stirs it: a ripple travels with the scroll and the field brightens.
  const stir = Math.min(Math.abs(f.velocity) * 0.012, 0.7);
  const calm = p.calm;
  let ambient =
    (n * n * n * 0.48 + stir * n * (0.5 + 0.5 * Math.sin(sv * 28 - f.t * 9))) * (1 - 0.55 * calm);

  let light = 0;
  const rim = Math.exp(-(((d - r) / 0.0085) ** 2));
  // The totality corona is far brighter than the rest; cap it so glyphs never crowd the copy.
  const halo = d > r ? Math.exp(-(d - r) * 9) * 0.6 * Math.min(p.corona, 1.15) : 0;
  light = Math.max(rim, halo);

  if (p.dial > 0.01 && d > r * 1.08 && d < r * 1.24) {
    // Sixty ticks round the ring, every fifth one longer.
    const turn = (((Math.atan2(dy, dx) / (Math.PI * 2)) % 1) + 1) % 1;
    const k = turn * 60;
    const near = Math.min(k % 1, 1 - (k % 1));
    const major = Math.round(k) % 5 === 0;
    if (near < (major ? 0.22 : 0.1) && d < r * (major ? 1.24 : 1.17))
      light = Math.max(light, 0.72 * p.dial);
  }
  if (p.dial > 0.01 && d < r) {
    // The hand sweeps with scroll, plus a slow tick of its own.
    const hand = -(f.progress * Math.PI * 8 + f.t * 0.35) + Math.PI / 2;
    const along = dx * Math.cos(hand) + dy * -Math.sin(hand);
    const across = Math.abs(dx * Math.sin(hand) + dy * Math.cos(hand));
    if (along > 0 && across < 0.007) light = Math.max(light, 0.95 * p.dial);
  }

  if (p.beam > 0.01) {
    const along = dx * BEAM.x + dy * BEAM.y;
    if (along > r * 0.8) {
      const across = Math.abs(dx * BEAM.y - dy * BEAM.x);
      const width = 0.004 + along * along * 0.05;
      const cone =
        Math.exp(-(across * across) / width) *
        Math.exp(-along * 1.1) *
        smooth((along - r * 0.8) / 0.12);
      light = Math.max(light, p.beam * cone * 0.85);
    }
  }

  // The disc is an eclipse: nothing is written inside it but the dial's hand.
  if (d < r * 0.985 && p.dial < 0.01) {
    ambient = 0;
    light = 0;
  } else if (d < r * 0.985) {
    ambient = 0;
  }

  light *= 1 - 0.45 * calm;
  const value = Math.min(1, Math.max(ambient, light));
  out.value = value;
  out.warm = light > ambient ? 1 : 0;
}

/** Which glyph a cell shows: 0 means blank. */
export function glyphIndex(value: number): number {
  if (value < 0.07) return 0;
  return Math.min(RAMP.length - 1, 1 + Math.floor(value * (RAMP.length - 1)));
}
