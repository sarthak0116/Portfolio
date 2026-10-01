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

export const qualitySettings = {
  high: { detail: 48, dpr: 2, satellites: 9, antialias: true },
  medium: { detail: 24, dpr: 1.5, satellites: 5, antialias: true },
  low: { detail: 10, dpr: 1, satellites: 0, antialias: false },
} as const satisfies Record<Exclude<Quality, 'off'>, object>;
