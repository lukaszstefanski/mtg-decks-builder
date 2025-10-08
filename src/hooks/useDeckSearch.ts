import { useState, useCallback, useRef } from "react";

export interface UseDeckSearchParams {
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export interface UseDeckSearchReturn {
  query: string;
  isSearching: boolean;
  handleSearch: (query: string) => void;
  handleClear: () => void;
}

export const useDeckSearch = ({ onSearch, debounceMs = 300 }: UseDeckSearchParams): UseDeckSearchReturn => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      // Validate input
      if (searchQuery.length > 100) {
        return;
      }

      setQuery(searchQuery);
      setIsSearching(true);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced search
      timeoutRef.current = setTimeout(() => {
        if (searchQuery.trim() === "") {
          onSearch("");
        } else {
          onSearch(searchQuery.trim());
        }
        setIsSearching(false);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setIsSearching(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    onSearch("");
  }, [onSearch]);

  return {
    query,
    isSearching,
    handleSearch,
    handleClear,
  };
};
