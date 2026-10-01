import { describe, expect, it } from 'vitest';
import { projectSplineToSvg, svgPathFromPoints } from '@/lib/path';

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
});
