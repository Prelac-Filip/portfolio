import type { Locator, Page } from '@playwright/test'
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
