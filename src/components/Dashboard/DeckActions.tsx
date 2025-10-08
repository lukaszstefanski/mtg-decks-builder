import React, { useState } from "react";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";

export interface DeckActionsProps {
  deckId: string;
  onEdit: (deckId: string) => void;
  onDelete: (deckId: string) => void;
  onView: (deckId: string) => void;
}

export const DeckActions: React.FC<DeckActionsProps> = ({ deckId, onEdit, onDelete, onView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        aria-label="Opcje decka"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Zamknij menu"
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
            <button
              onClick={() => handleAction(() => onView(deckId))}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-3" />
              Zobacz szczegóły
            </button>

            <button
              onClick={() => handleAction(() => onEdit(deckId))}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-3" />
              Edytuj
            </button>

            <button
              onClick={() => handleAction(() => onDelete(deckId))}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-3" />
              Usuń
            </button>
          </div>
        </>
      )}
    </div>
  );
};
