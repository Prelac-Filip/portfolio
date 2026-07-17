import { test, expect } from '../fixtures/pages.fixture'

test.describe('smoke', () => {
  test('home page loads clean with header and footer', async ({ homePage }) => {
    await homePage.goto()
    await homePage.expectLoadedClean()
    await homePage.expectChromeVisible()
    await expect(homePage.page).toHaveURL('/')
  })
})
