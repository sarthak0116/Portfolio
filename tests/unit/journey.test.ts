import { describe, expect, it } from 'vitest';
import { poses } from '@/config/world';
import { sections } from '@/config/sections';
import { damp, journeyIndex } from '@/lib/journey';
import { glyphIndex, RAMP, sampleAscii, type AsciiCell, type AsciiFrame } from '@/lib/ascii';
import { adaptPose, bump, mixPoses } from '@/lib/pose';
import { morphFrame } from '@/components/motion/TextMorph';
import { pickQuality } from '@/lib/quality';

const stops = [0, 0.2, 0.4, 0.65, 0.84];

describe('journey', () => {
  it('has a ring pose for every section', () => {
    expect(sections.every((section) => poses[section.id])).toBe(true);
  });
  it('holds the first and last rooms outside the stops', () => {
    expect(journeyIndex(-1, stops)).toBe(0);
    expect(journeyIndex(2, stops)).toBe(4);
  });
  it('reaches each room exactly at its stop', () => {
    stops.forEach((stop, index) => expect(journeyIndex(stop, stops)).toBeCloseTo(index));
  });
  it('dwells on a room before travelling to the next', () => {
    expect(journeyIndex(0.07, stops)).toBe(0);
    expect(journeyIndex(0.14, stops)).toBeCloseTo(0.5);
    expect(journeyIndex(0.19, stops)).toBeGreaterThan(0.9);
  });
  it('never moves backwards as progress grows', () => {
    let last = -1;
    for (let p = 0; p <= 1; p += 0.01) {
      const next = journeyIndex(p, stops);
      expect(next).toBeGreaterThanOrEqual(last);
      last = next;
    }
  });
  it('needs at least two stops to move', () => {
    expect(journeyIndex(0.5, [])).toBe(0);
    expect(journeyIndex(0.5, [0])).toBe(0);
  });
  it('damps toward the target without overshooting', () => {
    const next = damp(0, 1, 4, 0.016);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(1);
  });
});

describe('poses', () => {
  const list = sections.map((section) => poses[section.id]);
  it('holds the first and last pose outside the range', () => {
    expect(mixPoses(list, -2)).toEqual(list[0]);
    expect(mixPoses(list, 9)).toEqual(list.at(-1));
  });
  it('is halfway between poses at a half index', () => {
    const mid = mixPoses(list, 0.5);
    expect(mid.x).toBeCloseTo((list[0]!.x + list[1]!.x) / 2);
    expect(mid.iris).toBeCloseTo((list[0]!.iris + list[1]!.iris) / 2);
  });
  it('pulses once around its centre', () => {
    expect(bump(3.85, 3.85, 0.3)).toBe(1);
    expect(bump(4.5, 3.85, 0.3)).toBe(0);
    expect(bump(3.7, 3.85, 0.3)).toBeCloseTo(0.5);
  });
});

describe('portrait adaptation', () => {
  it('leaves landscape and square screens untouched', () => {
    expect(adaptPose(poses.hero, 1.6)).toBe(poses.hero);
    expect(adaptPose(poses.hero, 1)).toBe(poses.hero);
  });
  it('centres the ring and calms it on a phone', () => {
    const phone = adaptPose(poses.hero, 0.46);
    expect(phone.x).toBe(0);
    expect(phone.calm).toBe(1);
    expect(phone.scale).toBeGreaterThan(poses.hero.scale);
  });
  it('eases in between square and phone', () => {
    const tablet = adaptPose(poses.hero, 0.8);
    expect(tablet.calm).toBeGreaterThan(0);
    expect(tablet.calm).toBeLessThan(1);
  });
});

describe('ascii field', () => {
  const frame = (over: Partial<AsciiFrame> = {}): AsciiFrame => ({
    t: 1,
    progress: 0.3,
    scroll: 0.5,
    velocity: 0,
    aspect: 1.6,
    pose: { ...poses.hero },
    ...over,
  });
  const at = (u: number, v: number, f: AsciiFrame): AsciiCell => {
    const out = { value: 0, warm: 0 };
    sampleAscii(u, v, f, out);
    return out;
  };
  // The hero ring: centre and radius in viewport-height units for a 1.6 aspect screen.
  const cx = (0.5 + 0.62 * 1 * 0.5) * 1.6;
  const cy = 0.5 - 0.3 * 0.5;
  const r = (1.15 * 0.85 * 1) / (2 * 6 * Math.tan((35 / 2) * (Math.PI / 180)));

  it('stays within 0 to 1 everywhere', () => {
    const f = frame({ velocity: 80 });
    for (let u = 0; u < 1.6; u += 0.07) {
      for (let v = 0; v < 1; v += 0.07) {
        const { value } = at(u, v, f);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });
  it('lights the ring rim and leaves the disc black', () => {
    const f = frame();
    const rim = at(cx + r, cy, f);
    expect(rim.value).toBeGreaterThan(0.9);
    expect(rim.warm).toBe(1);
    expect(at(cx, cy, f).value).toBe(0);
  });
  it('fades the halo with distance from the rim', () => {
    const f = frame();
    expect(at(cx + r + 0.05, cy, f).value).toBeGreaterThan(at(cx + r + 0.4, cy, f).value);
  });
  it('moves with scroll', () => {
    const a = at(0.3, 0.6, frame({ scroll: 0, progress: 0.3 }));
    const b = at(0.3, 0.6, frame({ scroll: 2, progress: 0.3 }));
    expect(a.value).not.toBeCloseTo(b.value, 3);
  });
  it('draws the dial hand only when the dial is up', () => {
    const dial = { ...poses.experience };
    const rr = (1.15 * 0.55) / (2 * 6 * Math.tan((35 / 2) * (Math.PI / 180)));
    const ccx = (0.5 + 0.72 * 0.5) * 1.6;
    const ccy = 0.5 - 0.5 * 0.5;
    let hits = 0;
    for (let a = 0; a < Math.PI * 2; a += 0.05) {
      if (
        at(ccx + Math.cos(a) * rr * 0.6, ccy + Math.sin(a) * rr * 0.6, frame({ pose: dial }))
          .value > 0.9
      )
        hits++;
    }
    expect(hits).toBeGreaterThan(0);
    expect(at(ccx, ccy, frame({ pose: { ...dial, dial: 0 } })).value).toBe(0);
  });
  it('maps density to glyphs, blank when faint', () => {
    expect(glyphIndex(0)).toBe(0);
    expect(glyphIndex(0.05)).toBe(0);
    expect(glyphIndex(1)).toBe(RAMP.length - 1);
    expect(glyphIndex(0.5)).toBeGreaterThan(glyphIndex(0.2));
  });
});

describe('text morph', () => {
  const jitter = [0, 0, 0, 0, 0, 0, 0, 0];
  it('is the target text once every character has resolved', () => {
    expect(morphFrame('alpha', 'omega', 10_000, jitter)).toBe('omega');
  });
  it('flickers through glyphs before anything resolves, keeping the length', () => {
    const early = morphFrame('abcd', 'wxyz', -1, jitter);
    expect(early).toHaveLength(4);
    expect(early).not.toBe('wxyz');
  });
  it('drops characters the target does not have', () => {
    expect(morphFrame('longer text', 'short', 10_000, new Array(11).fill(0))).toBe('short');
  });
  it('keeps spaces that both phrases share', () => {
    expect(morphFrame('a b', 'c d', -1, jitter)[1]).toBe(' ');
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
