import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DeckResponse } from "../../types";

export interface DeleteDeckDialogProps {
  deck: DeckResponse | null;
  isOpen: boolean;
  onConfirm: (deckId: string) => void;
  onCancel: () => void;
}

export const DeleteDeckDialog: React.FC<DeleteDeckDialogProps> = ({ deck, isOpen, onConfirm, onCancel }) => {
  if (!isOpen || !deck) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(deck.id);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Usuń deck</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">Czy na pewno chcesz usunąć ten deck?</h4>
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Nazwa decka:</strong> {deck.name}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Format:</strong> {deck.format}
            </p>
            {deck.description && (
              <p className="text-sm text-gray-600">
                <strong>Opis:</strong> {deck.description}
              </p>
            )}
          </div>

          <p className="text-sm text-red-600 mt-4">
            <strong>Uwaga:</strong> Ta operacja jest nieodwracalna. Wszystkie karty w tym decku zostaną usunięte.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Usuń deck
          </Button>
        </div>
      </div>
    </div>
  );
};
