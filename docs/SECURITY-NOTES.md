# Security notes

`proxy.ts` emits nonce-based CSP, HSTS preload, nosniff, strict referrer policy, a locked Permissions-Policy, COOP, and DENY framing. `next.config.ts` repeats stable headers for edge cases; CSP remains request-specific in the proxy.

No secrets belong in this repository. `.env*` is ignored, `.env.example` documents names, and `lib/env.ts` validates values at the server boundary. External links use `noopener noreferrer`. Content comes only from typed files in this repository; user input must never be rendered as HTML.

Account hygiene: enable 2FA/passkeys on GitHub, Vercel, domain registrar, and email; enable DNSSEC; configure SPF, DKIM, and DMARC for the domain. Enable GitHub secret scanning and push protection.
