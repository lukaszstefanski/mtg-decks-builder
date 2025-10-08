# Architektura UI dla MtG Decks Builder

## 1. Przegląd struktury UI

Aplikacja MtG Decks Builder MVP składa się z sześciu głównych widoków zorganizowanych w hierarchiczną strukturę nawigacji. Głównym centrum aplikacji jest Dashboard z listą decków użytkownika, z którego można przejść do edycji decków lub tworzenia nowych. Aplikacja wykorzystuje dwukolumnowy layout w DeckEditor (wyszukiwarka kart po lewej, lista kart po prawej) oraz responsywny design dostosowany do różnych urządzeń.

## 2. Lista widoków

### Login

- **Ścieżka**: `/login`
- **Główny cel**: Uwierzytelnienie użytkownika
- **Kluczowe informacje**: Formularz logowania, link do rejestracji, użycie JWT w połączeniu z Supabase
- **Kluczowe komponenty**: LoginForm, AuthLayout
- **UX, dostępność i bezpieczeństwo**: Walidacja w czasie rzeczywistym, jasne komunikaty błędów, przekierowanie po zalogowaniu

### Register

- **Ścieżka**: `/register`
- **Główny cel**: Rejestracja nowego użytkownika
- **Kluczowe informacje**: Formularz rejestracji, walidacja emaila i hasła, użycie JWT w połączeniu z Supabase
- **Kluczowe komponenty**: RegisterForm, AuthLayout
- **UX, dostępność i bezpieczeństwo**: Walidacja siły hasła, sprawdzanie unikalności emaila, automatyczne logowanie po rejestracji

### Dashboard

- **Ścieżka**: `/`
- **Główny cel**: Wyświetlenie listy decków użytkownika
- **Kluczowe informacje**: Lista decków, przycisk "Nowy deck", informacje o deckach (nazwa, format, data, liczba kart)
- **Kluczowe komponenty**: DeckList, CreateDeckButton, DeckCard
- **UX, dostępność i bezpieczeństwo**: Responsywna lista, komunikaty o braku decków, szybki dostęp do tworzenia nowego decka

### CreateDeck

- **Ścieżka**: `/decks/create`
- **Główny cel**: Tworzenie nowego decka
- **Kluczowe informacje**: Formularz z nazwą, opisem i formatem decka
- **Kluczowe komponenty**: CreateDeckForm, FormatSelector
- **UX, dostępność i bezpieczeństwo**: Walidacja nazwy decka, automatyczne przekierowanie do edytora po utworzeniu

### DeckEditor

- **Ścieżka**: `/decks/:deckId/edit`
- **Główny cel**: Edycja decka z wyszukiwaniem i zarządzaniem kartami
- **Kluczowe informacje**: Wyszukiwarka kart (lewa strona), lista kart w decku (prawa strona), metadane decka
- **Kluczowe komponenty**: CardSearch, DeckCards, DeckHeader, CardFilters
- **UX, dostępność i bezpieczeństwo**: Dwukolumnowy layout, walidacja limitów kart, toast notifications, responsywność

### EditDeck

- **Ścieżka**: `/decks/:deckId/settings`
- **Główny cel**: Edycja metadanych decka
- **Kluczowe informacje**: Formularz edycji nazwy, opisu i formatu decka
- **Kluczowe komponenty**: EditDeckForm, DeckSettings
- **UX, dostępność i bezpieczeństwo**: Walidacja zmian, możliwość anulowania, potwierdzenie zapisania

## 3. Mapa podróży użytkownika

### Główny przepływ użytkownika:

1. **Logowanie** → Użytkownik wprowadza dane → Walidacja → Dashboard
2. **Tworzenie decka** → Dashboard → "Nowy deck" → CreateDeck → Walidacja → DeckEditor
3. **Edycja decka** → Dashboard → Kliknięcie decka → DeckEditor
4. **Wyszukiwanie kart** → DeckEditor → Wprowadzenie wyszukiwania → Filtry → Wybór karty → Dodanie do decka
5. **Zarządzanie kartami** → DeckEditor → Lista kart → Edycja ilości/Usuwanie → Aktualizacja decka
6. **Edycja metadanych** → DeckEditor → "Ustawienia" → EditDeck → Zapisywanie → Powrót do DeckEditor

