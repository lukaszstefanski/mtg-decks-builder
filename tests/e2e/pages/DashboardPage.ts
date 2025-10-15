import type { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createDeckButton: Locator;
  readonly deckList: Locator;
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  
  // Create Deck Modal
  readonly createDeckModal: Locator;
  readonly deckNameInput: Locator;
  readonly deckFormatSelect: Locator;
  readonly deckDescriptionInput: Locator;
  readonly submitDeckButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /moje decki/i });
    this.createDeckButton = page.getByTestId("create-deck-button");
    this.deckList = page.getByTestId("deck-list-container");
    this.searchInput = page.getByPlaceholder(/search decks/i);
    this.filterButton = page.getByRole("button", { name: /filter/i });
    
    // Create Deck Modal
    this.createDeckModal = page.getByTestId("create-deck-modal");
    this.deckNameInput = page.getByTestId("deck-name-input");
    this.deckFormatSelect = page.getByTestId("deck-format-select");
    this.deckDescriptionInput = page.getByTestId("deck-description-input");
    this.submitDeckButton = page.getByTestId("submit-deck-button");
    this.cancelButton = page.getByRole("button", { name: /anuluj/i });
  }

  async goto() {
    await this.page.goto("/");
  }

  async createNewDeck() {
    await this.createDeckButton.click();
  }

  async fillDeckForm(name: string, format: string, description?: string) {
    await this.deckNameInput.fill(name);
    await this.deckFormatSelect.selectOption(format);
    if (description) {
      await this.deckDescriptionInput.fill(description);
    }
  }

  async submitDeckForm() {
    await this.submitDeckButton.click();
  }

  async cancelDeckForm() {
    await this.cancelButton.click();
  }

  async searchDecks(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async getDeckByName(name: string) {
    return this.page.getByTestId("deck-name").filter({ hasText: name });
  }

  async getDeckCard(name: string) {
    return this.page.getByTestId("deck-card").filter({ hasText: name });
  }

  async getDeckActions(name: string) {
    const deckCard = this.page.locator(`[data-testid="deck-card"]:has-text("${name}")`);
    return {
      editButton: deckCard.getByRole("button", { name: /edit/i }),
      deleteButton: deckCard.getByRole("button", { name: /delete/i }),
    };
  }
}
