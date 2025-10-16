export const testUsers = {
  valid: {
    email: "test@example.com",
    password: "password123",
  },
  invalid: {
    email: "invalid@example.com",
    password: "wrongpassword",
  },
};

export const testDecks = {
  basic: {
    name: "Test Deck",
    description: "A test deck for e2e testing",
  },
  withCards: {
    name: "Red Aggro",
    description: "A red aggro deck for testing",
    cards: [
      { name: "Lightning Bolt", quantity: 4 },
      { name: "Shock", quantity: 4 },
      { name: "Mountain", quantity: 20 },
    ],
  },
};

export const testCards = {
  lightningBolt: {
    name: "Lightning Bolt",
    mana_cost: "{R}",
    type: "Instant",
    colors: ["R"],
  },
  counterspell: {
    name: "Counterspell",
    mana_cost: "{U}{U}",
    type: "Instant",
    colors: ["U"],
  },
  mountain: {
    name: "Mountain",
    mana_cost: "",
    type: "Basic Land — Mountain",
    colors: [],
  },
};

export const mockApiResponses = {
  cards: {
    lightningBolt: {
      id: "test-card-1",
      name: "Lightning Bolt",
      mana_cost: "{R}",
      cmc: 1,
      type_line: "Instant",
      oracle_text: "Lightning Bolt deals 3 damage to any target.",
      power: null,
      toughness: null,
      colors: ["R"],
      image_uris: {
        small: "https://example.com/lightning-bolt-small.jpg",
        normal: "https://example.com/lightning-bolt.jpg",
      },
    },
    counterspell: {
      id: "test-card-2",
      name: "Counterspell",
      mana_cost: "{U}{U}",
      cmc: 2,
      type_line: "Instant",
      oracle_text: "Counter target spell.",
      power: null,
      toughness: null,
      colors: ["U"],
      image_uris: {
        small: "https://example.com/counterspell-small.jpg",
        normal: "https://example.com/counterspell.jpg",
      },
    },
  },
  decks: {
    basic: {
      id: "test-deck-1",
      name: "Test Deck",
      description: "A test deck for unit tests",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      user_id: "test-user-1",
    },
  },
};
