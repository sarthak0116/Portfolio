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

- `lib/scroll-store.ts` is the only scroll source. `ScrollProvider` (Lenis) writes progress and velocity each frame; the line, `TypeMotion` and the WebGL scene read it.
- `components/line/MasterLine.tsx` lays the registry's control points over the measured sections and draws the path to the scroll position.
- `components/motion/Preloader.tsx` is armed by the `<head>` script in `lib/theme.ts` (`html.preloading`), which also carries the failsafe timeout.
- `components/three/ShapeLayer.tsx` decides whether 3D runs (`lib/quality.ts`), lazy-loads `Scene.tsx`, and wraps it in an error boundary. `config/shape.ts` holds one pose per section; `lib/shape-state.ts` blends between them.
- With motion off, no WebGL, data saver, or a lost context, the canvas is not mounted and the page is the static design.
