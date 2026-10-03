'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/content/site';

/** The title card holds until this long after navigation start, however late hydration lands. */
const LEAVE_AT = 2200;
/** Matches the curtain transition in CSS. */
const CURTAINS = 1300;

/**
 * Title sequence, shown once per session on the home page: a line of light, the title card, then
 * the curtains part on the hero. The look is pure CSS and plays before hydration. The <head> script
 * decides whether it shows (html.preloading); this component only decides when to leave. Any key or
 * a click skips it.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!el || !root.classList.contains('preloading')) return;

    let leave = 0;
    let exit = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(leave);
      el.classList.add('is-leaving');
      // Headings wait for this, so the hero resolves as the curtains part.
      root.dataset.preloader = 'done';
      window.dispatchEvent(new Event('preloader:done'));
      try {
        sessionStorage.setItem('preloaded', '1');
      } catch {
        // Without storage the intro simply plays again next visit.
      }
      exit = window.setTimeout(() => root.classList.remove('preloading'), CURTAINS);
    };

    leave = window.setTimeout(finish, Math.max(0, LEAVE_AT - performance.now()));
    window.addEventListener('keydown', finish);
    el.addEventListener('click', finish);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(exit);
      window.removeEventListener('keydown', finish);
      el.removeEventListener('click', finish);
    };
  }, []);

  return (
    <div ref={ref} className="preloader" aria-hidden="true">
      <div className="curtain curtain-top" />
      <div className="curtain curtain-bottom" />
      <div className="seq">
        <p className="seq-title font-display">{site.name}</p>
        <span className="seq-line" />
        <p className="seq-role eyebrow">
          {site.role} — Portfolio {new Date().getFullYear()}
        </p>
      </div>
      <p className="seq-skip eyebrow">Press any key to skip</p>
    </div>
  );
}
