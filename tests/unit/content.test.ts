import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { site } from '@/content/site';
import { skills } from '@/content/skills';
import { timeline } from '@/content/timeline';

describe('content', () => {
  it('validates the site profile at module load', () => {
    expect(site.name).not.toContain('TODO');
    expect(site.email).toContain('@');
  });
  it('contains at least one skill group', () => expect(skills.groups.length).toBeGreaterThan(0));
  it('gives every project a unique slug', () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThan(0);
  });
  it('has no placeholder text left in the content', () => {
    expect(JSON.stringify({ site, skills, projects, timeline })).not.toMatch(/TODO|lorem/i);
  });
});
