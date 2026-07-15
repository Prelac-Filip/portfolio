# Filip Prelac Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Nuxt UI "portfolio" template from the fictional designer "Emma Thompson" into Filip Prelac's developer portfolio (job-hunting + technical showcase).

**Architecture:** This is a content-and-config transformation of a working Nuxt 4 + Nuxt UI + Nuxt Content template. Nearly all work is YAML content, the Zod content schema (`content.config.ts`), one new Vue component (`Skills.vue`), small edits to existing components, and deletions of the Blog/Speaking features. Content is validated against the schema at build time, so schema and content changes must land together.

**Tech Stack:** Nuxt 4, @nuxt/ui v4, @nuxt/content v3 (Zod schemas), @nuxt/image, motion-v, nuxt-og-image, pnpm.

---

## Notes for the implementer

- **No unit-test framework exists** in this template. The verification gate for each task is: `pnpm typecheck`, `pnpm lint`, and — for content/schema changes — `pnpm build` (which validates every content collection against its schema and prerenders `/`). A clean build is the "green test."
- `pnpm build` is the authoritative check but slow (~30–60s). Run `pnpm typecheck` + `pnpm lint` after every task; run `pnpm build` after content/schema tasks and at the end.
- Work happens on the existing branch `feat/filip-portfolio-content`.
- Placeholders in content (testimonial quotes, project descriptions, portrait, CV) are **intentional and expected** per the spec — they are clearly marked `[Placeholder — ...]` for Filip to fill later. Do not invent fake quotes or fake project details.

## File structure (what changes)

**Create:**
- `app/components/landing/Skills.vue` — renders the new Skills/Tech-Stack section.
- `content/projects/{booking-manager,qartora,scayle,fitbud,hala-centar,serapion-web,scoundrel}.yml` — 7 project entries.
- `public/projects/placeholder.svg` — shared placeholder card image.

**Modify:**
- `content.config.ts` — add `skills` schema, drop `blog`, drop `hero.images`, change `experience.date` to string, remove `blog`/`speaking` collections.
- `content/index.yml` — full rewrite.
- `content/projects.yml` — rewrite page header.
- `content/about.yml` — rewrite bio + images.
- `app/pages/index.vue` — drop `LandingBlog`, add `LandingSkills`, fix OG image.
- `app/components/landing/Hero.vue` — remove image marquee, relabel availability button.
- `app/app.config.ts` — identity, email, links, footer.
- `app/utils/links.ts` — remove Blog/Speaking nav.
- `app/components/OgImage/Portfolio.takumi.vue` — replace Nuxt branding with Filip's.

**Delete:**
- `content/blog.yml`, `content/blog/*.md`, `content/speaking.yml`
- `content/projects/{bloom-finance,ecotrack,internal-developer-hub,wavelength-music}.yml`
- `app/components/landing/Blog.vue`
- `app/pages/blog/index.vue`, `app/pages/blog/[...slug].vue`, `app/pages/speaking.vue`

---

## Task 1: Remove Blog & Speaking features

**Files:**
- Modify: `content.config.ts`
- Modify: `app/pages/index.vue`
- Modify: `app/utils/links.ts`
- Delete: `app/components/landing/Blog.vue`, `app/pages/blog/index.vue`, `app/pages/blog/[...slug].vue`, `app/pages/speaking.vue`, `content/blog.yml`, `content/speaking.yml`, `content/blog/*.md`

- [ ] **Step 1: Delete the Blog & Speaking files**

```bash
rm -rf app/pages/blog app/pages/speaking.vue app/components/landing/Blog.vue \
       content/blog content/blog.yml content/speaking.yml
```

- [ ] **Step 2: Remove the `blog` and `speaking` collections and the `blog` include from `content.config.ts`**

In `content.config.ts`, delete the entire `blog: defineCollection({...})` block and the entire `speaking: defineCollection({...})` block. Change the `pages` collection's source from:

```ts
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'projects.yml' },
        { include: 'blog.yml' }
      ],
      schema: z.object({
        links: z.array(createButtonSchema())
      })
    }),
```

to:

```ts
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'projects.yml' }
      ],
      schema: z.object({
        links: z.array(createButtonSchema())
      })
    }),
```

Also, in the `index` collection schema, remove the line `blog: createBaseSchema(),`.

- [ ] **Step 3: Remove `LandingBlog` from the homepage**

In `app/pages/index.vue`, delete the line `<LandingBlog :page />` from the template (between the two-column `UPageSection` and `<LandingTestimonials :page />`).

