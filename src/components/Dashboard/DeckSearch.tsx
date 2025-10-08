import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

export interface DeckSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const DeckSearch: React.FC<DeckSearchProps> = ({ onSearch, onClear, placeholder = "Szukaj decków..." }) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Validate input length
      if (value.length > 100) {
        return;
      }

      setQuery(value);
      setIsSearching(true);

      // Debounce search
      const timeoutId = setTimeout(() => {
        if (value.trim() === "") {
          onClear();
        } else {
          onSearch(value.trim());
        }
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [onSearch, onClear]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onClear();
  }, [onClear]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        maxLength={100}
      />

      {query && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Wyczyść wyszukiwanie"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {isSearching && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};
