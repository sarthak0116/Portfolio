'use client';

import { useEffect, useRef } from 'react';
import { sections } from '@/config/sections';
import { journeyIndex } from '@/lib/journey';
import { onScrollFrame } from '@/lib/scroll-store';
import { measureStops } from '@/lib/stops';

const romans = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/** The film's progress bar on the right edge: a fill, a tick per act, and a running timecode. */
export function Scrubber() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ticks = Array.from(el.querySelectorAll<HTMLElement>('[data-tick]'));
    let stops = measureStops();
    const place = () => {
      stops = measureStops();
      ticks.forEach((tick, i) => tick.style.setProperty('--at', (stops[i] ?? 0).toFixed(4)));
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(document.body);
    // Fonts shift section heights once they swap in.
    void document.fonts?.ready.then(place);

    const stop = onScrollFrame((state) => {
      el.style.setProperty('--p', state.progress.toFixed(4));
      const active = Math.round(journeyIndex(state.progress, stops));
      ticks.forEach((tick, i) => tick.toggleAttribute('data-active', i === active));
    });
    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  return (
    <div className="scrubber" ref={root} aria-hidden="true">
      <div className="scrubber-track" />
      <div className="scrubber-fill" />
      {sections.map((section, i) => (
        <div className="scrubber-tick" data-tick key={section.id}>
          <span>{romans[i]}</span>
        </div>
      ))}
    </div>
  );
}
