/**
 * useDeckMetadata - Custom hook do zarządzania metadanymi decka
 * Obsługuje ładowanie i aktualizację metadanych decka
 */

import { useState, useCallback } from "react";
import { deckEditorService } from "../lib/services/deck-editor.service";
import type { DeckResponse, UpdateDeckRequest } from "../types";

export interface DeckMetadataState {
  deck: DeckResponse | null;
  loading: boolean;
  error: string | null;
}

export const useDeckMetadata = (deckId: string) => {
  const [state, setState] = useState<DeckMetadataState>({
    deck: null,
    loading: false,
    error: null,
  });

  /**
   * Ładowanie metadanych decka
   */
  const loadDeck = useCallback(async (): Promise<DeckResponse | null> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const deck = await deckEditorService.getDeck(deckId);

      setState((prev) => ({
        ...prev,
        deck,
        loading: false,
      }));

      return deck;
    } catch (error) {
      console.error("Błąd ładowania decka:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Błąd ładowania decka",
      }));
      return null;
    }
  }, [deckId]);

  /**
   * Aktualizacja metadanych decka
   */
  const updateDeck = useCallback(
    async (data: UpdateDeckRequest): Promise<DeckResponse | null> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const updatedDeck = await deckEditorService.updateDeck(deckId, data);

        setState((prev) => ({
          ...prev,
          deck: updatedDeck,
          loading: false,
        }));

        return updatedDeck;
      } catch (error) {
        console.error("Błąd aktualizacji decka:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Błąd aktualizacji decka",
        }));
        throw error;
      }
    },
    [deckId]
  );

  /**
   * Odświeżanie metadanych decka
   */
  const refreshDeck = useCallback(async () => {
    return await loadDeck();
  }, [loadDeck]);

  /**
   * Czyszczenie stanu
   */
  const clearState = useCallback(() => {
    setState({
      deck: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Sprawdzanie czy deck jest załadowany
   */
  const isDeckLoaded = useCallback(() => {
    return state.deck !== null && !state.loading && !state.error;
  }, [state.deck, state.loading, state.error]);

  /**
   * Pobieranie nazwy decka
   */
  const getDeckName = useCallback(() => {
    return state.deck?.name || "";
  }, [state.deck]);

  /**
   * Pobieranie formatu decka
   */
  const getDeckFormat = useCallback(() => {
    return state.deck?.format || "";
  }, [state.deck]);

  /**
   * Pobieranie opisu decka
   */
  const getDeckDescription = useCallback(() => {
    return state.deck?.description || "";
  }, [state.deck]);

  return {
    state,
    loadDeck,
    updateDeck,
    refreshDeck,
    clearState,
    isDeckLoaded,
    getDeckName,
    getDeckFormat,
    getDeckDescription,
  };
};
