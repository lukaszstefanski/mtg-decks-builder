import React from "react";
import { DeckCard } from "./DeckCard";
import { EmptyState } from "./EmptyState";
import type { DeckResponse, PaginationInfo } from "../../types";

export interface DeckListProps {
  decks: DeckResponse[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onEdit: (deckId: string) => void;
  onDelete: (deckId: string) => void;
  onView: (deckId: string) => void;
}

export const DeckList: React.FC<DeckListProps> = ({
  decks,
  pagination,
  loading,
  error,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Ładowanie decków...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Wystąpił błąd</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (decks.length === 0) {
    return <EmptyState message="Nie znaleziono decków spełniających kryteria wyszukiwania." />;
  }

  return (
    <div className="space-y-6">
      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} onEdit={onEdit} onDelete={onDelete} onView={onView} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Poprzednia
          </button>

          <span className="px-3 py-2 text-sm text-gray-700">
            Strona {pagination.page} z {pagination.pages}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Następna
          </button>
        </div>
      )}
    </div>
  );
};
