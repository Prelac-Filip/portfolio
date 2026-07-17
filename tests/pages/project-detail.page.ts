import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

export class ProjectDetailPage extends BasePage {
  readonly backToProjects: Locator

  constructor(page: Page) {
    super(page)
    this.backToProjects = page.getByRole('link', { name: 'Back to projects' })
  }
}
