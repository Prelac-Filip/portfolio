# Playwright E2E Smoke Suite — Design

**Date:** 2026-07-17
**Status:** Approved (design)
**Scope:** Introduce Playwright E2E testing to the Nuxt 4 portfolio with a smoke
suite covering all listed pages, structured with the Page Object Model (POM) and
Playwright fixtures.

## Goal

Provide a broad, shallow safety net that catches regressions where a route fails
to render, navigation breaks, or shared chrome (header nav, footer links, theme
toggle) stops working. Coverage is prioritized over depth for this first round.

## Constraints & context

- The app is a Nuxt 4 portfolio. Pages are **content-driven** via `@nuxt/content`
  (`content/*.yml` and `content/projects/*.md`). Titles and body copy are dynamic,
  so tests must assert on **structure and navigation**, not hardcoded copy — otherwise
  they break on every content edit.
- Stable values worth asserting come from `app/app.config.ts` (footer GitHub/LinkedIn
  links).
- Routes in scope: `/`, `/about`, `/projects`, `/projects/[slug]`.
- `/special` is treated as an unlisted/easter-egg route and is **excluded** from the suite.
- Chromium only for this round.
- No CI workflow this round (local only). CI can be added later.

## Architecture

### Folder layout

```
playwright.config.ts          # config: chromium, webServer (build+preview), baseURL
tests/
  e2e/
    smoke.spec.ts             # the smoke suite
  pages/                      # Page Object Model
    base.page.ts              # BasePage: shared nav/footer/goto/theme-toggle
    home.page.ts
    about.page.ts
    projects.page.ts          # projects list
    project-detail.page.ts
  fixtures/
    pages.fixture.ts          # extends `test`, injects page objects
```

Note: no `special.page.ts` — `/special` is out of scope.

### Page Object Model

Each page class wraps a Playwright `Page`, exposing:
- **Locators** — hero heading, header nav menu, footer links, color-mode button,
  page-specific elements.
- **Actions** — `goto()`, and page-specific interactions such as
  `ProjectsPage.openFirstProject()`.

Tests never reference raw selectors; they interact through page objects.

`BasePage` holds what every page shares:
- `AppHeader` navigation menu.
- `AppFooter` GitHub + LinkedIn links.
- `ColorModeButton` and a `toggleTheme()` action.
- A helper to assert the Nuxt `error.vue` page is **not** rendered.

Concrete page objects extend `BasePage`.

### Fixtures

A custom `test` built with `base.extend<{...}>()` constructs each page object and
provides it pre-instantiated, removing `new HomePage(page)` boilerplate:

```ts
test('home renders', async ({ homePage }) => {
  await homePage.goto()
  await expect(homePage.heading).toBeVisible()
})
```

## Test server & Playwright config

- **`webServer.command`**: `pnpm build && pnpm preview`, waiting on
  `http://localhost:3000`, with `reuseExistingServer: !process.env.CI`. Locally you
  can pre-build/serve once and re-run tests fast; otherwise it builds + serves fresh.
  Tests run against a production-like build (prod fidelity).
- **`webServer.timeout`**: ~120s to accommodate a full Nuxt build.
- **`baseURL`**: `http://localhost:3000` so page objects use relative paths.
- **Project**: `chromium` only (Desktop Chrome device).
- **Reporter**: `html` + `list`.
- **Retries**: `2` on CI, `0` locally.
- **Trace**: `on-first-retry`. **Screenshot**: `only-on-failure`.
- **`package.json` scripts**: `test:e2e` (`playwright test`),
  `test:e2e:ui` (`--ui`), `test:e2e:report` (`playwright show-report`).
- **Dependency**: `@playwright/test` as a devDependency.
- **`.gitignore`**: add `test-results/`, `playwright-report/`, `/playwright/.cache/`.

## What the smoke suite asserts

### Per-route "loads clean" (`/`, `/about`, `/projects`)
- Navigate via the page object's `goto()`.
- Hero `<h1>` heading is visible and non-empty (no exact-text assertion).
- `AppHeader` nav menu is visible.
- `AppFooter` GitHub + LinkedIn links are present with the correct `href`s (from
  `app.config.ts`).
- The `error.vue` page is **not** rendered.

### Navigation flow
- From the header nav, click through to Home / About / Projects and assert the URL
  and heading updated.

### Project detail (dynamic slug)
- On `/projects`, `ProjectsPage.openFirstProject()` clicks the first `ProjectCard` link.
- Assert URL matches `/projects/<slug>` and the detail hero heading is visible.
- Assert the **"Back to projects"** button returns to `/projects`.
- No hardcoded slug — resilient to content changes.

### Theme toggle (in `BasePage`, run once on home)
- Click the `ColorModeButton`; assert the `<html>` class flips between `light`/`dark`.

## Deliberately out of scope (YAGNI)

- Exact content text of any page.
- FAQ / Testimonials / Skills / WorkExperience section internals.
- Carousels and image galleries.
- OG-image generation.
- Actually loading external links (assert `href` only, not that LinkedIn/GitHub load).
- The `/special` route.
- Cross-browser (Firefox/WebKit) runs.
- CI workflow.

## Success criteria

- `pnpm test:e2e` builds, serves, and runs the smoke suite green against a fresh
  production build.
- Editing page content (e.g. a project title) does not break the suite.
- Each page object can be understood and used without reading its internals.
