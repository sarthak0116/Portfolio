'use client';

import { useEffect, useRef } from 'react';
import { poses } from '@/config/world';
import { sections } from '@/config/sections';
import { glyphIndex, RAMP, sampleAscii, type AsciiCell, type AsciiFrame } from '@/lib/ascii';
import { damp, journeyIndex } from '@/lib/journey';
import { adaptPose, mixPoses } from '@/lib/pose';
import { usePref } from '@/lib/prefs';
import { scrollState } from '@/lib/scroll-store';
import { measureStops } from '@/lib/stops';

const list = sections.map((section) => poses[section.id]);
/** Cool steel for the field, tungsten for light. Alpha is baked into the glyphs. */
const STEEL = 'rgba(139, 146, 155, 0.34)';
const AMBER = 'rgba(233, 176, 106, 0.8)';

/** One row of pre-rendered glyphs per tint, so drawing a cell is a single drawImage. */
function buildAtlas(font: string, color: string, cw: number, ch: number): HTMLCanvasElement {
  const atlas = document.createElement('canvas');
  atlas.width = RAMP.length * cw;
  atlas.height = ch;
  const ctx = atlas.getContext('2d');
  if (ctx) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    for (let i = 1; i < RAMP.length; i++)
      ctx.fillText(RAMP[i]!, i * cw + cw / 2, ch / 2 + ch * 0.04);
  }
  return atlas;
}

/**
 * The ASCII layer: a field of characters behind the page that the scroll moves. It slides with the
 * page at a fraction of its speed, scrubs with progress, ripples and flickers when you scroll fast,
 * and carries the ring's rim, halo, dial and beam in glyphs, so the 3D light and the code share one
 * picture. A plain 2D canvas: it works with WebGL off, and it is off with motion off.
 */
export function AsciiField() {
  const motion = usePref<'on' | 'off'>('motion', 'on');
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (motion === 'off' || !el || !ctx) return;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return;
    const weak = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
    // A ?quality= override pins everything, for testing.
    const param = new URLSearchParams(window.location.search).get('quality');
    const pinned = param !== null;
    if (param === 'off') return;

    const root = document.documentElement;
    let cancelled = false;
    let frame = 0;
    let stops = measureStops();
    let atlases: HTMLCanvasElement[] = [];
    let cols = 0;
    let rows = 0;
    let cw = 0;
    let ch = 0;
    let dpr = 1;
    let w = 0;
    let h = 0;
    let index = 0;
    let last = 0;
    const cell: AsciiCell = { value: 0, warm: 0 };
    let interval = 1000 / (weak ? 20 : 24);
    // How far the grid has been coarsened, and a running cost of drawing it.
    let coarse = 0;
    let cost = 0;
    let counted = 0;

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      // Roughly 150 columns across, fewer on weak or narrow screens.
      cw = Math.max(weak ? 11 : 8, Math.min(16, Math.round(w / (w < 800 ? 56 : 115)))) + coarse * 2;
      ch = Math.round(cw * 1.75);
      cols = Math.ceil(w / cw);
      rows = Math.ceil(h / ch);
      const family =
        getComputedStyle(document.body).getPropertyValue('--font-mono').trim() ||
        'ui-monospace, monospace';
      const font = `${Math.round(ch * 0.82 * dpr)}px ${family}`;
      atlases = [
        buildAtlas(font, STEEL, Math.round(cw * dpr), Math.round(ch * dpr)),
        buildAtlas(font, AMBER, Math.round(cw * dpr), Math.round(ch * dpr)),
      ];
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden || now - last < interval) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      index = damp(index, journeyIndex(scrollState.progress, stops), 8, dt);
      const frameData: AsciiFrame = {
        t: now / 1000,
        progress: scrollState.progress,
        scroll: window.scrollY / h,
        velocity: scrollState.velocity,
        aspect: w / h,
        pose: adaptPose(mixPoses(list, index), w / h),
      };
      const stir = Math.min(Math.abs(scrollState.velocity) * 0.012, 0.7);
      const began = performance.now();
      ctx.clearRect(0, 0, el.width, el.height);
      const tw = Math.round(cw * dpr);
      const th = Math.round(ch * dpr);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          sampleAscii(((c + 0.5) * cw) / h, ((r + 0.5) * ch) / h, frameData, cell);
          let g = glyphIndex(cell.value);
          if (g === 0) continue;
          // Fast scrolling makes the characters flicker between neighbours on the ramp.
          if (stir > 0.05 && Math.random() < stir * 0.5) {
            g = Math.max(1, Math.min(RAMP.length - 1, g + (Math.random() < 0.5 ? -1 : 1)));
          }
          ctx.drawImage(
            atlases[cell.warm]!,
            g * tw,
            0,
            tw,
            th,
            Math.round(c * cw * dpr),
            Math.round(r * ch * dpr),
            tw,
            th,
          );
        }
      }
      el.dataset.ready = 'true';

      // If drawing eats more than a sixth of a frame for a sustained run, coarsen the grid, then
      // halve the rate, then stop: the page is never made to stutter for decoration.
      cost = cost * 0.9 + (performance.now() - began) * 0.1;
      if (!pinned && ++counted > 90 && cost > 11) {
        counted = 0;
        if (coarse < 3) {
          coarse++;
          layout();
        } else if (interval < 60) {
          interval = 1000 / 15;
        } else {
          cancelAnimationFrame(frame);
          el.dataset.ready = 'false';
          root.classList.remove('has-ascii');
        }
      }
    };

    const start = () => {
      if (cancelled) return;
      layout();
      root.classList.add('has-ascii');
      frame = requestAnimationFrame(draw);
    };
    // Start once the intro has finished and the browser is idle, so the field never competes with
    // first paint or hydration. The glyphs are drawn in the mono font, so wait for it too.
    let idle = 0;
    const whenReady = () => {
      void document.fonts.ready.then(() => {
        idle = window.requestIdleCallback
          ? window.requestIdleCallback(start, { timeout: 1500 })
          : window.setTimeout(start, 200);
      });
    };
    const intro = root.classList.contains('preloading') && root.dataset.preloader !== 'done';
    if (intro) window.addEventListener('preloader:done', whenReady, { once: true });
    else whenReady();

    const onResize = () => {
      stops = measureStops();
      if (atlases.length) layout();
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      window.removeEventListener('preloader:done', whenReady);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      root.classList.remove('has-ascii');
    };
  }, [motion]);

  return <canvas ref={canvas} className="ascii-layer" aria-hidden="true" />;
}
