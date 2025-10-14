import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { testUsers } from './fixtures/test-data'

test.describe('Authentication with Page Object Model', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login(testUsers.valid.email, testUsers.valid.password)
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: /my decks/i })).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.login(testUsers.invalid.email, testUsers.invalid.password)
    
    // Should stay on login page and show error
    await expect(page).toHaveURL('/login')
    await expect(loginPage.errorMessage).toBeVisible()
  })

  test('should navigate to registration page', async ({ page }) => {
    await loginPage.navigateToRegister()
    
    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await loginPage.navigateToForgotPassword()
    
    await expect(page).toHaveURL('/forgot-password')
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible()
  })
})
