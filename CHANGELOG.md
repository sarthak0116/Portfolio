# Changelog

## [Unreleased]

- Polish pass: the ring and glyphs step back behind the copy on portrait screens; a mobile act menu; in-page links land on content, not title cards; the 3D world and ASCII layer degrade on their own when the device can't keep up (`?quality=` pins a tier); viewfinder fade and footer clearance; grain and vignette on the project and 404 pages; footer contrast fixed (Lighthouse accessibility 100); and a ring depth-sorting bug that cut the disc and drew crescents is fixed by explicit draw order.
- Redesigned as a short film (see `docs/DESIGN.md`): dark-only, a warm tungsten light in place of lime, Jost title cards with serif narration, and a film layer of grain, vignette and a scroll-driven letterbox. Sections are now acts, headings arrive as a rack focus, and project stills are framed in scope.
- Added a title-sequence intro (a line of light, the title card, curtains parting on the hero), an edge scrubber with a tick per act and a running timecode, black act intertitles, and scroll-driven cross-dissolves between acts.
- Added the 3D world: a ring that is an eclipse, a camera iris, a projector lens with a beam, a clock dial and totality across the five acts, and bloom with scroll-driven lens aberration. Procedural, with quality tiers and the static fallback.
- Added an ASCII layer that animates with scroll: ambient glyph waves that parallax with the page and ripple on fast scrolls, plus the ring's rim, halo, dial hand and projector beam drawn in characters.
- Added a text morph that decodes the hero role line through code glyphs into the real stack, and a viewfinder HUD (REC, timecode, act, live FPS, draw calls and triangles).
- Retired the light theme, the page-long curved line and its path code, the old counter preloader, the marquee and the wireframe 3D rooms.
- Added Lenis smooth scrolling with a shared scroll store, word reveals and scroll-linked type.
- Added the page-long line, drawn on scroll from the section registry.
- Added a typographic preloader, shown once per session and skippable.
- Added the WebGL backdrop as a scroll-driven journey: the camera travels a path through one room per section, each with an object that means something (cube lattice, skills constellation, framed work, timeline spine, opening envelope) and a 3D trail that mirrors the page line. Lazy-loaded with quality tiers and a static fallback.
- CI audits production dependencies; removed the unused next-mdx-remote.

## [0.1.0] — Foundation

- Added the static-first Next.js App Router foundation.
- Added strict TypeScript, Tailwind, typed content contracts, themes, accessible navigation, metadata, and security headers.
- Added CI/tooling and documentation skeleton.
