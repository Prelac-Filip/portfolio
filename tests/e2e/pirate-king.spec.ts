import { test, expect } from '../fixtures/pages.fixture'

// The game links to this address from its settings and from the Play Console,
// so it must never move.
const PRIVACY_PATH = '/projects/pirate-king/privacy'

test.describe('Pirate King', () => {
  test('is listed on the projects page and opens its detail page', async ({ projectsPage, projectDetailPage }) => {
    await projectsPage.goto()
    await projectsPage.detailLinks.and(projectsPage.page.locator('[href="/projects/pirate-king"]')).click()

    await expect(projectDetailPage.page).toHaveURL('/projects/pirate-king')
    await projectDetailPage.expectLoadedClean()
    await expect(projectDetailPage.heading).toHaveText('Pirate King')
    await expect(projectDetailPage.backToProjects).toBeVisible()
  })

  test('shows its features with the store screenshots', async ({ projectDetailPage }) => {
    await projectDetailPage.goto('/projects/pirate-king')
    await projectDetailPage.expectLoadedClean()

    // Nuxt Image serves them through /_ipx/, so match the file name anywhere in the src.
    const shots = projectDetailPage.page.locator('img[src*="/projects/pirate-king/shot_"]')
    await expect(shots).toHaveCount(8)
    for (const shot of await shots.all()) {
      await shot.scrollIntoViewIfNeeded()
      // Loaded, not broken. (The width the browser reports depends on which srcset density it picked.)
      await expect.poll(() => shot.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    }
    await expect(projectDetailPage.page.getByRole('heading', { name: 'Features' })).toBeVisible()
  })

  test('the detail page links to the privacy policy', async ({ projectDetailPage, privacyPage }) => {
    await projectDetailPage.goto('/projects/pirate-king')
    await projectDetailPage.page.getByRole('link', { name: 'privacy policy' }).click()

    await expect(privacyPage.page).toHaveURL(PRIVACY_PATH)
    await privacyPage.expectLoadedClean()
  })

  test('the privacy policy is filled in and leads back to the game', async ({ privacyPage }) => {
    await privacyPage.goto(PRIVACY_PATH)
    await privacyPage.expectLoadedClean()
    await privacyPage.expectChromeVisible()

    await expect(privacyPage.heading).toHaveText('Pirate King: privacy policy')
    await expect(privacyPage.lastUpdated).toBeVisible()
    await expect(privacyPage.page.getByRole('heading', { name: 'Ads (Google AdMob)' })).toBeVisible()
    await expect(privacyPage.page.locator('a[href="mailto:prelacfilip@gmail.com"]').first()).toBeVisible()
    // No draft placeholder like [[CONTACT EMAIL]] is left in.
    await expect(privacyPage.page.getByText('[[')).toHaveCount(0)

    await privacyPage.backToProject.click()
    await expect(privacyPage.page).toHaveURL('/projects/pirate-king')
  })

  test('the privacy policy is in the page HTML itself, not drawn by JavaScript', async ({ request }) => {
    const response = await request.get(PRIVACY_PATH)
    expect(response.status()).toBe(200)

    const html = await response.text()
    expect(html).toContain('Pirate King: privacy policy')
    expect(html).toContain('Google AdMob')
    expect(html).toContain('Google Play')
  })
})
