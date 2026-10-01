# Security notes

`proxy.ts` emits nonce-based CSP, HSTS preload, nosniff, strict referrer policy, a locked Permissions-Policy, COOP, and DENY framing. `next.config.ts` repeats stable headers for edge cases; CSP remains request-specific in the proxy.

No secrets belong in this repository. `.env*` is ignored, `.env.example` documents names, and `lib/env.ts` validates values at the server boundary. External links use `noopener noreferrer`. MDX must be parsed from trusted repository content; user input must never be rendered as HTML.

Account hygiene: enable 2FA/passkeys on GitHub, Vercel, domain registrar, and email; enable DNSSEC; configure SPF, DKIM, and DMARC for the domain. Enable GitHub secret scanning and push protection.
