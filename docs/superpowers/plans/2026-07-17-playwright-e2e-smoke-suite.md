# Playwright E2E Smoke Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Playwright E2E smoke suite to the Nuxt 4 portfolio that verifies every listed route renders, navigation works, footer links and theme toggle work — structured with the Page Object Model and Playwright fixtures.

**Architecture:** Playwright runs a production-like server via `webServer` (`pnpm build && pnpm preview` on `http://localhost:3000`). Tests interact only through page objects that extend a shared `BasePage` (header nav, footer links, color-mode toggle, error-page guard). A custom `test` fixture injects pre-instantiated page objects so specs carry no `new SomePage(page)` boilerplate. Assertions target structure and navigation (not content copy) because all pages are `@nuxt/content`-driven.

**Tech Stack:** Nuxt 4, `@nuxt/ui` v4, `@nuxt/content` v3, pnpm, `@playwright/test` (Chromium only).

---

## Reference: concrete DOM facts (verified against source)

Use these exact values in locators — they are confirmed from the codebase:

- **Nav menu** (`app/utils/links.ts`, rendered by `AppHeader` in every layout): three links —
  `Home` → `/`, `Projects` → `/projects`, `About` → `/about`. Rendered as `<a>` elements
  (accessible role `link`) with the label as accessible name. Leading icons are hidden via `ui.linkLeadingIcon: 'hidden'`.
- **Footer links** (`app/components/AppFooter.vue` + `app/app.config.ts`): two `UButton`s that
  render as `<a>` because they have `to`. Accessible names (from `aria-label`):
  `Filip Prelac on GitHub` → href `https://github.com/Prelac-Filip`,
  `Filip Prelac on LinkedIn` → href `https://www.linkedin.com/in/prelacfilip`.
- **Color-mode button** (`app/components/ColorModeButton.vue`): a `UButton` inside `<ClientOnly>`
  with `aria-label` `Switch to dark mode` or `Switch to light mode` (toggles). Role `button`.
