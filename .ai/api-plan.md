# REST API Plan - MtG Decks Builder

## 1. Zasoby

- **Users** - odpowiada tabeli `users` - zarządzanie użytkownikami
- **Decks** - odpowiada tabeli `decks` - zarządzanie deckami użytkowników
- **Cards** - odpowiada tabeli `cards` - karty Magic: The Gathering
- **Deck Cards** - odpowiada tabeli `deck_cards` - karty w deckach
- **Deck Statistics** - odpowiada tabeli `deck_statistics` - statystyki decków
- **Card Images** - odpowiada tabeli `card_images` - obrazy kart

## 2. Punkty końcowe

### 2.1 Users

#### GET /api/users/me

- **Opis**: Pobierz dane aktualnie zalogowanego użytkownika
- **Parametry zapytania**: Brak
- **Struktura odpowiedzi**:

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

- **Kody powodzenia**: 200 OK
- **Kody błędów**: 401 Unauthorized, 404 Not Found

#### PUT /api/users/me

- **Opis**: Aktualizuj dane aktualnie zalogowanego użytkownika
- **Struktura żądania**:

```json
{
  "username": "new_username",
  "email": "new_email@example.com"
}
```

- **Struktura odpowiedzi**: Jak w GET /api/users/me
- **Kody powodzenia**: 200 OK
- **Kody błędów**: 400 Bad Request, 401 Unauthorized, 409 Conflict

### 2.2 Decks

#### GET /api/decks

- **Opis**: Pobierz listę decków użytkownika
- **Parametry zapytania**:
  - `search` (string, opcjonalny) - wyszukiwanie po nazwie
  - `format` (string, opcjonalny) - filtr formatu
  - `page` (integer, opcjonalny, domyślnie 1) - numer strony
  - `limit` (integer, opcjonalny, domyślnie 20) - liczba elementów na stronę
  - `sort` (string, opcjonalny) - sortowanie (created_at, last_modified, name)
  - `order` (string, opcjonalny) - kierunek sortowania (asc, desc)
- **Struktura odpowiedzi**:

