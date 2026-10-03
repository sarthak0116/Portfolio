import type { WorldPose } from '@/config/world';

/**
 * Blends consecutive numeric poses at a fractional index (1.5 is halfway between pose 1 and 2).
 * Before the first and after the last, the nearest pose holds.
 */
export function mixPoses<T extends Record<string, number>>(poses: readonly T[], index: number): T {
  const last = poses.length - 1;
  const at = Math.min(Math.max(index, 0), last);
  const lower = Math.floor(at);
  const a = poses[lower];
  const b = poses[Math.min(lower + 1, last)];
  if (!a || !b) throw new Error('mixPoses needs at least one pose');
  const t = at - lower;
  const out: Record<string, number> = {};
  for (const key of Object.keys(a)) out[key] = a[key]! + (b[key]! - a[key]!) * t;
  return out as T;
}

/** A 0 to 1 pulse that peaks at `center` and is gone `width` either side. */
export function bump(value: number, center: number, width: number): number {
  return Math.max(0, 1 - Math.abs(value - center) / width);
}

/**
 * Adapts a ring pose to the screen. On a portrait screen there is no empty side for the ring to sit
 * beside, so it centres behind the copy, slightly higher, and `calm` rises so it dims to a backdrop.
 * Landscape and square screens are untouched.
 */
export function adaptPose<T extends WorldPose>(pose: T, aspect: number): T {
  const k = Math.min(1, Math.max(0, (1 - aspect) / 0.35));
  if (k === 0) return pose;
  return {
    ...pose,
    x: pose.x * (1 - k),
    y: pose.y * (1 - k) + 0.08 * k,
    scale: pose.scale * (1 + 0.25 * k),
    beam: pose.beam * (1 - 0.5 * k),
    calm: k,
  };
}
