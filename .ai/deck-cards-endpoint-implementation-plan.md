# API Endpoint Implementation Plan: Deck Cards Management

## 1. Przegląd punktu końcowego

Zestaw 4 endpointów REST API do zarządzania kartami w deckach Magic: The Gathering:

- **GET** `/api/decks/{deckId}/cards` - pobieranie listy kart w decku z paginacją
- **POST** `/api/decks/{deckId}/cards` - dodawanie karty do decka
- **PUT** `/api/decks/{deckId}/cards/{cardId}` - aktualizacja karty w decku
- **DELETE** `/api/decks/{deckId}/cards/{cardId}` - usuwanie karty z decka

Wszystkie endpointy wymagają autoryzacji użytkownika i walidacji własności decka.

## 2. Szczegóły żądania

### GET /api/decks/{deckId}/cards

- **Metoda HTTP**: GET
- **Parametry ścieżki**: `deckId` (UUID, wymagany)
- **Parametry zapytania**:
  - `is_sideboard` (boolean, opcjonalny) - filtr sideboard
  - `page` (integer, opcjonalny, domyślnie 1)
  - `limit` (integer, opcjonalny, domyślnie 100)

### POST /api/decks/{deckId}/cards

- **Metoda HTTP**: POST
- **Parametry ścieżki**: `deckId` (UUID, wymagany)
- **Request Body**:

```json
{
  "card_id": "uuid",
  "quantity": 1,
  "notes": "Optional notes",
  "is_sideboard": false
}
```

### PUT /api/decks/{deckId}/cards/{cardId}

- **Metoda HTTP**: PUT
- **Parametry ścieżki**: `deckId` (UUID, wymagany), `cardId` (UUID, wymagany)
- **Request Body**:

```json
{
  "quantity": 3,
  "notes": "Updated notes",
  "is_sideboard": true
}
```

### DELETE /api/decks/{deckId}/cards/{cardId}

- **Metoda HTTP**: DELETE
- **Parametry ścieżki**: `deckId` (UUID, wymagany), `cardId` (UUID, wymagany)

## 3. Wykorzystywane typy

### DTOs (Data Transfer Objects)

- `DeckCardResponse` - odpowiedź z danymi karty w decku
- `AddCardToDeckRequest` - żądanie dodania karty
- `UpdateDeckCardRequest` - żądanie aktualizacji karty
- `DeckCardsResponse` - odpowiedź z listą kart i paginacją
- `PaginationInfo` - informacje o paginacji

### Command Modele

- `AddCardToDeckCommand` - komenda dodania karty z walidacją
- `UpdateDeckCardCommand` - komenda aktualizacji karty z walidacją
- `RemoveCardFromDeckCommand` - komenda usunięcia karty z walidacją

## 4. Szczegóły odpowiedzi

### GET /api/decks/{deckId}/cards

- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**:

```json
{
  "cards": [DeckCardResponse],
  "pagination": PaginationInfo
}
```

### POST /api/decks/{deckId}/cards

- **Kod sukcesu**: 201 Created
- **Struktura odpowiedzi**: Pojedyncza `DeckCardResponse`

### PUT /api/decks/{deckId}/cards/{cardId}

- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**: Pojedyncza `DeckCardResponse`

### DELETE /api/decks/{deckId}/cards/{cardId}

- **Kod sukcesu**: 204 No Content
- **Struktura odpowiedzi**: Brak treści

## 5. Przepływ danych

1. **Walidacja autoryzacji** - sprawdzenie JWT token z Supabase Auth
2. **Walidacja decka** - sprawdzenie istnienia i własności decka
3. **Walidacja danych wejściowych** - Zod schema validation
4. **Operacje bazodanowe**:
   - GET: SELECT z JOIN do tabeli cards + paginacja
   - POST: INSERT do deck_cards + sprawdzenie unikalności
   - PUT: UPDATE deck_cards + walidacja istnienia
   - DELETE: DELETE z deck_cards
5. **Formatowanie odpowiedzi** - mapowanie na DTOs
6. **Obsługa błędów** - standardowe kody HTTP

