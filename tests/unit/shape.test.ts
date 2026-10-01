import { describe, expect, it } from 'vitest';
import { sections } from '@/config/sections';
import { shapeStates } from '@/config/shape';
import { pickQuality } from '@/lib/quality';
import { blendShapeState, damp } from '@/lib/shape-state';

const states = sections.map((section) => shapeStates[section.id]);
const stops = [0, 0.2, 0.4, 0.65, 0.84];

describe('shape state', () => {
  it('has a pose for every section', () => {
    expect(states.every(Boolean)).toBe(true);
  });
  it('holds the first and last poses outside the stops', () => {
    expect(blendShapeState(-1, stops, states)).toEqual(states[0]);
    expect(blendShapeState(2, stops, states)).toEqual(states.at(-1));
  });
  it('is halfway between poses at the midpoint', () => {
    const mid = blendShapeState(0.1, stops, states);
    expect(mid.x).toBeCloseTo((states[0]!.x + states[1]!.x) / 2);
  });
  it('damps toward the target without overshooting', () => {
    const next = damp(0, 1, 4, 0.016);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(1);
  });
});

describe('quality tiers', () => {
  const base = { webgl: true, motion: true, width: 1440, memory: 8, cores: 8 };
  it('turns 3D off without WebGL, with motion off or with data saver', () => {
    expect(pickQuality({ ...base, webgl: false })).toBe('off');
    expect(pickQuality({ ...base, motion: false })).toBe('off');
    expect(pickQuality({ ...base, saveData: true })).toBe('off');
  });
  it('steps down on weaker devices', () => {
    expect(pickQuality(base)).toBe('high');
    expect(pickQuality({ ...base, width: 390 })).toBe('medium');
    expect(pickQuality({ ...base, cores: 4 })).toBe('medium');
    expect(pickQuality({ ...base, memory: 2 })).toBe('low');
  });
});
