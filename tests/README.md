# Testy - MtG Decks Builder

Ten katalog zawiera wszystkie testy dla aplikacji MtG Decks Builder.

## Struktura katalogów

```
tests/
├── e2e/                    # Testy end-to-end (Playwright)
│   ├── pages/              # Page Object Model
│   ├── fixtures/           # Dane testowe
│   └── *.spec.ts          # Pliki testów e2e
└── unit/                   # Testy jednostkowe (Vitest)
    └── *.test.ts          # Pliki testów jednostkowych
```

## Testy jednostkowe (Vitest)

### Uruchamianie testów

```bash
# Uruchom wszystkie testy jednostkowe
npm run test

# Uruchom testy w trybie watch
npm run test:watch

# Uruchom testy z pokryciem kodu
npm run test:coverage

# Uruchom testy w trybie UI
npm run test:ui

# Uruchom testy jednorazowo
npm run test:run
```

### Konfiguracja

- **Plik konfiguracyjny**: `vitest.config.ts`
- **Setup**: `src/test/setup.ts`
- **Mocki**: `src/test/mocks/`
- **Narzędzia**: `src/test/utils/`

### Przykłady testów

- **Komponenty**: `src/components/ui/__tests__/button.test.tsx`
- **Serwisy**: `src/lib/services/__tests__/card.service.test.ts`

## Testy end-to-end (Playwright)

### Uruchamianie testów

```bash
# Uruchom wszystkie testy e2e
npm run test:e2e

# Uruchom testy w trybie UI
npm run test:e2e:ui

# Uruchom testy z widoczną przeglądarką
npm run test:e2e:headed

# Uruchom testy w trybie debug
npm run test:e2e:debug
```

### Konfiguracja

- **Plik konfiguracyjny**: `playwright.config.ts`
- **Przeglądarka**: Chromium (Desktop Chrome)
- **Base URL**: `http://localhost:3000`

### Page Object Model

Testy e2e używają wzorca Page Object Model dla lepszej organizacji:

- **LoginPage**: `tests/e2e/pages/LoginPage.ts`
- **DashboardPage**: `tests/e2e/pages/DashboardPage.ts`
- **DeckEditorPage**: `tests/e2e/pages/DeckEditorPage.ts`

### Dane testowe

Wszystkie dane testowe znajdują się w `tests/e2e/fixtures/test-data.ts`:

- Użytkownicy testowi
- Decki testowe
- Karty testowe
- Odpowiedzi API

## Mock Service Worker (MSW)

MSW jest używany do mockowania API w testach:

- **Handlers**: `src/test/mocks/handlers.ts`
- **Server**: `src/test/mocks/server.ts`

### Obsługiwane API

- **Scryfall API**: Wyszukiwanie i pobieranie kart
- **Supabase API**: Operacje CRUD na deckach i kartach
- **Auth API**: Autentykacja użytkowników

## Najlepsze praktyki

### Testy jednostkowe

1. **Używaj `vi` object** dla mocków i spy'ów
2. **Grupuj testy** z `describe` blocks
3. **Używaj inline snapshots** dla czytelnych asercji
4. **Testuj edge cases** i obsługę błędów
5. **Mockuj zależności** zewnętrzne

### Testy e2e

1. **Używaj Page Object Model** dla lepszej organizacji
2. **Używaj locators** zamiast selektorów CSS
3. **Testuj przepływy użytkownika** end-to-end
4. **Używaj fixtures** dla danych testowych
5. **Mockuj API** z MSW

### Ogólne

1. **Nazywaj testy opisowo** - co testują
2. **Używaj Arrange-Act-Assert** pattern
3. **Testuj happy path i edge cases**
4. **Utrzymuj testy niezależne** od siebie
5. **Używaj TypeScript** dla lepszego wsparcia IDE

## Debugowanie

### Testy jednostkowe

```bash
# Uruchom konkretny test
npm run test -- button.test.tsx

# Uruchom testy z debugowaniem
npm run test -- --reporter=verbose
```

### Testy e2e

```bash
# Uruchom konkretny test
npm run test:e2e -- auth.spec.ts

# Uruchom testy w trybie debug
npm run test:e2e:debug

# Uruchom testy z trace
npm run test:e2e -- --trace on
```

## CI/CD

Testy są automatycznie uruchamiane w GitHub Actions:

- **Testy jednostkowe**: Przy każdym push
- **Testy e2e**: Przy merge do main
- **Coverage**: Raporty pokrycia kodu
- **Linting**: ESLint i Prettier

## Troubleshooting

### Częste problemy

1. **Testy e2e nie znajdują elementów**: Sprawdź czy aplikacja jest uruchomiona na `localhost:3000`
2. **Mocki nie działają**: Sprawdź czy MSW jest poprawnie skonfigurowany
3. **Testy są niestabilne**: Używaj `waitFor` i proper assertions
4. **Błędy TypeScript**: Sprawdź czy wszystkie typy są poprawnie zaimportowane

### Debugowanie

1. **Użyj `--debug` flag** dla testów e2e
2. **Sprawdź trace files** w Playwright
3. **Użyj `console.log`** w testach jednostkowych
4. **Sprawdź network requests** w testach e2e
