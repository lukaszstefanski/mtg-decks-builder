# Plan implementacji widoku Dashboard

## 1. Przegląd

Dashboard to główny widok aplikacji MtG Decks Builder, który wyświetla listę decków użytkownika. Umożliwia wyszukiwanie, filtrowanie, sortowanie decków oraz wykonywanie podstawowych operacji CRUD (tworzenie, edycja, usuwanie). Widok jest responsywny i dostosowany do różnych urządzeń.

## 2. Routing widoku

- **Ścieżka**: `/`
- **Komponent**: `src/pages/index.astro`
- **Layout**: `src/layouts/Layout.astro`

## 3. Struktura komponentów

```
Dashboard
├── DeckSearch
├── DeckFilters
├── CreateDeckButton
├── DeckList
│   ├── DeckCard (xN)
│   │   ├── DeckInfo
│   │   └── DeckActions
│   └── EmptyState (conditional)
├── DeleteDeckDialog
└── EditDeckDialog
```

## 4. Szczegóły komponentów

### Dashboard

- **Opis**: Główny widok zawierający listę decków użytkownika z możliwością wyszukiwania, filtrowania i zarządzania
- **Główne elementy**: Header z tytułem, sekcja wyszukiwania i filtrów, lista decków, przycisk tworzenia nowego decka
- **Obsługiwane interakcje**: Wyszukiwanie decków, filtrowanie, sortowanie, tworzenie nowego decka, nawigacja do szczegółów decka
- **Obsługiwana walidacja**: Walidacja danych wejściowych wyszukiwania, sprawdzanie uprawnień użytkownika
- **Typy**: DeckListState, DeckSearchState, DeckFiltersState
- **Propsy**: Brak (komponent główny)

### DeckSearch

- **Opis**: Komponent wyszukiwania decków po nazwie z funkcją autouzupełniania
- **Główne elementy**: Pole input, przycisk czyszczenia, ikona wyszukiwania
- **Obsługiwane interakcje**: Wpisywanie tekstu, czyszczenie pola, wyszukiwanie w czasie rzeczywistym
- **Obsługiwana walidacja**: Walidacja długości tekstu (max 100 znaków), sprawdzanie czy tekst nie jest tylko białymi znakami
- **Typy**: DeckSearchState, SearchQuery
- **Propsy**: onSearch: (query: string) => void, onClear: () => void, placeholder?: string

### DeckFilters

- **Opis**: Komponent filtrów i sortowania decków
- **Główne elementy**: Select formatu, Select sortowania, Select kierunku sortowania
- **Obsługiwane interakcje**: Wybór formatu, wybór sortowania, wybór kierunku sortowania
- **Obsługiwana walidacja**: Walidacja wybranych opcji, sprawdzanie dostępności filtrów
- **Typy**: DeckFiltersState, FilterOptions, SortOptions
- **Propsy**: onFilterChange: (filters: FilterOptions) => void, onSortChange: (sort: SortOptions) => void

### CreateDeckButton

- **Opis**: Przycisk do tworzenia nowego decka z modalem formularza
- **Główne elementy**: Przycisk, ikona plus, tekst
- **Obsługiwane interakcje**: Kliknięcie otwiera modal tworzenia decka
- **Obsługiwana walidacja**: Sprawdzanie uprawnień użytkownika do tworzenia decków
- **Typy**: CreateDeckRequest, CreateDeckState
- **Propsy**: onCreateDeck: (deckData: CreateDeckRequest) => void, disabled?: boolean

### DeckList

- **Opis**: Lista decków z paginacją i obsługą pustego stanu
- **Główne elementy**: Kontener listy, DeckCard komponenty, EmptyState, paginacja
- **Obsługiwane interakcje**: Przewijanie, paginacja, wyświetlanie pustego stanu
- **Obsługiwana walidacja**: Sprawdzanie czy lista nie jest pusta, walidacja danych decków
- **Typy**: DeckListState, DeckResponse[], PaginationInfo
- **Propsy**: decks: DeckResponse[], pagination: PaginationInfo, onPageChange: (page: number) => void

### DeckCard

- **Opis**: Pojedynczy deck w liście z podstawowymi informacjami i akcjami
- **Główne elementy**: Nazwa decka, format, data utworzenia, liczba kart, akcje
- **Obsługiwane interakcje**: Kliknięcie na deck (nawigacja do szczegółów), hover na akcje
- **Obsługiwana walidacja**: Sprawdzanie czy deck istnieje, walidacja danych decka
- **Typy**: DeckResponse, DeckCardState
- **Propsy**: deck: DeckResponse, onEdit: (deckId: string) => void, onDelete: (deckId: string) => void, onView: (deckId: string) => void

### DeckActions

- **Opis**: Akcje dostępne dla decka (edycja, usuwanie, podgląd)
- **Główne elementy**: Przyciski akcji, ikony, tooltips
- **Obsługiwane interakcje**: Kliknięcie na akcję, hover na przycisk
- **Obsługiwana walidacja**: Sprawdzanie uprawnień użytkownika do akcji na decku
- **Typy**: DeckActionsState, ActionType
- **Propsy**: deckId: string, onEdit: (deckId: string) => void, onDelete: (deckId: string) => void, onView: (deckId: string) => void

