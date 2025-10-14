import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly registerLink: Locator
  readonly forgotPasswordLink: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel(/email/i)
    this.passwordInput = page.getByLabel(/password/i)
    this.loginButton = page.getByRole('button', { name: /log in/i })
    this.registerLink = page.getByRole('link', { name: /create account/i })
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i })
    this.errorMessage = page.locator('[data-testid="error-message"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  async navigateToRegister() {
    await this.registerLink.click()
  }

  async navigateToForgotPassword() {
    await this.forgotPasswordLink.click()
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }
}
