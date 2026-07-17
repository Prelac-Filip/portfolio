import { test, expect } from '../fixtures/pages.fixture'

test.describe('smoke', () => {
  test('home page loads clean with header and footer', async ({ homePage }) => {
    await homePage.goto()
    await homePage.expectLoadedClean()
    await homePage.expectChromeVisible()
    await expect(homePage.page).toHaveURL('/')
  })

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
    await expect(projectsPage.page).toHaveURL('/projects/')
    await expect(projectsPage.detailLinks.first()).toBeVisible()
  })
})
