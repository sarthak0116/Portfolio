function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/** Frame-rate independent easing toward a target. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/** Share of each section the camera spends parked on its room before travelling to the next. */
const DWELL = 0.4;

/**
 * Where the camera is along the journey, as a fractional room index (2.5 is halfway between rooms
 * 2 and 3). `stops[i]` is the page progress at which room i is reached; the camera eases between
 * rooms and holds at the first and last.
 */
export function journeyIndex(progress: number, stops: readonly number[]): number {
  if (stops.length < 2) return 0;
  let index = 0;
  while (index < stops.length - 1 && progress >= (stops[index + 1] ?? Infinity)) index++;
  const start = stops[index];
  const end = stops[index + 1];
  if (start === undefined || end === undefined || end <= start) return index;
  return index + smoothstep(((progress - start) / (end - start) - DWELL) / (1 - DWELL));
}
