import { useState, useEffect, useCallback } from "react";
import type { DeckResponse, DeckListResponse, PaginationInfo } from "../types";

export interface UseDeckListParams {
  search?: string;
  format?: string | null;
  sortBy?: "created_at" | "last_modified" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface UseDeckListReturn {
  decks: DeckResponse[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  refetch: () => Promise<void>;
}

export const useDeckList = (params: UseDeckListParams): UseDeckListReturn => {
  const [decks, setDecks] = useState<DeckResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      if (params.search) {
        searchParams.append("search", params.search);
      }
      if (params.format) {
        searchParams.append("format", params.format);
      }
      if (params.sortBy) {
        searchParams.append("sort", params.sortBy);
      }
      if (params.sortOrder) {
        searchParams.append("order", params.sortOrder);
      }
      if (params.page) {
        searchParams.append("page", params.page.toString());
      }
      if (params.limit) {
        searchParams.append("limit", params.limit.toString());
      }

      const response = await fetch(`/api/decks?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DeckListResponse = await response.json();
      setDecks(data.decks);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas ładowania decków";
      setError(errorMessage);
      console.error("Error fetching decks:", err);
    } finally {
      setLoading(false);
    }
  }, [params.search, params.format, params.sortBy, params.sortOrder, params.page, params.limit]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  return {
    decks,
    loading,
    error,
    pagination,
    refetch: fetchDecks,
  };
};
