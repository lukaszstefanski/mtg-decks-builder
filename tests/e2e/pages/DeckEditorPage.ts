import { Page, Locator } from '@playwright/test'

export class DeckEditorPage {
  readonly page: Page
  readonly deckName: Locator
  readonly cardSearchInput: Locator
  readonly searchButton: Locator
  readonly cardResults: Locator
  readonly deckCards: Locator
  readonly saveButton: Locator
  readonly colorFilter: Locator
  readonly typeFilter: Locator
  readonly clearFiltersButton: Locator

  constructor(page: Page) {
    this.page = page
    this.deckName = page.locator('[data-testid="deck-name"]')
    this.cardSearchInput = page.getByPlaceholder(/search for cards/i)
    this.searchButton = page.getByRole('button', { name: /search/i })
    this.cardResults = page.locator('[data-testid="card-results"]')
    this.deckCards = page.locator('[data-testid="deck-cards"]')
    this.saveButton = page.getByRole('button', { name: /save deck/i })
    this.colorFilter = page.getByRole('button', { name: /filter by color/i })
    this.typeFilter = page.getByRole('button', { name: /filter by type/i })
    this.clearFiltersButton = page.getByRole('button', { name: /clear filters/i })
  }

  async goto(deckId: string) {
    await this.page.goto(`/decks/${deckId}/edit`)
  }

  async searchCards(query: string) {
    await this.cardSearchInput.fill(query)
    await this.searchButton.click()
  }

  async addCardToDeck(cardName: string) {
    const cardElement = this.cardResults.locator(`:has-text("${cardName}")`)
    await cardElement.getByRole('button', { name: /add to deck/i }).click()
  }

  async removeCardFromDeck(cardName: string) {
    const cardElement = this.deckCards.locator(`:has-text("${cardName}")`)
    await cardElement.getByRole('button', { name: /remove/i }).click()
  }

  async getCardQuantity(cardName: string) {
    const cardElement = this.deckCards.locator(`:has-text("${cardName}")`)
    return await cardElement.locator('[data-testid="card-quantity"]').textContent()
  }

  async saveDeck() {
    await this.saveButton.click()
  }

  async filterByColor(color: string) {
    await this.colorFilter.click()
    await this.page.getByRole('checkbox', { name: new RegExp(color, 'i') }).check()
    await this.page.getByRole('button', { name: /apply filters/i }).click()
  }

  async filterByType(type: string) {
    await this.typeFilter.click()
    await this.page.getByRole('checkbox', { name: new RegExp(type, 'i') }).check()
    await this.page.getByRole('button', { name: /apply filters/i }).click()
  }

  async clearFilters() {
    await this.clearFiltersButton.click()
  }

  async getDeckName() {
    return await this.deckName.textContent()
  }
}
