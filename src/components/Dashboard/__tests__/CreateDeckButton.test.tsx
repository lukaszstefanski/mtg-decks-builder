import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../../test/utils/test-utils";
import { CreateDeckButton } from "../CreateDeckButton";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
}));

describe("CreateDeckButton", () => {
  const mockOnCreateDeck = vi.fn();
  const defaultProps = {
    onCreateDeck: mockOnCreateDeck,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Renderowanie", () => {
    it("powinien renderować przycisk z poprawnym tekstem i ikoną", () => {
      render(<CreateDeckButton {...defaultProps} />);

      const button = screen.getByRole("button", { name: /nowy deck/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Nowy deck");
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("powinien renderować przycisk z poprawnymi stylami", () => {
      render(<CreateDeckButton {...defaultProps} />);

      const button = screen.getByRole("button", { name: /nowy deck/i });
      expect(button).toHaveClass("bg-blue-600", "hover:bg-blue-700", "text-white");
    });

    it("powinien wyłączyć przycisk gdy disabled=true", () => {
      render(<CreateDeckButton {...defaultProps} disabled={true} />);

      const button = screen.getByRole("button", { name: /nowy deck/i });
      expect(button).toBeDisabled();
    });

    it("nie powinien renderować modala początkowo", () => {
      render(<CreateDeckButton {...defaultProps} />);

      expect(screen.queryByText("Utwórz nowy deck")).not.toBeInTheDocument();
    });
  });

  describe("Interakcje z modalem", () => {
    it("powinien otworzyć modal po kliknięciu przycisku", () => {
      render(<CreateDeckButton {...defaultProps} />);

      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);

      expect(screen.getByText("Utwórz nowy deck")).toBeInTheDocument();
      expect(screen.getByLabelText(/nazwa decka/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/opis/i)).toBeInTheDocument();
    });

    it("powinien zamknąć modal po kliknięciu Anuluj", () => {
      render(<CreateDeckButton {...defaultProps} />);

      // Otwórz modal
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);

      // Zamknij modal
      const cancelButton = screen.getByRole("button", { name: /anuluj/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText("Utwórz nowy deck")).not.toBeInTheDocument();
    });

    it("powinien zresetować formularz po zamknięciu modala", () => {
      render(<CreateDeckButton {...defaultProps} />);

      // Otwórz modal i wypełnij formularz
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);

      const nameInput = screen.getByLabelText(/nazwa decka/i);
      fireEvent.change(nameInput, { target: { value: "Test Deck" } });

      // Zamknij modal
      const cancelButton = screen.getByRole("button", { name: /anuluj/i });
      fireEvent.click(cancelButton);

      // Otwórz ponownie modal
      fireEvent.click(button);

      // Sprawdź czy formularz jest pusty
      const nameInputAfter = screen.getByLabelText(/nazwa decka/i);
      expect(nameInputAfter).toHaveValue("");
    });
  });

  describe("Walidacja formularza", () => {
    beforeEach(() => {
      render(<CreateDeckButton {...defaultProps} />);
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);
    });

    it("powinien wyświetlić błąd dla pustej nazwy", async () => {
      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Nazwa decka jest wymagana")).toBeInTheDocument();
      });
    });

    it("powinien wyświetlić błąd dla nazwy dłuższej niż 100 znaków", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const longName = "a".repeat(101);
      fireEvent.change(nameInput, { target: { value: longName } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Nazwa nie może być dłuższa niż 100 znaków")).toBeInTheDocument();
      });
    });

    it("powinien wyświetlić błąd dla pustego formatu", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      fireEvent.change(nameInput, { target: { value: "Test Deck" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Format jest wymagany")).toBeInTheDocument();
      });
    });

    it("powinien wyświetlić błąd dla opisu dłuższego niż 500 znaków", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      const longDescription = "a".repeat(501);
      fireEvent.change(descriptionInput, { target: { value: longDescription } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Opis nie może być dłuższy niż 500 znaków")).toBeInTheDocument();
      });
    });

    it("powinien wyczyścić błąd po rozpoczęciu wpisywania", async () => {
      // Wyślij pusty formularz
      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Nazwa decka jest wymagana")).toBeInTheDocument();
      });

      // Wpisz nazwę
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      fireEvent.change(nameInput, { target: { value: "Test" } });

      // Błąd powinien zniknąć
      expect(screen.queryByText("Nazwa decka jest wymagana")).not.toBeInTheDocument();
    });

    it("powinien zaakceptować poprawnie wypełniony formularz", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });
      fireEvent.change(descriptionInput, { target: { value: "Test description" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalledWith({
          name: "Test Deck",
          description: "Test description",
          format: "standard",
        });
      });
    });
  });

  describe("Opcje formatów", () => {
    beforeEach(() => {
      render(<CreateDeckButton {...defaultProps} />);
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);
    });

    it("powinien wyświetlić wszystkie dostępne formaty", () => {
      const formatSelect = screen.getByLabelText(/format/i);
      const options = Array.from(formatSelect.querySelectorAll("option")).map((option) => option.textContent);

      expect(options).toContain("Wybierz format");
      expect(options).toContain("Standard");
      expect(options).toContain("Modern");
      expect(options).toContain("Legacy");
      expect(options).toContain("Vintage");
      expect(options).toContain("Commander");
      expect(options).toContain("Pioneer");
      expect(options).toContain("Historic");
    });

    it("powinien mieć domyślnie wybraną opcję 'Wybierz format'", () => {
      const formatSelect = screen.getByLabelText(/format/i);
      expect(formatSelect).toHaveValue("");
    });
  });

  describe("Wysyłanie formularza", () => {
    beforeEach(() => {
      render(<CreateDeckButton {...defaultProps} />);
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);
    });

    it("powinien wywołać onCreateDeck z poprawnymi danymi", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      fireEvent.change(nameInput, { target: { value: "My Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "modern" } });
      fireEvent.change(descriptionInput, { target: { value: "A test deck description" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalledTimes(1);
        expect(mockOnCreateDeck).toHaveBeenCalledWith({
          name: "My Test Deck",
          description: "A test deck description",
          format: "modern",
        });
      });
    });

    it("powinien wywołać onCreateDeck z undefined dla pustego opisu", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);

      fireEvent.change(nameInput, { target: { value: "Deck without description" } });
      fireEvent.change(formatSelect, { target: { value: "legacy" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalledWith({
          name: "Deck without description",
          description: undefined,
          format: "legacy",
        });
      });
    });

    it("powinien wyczyścić formularz po pomyślnym utworzeniu decka", async () => {
      mockOnCreateDeck.mockResolvedValueOnce(undefined);

      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalled();
      });

      // Modal powinien być zamknięty
      expect(screen.queryByText("Utwórz nowy deck")).not.toBeInTheDocument();
    });

    it("powinien wyświetlić błąd gdy onCreateDeck rzuca wyjątek", async () => {
      const error = new Error("Network error");
      mockOnCreateDeck.mockRejectedValueOnce(error);

      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Wystąpił błąd podczas tworzenia decka")).toBeInTheDocument();
      });

      // Modal powinien pozostać otwarty
      expect(screen.getByText("Utwórz nowy deck")).toBeInTheDocument();
    });
  });

  describe("Stany loading", () => {
    beforeEach(() => {
      render(<CreateDeckButton {...defaultProps} />);
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);
    });

    it("powinien wyłączyć przyciski podczas wysyłania", async () => {
      // Mock async function that takes time
      let resolvePromise: () => void;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });
      mockOnCreateDeck.mockReturnValueOnce(promise);

      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      // Sprawdź stan loading - przycisk submit w modalu
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Tworzenie...");
      expect(screen.getByRole("button", { name: /anuluj/i })).toBeDisabled();

      // Zakończ promise
      resolvePromise!();
      await waitFor(() => {
        // Po zakończeniu modal zostaje zamknięty, więc sprawdzamy czy modal zniknął
        expect(screen.queryByText("Utwórz nowy deck")).not.toBeInTheDocument();
      });
    });

    it("powinien przywrócić normalny stan po zakończeniu wysyłania", async () => {
      mockOnCreateDeck.mockResolvedValueOnce(undefined);

      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Po zakończeniu modal zostaje zamknięty, więc sprawdzamy czy modal zniknął
        expect(screen.queryByText("Utwórz nowy deck")).not.toBeInTheDocument();
      });
    });
  });

  describe("Warunki brzegowe", () => {
    beforeEach(() => {
      render(<CreateDeckButton {...defaultProps} />);
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);
    });

    it("powinien przyciąć białe znaki z nazwy i opisu", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      fireEvent.change(nameInput, { target: { value: "  Test Deck  " } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });
      fireEvent.change(descriptionInput, { target: { value: "  Test description  " } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalledWith({
          name: "Test Deck",
          description: "Test description",
          format: "standard",
        });
      });
    });

    it("powinien obsłużyć pusty opis jako undefined", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });
      fireEvent.change(descriptionInput, { target: { value: "   " } }); // Tylko białe znaki

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalledWith({
          name: "Test Deck",
          description: undefined,
          format: "standard",
        });
      });
    });

    it("powinien obsłużyć maksymalną długość nazwy (100 znaków)", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);

      const maxLengthName = "a".repeat(100);
      fireEvent.change(nameInput, { target: { value: maxLengthName } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalledWith({
          name: maxLengthName,
          description: undefined,
          format: "standard",
        });
      });
    });

    it("powinien obsłużyć maksymalną długość opisu (500 znaków)", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      const maxLengthDescription = "a".repeat(500);
      fireEvent.change(descriptionInput, { target: { value: maxLengthDescription } });

      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalledWith({
          name: "Test Deck",
          description: maxLengthDescription,
          format: "standard",
        });
      });
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      render(<CreateDeckButton {...defaultProps} />);
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);
    });

    it("powinien mieć poprawne etykiety dla wszystkich pól formularza", () => {
      expect(screen.getByLabelText(/nazwa decka/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/opis/i)).toBeInTheDocument();
    });

    it("powinien mieć poprawne atrybuty maxLength", () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      expect(nameInput).toHaveAttribute("maxLength", "100");
      expect(descriptionInput).toHaveAttribute("maxLength", "500");
    });

    it("powinien mieć poprawne placeholdery", () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const descriptionInput = screen.getByLabelText(/opis/i);

      expect(nameInput).toHaveAttribute("placeholder", "Wprowadź nazwę decka");
      expect(descriptionInput).toHaveAttribute("placeholder", "Opcjonalny opis decka");
    });

    it("powinien mieć poprawne role dla przycisków", () => {
      expect(screen.getByRole("button", { name: /anuluj/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /utwórz deck/i })).toBeInTheDocument();
    });
  });

  describe("Integracja z formularzem", () => {
    beforeEach(() => {
      render(<CreateDeckButton {...defaultProps} />);
      const button = screen.getByRole("button", { name: /nowy deck/i });
      fireEvent.click(button);
    });

    it("powinien obsłużyć wysłanie formularza przez kliknięcie przycisku submit", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      // Wysłać formularz przez kliknięcie przycisku
      const submitButton = screen.getByRole("button", { name: /utwórz deck/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalled();
      });
    });

    it("powinien obsłużyć wysłanie formularza przez submit event", async () => {
      const nameInput = screen.getByLabelText(/nazwa decka/i);
      const formatSelect = screen.getByLabelText(/format/i);
      const form = nameInput.closest("form");

      fireEvent.change(nameInput, { target: { value: "Test Deck" } });
      fireEvent.change(formatSelect, { target: { value: "standard" } });

      // Wysłać formularz przez submit event
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockOnCreateDeck).toHaveBeenCalled();
      });
    });
  });
});
