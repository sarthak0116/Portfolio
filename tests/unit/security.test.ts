import { describe, expect, it } from 'vitest';
import { buildContentSecurityPolicy } from '@/lib/security';

describe('security policy', () => {
  it('uses a nonce and forbids unsafe script execution', () => {
    const policy = buildContentSecurityPolicy('test-nonce', false);
    expect(policy).toContain("'nonce-test-nonce'");
    expect(policy).not.toContain('unsafe-eval');
    expect(policy).not.toContain('unsafe-inline');
    expect(policy).toContain("frame-ancestors 'none'");
  });
  it('relaxes only in development', () => {
    const policy = buildContentSecurityPolicy('test-nonce', true);
    expect(policy).toContain('unsafe-eval');
    expect(policy).not.toContain('upgrade-insecure-requests');
  });
});
