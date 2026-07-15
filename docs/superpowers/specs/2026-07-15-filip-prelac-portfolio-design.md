# Filip Prelac Developer Portfolio — Design

**Date:** 2026-07-15
**Status:** Approved (pending spec review)

## Goal

Transform the Nuxt UI "portfolio" template (currently a fictional designer, "Emma Thompson") into **Filip Prelac's developer portfolio**. Positioning: **job hunting + technical showcase**. Emphasis on breadth of tech skills, real projects, and the Junior → Team Lead leadership story.

## Decisions (locked during brainstorming)

- **Page structure:** Home (single-page scroll) + `/about` page + `/projects` page. **Blog and Speaking are removed** entirely (pages, content, nav, components, schema, collections).
- **Skills section:** Layout **B — by category**, with core strengths tinted and working-experience items shown plain. New section, does not exist in the template.
- **Hero:** Layout **B — portrait + headline + CTAs**. Achieved by simplifying the existing hero (which is already avatar + title + description + links) and **removing the image marquee**.
- **Projects:** Mix of personal + professional. Kept on the **dedicated `/projects` page** (template-native pattern), 6 project entries. Content/links provided later → placeholders now.
- **Testimonials:** 4 **real** quotes, provided later → placeholders now, with the 4 author names in place.
- **FAQ:** Kept but **repurposed away from pricing/services** toward how-I-work / tech / availability.
- **Accent color:** Keep the template default (currently `primary: 'blue'` in `app.config.ts`). No change unless requested.

## Content facts

### Work Experience (newest first)

| Date | Position | Company | Notes |
|---|---|---|---|
| 2026 — Present | Mid Software Engineer | Serapion | React, NestJS, Laravel, Playwright, Filament |
| Mar 2024 — Feb 2026 | Team Lead | Booking Manager (MMK) | Vue + all backend, mentoring juniors, Jira/sprint org, client communication, running dailies |
| Jul 2022 — Mar 2024 | Junior Software Developer | Booking Manager (MMK) | Java 8, Velocity, JSP, plain JS, MySQL, REST, SOAP |

The two Booking Manager roles stack under the same company to make the Junior → Team Lead growth visible.

### Contact / links

- GitHub: `https://github.com/Prelac-Filip`
- LinkedIn: `https://www.linkedin.com/in/prelacfilip`
- Email (public): `prelacfilip@gmail.com`
- CV PDF: **later** (CV button omitted until provided)
- Portrait photo: **later** (placeholder avatar until provided)

### Skills (grouped, core vs working)

- **Backend:** Java *(core)*, Spring *(core)*, Jakarta EE *(core)*, Laravel *(working)*, NestJS *(working)*, REST / SOAP
- **Frontend & Mobile:** Vue / Nuxt *(core)*, Flutter *(core)*, React / Next *(working)*
- **Databases:** PostgreSQL, MySQL
- **Tools & QA:** Git, Jira, Playwright, QA flows & practices
- **Leadership:** Team leadership, Mentoring, Sprint planning, Client communication

### Projects (6, placeholders for description/stack/link/image)

Booking Manager · Qartora · Scayle · Fitbud · Hala Centar · Serapion web

### Testimonials (4, real quotes later)

Matija Varjačić · Dominik Marčić · Kristijan Vidović · Alen Dedić
(placeholder quote text + `[role — to be added]` for each)

### About / bio (draft — Filip will refine)

> Hi, I'm **Filip Prelac**, a software developer who enjoys working across the whole stack. I started at Booking Manager in 2022 as a junior on a Java backend, and within two years grew into a **Team Lead** — mentoring juniors, organising sprints in Jira, running dailies, and talking directly with clients. Today I'm a Mid Software Engineer at Serapion, working with React, NestJS and Laravel.
>
> My core strengths are **Java (Spring & Jakarta EE)** on the backend and **Vue/Nuxt and Flutter** on the front end, and I'm comfortable jumping into Laravel, React/Next, or Playwright when a project needs it. I care about clean code, solid QA practices, and shipping things that actually work for the people using them.
>
> _(Placeholder: location, hobbies, extra detail — to refine.)_

## Homepage section order

`Hero` → `[About | Work Experience]` (existing two-column block) → **`Skills`** (new) → `Testimonials` → `FAQ`