- **Hero heading**: every page renders its title inside an `<h1>` via `UPageHero` (home uses
  `LandingHero`'s `UPageHero` `#title` slot). Target `page.locator('h1').first()`.
- **Theme state**: `@nuxt/ui` / `@nuxt/color-mode` toggles the `dark` (or `light`) class on the
  `<html>` element. Default preference renders `<html class="... light">` or `dark`.
- **ProjectCard** (`app/components/ProjectCard.vue`): the detail link is a `ULink` (`<a>`) with
  visible text `View details` and href = `project.path` (e.g. `/projects/qartora`). Each card also
  has an optional external `Visit site` link.
- **Project detail** (`app/pages/projects/[slug].vue`): has a `Back to projects` button
  (`UButton` → `<a>` with `to="/projects"`, accessible name `Back to projects`).
- **Routes in scope**: `/`, `/about`, `/projects`, `/projects/[slug]`. `/special` is EXCLUDED.
- **Error page** (`app/error.vue`): rendered on 404/fatal. It also renders `AppHeader`, so do NOT
  use "nav absent" as the error signal. Instead assert an in-scope page's `h1` is visible AND the
  URL is the expected one (Nuxt keeps the requested URL but swaps in the error component; the guard
  below asserts the positive content that only the real page has).

---

## Task 1: Install Playwright and ignore its artifacts

**Files:**
- Modify: `package.json` (devDependencies + scripts)
- Modify: `.gitignore`
- Create: `pnpm-lock.yaml` change (via install)

- [ ] **Step 1: Add Playwright as a dev dependency**

Run:
```bash
pnpm add -D @playwright/test
```
Expected: `@playwright/test` appears under `devDependencies` in `package.json`; lockfile updates.

- [ ] **Step 2: Install the Chromium browser binary**

Run:
```bash
pnpm exec playwright install chromium
```
Expected: Chromium downloads successfully (or reports already installed).

- [ ] **Step 3: Add test scripts to `package.json`**

In the `"scripts"` block, add these three entries (keep existing scripts):
```json
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report"
```

- [ ] **Step 4: Ignore Playwright artifacts in `.gitignore`**

Append to `.gitignore`:
```gitignore

# Playwright
/test-results/
/playwright-report/
/playwright/.cache/
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml .gitignore
git commit -m "chore: add @playwright/test and e2e scripts"
```

---

## Task 2: Playwright configuration

**Files:**
- Create: `playwright.config.ts`

- [ ] **Step 1: Write `playwright.config.ts`**

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
```

- [ ] **Step 2: Verify the config parses**

Run:
```bash
pnpm exec playwright test --list
```
Expected: no config errors. It reports `No tests found` (or lists nothing) since `tests/e2e` has no specs yet. If it errors on the config file, fix syntax before continuing.

- [ ] **Step 3: Commit**

```bash
git add playwright.config.ts
git commit -m "test: add Playwright config with preview webServer (chromium)"
```

---

## Task 3: BasePage and the pages fixture (prove the harness end-to-end)

This task builds the shared `BasePage`, the fixture, the `HomePage`, and the first smoke test together, because the first green test is what proves the whole harness (build → serve → page object → fixture → assertion) works.

**Files:**
- Create: `tests/pages/base.page.ts`
- Create: `tests/pages/home.page.ts`
- Create: `tests/fixtures/pages.fixture.ts`
- Create: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Write `BasePage`**

Create `tests/pages/base.page.ts`:
```ts
import { type Locator, type Page, expect } from '@playwright/test'

export class BasePage {
  readonly page: Page
  readonly heading: Locator
  readonly navHome: Locator
  readonly navProjects: Locator
  readonly navAbout: Locator
  readonly footerGithub: Locator
  readonly footerLinkedin: Locator
  readonly themeToggle: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.locator('h1').first()
    this.navHome = page.getByRole('link', { name: 'Home', exact: true })
    this.navProjects = page.getByRole('link', { name: 'Projects', exact: true })
    this.navAbout = page.getByRole('link', { name: 'About', exact: true })
    this.footerGithub = page.getByRole('link', { name: 'Filip Prelac on GitHub' })
    this.footerLinkedin = page.getByRole('link', { name: 'Filip Prelac on LinkedIn' })
    this.themeToggle = page.getByRole('button', { name: /Switch to (dark|light) mode/ })
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  /** Every in-scope page has a visible, non-empty <h1>. The error page does not render
   *  the page's real hero, so this doubles as an "error page not shown" guard. */
  async expectLoadedClean() {
    await expect(this.heading).toBeVisible()
    await expect(this.heading).not.toHaveText('')
  }

  async expectChromeVisible() {
    await expect(this.navHome).toBeVisible()
    await expect(this.footerGithub).toHaveAttribute('href', 'https://github.com/Prelac-Filip')
    await expect(this.footerLinkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/prelacfilip')
  }

  /** Toggle the color mode and return the <html> class list after the toggle settles. */
  async toggleThemeAndReadHtmlClass(): Promise<string> {
    const html = this.page.locator('html')
    const before = (await html.getAttribute('class')) ?? ''
    await this.themeToggle.click()
    // Wait until the class attribute actually changes.
    await expect(html).not.toHaveClass(before)
    return (await html.getAttribute('class')) ?? ''
  }
}
```

- [ ] **Step 2: Write `HomePage`**

Create `tests/pages/home.page.ts`:
```ts
import { type Page } from '@playwright/test'
import { BasePage } from './base.page'

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto('/')
  }
}
```

- [ ] **Step 3: Write the pages fixture (with HomePage only for now)**

Create `tests/fixtures/pages.fixture.ts`:
```ts
import { test as base } from '@playwright/test'
import { HomePage } from '../pages/home.page'

type Pages = {
  homePage: HomePage
}

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  }
})