- [ ] **Step 4: Remove Blog & Speaking from navigation**

Replace the entire contents of `app/utils/links.ts` with:

```ts
import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about'
}]
```

- [ ] **Step 5: Verify typecheck, lint, and build pass**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed. Build completes with no "cannot find route /blog" or schema errors. (`content/index.yml` still holds the old `blog:` key — that's fine; Zod strips unknown keys.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: remove blog and speaking features"
```

---

## Task 2: Update content schema and rewrite the homepage content

Schema and `index.yml` must change together so the content validates. This task defines the new `skills` schema, switches `experience.date` to a string (to allow ranges), drops `hero.images`, and rewrites `content/index.yml` with Filip's real content.

**Files:**
- Modify: `content.config.ts`
- Modify: `content/index.yml`

- [ ] **Step 1: Update the `index` collection schema in `content.config.ts`**

Replace the whole `index: defineCollection({...})` block with:

```ts
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        hero: z.object({
          links: z.array(createButtonSchema())
        }),
        about: createBaseSchema(),
        skills: z.object({
          title: z.string(),
          description: z.string().optional(),
          categories: z.array(z.object({
            title: z.string(),
            items: z.array(z.object({
              label: z.string(),
              core: z.boolean().optional()
            }))
          }))
        }),
        experience: createBaseSchema().extend({
          items: z.array(z.object({
            date: z.string(),
            position: z.string(),
            company: z.object({
              name: z.string(),
              url: z.string(),
              logo: z.string().editor({ input: 'icon' }),
              color: z.string()
            })
          }))
        }),
        testimonials: z.array(createTestimonialSchema()),
        faq: createBaseSchema().extend({
          categories: z.array(
            z.object({
              title: z.string().nonempty(),
              questions: z.array(
                z.object({
                  label: z.string().nonempty(),
                  content: z.string().nonempty()
                })
              )
            }))
        })
      })
    }),
```

(Compared to the original: added `skills`, removed `hero.images`, removed `blog`, changed `experience.items[].date` from `z.date()` to `z.string()`.)

- [ ] **Step 2: Rewrite `content/index.yml` in full**

Replace the entire file with:

```yaml
seo:
  title: "Filip Prelac - Software Developer"
  description: "Filip Prelac — software developer and former team lead. Java (Spring & Jakarta EE), Vue/Nuxt and Flutter, plus Laravel, React/Next and Playwright. Building backends and apps, and leading teams."
title: "Hey, I'm Filip Prelac Software Developer"
description: "I build across the whole stack — Java backends, Vue/Nuxt and Flutter apps — and I've led a team through it. Focused on clean code, solid QA, and shipping things that work."
hero:
  links:
    - label: "Get in touch"
      to: "mailto:prelacfilip@gmail.com"
      color: "neutral"
about:
  title: "About Me"
  description: |
    I'm a software developer who enjoys working across the whole stack, from Java backends to Vue and Flutter front ends. I started as a junior at Booking Manager and grew into a Team Lead, mentoring juniors and working directly with clients. Today I'm a Mid Software Engineer at Serapion.
skills:
  title: Skills & Tech Stack
  description: The tools I reach for most. Highlighted ones are my core strengths; the rest I have solid working experience with.
  categories:
    - title: Backend
      items:
        - label: Java
          core: true
        - label: Spring
          core: true
        - label: Jakarta EE
          core: true
        - label: Laravel
        - label: NestJS
        - label: REST / SOAP
    - title: Frontend & Mobile
      items:
        - label: Vue / Nuxt
          core: true
        - label: Flutter
          core: true
        - label: React / Next
    - title: Databases
      items:
        - label: PostgreSQL
        - label: MySQL
    - title: Tools & QA
      items:
        - label: Git
        - label: Jira
        - label: Playwright
        - label: QA flows & practices
    - title: Leadership
      items:
        - label: Team leadership
        - label: Mentoring
        - label: Sprint planning
        - label: Client communication
experience:
  title: Work Experience
  items:
    - date: "2026 — Present"
      position: "Mid Software Engineer at"
      company:
        name: Serapion
        logo: "i-lucide-code-xml"
        url: "https://serapion.net"
        color: "#3B82F6"
    - date: "Mar 2024 — Feb 2026"
      position: "Team Lead at"
      company:
        name: Booking Manager
        logo: "i-lucide-ship"
        url: "https://www.booking-manager.com"
        color: "#0EA5E9"
    - date: "Jul 2022 — Mar 2024"
      position: "Junior Software Developer at"
      company:
        name: Booking Manager
        logo: "i-lucide-ship"
        url: "https://www.booking-manager.com"
        color: "#0EA5E9"
