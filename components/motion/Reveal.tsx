'use client';

import { useEffect, useRef } from 'react';

/**
 * Masked word-by-word reveal for headings. Words are wrapped on the client so the server HTML
 * stays a plain, readable heading; without JS or with motion off the text is simply visible.
 */
export function Reveal({
  as: Tag = 'div',
  className,
  id,
  children,
}: {
  as?: 'h1' | 'h2' | 'p' | 'div';
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let index = 0;
    const wrap = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = (node.textContent ?? '').split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            fragment.append(' ');
            continue;
          }
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const word = document.createElement('span');
          word.className = 'word';
          word.style.setProperty('--i', String(index++));
          word.textContent = part;
          mask.append(word);
          fragment.append(mask);
        }
        node.parentNode?.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName !== 'BR') {
        Array.from(node.childNodes).forEach(wrap);
      }
    };
    // Split once; the effect itself may run twice under React strict mode.
    if (el.dataset.split !== 'done') {
      Array.from(el.childNodes).forEach(wrap);
      el.dataset.split = 'done';
    }

    const root = document.documentElement;
    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            el.classList.add('is-in');
            observer?.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(el);
    };
    // While the preloader covers the page, hold the reveal until its curtain starts to lift.
    const waiting = root.classList.contains('preloading') && root.dataset.preloader !== 'done';
    if (waiting) window.addEventListener('preloader:done', observe, { once: true });
    else observe();
    return () => {
      window.removeEventListener('preloader:done', observe);
      observer?.disconnect();
    };
  }, []);

  const Component = Tag as 'div';
  return (
    <Component ref={ref as React.Ref<HTMLDivElement>} id={id} className={className} data-reveal>
      {children}
    </Component>
  );
}
