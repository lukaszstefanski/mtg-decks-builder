/**
 * useDeckCards - Custom hook do zarządzania kartami w decku
 * Obsługuje dodawanie, aktualizację i usuwanie kart z decka
 */

import { useState, useCallback, useEffect } from "react";
import { deckEditorService } from "../lib/services/deck-editor.service";
import type {
  DeckState,
  CardResponse,
  AddCardToDeckRequest,
  UpdateDeckCardRequest,
  ScryfallCardResponse,
} from "../types";

export const useDeckCards = (deckId: string) => {
  const [state, setState] = useState<DeckState>({
    cards: [],
    totalCount: 0,
    loading: false,
    error: null,
  });

  /**
   * Ładowanie kart decka
   */
  const loadCards = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await deckEditorService.getDeckCards(deckId);

      setState((prev) => ({
        ...prev,
        cards: response.cards,
        totalCount: response.pagination.total,
        loading: false,
      }));
    } catch (error) {
      console.error("Błąd ładowania kart decka:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Błąd ładowania kart decka",
      }));
    }
  }, [deckId]);

  /**
   * Dodawanie karty do decka (dla kart z lokalnej bazy)
   */
  const addCard = useCallback(
    async (card: CardResponse, quantity = 1, notes?: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const addCardData: AddCardToDeckRequest = {
          card_id: card.id,
          quantity,
          notes,
          is_sideboard: false,
        };

        const newDeckCard = await deckEditorService.addCardToDeck(deckId, addCardData);

        setState((prev) => {
          // Sprawdź czy karta już istnieje w decku
          const existingCardIndex = prev.cards.findIndex((deckCard) => deckCard.card_id === newDeckCard.card_id);

          if (existingCardIndex >= 0) {
            // Karta już istnieje - aktualizuj ją
            const updatedCards = [...prev.cards];
            updatedCards[existingCardIndex] = newDeckCard;

            return {
              ...prev,
              cards: updatedCards,
              totalCount: prev.totalCount + quantity,
              loading: false,
            };
          } else {
            // Nowa karta - dodaj do listy
            return {
              ...prev,
              cards: [...prev.cards, newDeckCard],
              totalCount: prev.totalCount + quantity,
              loading: false,
            };
          }
        });

        return newDeckCard;
      } catch (error) {
        console.error("Błąd dodawania karty:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Błąd dodawania karty",
        }));
        throw error;
      }
    },
    [deckId]
  );

  /**
   * Dodawanie karty z Scryfall do decka
   */
  const addScryfallCard = useCallback(
    async (card: ScryfallCardResponse, quantity = 1, notes?: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const newDeckCard = await deckEditorService.addScryfallCardToDeck(deckId, card, quantity, notes);

        setState((prev) => {
          // Sprawdź czy karta już istnieje w decku
          const existingCardIndex = prev.cards.findIndex((deckCard) => deckCard.card_id === newDeckCard.card_id);

          if (existingCardIndex >= 0) {
            // Karta już istnieje - aktualizuj ją
            const updatedCards = [...prev.cards];
            updatedCards[existingCardIndex] = newDeckCard;

            return {
              ...prev,
              cards: updatedCards,
              totalCount: prev.totalCount + quantity,
              loading: false,
            };
          } else {
            // Nowa karta - dodaj do listy
            return {
              ...prev,
              cards: [...prev.cards, newDeckCard],
              totalCount: prev.totalCount + quantity,
              loading: false,
            };
          }
        });

        return newDeckCard;
      } catch (error) {
        console.error("Błąd dodawania karty z Scryfall:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Błąd dodawania karty z Scryfall",
        }));
        throw error;
      }
    },
    [deckId]
  );

  /**
   * Aktualizacja karty w decku
   */
  const updateCard = useCallback(
    async (cardId: string, data: UpdateDeckCardRequest) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const updatedCard = await deckEditorService.updateDeckCard(deckId, cardId, data);

        setState((prev) => ({
          ...prev,
          cards: prev.cards.map((card) => (card.card_id === updatedCard.card_id ? updatedCard : card)),
          totalCount:
            prev.totalCount + (data.quantity || 0) - (prev.cards.find((c) => c.card_id === cardId)?.quantity || 0),
          loading: false,
        }));

        return updatedCard;
      } catch (error) {
        console.error("Błąd aktualizacji karty:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Błąd aktualizacji karty",
        }));
        throw error;
      }
    },
    [deckId]
  );

  /**
   * Usuwanie karty z decka
   */
  const removeCard = useCallback(
    async (cardId: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Znajdź kartę do usunięcia w aktualnym stanie
        const cardToRemove = state.cards.find((card) => card.card_id === cardId);
        if (!cardToRemove) {
          throw new Error("Karta nie została znaleziona w decku");
        }

        await deckEditorService.removeDeckCard(deckId, cardId);

        setState((prev) => ({
          ...prev,
          cards: prev.cards.filter((card) => card.card_id !== cardId),
          totalCount: prev.totalCount - cardToRemove.quantity,
          loading: false,
        }));
      } catch (error) {
        console.error("Błąd usuwania karty:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Błąd usuwania karty",
        }));
        throw error;
      }
    },
    [deckId, state.cards]
  );

  /**
   * Odświeżanie kart decka
   */
  const refreshCards = useCallback(async () => {
    await loadCards();
  }, [loadCards]);

  /**
   * Sprawdzanie czy karta jest w decku
   */
  const isCardInDeck = useCallback(
    (cardId: string) => {
      return state.cards.some((card) => card.card_id === cardId);
    },
    [state.cards]
  );

  /**
   * Pobieranie ilości karty w decku
   */
  const getCardQuantity = useCallback(
    (cardId: string) => {
      const deckCard = state.cards.find((card) => card.card_id === cardId);
      return deckCard?.quantity || 0;
    },
    [state.cards]
  );

  /**
   * Sprawdzanie czy można dodać więcej kart
   */
  const canAddMoreCards = useCallback(
    (cardId: string, cardType: string) => {
      const currentQuantity = getCardQuantity(cardId);
      const isLand = cardType.toLowerCase().includes("land");

      // Landy nie mają limitu, inne karty maksymalnie 4
      return isLand || currentQuantity < 4;
    },
    [getCardQuantity]
  );

  /**
   * Pobieranie statystyk decka
   */
  const getDeckStats = useCallback(() => {
    const totalCards = state.cards.reduce((sum, card) => sum + card.quantity, 0);
    const uniqueCards = state.cards.length;
    const lands = state.cards
      .filter((card) => card.card.type.toLowerCase().includes("land"))
      .reduce((sum, card) => sum + card.quantity, 0);
    const nonLands = totalCards - lands;

    return {
      totalCards,
      uniqueCards,
      lands,
      nonLands,
    };
  }, [state.cards]);

  // Automatyczne ładowanie kart przy inicjalizacji
  useEffect(() => {
    if (deckId) {
      loadCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);

  return {
    state,
    loadCards,
    addCard,
    addScryfallCard,
    updateCard,
    removeCard,
    refreshCards,
    isCardInDeck,
    getCardQuantity,
    canAddMoreCards,
    getDeckStats,
  };
};
