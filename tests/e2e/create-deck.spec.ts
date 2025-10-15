import { test, expect } from "@playwright/test";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

test.describe("Create Deck Flow", () => {
  let dashboardPage: DashboardPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);

    // Get test credentials from environment variables
    const username = process.env.E2E_USERNAME;
    const password = process.env.E2E_PASSWORD;

    if (!username || !password) {
      throw new Error("E2E_USERNAME and E2E_PASSWORD environment variables must be set");
    }

    // Login with real credentials with retry logic
    let loginAttempts = 0;
    const maxAttempts = 3;

    while (loginAttempts < maxAttempts) {
      try {
        await loginPage.goto();
        await loginPage.login(username, password);

        // Wait for dashboard to load
        await page.waitForLoadState("networkidle");
        await expect(dashboardPage.heading).toBeVisible({ timeout: 15000 });
        break; // Success, exit retry loop
      } catch (error) {
        loginAttempts++;
        if (loginAttempts >= maxAttempts) {
          throw error;
        }
        console.log(`Login attempt ${loginAttempts} failed, retrying...`);
        await page.waitForTimeout(2000);
      }
    }
  });

  test("should create a new deck with required fields only", async ({ page }) => {
    // Verify dashboard is loaded (already loaded from beforeEach)
    await expect(dashboardPage.heading).toBeVisible();
    await expect(dashboardPage.createDeckButton).toBeVisible();

    // Click create deck button
    await dashboardPage.createNewDeck();

    // Verify modal is opened
    await expect(dashboardPage.createDeckModal).toBeVisible();

    // Fill required fields only with unique name
    const uniqueDeckName = `Required Fields Deck ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await dashboardPage.fillDeckForm(uniqueDeckName, "standard");

    // Submit form
    await dashboardPage.submitDeckForm();

    // Verify modal is closed
    await expect(dashboardPage.createDeckModal).not.toBeVisible();

    // Verify deck appears in the list
    const deckElement = await dashboardPage.getDeckByName(uniqueDeckName);
    await expect(deckElement).toBeVisible();
  });

  test("should create a new deck with all fields", async ({ page }) => {
    // Click create deck button
    await dashboardPage.createNewDeck();

    // Verify modal is opened
    await expect(dashboardPage.createDeckModal).toBeVisible();

    // Fill all fields with unique name
    const uniqueDeckName = `Complete Test Deck ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await dashboardPage.fillDeckForm(
      uniqueDeckName,
      "modern",
      "This is a test deck for e2e testing with full description"
    );

    // Submit form
    await dashboardPage.submitDeckForm();

    // Verify modal is closed
    await expect(dashboardPage.createDeckModal).not.toBeVisible();

    // Verify deck appears in the list
    const deckElement = await dashboardPage.getDeckByName(uniqueDeckName);
    await expect(deckElement).toBeVisible();
  });

  test("should show validation errors for empty required fields", async ({ page }) => {
    // Click create deck button
    await dashboardPage.createNewDeck();

    // Try to submit empty form
    await dashboardPage.submitDeckForm();

    // Verify validation errors are shown
    await expect(page.getByText("Nazwa decka jest wymagana")).toBeVisible();
    await expect(page.getByText("Format jest wymagany")).toBeVisible();

    // Verify modal is still open
    await expect(dashboardPage.createDeckModal).toBeVisible();
  });

  test("should respect maxLength attribute for name field", async ({ page }) => {
    // Click create deck button
    await dashboardPage.createNewDeck();

    // Try to fill name that's too long (over 100 characters)
    const longName = "A".repeat(150);
    await dashboardPage.deckNameInput.fill(longName);

    // Verify that only 100 characters are accepted due to maxLength attribute
    const inputValue = await dashboardPage.deckNameInput.inputValue();
    expect(inputValue.length).toBe(100);

    // Fill format and submit
    await dashboardPage.deckFormatSelect.selectOption("standard");
    await dashboardPage.submitDeckForm();

    // Deck should be created successfully since the input was limited to 100 chars
    await expect(dashboardPage.createDeckModal).not.toBeVisible();
  });

  test("should respect maxLength attribute for description field", async ({ page }) => {
    // Click create deck button
    await dashboardPage.createNewDeck();

    // Try to fill description that's too long (over 500 characters)
    const longDescription = "A".repeat(600);
    await dashboardPage.deckNameInput.fill("Test Deck");
    await dashboardPage.deckFormatSelect.selectOption("standard");
    await dashboardPage.deckDescriptionInput.fill(longDescription);

    // Verify that only 500 characters are accepted due to maxLength attribute
    const inputValue = await dashboardPage.deckDescriptionInput.inputValue();
    expect(inputValue.length).toBe(500);

    // Submit form
    await dashboardPage.submitDeckForm();

    // Deck should be created successfully since the input was limited to 500 chars
    await expect(dashboardPage.createDeckModal).not.toBeVisible();
  });

  test("should cancel deck creation", async ({ page }) => {
    // Click create deck button
    await dashboardPage.createNewDeck();

    // Verify modal is opened
    await expect(dashboardPage.createDeckModal).toBeVisible();

    // Fill some data with unique name
    const uniqueDeckName = `Cancel Test Deck ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await dashboardPage.fillDeckForm(uniqueDeckName, "standard", "Test description");

    // Cancel form
    await dashboardPage.cancelDeckForm();

    // Verify modal is closed
    await expect(dashboardPage.createDeckModal).not.toBeVisible();

    // Verify deck is not in the list
    const deckElement = await dashboardPage.getDeckByName(uniqueDeckName);
    await expect(deckElement).not.toBeVisible();
  });

  test("should clear validation errors when user starts typing", async ({ page }) => {
    // Click create deck button
    await dashboardPage.createNewDeck();

    // Try to submit empty form to trigger validation errors
    await dashboardPage.submitDeckForm();

    // Verify validation errors are shown
    await expect(page.getByText("Nazwa decka jest wymagana")).toBeVisible();

    // Start typing in name field
    await dashboardPage.deckNameInput.fill("Test");

    // Verify validation error is cleared
    await expect(page.getByText("Nazwa decka jest wymagana")).not.toBeVisible();
  });

  test("should show loading state during deck creation", async ({ page }) => {
    // Click create deck button
    await dashboardPage.createNewDeck();

    // Fill form with unique name
    const uniqueDeckName = `Loading Test Deck ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await dashboardPage.fillDeckForm(uniqueDeckName, "standard");

    // Submit form and check for loading state
    await dashboardPage.submitDeckForm();

    // Verify submit button shows loading state
    await expect(dashboardPage.submitDeckButton).toHaveText("Tworzenie...");
    await expect(dashboardPage.submitDeckButton).toBeDisabled();
  });

  test("should create deck with different formats", async ({ page }) => {
    test.setTimeout(90000); // Increase timeout for this test as it creates multiple decks

    const formats = ["standard", "modern", "legacy", "vintage", "commander", "pioneer", "historic"];

    for (const format of formats) {
      // Click create deck button
      await dashboardPage.createNewDeck();

      // Fill form with current format and unique name
      const uniqueDeckName = `Format Test Deck ${format} ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await dashboardPage.fillDeckForm(uniqueDeckName, format);

      // Submit form
      await dashboardPage.submitDeckForm();

      // Wait for deck to be created and appear in the list
      await page.waitForTimeout(2000);

      // Verify deck appears in the list
      const deckElement = await dashboardPage.getDeckByName(uniqueDeckName);
      await expect(deckElement).toBeVisible({ timeout: 10000 });

      // Verify format is displayed correctly
      const deckCard = await dashboardPage.getDeckCard(uniqueDeckName);
      await expect(deckCard.locator(`span:has-text("${format}")`)).toBeVisible();
    }
  });
});
