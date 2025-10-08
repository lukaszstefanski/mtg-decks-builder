# Plan implementacji widoku DeckEditor

## 1. Przegląd

DeckEditor to główny widok aplikacji MtG Decks Builder umożliwiający użytkownikom edycję decków poprzez wyszukiwanie kart, filtrowanie wyników i zarządzanie kartami w decku. Widok implementuje dwukolumnowy layout z wyszukiwarką kart po lewej stronie i listą kart decka po prawej stronie. Zapewnia pełną funkcjonalność zgodną z zasadami Magic: The Gathering, w tym walidację limitów kart i automatyczne sprawdzanie reguł gry.

## 2. Routing widoku

**Ścieżka**: `/decks/:deckId/edit`

**Parametry**:

- `deckId` (string, UUID) - identyfikator decka do edycji

**Przykład**: `/decks/123e4567-e89b-12d3-a456-426614174000/edit`

## 3. Struktura komponentów

```
DeckEditor (główny kontener)
├── DeckHeader (metadane decka)
│   ├── DeckName (nazwa decka)
│   ├── DeckFormat (format decka)
│   └── DeckDescription (opis decka)
├── CardSearch (wyszukiwarka kart)
│   ├── SearchInput (pole wyszukiwania)
│   └── CardFilters (filtry wyszukiwania)
│       ├── ColorFilter (filtry kolorów)
│       ├── ManaCostFilter (filtry kosztu many)
│       └── TypeFilter (filtry typów)
├── CardResults (wyniki wyszukiwania)
│   └── CardItem (pojedyncza karta)
└── DeckCards (karty w decku)
    └── DeckCardItem (pojedyncza karta w decku)
```

## 4. Szczegóły komponentów

### DeckEditor

- **Opis**: Główny kontener widoku edytora decka, zarządza stanem całego widoku i koordynuje komunikację między komponentami
- **Główne elementy**: Layout dwukolumnowy, header z metadanymi decka, sekcja wyszukiwania, sekcja kart decka
- **Obsługiwane interakcje**: Ładowanie danych decka, synchronizacja stanu między komponentami, obsługa błędów
- **Obsługiwana walidacja**: Sprawdzanie uprawnień do decka, walidacja formatu deckId
- **Typy**: `DeckEditorProps`, `DeckEditorState`
- **Propsy**: `deckId: string`

### DeckHeader

- **Opis**: Wyświetla metadane decka (nazwa, format, opis) z możliwością edycji
- **Główne elementy**: Input dla nazwy, select dla formatu, textarea dla opisu, przycisk zapisu
- **Obsługiwane interakcje**: Edycja metadanych, zapisywanie zmian, anulowanie edycji
- **Obsługiwana walidacja**: Walidacja nazwy (wymagana, max 100 znaków), walidacja formatu
- **Typy**: `DeckHeaderProps`, `DeckMetadata`
- **Propsy**: `deck: DeckResponse`, `onUpdate: (data: UpdateDeckRequest) => void`

### CardSearch

- **Opis**: Komponent wyszukiwania kart z polem tekstowym i filtrami
- **Główne elementy**: Pole wyszukiwania, przyciski filtrów, przycisk czyszczenia
- **Obsługiwane interakcje**: Wpisywanie zapytania, wybór filtrów, czyszczenie filtrów
- **Obsługiwana walidacja**: Debouncing zapytań, walidacja długości zapytania
- **Typy**: `CardSearchProps`, `SearchState`
- **Propsy**: `onSearch: (params: CardSearchParams) => void`, `onFiltersChange: (filters: FilterState) => void`

### CardFilters

- **Opis**: Zestaw filtrów do zawężania wyników wyszukiwania kart
- **Główne elementy**: Checkboxy kolorów, select kosztu many, checkboxy typów, przycisk resetu
- **Obsługiwane interakcje**: Wybór/odznaczenie filtrów, reset wszystkich filtrów
- **Obsługiwana walidacja**: Walidacja zakresów kosztów many, walidacja typów kart
- **Typy**: `CardFiltersProps`, `FilterState`
- **Propsy**: `filters: FilterState`, `onChange: (filters: FilterState) => void`

### CardResults

