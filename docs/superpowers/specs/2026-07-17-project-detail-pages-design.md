# Project Detail Pages — Design

Date: 2026-07-17

## Problem

The `/projects` page lists projects as cards, each with a single external "View Project"
link. There is no per-project route and no place for a longer write-up. We want each
project to expose **two links**: one to its external URL and one to an internal detail
page that discusses the project in more depth. Projects should also be grouped into
**Personal** and **Professional** sections.

## Goals

- Each project has a detail page at `/projects/<slug>` with a rich markdown body.
- The listing cards show two explicit footer links: "View details →" (internal) and
  "Visit site ↗" (external, only when a real URL exists).
- Projects are split into **Personal** and **Professional** sections, Personal first.

## Non-goals

- Writing the full long-form content for every project (bodies are seeded with a starter
  template; real copy is added later by the site owner).
- Filtering/tag pages, search, pagination, or a category toggle UI.

## Content model

Convert the `projects` collection from `type: 'data'` to `type: 'page'`, sourced from
`content/projects/*.md`. Page type automatically provides `path` and a rendered `body`.

`content.config.ts` schema for each project:

- `title: string`
- `description: string`
- `image: string` (media input)
- `url: string` (external link; `"#"` means none yet)
- `tags: string[]`
- `date: date`
- `category: enum('Personal', 'Professional')` — **new field**

## Content migration

Each existing `content/projects/*.yml` becomes `content/projects/*.md`:

- Frontmatter carries all fields above (including the new `category`).
- Body is seeded with a light starter template so no page is empty:
  the existing `description` as an intro paragraph, followed by placeholder
  `## Overview`, `## What I did`, and `## Stack` headings.
- Slugs come from filenames, e.g. `booking-manager.md` → `/projects/booking-manager`.

Categorization:

| Project | Category |
|---|---|
| Scoundrel | Personal |
| Fitbud | Personal |
| Hala Centar | Personal |
| Booking Manager | Professional |
| Serapion web | Professional |
| Scayle Middlewares | Professional |
| Qartora | Professional |

Hala Centar's description is updated to note it was a **commissioned job done solo**.

## Listing page (`app/pages/projects.vue`)

- Query the `projects` collection with `.all()`.
- Split results into two groups by `category` and render two `UPageSection`s:
  **Personal** first, then **Professional**, each with a section heading. Within each
  section, sort by `date` descending (newest first).
- Card changes:
  - Card body is **not** a link (remove the whole-card `:to`).
  - Footer shows **View details →** linking to `project.path` (always present).
  - Footer shows **Visit site ↗** linking to `project.url`, only when `url !== '#'`.

## Detail route (`app/pages/projects/[slug].vue`) — new

- Query the project by path (`/projects/<slug>`); if not found, `throw createError(404)`
  (matching the pattern in `projects.vue` and `about.vue`).
- Render a header: image, title, tags, formatted date, a "Visit site ↗" button when a
  real URL exists, and a "← Back to projects" link. Optionally show the category as a
  small label.
- Render the markdown body with `<ContentRenderer :value="project" />`.
- Set `useSeoMeta` (title/description from the project) and `defineOgImage`, mirroring the
  existing pages.

## Error handling

- Unknown slug → `createError({ statusCode: 404, fatal: true })`, consistent with existing
  pages.
- Missing/`"#"` external URL → no "Visit site" link/button rendered (never a dead link).

## Testing / verification

The repo has no automated test setup. Verification is:

1. `npm run typecheck` passes.
2. Dev-server smoke check: `/projects` shows Personal and Professional sections with two
   footer links per card; each detail page renders its body; the external link only shows
   for projects with a real URL; an unknown slug 404s.
