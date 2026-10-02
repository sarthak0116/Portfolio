# Decisions

## ADR-001 — Keep identity content explicitly unresolved

Nothing on the site is invented. Projects, skills and the timeline are taken from the owner's public repositories, with no made-up employers or metrics. Facts that are not known yet are left out and listed in `PLACEHOLDERS.md`.

## ADR-002 — Static-first Stage 1

The first stage ships a server-rendered, no-WebGL experience. It gives recruiters real HTML, accessible anchors, and a fast baseline before progressive enhancement is layered in.

## ADR-003 — Registry as the future scene contract

`config/sections.ts` owns order, anchor IDs, scroll ranges, room IDs, and spline control points. The SVG path, camera and page navigation will consume this registry rather than maintaining parallel lists.

## ADR-004 — CSP nonce proxy

A per-request nonce is generated in `proxy.ts` and passed to the root layout for the pre-paint theme initializer. `unsafe-eval` and `unsafe-inline` are intentionally absent. WebGL workers are allowed only from `blob:`; any future external connection must be added deliberately and documented.

## ADR-005 — Fonts through next/font

Fonts are requested through `next/font` so the production build self-hosts and subsets only the declared Latin glyphs. No runtime font CDN is used.
