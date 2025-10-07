# Schemat bazy danych - MtG Decks Builder

## 1. Tabele z kolumnami, typami danych i ograniczeniami

### 1.1 Tabela `users`

This table is managed by Supabase Auth.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supabase_auth_id UUID UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 Tabela `decks`

```sql
CREATE TABLE decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    format VARCHAR(50) NOT NULL,
    deck_size INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.3 Tabela `cards`

```sql
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scryfall_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    mana_cost VARCHAR(50),
    type VARCHAR(100) NOT NULL,
    rarity VARCHAR(20) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.4 Tabela `deck_cards`

```sql
CREATE TABLE deck_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    notes TEXT,
    is_sideboard BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(deck_id, card_id, is_sideboard)
);
```

### 1.5 Tabela `deck_statistics`

```sql
CREATE TABLE deck_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID UNIQUE NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    total_cards INTEGER NOT NULL DEFAULT 0,
    avg_mana_cost DECIMAL(4,2),
    color_distribution JSONB,
    mana_curve JSONB,
    type_distribution JSONB,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.6 Tabela `card_images`

```sql
CREATE TABLE card_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID UNIQUE NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_data BYTEA,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Relacje między tabelami

### 2.1 Relacje jeden-do-wielu

- `users` → `decks` (1:N) - jeden użytkownik może mieć wiele decków
- `decks` → `deck_cards` (1:N) - jeden deck może zawierać wiele kart
- `cards` → `deck_cards` (1:N) - jedna karta może być w wielu deckach
- `cards` → `card_images` (1:1) - jedna karta ma jeden obrazek
- `decks` → `deck_statistics` (1:1) - jeden deck ma jedną statystykę

### 2.2 Relacje wiele-do-wielu

- `decks` ↔ `cards` (M:N) - przez tabelę `deck_cards`

## 3. Indeksy

### 3.1 Indeksy podstawowe

```sql
-- Indeksy na klucze obce
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_deck_cards_deck_id ON deck_cards(deck_id);
CREATE INDEX idx_deck_cards_card_id ON deck_cards(card_id);
CREATE INDEX idx_card_images_card_id ON card_images(card_id);
CREATE INDEX idx_deck_statistics_deck_id ON deck_statistics(deck_id);
```

### 3.2 Indeksy wydajnościowe

```sql
-- Indeksy na pola często filtrowane
CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_mana_cost ON cards(mana_cost);
CREATE INDEX idx_cards_name ON cards(name);

-- Indeksy na pola wyszukiwania
CREATE INDEX idx_decks_name ON decks(name);
CREATE INDEX idx_decks_format ON decks(format);
CREATE INDEX idx_decks_created_at ON decks(created_at);
CREATE INDEX idx_decks_last_modified ON decks(last_modified);

-- Indeksy na pola autentykacji
CREATE INDEX idx_users_supabase_auth_id ON users(supabase_auth_id);
CREATE INDEX idx_users_email ON users(email);
```

### 3.3 Indeksy złożone

```sql
-- Indeksy dla zapytań wielokryterialnych
CREATE INDEX idx_cards_type_rarity ON cards(type, rarity);
CREATE INDEX idx_deck_cards_deck_sideboard ON deck_cards(deck_id, is_sideboard);
CREATE INDEX idx_decks_user_created ON decks(user_id, created_at);
```

## 4. Zasady PostgreSQL (RLS)

### 4.1 Włączenie RLS

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_statistics ENABLE ROW LEVEL SECURITY;
```

### 4.2 Polityki RLS

```sql
-- Polityka dla tabeli users
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = supabase_auth_id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = supabase_auth_id);

-- Polityka dla tabeli decks
CREATE POLICY "Users can view own decks" ON decks
    FOR SELECT USING (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert own decks" ON decks
    FOR INSERT WITH CHECK (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update own decks" ON decks
    FOR UPDATE USING (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete own decks" ON decks
    FOR DELETE USING (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = user_id));

-- Polityka dla tabeli deck_cards
CREATE POLICY "Users can view own deck cards" ON deck_cards
    FOR SELECT USING (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = (SELECT user_id FROM decks WHERE id = deck_id)));

CREATE POLICY "Users can insert own deck cards" ON deck_cards
    FOR INSERT WITH CHECK (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = (SELECT user_id FROM decks WHERE id = deck_id)));

CREATE POLICY "Users can update own deck cards" ON deck_cards
    FOR UPDATE USING (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = (SELECT user_id FROM decks WHERE id = deck_id)));

CREATE POLICY "Users can delete own deck cards" ON deck_cards
    FOR DELETE USING (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = (SELECT user_id FROM decks WHERE id = deck_id)));

-- Polityka dla tabeli deck_statistics
CREATE POLICY "Users can view own deck statistics" ON deck_statistics
    FOR SELECT USING (auth.uid() = (SELECT supabase_auth_id FROM users WHERE id = (SELECT user_id FROM decks WHERE id = deck_id)));
```

## 5. Dodatkowe uwagi i wyjaśnienia

### 5.1 Decyzje projektowe

**Lokalne cache'owanie kart:**

- Tabela `cards` przechowuje tylko karty używane w deckach użytkowników
- Pole `scryfall_id` umożliwia synchronizację z zewnętrznym API
- Brak potrzeby przechowywania wszystkich kart z Scryfall

**Walidacja limitów kart:**

- Ograniczenie `CHECK (quantity > 0)` w tabeli `deck_cards`
- Walidacja limitu 4 sztuk dla zwykłych kart na poziomie aplikacji
- Landy nie mają limitu (walidacja na poziomie aplikacji)

**Prekalkulowane statystyki:**

- Tabela `deck_statistics` przechowuje statystyki w formacie JSONB
- Aktualizacja statystyk przy zmianach w decku
- Optymalizacja wydajności zapytań

**Cache'owanie obrazków:**

- Tabela `card_images` przechowuje obrazki w formacie BYTEA
- Pole `cached_at` umożliwia zarządzanie cache'em
- Opcjonalne przechowywanie obrazków w bazie danych

### 5.2 Optymalizacje wydajności

**Indeksy:**

- Indeksy na polach często filtrowanych (type, rarity, mana_cost)
- Indeksy złożone dla zapytań wielokryterialnych
- Indeksy na pola wyszukiwania (name, format)

**Normalizacja:**

- Schemat znormalizowany do 3NF
- Denormalizacja statystyk w tabeli `deck_statistics` dla wydajności
- JSONB dla elastycznych struktur danych

### 5.3 Bezpieczeństwo

**Row Level Security:**

- Pełna izolacja danych użytkowników
- Polityki RLS dla wszystkich tabel z danymi użytkowników
- Integracja z Supabase Auth

**Walidacja:**

- Ograniczenia na poziomie bazy danych
- Walidacja limitów kart na poziomie aplikacji
- Unikalność kombinacji deck_id + card_id + is_sideboard

### 5.4 Skalowalność

**Struktura:**

- UUID jako klucze podstawowe dla lepszej skalowalności
- Indeksy na klucze obce dla wydajności JOIN
- Optymalizacja zapytań przez odpowiednie indeksy

**Cache'owanie:**

- Lokalne przechowywanie tylko używanych kart
- Cache'owanie obrazków kart
- Prekalkulowane statystyki decków
