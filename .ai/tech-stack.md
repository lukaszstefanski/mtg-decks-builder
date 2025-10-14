# Tech Stack - MtG Decks Builder

## Frontend

### Framework i biblioteki

- **Astro 5** - główny framework dla szybkich, wydajnych stron z minimalnym JavaScript
- **React 19** - komponenty interaktywne (wyszukiwanie, filtry, edytor decków)
- **TypeScript 5** - statyczne typowanie dla lepszego wsparcia IDE i bezpieczeństwa kodu
- **Vite** - bundler i narzędzie deweloperskie

### Stylowanie i UI

- **Tailwind CSS 4** - utility-first CSS framework dla szybkiego stylowania
- **Shadcn/ui** - biblioteka dostępnych komponentów React
- **Lucide React** - ikony (opcjonalnie)

### Narzędzia deweloperskie

- **ESLint** - linting kodu JavaScript/TypeScript
- **Prettier** - formatowanie kodu

### Narzędzia testowe

- **Jest/Vitest** - testy jednostkowe i integracyjne
  - Testowanie komponentów React
  - Testowanie serwisów i logiki biznesowej
  - Mockowanie zależności
- **Playwright** - testy end-to-end
  - Automatyzacja testów w różnych przeglądarkach
  - Testowanie przepływów użytkownika
  - Generowanie raportów i zrzutów ekranu
- **MSW (Mock Service Worker)** - mockowanie API
  - Interceptowanie i mockowanie żądań HTTP
  - Symulacja różnych scenariuszy API
  - Testowanie obsługi błędów

## Backend

### Baza danych i API

- **Supabase** - Backend-as-a-Service
  - PostgreSQL - baza danych

### Autentykacja

- **Supabase Auth** - wbudowany system autentykacji
  - Email/password
  - JWT tokens
  - Session management

## Hosting i CI/CD

### Hosting

- **DigitalOcean** - hosting aplikacji
  - Automatyczne wdrożenia z GitHub
  - Darmowy tier dla MVP

### CI/CD

- **GitHub Actions** - automatyzacja procesów
  - Testy automatyczne
  - Linting
  - Build i deploy
- **DigitalOcean** - automatyczne wdrożenia

## Zewnętrzne API

### Dane kart MtG

- **Scryfall API** - główne źródło danych kart Magic: The Gathering
  - Wyszukiwanie kart
  - Filtrowanie
  - Obrazy kart
  - Metadane