- **Opis**: Lista wyników wyszukiwania kart z paginacją
- **Główne elementy**: Lista kart, przyciski paginacji, wskaźnik ładowania
- **Obsługiwane interakcje**: Przewijanie wyników, ładowanie kolejnych stron, dodawanie kart do decka
- **Obsługiwana walidacja**: Sprawdzanie limitów kart przed dodaniem
- **Typy**: `CardResultsProps`, `CardSearchResponse`
- **Propsy**: `cards: CardResponse[]`, `pagination: PaginationInfo`, `onAddCard: (card: CardResponse) => void`

### CardItem

- **Opis**: Pojedyncza karta w wynikach wyszukiwania
- **Główne elementy**: Obraz karty, nazwa, koszt many, typ, przycisk dodania
- **Obsługiwane interakcje**: Kliknięcie na kartę (szczegóły), dodanie do decka
- **Obsługiwana walidacja**: Sprawdzanie czy karta już jest w decku, sprawdzanie limitów
- **Typy**: `CardItemProps`, `CardResponse`
- **Propsy**: `card: CardResponse`, `isInDeck: boolean`, `onAdd: (card: CardResponse) => void`

### DeckCards

- **Opis**: Lista kart w aktualnym decku z możliwością edycji
- **Główne elementy**: Lista kart decka, licznik kart, statystyki decka
- **Obsługiwane interakcje**: Edycja ilości kart, usuwanie kart, sortowanie
- **Obsługiwana walidacja**: Walidacja limitów kart, walidacja minimalnej ilości
- **Typy**: `DeckCardsProps`, `DeckCardResponse[]`
- **Propsy**: `cards: DeckCardResponse[]`, `onUpdate: (cardId: string, data: UpdateDeckCardRequest) => void`, `onRemove: (cardId: string) => void`

### DeckCardItem

- **Opis**: Pojedyncza karta w decku z kontrolami ilości
- **Główne elementy**: Obraz karty, nazwa, ilość, przyciski +/-/usuń
- **Obsługiwane interakcje**: Zmiana ilości, usuwanie karty, edycja notatek
- **Obsługiwana walidacja**: Walidacja limitów (4 sztuki, landy bez limitu), walidacja minimalnej ilości (0)
- **Typy**: `DeckCardItemProps`, `DeckCardResponse`
- **Propsy**: `card: DeckCardResponse`, `onUpdate: (cardId: string, data: UpdateDeckCardRequest) => void`, `onRemove: (cardId: string) => void`

## 5. Typy

### Nowe typy ViewModel

```typescript
// Stan wyszukiwania kart
interface CardSearchState {
  query: string;
  filters: FilterState;
  results: CardResponse[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

// Stan filtrów
interface FilterState {
  colors: string[];
  manaCost: {
    exact?: number;
    min?: number;
    max?: number;
    isX?: boolean;
  };
  types: string[];
}

// Stan decka
interface DeckState {
  cards: DeckCardResponse[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

// Metadane decka
interface DeckMetadata {
  id: string;
  name: string;
  format: string;
  description?: string;
}
```

### Rozszerzone typy z API

```typescript
// Rozszerzenie CardSearchParams o dodatkowe filtry
interface ExtendedCardSearchParams extends CardSearchParams {
  colors?: string[];
  mana_cost?: string;
  type?: string[];
  rarity?: string[];
  set?: string;
}

// Rozszerzenie DeckCardResponse o dodatkowe pola
interface ExtendedDeckCardResponse extends DeckCardResponse {
  isLand: boolean;
  canAddMore: boolean;
  currentCount: number;
}
```

## 6. Zarządzanie stanem

Widok wykorzystuje kombinację lokalnego stanu komponentów i globalnego stanu zarządzanego przez custom hooki:

### Custom Hooki

