import { http, HttpResponse } from 'msw'

// Mock data
const mockCards = [
  {
    id: 'test-card-1',
    name: 'Lightning Bolt',
    mana_cost: '{R}',
    cmc: 1,
    type_line: 'Instant',
    oracle_text: 'Lightning Bolt deals 3 damage to any target.',
    power: null,
    toughness: null,
    colors: ['R'],
    image_uris: {
      small: 'https://example.com/lightning-bolt-small.jpg',
      normal: 'https://example.com/lightning-bolt.jpg',
    },
  },
  {
    id: 'test-card-2',
    name: 'Counterspell',
    mana_cost: '{U}{U}',
    cmc: 2,
    type_line: 'Instant',
    oracle_text: 'Counter target spell.',
    power: null,
    toughness: null,
    colors: ['U'],
    image_uris: {
      small: 'https://example.com/counterspell-small.jpg',
      normal: 'https://example.com/counterspell.jpg',
    },
  },
]

const mockDecks = [
  {
    id: 'test-deck-1',
    name: 'Test Deck',
    description: 'A test deck for unit tests',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_id: 'test-user-1',
  },
]

export const handlers = [
  // Scryfall API mocks
  http.get('https://api.scryfall.com/cards/search', () => {
    return HttpResponse.json({
      object: 'list',
      total_cards: mockCards.length,
      has_more: false,
      data: mockCards,
    })
  }),

  http.get('https://api.scryfall.com/cards/:id', ({ params }) => {
    const card = mockCards.find(c => c.id === params.id)
    if (!card) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(card)
  }),

  // Supabase API mocks
  http.get('*/rest/v1/decks*', () => {
    return HttpResponse.json(mockDecks)
  }),

  http.post('*/rest/v1/decks', async ({ request }) => {
    const body = await request.json()
    const newDeck = {
      id: 'new-deck-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(newDeck, { status: 201 })
  }),

  http.patch('*/rest/v1/decks/:id', async ({ params, request }) => {
    const body = await request.json()
    const updatedDeck = {
      id: params.id,
      ...body,
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(updatedDeck)
  }),

  http.delete('*/rest/v1/decks/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Auth mocks
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'test-user-1',
        email: 'test@example.com',
      },
    })
  }),

  http.post('*/auth/v1/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
