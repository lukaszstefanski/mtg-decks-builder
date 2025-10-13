### Specyfikacja Architektury Modułu Autentykacji Użytkowników

#### 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

**1.1 Opis zmian w warstwie frontendu**

Wprowadzimy nowe strony i komponenty, a także rozszerzymy istniejące, aby obsłużyć scenariusze autentykacji i nieautentykacji.

- **Nowe strony Astro:**
  - `src/pages/register.astro`: Strona zawierająca formularz rejestracji użytkownika. Będzie odpowiedzialna za renderowanie początkowego widoku i integrację z komponentem React `RegisterForm`.
  - `src/pages/login.astro`: Strona zawierająca formularz logowania. Podobnie jak rejestracja, będzie hostować komponent React `LoginForm`.
  - `src/pages/forgot-password.astro`: Strona do inicjowania procesu odzyskiwania hasła, zawierająca komponent React `ForgotPasswordForm`.
- **Nowe komponenty React (client-side):** Będą one umieszczone w nowym katalogu `src/components/Auth/`.
  - `src/components/Auth/RegisterForm.tsx`: Komponent React zawierający formularz do rejestracji (email, hasło). Będzie zarządzał stanem formularza, walidacją client-side (za pomocą Zod) i wysyłką danych do API.
  - `src/components/Auth/LoginForm.tsx`: Komponent React zawierający formularz do logowania (email, hasło, opcja "Zapamiętaj mnie"). Podobnie jak `RegisterForm`, będzie obsługiwał stan, walidację i komunikację z API.
  - `src/components/Auth/ForgotPasswordForm.tsx`: Komponent React do wysyłania żądania resetu hasła (tylko email).
- **Rozszerzenia istniejących layoutów i komponentów:**
  - `src/layouts/Layout.astro`: Ten główny layout zostanie rozszerzony o logikę warunkowego renderowania elementów nawigacyjnych (np. "Zaloguj się", "Zarejestruj się", "Wyloguj") w zależności od statusu autentykacji użytkownika. Dostęp do statusu autentykacji będzie możliwy poprzez `Astro.locals.user` (ustawiany w middleware).
  - **Nawigacja (np. w nagłówku):** Elementy nawigacyjne będą dynamicznie wyświetlane. Jeśli użytkownik jest zalogowany, zobaczy opcję "Wyloguj się" i linki do swoich decków. Jeśli nie jest zalogowany, zobaczy opcje "Zaloguj się" i "Zarejestruj się".

**1.2 Rozdzielenie odpowiedzialności (Astro vs React)**

- **Strony Astro (`.astro`):**
  - Odpowiedzialne za renderowanie początkowego HTML na serwerze (SSR).
  - Importują i hostują client-side komponenty React.
  - Zarządzają metadanymi stron (tytuły, opisy).
  - Obsługują przekierowania po pomyślnych akcjach (np. po zalogowaniu na stronę główną).
  - Mogą pobierać początkowe dane użytkownika (jeśli jest zalogowany) i przekazywać je do komponentów React jako propsy.
- **Komponenty React (`.tsx`):**
  - Odpowiedzialne za interaktywność po stronie klienta.
  - Zarządzają stanem formularzy.
  - Wykonują walidację danych wejściowych w czasie rzeczywistym (client-side validation).
  - Komunikują się z endpointami API Astro (`fetch`) w celu wysłania danych autentykacji.
  - Obsługują wyświetlanie komunikatów o błędach i sukcesie.
  - Zarządzają lokalnym stanem użytkownika po pomyślnej autentykacji (np. aktualizując kontekst globalny, jeśli taki będzie).

**1.3 Walidacja i komunikaty błędów**

- **Walidacja client-side (React):**
  - Wykorzystamy bibliotekę **Zod** do definiowania schematów walidacji dla formularzy rejestracji, logowania i odzyskiwania hasła.
  - Integracja Zod z **React Hook Form** umożliwi łatwe zarządzanie walidacją i wyświetlanie komunikatów błędów obok pól formularza (np. "Email jest niepoprawny", "Hasło musi mieć co najmniej 8 znaków").
  - Wczesna walidacja zapobiegnie wysyłaniu nieprawidłowych danych do backendu.