```typescript
// Hook do wyszukiwania kart
const useCardSearch = () => {
  const [state, setState] = useState<CardSearchState>({
    query: "",
    filters: { colors: [], manaCost: {}, types: [] },
    results: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 50, total: 0, pages: 0 },
  });

  const searchCards = useCallback(async (params: CardSearchParams) => {
    // Implementacja wyszukiwania
  }, []);

  return { state, searchCards, clearSearch };
};

// Hook do zarządzania kartami decka
const useDeckCards = (deckId: string) => {
  const [state, setState] = useState<DeckState>({
    cards: [],
    totalCount: 0,
    loading: false,
    error: null,
  });

  const addCard = useCallback(
    async (card: CardResponse) => {
      // Implementacja dodawania karty
    },
    [deckId]
  );

  const updateCard = useCallback(
    async (cardId: string, data: UpdateDeckCardRequest) => {
      // Implementacja aktualizacji karty
    },
    [deckId]
  );

  const removeCard = useCallback(
    async (cardId: string) => {
      // Implementacja usuwania karty
    },
    [deckId]
  );

  return { state, addCard, updateCard, removeCard, refreshCards };
};
```

### Stan lokalny komponentów

- **DeckHeader**: Stan edycji metadanych
- **CardFilters**: Stan aktywnych filtrów
- **CardResults**: Stan paginacji i ładowania
- **DeckCards**: Stan sortowania i wyświetlania

## 7. Integracja API

### Endpointy wykorzystywane

1. **GET /api/cards/search** - Wyszukiwanie kart
   - **Typ żądania**: `CardSearchParams`
   - **Typ odpowiedzi**: `CardSearchResponse`
   - **Użycie**: Wyszukiwanie kart w czasie rzeczywistym

2. **GET /api/decks/{deckId}/cards** - Pobieranie kart decka
   - **Typ żądania**: `GetDeckCardsQuery`
   - **Typ odpowiedzi**: `DeckCardsResponse`
   - **Użycie**: Ładowanie kart decka przy inicjalizacji

3. **POST /api/decks/{deckId}/cards** - Dodawanie karty do decka
   - **Typ żądania**: `AddCardToDeckRequest`
   - **Typ odpowiedzi**: `DeckCardResponse`
   - **Użycie**: Dodawanie nowej karty do decka

4. **PUT /api/decks/{deckId}/cards/{cardId}** - Aktualizacja karty w decku
   - **Typ żądania**: `UpdateDeckCardRequest`
   - **Typ odpowiedzi**: `DeckCardResponse`
   - **Użycie**: Zmiana ilości karty w decku

5. **DELETE /api/decks/{deckId}/cards/{cardId}** - Usuwanie karty z decka
   - **Typ żądania**: Brak
   - **Typ odpowiedzi**: Brak (204 No Content)
   - **Użycie**: Usuwanie karty z decka

### Implementacja wywołań API

