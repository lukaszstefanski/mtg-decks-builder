-- =============================================================================
-- migracja: 20241220120000_create_mtg_decks_schema.sql
-- cel: utworzenie kompletnego schematu bazy danych dla aplikacji mtg-decks-builder
-- dotknięte tabele: users, decks, cards, deck_cards, deck_statistics, card_images
-- uwagi: implementacja row level security, indeksów wydajnościowych i polityk bezpieczeństwa
-- =============================================================================

-- włączenie rozszerzeń postgresql wymaganych dla aplikacji
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 1. utworzenie tabel głównych
-- =============================================================================

-- tabela users - zarządzana przez supabase auth
-- przechowuje dane użytkowników zintegrowane z systemem autentykacji
create table users (
    id uuid primary key default gen_random_uuid(),
    supabase_auth_id uuid unique not null,
    email varchar(255) unique not null,
    username varchar(50) unique not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- tabela decks - główna tabela przechowująca informacje o deckach użytkowników
-- zawiera metadane decku, format i podstawowe statystyki
create table decks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    name varchar(100) not null,
    description text,
    format varchar(50) not null,
    deck_size integer default 0,
    created_at timestamp with time zone default now(),
    last_modified timestamp with time zone default now()
);

-- tabela cards - karty magic the gathering
-- przechowuje tylko karty używane w deckach użytkowników (lokalne cache)
-- scryfall_id umożliwia synchronizację z zewnętrznym api
create table cards (
    id uuid primary key default gen_random_uuid(),
    scryfall_id varchar(50) unique not null,
    name varchar(255) not null,
    mana_cost varchar(50),
    type varchar(100) not null,
    rarity varchar(20) not null,
    image_url text,
    created_at timestamp with time zone default now()
);

-- tabela deck_cards - relacja wiele-do-wielu między deckami a kartami
-- przechowuje informacje o ilości kart w decku, notatkach i sideboard
create table deck_cards (
    id uuid primary key default gen_random_uuid(),
    deck_id uuid not null references decks(id) on delete cascade,
    card_id uuid not null references cards(id) on delete cascade,
    quantity integer not null default 1 check (quantity > 0),
    notes text,
    is_sideboard boolean default false,
    added_at timestamp with time zone default now(),
    unique(deck_id, card_id, is_sideboard)
);

-- tabela deck_statistics - prekalkulowane statystyki decków
-- przechowuje statystyki w formacie jsonb dla optymalizacji wydajności
create table deck_statistics (
    id uuid primary key default gen_random_uuid(),
    deck_id uuid unique not null references decks(id) on delete cascade,
    total_cards integer not null default 0,
    avg_mana_cost decimal(4,2),
    color_distribution jsonb,
    mana_curve jsonb,
    type_distribution jsonb,
    calculated_at timestamp with time zone default now()
);

-- tabela card_images - cache obrazków kart
-- opcjonalne przechowywanie obrazków w bazie danych w formacie bytea
create table card_images (
    id uuid primary key default gen_random_uuid(),
    card_id uuid unique not null references cards(id) on delete cascade,
    image_url text not null,
    image_data bytea,
    cached_at timestamp with time zone default now()
);

-- =============================================================================
-- 2. utworzenie indeksów wydajnościowych
-- =============================================================================

-- indeksy na klucze obce dla optymalizacji join'ów
create index idx_decks_user_id on decks(user_id);
create index idx_deck_cards_deck_id on deck_cards(deck_id);
create index idx_deck_cards_card_id on deck_cards(card_id);
create index idx_card_images_card_id on card_images(card_id);
create index idx_deck_statistics_deck_id on deck_statistics(deck_id);

-- indeksy na pola często filtrowane w kartach
create index idx_cards_type on cards(type);
create index idx_cards_rarity on cards(rarity);
create index idx_cards_mana_cost on cards(mana_cost);
create index idx_cards_name on cards(name);

-- indeksy na pola wyszukiwania w deckach
create index idx_decks_name on decks(name);
create index idx_decks_format on decks(format);
create index idx_decks_created_at on decks(created_at);
create index idx_decks_last_modified on decks(last_modified);

-- indeksy na pola autentykacji
create index idx_users_supabase_auth_id on users(supabase_auth_id);
create index idx_users_email on users(email);

-- indeksy złożone dla zapytań wielokryterialnych
create index idx_cards_type_rarity on cards(type, rarity);
create index idx_deck_cards_deck_sideboard on deck_cards(deck_id, is_sideboard);
create index idx_decks_user_created on decks(user_id, created_at);

