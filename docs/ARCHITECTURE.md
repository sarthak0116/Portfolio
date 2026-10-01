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
