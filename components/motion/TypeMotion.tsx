'use client';

import { useEffect } from 'react';
import { onScrollFrame } from '@/lib/scroll-store';

/**
 * Scroll-linked type effects, driven by CSS variables so React never re-renders:
 *  marquee  track offset, pushed along by scroll velocity
 *  --fill   0–1 fill of each section number as it crosses the viewport
 *  --wdth   display font width axis, tightening as a heading scrolls past
 */
export function TypeMotion() {
  useEffect(() => {
    const tracks = Array.from(document.querySelectorAll<HTMLElement>('.marquee-track'));
    const numbers = Array.from(document.querySelectorAll<HTMLElement>('.section-number'));
    const titles = Array.from(document.querySelectorAll<HTMLElement>('[data-wdth]'));
    let offset = 0;
    let last = performance.now();
    let frame = 0;
    let velocity = 0;
    let active = false;

    const stop = onScrollFrame((state) => {
      velocity = state.velocity;
      active = state.active;
    });

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const vh = window.innerHeight;
      if (active) {
        offset += dt * 0.03 + Math.abs(velocity) * 0.6;
        for (const track of tracks) {
          const unit = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
          if (unit > 0) track.style.transform = `translate3d(${-(offset % unit)}px, 0, 0)`;
        }
      }
      for (const el of numbers) {
        const rect = el.getBoundingClientRect();
        const fill = Math.min(1, Math.max(0, (vh * 0.9 - rect.top) / (vh * 0.5)));
        el.style.setProperty('--fill', active ? fill.toFixed(3) : '1');
      }
      for (const el of titles) {
        const rect = el.getBoundingClientRect();
        const t = Math.min(1, Math.max(0, 1 - (rect.top + rect.height / 2) / vh));
        el.style.setProperty('--wdth', active ? (100 - t * 22).toFixed(1) : '88');
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      stop();
    };
  }, []);
  return null;
}
