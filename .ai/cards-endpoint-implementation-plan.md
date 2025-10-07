# API Endpoint Implementation Plan: Cards Endpoints

## 1. Przegląd punktu końcowego

Endpointy kart MtG umożliwiają wyszukiwanie i pobieranie szczegółów kart Magic: The Gathering z bazy danych. System obsługuje zaawansowane wyszukiwanie z filtrami oraz pobieranie pojedynczych kart po ID.

**Endpointy:**

- `GET /api/cards/search` - wyszukiwanie kart z filtrami i paginacją
- `GET /api/cards/{cardId}` - pobieranie szczegółów konkretnej karty

## 2. Szczegóły żądania

### GET /api/cards/search

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/cards/search`
- **Parametry zapytania** (wszystkie opcjonalne):
  - `q` (string) - wyszukiwanie po nazwie karty
  - `colors` (string[]) - filtry kolorów (W, U, B, R, G, C)
  - `mana_cost` (string) - koszt many (np. "2", "X", "1-3")
  - `type` (string[]) - typy kart
  - `rarity` (string[]) - rzadkość kart
  - `set` (string) - set MtG
  - `page` (integer, domyślnie 1) - numer strony
  - `limit` (integer, domyślnie 50, max 100) - liczba wyników na stronę
  - `sort` (string) - sortowanie (name, mana_cost, created_at)
  - `order` (string) - kierunek sortowania (asc, desc)

### GET /api/cards/{cardId}

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/cards/{cardId}`
- **Parametry ścieżki**:
  - `cardId` (UUID, wymagany) - identyfikator karty

## 3. Wykorzystywane typy

**DTOs (już zdefiniowane w types.ts):**

- `CardResponse` - podstawowa struktura odpowiedzi karty
- `CardSearchParams` - parametry wyszukiwania
- `CardSearchResponse` - odpowiedź z listą kart i paginacją
- `PaginationInfo` - informacje o paginacji

**Nowe typy do utworzenia:**

- `CardSearchQuery` - walidowany schemat Zod dla parametrów wyszukiwania
- `CardService` - service do obsługi logiki kart

## 4. Szczegóły odpowiedzi

### GET /api/cards/search

**Sukces (200 OK):**

```json
{
  "cards": [
    {
      "id": "uuid",
      "scryfall_id": "scryfall_id",
      "name": "Lightning Bolt",
      "mana_cost": "{R}",
      "type": "Instant",
      "rarity": "Common",
      "image_url": "https://example.com/image.jpg",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "pages": 20
  }
}
```

### GET /api/cards/{cardId}

**Sukces (200 OK):**

```json
{
  "id": "uuid",
  "scryfall_id": "scryfall_id",
  "name": "Lightning Bolt",
  "mana_cost": "{R}",
  "type": "Instant",
  "rarity": "Common",
  "image_url": "https://example.com/image.jpg",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 5. Przepływ danych

1. **Walidacja parametrów** - sprawdzenie poprawności parametrów zapytania
2. **Konwersja parametrów** - transformacja parametrów do formatu Supabase
3. **Zapytanie do bazy** - wykonanie zapytania SQL z filtrami
4. **Paginacja** - obliczenie metadanych paginacji
5. **Formatowanie odpowiedzi** - mapowanie wyników na DTOs
6. **Zwrócenie odpowiedzi** - serializacja do JSON

## 6. Względy bezpieczeństwa

- **Endpointy publiczne** - nie wymagają autoryzacji
- **Walidacja inputów** - wszystkie parametry walidowane przez Zod
- **SQL Injection Protection** - używanie Supabase query builder
- **Rate Limiting** - ograniczenie liczby zapytań na endpoint search
- **UUID Validation** - sprawdzenie poprawności formatu UUID dla cardId
- **Input Sanitization** - oczyszczanie parametrów tekstowych

## 7. Obsługa błędów

### Kody błędów i scenariusze:

**400 Bad Request:**

- Nieprawidłowe parametry zapytania
- Nieprawidłowy format UUID dla cardId
- Wartości poza dozwolonymi zakresami (limit > 100, page < 1)

**404 Not Found:**

- Karta o podanym ID nie istnieje (GET /api/cards/{cardId})

**500 Internal Server Error:**

- Błędy połączenia z bazą danych
- Błędy parsowania odpowiedzi
- Nieoczekiwane błędy serwera

### Struktura odpowiedzi błędów:

```json
{
  "error": "Bad Request",
  "message": "Invalid query parameters",
  "status": 400
}
```

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych** - optymalizacja zapytań na kolumnach: name, type, rarity, mana_cost
- **Paginacja** - ograniczenie domyślnego limitu do 50 wyników
- **Caching** - cache dla popularnych zapytań wyszukiwania
- **Query Optimization** - używanie select() do ograniczenia zwracanych kolumn
- **Connection Pooling** - optymalizacja połączeń z Supabase

## 9. Etapy wdrożenia

### Krok 1: Utworzenie schematów walidacji

- Utworzenie `src/lib/schemas/card.schemas.ts` z schematami Zod
- Walidacja parametrów wyszukiwania
- Walidacja UUID dla cardId

### Krok 2: Implementacja CardService

- Utworzenie `src/lib/services/card.service.ts`
- Implementacja metody `searchCards()` z filtrami
- Implementacja metody `getCardById()`
- Obsługa paginacji i sortowania

### Krok 3: Implementacja endpointu search

- Utworzenie `src/pages/api/cards/search.ts`
- Walidacja parametrów zapytania
- Wywołanie CardService.searchCards()
- Formatowanie odpowiedzi z paginacją
- Obsługa błędów

### Krok 4: Implementacja endpointu get by ID

- Utworzenie `src/pages/api/cards/[cardId].ts`
- Walidacja UUID cardId
- Wywołanie CardService.getCardById()
- Formatowanie odpowiedzi
- Obsługa błędów 404

### Krok 5: Testy i optymalizacja

- Testy jednostkowe dla CardService
- Testy integracyjne dla endpointów
- Optymalizacja zapytań SQL
- Implementacja cache'owania

### Krok 6: Dokumentacja i monitoring

- Aktualizacja dokumentacji API
- Dodanie logowania błędów
- Monitoring wydajności endpointów
- Rate limiting implementation

## 10. Struktura plików

```
src/
├── lib/
│   ├── schemas/
│   │   └── card.schemas.ts
│   └── services/
│       └── card.service.ts
└── pages/
    └── api/
        └── cards/
            ├── search.ts
            └── [cardId].ts
```

## 11. Przykłady zapytań

**Wyszukiwanie kart:**

```
GET /api/cards/search?q=lightning&colors=R&type=Instant&page=1&limit=10
```

**Pobieranie konkretnej karty:**

```
GET /api/cards/123e4567-e89b-12d3-a456-426614174000
```

## 12. Metryki sukcesu

- Czas odpowiedzi < 200ms dla prostych zapytań
- Czas odpowiedzi < 500ms dla złożonych zapytań z filtrami
- Dostępność 99.9%
- Obsługa do 1000 zapytań na minutę
- Poprawna walidacja wszystkich parametrów wejściowych
