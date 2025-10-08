/**
 * CardResults - Lista wyników wyszukiwania kart z paginacją
 * Obsługuje wyświetlanie kart, paginację i dodawanie kart do decka
 */

import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CardItem } from "./CardItem";
import type { ScryfallCardResponse, PaginationInfo, DeckCardResponse } from "../../types";

export interface CardResultsProps {
  cards: ScryfallCardResponse[];
  pagination: PaginationInfo;
  onAddCard: (card: ScryfallCardResponse) => void;
  deckCards: DeckCardResponse[];
  loading?: boolean;
  error?: string | null;
}

export const CardResults: React.FC<CardResultsProps> = ({
  cards,
  pagination,
  onAddCard,
  deckCards,
  loading = false,
  error = null,
}) => {
  // Sprawdzanie czy karta jest w decku (używając scryfall_id)
  const isCardInDeck = useCallback(
    (scryfallId: string) => {
      return deckCards.some((deckCard) => deckCard.card.scryfall_id === scryfallId);
    },
    [deckCards]
  );

  // Pobieranie ilości karty w decku (używając scryfall_id)
  const getCardQuantity = useCallback(
    (scryfallId: string) => {
      const deckCard = deckCards.find((deckCard) => deckCard.card.scryfall_id === scryfallId);
      return deckCard?.quantity || 0;
    },
    [deckCards]
  );

  // Sprawdzanie czy można dodać więcej kart
  const canAddMoreCards = useCallback(
    (card: ScryfallCardResponse) => {
      const currentQuantity = getCardQuantity(card.scryfall_id);
      const isLand = card.type.toLowerCase().includes("land");

      // Landy nie mają limitu, inne karty maksymalnie 4
      return isLand || currentQuantity < 4;
    },
    [getCardQuantity]
  );

  // Obsługa dodawania karty
  const handleAddCard = useCallback(
    (card: ScryfallCardResponse) => {
      if (canAddMoreCards(card)) {
        onAddCard(card);
      }
    },
    [onAddCard, canAddMoreCards]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Ładowanie kart...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg mb-2">Błąd ładowania kart</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-gray-600 text-lg mb-2">Brak wyników wyszukiwania</div>
          <div className="text-gray-500">Spróbuj zmienić kryteria wyszukiwania</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header z informacjami o wynikach */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Wyniki wyszukiwania</h3>
          <div className="text-sm text-gray-600">{pagination.total} kart</div>
        </div>
      </div>

      {/* Lista kart */}
      <div className="divide-y">
        {cards.map((card) => (
          <CardItem
            key={card.scryfall_id}
            card={card}
            isInDeck={isCardInDeck(card.scryfall_id)}
            currentQuantity={getCardQuantity(card.scryfall_id)}
            canAddMore={canAddMoreCards(card)}
            onAdd={() => handleAddCard(card)}
          />
        ))}
      </div>

      {/* Paginacja */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Strona {pagination.page} z {pagination.pages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => {
                  // TODO: Implementacja ładowania poprzedniej strony
                }}
              >
                Poprzednia
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => {
                  // TODO: Implementacja ładowania następnej strony
                }}
              >
                Następna
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
