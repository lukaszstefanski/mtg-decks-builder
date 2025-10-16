/**
 * useCardSearch - Custom hook do zarządzania wyszukiwaniem kart
 * Obsługuje stan wyszukiwania, filtry i komunikację z API Scryfall
 */

import { useState, useCallback } from "react";
import { scryfallService } from "../lib/services/scryfall.service";
import type { CardSearchState, FilterState, ScryfallSearchParams } from "../types";

export const useCardSearch = () => {
  const [state, setState] = useState<CardSearchState>({
    query: "",
    filters: { colors: [], manaCost: {}, types: [] },
    results: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 50, total: 0, pages: 0 },
  });

  /**
   * Wyszukiwanie kart w Scryfall
   */
  const searchCards = useCallback(async (params: ScryfallSearchParams) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await scryfallService.searchCards(params);

      setState((prev) => ({
        ...prev,
        results: response.cards,
        pagination: {
          page: params.page || 1,
          limit: 50,
          total: response.total_cards,
          pages: Math.ceil(response.total_cards / 50),
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Błąd wyszukiwania kart w Scryfall:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Błąd wyszukiwania kart",
      }));
    }
  }, []);

  /**
   * Ustawianie filtrów
   */
  const setFilters = useCallback((filters: FilterState) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  /**
   * Ustawianie zapytania wyszukiwania
   */
  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  /**
   * Czyszczenie wyszukiwania
   */
  const clearSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      query: "",
      filters: { colors: [], manaCost: {}, types: [] },
      results: [],
      error: null,
    }));
  }, []);

  /**
   * Ładowanie kolejnej strony wyników
   */
  const loadMore = useCallback(async (params: ScryfallSearchParams) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await scryfallService.searchCards({
        ...params,
        page: (params.page || 1) + 1,
      });

      setState((prev) => ({
        ...prev,
        results: [...prev.results, ...response.cards],
        pagination: {
          page: params.page || 1,
          limit: 50,
          total: response.total_cards,
          pages: Math.ceil(response.total_cards / 50),
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Błąd ładowania kolejnych wyników:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Błąd ładowania wyników",
      }));
    }
  }, []);

  /**
   * Sprawdzanie czy karta jest w wynikach
   */
  const isCardInResults = useCallback(
    (cardId: string) => {
      return state.results.some((card) => card.id === cardId);
    },
    [state.results]
  );

  /**
   * Pobieranie karty z wyników
   */
  const getCardFromResults = useCallback(
    (cardId: string) => {
      return state.results.find((card) => card.id === cardId);
    },
    [state.results]
  );

  return {
    state,
    searchCards,
    setFilters,
    setQuery,
    clearSearch,
    loadMore,
    isCardInResults,
    getCardFromResults,
  };
};
