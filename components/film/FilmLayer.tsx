'use client';

import { useEffect, useRef } from 'react';
import { RUNTIME_SECONDS, letterbox } from '@/config/film';
import { sections } from '@/config/sections';
import { journeyIndex } from '@/lib/journey';
import { renderStats } from '@/lib/render-stats';
import { onScrollFrame } from '@/lib/scroll-store';
import { measureStops } from '@/lib/stops';

const TILE = 192;
const ACTS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

function timecode(seconds: number): string {
  const whole = Math.round(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}

/** One tile of monochrome noise; the CSS jumps it around in steps, which reads as film grain. */
function noiseTile(): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TILE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const image = ctx.createImageData(TILE, TILE);
  for (let i = 0; i < image.data.length; i += 4) {
    const v = Math.random() * 255;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * The film layer: grain, vignette and a letterbox that opens and closes with the act in view.
 * Fixed above the page, never interactive. Writes CSS variables so React never re-renders.
 */
export function FilmLayer({ variant = 'full' }: { variant?: 'full' | 'plain' }) {
  const root = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLSpanElement>(null);
  const stats = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tile = noiseTile();
    if (tile) el.style.setProperty('--grain', `url(${tile})`);
    // Secondary pages get the grain and vignette only: no letterbox, no readout.
    if (variant === 'plain') return;

    let stops = measureStops();
    const observer = new ResizeObserver(() => {
      stops = measureStops();
    });
    observer.observe(document.body);

    const bars = sections.map((section) => letterbox[section.id]);
    // The viewfinder readout. The renderer numbers are real: they come from the 3D world's frame
    // loop. Text is only written when it changes, so this costs nothing while idle.
    let lastHud = '';
    let lastStats = '';
    const writeHud = (index: number, progress: number) => {
      const line = `${timecode(progress * RUNTIME_SECONDS)} · ACT ${ACTS[Math.round(index)] ?? ''}`;
      if (line !== lastHud && hud.current) hud.current.textContent = lastHud = line;
      const readout = renderStats.live
        ? ` · ${renderStats.fps} FPS · ${renderStats.calls} DRAW · ${(renderStats.triangles / 1000).toFixed(1)}K TRI`
        : '';
      if (readout !== lastStats && stats.current) stats.current.textContent = lastStats = readout;
    };

    const stop = onScrollFrame((state) => {
      // With motion off the frame stays full: no bars to animate, nothing to shift under the reader.
      const index = journeyIndex(state.progress, stops);
      writeHud(index, state.progress);
      if (!state.active) return el.style.setProperty('--bars', '0');
      const lower = Math.floor(index);
      const a = bars[lower] ?? 0;
      const b = bars[Math.min(lower + 1, bars.length - 1)] ?? a;
      el.style.setProperty('--bars', (a + (b - a) * (index - lower)).toFixed(3));
    });
    return () => {
      stop();
      observer.disconnect();
    };
  }, [variant]);

  return (
    <div className="film" ref={root} aria-hidden="true">
      <div className="film-grain" />
      <div className="film-vignette" />
      {variant === 'full' ? (
        <>
          <div className="film-fade" />
          <div className="film-bar film-bar-top" />
          <div className="film-bar film-bar-bottom" />
          <p className="film-hud">
            <span className="film-hud-dot" />
            REC <span ref={hud}>00:00 · ACT I</span>
            <span className="film-hud-stats" ref={stats} />
          </p>
        </>
      ) : null}
    </div>
  );
}