### DeleteDeckDialog

- **Opis**: Dialog potwierdzenia usunięcia decka z informacjami o decku
- **Główne elementy**: Tytuł, opis, nazwa decka, przyciski potwierdzenia/anulowania
- **Obsługiwane interakcje**: Potwierdzenie usunięcia, anulowanie, zamknięcie
- **Obsługiwana walidacja**: Sprawdzanie czy deck istnieje, walidacja uprawnień użytkownika
- **Typy**: DeleteDeckState, DeckResponse
- **Propsy**: deck: DeckResponse | null, isOpen: boolean, onConfirm: (deckId: string) => void, onCancel: () => void

### EditDeckDialog

- **Opis**: Dialog edycji decka z formularzem
- **Główne elementy**: Formularz z polami nazwy, opisu, formatu, przyciski zapisz/anuluj
- **Obsługiwane interakcje**: Edycja pól formularza, zapisanie zmian, anulowanie
- **Obsługiwana walidacja**: Walidacja nazwy (nie pusta, max 100 znaków), walidacja formatu, walidacja opisu (max 500 znaków)
- **Typy**: EditDeckState, UpdateDeckRequest, DeckResponse
- **Propsy**: deck: DeckResponse | null, isOpen: boolean, onSave: (deckId: string, data: UpdateDeckRequest) => void, onCancel: () => void

### EmptyState

- **Opis**: Stan pustej listy decków z zachętą do utworzenia pierwszego decka
- **Główne elementy**: Ikona, tytuł, opis, przycisk tworzenia decka
- **Obsługiwane interakcje**: Kliknięcie na przycisk tworzenia decka
- **Obsługiwana walidacja**: Brak
- **Typy**: EmptyStateProps
- **Propsy**: onCreateDeck: () => void, message?: string

## 5. Typy

### DeckViewModel

```typescript
interface DeckViewModel extends DeckResponse {
  isEditing?: boolean;
  isDeleting?: boolean;
  lastAction?: "created" | "updated" | "deleted";
}
```

### DeckListState

```typescript
interface DeckListState {
  decks: DeckViewModel[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  searchQuery: string;
  filters: FilterOptions;
  sort: SortOptions;
}
```

### DeckSearchState

```typescript
interface DeckSearchState {
  query: string;
  isSearching: boolean;
  suggestions: string[];
}
```

### DeckFiltersState

```typescript
interface DeckFiltersState {
  format: string | null;
  sortBy: "created_at" | "last_modified" | "name";
  sortOrder: "asc" | "desc";
}
```

### DeckActionsState

```typescript
interface DeckActionsState {
  editingDeckId: string | null;
  deletingDeckId: string | null;
  actionLoading: boolean;
}
```

### FilterOptions

```typescript
interface FilterOptions {
  format?: string;
  search?: string;
  sortBy?: "created_at" | "last_modified" | "name";
  sortOrder?: "asc" | "desc";
}
```

### SortOptions

```typescript
interface SortOptions {
  field: "created_at" | "last_modified" | "name";
  direction: "asc" | "desc";
}
```

## 6. Zarządzanie stanem

Widok używa kombinacji lokalnego stanu komponentów i globalnego stanu aplikacji:

- **useDeckList**: Hook do zarządzania listą decków z cache'owaniem i synchronizacją
- **useDeckSearch**: Hook do wyszukiwania z debouncing
- **useDeckFilters**: Hook do filtrów z persystencją w localStorage
- **useDeckActions**: Hook do akcji CRUD z optymistycznymi aktualizacjami
- **usePagination**: Hook do paginacji z cache'owaniem

Stan jest synchronizowany między komponentami przez context API i event system.

## 7. Integracja API

### GET /api/decks

- **Typ żądania**: Query parameters (search, format, page, limit, sort, order)
- **Typ odpowiedzi**: `DeckListResponse`
- **Obsługa**: Pobieranie listy decków z paginacją

### POST /api/decks

- **Typ żądania**: `CreateDeckRequest`
- **Typ odpowiedzi**: `DeckResponse`
- **Obsługa**: Tworzenie nowego decka

### PUT /api/decks/{deckId}

- **Typ żądania**: `UpdateDeckRequest`
- **Typ odpowiedzi**: `DeckResponse`
- **Obsługa**: Aktualizacja decka

### DELETE /api/decks/{deckId}

- **Typ żądania**: `DeleteDeckInput`
- **Typ odpowiedzi**: Brak (204 No Content)
- **Obsługa**: Usuwanie decka

## 8. Interakcje użytkownika

### Wyszukiwanie decków

- Użytkownik wpisuje tekst w pole wyszukiwania
- System wykonuje wyszukiwanie z debouncing (300ms)
- Wyniki są aktualizowane w czasie rzeczywistym
- Wyświetlany jest komunikat o braku wyników