```typescript
// Serwis do komunikacji z API
class DeckEditorService {
  async searchCards(params: CardSearchParams): Promise<CardSearchResponse> {
    const response = await fetch(`/api/cards/search?${new URLSearchParams(params)}`);
    return response.json();
  }

  async getDeckCards(deckId: string): Promise<DeckCardsResponse> {
    const response = await fetch(`/api/decks/${deckId}/cards`);
    return response.json();
  }

  async addCardToDeck(deckId: string, data: AddCardToDeckRequest): Promise<DeckCardResponse> {
    const response = await fetch(`/api/decks/${deckId}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateDeckCard(deckId: string, cardId: string, data: UpdateDeckCardRequest): Promise<DeckCardResponse> {
    const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async removeDeckCard(deckId: string, cardId: string): Promise<void> {
    await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
      method: "DELETE",
    });
  }
}
```

## 8. Interakcje użytkownika

### Wyszukiwanie kart

1. **Wpisywanie w pole wyszukiwania** → Debounced search (300ms opóźnienie)
2. **Wybór filtrów** → Natychmiastowe wyszukiwanie z nowymi filtrami
3. **Kliknięcie "Wyczyść"** → Reset wszystkich filtrów i wyszukiwania

### Zarządzanie kartami w decku

1. **Kliknięcie "Dodaj" przy karcie** → Sprawdzenie limitów → Dodanie karty
2. **Kliknięcie "+" przy karcie w decku** → Zwiększenie ilości (max 4)
3. **Kliknięcie "-" przy karcie w decku** → Zmniejszenie ilości (min 0)
4. **Kliknięcie "Usuń" przy karcie w decku** → Dialog potwierdzenia → Usunięcie karty

### Edycja metadanych decka

1. **Kliknięcie na nazwę/format/opis** → Przejście w tryb edycji
2. **Wprowadzenie zmian** → Walidacja w czasie rzeczywistym
3. **Kliknięcie "Zapisz"** → Zapisywanie zmian → Aktualizacja UI
4. **Kliknięcie "Anuluj"** → Przywrócenie oryginalnych wartości

## 9. Warunki i walidacja

### Walidacja limitów kart

- **Zwykłe karty**: Maksymalnie 4 sztuki w decku
- **Landy**: Bez limitu (można dodać dowolną ilość)
- **Sprawdzanie**: Przed dodaniem karty, podczas edycji ilości
- **Komponenty**: `CardItem`, `DeckCardItem`

### Walidacja metadanych decka

- **Nazwa decka**: Wymagana, maksymalnie 100 znaków
- **Format decka**: Musi być z listy dostępnych formatów
- **Opis decka**: Opcjonalny, maksymalnie 500 znaków
- **Komponenty**: `DeckHeader`

### Walidacja filtrów

- **Koszty many**: Zakres 0-15, walidacja formatu "X"
- **Typy kart**: Muszą być z listy dostępnych typów
- **Kolory**: Muszą być z listy dostępnych kolorów
- **Komponenty**: `CardFilters`

### Walidacja uprawnień

- **Dostęp do decka**: Sprawdzenie czy użytkownik ma uprawnienia
- **Format deckId**: Walidacja UUID
- **Komponenty**: `DeckEditor`

## 10. Obsługa błędów

### Błędy połączenia z API

- **Scenariusz**: Brak połączenia z internetem, timeout API
- **Obsługa**: Toast z komunikatem "Problem z połączeniem", przycisk "Spróbuj ponownie"
- **Komponenty**: Wszystkie komponenty używające API

### Błędy walidacji

- **Scenariusz**: Przekroczenie limitów kart, nieprawidłowe dane
- **Obsługa**: Toast z komunikatem błędu, podświetlenie problematycznego elementu
- **Komponenty**: `CardItem`, `DeckCardItem`, `DeckHeader`

### Błędy autoryzacji

- **Scenariusz**: Brak uprawnień do decka, wygasła sesja
- **Obsługa**: Przekierowanie do strony logowania, komunikat o błędzie
- **Komponenty**: `DeckEditor`

### Błędy serwera

- **Scenariusz**: Błąd 500, problem z bazą danych
- **Obsługa**: Toast z komunikatem "Błąd serwera", logowanie błędu
- **Komponenty**: Wszystkie komponenty używające API

## 11. Kroki implementacji

1. **Przygotowanie struktury**
   - Utworzenie katalogu `src/components/DeckEditor/`
   - Utworzenie plików komponentów zgodnie ze strukturą
   - Konfiguracja routing w Astro

2. **Implementacja typów**
   - Rozszerzenie `types.ts` o nowe typy ViewModel
   - Utworzenie interfejsów dla propsów komponentów
   - Definicja typów dla stanu i akcji

3. **Implementacja serwisów**
   - Utworzenie `DeckEditorService` do komunikacji z API
   - Implementacja custom hooków (`useCardSearch`, `useDeckCards`)
   - Utworzenie utility functions dla walidacji

4. **Implementacja komponentów podstawowych**
   - `DeckHeader` - metadane decka
   - `CardSearch` - wyszukiwarka kart
   - `CardFilters` - filtry wyszukiwania

5. **Implementacja komponentów list**
   - `CardResults` - wyniki wyszukiwania
   - `DeckCards` - karty w decku
   - `CardItem` i `DeckCardItem` - pojedyncze karty

6. **Implementacja logiki biznesowej**
   - Walidacja limitów kart
   - Obsługa filtrów i wyszukiwania
   - Synchronizacja stanu między komponentami

7. **Implementacja obsługi błędów**
   - Toast notifications
   - Obsługa błędów API
   - Fallback states

8. **Implementacja responsywności**
   - Dostosowanie layoutu do małych ekranów
   - Optymalizacja dla urządzeń dotykowych
   - Testowanie na różnych rozdzielczościach

9. **Implementacja optymalizacji**
   - Debouncing wyszukiwania
   - Lazy loading wyników
   - Memoization komponentów

10. **Testowanie i debugowanie**
    - Testowanie wszystkich scenariuszy użytkownika
    - Sprawdzenie walidacji i obsługi błędów
    - Optymalizacja wydajności
    - Testowanie responsywności
