# Sarthak Singh — portfolio

My portfolio site. Next.js, TypeScript and Tailwind CSS, with scroll-driven motion and a WebGL backdrop layered on top of a page that works without either.

## Setup

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

## Scripts

- `pnpm validate` — typecheck, lint, format check, and unit tests.
- `pnpm build` / `pnpm start` — production build and server.
- `pnpm test:e2e` — Playwright smoke/a11y suite.
- `pnpm perf` — production Lighthouse CI run.
- `pnpm audit` — high-severity dependency audit.

## Structure

See `docs/ARCHITECTURE.md`, `docs/CONTENT.md`, and `PLACEHOLDERS.md`. Content is data-first under `content/`; `config/sections.ts` is the page/line/camera registry. Three.js is lazy and optional; the HTML experience remains complete without it.

## Deploy

Vercel can deploy the repository directly with the default Next.js settings. Set `NEXT_PUBLIC_SITE_URL` and server-only values in the Vercel project environment. Add a custom domain, enforce HTTPS, and configure DNSSEC, SPF, DKIM, and DMARC.

Enable GitHub 2FA/passkeys, secret scanning, and push protection. Dependabot is configured for grouped updates.
