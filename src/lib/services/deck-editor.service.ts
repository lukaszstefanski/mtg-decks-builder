/**
 * DeckEditorService - Serwis do komunikacji z API dla edytora decka
 * Obsługuje wszystkie operacje związane z wyszukiwaniem kart i zarządzaniem kartami w decku
 */

import type {
  CardSearchParams,
  CardSearchResponse,
  DeckResponse,
  DeckCardsResponse,
  AddCardToDeckRequest,
  UpdateDeckCardRequest,
  DeckCardResponse,
  UpdateDeckRequest,
} from '../../types';

export class DeckEditorService {
  private baseUrl = '/api';

  /**
   * Wyszukiwanie kart
   */
  async searchCards(params: CardSearchParams): Promise<CardSearchResponse> {
    const searchParams = new URLSearchParams();
    
    // Dodawanie parametrów wyszukiwania
    if (params.q) searchParams.append('q', params.q);
    if (params.colors?.length) searchParams.append('colors', params.colors.join(','));
    if (params.mana_cost) searchParams.append('mana_cost', params.mana_cost);
    if (params.type?.length) searchParams.append('type', params.type.join(','));
    if (params.rarity?.length) searchParams.append('rarity', params.rarity.join(','));
    if (params.set) searchParams.append('set', params.set);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.order) searchParams.append('order', params.order);

    const response = await fetch(`${this.baseUrl}/cards/search?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`Błąd wyszukiwania kart: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Pobieranie metadanych decka
   */
  async getDeck(deckId: string): Promise<DeckResponse> {
    const response = await fetch(`${this.baseUrl}/decks/${deckId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Deck nie został znaleziony');
      }
      throw new Error(`Błąd pobierania decka: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Aktualizacja metadanych decka
   */
  async updateDeck(deckId: string, data: UpdateDeckRequest): Promise<DeckResponse> {
    const response = await fetch(`${this.baseUrl}/decks/${deckId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Błąd aktualizacji decka: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Pobieranie kart decka
   */
  async getDeckCards(deckId: string): Promise<DeckCardsResponse> {
    const response = await fetch(`${this.baseUrl}/decks/${deckId}/cards`);
    
    if (!response.ok) {
      throw new Error(`Błąd pobierania kart decka: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Dodawanie karty do decka
   */
  async addCardToDeck(deckId: string, data: AddCardToDeckRequest): Promise<DeckCardResponse> {
    const response = await fetch(`${this.baseUrl}/decks/${deckId}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nieprawidłowe dane karty');
      }
      if (response.status === 409) {
        throw new Error('Karta już istnieje w decku');
      }
      throw new Error(`Błąd dodawania karty: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Aktualizacja karty w decku
   */
  async updateDeckCard(deckId: string, cardId: string, data: UpdateDeckCardRequest): Promise<DeckCardResponse> {
    const response = await fetch(`${this.baseUrl}/decks/${deckId}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Karta nie została znaleziona w decku');
      }
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nieprawidłowe dane karty');
      }
      throw new Error(`Błąd aktualizacji karty: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Usuwanie karty z decka
   */
  async removeDeckCard(deckId: string, cardId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/decks/${deckId}/cards/${cardId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Karta nie została znaleziona w decku');
      }
      throw new Error(`Błąd usuwania karty: ${response.statusText}`);
    }
  }

  /**
   * Sprawdzanie czy karta jest w decku
   */
  async isCardInDeck(deckId: string, cardId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/decks/${deckId}/cards/${cardId}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Pobieranie ilości karty w decku
   */
  async getCardQuantity(deckId: string, cardId: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/decks/${deckId}/cards/${cardId}`);
      if (response.ok) {
        const cardData = await response.json();
        return cardData.quantity || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  }
}

// Singleton instance
export const deckEditorService = new DeckEditorService();
