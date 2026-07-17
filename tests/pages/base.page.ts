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
    this.footerGithub = page.getByRole('contentinfo').getByRole('link', { name: 'Filip Prelac on GitHub' })
    this.footerLinkedin = page.getByRole('contentinfo').getByRole('link', { name: 'Filip Prelac on LinkedIn' })
    this.themeToggle = page.getByRole('button', { name: /Switch to (dark|light) mode/ })
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  /** Assert an in-scope page rendered: a visible, non-empty <h1>, and NOT the
   *  Nuxt error page (error.vue renders a "Page not found: …" heading via UError). */
  async expectLoadedClean() {
    await expect(this.heading).toBeVisible()
    await expect(this.heading).not.toHaveText('')
    await expect(this.page.getByText(/not found/i)).toHaveCount(0)
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
    await expect(html).not.toHaveAttribute('class', before)
    return (await html.getAttribute('class')) ?? ''
  }
}
