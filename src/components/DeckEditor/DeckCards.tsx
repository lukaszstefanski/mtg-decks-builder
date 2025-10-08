/**
 * DeckCards - Lista kart w aktualnym decku z możliwością edycji
 * Obsługuje wyświetlanie kart decka, edycję ilości i usuwanie
 */

import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DeckCardItem } from './DeckCardItem';
import type { DeckCardResponse, UpdateDeckCardRequest } from '../../types';

export interface DeckCardsProps {
  cards: DeckCardResponse[];
  onUpdate: (cardId: string, data: UpdateDeckCardRequest) => void;
  onRemove: (cardId: string) => void;
  loading?: boolean;
  error?: string | null;
}

export const DeckCards: React.FC<DeckCardsProps> = ({
  cards,
  onUpdate,
  onRemove,
  loading = false,
  error = null,
}) => {
  // Obliczanie statystyk decka
  const deckStats = useMemo(() => {
    const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);
    const uniqueCards = cards.length;
    const lands = cards.filter(card => 
      card.card.type.toLowerCase().includes('land')
    ).reduce((sum, card) => sum + card.quantity, 0);
    const nonLands = totalCards - lands;

    return {
      totalCards,
      uniqueCards,
      lands,
      nonLands,
    };
  }, [cards]);

  // Obsługa aktualizacji karty
  const handleUpdateCard = useCallback((cardId: string, data: UpdateDeckCardRequest) => {
    onUpdate(cardId, data);
  }, [onUpdate]);

  // Obsługa usuwania karty
  const handleRemoveCard = useCallback((cardId: string) => {
    onRemove(cardId);
  }, [onRemove]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Ładowanie kart decka...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg mb-2">Błąd ładowania kart decka</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header z statystykami */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Karty w decku
          </h3>
          <div className="text-sm text-gray-600">
            {deckStats.totalCards} kart
          </div>
        </div>
        
        {/* Statystyki decka */}
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Unikalne karty:</span>
            <span className="font-medium">{deckStats.uniqueCards}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Landy:</span>
            <span className="font-medium">{deckStats.lands}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pozostałe:</span>
            <span className="font-medium">{deckStats.nonLands}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Razem:</span>
            <span className="font-medium">{deckStats.totalCards}</span>
          </div>
        </div>
      </div>

      {/* Lista kart */}
      {cards.length === 0 ? (
        <div className="p-6 text-center">
          <div className="text-gray-500 text-lg mb-2">Deck jest pusty</div>
          <div className="text-gray-400">Dodaj karty używając wyszukiwarki po lewej stronie</div>
        </div>
      ) : (
        <div className="divide-y">
          {cards.map((card) => (
            <DeckCardItem
              key={card.id}
              card={card}
              onUpdate={handleUpdateCard}
              onRemove={handleRemoveCard}
            />
          ))}
        </div>
      )}
    </div>
  );
};
