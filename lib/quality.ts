export type Quality = 'high' | 'medium' | 'low' | 'off';

export type DeviceSignals = {
  webgl: boolean;
  motion: boolean;
  /** navigator.deviceMemory in GB, when the browser reports it. */
  memory?: number;
  /** navigator.hardwareConcurrency. */
  cores?: number;
  /** Viewport width in CSS pixels. */
  width: number;
  /** The user asked the browser to save data. */
  saveData?: boolean;
};

/**
 * Picks how much 3D to run. Anything that suggests a weak or constrained device steps down a tier;
 * no WebGL or motion switched off turns the canvas off and leaves the static page.
 */
export function pickQuality(signals: DeviceSignals): Quality {
  if (!signals.webgl || !signals.motion || signals.saveData) return 'off';
  const memory = signals.memory ?? 8;
  const cores = signals.cores ?? 8;
  if (memory <= 2 || cores <= 2) return 'low';
  if (signals.width < 768 || memory <= 4 || cores <= 4) return 'medium';
  return 'high';
}

/**
 * What each tier of the 3D world costs: ring tessellation, whether post-processing runs (bloom,
 * with lens aberration and multisampling on the top tier), and the pixel ratio.
 */
export const qualitySettings = {
  high: { segments: 28, post: true, aberration: true, multisampling: 4, dpr: 2 },
  medium: { segments: 20, post: true, aberration: false, multisampling: 0, dpr: 1.5 },
  low: { segments: 14, post: false, aberration: false, multisampling: 0, dpr: 1 },
} as const satisfies Record<Exclude<Quality, 'off'>, object>;
