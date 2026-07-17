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

  test('opening a project shows its detail page and back button returns to list', async ({ projectsPage, projectDetailPage }) => {
    await projectsPage.goto()
    const href = await projectsPage.openFirstProject()

    // href is the project path, e.g. "/projects/qartora"
    expect(href).toMatch(/^\/projects\/.+/)
    await expect(projectDetailPage.page).toHaveURL(href)
    await expect(projectDetailPage.heading).toBeVisible()
    await expect(projectDetailPage.backToProjects).toBeVisible()

    await projectDetailPage.backToProjects.click()
    await expect(projectDetailPage.page).toHaveURL('/projects/')
  })

  test('header nav moves between Home, Projects, and About', async ({ homePage }) => {
    await homePage.goto()
    await homePage.expectLoadedClean()

    await homePage.navProjects.click()
    await expect(homePage.page).toHaveURL('/projects/')
    await expect(homePage.heading).toBeVisible()

    await homePage.navAbout.click()
    await expect(homePage.page).toHaveURL('/about')
    await expect(homePage.heading).toBeVisible()

    await homePage.navHome.click()
    await expect(homePage.page).toHaveURL('/')
    await expect(homePage.heading).toBeVisible()
  })
})
