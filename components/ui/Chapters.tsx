'use client';

import { useEffect, useRef, useState } from 'react';
import { sections } from '@/config/sections';

const acts = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/**
 * The act menu for small screens, where the nav links do not fit: a full-screen black card of
 * title-card links. Opens from a button in the nav, closes on a pick, Escape or the button.
 */
export function Chapters() {
  const [open, setOpen] = useState(false);
  const first = useRef<HTMLAnchorElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    first.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        className="control-button control-button-wide chapters-button"
        type="button"
        aria-expanded={open}
        aria-controls="chapters"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close' : 'Acts'}
      </button>
      {open ? (
        <nav id="chapters" className="chapters" aria-label="Acts">
          {sections.map((section, i) => (
            <a
              key={section.id}
              ref={i === 0 ? first : undefined}
              href={i === 0 ? '#hero' : `#${section.id}-body`}
              onClick={() => setOpen(false)}
            >
              <span className="chapters-act">Act {acts[i]}</span>
              <span className="chapters-name">
                {section.eyebrow.split('/')[1]?.trim() ?? section.title}
              </span>
            </a>
          ))}
        </nav>
      ) : null}
    </>
  );
}
