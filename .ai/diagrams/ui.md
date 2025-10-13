# Diagram architektury UI - Moduł autentykacji

## Analiza architektury

### 1. Komponenty systemu

#### Strony Astro

- `login.astro` - Strona logowania
- `register.astro` - Strona rejestracji
- `forgot-password.astro` - Strona odzyskiwania hasła
- `Layout.astro` - Wspólny layout dla wszystkich stron

#### Komponenty React

- `LoginForm.tsx` - Interaktywny formularz logowania
- `RegisterForm.tsx` - Interaktywny formularz rejestracji
- `ForgotPasswordForm.tsx` - Interaktywny formularz odzyskiwania hasła

#### Endpointy API

- `login.ts` - Obsługa logowania
- `register.ts` - Obsługa rejestracji
- `logout.ts` - Obsługa wylogowania
- `forgot-password.ts` - Obsługa resetowania hasła

#### Middleware i walidacja

- `middleware/index.ts` - Middleware autentykacji
- `auth.schemas.ts` - Schematy walidacji formularzy

### 2. Przepływ danych

- Formularze React -> Endpointy API -> Supabase Auth
- Middleware -> Supabase Auth -> Context użytkownika
- Schematy walidacji -> Formularze i API

### 3. Funkcjonalność komponentów

- **Formularze**: zarządzanie stanem, walidacja, komunikacja z API
- **Strony Astro**: SSR, routing, layout
- **Middleware**: autentykacja, sesje, przekierowania
- **API**: obsługa żądań, walidacja, komunikacja z Supabase

## Diagram architektury

```mermaid
flowchart TD
    %% Definicje stylów
    classDef page fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef component fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef service fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef schema fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    %% Główny Layout
    Layout["Layout.astro<br>(Wspólny layout)"]:::page

    %% Strony Astro
    LoginPage["login.astro<br>(Strona logowania)"]:::page
    RegisterPage["register.astro<br>(Strona rejestracji)"]:::page
    ForgotPasswordPage["forgot-password.astro<br>(Strona odzyskiwania hasła)"]:::page

    %% Komponenty React
    LoginForm["LoginForm.tsx<br>(Formularz logowania)"]:::component
    RegisterForm["RegisterForm.tsx<br>(Formularz rejestracji)"]:::component
    ForgotPasswordForm["ForgotPasswordForm.tsx<br>(Formularz odzyskiwania hasła)"]:::component

    %% API Endpoints
    LoginAPI["login.ts<br>(Endpoint logowania)"]:::api
    RegisterAPI["register.ts<br>(Endpoint rejestracji)"]:::api
    LogoutAPI["logout.ts<br>(Endpoint wylogowania)"]:::api
    ForgotPasswordAPI["forgot-password.ts<br>(Endpoint resetowania hasła)"]:::api

    %% Middleware i Schematy
    AuthMiddleware["middleware/index.ts<br>(Middleware autentykacji)"]:::service
    ValidationSchemas["auth.schemas.ts<br>(Schematy walidacji)"]:::schema

    %% Supabase
    Supabase["Supabase Auth<br>(Zewnętrzny serwis)"]:::service

    %% Połączenia między komponentami
    Layout --> LoginPage & RegisterPage & ForgotPasswordPage

    LoginPage --> LoginForm
    RegisterPage --> RegisterForm
    ForgotPasswordPage --> ForgotPasswordForm

    LoginForm --> |"Walidacja"| ValidationSchemas
    RegisterForm --> |"Walidacja"| ValidationSchemas
    ForgotPasswordForm --> |"Walidacja"| ValidationSchemas

    LoginForm --> |"POST"| LoginAPI
    RegisterForm --> |"POST"| RegisterAPI
    ForgotPasswordForm --> |"POST"| ForgotPasswordAPI

    LoginAPI & RegisterAPI & LogoutAPI & ForgotPasswordAPI --> |"Walidacja"| ValidationSchemas
    LoginAPI & RegisterAPI & LogoutAPI & ForgotPasswordAPI --> Supabase

    AuthMiddleware --> |"Weryfikacja sesji"| Supabase
    AuthMiddleware --> |"Przekierowania"| Layout

    %% Subgrafy dla lepszej organizacji
    subgraph "Strony Astro"
        Layout
        LoginPage
        RegisterPage
        ForgotPasswordPage
    end

    subgraph "Komponenty React"
        LoginForm
        RegisterForm
        ForgotPasswordForm
    end

    subgraph "API Endpoints"
        LoginAPI
        RegisterAPI
        LogoutAPI
        ForgotPasswordAPI
    end

    subgraph "Middleware i Walidacja"
        AuthMiddleware
        ValidationSchemas
    end
```

## Legenda

1. **Kolory i style**
   - Niebieski (:::page) - Strony Astro
   - Fioletowy (:::component) - Komponenty React
   - Pomarańczowy (:::api) - Endpointy API
   - Zielony (:::service) - Serwisy i middleware
   - Różowy (:::schema) - Schematy walidacji

2. **Typy połączeń**
   - Strzałki ciągłe (-->) - Bezpośrednie zależności
   - Strzałki z etykietami (--|"tekst"|->) - Opisane interakcje

3. **Grupowanie**
   - Subgrafy grupują powiązane komponenty według ich typu i funkcji

## Opis architektury

1. **Warstwa prezentacji**
   - Layout.astro zapewnia spójny wygląd wszystkich stron
   - Strony Astro renderują się po stronie serwera (SSR)
   - Komponenty React zapewniają interaktywność po stronie klienta

2. **Warstwa logiki**
   - Formularze React zarządzają stanem i walidacją
   - API obsługuje żądania i komunikację z Supabase
   - Middleware kontroluje dostęp i sesje użytkowników

3. **Warstwa danych**
   - Supabase Auth zarządza autentykacją i sesjami
   - Schematy walidacji zapewniają spójność danych

4. **Przepływ danych**
   - Od formularzy przez API do Supabase
   - Od middleware przez Supabase do kontekstu aplikacji
   - Dwukierunkowa walidacja (client i server)
