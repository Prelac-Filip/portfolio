# Project Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every project a `/projects/<slug>` detail page with a markdown body, split the `/projects` listing into Personal and Professional sections, and give each card two footer links (internal "View details", external "Visit site").

**Architecture:** Convert the existing `projects` Nuxt Content collection from `type: 'data'` (`*.yml`) to `type: 'page'` (`*.md`) so each project gains a routable `path` and a rendered `body`. Migrate the 7 project files to markdown with a new `category` field. Extract the listing card into a `ProjectCard.vue` component reused by two category sections. Add a hand-written dynamic route `app/pages/projects/[slug].vue` that queries a project by path and renders it (the repo has no content catch-all — every page is hand-written).

**Tech Stack:** Nuxt 3, @nuxt/content v3 (`queryCollection`, `<ContentRenderer>`), @nuxt/ui v4.9 (`UPage`, `UPageHero`, `UPageSection`, `UPageCard`, `UButton`, `ULink`, `UBadge`), TypeScript, `Motion` (motion-v).

**Note on testing:** This repo has **no automated test framework** (no vitest/jest/playwright config, no `test` script in `package.json`). Verification is therefore `npm run typecheck` (which runs `nuxt prepare`, regenerating content types) plus a dev-server smoke check. Steps reflect this instead of TDD red/green.

---

## Spec reference

Design spec: `docs/superpowers/specs/2026-07-17-project-detail-pages-design.md`

**Categorization (final):**

| Project (file) | category |
|---|---|
| `scoundrel` | Personal |
| `fitbud` | Personal |
| `hala-centar` | Personal |
| `booking-manager` | Professional |
| `serapion-web` | Professional |
| `scayle` | Professional |
| `qartora` | Professional |

Section order on the listing: **Personal first, then Professional.** Within each section, sort by `date` descending.

---

## Task 1: Convert the `projects` collection to a page collection

**Files:**
- Modify: `content.config.ts` (the `projects` collection, currently lines ~85-96)

- [ ] **Step 1: Update the collection definition**

Replace the existing `projects` collection block:

```ts
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        image: z.string().nonempty().editor({ input: 'media' }),
        url: z.string().nonempty(),
        tags: z.array(z.string()),
        date: z.date()
      })
    }),
```

with:

```ts
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        image: z.string().nonempty().editor({ input: 'media' }),
        url: z.string().nonempty(),
        tags: z.array(z.string()),
        date: z.date(),
        category: z.enum(['Personal', 'Professional'])
      })
    }),
```

Leave the `pages` collection (which sources `projects.yml` for the `/projects` hero) untouched — it is a different collection and does not conflict.

- [ ] **Step 2: Commit**

```bash
git add content.config.ts
git commit -m "feat: convert projects collection to page type with category"
```

