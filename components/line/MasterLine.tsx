'use client';

import { useEffect, useRef } from 'react';
import { sections } from '@/config/sections';
import { layoutLinePoints, smoothPathFromPoints } from '@/lib/path';
import { onScrollFrame } from '@/lib/scroll-store';

const SAMPLES = 400;

/**
 * The page-long line. Its shape comes from the section registry laid over the measured sections,
 * and it draws itself so the tip stays near the lower third of the viewport.
 */
export function MasterLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const ghost = ghostRef.current;
    const tip = tipRef.current;
    const host = svg?.parentElement;
    if (!svg || !path || !ghost || !tip || !host) return;

    let total = 0;
    // lengthAtY[i] is the path length where the line first reaches y = i / SAMPLES of the page.
    let lengthAtY: number[] = [];
    let hostTop = 0;
    let hostHeight = 1;

    const build = () => {
      const hostRect = host.getBoundingClientRect();
      hostTop = hostRect.top + window.scrollY;
      hostHeight = Math.max(hostRect.height, 1);
      const boxes = sections.map((section) => {
        const rect = document.getElementById(section.id)?.getBoundingClientRect();
        return rect
          ? { top: rect.top + window.scrollY - hostTop, height: rect.height }
          : { top: 0, height: 0 };
      });
      const d = smoothPathFromPoints(layoutLinePoints(sections, boxes, hostRect.width));
      svg.setAttribute('viewBox', `0 0 ${hostRect.width} ${hostHeight}`);
      path.setAttribute('d', d);
      ghost.setAttribute('d', d);
      total = path.getTotalLength();
      path.style.strokeDasharray = `${total}`;

      lengthAtY = new Array<number>(SAMPLES + 1).fill(total);
      const steps = SAMPLES * 4;
      let cursor = 0;
      for (let i = 0; i <= steps && cursor <= SAMPLES; i++) {
        const length = (i / steps) * total;
        const y = path.getPointAtLength(length).y;
        while (cursor <= SAMPLES && y >= (cursor / SAMPLES) * hostHeight) {
          lengthAtY[cursor++] = length;
        }
      }
      draw();
    };

    let active = false;
    const draw = () => {
      if (total === 0) return;
      const headY = active ? window.scrollY + window.innerHeight * 0.68 - hostTop : hostHeight;
      const t = Math.min(1, Math.max(0, headY / hostHeight)) * SAMPLES;
      const lower = Math.floor(t);
      const a = lengthAtY[lower] ?? total;
      const b = lengthAtY[Math.min(lower + 1, SAMPLES)] ?? total;
      const length = a + (b - a) * (t - lower);
      path.style.strokeDashoffset = `${total - length}`;
      const point = path.getPointAtLength(length);
      tip.setAttribute('cx', point.x.toFixed(1));
      tip.setAttribute('cy', point.y.toFixed(1));
      tip.style.opacity = active && length < total - 1 ? '1' : '0';
    };

    const stop = onScrollFrame((state) => {
      active = state.active;
      draw();
    });
    const observer = new ResizeObserver(build);
    observer.observe(host);
    build();
    // Fonts shift section heights once they swap in.
    void document.fonts?.ready.then(build);
    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  return (
    <svg ref={svgRef} className="master-line" aria-hidden="true" preserveAspectRatio="none">
      <path ref={ghostRef} className="master-line-ghost" />
      <path ref={pathRef} className="master-line-path" />
      <circle ref={tipRef} className="master-line-tip" r="5" />
    </svg>
  );
}
