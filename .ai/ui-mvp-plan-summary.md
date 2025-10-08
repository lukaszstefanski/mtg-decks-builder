# Podsumowanie planowania architektury UI - MtG Decks Builder MVP

## Decyzje podjęte przez użytkownika

1. Strona główna wyświetla listę decków użytkownika z przyciskiem do tworzenia nowego decka
2. Kliknięcie na deck przenosi do ekranu edycji decka z kartami
3. Wyszukiwarka kart znajduje się na ekranie edycji decka po lewej stronie
4. Lista kart w decku wyświetla się po prawej stronie
5. Filtry kart implementowane jako dropdown
6. Walidacja limitów kart przez disabled przycisk (4 sztuki dla zwykłych kart, bez limitu dla landów)
7. Jedna lista kart bez podziału na mainboard/sideboard
8. Osobne strony dla logowania i rejestracji
9. Brak wyszukiwania decków na liście głównej
10. Karty wyświetlane jako obrazki z URL z API
11. Tradycyjna paginacja zamiast infinite scroll
12. Spinnery dla stanów ładowania
13. Brak eksportu decków w MVP
14. Brak statystyk decków w MVP
15. Brak dark mode w MVP
16. Globalne notyfikacje w postaci toastów
17. Brak funkcjonalności undo
18. Brak obsługi formatów MtG
19. Brak porównywania decków w MVP
20. Brak obsługi offline

## Najistotniejsze zalecenia dopasowane do rozmowy

1. Główna strona jako lista decków z możliwością tworzenia nowego
2. Hierarchia nawigacji: Dashboard → Deck Details → Deck Editor
3. Wyszukiwanie kart jako część ekranu edycji decka
4. Responsywny sidebar dla filtrów (dropdown w tym przypadku)
5. Statystyki jako osobna zakładka (nie implementowane w MVP)
6. Inline notifications dla walidacji limitów
7. Dwie osobne sekcje dla kart (uproszczone do jednej listy)
8. Osobne strony dla autentykacji
9. Zintegrowane wyszukiwanie w nawigacji (nie implementowane)
10. Thumbnails w listach z możliwością podglądu
11. Tradycyjna paginacja
12. Skeleton screens vs spinners (wybrano spinners)
13. Eksport do formatu tekstowego (nie implementowane)
14. Responsywność jako good enough
15. Dark mode jako podstawowa funkcjonalność (nie implementowane)
16. Kontekstowe komunikaty z globalnymi notyfikacjami
17. Funkcjonalność undo (nie implementowana)
18. Filtry w wyszukiwaniu kart
19. Porównywanie decków (nie implementowane)
20. Podstawowe cache'owanie (nie implementowane)

## Szczegółowe podsumowanie rozmowy

### Główne wymagania architektury UI

Aplikacja MtG Decks Builder MVP będzie składać się z trzech głównych widoków:

- **Dashboard** - lista decków użytkownika z możliwością tworzenia nowego
- **Deck Editor** - ekran edycji decka z wyszukiwarką kart po lewej i listą kart po prawej
- **Authentication** - osobne strony logowania i rejestracji

### Kluczowe widoki i przepływy użytkownika

**Przepływ główny:**

1. Użytkownik loguje się → Dashboard (lista decków)
2. Kliknięcie "Nowy deck" → formularz tworzenia → Deck Editor
3. Kliknięcie istniejącego decka → Deck Editor
4. W Deck Editor: wyszukiwanie kart (lewa strona) + zarządzanie kartami (prawa strona)

**Komponenty kluczowe:**

- Lista decków z przyciskami akcji
- Wyszukiwarka kart z filtrami dropdown
- Lista kart w decku z możliwością edycji ilości
- Formularze autentykacji
- Toast notifications dla błędów

### Strategia integracji z API

**Endpoints wykorzystywane:**

- `GET /api/decks` - lista decków na dashboard
- `POST /api/decks` - tworzenie nowego decka
- `GET /api/cards/search` - wyszukiwanie kart
- `GET /api/decks/{deckId}/cards` - karty w decku
- `POST /api/decks/{deckId}/cards` - dodawanie kart
- `PUT /api/decks/{deckId}/cards/{cardId}` - edycja ilości
- `DELETE /api/decks/{deckId}/cards/{cardId}` - usuwanie kart

**Zarządzanie stanem:**

- Lokalny stan dla UI (filtry, paginacja)
- Synchronizacja z API przy każdej akcji
- Walidacja limitów kart po stronie klienta

### Kwestie responsywności, dostępności i bezpieczeństwa

**Responsywność:**

- Good enough approach - podstawowa responsywność
- Layout dwukolumnowy na desktop (wyszukiwarka + lista)
- Stack layout na mobile

**Dostępność:**

- Toast notifications dla wszystkich akcji
- Disabled states dla przycisków przy limitach
- Jasne komunikaty błędów

**Bezpieczeństwo:**

- Autentykacja przez Supabase Auth
- RLS na poziomie bazy danych
- Walidacja uprawnień do decków

## Nierozwiązane kwestie

1. Szczegóły implementacji toast notification system
2. Strategia cache'owania obrazków kart
3. Obsługa błędów połączenia z API Scryfall
4. Szczegóły walidacji typów kart (landy vs zwykłe karty)
5. Implementacja paginacji w wyszukiwarce kart
6. Szczegóły UX dla disabled states przycisków
7. Strategia ładowania obrazków kart (lazy loading)
8. Obsługa błędów autentykacji i sesji