The template couples About + Work Experience in one two-column `UPageSection`; we keep that and insert Skills immediately after. (Note: this places Skills just after Work Experience rather than before — a minor refinement from the brainstorm to preserve the template's two-column block.)

## Architecture / affected files

This is a content-and-config transformation of a working template. Component logic changes are minimal; most work is YAML content, the schema, one new component, and deletions.

### New

- **`app/components/landing/Skills.vue`** — renders `page.skills`: a section title/description, then per-category groups. Each category is a heading + a wrap of chips (`UBadge`). `core: true` items use a tinted/soft primary variant; others use a neutral/outline variant. Follows the motion + `UPageSection` patterns already used by `WorkExperience.vue`.

### Modified

- **`content/index.yml`** — full rewrite: `seo`, `title`, `description`, `hero.links` (Contact / GitHub / LinkedIn), new `skills` block, `experience` (3 items), `testimonials` (4), repurposed `faq`. Remove `blog`. Remove `hero.images`.
- **`content.config.ts`**:
  - `index` schema: remove `blog`; add `skills` schema; remove `hero.images`; change `experience.items[].date` from `z.date()` to `z.string()` (to allow ranges like "Mar 2024 — Feb 2026").
  - Remove the `blog` collection and the `speaking` collection.
  - `pages` collection: drop the `blog.yml` source include (keep `projects.yml`).
  - Add `skills` to the index schema:
    ```ts
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
    })
    ```
- **`app/pages/index.vue`** — remove `<LandingBlog>`; add `<LandingSkills :page />` after the About/Work-Experience section; fix `ogImage` (stop pointing at the Nuxt template asset — use `defineOgImage('Portfolio', …)` like the other pages, or Filip's own image).
- **`app/components/landing/Hero.vue`** — remove the `<UMarquee>` image block. Keep avatar (portrait), title, description, and links. Relabel the availability button from "Available for new projects" to "Open to opportunities" (points at LinkedIn or `mailto:`).
- **`app/app.config.ts`** — `global.picture` → Filip's portrait (placeholder for now); `global.email` → `prelacfilip@gmail.com`; `global.meetingLink` → LinkedIn (or mailto); keep `available: true`. Replace `footer.links` (Discord/X/Nuxt) with **GitHub + LinkedIn**. Update `footer.credits` (drop "Built with Nuxt UI" branding → e.g. "© 2026 Filip Prelac"). Leave `ui.colors.primary` as-is.
- **`app/utils/links.ts`** — remove `Blog` and `Speaking` nav items (leaving Home, Projects, About).
- **`content/projects.yml`** — rewrite the projects-page header (`title`, `description`, `links`).
- **`content/about.yml`** — rewrite `content` (bio draft above) and `images` (placeholders).
- **`app/components/OgImage/Portfolio.takumi.vue`** — update any hardcoded template name/author to Filip's.

### Deleted

- `content/blog.yml`, `content/blog/*.md` (4 posts)
- `content/speaking.yml`
- `content/projects/{bloom-finance,ecotrack,internal-developer-hub,wavelength-music}.yml` → replaced by 6 new placeholder files (`booking-manager.yml`, `qartora.yml`, `scayle.yml`, `fitbud.yml`, `hala-centar.yml`, `serapion-web.yml`)
- `app/components/landing/Blog.vue`
- `app/pages/blog/index.vue`, `app/pages/blog/[...slug].vue`
- `app/pages/speaking.vue`

## Placeholders & assets to provide later

- Portrait photo (hero avatar) and CV PDF
- Project descriptions, tech stacks, links, and card images (6)
- Testimonial quotes and each author's role/relationship (4)
- Company logos/brand colors for Booking Manager & Serapion (fallback: lucide icons + chosen colors until provided)
- About-page bio refinements + location

Placeholder projects use a shared placeholder image (e.g. `/projects/placeholder.png`) and `url: '#'` to satisfy the required `image`/`url` schema fields.

## Testing / verification

- `pnpm dev` runs with no content-schema validation errors.
- `pnpm typecheck` and `pnpm lint` pass.
- Manual check: homepage renders Hero (no marquee) → About/Experience → Skills → Testimonials → FAQ; `/projects` shows 6 cards; `/about` renders; nav shows Home/Projects/About only; `/blog` and `/speaking` 404; footer + hero social links point to Filip's GitHub/LinkedIn.

## Out of scope

- Real project/testimonial copy and images (provided later by Filip)
- CV PDF and portrait sourcing
- Any redesign of the visual theme beyond the accent color decision
- Contact form / backend (uses `mailto:` + social links only)
