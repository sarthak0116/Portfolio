export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
} as const;

export function buildContentSecurityPolicy(
  nonce: string,
  isDev = process.env.NODE_ENV === 'development',
): string {
  // React's dev runtime needs eval for stack reconstruction and Turbopack injects inline styles
  // for HMR; neither is ever allowed in production.
  const script = `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}`;
  const style = isDev ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`;
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    script,
    style,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    isDev ? "connect-src 'self' ws:" : "connect-src 'self'",
    "worker-src 'self' blob:",
    "frame-src 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}
