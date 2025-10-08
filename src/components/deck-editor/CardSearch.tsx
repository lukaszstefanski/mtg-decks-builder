/**
 * CardSearch - Komponent wyszukiwania kart z polem tekstowym i filtrami
 * Obsługuje wyszukiwanie w czasie rzeczywistym z debouncing
 */

import React, { useState, useCallback, useEffect } from "react";
import { CardFilters } from "./CardFilters";
import type { CardSearchParams, FilterState } from "../../types";

export interface CardSearchProps {
  onSearch: (params: CardSearchParams) => void;
  onFiltersChange: (filters: FilterState) => void;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  debounceTimeout: NodeJS.Timeout | null;
}

export const CardSearch: React.FC<CardSearchProps> = ({ onSearch, onFiltersChange }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    isSearching: false,
    debounceTimeout: null,
  });

  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    manaCost: {},
    types: [],
  });

  // Debounced search - wyszukiwanie z opóźnieniem 300ms
  const debouncedSearch = useCallback(
    (query: string, currentFilters: FilterState) => {
      if (searchState.debounceTimeout) {
        clearTimeout(searchState.debounceTimeout);
      }

      const timeout = setTimeout(() => {
        const searchParams: CardSearchParams = {
          q: query.trim() || undefined,
          colors: currentFilters.colors.length > 0 ? currentFilters.colors : undefined,
          mana_cost:
            currentFilters.manaCost.exact?.toString() ||
            (currentFilters.manaCost.min !== undefined && currentFilters.manaCost.max !== undefined)
              ? `${currentFilters.manaCost.min}-${currentFilters.manaCost.max}`
              : undefined,
          type: currentFilters.types.length > 0 ? currentFilters.types : undefined,
          page: 1,
          limit: 50,
        };

        onSearch(searchParams);
        setSearchState((prev) => ({ ...prev, isSearching: false }));
      }, 300);

      setSearchState((prev) => ({ ...prev, debounceTimeout: timeout }));
    },
    [onSearch, searchState.debounceTimeout]
  );

  // Obsługa zmiany zapytania wyszukiwania
  const handleQueryChange = useCallback(
    (query: string) => {
      setSearchState((prev) => ({ ...prev, query, isSearching: true }));
      debouncedSearch(query, filters);
    },
    [debouncedSearch, filters]
  );

  // Obsługa zmiany filtrów
  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      onFiltersChange(newFilters);
      debouncedSearch(searchState.query, newFilters);
    },
    [onFiltersChange, debouncedSearch, searchState.query]
  );

  // Obsługa czyszczenia wyszukiwania
  const handleClearSearch = useCallback(() => {
    setSearchState((prev) => ({ ...prev, query: "", isSearching: false }));
    setFilters({ colors: [], manaCost: {}, types: [] });
    onFiltersChange({ colors: [], manaCost: {}, types: [] });

    if (searchState.debounceTimeout) {
      clearTimeout(searchState.debounceTimeout);
    }

    // Wyszukiwanie pustego zapytania
    onSearch({ page: 1, limit: 50 });
  }, [onSearch, onFiltersChange, searchState.debounceTimeout]);

  // Czyszczenie timeout przy unmount
  useEffect(() => {
    return () => {
      if (searchState.debounceTimeout) {
        clearTimeout(searchState.debounceTimeout);
      }
    };
  }, [searchState.debounceTimeout]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="space-y-4">
        {/* Pole wyszukiwania */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wyszukaj karty</label>
          <div className="relative">
            <input
              type="text"
              value={searchState.query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Wprowadź nazwę karty, typ, lub inne słowa kluczowe..."
            />

            {/* Wskaźnik ładowania */}
            {searchState.isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Przycisk czyszczenia */}
            {(searchState.query ||
              filters.colors.length > 0 ||
              filters.types.length > 0 ||
              Object.keys(filters.manaCost).length > 0) && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtry wyszukiwania */}
        <CardFilters filters={filters} onChange={handleFiltersChange} />
      </div>
    </div>
  );
};