testimonials:
  - quote: "[Placeholder — real quote to be added.]"
    author:
      name: "Matija Varjačić"
      description: "[Role — to be added]"
  - quote: "[Placeholder — real quote to be added.]"
    author:
      name: "Dominik Marčić"
      description: "[Role — to be added]"
  - quote: "[Placeholder — real quote to be added.]"
    author:
      name: "Kristijan Vidović"
      description: "[Role — to be added]"
  - quote: "[Placeholder — real quote to be added.]"
    author:
      name: "Alen Dedić"
      description: "[Role — to be added]"
faq:
  title: Frequently Asked Questions
  description: A bit about how I work and what I'm looking for.
  categories:
    - title: How I work
      questions:
        - label: What's your working style as a developer?
          content: |
            I like understanding the "why" behind a task before writing code, keeping changes small and reviewable, and leaning on tests and QA so things don't break later. I'm comfortable owning a feature end to end, from the database to the UI.
        - label: You've led a team — how does that show up in your work?
          content: |
            As Team Lead at Booking Manager I mentored juniors, organised sprints in Jira, ran daily meetings, and handled direct client communication. That experience makes me a stronger collaborator: I think about the whole team's workflow, not just my own tickets.
        - label: How do you approach code quality and QA?
          content: |
            I treat QA as part of development rather than an afterthought — writing tests (including end-to-end with Playwright), reviewing my own diffs critically, and catching edge cases before they reach production.
    - title: Tech
      questions:
        - label: What are you strongest in?
          content: |
            My core strengths are Java (Spring and Jakarta EE) on the backend and Vue/Nuxt and Flutter on the front end. I also have solid working experience with Laravel, React/Next, and Playwright.
        - label: What are you currently learning?
          content: |
            I'm always expanding my stack — most recently through professional work with React, NestJS, and Laravel, and personal projects like a game built in Godot with GDScript.
    - title: Working together
      questions:
        - label: Are you open to new opportunities?
          content: |
            Yes — I'm open to interesting roles and projects. The quickest way to reach me is by email or on LinkedIn.
        - label: Where are you based and do you work remotely?
          content: |
            [Placeholder — location and remote/on-site preference to be added.]
```

- [ ] **Step 3: Verify build passes**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed. No schema-validation errors for `index.yml`. (The homepage won't render the Skills data yet — that component comes in Task 3 — but the content validates.)

- [ ] **Step 4: Commit**

```bash
git add content.config.ts content/index.yml
git commit -m "feat: rewrite homepage content and add skills schema"
```

---

## Task 3: Build the Skills section component

**Files:**
- Create: `app/components/landing/Skills.vue`
- Modify: `app/pages/index.vue`

- [ ] **Step 1: Create `app/components/landing/Skills.vue`**

```vue
<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.skills.title"
    :description="page.skills.description"
    :ui="{
      container: 'p-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2 text-left'
    }"
  >
    <div class="flex flex-col gap-6">
      <Motion
        v-for="(category, index) in page.skills.categories"
        :key="category.title"
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 * index }"
        :in-view-options="{ once: true }"
      >
        <h3 class="text-xs uppercase tracking-wider text-muted mb-2">
          {{ category.title }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="skill in category.items"
            :key="skill.label"
            :label="skill.label"
            :color="skill.core ? 'primary' : 'neutral'"
            :variant="skill.core ? 'soft' : 'outline'"
            size="lg"
          />
        </div>
      </Motion>
    </div>
  </UPageSection>
</template>
```

- [ ] **Step 2: Add `LandingSkills` to `app/pages/index.vue`**

In the template, insert `<LandingSkills :page />` immediately after the two-column `UPageSection` (the one containing `LandingAbout` and `LandingWorkExperience`) and before `<LandingTestimonials :page />`. The template section should read:

```vue
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      :ui="{
        container: 'pt-0! lg:grid lg:grid-cols-2 lg:gap-8'
      }"
    >
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </UPageSection>
    <LandingSkills :page />
    <LandingTestimonials :page />
    <LandingFAQ :page />
  </UPage>
