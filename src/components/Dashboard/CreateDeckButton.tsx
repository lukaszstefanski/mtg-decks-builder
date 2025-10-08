import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreateDeckRequest } from "../../types";

export interface CreateDeckButtonProps {
  onCreateDeck: (deckData: CreateDeckRequest) => void;
  disabled?: boolean;
}

export const CreateDeckButton: React.FC<CreateDeckButtonProps> = ({ onCreateDeck, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    format: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FORMAT_OPTIONS = [
    { value: "", label: "Wybierz format" },
    { value: "standard", label: "Standard" },
    { value: "modern", label: "Modern" },
    { value: "legacy", label: "Legacy" },
    { value: "vintage", label: "Vintage" },
    { value: "commander", label: "Commander" },
    { value: "pioneer", label: "Pioneer" },
    { value: "historic", label: "Historic" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nazwa decka jest wymagana";
    } else if (formData.name.length > 100) {
      newErrors.name = "Nazwa nie może być dłuższa niż 100 znaków";
    }

    if (!formData.format) {
      newErrors.format = "Format jest wymagany";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Opis nie może być dłuższy niż 500 znaków";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateDeck({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        format: formData.format,
      });

      // Reset form
      setFormData({ name: "", description: "", format: "" });
      setErrors({});
      setIsOpen(false);
    } catch {
      setErrors({ submit: "Wystąpił błąd podczas tworzenia decka" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ name: "", description: "", format: "" });
    setErrors({});
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={disabled} className="bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4 mr-2" />
        Nowy deck
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Utwórz nowy deck</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa decka *
                  </label>
                  <input
                    type="text"
                    id="deck-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Wprowadź nazwę decka"
                    maxLength={100}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Format */}
                <div>
                  <label htmlFor="deck-format" className="block text-sm font-medium text-gray-700 mb-1">
                    Format *
                  </label>
                  <select
                    id="deck-format"
                    value={formData.format}
                    onChange={(e) => handleInputChange("format", e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.format ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    {FORMAT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.format && <p className="mt-1 text-sm text-red-600">{errors.format}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="deck-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Opis
                  </label>
                  <textarea
                    id="deck-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Opcjonalny opis decka"
                    maxLength={500}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Submit Error */}
                {errors.submit && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</div>}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                    Anuluj
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? "Tworzenie..." : "Utwórz deck"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
