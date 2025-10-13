import React from "react";
import { Edit, Trash2, Eye, Calendar, Users } from "lucide-react";
import { DeckActions } from "./DeckActions";
import type { DeckResponse } from "../../types";

export interface DeckCardProps {
  deck: DeckResponse;
  onEdit: (deckId: string) => void;
  onDelete: (deckId: string) => void;
  onView: (deckId: string) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onEdit, onDelete, onView }) => {
  const formatColors: Record<string, string> = {
    standard: "bg-green-100 text-green-800",
    modern: "bg-blue-100 text-blue-800",
    legacy: "bg-purple-100 text-purple-800",
    vintage: "bg-red-100 text-red-800",
    commander: "bg-yellow-100 text-yellow-800",
    pioneer: "bg-indigo-100 text-indigo-800",
    historic: "bg-pink-100 text-pink-800",
  };

  const formatColor = formatColors[deck.format] || "bg-gray-100 text-gray-800";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{deck.name}</h3>
            <div className="flex items-center space-x-2 mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formatColor}`}
              >
                {deck.format}
              </span>
              <span className="text-sm text-gray-500">{deck.deck_size || 0} kart</span>
            </div>
          </div>
          <DeckActions deckId={deck.id} onEdit={onEdit} onDelete={onDelete} onView={onView} />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {deck.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{deck.description}</p>}

        {/* Card Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Utworzono {deck.created_at ? formatDate(deck.created_at) : "Nieznana data"}</span>
            </div>
            {deck.last_modified !== deck.created_at && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Zmodyfikowano {deck.last_modified ? formatDate(deck.last_modified) : "Nieznana data"}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
        <button
          onClick={() => onView(deck.id)}
          className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Zobacz szczegóły →
        </button>
      </div>
    </div>
  );
};
