import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    // Check if login form elements are present
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /log in/i }).click()

    // Check for validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /log in/i }).click()

    // Check for error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    // Click on register link
    await page.getByRole('link', { name: /create account/i }).click()

    // Check if we're on register page
    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
  })

  test('should navigate to forgot password page', async ({ page }) => {
    // Click on forgot password link
    await page.getByRole('link', { name: /forgot password/i }).click()

    // Check if we're on forgot password page
    await expect(page).toHaveURL('/forgot-password')
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible()
  })
})

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('should display registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('should show validation errors for mismatched passwords', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('differentpassword')
    await page.getByRole('button', { name: /create account/i }).click()

    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should navigate back to login page', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click()

    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible()
  })
})
