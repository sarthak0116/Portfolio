# Architecture

## Stage 1 overview

The page is server-rendered from typed content and progressively enhanced by client modules. The section registry is the composition contract:

```text
content + config/sections.ts
          │
          ├── HTML sections / anchor navigation
          ├── master SVG path (Stage 4)
          ├── Lenis normalised progress (Stage 4)
          └── spline + rooms in one R3F canvas (Stages 5–6)
```

`app/layout.tsx` owns metadata, fonts, and the no-flash theme initializer. `components/sections` owns recruiter-readable content. `components/three` will remain optional and lazy so disabling WebGL never removes content.

## Boundaries

- `content/`: data and schemas, never visual logic.
- `config/`: stable product contracts and tokens.
- `lib/`: pure utilities, environment validation, security, and future scroll bridge.
- `components/ui/`: small accessible primitives.
- `app/`: routes, metadata, and server boundaries.

## Motion and 3D

- `lib/scroll-store.ts` is the only scroll source. `ScrollProvider` (Lenis) writes progress and velocity each frame; the film layer and the WebGL scene read it.
- `components/film/FilmLayer.tsx` is the grade: grain, vignette and a letterbox that opens and closes per act (`config/film.ts`), driven by `lib/stops.ts` and `lib/journey.ts`. `components/film/Scrubber.tsx` is the edge progress bar with a tick per act and a running timecode (`RUNTIME_SECONDS`). `components/ui/Intertitle.tsx` is the black title card that opens each act; sections cross-dissolve with scroll-driven CSS (`animation-timeline: view()`) where supported.
- `components/motion/Preloader.tsx` (the title sequence: a pure-CSS line of light and title card, then the curtains part) is armed by the `<head>` script in `lib/theme.ts` (`html.preloading`), which also carries the failsafe timeout.
- `components/three/WorldLayer.tsx` decides whether 3D runs (`lib/quality.ts`), lazy-loads `Scene.tsx`, and wraps it in an error boundary. `Scene.tsx` is the world: one ring (`world/Ring.tsx`) in a dark room, with bloom and lens aberration (`world/Post.tsx`, built on `postprocessing`). The ring's pose per act lives in `config/world.ts` and is blended by `lib/pose.ts` at the position `lib/journey.ts` computes from scroll; the ring is an eclipse that is really a closed camera iris, then a projector lens with a beam, a clock dial, and totality with a diamond-ring flash. Everything is procedural: no downloaded assets, so the CSP is unchanged. Post-processing uses half-float buffers on real GPUs and 8-bit on software renderers.
- With motion off, no WebGL, data saver, or a lost context, the canvas is not mounted and the page is the static design.
- `components/motion/TextMorph.tsx` decodes the hero's role line through code glyphs into the real stack from `content/skills.ts`; screen readers get the static role. The viewfinder HUD in `FilmLayer` shows the timecode, the act, and the renderer's live FPS, draw calls and triangles (`lib/render-stats.ts`, written by the world's frame loop).
- `components/film/AsciiField.tsx` is the ASCII layer: a 2D canvas of glyphs behind the page that the scroll moves (it slides at a fraction of page speed, scrubs with progress, and ripples and flickers on fast scrolls) and that carries the ring's rim, halo, dial and beam in characters. The picture is the pure function in `lib/ascii.ts`, driven by the same ring poses as the 3D world, so it works with WebGL off and is off with motion off.
- Quality is adaptive. `WorldLayer` steps the 3D tier down (high, medium, low, then off) after a sustained low frame rate once the scene has warmed up, and `AsciiField` coarsens its grid, halves its rate, then stops if drawing costs too much. `?quality=high|medium|low|off` pins the tier and disables the auto-degrade (and `off` also disables the ASCII layer), for testing. The act menu (`components/ui/Chapters.tsx`) replaces the nav links below 800px, and in-page links target `#<id>-body` so they land on an act's content rather than its title card.