-- =============================================================================
-- 3. włączenie row level security
-- =============================================================================

-- włączenie rls dla wszystkich tabel z danymi użytkowników
alter table users enable row level security;
alter table decks enable row level security;
alter table deck_cards enable row level security;
alter table deck_statistics enable row level security;

-- =============================================================================
-- 4. polityki row level security
-- =============================================================================

-- polityki dla tabeli users
-- użytkownicy mogą przeglądać tylko swoje dane
create policy "users_select_own_data" on users
    for select using (auth.uid() = supabase_auth_id);

-- użytkownicy mogą aktualizować tylko swoje dane
create policy "users_update_own_data" on users
    for update using (auth.uid() = supabase_auth_id);

-- użytkownicy mogą tworzyć tylko swoje rekordy
create policy "users_insert_own_data" on users
    for insert with check (auth.uid() = supabase_auth_id);

-- polityki dla tabeli decks
-- użytkownicy mogą przeglądać tylko swoje decki
create policy "decks_select_own_decks" on decks
    for select using (auth.uid() = (select supabase_auth_id from users where id = user_id));

-- użytkownicy mogą tworzyć tylko swoje decki
create policy "decks_insert_own_decks" on decks
    for insert with check (auth.uid() = (select supabase_auth_id from users where id = user_id));

-- użytkownicy mogą aktualizować tylko swoje decki
create policy "decks_update_own_decks" on decks
    for update using (auth.uid() = (select supabase_auth_id from users where id = user_id));

-- użytkownicy mogą usuwać tylko swoje decki
create policy "decks_delete_own_decks" on decks
    for delete using (auth.uid() = (select supabase_auth_id from users where id = user_id));

-- polityki dla tabeli deck_cards
-- użytkownicy mogą przeglądać karty tylko ze swoich decków
create policy "deck_cards_select_own_cards" on deck_cards
    for select using (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- użytkownicy mogą dodawać karty tylko do swoich decków
create policy "deck_cards_insert_own_cards" on deck_cards
    for insert with check (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- użytkownicy mogą aktualizować karty tylko w swoich deckach
create policy "deck_cards_update_own_cards" on deck_cards
    for update using (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- użytkownicy mogą usuwać karty tylko ze swoich decków
create policy "deck_cards_delete_own_cards" on deck_cards
    for delete using (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- polityki dla tabeli deck_statistics
-- użytkownicy mogą przeglądać statystyki tylko swoich decków
create policy "deck_statistics_select_own_stats" on deck_statistics
    for select using (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- użytkownicy mogą tworzyć statystyki tylko dla swoich decków
create policy "deck_statistics_insert_own_stats" on deck_statistics
    for insert with check (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- użytkownicy mogą aktualizować statystyki tylko swoich decków
create policy "deck_statistics_update_own_stats" on deck_statistics
    for update using (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- użytkownicy mogą usuwać statystyki tylko swoich decków
create policy "deck_statistics_delete_own_stats" on deck_statistics
    for delete using (auth.uid() = (select supabase_auth_id from users where id = (select user_id from decks where id = deck_id)));

-- =============================================================================
-- 5. funkcje pomocnicze
-- =============================================================================

-- funkcja do automatycznego aktualizowania pola updated_at w tabeli users
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- trigger dla automatycznego aktualizowania updated_at w tabeli users
create trigger update_users_updated_at
    before update on users
    for each row
    execute function update_updated_at_column();

-- =============================================================================
-- 6. komentarze do tabel
-- =============================================================================

comment on table users is 'tabela użytkowników zintegrowana z supabase auth';
comment on table decks is 'główna tabela decków magic the gathering';
comment on table cards is 'lokalne cache kart używanych w deckach użytkowników';
comment on table deck_cards is 'relacja wiele-do-wielu między deckami a kartami';
comment on table deck_statistics is 'prekalkulowane statystyki decków w formacie jsonb';
comment on table card_images is 'cache obrazków kart w formacie bytea';

-- komentarze do kluczowych kolumn
comment on column users.supabase_auth_id is 'id użytkownika z supabase auth';
comment on column cards.scryfall_id is 'unikalny identyfikator karty z api scryfall';
comment on column deck_cards.quantity is 'ilość kart w decku (walidacja na poziomie aplikacji)';
comment on column deck_cards.is_sideboard is 'czy karta jest w sideboard';
comment on column deck_statistics.color_distribution is 'rozkład kolorów w formacie jsonb';
comment on column deck_statistics.mana_curve is 'krzywa many w formacie jsonb';
comment on column deck_statistics.type_distribution is 'rozkład typów kart w formacie jsonb';