(Typecheck happens after the content files exist — see Task 2. Running it now would fail because the `.md` sources don't exist yet.)

---

## Task 2: Migrate the 7 project files from YAML to Markdown

**Files:**
- Delete: `content/projects/*.yml` (all 7)
- Create: `content/projects/*.md` (all 7, below)

Each `.md` file keeps its existing frontmatter fields, adds `category`, and gets a seeded body (Overview/What I did placeholders + a real Stack line from the tags). The `description` is shown in the detail hero, so the body does **not** repeat it.

- [ ] **Step 1: Delete the old YAML files**

```bash
git rm content/projects/booking-manager.yml content/projects/fitbud.yml content/projects/hala-centar.yml content/projects/qartora.yml content/projects/scayle.yml content/projects/scoundrel.yml content/projects/serapion-web.yml
```

- [ ] **Step 2: Create `content/projects/booking-manager.md`**

```markdown
---
title: Booking Manager
description: "Developed and maintained various application systems, including REST and SOAP APIs, desktop applications, web apps, and custom client websites. Started leading a team of three developers, structured a QA testing environment for key system features, and designed an automated billing system for existing clients. Afterwards organized sprints and Jira tasks for the whole development department during a new version release. Conducted technical meetings to align implementation design with client requirements for new integrations."
image: /projects/Booking_manager.jpg
url: "https://www.booking-manager.com/"
tags: [Java 8, JSP, Plain JS, Bootstrap 5, Vue.js, REST, SOAP, Testmonitor]
date: 2022-07-04
category: Professional
---

## Overview

[Placeholder — a longer write-up about this project to be added.]

## What I did

[Placeholder — key contributions and responsibilities to be added.]

## Stack

Built with Java 8, JSP, Plain JS, Bootstrap 5, Vue.js, REST, SOAP, Testmonitor.
```

- [ ] **Step 3: Create `content/projects/serapion-web.md`**

```markdown
---
title: Serapion web
description: "The web for Serapion, where content is managed through the Filament CMS, and PHP. Debugging, bug-fixing, and improving the CMS possibilites for ease of use."
image: /projects/Serapion_web.png
url: "#"
tags: [PHP, Laravel, Filament]
date: 2026-03-01
category: Professional
---

## Overview

[Placeholder — a longer write-up about this project to be added.]

## What I did

[Placeholder — key contributions and responsibilities to be added.]

## Stack

Built with PHP, Laravel, Filament.
```

- [ ] **Step 4: Create `content/projects/scayle.md`**

```markdown
---
title: Scayle Middlewares
description: "Working on several middlewares that are using Scayle. Introducing new features, bugfixing, and script running on the servers"
image: /projects/SCAYLE.png
url: "#"
tags: [PHP, Symphony, Laravel]
date: 2026-02-01
category: Professional
---

## Overview

[Placeholder — a longer write-up about this project to be added.]

## What I did

[Placeholder — key contributions and responsibilities to be added.]

## Stack

Built with PHP, Symphony, Laravel.
```

- [ ] **Step 5: Create `content/projects/qartora.md`**

```markdown
---
title: Qartora
description: "An AI first multi-tenant application, using WhatsApp/Instagram as an entry point, and Shopify to pull products and display them to users based on their needs/queries. "
image: /projects/qartora-logo.svg
url: "https://qartora.com/"
tags: [React, NestJS, Next.js, PostgreSQL, Vercel SDK, TypeORM]
date: 2026-02-01
category: Professional
---

## Overview

[Placeholder — a longer write-up about this project to be added.]

## What I did

[Placeholder — key contributions and responsibilities to be added.]

## Stack

Built with React, NestJS, Next.js, PostgreSQL, Vercel SDK, TypeORM.
```

- [ ] **Step 6: Create `content/projects/scoundrel.md`**

```markdown
---
title: Scoundrel
description: "A single-player card game built in Godot with GDScript. Made some assets my self using Photoshop and Kenney Shape. Note: it was built for mobile devices, but still functions normally on the web!"
image: /projects/placeholder.svg
url: "https://scoundrel.prelac.dev"
tags: [Godot, GDScript]
date: 2025-03-01
category: Personal
---

## Overview

[Placeholder — a longer write-up about this project to be added.]

## What I did

[Placeholder — key contributions and responsibilities to be added.]

## Stack

Built with Godot, GDScript.
```

- [ ] **Step 7: Create `content/projects/hala-centar.md`** (description updated to note it was a solo commissioned job)

```markdown
---
title: Hala Centar
description: "A website for a training center — a commissioned project I designed and built on my own in Nuxt.js. Mostly static, with a few SSR pages for guests to enter their desired plans and details, which are then emailed to the client. Nuxt.js was chosen because of a planned backend for the site in the future."
image: /projects/Hala_centar.png
url: "https://halacentar.com/"
tags: [Nuxt.js, Vue.js, Nuxt UI]
date: 2025-10-15
category: Personal
---

## Overview

[Placeholder — a longer write-up about this project to be added.]

## What I did

[Placeholder — key contributions and responsibilities to be added.]

## Stack

Built with Nuxt.js, Vue.js, Nuxt UI.
```

- [ ] **Step 8: Create `content/projects/fitbud.md`** (no tags, no real URL yet)

```markdown
---
title: Fitbud
description: "[Placeholder — project description to be added.]"
image: /projects/placeholder.svg
url: "#"
tags: []
date: 2023-06-01
category: Personal
---

## Overview

[Placeholder — a longer write-up about this project to be added.]

## What I did

[Placeholder — key contributions and responsibilities to be added.]

## Stack

[Placeholder — tech stack to be added.]
```

- [ ] **Step 9: Regenerate types and typecheck**

Run: `npm run typecheck`
Expected: PASS (exit 0). `nuxt prepare` regenerates the `ProjectsCollectionItem` type to include `category`, `path`, and `body`. If it fails, read the error — a common cause is a malformed frontmatter date or a `category` value not matching the enum.

- [ ] **Step 10: Commit**

```bash
git add content/projects
git commit -m "feat: migrate projects to markdown with category and seeded bodies"
```

---

## Task 3: Extract a reusable `ProjectCard` component

**Files:**
- Create: `app/components/ProjectCard.vue`

This encapsulates the Motion wrapper + `UPageCard` + the two footer links, so both category sections reuse it (DRY). It mirrors the current card markup in `app/pages/projects.vue:66-116`, with the whole-card `:to` removed and a second link added.

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

defineProps<{
  project: ProjectsCollectionItem
  index: number
}>()
</script>

<template>
  <Motion
    :initial="{ opacity: 0, transform: 'translateY(10px)' }"
    :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
    :transition="{ delay: 0.2 * index }"
    :in-view-options="{ once: true }"
  >
    <UPageCard
      :title="project.title"
      :description="project.description"
      orientation="horizontal"
      variant="naked"
      :reverse="index % 2 === 1"
      class="group"
      :ui="{
        wrapper: 'max-sm:order-last'
      }"
    >
      <template #leading>
        <span class="text-sm text-muted">
          {{ new Date(project.date).getFullYear() }}
        </span>
      </template>
      <template #footer>
        <div class="flex items-center gap-4">
          <ULink
            :to="project.path"
            class="text-sm text-primary flex items-center"
          >
            View details
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
            />
          </ULink>
          <ULink
            v-if="project.url !== '#'"
            :to="project.url"
            target="_blank"
            class="text-sm text-muted flex items-center gap-1 hover:text-default"
          >
            Visit site
            <UIcon
              name="i-lucide-external-link"
              class="size-4"
            />
          </ULink>
        </div>
      </template>
      <img
        :src="project.image"
        :alt="project.title"
        class="object-cover w-full h-48 rounded-lg"
      >
    </UPageCard>
  </Motion>
