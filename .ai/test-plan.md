# Plan Testów - MtG Decks Builder

## 1. Wprowadzenie i cele testowania

### 1.1 Cel dokumentu

Dokument definiuje kompleksową strategię testowania aplikacji MtG Decks Builder, określając zakres, metodologię i kryteria akceptacji testów.

### 1.2 Cele testowania

- Weryfikacja poprawności działania kluczowych funkcjonalności aplikacji
- Zapewnienie wysokiej jakości kodu i UI/UX
- Identyfikacja potencjalnych problemów wydajnościowych
- Walidacja bezpieczeństwa systemu
- Potwierdzenie zgodności z wymaganiami biznesowymi

## 2. Zakres testów

### 2.1 Komponenty podlegające testowaniu

1. System autentykacji
2. Zarządzanie taliami
3. Integracja z API Scryfall
4. Interfejs użytkownika
5. API endpoints
6. Baza danych
7. Wydajność systemu

### 2.2 Komponenty wyłączone z testowania

1. Wewnętrzna implementacja Supabase
2. Kod źródłowy API Scryfall
3. Zewnętrzne biblioteki UI (Shadcn/ui)

## 3. Typy testów

### 3.1 Testy jednostkowe

1. Serwisy:
   - ScryfallService
   - DeckService
   - CardService
   - AuthService

2. Komponenty React:
   - Formularze (LoginForm, RegisterForm)
   - Komponenty Dashboard
   - Komponenty DeckEditor
   - Komponenty współdzielone

3. Walidatory i transformatory danych:
   - Schematy Zod
   - Funkcje pomocnicze
   - Transformatory danych API

### 3.2 Testy integracyjne

1. Autentykacja:
   - Proces rejestracji
   - Proces logowania
   - Zarządzanie sesją
   - Odzyskiwanie hasła

2. Zarządzanie taliami:
   - Tworzenie talii
   - Edycja talii
   - Usuwanie talii
   - Współdzielenie talii

3. Integracja z Scryfall:
   - Wyszukiwanie kart
   - Pobieranie detali karty
   - Obsługa limitów API
   - Cache'owanie danych

### 3.3 Testy E2E

1. Przepływy użytkownika:
   - Rejestracja → Logowanie → Tworzenie talii → Dodawanie kart
   - Wyszukiwanie talii → Filtrowanie → Sortowanie
   - Edycja talii → Zapisywanie zmian → Podgląd
   - Eksport talii → Import talii

2. Scenariusze brzegowe:
   - Obsługa błędów API
   - Timeout połączenia
   - Limity rate limitingu
   - Równoczesne operacje

### 3.4 Testy wydajnościowe

1. Testy obciążeniowe:
   - Równoczesne operacje na taliach
   - Masowe wyszukiwanie kart
   - Duże zestawy danych

2. Testy responsywności:
   - Czas ładowania komponentów
   - Czas odpowiedzi API
   - Wydajność wyszukiwania

### 3.5 Testy bezpieczeństwa

1. Autentykacja:
   - Walidacja tokenów
   - Zabezpieczenie sesji
   - Limity prób logowania

2. Autoryzacja:
   - Dostęp do talii
   - Uprawnienia użytkowników
   - Walidacja danych wejściowych

## 4. Scenariusze testowe

### 4.1 Autentykacja

1. Rejestracja użytkownika:
   - Poprawne dane
   - Niepoprawny format email
   - Słabe hasło
   - Istniejący email

2. Logowanie:
   - Poprawne dane
   - Niepoprawne hasło
   - Nieistniejący użytkownik
   - Zablokowane konto

### 4.2 Zarządzanie taliami

1. Tworzenie talii:
   - Podstawowe informacje
   - Walidacja nazwy
   - Duplikaty
   - Limity formatów

2. Edycja talii:
   - Zmiana nazwy
   - Dodawanie kart
   - Usuwanie kart
   - Aktualizacja metadanych

### 4.3 Wyszukiwanie kart

1. Filtrowanie:
   - Po nazwie
   - Po kolorach
   - Po typie
   - Po koszcie many

2. Sortowanie:
   - Po nazwie
   - Po cenie
   - Po rzadkości
   - Po formacie

## 5. Środowisko testowe

### 5.1 Wymagania

1. Środowisko deweloperskie:
   - Node.js 18+
   - npm/yarn
   - TypeScript 5
   - Astro 5
   - React 19

2. Narzędzia testowe:
   - Jest
   - Vitest
   - Playwright
   - k6 (testy wydajnościowe)
   - ESLint
   - Prettier

### 5.2 Konfiguracja

1. Baza danych:
   - Testowa instancja Supabase
   - Dane testowe
   - Mockowane odpowiedzi

2. API:
   - Środowisko testowe Scryfall
   - Mockowane endpointy
   - Rate limiting

## 6. Narzędzia do testowania

### 6.1 Testy jednostkowe i integracyjne

- Jest
- Vitest
- MSW (Mock Service Worker)
- Supertest

### 6.2 Testy E2E

- Playwright

### 6.3 Testy wydajnościowe

- k6
- Lighthouse
- Chrome DevTools

### 6.4 Testy bezpieczeństwa

- OWASP ZAP
- SonarQube
- npm audit

## 7. Harmonogram testów

### 7.1 Faza przygotowawcza (2 tygodnie)

1. Tydzień 1:
   - Konfiguracja środowiska
   - Przygotowanie danych testowych
   - Implementacja mocków

2. Tydzień 2:
   - Implementacja podstawowych testów
   - Konfiguracja CI/CD
   - Dokumentacja testowa

### 7.2 Faza wykonawcza (4 tygodnie)

1. Tydzień 3-4:
   - Testy jednostkowe
   - Testy integracyjne
   - Code review

2. Tydzień 5-6:
   - Testy E2E
   - Testy wydajnościowe
   - Testy bezpieczeństwa

### 7.3 Faza raportowania (1 tydzień)

- Analiza wyników
- Dokumentacja błędów
- Rekomendacje

## 8. Kryteria akceptacji testów

### 8.1 Kryteria ilościowe

- Pokrycie kodu testami: min. 80%
- Maksymalny czas odpowiedzi API: 500ms
- Maksymalny czas ładowania strony: 2s
- Zero krytycznych błędów bezpieczeństwa

### 8.2 Kryteria jakościowe

- Zgodność z wymaganiami funkcjonalnymi
- Poprawność działania na różnych przeglądarkach
- Responsywność interfejsu
- Intuicyjność obsługi

## 9. Role i odpowiedzialności

### 9.1 Zespół testowy

- Test Manager
- QA Engineers
- Automation Engineers
- Performance Testers
- Security Testers

### 9.2 Zespół deweloperski

- Frontend Developers
- Backend Developers
- DevOps Engineers

## 10. Procedury raportowania błędów

### 10.1 Klasyfikacja błędów

1. Krytyczne:
   - Awaria systemu
   - Naruszenie bezpieczeństwa
   - Utrata danych

2. Wysokie:
   - Błędy funkcjonalne
   - Problemy z wydajnością
   - Błędy UI/UX

3. Średnie:
   - Drobne błędy funkcjonalne
   - Problemy kosmetyczne
   - Sugestie ulepszeń

### 10.2 Proces raportowania

1. Zgłoszenie błędu:
   - Tytuł i opis
   - Kroki reprodukcji
   - Oczekiwane vs. aktualne zachowanie
   - Zrzuty ekranu/logi

2. Weryfikacja:
   - Priorytetyzacja
   - Przypisanie
   - Śledzenie statusu

3. Rozwiązanie:
   - Implementacja poprawki
   - Testy regresji
   - Dokumentacja zmian