```json
{
  "decks": [
    {
      "id": "uuid",
      "name": "My Deck",
      "description": "Deck description",
      "format": "Standard",
      "deck_size": 60,
      "created_at": "2024-01-01T00:00:00Z",
      "last_modified": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

- **Kody powodzenia**: 200 OK
- **Kody błędów**: 401 Unauthorized

#### POST /api/decks

- **Opis**: Utwórz nowy deck
- **Struktura żądania**:

```json
{
  "name": "My New Deck",
  "description": "Deck description",
  "format": "Standard"
}
```

- **Struktura odpowiedzi**: Jak w GET /api/decks (pojedynczy deck)
- **Kody powodzenia**: 201 Created
- **Kody błędów**: 400 Bad Request, 401 Unauthorized

#### GET /api/decks/{deckId}

- **Opis**: Pobierz szczegóły konkretnego decka
- **Parametry ścieżki**: `deckId` (UUID)
- **Struktura odpowiedzi**:

```json
{
  "id": "uuid",
  "name": "My Deck",
  "description": "Deck description",
  "format": "Standard",
  "deck_size": 60,
  "created_at": "2024-01-01T00:00:00Z",
  "last_modified": "2024-01-01T00:00:00Z",
  "cards": [
    {
      "id": "uuid",
      "card_id": "uuid",
      "quantity": 4,
      "is_sideboard": false,
      "added_at": "2024-01-01T00:00:00Z",
      "card": {
        "id": "uuid",
        "name": "Lightning Bolt",
        "mana_cost": "{R}",
        "type": "Instant",
        "rarity": "Common",
        "image_url": "https://example.com/image.jpg"
      }
    }
  ]
}
```

- **Kody powodzenia**: 200 OK
- **Kody błędów**: 401 Unauthorized, 403 Forbidden, 404 Not Found

#### PUT /api/decks/{deckId}

- **Opis**: Aktualizuj deck
- **Parametry ścieżki**: `deckId` (UUID)
- **Struktura żądania**:

```json
{
  "name": "Updated Deck Name",
  "description": "Updated description",
  "format": "Modern"
}
```

- **Struktura odpowiedzi**: Jak w GET /api/decks/{deckId}
- **Kody powodzenia**: 200 OK
- **Kody błędów**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

#### DELETE /api/decks/{deckId}

- **Opis**: Usuń deck
- **Parametry ścieżki**: `deckId` (UUID)
- **Struktura odpowiedzi**: Brak (204 No Content)
- **Kody powodzenia**: 204 No Content
- **Kody błędów**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### 2.3 Cards

#### GET /api/cards/search

- **Opis**: Wyszukaj karty z filtrami
- **Parametry zapytania**:
  - `q` (string, opcjonalny) - wyszukiwanie po nazwie
  - `colors` (string[], opcjonalny) - filtry kolorów (W, U, B, R, G, C)
  - `mana_cost` (string, opcjonalny) - koszt many (np. "2", "X", "1-3")
  - `type` (string[], opcjonalny) - typy kart
  - `rarity` (string[], opcjonalny) - rzadkość
  - `set` (string, opcjonalny) - set MtG
  - `page` (integer, opcjonalny, domyślnie 1)
  - `limit` (integer, opcjonalny, domyślnie 50)
  - `sort` (string, opcjonalny) - sortowanie (name, mana_cost, created_at)
  - `order` (string, opcjonalny) - kierunek sortowania (asc, desc)
- **Struktura odpowiedzi**:

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

- **Kody powodzenia**: 200 OK
- **Kody błędów**: 400 Bad Request

#### GET /api/cards/{cardId}

- **Opis**: Pobierz szczegóły konkretnej karty
- **Parametry ścieżki**: `cardId` (UUID)
- **Struktura odpowiedzi**:

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

- **Kody powodzenia**: 200 OK
- **Kody błędów**: 404 Not Found

### 2.4 Deck Cards

#### GET /api/decks/{deckId}/cards

- **Opis**: Pobierz karty w decku
- **Parametry ścieżki**: `deckId` (UUID)
- **Parametry zapytania**:
  - `is_sideboard` (boolean, opcjonalny) - filtr sideboard
  - `page` (integer, opcjonalny, domyślnie 1)
  - `limit` (integer, opcjonalny, domyślnie 100)
- **Struktura odpowiedzi**:

```json
{
  "cards": [
    {
      "id": "uuid",
      "deck_id": "uuid",
      "card_id": "uuid",
      "quantity": 4,
      "notes": "Sideboard card",
      "is_sideboard": false,
      "added_at": "2024-01-01T00:00:00Z",
      "card": {
        "id": "uuid",
        "name": "Lightning Bolt",
        "mana_cost": "{R}",
        "type": "Instant",
        "rarity": "Common",
        "image_url": "https://example.com/image.jpg"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 60,
    "pages": 1
  }
}
```

- **Kody powodzenia**: 200 OK
- **Kody błędów**: 401 Unauthorized, 403 Forbidden, 404 Not Found

#### POST /api/decks/{deckId}/cards

- **Opis**: Dodaj kartę do decka
- **Parametry ścieżki**: `deckId` (UUID)
- **Struktura żądania**:

```json
{
  "card_id": "uuid",
  "quantity": 1,
  "notes": "Optional notes",
  "is_sideboard": false
}
```

- **Struktura odpowiedzi**: Jak w GET /api/decks/{deckId}/cards (pojedyncza karta)
- **Kody powodzenia**: 201 Created
- **Kody błędów**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict

#### PUT /api/decks/{deckId}/cards/{cardId}

- **Opis**: Aktualizuj kartę w decku
- **Parametry ścieżki**: `deckId` (UUID), `cardId` (UUID)
- **Struktura żądania**:

```json
{
  "quantity": 3,
  "notes": "Updated notes",
  "is_sideboard": true
}
```

- **Struktura odpowiedzi**: Jak w GET /api/decks/{deckId}/cards (pojedyncza karta)
- **Kody powodzenia**: 200 OK
- **Kody błędów**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

#### DELETE /api/decks/{deckId}/cards/{cardId}

- **Opis**: Usuń kartę z decka
- **Parametry ścieżki**: `deckId` (UUID), `cardId` (UUID)
- **Struktura odpowiedzi**: Brak (204 No Content)
- **Kody powodzenia**: 204 No Content
- **Kody błędów**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### 2.5 Deck Statistics

#### GET /api/decks/{deckId}/statistics

- **Opis**: Pobierz statystyki decka
- **Parametry ścieżki**: `deckId` (UUID)
- **Struktura odpowiedzi**:

```json
{
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
}
```

- **Kody powodzenia**: 200 OK
- **Kody błędów**: 401 Unauthorized, 403 Forbidden, 404 Not Found

#### POST /api/decks/{deckId}/statistics

- **Opis**: Przelicz statystyki decka
- **Parametry ścieżki**: `deckId` (UUID)
- **Struktura odpowiedzi**: Jak w GET /api/decks/{deckId}/statistics
- **Kody powodzenia**: 200 OK
- **Kody błędów**: 401 Unauthorized, 403 Forbidden, 404 Not Found

## 3. Uwierzytelnianie i autoryzacja

### Mechanizm uwierzytelniania

- **Supabase Auth** - JWT tokeny w nagłówku `Authorization: Bearer <token>`
- **Automatyczne odświeżanie tokenów** - przez Supabase client
- **Row Level Security (RLS)** - na poziomie bazy danych PostgreSQL

### Szczegóły implementacji

- Wszystkie endpointy wymagają uwierzytelnienia (oprócz wyszukiwania kart)
- RLS zapewnia izolację danych użytkowników
- Polityki RLS sprawdzają `auth.uid()` przeciwko `supabase_auth_id`
- Tokeny JWT zawierają informacje o użytkowniku
- Sesje są zarządzane przez Supabase Auth

## 4. Walidacja i logika biznesowa

### 4.1 Warunki walidacji

#### Users

- `email` - wymagane, unikalne, format email
- `username` - wymagane, unikalne, max 50 znaków
- `supabase_auth_id` - wymagane, unikalne

#### Decks

- `name` - wymagane, max 100 znaków
- `format` - wymagane, max 50 znaków
- `description` - opcjonalne, text
- `user_id` - wymagane, istniejący użytkownik

#### Cards

- `scryfall_id` - wymagane, unikalne, max 50 znaków
- `name` - wymagane, max 255 znaków
- `type` - wymagane, max 100 znaków
- `rarity` - wymagane, max 20 znaków
- `mana_cost` - opcjonalne, max 50 znaków

#### Deck Cards

- `quantity` - wymagane, > 0, max 4 dla zwykłych kart (landy bez limitu)
- `deck_id` - wymagane, istniejący deck
- `card_id` - wymagane, istniejąca karta
- `UNIQUE(deck_id, card_id, is_sideboard)` - unikalność kombinacji

### 4.2 Logika biznesowa

#### Limity kart

- **Zwykłe karty**: maksymalnie 4 sztuki w decku
- **Landy**: bez limitu
- **Walidacja**: sprawdzanie typu karty przed dodaniem
- **Błąd**: 409 Conflict przy próbie przekroczenia limitu

#### Statystyki decków

- **Automatyczne przeliczanie**: przy każdej zmianie w decku
- **Prekalkulowane dane**: przechowywane w tabeli `deck_statistics`
- **Format JSONB**: elastyczne struktury danych
- **Aktualizacja**: trigger lub job po zmianach w `deck_cards`

#### Wyszukiwanie kart

- **Integracja z Scryfall API**: pobieranie danych kart
- **Lokalne cache**: przechowywanie tylko używanych kart
- **Filtry**: kolor, koszt many, typ, rzadkość, set
- **Sortowanie**: nazwa, koszt many, data utworzenia
- **Paginacja**: domyślnie 50 wyników, max 100

#### Bezpieczeństwo danych

- **RLS**: izolacja danych użytkowników
- **Walidacja uprawnień**: sprawdzanie własności decków
- **Audit trail**: logowanie zmian w deckach
- **Rate limiting**: ochrona przed nadużyciami API
