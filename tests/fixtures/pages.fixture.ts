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
