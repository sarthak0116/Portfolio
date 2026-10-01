import { describe, expect, it } from 'vitest';
import { sections } from '@/config/sections';

describe('section registry', () => {
  it('has ordered, contiguous ranges', () => {
    expect(sections[0]?.range[0]).toBe(0);
    expect(sections.at(-1)?.range[1]).toBe(1);
    sections
      .slice(1)
      .forEach((section, index) => expect(section.range[0]).toBe(sections[index]?.range[1]));
  });
});
