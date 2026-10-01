import type { Point3 } from '@/config/sections';

export type SvgPoint = { x: number; y: number };

export function projectSplineToSvg(
  points: readonly Point3[],
  width = 1000,
  height = 1000,
): SvgPoint[] {
  if (points.length === 0) return [];
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return points.map(([x, y]) => ({
    x: ((x - minX) / Math.max(maxX - minX, 1)) * width,
    y: height - ((y - minY) / Math.max(maxY - minY, 1)) * height,
  }));
}

export function svgPathFromPoints(points: readonly SvgPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
}

/**
 * Smooth path through every point (uniform Catmull-Rom converted to cubic Béziers), so the drawn
 * line has no corners. `tension` 0 is loose, 1 collapses to straight segments.
 */
export function smoothPathFromPoints(points: readonly SvgPoint[], tension = 0): string {
  const first = points[0];
  if (!first) return '';
  const k = (1 - tension) / 6;
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) * k, y: p1.y + (p2.y - p0.y) * k };
    const c2 = { x: p2.x - (p3.x - p1.x) * k, y: p2.y - (p3.y - p1.y) * k };
    d += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export type SectionBox = { top: number; height: number };

/**
 * Lays the registry's control points onto the real page: x (-1…1) spans the given inset width and
 * each section's points are spread down that section's measured box. Shared endpoints between
 * neighbouring sections are emitted once.
 */
export function layoutLinePoints(
  sections: readonly { controlPoints: readonly Point3[] }[],
  boxes: readonly SectionBox[],
  width: number,
  inset = 0.06,
): SvgPoint[] {
  const points: SvgPoint[] = [];
  sections.forEach((section, index) => {
    const box = boxes[index];
    if (!box) return;
    const count = section.controlPoints.length;
    section.controlPoints.forEach(([x], pointIndex) => {
      if (index > 0 && pointIndex === 0) return;
      const t = count > 1 ? pointIndex / (count - 1) : 0;
      points.push({
        x: (inset + ((x + 1) / 2) * (1 - inset * 2)) * width,
        y: box.top + t * box.height,
      });
    });
  });
  return points;
}
