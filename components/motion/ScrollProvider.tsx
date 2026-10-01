'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePref } from '@/lib/prefs';
import { clamp01, emitScroll } from '@/lib/scroll-store';

function pageProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? clamp01(window.scrollY / max) : 0;
}

/** Owns smooth scrolling and feeds the scroll store. Renders nothing. */
export function ScrollProvider() {
  const motion = usePref<'on' | 'off'>('motion', 'on');

  useEffect(() => {
    if (motion === 'off') {
      // Native scrolling, static effects: publish progress without easing or velocity.
      const publish = () => emitScroll({ progress: pageProgress(), velocity: 0, active: false });
      publish();
      window.addEventListener('scroll', publish, { passive: true });
      window.addEventListener('resize', publish);
      return () => {
        window.removeEventListener('scroll', publish);
        window.removeEventListener('resize', publish);
      };
    }

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    let frame = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      emitScroll({ progress: pageProgress(), velocity: lenis.velocity, active: true });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [motion]);

  return null;
}
