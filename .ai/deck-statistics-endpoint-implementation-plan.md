# API Endpoint Implementation Plan: Deck Statistics

## 1. Przegląd punktu końcowego

Endpointy statystyk decków umożliwiają pobieranie i przeliczanie szczegółowych statystyk dla konkretnego decka Magic: The Gathering. Statystyki obejmują rozkład kolorów, krzywą many, rozkład typów kart oraz średni koszt many. Endpointy wymagają autoryzacji i sprawdzenia własności decka.

## 2. Szczegóły żądania

### GET /api/decks/{deckId}/statistics

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/decks/{deckId}/statistics`
- **Parametry**:
  - Wymagane: `deckId` (UUID) - identyfikator decka
  - Opcjonalne: brak
- **Request Body**: brak

### POST /api/decks/{deckId}/statistics

- **Metoda HTTP**: POST
- **Struktura URL**: `/api/decks/{deckId}/statistics`
- **Parametry**:
  - Wymagane: `deckId` (UUID) - identyfikator decka
  - Opcjonalne: brak
- **Request Body**: brak

## 3. Wykorzystywane typy

### DTOs

- `DeckStatisticsResponse` - struktura odpowiedzi ze statystykami
- `ApiResponse<DeckStatisticsResponse>` - opakowanie odpowiedzi API
- `ApiErrorResponse` - struktura błędów API

### Command Modele

- `RecalculateDeckStatisticsCommand` - komenda przeliczania statystyk

### Typy walidacji

- UUID walidacja dla `deckId`
- Sprawdzenie istnienia decka
- Sprawdzenie własności decka

## 4. Szczegóły odpowiedzi

### GET /api/decks/{deckId}/statistics

- **Kod powodzenia**: 200 OK
- **Struktura odpowiedzi**:

```json
{
  "data": {
    "deck_id": "uuid",
    "total_cards": 60,
    "avg_mana_cost": 2.5,
    "color_distribution": {
      "W": 10,
      "U": 15,
      "B": 5,
      "R": 20,
      "G": 8,
      "C": 2
    },
    "mana_curve": {
      "0": 2,
      "1": 8,
      "2": 12,
      "3": 15,
      "4": 10,
      "5": 8,
      "6+": 5
    },
    "type_distribution": {
      "Creature": 20,
      "Instant": 8,
      "Sorcery": 5,
      "Enchantment": 3,
      "Artifact": 2,
      "Land": 22
    },
    "calculated_at": "2024-01-01T00:00:00Z"
  },
  "success": true
}
```

### POST /api/decks/{deckId}/statistics

- **Kod powodzenia**: 200 OK
- **Struktura odpowiedzi**: Identyczna jak GET

## 5. Przepływ danych

### GET /api/decks/{deckId}/statistics

1. Walidacja UUID deckId
2. Sprawdzenie autoryzacji użytkownika
3. Sprawdzenie istnienia decka
4. Sprawdzenie własności decka
5. Pobranie statystyk z tabeli `deck_statistics`
6. Zwrócenie statystyk lub błędu

### POST /api/decks/{deckId}/statistics

1. Walidacja UUID deckId
2. Sprawdzenie autoryzacji użytkownika
3. Sprawdzenie istnienia decka
4. Sprawdzenie własności decka
5. Pobranie kart decka z tabeli `deck_cards`
6. Obliczenie statystyk:
   - Total cards
   - Average mana cost
   - Color distribution
   - Mana curve
   - Type distribution
7. Zapisanie/aktualizacja statystyk w tabeli `deck_statistics`
8. Zwrócenie nowych statystyk

## 6. Względy bezpieczeństwa

### Autoryzacja

- Sprawdzenie JWT token w headerze Authorization
- Walidacja sesji użytkownika przez Supabase Auth
- Sprawdzenie czy użytkownik ma dostęp do decka

### Walidacja danych

- Walidacja UUID formatu dla deckId
- Sprawdzenie istnienia decka w bazie danych
- Sprawdzenie czy deck należy do użytkownika

### Rate Limiting

- Ograniczenie częstotliwości wywołań POST (przeliczanie statystyk)
- Maksymalnie 10 wywołań POST na minutę na użytkownika

## 7. Obsługa błędów

### Kody błędów i scenariusze

- **400 Bad Request**: Nieprawidłowy format UUID deckId
- **401 Unauthorized**: Brak tokenu autoryzacji lub nieprawidłowy token
- **403 Forbidden**: Użytkownik nie ma dostępu do decka
- **404 Not Found**: Deck nie istnieje
- **500 Internal Server Error**: Błąd bazy danych lub obliczeń

### Logowanie błędów

- Logowanie wszystkich błędów autoryzacji
- Logowanie błędów bazy danych z kontekstem
- Logowanie błędów obliczeń statystyk

## 8. Rozważania dotyczące wydajności

### Optymalizacje

- Cache statystyk w tabeli `deck_statistics`
- Przeliczanie statystyk tylko gdy zmienia się skład decka
- Indeksy na `deck_id` w tabeli `deck_statistics`
- Batch processing dla dużych decków

### Potencjalne wąskie gardła

- Obliczenia statystyk dla decków z dużą liczbą kart
- Równoczesne przeliczanie statystyk przez wielu użytkowników
- Zapytania do bazy danych podczas obliczeń

## 9. Etapy wdrożenia

### 1. Przygotowanie struktury

- Utworzenie katalogu `src/pages/api/decks/[deckId]/statistics/`
- Utworzenie plików `GET.ts` i `POST.ts`

### 2. Implementacja serwisu

- Utworzenie `src/lib/services/deck-statistics.service.ts`
- Implementacja metod `getStatistics()` i `recalculateStatistics()`
- Implementacja algorytmów obliczania statystyk

### 3. Implementacja endpointu GET

- Walidacja parametrów
- Sprawdzenie autoryzacji
- Sprawdzenie własności decka
- Pobranie statystyk z bazy danych
- Zwrócenie odpowiedzi

### 4. Implementacja endpointu POST

- Walidacja parametrów
- Sprawdzenie autoryzacji
- Sprawdzenie własności decka
- Pobranie kart decka
- Obliczenie statystyk
- Zapisanie statystyk
- Zwrócenie odpowiedzi

### 5. Walidacja i testy

- Testy jednostkowe serwisu
- Testy integracyjne endpointów
- Testy scenariuszy błędów
- Testy wydajności

### 6. Dokumentacja

- Aktualizacja dokumentacji API
- Przykłady użycia
- Opis algorytmów obliczania statystyk

### 7. Wdrożenie

- Deploy na środowisko testowe
- Testy na danych produkcyjnych
- Deploy na środowisko produkcyjne
- Monitoring wydajności

### 8. Optymalizacje

- Implementacja cache'owania
- Optymalizacja zapytań do bazy danych
- Monitoring i alerting
- Dostosowanie rate limiting
