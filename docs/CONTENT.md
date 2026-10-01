# Content guide

The owner identity is intentionally left as `TODO:`. Fill `PLACEHOLDERS.md` before launch.

## Add a project

Add one `.mdx` file under `content/projects/` with frontmatter matching `content/projects/schema.ts`. Use a stable lowercase slug, outcome-led summary, exact role, stack, year, links, cover path, metrics, featured flag, and order. The MDX body should cover problem, role, key decisions, and outcome.

## Add experience

Add a JSON file under `content/experience/`. It must contain `company`, `role`, `dates`, non-empty `bullets`, and `tech`; validate it with `experienceSchema` when the loader is wired.

## Add a skill

Edit `content/skills.ts`. Proficiency is optional and must be between 0 and 1. Keep the visible list short enough to skim.