### Kluczowe interakcje:

- Wyszukiwanie kart z filtrami w czasie rzeczywistym
- Dodawanie/usuwanie kart z walidacją limitów
- Edycja ilości kart z kontrolą limitów
- Nawigacja między widokami z zachowaniem stanu

## 4. Układ i struktura nawigacji

### Struktura nawigacji:

- **Publiczne widoki**: Login, Register (bez nawigacji głównej)
- **Prywatne widoki**: Dashboard (centrum), CreateDeck, DeckEditor, EditDeck
- **Nawigacja główna**: Dashboard jako punkt centralny
- **Breadcrumbs**: Dashboard → DeckEditor → EditDeck
- **Nawigacja kontekstowa**: W DeckEditor dostęp do ustawień decka

### Elementy nawigacji:

- **Header**: Logo, nawigacja użytkownika, wylogowanie
- **Sidebar**: W DeckEditor - wyszukiwarka kart i filtry
- **Main content**: Lista decków (Dashboard) lub edycja decka (DeckEditor)
- **Footer**: Informacje o aplikacji

## 5. Kluczowe komponenty

### DeckList

- **Cel**: Wyświetlenie listy decków użytkownika
- **Funkcjonalności**: Sortowanie, akcje na deckach, komunikaty o braku decków
- **Stany**: Ładowanie, pusta lista, lista z deckami, błąd

### CardSearch

- **Cel**: Wyszukiwanie i filtrowanie kart
- **Funkcjonalności**: Wyszukiwanie tekstowe, filtry (kolor, koszt, typ, rzadkość), paginacja
- **Stany**: Ładowanie, wyniki, brak wyników, błąd

### DeckCards

- **Cel**: Zarządzanie kartami w decku
- **Funkcjonalności**: Lista kart, edycja ilości, usuwanie, walidacja limitów
- **Stany**: Ładowanie, lista kart, pusta lista, błąd

### CardItem

- **Cel**: Wyświetlenie pojedynczej karty
- **Funkcjonalności**: Obraz karty, akcje (dodaj/usuń)
- **Stany**: Normalny, dodany do decka, disabled (limit), ładowanie

### Toast

- **Cel**: Wyświetlanie notyfikacji
- **Funkcjonalności**: Komunikaty sukcesu/błędu, automatyczne znikanie, akcje
- **Typy**: Sukces, błąd, ostrzeżenie, informacja

### LoadingSpinner

- **Cel**: Wskaźnik ładowania
- **Funkcjonalności**: Animacja ładowania, różne rozmiary
- **Użycie**: Podczas ładowania danych, operacji API

### Pagination

- **Cel**: Nawigacja między stronami wyników
- **Funkcjonalności**: Numeracja stron, przyciski poprzednia/następna, skok do strony
- **Stany**: Aktywna strona, disabled przyciski, informacje o liczbie stron

### CardFilters

- **Cel**: Filtrowanie wyników wyszukiwania kart
- **Funkcjonalności**: Dropdown filtry, czyszczenie filtrów, kombinowanie filtrów
- **Filtry**: Kolor, koszt many, typ karty, rzadkość, set

### DeckHeader

- **Cel**: Wyświetlenie informacji o decku
- **Funkcjonalności**: Nazwa decka, format, liczba kart, akcje (edytuj, usuń)
- **Stany**: Edycja metadanych, wyświetlanie informacji

### CreateDeckForm

- **Cel**: Formularz tworzenia nowego decka
- **Funkcjonalności**: Walidacja nazwy, wybór formatu, opcjonalny opis
- **Stany**: Walidacja, zapisywanie, błąd

### EditDeckForm

- **Cel**: Formularz edycji metadanych decka
- **Funkcjonalności**: Edycja nazwy, opisu, formatu, anulowanie zmian
- **Stany**: Edycja, zapisywanie, anulowanie, błąd