```

- [ ] **Step 3: Verify build passes and Skills renders**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed.

Then run `pnpm dev`, open `http://localhost:3000`, and confirm the "Skills & Tech Stack" section appears after Work Experience, with 5 category groups and core skills (Java, Spring, Jakarta EE, Vue/Nuxt, Flutter) visually emphasized (soft primary) vs. the rest (outline). Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add app/components/landing/Skills.vue app/pages/index.vue
git commit -m "feat: add skills and tech stack section"
```

---

## Task 4: Simplify the Hero (portrait + headline + CTAs)

Remove the scattered image marquee and relabel the availability button. The avatar, title, description, and links stay.

**Files:**
- Modify: `app/components/landing/Hero.vue`

- [ ] **Step 1: Remove the image marquee**

In `app/components/landing/Hero.vue`, delete the entire `<UMarquee ...> ... </UMarquee>` block (the block that iterates `page.hero.images` and renders `<NuxtImg>`). It is the last child inside `<UPageHero>`.

- [ ] **Step 2: Relabel the availability button**

In the same file, find the availability `UButton` and change its `:label` from:

```vue
            :label="global.available ? 'Available for new projects' : 'Not available at the moment'"
```

to:

```vue
            :label="global.available ? 'Open to opportunities' : 'Not available at the moment'"
```

- [ ] **Step 3: Verify build passes and hero renders without the marquee**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed with no reference to `page.hero.images` remaining (that field no longer exists in the schema after Task 2, so a leftover reference would fail typecheck).

Then run `pnpm dev`, open `http://localhost:3000`, and confirm the hero shows the avatar, name, pitch, a "Get in touch" button, an "Open to opportunities" button, and social icons — and **no** photo strip. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/components/landing/Hero.vue
git commit -m "feat: simplify hero to portrait and headline layout"
```

---

## Task 5: Update site identity and links (`app.config.ts`)

**Files:**
- Modify: `app/app.config.ts`

- [ ] **Step 1: Update the `global` block**

Replace the `global: {...}` object with:

```ts
  global: {
    picture: {
      dark: 'https://ui-avatars.com/api/?name=Filip+Prelac&size=256&background=1f2937&color=ffffff',
      light: 'https://ui-avatars.com/api/?name=Filip+Prelac&size=256&background=e5e7eb&color=111827',
      alt: 'Filip Prelac'
    },
    meetingLink: 'https://www.linkedin.com/in/prelacfilip',
    email: 'prelacfilip@gmail.com',
    available: true
  },
```

(The `ui-avatars.com` URLs are an initials-avatar placeholder until Filip provides a portrait. `meetingLink` powers the "Open to opportunities" button → LinkedIn.)

- [ ] **Step 2: Update the `footer` block**

Replace the `footer: {...}` object with:

```ts
  footer: {
    credits: `© ${new Date().getFullYear()} Filip Prelac`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/Prelac-Filip',
      'target': '_blank',
      'aria-label': 'Filip Prelac on GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/prelacfilip',
      'target': '_blank',
      'aria-label': 'Filip Prelac on LinkedIn'
    }]
  }
```

(Leave the `ui:` block — including `colors.primary: 'blue'` — unchanged.)

- [ ] **Step 3: Verify build passes**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed.

Then run `pnpm dev` and confirm: hero + footer social icons are GitHub and LinkedIn (pointing to Filip's profiles), the footer credit reads "© <year> Filip Prelac", and the "Open to opportunities" button links to LinkedIn. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/app.config.ts
git commit -m "feat: update site identity, email, and social links"
```

---

## Task 6: Rebuild the Projects page content

Replace the 4 template projects with 7 of Filip's, and update the projects-page header. Project cards render title, description, year, image, and link (tags are stored but not displayed by `projects.vue`).

**Files:**
- Create: `public/projects/placeholder.svg`
- Create: `content/projects/{booking-manager,qartora,scayle,fitbud,hala-centar,serapion-web,scoundrel}.yml`
- Delete: `content/projects/{bloom-finance,ecotrack,internal-developer-hub,wavelength-music}.yml`
- Modify: `content/projects.yml`

- [ ] **Step 1: Delete the template projects**

```bash
rm content/projects/bloom-finance.yml content/projects/ecotrack.yml \
   content/projects/internal-developer-hub.yml content/projects/wavelength-music.yml
```

- [ ] **Step 2: Create the placeholder card image `public/projects/placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" role="img" aria-label="Project image coming soon">
  <rect width="640" height="360" fill="#1f2937"/>
  <text x="50%" y="50%" fill="#9ca3af" font-family="sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">Image coming soon</text>
</svg>
```

