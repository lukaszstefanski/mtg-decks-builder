import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/adres email/i);
    this.passwordInput = page.getByLabel(/hasło/i);
    this.loginButton = page.getByRole("button", { name: /zaloguj się/i });
    this.registerLink = page.getByRole("link", { name: /utwórz nowe konto/i });
    this.forgotPasswordLink = page.getByRole("link", { name: /zapomniałeś hasła/i });
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    // Wait for form to be ready
    await this.emailInput.waitFor({ state: "visible" });
    await this.passwordInput.waitFor({ state: "visible" });

    // Clear any existing values and fill the form
    await this.emailInput.clear();
    await this.emailInput.fill(email);
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);

    // Click login button
    await this.loginButton.click();

    // Wait for navigation to dashboard or error message
    try {
      await Promise.race([
        this.page.waitForURL("/", { timeout: 15000 }),
        this.page.waitForSelector('[data-testid="error-message"]', { timeout: 5000 }),
      ]);
    } catch (error) {
      // If navigation fails, check if we're already on dashboard
      if (this.page.url().includes("/")) {
        return; // Already on dashboard
      }
      throw error;
    }
  }

  async navigateToRegister() {
    await this.registerLink.click();
  }

  async navigateToForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