</template>
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS. (Component is not yet referenced, but it must type-check on its own.)

- [ ] **Step 3: Commit**

```bash
git add app/components/ProjectCard.vue
git commit -m "feat: add ProjectCard component with detail and external links"
```

---

## Task 4: Split the listing page into Personal and Professional sections

**Files:**
- Modify: `app/pages/projects.vue` (script: add computeds; template: replace the single `UPageSection` project loop at lines ~61-117)

- [ ] **Step 1: Add category computeds to the `<script setup>` block**

After the existing `projects` `useAsyncData` call (around line 15), add:

```ts
const byCategory = (category: 'Personal' | 'Professional') =>
  (projects.value ?? [])
    .filter(project => project.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const personalProjects = computed(() => byCategory('Personal'))
const professionalProjects = computed(() => byCategory('Professional'))
```

(`computed` is auto-imported by Nuxt.)

- [ ] **Step 2: Replace the single project section in the template**

Replace the entire `<UPageSection>` that loops projects (currently lines ~61-117, from `<UPageSection` with `container: 'pt-0!'` through its closing `</UPageSection>`) with two sections:

```vue
    <UPageSection
      title="Personal"
      :ui="{
        container: 'pt-0!',
        title: 'text-left text-xl'
      }"
    >
      <ProjectCard
        v-for="(project, index) in personalProjects"
        :key="project.path"
        :project="project"
        :index="index"
      />
    </UPageSection>
    <UPageSection
      title="Professional"
      :ui="{
        title: 'text-left text-xl'
      }"
    >
      <ProjectCard
        v-for="(project, index) in professionalProjects"
        :key="project.path"
        :project="project"
        :index="index"
      />
    </UPageSection>
```

