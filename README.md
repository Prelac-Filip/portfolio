# Nuxt Portfolio Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to create your own portfolio with [Nuxt UI](https://ui.nuxt.com).

- [Live demo](https://prelac.dev/)
- [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt)

<a href="https://portfolio-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ui.nuxt.com/assets/templates/nuxt/portfolio-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://ui.nuxt.com/assets/templates/nuxt/portfolio-light.png">
    <img alt="Nuxt Portfolio Template" src="https://ui.nuxt.com/assets/templates/nuxt/portfolio-light.png">
  </picture>
</a>

## Quick Start

```bash [Terminal]
npm create nuxt@latest -- -t ui/portfolio
```

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

**Deployment** is currently done on a self-hosted server. For further information, reach out to the project owner.

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
