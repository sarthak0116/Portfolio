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
