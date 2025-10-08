/**
 * CardFilters - Zestaw filtrów do zawężania wyników wyszukiwania kart
 * Obsługuje filtry kolorów, kosztu many i typów kart
 */

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { FilterState } from "../../types";

export interface CardFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

// Dostępne kolory w Magic: The Gathering
const AVAILABLE_COLORS = [
  { value: "W", label: "Biały", color: "bg-white border-gray-300" },
  { value: "U", label: "Niebieski", color: "bg-blue-500" },
  { value: "B", label: "Czarny", color: "bg-gray-800" },
  { value: "R", label: "Czerwony", color: "bg-red-500" },
  { value: "G", label: "Zielony", color: "bg-green-500" },
  { value: "C", label: "Bezbarwny", color: "bg-gray-300" },
];

// Dostępne typy kart
const AVAILABLE_TYPES = ["Creature", "Instant", "Sorcery", "Enchantment", "Artifact", "Planeswalker", "Land", "Tribal"];

export const CardFilters: React.FC<CardFiltersProps> = ({ filters, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Obsługa zmiany filtrów kolorów
  const handleColorChange = useCallback(
    (color: string, checked: boolean) => {
      const newColors = checked ? [...filters.colors, color] : filters.colors.filter((c) => c !== color);

      onChange({ ...filters, colors: newColors });
    },
    [filters, onChange]
  );

  // Obsługa zmiany typów kart
  const handleTypeChange = useCallback(
    (type: string, checked: boolean) => {
      const newTypes = checked ? [...filters.types, type] : filters.types.filter((t) => t !== type);

      onChange({ ...filters, types: newTypes });
    },
    [filters, onChange]
  );

  // Obsługa resetu wszystkich filtrów
  const handleReset = useCallback(() => {
    onChange({ colors: [], manaCost: {}, types: [] });
  }, [onChange]);

  // Sprawdzenie czy są aktywne filtry
  const hasActiveFilters =
    filters.colors.length > 0 ||
    filters.types.length > 0 ||
    Object.values(filters.manaCost).some((value) => value !== undefined);

  return (
    <div className="space-y-4">
      {/* Przycisk rozwijania/zwijania filtrów */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span>Filtry wyszukiwania</span>
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {hasActiveFilters && (
          <Button onClick={handleReset} variant="outline" size="sm">
            Wyczyść filtry
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-6 border-t pt-4">
          {/* Filtry kolorów */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Kolory</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <label key={color.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.value)}
                    onChange={(e) => handleColorChange(color.value, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      filters.colors.includes(color.value) ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
                    } ${color.color}`}
                  >
                    {color.value}
                  </div>
                  <span className="text-sm text-gray-700">{color.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtry typów kart */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Typy kart</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_TYPES.map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={(e) => handleTypeChange(type, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