## 6. Względy bezpieczeństwa

### Autoryzacja

- Wymagany JWT token z Supabase Auth
- Sprawdzenie `user_id` z tokenu vs `user_id` w decku

### Walidacja danych

- Zod schemas dla wszystkich request body
- Walidacja UUID formatów
- Sprawdzenie limitów ilości (quantity > 0)
- Walidacja długości notes (max 500 znaków)

### Ochrona przed atakami

- SQL injection - używanie Supabase client (parametryzowane zapytania)
- Rate limiting - ograniczenie operacji dodawania kart
- CORS - konfiguracja dla dozwolonych domen

## 7. Obsługa błędów

### Kody błędów i scenariusze

- **400 Bad Request**: Nieprawidłowe dane wejściowe, walidacja Zod
- **401 Unauthorized**: Brak lub nieprawidłowy JWT token
- **403 Forbidden**: Użytkownik nie jest właścicielem decka
- **404 Not Found**: Deck lub karta nie istnieje
- **409 Conflict**: Karta już istnieje w tym samym miejscu (main/sideboard)
- **422 Unprocessable Entity**: Naruszenie ograniczeń biznesowych
- **500 Internal Server Error**: Błędy bazy danych, nieoczekiwane błędy

### Struktura błędów

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "status": 400,
  "errors": {
    "card_id": ["Card ID is required"],
    "quantity": ["Quantity must be greater than 0"]
  }
}
```

## 8. Rozważania dotyczące wydajności

### Optymalizacje bazodanowe

- Indeksy na `deck_id`, `card_id`, `is_sideboard`
- Paginacja z LIMIT/OFFSET
- JOIN z tabelą cards dla pełnych danych

### Caching

- Cache deck ownership (Redis/Memory)
- Cache card metadata (jeśli nie zmienia się często)

### Limity

- Maksymalna ilość kart w decku (60 main + 15 sideboard)
- Rate limiting: 100 operacji na minutę na użytkownika

## 9. Etapy wdrożenia

### 1. Przygotowanie struktury

- [ ] Utworzenie `src/lib/services/deck-card.service.ts`
- [ ] Utworzenie `src/lib/validators/deck-card.validators.ts`
- [ ] Utworzenie `src/pages/api/decks/[deckId]/cards/index.ts`
- [ ] Utworzenie `src/pages/api/decks/[deckId]/cards/[cardId].ts`

### 2. Implementacja walidatorów Zod

- [ ] Schema dla `AddCardToDeckRequest`
- [ ] Schema dla `UpdateDeckCardRequest`
- [ ] Walidacja parametrów zapytania (paginacja, filtry)

### 3. Implementacja DeckCardService

- [ ] Metoda `getDeckCards()` z paginacją i filtrami
- [ ] Metoda `addCardToDeck()` z walidacją unikalności
- [ ] Metoda `updateDeckCard()` z walidacją istnienia
- [ ] Metoda `removeCardFromDeck()` z walidacją istnienia

### 4. Implementacja endpointów API

- [ ] GET endpoint z obsługą paginacji i filtrów
- [ ] POST endpoint z walidacją i tworzeniem
- [ ] PUT endpoint z walidacją i aktualizacją
- [ ] DELETE endpoint z walidacją i usuwaniem

### 5. Implementacja middleware

- [ ] Middleware autoryzacji użytkownika
- [ ] Middleware walidacji własności decka
- [ ] Middleware obsługi błędów

### 6. Testy i walidacja

- [ ] Testy jednostkowe dla DeckCardService
- [ ] Testy integracyjne dla endpointów API
- [ ] Testy bezpieczeństwa (autoryzacja, walidacja)
- [ ] Testy wydajności (paginacja, duże decki)

### 7. Dokumentacja i wdrożenie

- [ ] Aktualizacja dokumentacji API
- [ ] Konfiguracja CORS i rate limiting
- [ ] Monitoring i logowanie błędów
- [ ] Wdrożenie na środowisko produkcyjne
