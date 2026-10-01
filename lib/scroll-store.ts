/**
 * Single scroll source of truth. Lenis writes it once per frame; the line, the type effects and
 * the WebGL scene all read it, so nothing runs its own scroll listener.
 */
export type ScrollState = {
  /** 0 at the top of the page, 1 at the bottom. */
  progress: number;
  /** Pixels per frame, signed. */
  velocity: number;
  /** False when motion is switched off, so readers can settle to a static state. */
  active: boolean;
};

export const scrollState: ScrollState = { progress: 0, velocity: 0, active: false };

type Listener = (state: ScrollState) => void;
const listeners = new Set<Listener>();

export function onScrollFrame(listener: Listener): () => void {
  listeners.add(listener);
  listener(scrollState);
  return () => listeners.delete(listener);
}

export function emitScroll(next: Partial<ScrollState>) {
  Object.assign(scrollState, next);
  listeners.forEach((listener) => listener(scrollState));
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Progress through one registry range, clamped to 0–1. */
export function rangeProgress(progress: number, [start, end]: readonly [number, number]): number {
  return clamp01((progress - start) / Math.max(end - start, 1e-6));
}
