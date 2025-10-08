/**
 * DeckHeader - Wyświetla metadane decka z możliwością edycji
 * Obsługuje edycję nazwy, formatu i opisu decka
 */

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { DeckResponse, UpdateDeckRequest } from "../../types";

export interface DeckHeaderProps {
  deck: DeckResponse | null;
  onUpdate: (data: UpdateDeckRequest) => void;
}

export interface DeckMetadata {
  id: string;
  name: string;
  format: string;
  description?: string;
}

export const DeckHeader: React.FC<DeckHeaderProps> = ({ deck, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: deck?.name || "",
    format: deck?.format || "",
    description: deck?.description || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Walidacja formularza
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nazwa decka jest wymagana";
    } else if (formData.name.length > 100) {
      newErrors.name = "Nazwa decka nie może przekraczać 100 znaków";
    }

    if (!formData.format) {
      newErrors.format = "Format decka jest wymagany";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Opis nie może przekraczać 500 znaków";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Obsługa zmiany wartości w formularzu
  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Czyszczenie błędu dla danego pola
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Obsługa zapisywania zmian
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onUpdate({
        name: formData.name.trim(),
        format: formData.format,
        description: formData.description.trim() || undefined,
      });

      setIsEditing(false);
    } catch (error) {
      // Obsługa błędu
    }
  }, [formData, validateForm, onUpdate]);

  // Obsługa anulowania edycji
  const handleCancel = useCallback(() => {
    setFormData({
      name: deck?.name || "",
      format: deck?.format || "",
      description: deck?.description || "",
    });
    setErrors({});
    setIsEditing(false);
  }, [deck]);

  // Obsługa rozpoczęcia edycji
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Jeśli deck jest null, nie renderuj komponentu
  if (!deck) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edycja decka" : deck.name}</h1>

        {!isEditing && (
          <Button onClick={handleEdit} variant="outline">
            Edytuj
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Nazwa decka */}
        <div>
          <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa decka *
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              id="deck-name"
              placeholder="Wprowadź nazwę decka"
              maxLength={100}
            />
          ) : (
            <div className="text-lg text-gray-900">{deck.name}</div>
          )}
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Format decka */}
        <div>
          <label htmlFor="deck-format" className="block text-sm font-medium text-gray-700 mb-1">
            Format *
          </label>
          {isEditing ? (
            <select
              value={formData.format}
              onChange={(e) => handleInputChange("format", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.format ? "border-red-500" : "border-gray-300"
              }`}
              id="deck-format"
            >
              <option value="">Wybierz format</option>
              <option value="standard">Standard</option>
              <option value="modern">Modern</option>
              <option value="legacy">Legacy</option>
              <option value="vintage">Vintage</option>
              <option value="commander">Commander</option>
              <option value="pioneer">Pioneer</option>
              <option value="historic">Historic</option>
            </select>
          ) : (
            <div className="text-lg text-gray-900 capitalize">{deck.format}</div>
          )}
          {errors.format && <p className="mt-1 text-sm text-red-600">{errors.format}</p>}
        </div>

        {/* Opis decka */}
        <div>
          <label htmlFor="deck-description" className="block text-sm font-medium text-gray-700 mb-1">
            Opis
          </label>
          {isEditing ? (
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              id="deck-description"
              placeholder="Wprowadź opis decka (opcjonalnie)"
              rows={3}
              maxLength={500}
            />
          ) : (
            <div className="text-gray-900">{deck.description || "Brak opisu"}</div>
          )}
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Przyciski akcji */}
        {isEditing && (
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Zapisz
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Anuluj
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
