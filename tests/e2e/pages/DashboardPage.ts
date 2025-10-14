import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createDeckButton: Locator;
  readonly deckList: Locator;
  readonly searchInput: Locator;
  readonly filterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /my decks/i });
    this.createDeckButton = page.getByRole("button", { name: /create new deck/i });
    this.deckList = page.locator('[data-testid="deck-list"]');
    this.searchInput = page.getByPlaceholder(/search decks/i);
    this.filterButton = page.getByRole("button", { name: /filter/i });
  }

  async goto() {
    await this.page.goto("/");
  }

  async createNewDeck() {
    await this.createDeckButton.click();
  }

  async searchDecks(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async getDeckByName(name: string) {
    return this.page.getByText(name);
  }

  async getDeckActions(name: string) {
    const deckCard = this.page.locator(`[data-testid="deck-card"]:has-text("${name}")`);
    return {
      editButton: deckCard.getByRole("button", { name: /edit/i }),
      deleteButton: deckCard.getByRole("button", { name: /delete/i }),
    };
  }
}