- **Walidacja server-side (Astro API):**
  - Każdy endpoint API będzie również wykonywał walidację danych wejściowych, ponownie za pomocą Zod, aby zapewnić integralność danych i odporność na złośliwe żądania.
  - W przypadku niepowodzenia walidacji, API zwróci błąd HTTP 400 (Bad Request) z odpowiednim komunikatem JSON.
- **Komunikaty błędów:**
  - **User-friendly:** Komunikaty będą zrozumiałe dla użytkownika (np. "Nieprawidłowy email lub hasło", "Użytkownik z tym adresem email już istnieje").
  - **Wizualizacja:** Komponenty React będą wyświetlać komunikaty błędów w widoczny sposób, np. pod formularzem lub jako tymczasowe powiadomienia (toasts) z biblioteki Shadcn/ui.
  - **Lokalizacja:** Komunikaty będą w języku polskim, zgodnie z wymaganiami PRD.

**1.4 Obsługa najważniejszych scenariuszy**

- **Pomyślna rejestracja (US-001):**
  1.  Użytkownik wypełnia formularz rejestracji i wysyła.
  2.  Client-side walidacja (React/Zod) przechodzi pomyślnie.
  3.  Żądanie POST jest wysyłane do `/api/auth/register`.
  4.  Backend waliduje dane, tworzy konto w Supabase i loguje użytkownika.
  5.  Backend zwraca sukces.
  6.  Frontend wyświetla komunikat o sukcesie i przekierowuje użytkownika na stronę główną.
- **Błędna rejestracja (email już istnieje):**
  1.  Użytkownik próbuje zarejestrować się z istniejącym adresem email.
  2.  Backend Supabase odrzuca operację.
  3.  API zwraca błąd z komunikatem.
  4.  Frontend wyświetla komunikat "Użytkownik z tym adresem email już istnieje".
- **Pomyślne logowanie (US-002):**
  1.  Użytkownik wypełnia formularz logowania i wysyła.
  2.  Client-side walidacja przechodzi pomyślnie.
  3.  Żądanie POST jest wysyłane do `/api/auth/login`.
  4.  Backend waliduje dane logowania w Supabase i tworzy sesję.
  5.  Backend zwraca sukces (tokeny JWT są ustawiane w ciasteczkach przez Supabase).
  6.  Frontend wyświetla komunikat o sukcesie i przekierowuje użytkownika na stronę główną lub do jego decków.
- **Błędne logowanie (nieprawidłowe dane):**
  1.  Użytkownik podaje nieprawidłowy email lub hasło.
  2.  Backend Supabase odrzuca logowanie.
  3.  API zwraca błąd z komunikatem.
  4.  Frontend wyświetla komunikat "Nieprawidłowy email lub hasło".
- **Wylogowanie (US-003):**
  1.  Użytkownik klika przycisk "Wyloguj się".
  2.  Żądanie POST jest wysyłane do `/api/auth/logout`.
  3.  Backend Supabase unieważnia sesję (usuwa tokeny z ciasteczek).
  4.  Backend zwraca sukces.
  5.  Frontend przekierowuje użytkownika na stronę logowania i wyświetla komunikat o pomyślnym wylogowaniu.
- **Odzyskiwanie hasła:**
  1.  Użytkownik podaje email na stronie odzyskiwania hasła.
  2.  Żądanie POST do `/api/auth/forgot-password`.
  3.  Supabase wysyła link do resetowania hasła na podany email.
  4.  Frontend informuje użytkownika o wysłanym emailu.

#### 2. LOGIKA BACKENDOWA

**2.1 Struktura endpointów API i modeli danych**

Endpointy API będą implementowane jako Astro API routes (pliki `.ts` w `src/pages/api`).

- **`src/pages/api/auth/register.ts` (POST):**
  - **Wejście:** `{ email: string, password: string }`
  - **Wyjście (Sukces):** `{ message: string }` (np. "Rejestracja udana!")
  - **Wyjście (Błąd):** `{ error: string }`
  - **Cel:** Rejestruje nowego użytkownika w Supabase Auth.
- **`src/pages/api/auth/login.ts` (POST):**
  - **Wejście:** `{ email: string, password: string }`
  - **Wyjście (Sukces):** `{ message: string }` (np. "Zalogowano pomyślnie!")
  - **Wyjście (Błąd):** `{ error: string }`
  - **Cel:** Loguje istniejącego użytkownika za pomocą Supabase Auth.
