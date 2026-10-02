'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/content/site';

/** The splash holds until this long after navigation start, however late hydration lands. */
const SPLASH = 900;
const DURATION = 1100;
/** How long the name rests at 100 before the curtain lifts. */
const HOLD = 180;
const EXIT = 600;
/** Share of the count given to the cycling words; the name owns the rest. */
const BEATS_SHARE = 0.6;

/** One word per beat, alternating the display sans and the serif italic. */
const beats = [
  { label: 'Bytes', serif: false },
  { label: 'pixels', serif: true },
  { label: 'Sockets', serif: false },
] as const;

/**
 * Intro shown once per session on the home page, in two phases: a splash where the mark draws
 * itself over the name (pure CSS, so it plays before hydration), then the typographic count. The
 * <head> script decides whether it shows (html.preloading); this component runs the count and lifts
 * the curtain. Any key or a click skips it.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!el || !root.classList.contains('preloading')) return;

    const count = el.querySelector<HTMLElement>('[data-count]');
    const words = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'));
    const index = Array.from(el.querySelectorAll<HTMLElement>('[data-index]'));
    let start = 0;
    let splash = 0;
    let frame = 0;
    let exit = 0;
    let hold = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(splash);
      window.clearTimeout(hold);
      if (count) count.textContent = '100';
      el.style.setProperty('--p', '1');
      el.classList.add('is-leaving');
      // Headings wait for this, so the hero words rise as the curtain lifts.
      root.dataset.preloader = 'done';
      window.dispatchEvent(new Event('preloader:done'));
      try {
        sessionStorage.setItem('preloaded', '1');
      } catch {
        // Without storage the intro simply plays again next visit.
      }
      exit = window.setTimeout(() => root.classList.remove('preloading'), EXIT);
    };

    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / DURATION);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      if (count) count.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      el.style.setProperty('--p', eased.toFixed(3));
      // The last slot is the name; it holds for the final stretch of the count.
      const beatCount = words.length - 1;
      const active = Math.min(beatCount, Math.floor((t / BEATS_SHARE) * beatCount));
      words.forEach((word, i) => {
        word.dataset.state = i < active ? 'past' : i === active ? 'active' : 'next';
      });
      index.forEach((item, i) => item.toggleAttribute('data-on', i === active));
      if (t < 1) frame = requestAnimationFrame(tick);
      else hold = window.setTimeout(finish, HOLD);
    };
    splash = window.setTimeout(
      () => {
        el.dataset.phase = 'count';
        start = performance.now();
        frame = requestAnimationFrame(tick);
      },
      Math.max(0, SPLASH - performance.now()),
    );

    window.addEventListener('keydown', finish);
    el.addEventListener('click', finish);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(splash);
      window.clearTimeout(hold);
      window.clearTimeout(exit);
      window.removeEventListener('keydown', finish);
      el.removeEventListener('click', finish);
    };
  }, []);

  const [firstName, ...rest] = site.name.split(' ');
  const lastName = rest.join(' ');

  return (
    <div ref={ref} className="preloader" data-phase="splash" aria-hidden="true">
      <div className="preloader-splash">
        <svg className="splash-mark" viewBox="0 0 120 120">
          <circle className="splash-ring" cx="60" cy="60" r="54" pathLength={1} />
          {[0, 45, 90, 135].map((angle) => (
            <line
              key={angle}
              className="splash-spoke"
              x1="60"
              y1="24"
              x2="60"
              y2="96"
              pathLength={1}
              transform={`rotate(${angle} 60 60)`}
            />
          ))}
        </svg>
        <p className="splash-name font-display">
          {firstName} <em className="font-serif">{lastName}</em>
        </p>
        <p className="splash-role eyebrow">
          {site.role} — Portfolio {new Date().getFullYear()}
        </p>
      </div>
      <div className="preloader-top eyebrow">
        <span>{site.name}</span>
        <span>{site.role}</span>
        <span>Portfolio — {new Date().getFullYear()}</span>
      </div>
      <ol className="preloader-index eyebrow">
        {beats.map((beat, i) => (
          <li key={beat.label} data-index>
            <span>0{i + 1}</span> {beat.label}
          </li>
        ))}
      </ol>
      <div className="preloader-stage">
        {beats.map((beat) => (
          <span
            key={beat.label}
            data-word
            data-state="next"
            className={beat.serif ? 'font-serif' : 'font-display'}
          >
            {beat.label}
          </span>
        ))}
        <span data-word data-state="next" className="font-display preloader-name">
          {site.name}
        </span>
      </div>
      <div className="preloader-bottom">
        <p className="eyebrow">
          Loading
          <br />
          Press any key to skip
        </p>
        <span className="preloader-count font-display" data-count>
          000
        </span>
      </div>
      <span className="preloader-bar" />
    </div>
  );
}
