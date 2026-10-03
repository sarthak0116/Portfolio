# Decisions

## ADR-001 — Keep identity content explicitly unresolved

The repository starts with `TODO:` placeholders rather than an invented name, employer, email, or metric. This keeps the visual system usable while making it impossible to mistake demo content for the portfolio owner's real history. See `PLACEHOLDERS.md`.

## ADR-002 — Static-first Stage 1

The first stage ships a server-rendered, no-WebGL experience. It gives recruiters real HTML, accessible anchors, and a fast baseline before progressive enhancement is layered in.

## ADR-003 — Registry as the future scene contract

`config/sections.ts` owns order, anchor IDs, scroll ranges and room IDs. The scrubber, film layer, camera and page navigation consume this registry rather than maintaining parallel lists. (Spline control points were removed with the page line; the 3D world defines its own path in `config/journey.ts`.)

## ADR-004 — CSP nonce proxy

A per-request nonce is generated in `proxy.ts` and passed to the root layout for the pre-paint theme initializer. `unsafe-eval` and `unsafe-inline` are intentionally absent. WebGL workers are allowed only from `blob:`; any future external connection must be added deliberately and documented.

## ADR-005 — Fonts through next/font

Fonts are requested through `next/font` so the production build self-hosts and subsets only the declared Latin glyphs. No runtime font CDN is used.

## ADR-006 — Cinematic direction

The site is redesigned as a short film: one dark world, one recurring ring, one warm light. The earlier cream-and-lime editorial look and the wireframe "rooms" are retired because they shared no light or language with each other. Dark is the only theme; the lime accent and the page-long curved line are removed. The full system (palette, type, motion rules, the five-act storyboard and the plan to place content inside the 3D world) lives in `DESIGN.md`. The real HTML stays the source of truth for SEO, accessibility and the no-WebGL fallback; the 3D layer presents it.