- **`src/pages/api/auth/logout.ts` (POST):**
  - **Wejście:** Brak
  - **Wyjście (Sukces):** `{ message: string }` (np. "Wylogowano pomyślnie!")
  - **Wyjście (Błąd):** `{ error: string }`
  - **Cel:** Wylogowuje aktualnie zalogowanego użytkownika z Supabase Auth.
- **`src/pages/api/auth/forgot-password.ts` (POST):**
  - **Wejście:** `{ email: string }`
  - **Wyjście (Sukces):** `{ message: string }` (np. "Link do resetu hasła wysłany na email.")
  - **Wyjście (Błąd):** `{ error: string }`
  - **Cel:** Inicjuje proces resetowania hasła w Supabase Auth.

**Modele danych:**
Dla potrzeb autentykacji, główne dane użytkownika (email, hasło, status sesji) są zarządzane przez Supabase Auth. Nie będą potrzebne żadne nowe, złożone modele danych po stronie aplikacji dla tej funkcjonalności. Wszelkie interakcje będą dotyczyć bezpośrednio Supabase.

**2.2 Mechanizm walidacji danych wejściowych**

- **Schematy Zod:** Zostaną zdefiniowane schematy Zod w `src/lib/schemas/auth.schemas.ts` (nowy plik) dla danych wejściowych każdego endpointu autentykacji (np. `registerSchema`, `loginSchema`, `forgotPasswordSchema`).
- **Middleware/Guard clauses:** W każdym endpointcie API, przed próbą interakcji z Supabase, dane z `Astro.request` (body) będą parsowane i walidowane za pomocą odpowiedniego schematu Zod.
- **Przykład walidacji:**

  ```typescript
  // src/lib/schemas/auth.schemas.ts
  import { z } from "zod";

  export const registerSchema = z.object({
    email: z.string().email("Niepoprawny format emaila."),
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków."),
  });

  // src/pages/api/auth/register.ts
  import { registerSchema } from "../../../lib/schemas/auth.schemas";
  import { supabase } from "../../../db/supabase.server"; // Serwerowy klient Supabase
  import { errorHandler } from "../../../lib/utils/error-handler";

  export const POST = async ({ request, redirect }) => {
    try {
      const body = await request.json();
      const { email, password } = registerSchema.parse(body); // Walidacja

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        // Obsługa błędów Supabase
        return new Response(JSON.stringify({ error: errorHandler(error) }), { status: 400 });
      }

      // Pomyślna rejestracja i automatyczne zalogowanie
      return new Response(JSON.stringify({ message: "Rejestracja udana!" }), { status: 200 });
    } catch (error) {
      // Obsługa błędów walidacji Zod i innych
      return new Response(JSON.stringify({ error: errorHandler(error) }), { status: 400 });
    }
  };
  ```

**2.3 Obsługa wyjątków**

- **Centralny `error-handler.ts`:** Istniejący `src/lib/utils/error-handler.ts` zostanie rozszerzony o obsługę błędów specyficznych dla Supabase Auth i walidacji Zod.
  - Będzie on mapował techniczne błędy na user-friendly komunikaty.
  - Zapewni spójne formatowanie błędów zwracanych do klienta.
- **Wczesne wyjścia (early returns):** W przypadku błędów walidacji lub błędów Supabase Auth, endpointy API będą natychmiast zwracać odpowiedź z kodem błędu HTTP (np. 400, 401, 500) i zlokalizowanym komunikatem.

**2.4 Aktualizacja sposobu renderowania stron server-side**

- **Middleware Astro (`src/middleware/index.ts`):**
  - Będzie to kluczowy element do określania statusu autentykacji na każdej stronie Astro.
  - Middleware będzie wywoływany dla każdego żądania (oprócz statycznych zasobów).
  - Będzie próbował odczytać token sesji użytkownika z ciasteczek (zarządzanych przez Supabase).
  - Jeśli token jest ważny, pobierze dane użytkownika z Supabase i udostępni je w `Astro.locals.user`.
  - Przykład rozszerzenia `src/middleware/index.ts`:

    ```typescript
    // src/middleware/index.ts
    import { defineMiddleware, sequence } from "astro:middleware";
    import { supabase } from "../db/supabase.server"; // Serwerowy klient Supabase

    const authMiddleware = defineMiddleware(async (context, next) => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        context.locals.user = session.user; // Ustawia obiekt użytkownika
      } else {
        context.locals.user = null;
      }

      // Specjalne przekierowania dla stron autentykacyjnych
      if (context.url.pathname === "/login" || context.url.pathname === "/register") {
        if (context.locals.user) {
          return context.redirect("/dashboard"); // Zalogowany użytkownik nie powinien widzieć stron logowania/rejestracji
        }
      } else if (!context.locals.user && context.url.pathname.startsWith("/decks")) {
        // Przykład: chronienie stron wymagających autentykacji
        return context.redirect("/login");
      }

      return next();
    });

    export const onRequest = sequence(authMiddleware);
    ```

