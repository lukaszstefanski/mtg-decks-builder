/**
 * DeckEditor - Główny kontener widoku edytora decka
 * Zarządza stanem całego widoku i koordynuje komunikację między komponentami
 */

import React, { useState, useEffect, useCallback } from "react";
import { DeckHeader } from "./DeckHeader";
import { CardSearch } from "./CardSearch";
import { CardResults } from "./CardResults";
import { DeckCards } from "./DeckCards";
import { useCardSearch } from "../../hooks/useCardSearch";
import { useDeckCards } from "../../hooks/useDeckCards";
import { useDeckMetadata } from "../../hooks/useDeckMetadata";
import type {
  DeckResponse,
  ScryfallCardResponse,
  UpdateDeckRequest,
  ScryfallSearchParams,
  UpdateDeckCardRequest,
} from "../../types";

export interface DeckEditorProps {
  deckId: string;
  user?: { id?: string; email?: string; username?: string } | null;
}

export interface DeckEditorState {
  deck: DeckResponse | null;
  loading: boolean;
  error: string | null;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({ deckId, user }) => {
  const [state, setState] = useState<DeckEditorState>({
    deck: null,
    loading: true,
    error: null,
  });

  // Custom hooki do zarządzania stanem
  const cardSearch = useCardSearch();
  const deckCards = useDeckCards(deckId);
  const deckMetadata = useDeckMetadata(deckId, user?.id);

  // Ładowanie danych decka przy inicjalizacji
  useEffect(() => {
    const loadDeckData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Ładowanie metadanych decka
        const deck = await deckMetadata.loadDeck();

        if (!deck) {
          throw new Error("Deck nie został znaleziony");
        }

        setState((prev) => ({ ...prev, deck, loading: false }));

        // Ładowanie kart decka
        await deckCards.loadCards();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Nieoczekiwany błąd",
        }));
      }
    };

    loadDeckData();
  }, [deckId]);

  // Obsługa dodawania karty do decka
  const handleAddCard = useCallback(
    async (card: ScryfallCardResponse) => {
      try {
        await deckCards.addScryfallCard(card);
        // Opcjonalnie można dodać toast notification
      } catch (error) {
        console.error("Błąd dodawania karty:", error);
        // Obsługa błędu - można dodać toast notification
      }
    },
    [deckCards]
  );

  // Obsługa aktualizacji karty w decku
  const handleUpdateCard = useCallback(
    async (cardId: string, data: UpdateDeckCardRequest) => {
      try {
        await deckCards.updateCard(cardId, data);
      } catch (error) {
        console.error("Błąd aktualizacji karty:", error);
        // Obsługa błędu
      }
    },
    [deckCards]
  );

  // Obsługa usuwania karty z decka
  const handleRemoveCard = useCallback(
    async (cardId: string) => {
      try {
        await deckCards.removeCard(cardId);
      } catch (error) {
        console.error("Błąd usuwania karty:", error);
        // Obsługa błędu
      }
    },
    [deckCards]
  );

  // Obsługa aktualizacji metadanych decka
  const handleUpdateDeck = useCallback(
    async (data: UpdateDeckRequest) => {
      try {
        await deckMetadata.updateDeck(data);
        setState((prev) => ({ ...prev, deck: prev.deck ? { ...prev.deck, ...data } : null }));
      } catch (error) {
        console.error("Błąd aktualizacji decka:", error);
        // Obsługa błędu
      }
    },
    [deckMetadata]
  );

  // Obsługa wyszukiwania kart
  const handleSearch = useCallback(
    async (params: ScryfallSearchParams) => {
      try {
        await cardSearch.searchCards(params);
      } catch (error) {
        console.error("Błąd wyszukiwania kart:", error);
        // Obsługa błędu
      }
    },
    [cardSearch]
  );

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Ładowanie decka...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">Błąd: {state.error}</div>
      </div>
    );
  }

  if (!state.deck) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Deck nie został znaleziony</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header z metadanymi decka */}
        <DeckHeader deck={state.deck} onUpdate={handleUpdateDeck} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lewa kolumna - Wyszukiwanie kart */}
          <div className="space-y-6">
            <CardSearch onSearch={handleSearch} onFiltersChange={cardSearch.setFilters} />

            <CardResults
              cards={cardSearch.state.results}
              pagination={cardSearch.state.pagination}
              onAddCard={handleAddCard}
              deckCards={deckCards.state.cards}
              loading={cardSearch.state.loading}
              error={cardSearch.state.error}
            />
          </div>

          {/* Prawa kolumna - Karty w decku */}
          <div className="space-y-6">
            <DeckCards cards={deckCards.state.cards} onUpdate={handleUpdateCard} onRemove={handleRemoveCard} />
          </div>
        </div>
      </div>
    </div>
  );
};
