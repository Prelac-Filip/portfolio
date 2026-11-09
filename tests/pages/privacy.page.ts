import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

export class PrivacyPage extends BasePage {
  readonly backToProject: Locator
  readonly lastUpdated: Locator

  constructor(page: Page) {
    super(page)
    this.backToProject = page.getByRole('link', { name: /^Back to / })
    this.lastUpdated = page.getByText(/Last updated: \d{1,2} \w+ \d{4}/)
  }
}
