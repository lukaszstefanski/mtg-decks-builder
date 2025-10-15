import React, { useState } from "react";
import { DeckSearch } from "./DeckSearch";
import { CreateDeckButton } from "./CreateDeckButton";
import { DeckList } from "./DeckList";
import { DeleteDeckDialog } from "./DeleteDeckDialog";
import { EditDeckDialog } from "./EditDeckDialog";
import { useDeckList } from "../../hooks/useDeckList";
import { useDeckSearch } from "../../hooks/useDeckSearch";
import { useDeckActions } from "../../hooks/useDeckActions";
import { useAuth } from "../../hooks/useAuth";
import type { DeckResponse, CreateDeckRequest, UpdateDeckRequest } from "../../types";

export interface DashboardProps {
  user?: { id?: string; email?: string; username?: string } | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDeck, setEditingDeck] = useState<DeckResponse | null>(null);
  const [deletingDeck, setDeletingDeck] = useState<DeckResponse | null>(null);

  // Pobieranie danych użytkownika
  const { userId, isAuthenticated } = useAuth(user);

  const { decks, loading, error, pagination, refetch } = useDeckList({
    search: searchQuery,
  });

  const { handleSearch, handleClear } = useDeckSearch({
    onSearch: setSearchQuery,
  });

  const { createDeck, updateDeck, deleteDeck } = useDeckActions({
    userId,
    onSuccess: () => {
      refetch();
      setEditingDeck(null);
      setDeletingDeck(null);
    },
  });

  const handleCreateDeck = async (deckData: CreateDeckRequest) => {
    await createDeck(deckData);
  };

  const handleEditDeck = async (deckId: string, data: UpdateDeckRequest) => {
    await updateDeck(deckId, data);
  };

  const handleDeleteDeck = async (deckId: string) => {
    await deleteDeck(deckId);
  };

  const handleViewDeck = (deckId: string) => {
    // Navigate to deck details page
    window.location.href = `/decks/${deckId}/edit`;
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Moje decki</h1>
          <p className="mt-2 text-gray-600">Zarządzaj swoimi deckami Magic: The Gathering</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <DeckSearch onSearch={handleSearch} onClear={handleClear} placeholder="Szukaj decków..." />
        </div>

        {/* Create Deck Button */}
        <div className="mb-6">
          <CreateDeckButton onCreateDeck={handleCreateDeck} disabled={loading} />
        </div>

        {/* Deck List */}
        <div data-testid="deck-list-container">
          <DeckList
            decks={decks}
            pagination={pagination}
            loading={loading}
            error={error}
            onPageChange={() => {
              // Handle pagination
            }}
            onEdit={(deckId: string) => {
              const deck = decks.find((d) => d.id === deckId);
              if (deck) setEditingDeck(deck);
            }}
            onDelete={(deckId: string) => {
              const deck = decks.find((d) => d.id === deckId);
              if (deck) setDeletingDeck(deck);
            }}
            onView={handleViewDeck}
          />
        </div>

        {/* Dialogs */}
        <EditDeckDialog
          deck={editingDeck}
          isOpen={!!editingDeck}
          onSave={handleEditDeck}
          onCancel={() => setEditingDeck(null)}
        />

        <DeleteDeckDialog
          deck={deletingDeck}
          isOpen={!!deletingDeck}
          onConfirm={handleDeleteDeck}
          onCancel={() => setDeletingDeck(null)}
        />
      </div>
    </div>
  );
};
