import { useState, useCallback } from "react";
import type { CreateDeckRequest, UpdateDeckRequest, DeckResponse } from "../types";

export interface UseDeckActionsParams {
  userId: string | null;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface UseDeckActionsReturn {
  createDeck: (deckData: CreateDeckRequest) => Promise<DeckResponse>;
  updateDeck: (deckId: string, data: UpdateDeckRequest) => Promise<DeckResponse>;
  deleteDeck: (deckId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useDeckActions = ({ userId, onSuccess, onError }: UseDeckActionsParams): UseDeckActionsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDeck = useCallback(
    async (deckData: CreateDeckRequest): Promise<DeckResponse> => {
      if (!userId) {
        throw new Error("Użytkownik nie jest zalogowany");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/decks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...deckData,
            user_id: userId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const newDeck: DeckResponse = await response.json();
        onSuccess?.();
        return newDeck;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas tworzenia decka";
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, onSuccess, onError]
  );

  const updateDeck = useCallback(
    async (deckId: string, data: UpdateDeckRequest): Promise<DeckResponse> => {
      if (!userId) {
        throw new Error("Użytkownik nie jest zalogowany");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/decks/${deckId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, user_id: userId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const updatedDeck: DeckResponse = await response.json();
        onSuccess?.();
        return updatedDeck;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas aktualizacji decka";
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, onSuccess, onError]
  );

  const deleteDeck = useCallback(
    async (deckId: string): Promise<void> => {
      if (!userId) {
        throw new Error("Użytkownik nie jest zalogowany");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/decks/${deckId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        onSuccess?.();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas usuwania decka";
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, onSuccess, onError]
  );

  return {
    createDeck,
    updateDeck,
    deleteDeck,
    loading,
    error,
  };
};
