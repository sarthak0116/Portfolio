# Design: a short film

The site is one continuous shot through a dark world. Scroll is time. Restraint does the work: fewer, larger things; one light source; long, slow, heavy motion.

## Concept

**Practical, not faked.** Real things, built and lit, over effects. The recurring image is a **ring** that match-cuts through the acts: an eclipse, a camera iris, a clock dial, totality.

## Palette

| Token               | Value     | Use                                                                                      |
| ------------------- | --------- | ---------------------------------------------------------------------------------------- |
| `--bg` void         | `#040405` | page                                                                                     |
| `--surface`         | `#0b0c0e` | raised planes                                                                            |
| `--text` bone       | `#e9e6df` | text (never pure white)                                                                  |
| `--muted` steel     | `#8b929b` | secondary text (AA on the void)                                                          |
| `--accent` tungsten | `#e9b06a` | **light only**: the ring's rim, the focus ring, link hover, selection. Never decoration. |

Dark only. There is no light theme.

## Type

- **Title cards:** Jost, light (300), uppercase, wide tracking (0.14em to 0.22em). Names and headlines.
- **Narration:** Instrument Serif, italic. Loglines and the accent word inside a headline.
- **Slate:** Geist Mono, small caps-ish. Act labels, metadata, timecode.
- **Body:** Geist.

Headlines are small and quiet, never 15vw. Negative space is the effect.

## Film layer

A fixed overlay above the page, never interactive: animated grain, a vignette, and a letterbox. The letterbox closes (scope) in intimate acts and opens to full frame (IMAX) in the Work act, driven by scroll. Motion off: no letterbox, static grain.

## Motion rules

- Slow and heavy: 1.2 to 1.8 s, ease-out, no bounce.
- Text arrives as a **rack focus** (blur to sharp), not a word-by-word rise.
- Sections dissolve; they do not slide.
- The camera dwells on a shot while it is read, then travels.
- Everything respects `data-motion='off'`.

## Acts

| Act         | Shot           | Ring as        | Content                                  |
| ----------- | -------------- | -------------- | ---------------------------------------- |
| I Arrival   | wide, dolly in | eclipse        | name as title card, logline              |
| II Context  | push through   | camera iris    | bio, skills engraved on the barrel       |
| III Work    | lateral track  | projector beam | projects as frames, credits              |
| IV Practice | orbit          | clock dial     | roles on the ticks                       |
| V Next move | arrive         | totality       | CTA, then end credits and a cut to black |

## Layers

1. **Grade (CSS only).** Palette, type, film layer, act structure. Complete on its own; it is also the fallback when WebGL is off.
2. **Flow.** Title-sequence intro, an edge scrubber with act ticks, intertitles.
3. **World.** Procedural 3D: the ring, a projector beam, bloom and lens aberration. The camera is handheld and the ring's pose follows the act. (Camera travel and content in the world belong to layer 4.)
4. **Content in the world.** Headlines as in-world SDF text; paragraphs, links and buttons as real DOM on 3D planes (`Html` with `transform`) so they stay selectable and clickable. The DOM underneath stays server-rendered and accessible.
5. **Engineer's marks.** An ASCII field that moves with scroll and draws the ring's light in glyphs, a text morph that decodes the role line through code glyphs, and a viewfinder HUD with the renderer's real numbers: the film and the code, side by side.
6. **Sound.** Opt-in, synthesised with WebAudio, off by default.

## Guardrails

- Name, role, availability and the email stay real, visible HTML within a second.
- Reduced motion, data saver, no WebGL or a lost context fall back to the graded static page.
- Contrast stays AA. Nothing animates layout.
- Keyboard focus on an off-screen link brings its act into frame.
- No placeholder content is invented; `TODO:` copy stays marked (see `PLACEHOLDERS.md`).
