/**
 * CardItem - Pojedyncza karta w wynikach wyszukiwania
 * Obsługuje wyświetlanie karty i dodawanie do decka
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import type { CardResponse } from '../../types';

export interface CardItemProps {
  card: CardResponse;
  isInDeck: boolean;
  currentQuantity: number;
  canAddMore: boolean;
  onAdd: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  isInDeck,
  currentQuantity,
  canAddMore,
  onAdd,
}) => {
  // Formatowanie kosztu many
  const formatManaCost = (manaCost: string) => {
    if (!manaCost) return '';
    return manaCost.replace(/\{([^}]+)\}/g, '$1');
  };

  // Formatowanie typu karty
  const formatCardType = (type: string) => {
    return type.split(' — ')[0]; // Usunięcie podtypu
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        {/* Obraz karty */}
        <div className="flex-shrink-0">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={card.name}
              className="w-16 h-20 object-cover rounded border"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-20 bg-gray-200 rounded border flex items-center justify-center">
              <span className="text-xs text-gray-500">Brak obrazu</span>
            </div>
          )}
        </div>

        {/* Informacje o karcie */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {card.name}
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                {formatCardType(card.type)}
              </p>
              {card.mana_cost && (
                <p className="text-xs text-gray-500 mt-1">
                  Koszt: {formatManaCost(card.mana_cost)}
                </p>
              )}
              {card.rarity && (
                <p className="text-xs text-gray-500">
                  Rzadkość: {card.rarity}
                </p>
              )}
            </div>

            {/* Przycisk dodawania */}
            <div className="flex-shrink-0 ml-4">
              {isInDeck ? (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    W decku: {currentQuantity}
                  </div>
                  {canAddMore ? (
                    <Button
                      onClick={onAdd}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      + Dodaj
                    </Button>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Limit osiągnięty
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={onAdd}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Dodaj do decka
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