export { expect } from '@playwright/test'
```

- [ ] **Step 4: Write the first failing smoke test**

Create `tests/e2e/smoke.spec.ts`:
```ts
import { test, expect } from '../fixtures/pages.fixture'

test.describe('smoke', () => {
  test('home page loads clean with header and footer', async ({ homePage }) => {
    await homePage.goto()
    await homePage.expectLoadedClean()
    await homePage.expectChromeVisible()
    await expect(homePage.page).toHaveURL('/')
  })
})
```

- [ ] **Step 5: Run the test — expect it to PASS (harness proof)**

Run:
```bash
pnpm test:e2e
```
Expected: Playwright builds the app, starts preview on :3000, runs 1 test in Chromium, and it PASSES. This is the point where the full harness is proven. If the build is slow, this may take 1–2 minutes on first run.

Note: this is E2E infrastructure, so "write a failing test first" is inverted — the deliverable *is* the test. If the test fails, treat the failure as a real signal (wrong selector, server not up) and fix the page object or config, not the assertion, unless the assertion is genuinely wrong.

- [ ] **Step 6: Commit**

```bash
git add tests/pages/base.page.ts tests/pages/home.page.ts tests/fixtures/pages.fixture.ts tests/e2e/smoke.spec.ts
git commit -m "test: add BasePage, pages fixture, and home smoke test"
```

---

## Task 4: About and Projects page objects + load-clean smoke tests

**Files:**
- Create: `tests/pages/about.page.ts`
- Create: `tests/pages/projects.page.ts`
- Modify: `tests/fixtures/pages.fixture.ts`
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Write `AboutPage`**

Create `tests/pages/about.page.ts`:
```ts
import { type Page } from '@playwright/test'
import { BasePage } from './base.page'

export class AboutPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto('/about')
  }
}
```

- [ ] **Step 2: Write `ProjectsPage`**

Create `tests/pages/projects.page.ts`:
```ts
import { type Locator, type Page } from '@playwright/test'
import { BasePage } from './base.page'

export class ProjectsPage extends BasePage {
  readonly detailLinks: Locator

  constructor(page: Page) {
    super(page)
    // ProjectCard renders a ULink with visible text "View details" per project.
    this.detailLinks = page.getByRole('link', { name: 'View details' })
  }

  async goto() {
    await super.goto('/projects')
  }

  /** Click the first project's "View details" link. Returns the href it pointed at. */
  async openFirstProject(): Promise<string> {
    const first = this.detailLinks.first()
    const href = (await first.getAttribute('href')) ?? ''
    await first.click()
    return href
  }
}
```

- [ ] **Step 3: Add both to the fixture**

Replace the contents of `tests/fixtures/pages.fixture.ts` with:
```ts
import { test as base } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { AboutPage } from '../pages/about.page'
import { ProjectsPage } from '../pages/projects.page'

type Pages = {
  homePage: HomePage
  aboutPage: AboutPage
  projectsPage: ProjectsPage
}

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page))
  },
  projectsPage: async ({ page }, use) => {
    await use(new ProjectsPage(page))
  }
})

export { expect } from '@playwright/test'
```

- [ ] **Step 4: Add load-clean tests for About and Projects**

In `tests/e2e/smoke.spec.ts`, inside the `smoke` describe block, add:
```ts
  test('about page loads clean with header and footer', async ({ aboutPage }) => {
    await aboutPage.goto()
    await aboutPage.expectLoadedClean()
    await aboutPage.expectChromeVisible()
    await expect(aboutPage.page).toHaveURL('/about')
  })

  test('projects page loads clean and lists at least one project', async ({ projectsPage }) => {
    await projectsPage.goto()
    await projectsPage.expectLoadedClean()
    await projectsPage.expectChromeVisible()
    await expect(projectsPage.page).toHaveURL('/projects')
    await expect(projectsPage.detailLinks.first()).toBeVisible()
  })
