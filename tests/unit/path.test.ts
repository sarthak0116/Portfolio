import { describe, expect, it } from 'vitest';
import {
  layoutLinePoints,
  projectSplineToSvg,
  smoothPathFromPoints,
  svgPathFromPoints,
} from '@/lib/path';

describe('path utilities', () => {
  it('projects 3D points into the SVG coordinate space', () => {
    expect(
      projectSplineToSvg(
        [
          [0, 0, 0],
          [1, 1, 0],
        ],
        100,
        100,
      ),
    ).toEqual([
      { x: 0, y: 100 },
      { x: 100, y: 0 },
    ]);
  });
  it('creates a stable SVG path', () => {
    expect(
      svgPathFromPoints([
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ]),
    ).toBe('M 1.00 2.00 L 3.00 4.00');
  });
  it('draws a smooth curve through every point', () => {
    const d = smoothPathFromPoints([
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 20 },
    ]);
    expect(d.startsWith('M 0.00 0.00')).toBe(true);
    expect(d.match(/C /g)).toHaveLength(2);
    expect(d.endsWith('0.00 20.00')).toBe(true);
    expect(smoothPathFromPoints([])).toBe('');
  });
  it('lays registry points over measured sections without duplicating joins', () => {
    const points = layoutLinePoints(
      [
        {
          controlPoints: [
            [-1, 0, 0],
            [1, 0, 0],
          ],
        },
        {
          controlPoints: [
            [1, 0, 0],
            [0, 0, 0],
          ],
        },
      ],
      [
        { top: 0, height: 100 },
        { top: 100, height: 200 },
      ],
      1000,
      0.1,
    );
    expect(points).toEqual([
      { x: 100, y: 0 },
      { x: 900, y: 100 },
      { x: 500, y: 300 },
    ]);
  });
});
