# Upgrading

Before bumping Next, React, Three, GSAP, or R3F: read the release notes, upgrade one family at a time, run `pnpm validate`, `pnpm build`, Playwright smoke/a11y, and the Lighthouse/size budgets. Inspect the client chunk diff.

To add a section: add one typed entry to `config/sections.ts`, create its server section component, add it to `app/page.tsx`, add content tests, and then connect its line/camera room in the same change.

To add a 3D room: implement the documented room interface (`mount`, `update(progress, quality)`, `dispose`) in `components/three/rooms`, register its ID, and test the low/off fallback first.
