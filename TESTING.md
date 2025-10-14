# 🧪 Testowanie - MtG Decks Builder

Ten dokument zawiera instrukcje dotyczące uruchamiania i zarządzania testami w projekcie MtG Decks Builder.

## 🚀 Szybki start

```bash
# Uruchom wszystkie testy
npm run test:all

# Uruchom tylko testy jednostkowe
npm run test

# Uruchom tylko testy e2e
npm run test:e2e
```

## 📋 Dostępne komendy

### Testy jednostkowe (Vitest)

```bash
# Uruchom testy w trybie watch (automatyczne uruchamianie przy zmianach)
npm run test:watch

# Uruchom testy jednorazowo
npm run test:run

# Uruchom testy z pokryciem kodu
npm run test:coverage

# Uruchom testy w trybie UI (interfejs graficzny)
npm run test:ui

# Uruchom konkretny test
npm run test -- button.test.tsx
```

### Testy end-to-end (Playwright)

```bash
# Uruchom wszystkie testy e2e
npm run test:e2e

# Uruchom testy w trybie UI
npm run test:e2e:ui

# Uruchom testy z widoczną przeglądarką
npm run test:e2e:headed

# Uruchom testy w trybie debug
npm run test:e2e:debug

# Uruchom konkretny test
npm run test:e2e -- auth.spec.ts
```

## 🏗️ Struktura testów

```
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── __tests__/          # Testy komponentów UI
│   ├── lib/
│   │   └── services/
│   │       └── __tests__/          # Testy serwisów
│   └── test/
│       ├── setup.ts                # Konfiguracja testów
│       ├── mocks/                  # Mocki API
│       └── utils/                  # Narzędzia testowe
└── tests/
    ├── e2e/                        # Testy end-to-end
    │   ├── pages/                  # Page Object Model
    │   ├── fixtures/               # Dane testowe
    │   └── *.spec.ts              # Pliki testów e2e
    └── unit/                       # Testy jednostkowe
        └── *.test.ts              # Pliki testów jednostkowych
```

## 🛠️ Konfiguracja

### Vitest (testy jednostkowe)

- **Plik konfiguracyjny**: `vitest.config.ts`
- **Environment**: `jsdom` (symulacja DOM)
- **Setup**: `src/test/setup.ts`
- **Mocki**: MSW (Mock Service Worker)

### Playwright (testy e2e)

- **Plik konfiguracyjny**: `playwright.config.ts`
- **Przeglądarka**: Chromium (Desktop Chrome)
- **Base URL**: `http://localhost:3000`
- **Automatyczne uruchamianie serwera**: Tak

## 📊 Pokrycie kodu

```bash
# Wygeneruj raport pokrycia
npm run test:coverage

# Otwórz raport w przeglądarce
open coverage/index.html
```

### Progi pokrycia

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 🎭 Mockowanie

### MSW (Mock Service Worker)

MSW jest używany do mockowania API w testach:

```typescript
// src/test/mocks/handlers.ts
export const handlers = [
  http.get("https://api.scryfall.com/cards/search", () => {
    return HttpResponse.json(mockCards);
  }),
  // ... więcej handlerów
];
```

### Mocki komponentów

```typescript
// Przykład mockowania komponentu
vi.mock('@/components/SomeComponent', () => ({
  default: () => <div data-testid="mocked-component">Mocked</div>
}))
```

## 🧩 Page Object Model

Testy e2e używają wzorca Page Object Model:

```typescript
// tests/e2e/pages/LoginPage.ts
export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.loginButton = page.getByRole("button", { name: /log in/i });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

## 🔧 Debugowanie

### Testy jednostkowe

```bash
# Uruchom testy z debugowaniem
npm run test -- --reporter=verbose

# Uruchom konkretny test z debugowaniem
npm run test -- --reporter=verbose button.test.tsx
```

### Testy e2e

```bash
# Uruchom testy w trybie debug
npm run test:e2e:debug

# Uruchom testy z trace
npm run test:e2e -- --trace on

# Uruchom testy z zrzutami ekranu
npm run test:e2e -- --screenshot on
```

## 📝 Pisanie testów

### Testy jednostkowe

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
})
```

### Testy e2e

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test("should login with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("test@example.com", "password123");

  await expect(page).toHaveURL("/");
});
```

## 🚨 Troubleshooting

### Częste problemy

1. **Testy e2e nie znajdują elementów**
   - Sprawdź czy aplikacja jest uruchomiona na `localhost:3000`
   - Upewnij się, że elementy mają odpowiednie atrybuty `data-testid`

2. **Mocki nie działają**
   - Sprawdź czy MSW jest poprawnie skonfigurowany
   - Upewnij się, że handlery są poprawnie zarejestrowane

3. **Testy są niestabilne**
   - Używaj `waitFor` dla asynchronicznych operacji
   - Sprawdź czy nie ma race conditions

4. **Błędy TypeScript**
   - Sprawdź czy wszystkie typy są poprawnie zaimportowane
   - Upewnij się, że mocki zachowują oryginalne typy

### Debugowanie

```bash
# Sprawdź logi testów
npm run test -- --reporter=verbose

# Sprawdź network requests w testach e2e
npm run test:e2e -- --trace on

# Sprawdź zrzuty ekranu
npm run test:e2e -- --screenshot on
```

## 🔄 CI/CD

Testy są automatycznie uruchamiane w GitHub Actions:

- **Push do main/develop**: Wszystkie testy
- **Pull Request**: Testy jednostkowe + e2e
- **Coverage**: Automatyczne raporty pokrycia
- **Artifacts**: Raporty Playwright

## 📚 Przydatne linki

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🤝 Współpraca

Przy dodawaniu nowych testów:

1. **Testy jednostkowe**: Dodaj do odpowiedniego katalogu `__tests__`
2. **Testy e2e**: Dodaj do `tests/e2e/`
3. **Page Objects**: Dodaj do `tests/e2e/pages/`
4. **Dane testowe**: Dodaj do `tests/e2e/fixtures/`
5. **Mocki**: Dodaj do `src/test/mocks/`

Pamiętaj o:

- Opisowych nazwach testów
- Testowaniu happy path i edge cases
- Używaniu Page Object Model w testach e2e
- Mockowaniu zewnętrznych zależności
- Utrzymywaniu testów niezależnych od siebie