- [ ] **Step 3: Create the 7 project files**

`content/projects/booking-manager.yml`:

```yaml
title: Booking Manager
description: "[Placeholder — description of my work on Booking Manager to be added.]"
image: /projects/placeholder.svg
url: "#"
tags: []
date: 2024-01-01
```

`content/projects/qartora.yml`:

```yaml
title: Qartora
description: "[Placeholder — project description to be added.]"
image: /projects/placeholder.svg
url: "#"
tags: []
date: 2025-01-01
```

`content/projects/scayle.yml`:

```yaml
title: Scayle
description: "[Placeholder — project description to be added.]"
image: /projects/placeholder.svg
url: "#"
tags: []
date: 2025-06-01
```

`content/projects/fitbud.yml`:

```yaml
title: Fitbud
description: "[Placeholder — project description to be added.]"
image: /projects/placeholder.svg
url: "#"
tags: []
date: 2023-06-01
```

`content/projects/hala-centar.yml`:

```yaml
title: Hala Centar
description: "[Placeholder — project description to be added.]"
image: /projects/placeholder.svg
url: "#"
tags: []
date: 2023-01-01
```

`content/projects/serapion-web.yml`:

```yaml
title: Serapion web
description: "[Placeholder — project description to be added.]"
image: /projects/placeholder.svg
url: "#"
tags: []
date: 2026-03-01
```

`content/projects/scoundrel.yml`:

```yaml
title: Scoundrel
description: "A single-player card game built in Godot with GDScript. [Placeholder — expand description and add a link.]"
image: /projects/placeholder.svg
url: "#"
tags:
  - Godot
  - GDScript
date: 2025-03-01
```

- [ ] **Step 4: Rewrite the projects-page header `content/projects.yml`**

```yaml
title: Projects
description: A mix of professional work and personal projects — the products I've helped build and the things I've made for fun.
links:
  - label: "Get in touch"
    color: "neutral"
  - label: "Email me"
```

- [ ] **Step 5: Verify build passes and projects render**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed. No schema errors for the `projects` collection (every file has the required `title`, `description`, `image`, `url`, `tags`, `date`).

Then run `pnpm dev`, open `http://localhost:3000/projects`, and confirm 7 project cards render (Booking Manager, Qartora, Scayle, Fitbud, Hala Centar, Serapion web, Scoundrel) with the placeholder image and correct years. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add -A content/projects content/projects.yml public/projects
git commit -m "feat: rebuild projects with Filip's work and Scoundrel"
```

---

## Task 7: Rewrite the About page content

**Files:**
- Modify: `content/about.yml`

- [ ] **Step 1: Rewrite `content/about.yml`**

Replace the entire file with (reusing two existing hero images as placeholders so the polaroids aren't broken):

```yaml
title: About Me
description: More about Filip Prelac — a software developer who grew from junior to team lead, working across Java, Vue, Flutter and more.
content: |
  Hi, I'm **Filip Prelac**, a software developer who enjoys working across the whole stack — from Java backends to Vue and Flutter front ends.

  My journey started at **Booking Manager**, where I joined in 2022 as a Junior Software Developer working on a Java backend (Java 8, JSP, Velocity, MySQL, REST and SOAP). Within two years I grew into a **Team Lead** role — mentoring junior developers, organising sprints in Jira, running daily meetings, and communicating directly with clients, while expanding onto the front end with Vue.

  ### What I do

  Today I'm a **Mid Software Engineer at Serapion**, working with React, NestJS, Laravel, Playwright and Filament. My core strengths are **Java (Spring & Jakarta EE)** and **Vue/Nuxt and Flutter**, and I'm comfortable jumping into Laravel, React/Next, or Playwright when a project calls for it.

  ### How I work

  I care about clean, maintainable code and treat QA as part of development rather than an afterthought. Having led a team, I think about the whole workflow — not just my own tickets — and I enjoy helping other developers grow.

  ### Beyond work

  _(Placeholder: location, hobbies, and personal interests — to refine.)_

  Thanks for stopping by. Feel free to browse my [projects](/projects) or [get in touch](mailto:prelacfilip@gmail.com).
images:
  - src: /hero/random-1.avif
    alt: Placeholder image
  - src: /hero/random-2.avif
    alt: Placeholder image