### Filtrowanie i sortowanie

- Użytkownik wybiera format z dropdown
- Użytkownik wybiera sortowanie (data, nazwa)
- Użytkownik wybiera kierunek sortowania
- Filtry są aplikowane natychmiastowo

### Tworzenie nowego decka

- Użytkownik klika przycisk "Nowy deck"
- Otwiera się modal z formularzem
- Użytkownik wypełnia dane (nazwa, opis, format)
- System waliduje dane i tworzy deck
- Lista jest odświeżana

### Edycja decka

- Użytkownik klika ikonę edycji przy decku
- Otwiera się modal z formularzem wypełnionym danymi
- Użytkownik modyfikuje dane
- System waliduje i zapisuje zmiany
- Lista jest aktualizowana

### Usuwanie decka

- Użytkownik klika ikonę usuwania przy decku
- Otwiera się dialog potwierdzenia z nazwą decka
- Użytkownik potwierdza usunięcie
- System usuwa deck i odświeża listę
- Wyświetlany jest komunikat o sukcesie

## 9. Warunki i walidacja

### Walidacja wyszukiwania

- Tekst nie może być dłuższy niż 100 znaków
- Tekst nie może składać się tylko z białych znaków
- Wyszukiwanie jest case-insensitive

### Walidacja tworzenia decka

- Nazwa jest wymagana i nie może być pusta
- Nazwa nie może być dłuższa niż 100 znaków
- Format musi być wybrany z dostępnych opcji
- Opis nie może być dłuższy niż 500 znaków

### Walidacja edycji decka

- Nazwa jest wymagana i nie może być pusta
- Nazwa nie może być dłuższa niż 100 znaków
- Format musi być wybrany z dostępnych opcji
- Opis nie może być dłuższy niż 500 znaków

### Walidacja usuwania decka

- Użytkownik musi potwierdzić usunięcie
- Deck musi istnieć
- Użytkownik musi mieć uprawnienia do usunięcia

## 10. Obsługa błędów

### Błędy połączenia z API

- Wyświetlanie komunikatu o problemie z siecią
- Przycisk "Spróbuj ponownie"
- Automatyczne ponowienie po 5 sekundach

### Błędy walidacji

- Wyświetlanie błędów pod odpowiednimi polami
- Podświetlanie pól z błędami
- Komunikaty w języku polskim

### Błędy autoryzacji

- Przekierowanie do strony logowania
- Komunikat o wygaśnięciu sesji
- Zachowanie stanu po zalogowaniu

### Błędy serwera

- Wyświetlanie komunikatu o błędzie serwera
- Logowanie błędów dla administratorów
- Sugestie co użytkownik może zrobić

## 11. Kroki implementacji

1. **Utworzenie struktury komponentów**
   - Stworzenie folderów dla komponentów
   - Utworzenie plików TypeScript dla każdego komponentu
   - Konfiguracja importów i eksportów

2. **Implementacja typów i interfejsów**
   - Definicja typów w pliku `types.ts`
   - Utworzenie interfejsów dla komponentów
   - Konfiguracja typów dla API

3. **Implementacja hooków zarządzania stanem**
   - `useDeckList` - zarządzanie listą decków
   - `useDeckSearch` - wyszukiwanie z debouncing
   - `useDeckFilters` - filtry i sortowanie
   - `useDeckActions` - akcje CRUD

4. **Implementacja komponentów podstawowych**
   - `DeckSearch` - wyszukiwanie
   - `DeckFilters` - filtry
   - `CreateDeckButton` - przycisk tworzenia
   - `EmptyState` - stan pusty

5. **Implementacja komponentów listy**
   - `DeckList` - kontener listy
   - `DeckCard` - pojedynczy deck
   - `DeckActions` - akcje na decku

6. **Implementacja dialogów**
   - `EditDeckDialog` - edycja decka
   - `DeleteDeckDialog` - potwierdzenie usunięcia

7. **Implementacja integracji API**
   - Funkcje do wywoływania API
   - Obsługa odpowiedzi i błędów
   - Cache'owanie danych

8. **Implementacja walidacji**
   - Schematy walidacji Zod
   - Walidacja formularzy
   - Komunikaty błędów

9. **Implementacja obsługi błędów**
   - Komponenty błędów
   - Komunikaty użytkownika
   - Logowanie błędów

10. **Implementacja responsywności**
    - Media queries
    - Dostosowanie do urządzeń mobilnych
    - Testowanie na różnych ekranach

11. **Implementacja testów**
    - Testy jednostkowe komponentów
    - Testy integracji
    - Testy E2E

12. **Optymalizacja wydajności**
    - Lazy loading komponentów
    - Memoization
    - Optymalizacja re-renderów

13. **Implementacja dostępności**
    - ARIA labels
    - Keyboard navigation
    - Screen reader support

14. **Finalne testy i debugowanie**
    - Testy na różnych przeglądarkach
    - Testy wydajności
    - Debugowanie problemów
