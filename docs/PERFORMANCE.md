# Performance

Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1; Lighthouse 90+ across performance, accessibility, best practices, and SEO. Initial route JS is budgeted at 180 KB and lazy 3D at 650 KB in `package.json`.

Run `pnpm perf` for a production build and Lighthouse CI. Profile the canvas with Chrome Performance: record frame time, R3F draw calls, texture/GPU memory, and tab-hidden behavior. Cap device pixel ratio, pause offscreen/hidden rendering, and prefer instancing. Keep animations to transforms/opacity.
