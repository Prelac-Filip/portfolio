import { BasePage } from './base.page'

export class AboutPage extends BasePage {
  async goto() {
    await super.goto('/about')
  }
}
