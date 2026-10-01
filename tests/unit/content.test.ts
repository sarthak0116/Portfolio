import { describe, expect, it } from 'vitest';
import { site } from '@/content/site';
import { skills } from '@/content/skills';

describe('content', () => {
  it('validates the site profile at module load', () => {
    expect(site.name).not.toContain('TODO');
    expect(site.email).toContain('@');
  });
  it('contains at least one skill group', () => expect(skills.groups.length).toBeGreaterThan(0));
});
