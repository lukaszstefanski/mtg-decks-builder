import { test, expect } from '@playwright/test'

test.describe('Deck Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in real tests you'd set up proper auth
    await page.goto('/')
    
    // Mock being logged in by setting localStorage or cookies
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'test-user', email: 'test@example.com' }
      }))
    })
  })

  test('should display dashboard with deck list', async ({ page }) => {
    await page.goto('/')
    
    // Check if dashboard elements are present
    await expect(page.getByRole('heading', { name: /my decks/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /create new deck/i })).toBeVisible()
  })

  test('should create new deck', async ({ page }) => {
    await page.goto('/')
    
    // Click create deck button
    await page.getByRole('button', { name: /create new deck/i }).click()
    
    // Fill deck creation form
    await page.getByLabel(/deck name/i).fill('Test Deck')
    await page.getByLabel(/description/i).fill('A test deck for e2e testing')
    await page.getByRole('button', { name: /create deck/i }).click()
    
    // Check if deck was created and we're redirected to deck editor
    await expect(page).toHaveURL(/\/decks\/[^\/]+\/edit/)
    await expect(page.getByText('Test Deck')).toBeVisible()
  })

  test('should search for cards in deck editor', async ({ page }) => {
    // Navigate to a deck editor page (assuming we have a test deck)
    await page.goto('/decks/test-deck-id/edit')
    
    // Check if card search is present
    await expect(page.getByPlaceholder(/search for cards/i)).toBeVisible()
    
    // Search for a card
    await page.getByPlaceholder(/search for cards/i).fill('Lightning Bolt')
    await page.getByRole('button', { name: /search/i }).click()
    
    // Check if search results are displayed
    await expect(page.getByText('Lightning Bolt')).toBeVisible()
  })

  test('should add card to deck', async ({ page }) => {
    await page.goto('/decks/test-deck-id/edit')
    
    // Search for a card
    await page.getByPlaceholder(/search for cards/i).fill('Lightning Bolt')
    await page.getByRole('button', { name: /search/i }).click()
    
    // Wait for search results
    await expect(page.getByText('Lightning Bolt')).toBeVisible()
    
    // Click add button on the first card
    await page.getByRole('button', { name: /add to deck/i }).first().click()
    
    // Check if card was added to deck
    await expect(page.getByText('Lightning Bolt')).toBeVisible()
    await expect(page.getByText('1x')).toBeVisible()
  })

  test('should remove card from deck', async ({ page }) => {
    await page.goto('/decks/test-deck-id/edit')
    
    // Assuming deck already has a card
    await expect(page.getByText('Lightning Bolt')).toBeVisible()
    
    // Click remove button
    await page.getByRole('button', { name: /remove/i }).first().click()
    
    // Check if card was removed
    await expect(page.getByText('Lightning Bolt')).not.toBeVisible()
  })

  test('should save deck changes', async ({ page }) => {
    await page.goto('/decks/test-deck-id/edit')
    
    // Make some changes to the deck
    await page.getByPlaceholder(/search for cards/i).fill('Counterspell')
    await page.getByRole('button', { name: /search/i }).click()
    await page.getByRole('button', { name: /add to deck/i }).first().click()
    
    // Save the deck
    await page.getByRole('button', { name: /save deck/i }).click()
    
    // Check for success message
    await expect(page.getByText(/deck saved successfully/i)).toBeVisible()
  })

  test('should delete deck', async ({ page }) => {
    await page.goto('/')
    
    // Find a deck and click delete
    await page.getByRole('button', { name: /delete/i }).first().click()
    
    // Confirm deletion in dialog
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: /confirm delete/i }).click()
    
    // Check if deck was removed
    await expect(page.getByText(/deck deleted successfully/i)).toBeVisible()
  })
})

test.describe('Card Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/decks/test-deck-id/edit')
  })

  test('should filter cards by color', async ({ page }) => {
    // Open color filter
    await page.getByRole('button', { name: /filter by color/i }).click()
    
    // Select red color
    await page.getByRole('checkbox', { name: /red/i }).check()
    await page.getByRole('button', { name: /apply filters/i }).click()
    
    // Search for cards
    await page.getByPlaceholder(/search for cards/i).fill('bolt')
    await page.getByRole('button', { name: /search/i }).click()
    
    // Check if only red cards are shown
    await expect(page.getByText('Lightning Bolt')).toBeVisible()
  })

  test('should filter cards by type', async ({ page }) => {
    // Open type filter
    await page.getByRole('button', { name: /filter by type/i }).click()
    
    // Select instant type
    await page.getByRole('checkbox', { name: /instant/i }).check()
    await page.getByRole('button', { name: /apply filters/i }).click()
    
    // Search for cards
    await page.getByPlaceholder(/search for cards/i).fill('counter')
    await page.getByRole('button', { name: /search/i }).click()
    
    // Check if only instant cards are shown
    await expect(page.getByText('Counterspell')).toBeVisible()
  })

  test('should clear filters', async ({ page }) => {
    // Apply some filters
    await page.getByRole('button', { name: /filter by color/i }).click()
    await page.getByRole('checkbox', { name: /red/i }).check()
    await page.getByRole('button', { name: /apply filters/i }).click()
    
    // Clear filters
    await page.getByRole('button', { name: /clear filters/i }).click()
    
    // Check if filters are cleared
    await expect(page.getByRole('checkbox', { name: /red/i })).not.toBeChecked()
  })
})
