/**
 * DeckCardItem - Pojedyncza karta w decku z kontrolami ilości
 * Obsługuje edycję ilości, usuwanie i wyświetlanie informacji o karcie
 */

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { DeckCardResponse, UpdateDeckCardRequest } from "../../types";

export interface DeckCardItemProps {
  card: DeckCardResponse;
  onUpdate: (cardId: string, data: UpdateDeckCardRequest) => void;
  onRemove: (cardId: string) => void;
}

export const DeckCardItem: React.FC<DeckCardItemProps> = ({ card, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(card.quantity);
  const [notes, setNotes] = useState(card.notes || "");

  // Sprawdzanie czy karta to land
  const isLand = card.card.type.toLowerCase().includes("land");

  // Maksymalna ilość (landy bez limitu, inne karty max 4)
  const maxQuantity = isLand ? 999 : 4;

  // Obsługa zmiany ilości
  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity >= 0 && newQuantity <= maxQuantity) {
        setQuantity(newQuantity);
      }
    },
    [maxQuantity]
  );

  // Obsługa zapisywania zmian
  const handleSave = useCallback(() => {
    if (quantity !== card.quantity || notes !== (card.notes || "")) {
      onUpdate(card.id, {
        quantity,
        notes: notes.trim() || undefined,
      });
    }
    setIsEditing(false);
  }, [card.id, card.quantity, card.notes, quantity, notes, onUpdate]);

  // Obsługa anulowania edycji
  const handleCancel = useCallback(() => {
    setQuantity(card.quantity);
    setNotes(card.notes || "");
    setIsEditing(false);
  }, [card.quantity, card.notes]);

  // Obsługa usuwania karty
  const handleRemove = useCallback(() => {
    if (window.confirm(`Czy na pewno chcesz usunąć "${card.card.name}" z decka?`)) {
      onRemove(card.id);
    }
  }, [card.id, card.card.name, onRemove]);

  // Formatowanie kosztu many
  const formatManaCost = (manaCost: string) => {
    if (!manaCost) return "";
    return manaCost.replace(/\{([^}]+)\}/g, "$1");
  };

  // Formatowanie typu karty
  const formatCardType = (type: string) => {
    return type.split(" — ")[0]; // Usunięcie podtypu
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        {/* Obraz karty */}
        <div className="flex-shrink-0">
          {card.card.image_url ? (
            <img
              src={card.card.image_url}
              alt={card.card.name}
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
              <h4 className="text-sm font-medium text-gray-900 truncate">{card.card.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{formatCardType(card.card.type)}</p>
              {card.card.mana_cost && (
                <p className="text-xs text-gray-500 mt-1">Koszt: {formatManaCost(card.card.mana_cost)}</p>
              )}
              {card.notes && <p className="text-xs text-gray-500 mt-1 italic">Notatka: {card.notes}</p>}
            </div>

            {/* Kontrolki ilości */}
            <div className="flex-shrink-0 ml-4">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 0}
                      size="sm"
                      variant="outline"
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                      min="0"
                      max={maxQuantity}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                    <Button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      size="sm"
                      variant="outline"
                    >
                      +
                    </Button>
                  </div>

                  {/* Pole notatek */}
                  <div>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notatka (opcjonalnie)"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      maxLength={200}
                    />
                  </div>

                  {/* Przyciski akcji */}
                  <div className="flex space-x-1">
                    <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                      Zapisz
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline" className="text-xs">
                      Anuluj
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Ilość: {card.quantity}</div>
                  <div className="flex space-x-1">
                    <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="text-xs">
                      Edytuj
                    </Button>
                    <Button
                      onClick={handleRemove}
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Usuń
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
