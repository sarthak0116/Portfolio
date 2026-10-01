import type { ShapeState } from '@/config/shape';

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * Blends between consecutive poses. `stops[i]` is the page progress at which pose i is fully
 * reached; before the first stop and after the last, the nearest pose holds.
 */
export function blendShapeState(
  progress: number,
  stops: readonly number[],
  states: readonly ShapeState[],
): ShapeState {
  const first = states[0];
  if (!first) throw new Error('blendShapeState needs at least one state');
  let index = 0;
  while (index < stops.length - 1 && progress >= (stops[index + 1] ?? Infinity)) index++;
  const from = states[index] ?? first;
  const to = states[index + 1];
  const start = stops[index];
  const end = stops[index + 1];
  if (!to || start === undefined || end === undefined || end <= start) return from;
  const t = smoothstep((progress - start) / (end - start));
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    x: mix(from.x, to.x),
    y: mix(from.y, to.y),
    scale: mix(from.scale, to.scale),
    distort: mix(from.distort, to.distort),
    frequency: mix(from.frequency, to.frequency),
    facet: mix(from.facet, to.facet),
    stretch: mix(from.stretch, to.stretch),
    speed: mix(from.speed, to.speed),
  };
}

/** Frame-rate independent easing toward a target. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