```

- [ ] **Step 2: Verify build passes and About renders**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed.

Then run `pnpm dev`, open `http://localhost:3000/about`, confirm the new bio renders with headings and the two placeholder polaroid images. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add content/about.yml
git commit -m "feat: rewrite about page for Filip Prelac"
```

---

## Task 8: Fix OG image branding and homepage OG meta

**Files:**
- Modify: `app/components/OgImage/Portfolio.takumi.vue`
- Modify: `app/pages/index.vue`

- [ ] **Step 1: Replace the Nuxt branding in the OG image component**

In `app/components/OgImage/Portfolio.takumi.vue`, replace the entire footer block — from `<div class="flex items-center gap-4">` through its matching closing `</div>` (the block containing the `<svg>` Nuxt logo and the `ui.nuxt.com` text) — with:

```vue
      <div class="flex items-center gap-4">
        <span class="text-2xl font-bold text-primary-400">FP</span>
        <div class="h-px flex-1 bg-border" />
        <span class="text-xl text-dimmed">Filip Prelac</span>
      </div>
```

- [ ] **Step 2: Fix the homepage OG meta in `app/pages/index.vue`**

Replace the `useSeoMeta({...})` call (which hardcodes a Nuxt template `ogImage` URL) with the following, matching the pattern used by `projects.vue` and `about.vue`:

```ts
const title = page.value?.seo.title || page.value?.title
const description = page.value?.seo.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })
```

(Place this after the `if (!page.value) {...}` guard, replacing the existing `useSeoMeta` block.)

- [ ] **Step 3: Verify build passes and OG image generates**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: All succeed.

Then run `pnpm dev` and open `http://localhost:3000/__og-image__/image/og.png` (or `http://localhost:3000/__og-image__/`) to confirm the generated OG image shows Filip's title/description and the "FP / Filip Prelac" footer instead of Nuxt branding. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/components/OgImage/Portfolio.takumi.vue app/pages/index.vue
git commit -m "feat: update OG image branding to Filip Prelac"
```

---

## Task 9: Final full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full check suite**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: All three pass with no errors or warnings.

- [ ] **Step 2: Manual smoke test**

Run `pnpm dev` and verify:
- [ ] Homepage order: Hero (no photo marquee) → About + Work Experience (two columns) → Skills → Testimonials → FAQ.
- [ ] Hero shows avatar, "Filip Prelac" title, pitch, "Get in touch" + "Open to opportunities" buttons, and GitHub/LinkedIn icons.
- [ ] Work Experience lists all 3 roles (Serapion; Booking Manager Team Lead; Booking Manager Junior) with date ranges.
- [ ] Skills shows 5 category groups with core skills emphasized.
- [ ] Testimonials shows 4 named people with placeholder quotes.
- [ ] FAQ shows the 3 repurposed categories (How I work / Tech / Working together) — no pricing content.
- [ ] `/projects` shows 7 cards.
- [ ] `/about` renders the new bio.
- [ ] Nav shows only Home / Projects / About.
- [ ] `/blog` and `/speaking` return 404.
- [ ] No console errors referencing missing content fields.

Stop the dev server when done.

- [ ] **Step 3: Confirm no leftover template references**

Run: `grep -rniE "emma thompson|ui\.nuxt\.com|boston|ux/ui" app/ content/ || echo "clean"`
Expected: `clean` (no matches). If any match remains, fix it and re-run.

- [ ] **Step 4: Final commit (if Step 3 required fixes; otherwise skip)**

```bash
git add -A
git commit -m "chore: final portfolio cleanup and verification"
```

---

## Spec coverage check

- Sections lineup (Hero, About, Skills, Work Experience, Testimonials, FAQ) → Tasks 2, 3, 4.
- Blog & Speaking removed → Task 1.
- Skills layout B by category, core vs working → Tasks 2 (data) + 3 (component).
- Hero B portrait + CTAs → Tasks 4 + 5.
- Work Experience 3 roles, Junior→Team Lead growth → Task 2.
- Projects mix, 7 entries incl. Scoundrel (Godot/GDScript) → Task 6.
- Testimonials 4 real (placeholders) → Task 2.
- FAQ repurposed away from pricing → Task 2.
- Contact/links (GitHub, LinkedIn, prelacfilip@gmail.com) → Tasks 2 (hero link) + 5 (config).
- About bio draft → Task 7.
- OG image / branding cleanup → Task 8.
- Accent color unchanged (blue) → honored (no task touches it).
- Placeholders for portrait, CV, project details, testimonial quotes, location → intentional across Tasks 2, 5, 6, 7.