```

- [ ] **Step 5: Run the suite — expect 3 passing tests**

Run:
```bash
pnpm test:e2e
```
Expected: 3 tests pass (home, about, projects). If the projects assertion fails because no `View details` link is found, verify content exists in `content/projects/*.md` and that the card renders — do not weaken the assertion.

- [ ] **Step 6: Commit**

```bash
git add tests/pages/about.page.ts tests/pages/projects.page.ts tests/fixtures/pages.fixture.ts tests/e2e/smoke.spec.ts
git commit -m "test: add about and projects load-clean smoke tests"
```

---

## Task 5: Header navigation flow test

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Add a navigation flow test**

In `tests/e2e/smoke.spec.ts`, inside the `smoke` describe block, add:
```ts
  test('header nav moves between Home, Projects, and About', async ({ homePage }) => {
    await homePage.goto()
    await homePage.expectLoadedClean()

    await homePage.navProjects.click()
    await expect(homePage.page).toHaveURL('/projects')
    await expect(homePage.heading).toBeVisible()

    await homePage.navAbout.click()
    await expect(homePage.page).toHaveURL('/about')
    await expect(homePage.heading).toBeVisible()

    await homePage.navHome.click()
    await expect(homePage.page).toHaveURL('/')
    await expect(homePage.heading).toBeVisible()
  })
```

Note: `homePage` is used only as a convenient handle to the shared nav locators (defined on
`BasePage`); the nav menu is identical on every page, so this is intentional and DRY.

- [ ] **Step 2: Run the suite — expect 4 passing tests**

Run:
```bash
pnpm test:e2e
```
Expected: 4 tests pass. If a nav click does not change the URL, verify the link's accessible name matches the labels in `app/utils/links.ts` exactly (`Home`, `Projects`, `About`).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "test: add header navigation flow smoke test"
```

---

## Task 6: Project detail flow (dynamic slug + back button)

**Files:**
- Create: `tests/pages/project-detail.page.ts`
- Modify: `tests/fixtures/pages.fixture.ts`
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Write `ProjectDetailPage`**

Create `tests/pages/project-detail.page.ts`:
```ts
import { type Locator, type Page } from '@playwright/test'
import { BasePage } from './base.page'

export class ProjectDetailPage extends BasePage {
  readonly backToProjects: Locator

  constructor(page: Page) {
    super(page)
    this.backToProjects = page.getByRole('link', { name: 'Back to projects' })
  }
}
```

- [ ] **Step 2: Add it to the fixture**

In `tests/fixtures/pages.fixture.ts`, add the import and fixture entry.

Add to the imports:
```ts
import { ProjectDetailPage } from '../pages/project-detail.page'
```

Add `projectDetailPage: ProjectDetailPage` to the `Pages` type:
```ts
type Pages = {
  homePage: HomePage
  aboutPage: AboutPage
  projectsPage: ProjectsPage
  projectDetailPage: ProjectDetailPage
}
```

Add the fixture entry inside `base.extend<Pages>({ ... })`:
```ts
  projectDetailPage: async ({ page }, use) => {
    await use(new ProjectDetailPage(page))
  },
```

- [ ] **Step 3: Add the project detail flow test**

In `tests/e2e/smoke.spec.ts`, inside the `smoke` describe block, add:
```ts
  test('opening a project shows its detail page and back button returns to list', async ({ projectsPage, projectDetailPage }) => {
    await projectsPage.goto()
    const href = await projectsPage.openFirstProject()

    // href is the project path, e.g. "/projects/qartora"
    expect(href).toMatch(/^\/projects\/.+/)
    await expect(projectDetailPage.page).toHaveURL(href)
    await expect(projectDetailPage.heading).toBeVisible()
    await expect(projectDetailPage.backToProjects).toBeVisible()

    await projectDetailPage.backToProjects.click()
    await expect(projectDetailPage.page).toHaveURL('/projects')
  })
```

- [ ] **Step 4: Run the suite — expect 5 passing tests**

Run:
```bash
pnpm test:e2e
```
Expected: 5 tests pass. If the URL assertion fails, confirm `ProjectCard`'s `View details` link uses `project.path` (it does per source) and that `href` captured before the click matches the landed URL.

- [ ] **Step 5: Commit**

```bash
git add tests/pages/project-detail.page.ts tests/fixtures/pages.fixture.ts tests/e2e/smoke.spec.ts
git commit -m "test: add project detail navigation smoke test"
```

---

## Task 7: Theme toggle test

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Add the theme toggle test**

In `tests/e2e/smoke.spec.ts`, inside the `smoke` describe block, add:
```ts
  test('theme toggle flips the html color-mode class', async ({ homePage }) => {
    await homePage.goto()
    await homePage.expectLoadedClean()

    const before = (await homePage.page.locator('html').getAttribute('class')) ?? ''
    const wasDark = before.includes('dark')

    const after = await homePage.toggleThemeAndReadHtmlClass()

    // The mode should have flipped.
    expect(after.includes('dark')).toBe(!wasDark)
  })
```

- [ ] **Step 2: Run the suite — expect 6 passing tests**

Run:
```bash
pnpm test:e2e
```
Expected: 6 tests pass. If the toggle button is not found, remember it lives inside `<ClientOnly>` and only appears after hydration — Playwright's auto-waiting on `getByRole('button', ...)` handles this, but if it flakes, the assertion in `toggleThemeAndReadHtmlClass` (`expect(html).not.toHaveClass(before)`) provides the settle wait.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "test: add color-mode toggle smoke test"
```

---

## Task 8: Documentation and final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document how to run E2E tests in the README**

Add a section to `README.md` (below the existing setup/usage content):
```markdown
## End-to-end tests

E2E tests use [Playwright](https://playwright.dev) with a Page Object Model and fixtures.
They run against a production build served by `nuxt preview`.

First-time setup (installs the Chromium browser binary):

```bash
pnpm exec playwright install chromium
```

Run the suite:

```bash
pnpm test:e2e          # headless run (builds + serves automatically)
pnpm test:e2e:ui       # interactive UI mode
pnpm test:e2e:report   # open the last HTML report
```

Tests live in `tests/`: page objects in `tests/pages/`, the fixture in
`tests/fixtures/`, and specs in `tests/e2e/`.
```

- [ ] **Step 2: Full clean verification run**

Run the whole suite from a clean state to confirm the `webServer` build+serve path works end to end:
```bash
pnpm test:e2e
```
Expected: 6 passed, 0 failed, in Chromium.

- [ ] **Step 3: Lint the new TypeScript**

Run:
```bash
pnpm lint
```
Expected: no lint errors introduced by the new files. Fix any reported by ESLint (e.g. run `pnpm lint:fix`), then re-run `pnpm lint` to confirm clean.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document how to run Playwright e2e tests"
```

---

## Self-review notes (already applied)

- **Spec coverage:** POM (Tasks 3–6), fixtures (Tasks 3, 4, 6), preview webServer + chromium +
  config (Task 2), per-route load-clean for `/`,`/about`,`/projects` (Tasks 3–4), nav flow
  (Task 5), dynamic-slug project detail + back button (Task 6), theme toggle (Task 7), scripts +
  gitignore (Task 1), README (Task 8). `/special` correctly absent. No CI workflow — matches "local
  only". All covered.
- **Type consistency:** `BasePage` locators (`heading`, `navHome/Projects/About`,
  `footerGithub/Linkedin`, `themeToggle`) and methods (`goto`, `expectLoadedClean`,
  `expectChromeVisible`, `toggleThemeAndReadHtmlClass`) are used with identical names in later
  tasks. `ProjectsPage.detailLinks` / `openFirstProject()` and `ProjectDetailPage.backToProjects`
  match their usages. Fixture keys (`homePage`, `aboutPage`, `projectsPage`, `projectDetailPage`)
  match the destructured names in specs.
- **No placeholders:** every code and command step contains full content.
