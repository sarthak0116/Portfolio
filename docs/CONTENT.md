# Content

All content is typed data in `content/`, checked with Zod when the site builds. Invalid content fails the build with a message naming the field.

## Add a project

Add an entry to the array in `content/projects.ts`. It needs a lowercase `slug`, `title`, one-line `summary`, `tags`, `year`, `role`, `stack`, `status` (`Shipped` or `In progress`), a plain `result` line, the `repo` URL and one or more `sections` (heading and text). The home page card, the `/projects/<slug>` page and the sitemap all come from that entry. Order in the array is order on the page.

## Add a timeline entry

Add an entry to `content/timeline.ts` with `dates`, `title`, `kind` and `description`. Most recent first.

## Skills and profile

`content/skills.ts` lists skills by group. `content/site.ts` holds the name, role, pitch, availability, email, links and SEO text. `resumePath` and `bookingUrl` are optional; their buttons only render when set.

## Writing

Write in the first person and say what was built and how. Leave out anything that cannot be backed by the code. `PLACEHOLDERS.md` lists what is still missing.
