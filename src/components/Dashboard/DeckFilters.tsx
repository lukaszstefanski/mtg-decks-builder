import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FilterOptions {
  format?: string;
  search?: string;
  sortBy?: "created_at" | "last_modified" | "name";
  sortOrder?: "asc" | "desc";
}

export interface SortOptions {
  field: "created_at" | "last_modified" | "name";
  direction: "asc" | "desc";
}

export interface DeckFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
}

const FORMAT_OPTIONS = [
  { value: "", label: "Wszystkie formaty" },
  { value: "standard", label: "Standard" },
  { value: "modern", label: "Modern" },
  { value: "legacy", label: "Legacy" },
  { value: "vintage", label: "Vintage" },
  { value: "commander", label: "Commander" },
  { value: "pioneer", label: "Pioneer" },
  { value: "historic", label: "Historic" },
];

const SORT_OPTIONS = [
  { value: "created_at", label: "Data utworzenia" },
  { value: "last_modified", label: "Data modyfikacji" },
  { value: "name", label: "Nazwa" },
];

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Malejąco" },
  { value: "asc", label: "Rosnąco" },
];

export const DeckFilters: React.FC<DeckFiltersProps> = ({ onFilterChange, onSortChange }) => {
  const [format, setFormat] = useState<string>("");
  const [sortBy, setSortBy] = useState<"created_at" | "last_modified" | "name">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFormatChange = (value: string) => {
    setFormat(value);
    onFilterChange({ format: value || undefined });
  };

  const handleSortByChange = (value: "created_at" | "last_modified" | "name") => {
    setSortBy(value);
    onSortChange({ field: value, direction: sortOrder });
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    onSortChange({ field: sortBy, direction: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Format Filter */}
      <div className="flex-1">
        <label htmlFor="format-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Format
        </label>
        <div className="relative">
          <select
            id="format-filter"
            value={format}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
          >
            {FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="flex-1">
        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
          Sortuj według
        </label>
        <div className="relative">
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => handleSortByChange(e.target.value as "created_at" | "last_modified" | "name")}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Sort Order */}
      <div className="flex-1">
        <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
          Kolejność
        </label>
        <div className="relative">
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => handleSortOrderChange(e.target.value as "asc" | "desc")}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
          >
            {SORT_ORDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
