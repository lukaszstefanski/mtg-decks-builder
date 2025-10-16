import React from "react";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  onCreateDeck?: () => void;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreateDeck,
  message = "Nie masz jeszcze żadnych decków. Utwórz swój pierwszy deck, aby rozpocząć budowanie kolekcji Magic: The Gathering!",
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
        <CreditCard className="h-full w-full" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">Brak decków</h3>

      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onCreateDeck && (
        <Button onClick={onCreateDeck} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Utwórz pierwszy deck
        </Button>
      )}
    </div>
  );
};