- **Warunkowe renderowanie w Astro:** Strony Astro będą mogły używać `Astro.locals.user` do:
  - Renderowania różnych treści dla zalogowanych/niezalogowanych użytkowników.
  - Przekierowywania użytkowników, którzy próbują uzyskać dostęp do chronionych zasobów (np. `decks/[deckId]/edit.astro`).
  - Przekazywania statusu autentykacji do komponentów React.

#### 3. SYSTEM AUTENTYKACJI

**3.1 Wykorzystanie Supabase Auth z Astro**

- **Klient Supabase (server-side):**
  - Zostanie utworzony nowy klient Supabase specyficzny dla środowiska serwerowego Astro, prawdopodobnie w `src/db/supabase.server.ts` lub rozszerzymy `supabase.client.ts` o logikę serwerową (bardziej prawdopodobne, że `supabase.client.ts` zostanie zrefaktoryzowany na `supabase.ts` i będzie eksportował zarówno klienta client-side jak i server-side).
  - Ten klient będzie używany w middleware Astro i w endpointach API.
  - Supabase automatycznie obsługuje ustawianie i usuwanie ciasteczek zawierających tokeny JWT, co upraszcza zarządzanie sesjami.
- **Rejestracja (`supabase.auth.signUp()`):**
  - Endpoint `/api/auth/register` będzie wywoływał `supabase.auth.signUp({ email, password })`.
  - Supabase automatycznie tworzy nowego użytkownika, opcjonalnie wysyła email weryfikacyjny (możemy to skonfigurować).
  - Jeśli pomyślne, użytkownik jest automatycznie zalogowany, a jego tokeny są umieszczane w ciasteczkach.
- **Logowanie (`supabase.auth.signInWithPassword()`):**
  - Endpoint `/api/auth/login` będzie wywoływał `supabase.auth.signInWithPassword({ email, password })`.
  - Supabase weryfikuje dane i tworzy sesję, ustawiając ciasteczka.
- **Wylogowywanie (`supabase.auth.signOut()`):**
  - Endpoint `/api/auth/logout` będzie wywoływał `supabase.auth.signOut()`.
  - Supabase unieważnia bieżącą sesję i usuwa odpowiednie ciasteczka.
- **Odzyskiwanie hasła (`supabase.auth.resetPasswordForEmail()`):**
  - Endpoint `/api/auth/forgot-password` będzie wywoływał `supabase.auth.resetPasswordForEmail(email)`.
  - Supabase wysyła email z linkiem do resetowania hasła na podany adres. Użytkownik zostanie przekierowany na dedykowaną stronę w Supabase lub na naszą, jeśli skonfigurujemy odpowiednie przekierowanie w ustawieniach Supabase.

**Kluczowe kontrakty:**

- **`src/types.ts`:** Zostanie rozszerzony o typ dla obiektu `User` (np. `SupabaseUser` lub `AuthUser`), który będzie przechowywany w `Astro.locals.user`.

  ```typescript
  // src/types.ts (przykładowo)
  import type { User } from "@supabase/supabase-js";

  declare global {
    namespace App {
      interface Locals {
        user: User | null;
      }
    }
  }
  export type AuthUser = User;
  ```

- **`src/db/supabase.ts` (lub podobny):** Będzie eksportował skonfigurowanych klientów Supabase dla serwera i klienta.

Ta architektura zapewni solidne, bezpieczne i zgodne z wymaganiami PRD wdrożenie modułu autentykacji, wykorzystując Astro dla SSR i routingu, React dla interaktywnych formularzy oraz Supabase jako niezawodny backend autentykacji.
