'use client';

import { useEffect, useState } from 'react';
import { usePref } from '@/lib/prefs';

/** What the unresolved letters flicker through: the vocabulary of source code. */
const GLYPHS = '01{}[]()<>/\\_=+*#$%&;:';
const STEP = 900;

const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;

/**
 * The text a morph shows `elapsed` ms in: each character of `to` resolves at its own moment, left
 * to right with a little jitter, and until then flickers through code glyphs. A character that
 * exists on only one side resolves to a glyph or to nothing.
 */
export function morphFrame(from: string, to: string, elapsed: number, jitter: number[]): string {
  const length = Math.max(from.length, to.length);
  let out = '';
  for (let i = 0; i < length; i++) {
    const resolveAt = (i / length) * STEP * 0.65 + (jitter[i] ?? 0) * STEP * 0.35;
    if (elapsed >= resolveAt) out += to[i] ?? '';
    else out += to[i] === ' ' && from[i] === ' ' ? ' ' : glyph();
  }
  return out;
}

/**
 * A line that decodes from one phrase to the next through scrambled glyphs, like text being
 * compiled. Screen readers get the first phrase, static; the scramble is decoration. With motion
 * off, or a single phrase, it is just that text.
 */
export function TextMorph({ phrases, hold = 3400 }: { phrases: readonly string[]; hold?: number }) {
  const motion = usePref<'on' | 'off'>('motion', 'on');
  const [text, setText] = useState(phrases[0] ?? '');
  const animated = motion === 'on' && phrases.length > 1;

  useEffect(() => {
    if (!animated) return;
    let current = 0;
    let frame = 0;
    let timer = 0;
    const next = () => {
      // Hold off while the tab or the hero is out of view; nobody is watching.
      if (document.hidden || window.scrollY > window.innerHeight) {
        timer = window.setTimeout(next, 600);
        return;
      }
      const from = phrases[current]!;
      current = (current + 1) % phrases.length;
      const to = phrases[current]!;
      const jitter = Array.from({ length: Math.max(from.length, to.length) }, Math.random);
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        setText(elapsed >= STEP ? to : morphFrame(from, to, elapsed, jitter));
        if (elapsed < STEP) frame = requestAnimationFrame(tick);
        else timer = window.setTimeout(next, hold);
      };
      frame = requestAnimationFrame(tick);
    };
    // The first morph waits for the intro to finish and the title to be read.
    timer = window.setTimeout(next, hold + 1500);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [animated, phrases, hold]);

  return (
    <>
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden="true">{animated ? text : phrases[0]}</span>
    </>
  );
}