`ProjectCard` is auto-imported from `app/components/`. The old inline `Motion`/`UPageCard`/`img` markup is fully replaced by these two loops.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/pages/projects.vue
git commit -m "feat: group projects into Personal and Professional sections"
```

---

## Task 5: Add the project detail route

**Files:**
- Create: `app/pages/projects/[slug].vue`

Routes like `/projects/booking-manager` resolve here. It queries the `projects` collection by the current path, 404s if missing, renders a hero + image + tags + markdown body, and sets SEO/OG meta using the same pattern as `app/pages/projects.vue:19-29`.

- [ ] **Step 1: Create the page**

```vue
<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () => {
  return queryCollection('projects').path(route.path).first()
})

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
    fatal: true
  })
}

const title = project.value.title
const description = project.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })
</script>

<template>
  <UPage v-if="project">
    <UPageHero
      :title="project.title"
      :description="project.description"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div class="flex items-center gap-2">
          <UButton
            to="/projects"
            variant="ghost"
            color="neutral"
            icon="i-lucide-arrow-left"
            label="Back to projects"
          />
          <UButton
            v-if="project.url !== '#'"
            :to="project.url"
            target="_blank"
            trailing-icon="i-lucide-external-link"
            label="Visit site"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <img
        :src="project.image"
        :alt="project.title"
        class="object-cover w-full max-h-96 rounded-lg mb-8"
      >
      <div
        v-if="project.tags?.length"
        class="flex flex-wrap gap-2 mb-8"
      >
        <UBadge
          v-for="tag in project.tags"
          :key="tag"
          :label="tag"
          variant="subtle"
          color="neutral"
        />
      </div>
      <ContentRenderer
        :value="project"
        class="prose prose-primary dark:prose-invert max-w-none"
      />
    </UPageSection>
  </UPage>
</template>
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/pages/projects/[slug].vue
git commit -m "feat: add project detail page route"
```

---

## Task 6: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server boots without errors; no "collection not found" or schema errors in the console.

- [ ] **Step 2: Verify the listing page**

Open `http://localhost:3000/projects`. Confirm:
- A **Personal** section appears first (Hala Centar, Scoundrel, Fitbud — newest first: Hala Centar 2025-10, Scoundrel 2025-03, Fitbud 2023-06), then a **Professional** section (Serapion web 2026-03, Scayle 2026-02, Qartora 2026-02, Booking Manager 2022-07).
- Each card shows **"View details →"**. Cards with a real URL also show **"Visit site ↗"**; Fitbud, Scayle, and Serapion web (url `"#"`) show only "View details".
- Clicking the card body does nothing (no longer a link).

- [ ] **Step 3: Verify a detail page**

Click "View details" on Booking Manager (or open `http://localhost:3000/projects/booking-manager`). Confirm:
- Title + description hero, "Back to projects" and "Visit site" buttons, image, tag badges, and the rendered markdown body (Overview / What I did / Stack headings).
- Open a `"#"`-URL project detail (e.g. `/projects/serapion-web`): no "Visit site" button.

- [ ] **Step 4: Verify 404**

Open `http://localhost:3000/projects/does-not-exist`.
Expected: the app's 404 error page (from `createError`), not a blank/crash.

- [ ] **Step 5: Final typecheck**

Run: `npm run typecheck`
Expected: PASS (exit 0).

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: no errors in the changed/created files. Fix any reported issues (e.g. run `npm run lint:fix`) and re-run.

---

## Self-review notes

- **Spec coverage:** detail pages (Task 5), markdown content model (Tasks 1-2), two footer links (Task 3), Personal/Professional split + Personal-first + date-desc ordering (Tasks 2, 4), Hala Centar → Personal with solo-commission wording (Task 2 Step 7), 404 handling (Task 5), verification (Task 6). All spec sections mapped.
- **Type consistency:** `ProjectsCollectionItem` used in `ProjectCard.vue` matches the collection name `projects`; `project.path`, `project.category`, `project.url`, `project.tags`, `project.date` all exist on the page-collection item after Task 1. `byCategory` / `personalProjects` / `professionalProjects` names are consistent between Task 4 script and template.
- **Rendering choice:** `<ContentRenderer :value="project" />` is the correct component for a page-collection markdown body (the repo's `<MDC>` usage is for a yaml `content` string field, not a `.md` body).
- **No placeholders in the plan itself:** the only `[Placeholder …]` strings are intentional seeded body copy in the content files (an explicit spec non-goal), not gaps in the plan.
