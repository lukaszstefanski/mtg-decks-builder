# API Endpoint Implementation Plan: Deck Management Endpoints

## 1. Przegląd punktu końcowego

Zestaw 5 endpointów REST API do zarządzania deckami Magic: The Gathering:

- **GET /api/decks** - pobieranie listy decków użytkownika z paginacją i filtrami
- **POST /api/decks** - tworzenie nowego decka
- **GET /api/decks/{deckId}** - pobieranie szczegółów konkretnego decka
- **PUT /api/decks/{deckId}** - aktualizacja decka
- **DELETE /api/decks/{deckId}** - usuwanie decka

Wszystkie endpointy wymagają autentykacji użytkownika i sprawdzają uprawnienia do decków.

## 2. Szczegóły żądania

### GET /api/decks

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/decks`
- **Parametry query**:
  - `search` (string, opcjonalny) - wyszukiwanie po nazwie
  - `format` (string, opcjonalny) - filtr formatu
  - `page` (integer, opcjonalny, domyślnie 1) - numer strony
  - `limit` (integer, opcjonalny, domyślnie 20) - liczba elementów na stronę
  - `sort` (string, opcjonalny) - sortowanie (created_at, last_modified, name)
  - `order` (string, opcjonalny) - kierunek sortowania (asc, desc)

### POST /api/decks

- **Metoda HTTP**: POST
- **Struktura URL**: `/api/decks`
- **Request Body**:

```json
{
  "name": "string (wymagane, max 100 znaków)",
  "description": "string (opcjonalne)",
  "format": "string (wymagane, max 50 znaków)"
}
```

### GET /api/decks/{deckId}

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/decks/{deckId}`
- **Parametry ścieżki**: `deckId` (UUID, wymagany)

### PUT /api/decks/{deckId}

- **Metoda HTTP**: PUT
- **Struktura URL**: `/api/decks/{deckId}`
- **Parametry ścieżki**: `deckId` (UUID, wymagany)
- **Request Body**:

```json
{
  "name": "string (opcjonalne, max 100 znaków)",
  "description": "string (opcjonalne)",
  "format": "string (opcjonalne, max 50 znaków)"
}
```

### DELETE /api/decks/{deckId}

- **Metoda HTTP**: DELETE
- **Struktura URL**: `/api/decks/{deckId}`
- **Parametry ścieżki**: `deckId` (UUID, wymagany)

## 3. Wykorzystywane typy

### DTOs (Data Transfer Objects)

- `DeckResponse` - podstawowa struktura decka
- `CreateDeckRequest` - dane do tworzenia decka
- `UpdateDeckRequest` - dane do aktualizacji decka
- `DeckListResponse` - lista decków z paginacją
- `DeckDetailResponse` - szczegóły decka z kartami
- `DeckCardResponse` - karty w decku
- `CardData` - dane karty
- `PaginationInfo` - informacje o paginacji

### Command Modele

- `CreateDeckCommand` - komenda tworzenia decka
- `UpdateDeckCommand` - komenda aktualizacji decka
- `DeleteDeckCommand` - komenda usuwania decka

### Error Types

- `ApiErrorResponse` - standardowa struktura błędu
- `ValidationErrorResponse` - błędy walidacji

## 4. Szczegóły odpowiedzi

### GET /api/decks

- **200 OK**: Lista decków z paginacją
- **401 Unauthorized**: Brak autentykacji

### POST /api/decks

- **201 Created**: Utworzony deck
- **400 Bad Request**: Nieprawidłowe dane wejściowe
- **401 Unauthorized**: Brak autentykacji

### GET /api/decks/{deckId}

- **200 OK**: Szczegóły decka z kartami
- **401 Unauthorized**: Brak autentykacji
- **403 Forbidden**: Brak uprawnień do decka
- **404 Not Found**: Deck nie istnieje

### PUT /api/decks/{deckId}

- **200 OK**: Zaktualizowany deck
- **400 Bad Request**: Nieprawidłowe dane wejściowe
- **401 Unauthorized**: Brak autentykacji
- **403 Forbidden**: Brak uprawnień do decka
- **404 Not Found**: Deck nie istnieje

### DELETE /api/decks/{deckId}

- **204 No Content**: Deck usunięty
- **401 Unauthorized**: Brak autentykacji
- **403 Forbidden**: Brak uprawnień do decka
- **404 Not Found**: Deck nie istnieje

## 5. Przepływ danych

1. **Autentykacja**: Sprawdzenie JWT token z Supabase Auth
2. **Walidacja**: Walidacja parametrów i danych wejściowych z Zod
3. **Autoryzacja**: Sprawdzenie uprawnień użytkownika do decków
4. **Operacje bazodanowe**:
   - Supabase queries z RLS (Row Level Security)
   - Paginacja i filtrowanie
   - Join z tabelą cards dla szczegółów decka
5. **Response**: Formatowanie odpowiedzi zgodnie z DTOs

## 6. Względy bezpieczeństwa

- **Autentykacja**: Wymagany JWT token z Supabase Auth
- **Autoryzacja**: Sprawdzanie własności decków (user_id)
- **Walidacja danych**: Zod schemas dla wszystkich inputów
- **SQL Injection**: Ochrona przez Supabase ORM
- **XSS**: Walidacja i escape'owanie stringów
- **RLS**: Row Level Security w Supabase dla dodatkowej ochrony
- **Rate Limiting**: Ograniczenie liczby requestów (middleware)

## 7. Obsługa błędów

### Walidacja danych wejściowych

- **400 Bad Request**: Nieprawidłowe dane w request body
- **ValidationErrorResponse**: Szczegółowe błędy walidacji pól

### Autoryzacja

- **401 Unauthorized**: Brak lub nieprawidłowy JWT token
- **403 Forbidden**: Użytkownik nie ma uprawnień do decka

### Zasoby

- **404 Not Found**: Deck nie istnieje lub nie należy do użytkownika

### Serwer

- **500 Internal Server Error**: Błędy bazy danych, Supabase, lub inne błędy serwera
- Logowanie błędów do systemu monitoringu

## 8. Rozważania dotyczące wydajności

- **Paginacja**: Ograniczenie do 100 elementów na stronę
- **Indeksy**: Indeksy na user_id, format, created_at, last_modified
- **Caching**: Cache decków użytkownika (Redis - opcjonalnie)
- **Lazy Loading**: Karty decka ładowane tylko gdy potrzebne
- **Query Optimization**: Optymalizacja zapytań Supabase
- **Connection Pooling**: Wykorzystanie Supabase connection pool

## 9. Etapy wdrożenia

1. **Utworzenie Zod schemas** dla walidacji request/response
2. **Implementacja DeckService** w `src/lib/services/deck.service.ts`
3. **Utworzenie endpointów API** w `src/pages/api/decks/`:
   - `index.ts` (GET, POST)
   - `[deckId].ts` (GET, PUT, DELETE)
4. **Implementacja middleware** dla autentykacji w `src/middleware/index.ts`
5. **Dodanie error handling** i logging
6. **Testy jednostkowe** dla każdego endpointu
7. **Testy integracyjne** z Supabase
8. **Dokumentacja API** w README
9. **Deployment** i monitoring
