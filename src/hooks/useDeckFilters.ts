import { useState, useCallback, useEffect } from "react";
import type { FilterOptions, SortOptions } from "../types";

export interface UseDeckFiltersParams {
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  persistToLocalStorage?: boolean;
}

export interface UseDeckFiltersReturn {
  filters: FilterOptions;
  sort: SortOptions;
  handleFilterChange: (filters: Partial<FilterOptions>) => void;
  handleSortChange: (sort: Partial<SortOptions>) => void;
  resetFilters: () => void;
}

const STORAGE_KEY = "mtg-deck-filters";

export const useDeckFilters = ({
  onFilterChange,
  onSortChange,
  persistToLocalStorage = true,
}: UseDeckFiltersParams): UseDeckFiltersReturn => {
  const [filters, setFilters] = useState<FilterOptions>({
    format: undefined,
    search: undefined,
  });

  const [sort, setSort] = useState<SortOptions>({
    field: "created_at",
    direction: "desc",
  });

  // Load filters from localStorage on mount
  useEffect(() => {
    if (persistToLocalStorage) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.filters) {
            setFilters(parsed.filters);
          }
          if (parsed.sort) {
            setSort(parsed.sort);
          }
        }
      } catch (error) {
        console.warn("Failed to load filters from localStorage:", error);
      }
    }
  }, [persistToLocalStorage]);

  // Save filters to localStorage when they change
  useEffect(() => {
    if (persistToLocalStorage) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            filters,
            sort,
          })
        );
      } catch (error) {
        console.warn("Failed to save filters to localStorage:", error);
      }
    }
  }, [filters, sort, persistToLocalStorage]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterOptions>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  const handleSortChange = useCallback(
    (newSort: Partial<SortOptions>) => {
      const updatedSort = { ...sort, ...newSort };
      setSort(updatedSort);
      onSortChange(updatedSort);
    },
    [sort, onSortChange]
  );

  const resetFilters = useCallback(() => {
    const defaultFilters: FilterOptions = {
      format: undefined,
      search: undefined,
    };
    const defaultSort: SortOptions = {
      field: "created_at",
      direction: "desc",
    };

    setFilters(defaultFilters);
    setSort(defaultSort);
    onFilterChange(defaultFilters);
    onSortChange(defaultSort);
  }, [onFilterChange, onSortChange]);

  return {
    filters,
    sort,
    handleFilterChange,
    handleSortChange,
    resetFilters,
  };
};
