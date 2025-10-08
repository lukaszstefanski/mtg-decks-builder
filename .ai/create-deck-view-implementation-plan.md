# Plan implementacji widoku CreateDeck

## 1. Przegląd

Widok CreateDeck umożliwia zalogowanym użytkownikom tworzenie nowych decków kart Magic: The Gathering. Użytkownik może wprowadzić nazwę decka, opcjonalny opis oraz wybrać format z listy dostępnych formatów. Po utworzeniu decka użytkownik jest przekierowywany do edytora decka.

## 2. Routing widoku

- **Ścieżka**: `/decks/create`
- **Komponent**: `CreateDeckPage.astro`
- **Layout**: `Layout.astro`

## 3. Struktura komponentów

```
CreateDeckPage
├── CreateDeckForm (React)
│   ├── DeckNameInput
│   ├── DeckDescriptionInput
│   ├── FormatSelector
│   ├── SubmitButton
│   └── ErrorDisplay
```

## 4. Szczegóły komponentów

### CreateDeckForm

- **Opis**: Główny komponent formularza do tworzenia decka
- **Główne elementy**:
  - Form element z onSubmit handler
  - Grid layout dla pól formularza
  - Loading overlay podczas submit
- **Obsługiwane interakcje**:
  - Submit formularza
  - Reset formularza
  - Walidacja w czasie rzeczywistym
- **Obsługiwana walidacja**:
  - Nazwa decka (wymagana, max 100 znaków)
  - Format decka (wymagany, z listy dostępnych)
  - Opis decka (opcjonalny, max 500 znaków)
- **Typy**: CreateDeckFormData, FormValidationState, SubmissionState
- **Propsy**: Brak (komponent główny)

### DeckNameInput

- **Opis**: Pole tekstowe do wprowadzania nazwy decka
- **Główne elementy**:
  - Input element z type="text"
  - Label z opisem pola
  - Error message container
- **Obsługiwane interakcje**:
  - onChange dla walidacji real-time
  - onBlur dla walidacji po opuszczeniu pola
- **Obsługiwana walidacja**:
  - Pole wymagane
  - Maksymalnie 100 znaków
  - Nie może być puste
- **Typy**: string, ValidationError
- **Propsy**:
  - value: string
  - onChange: (value: string) => void
  - error?: string
  - disabled?: boolean

### DeckDescriptionInput

- **Opis**: Pole tekstowe do wprowadzania opisu decka (opcjonalne)
- **Główne elementy**:
  - Textarea element
  - Label z opisem pola
  - Character counter
- **Obsługiwane interakcje**:
  - onChange dla aktualizacji stanu
  - onBlur dla walidacji
- **Obsługiwana walidacja**:
  - Maksymalnie 500 znaków
  - Opcjonalne pole
- **Typy**: string, ValidationError
- **Propsy**:
  - value: string
  - onChange: (value: string) => void
  - error?: string
  - disabled?: boolean

### FormatSelector

- **Opis**: Dropdown do wyboru formatu decka
- **Główne elementy**:
  - Select element z opcjami
  - Label z opisem pola
  - Error message container
- **Obsługiwane interakcje**:
  - onChange dla wyboru formatu
  - onBlur dla walidacji
- **Obsługiwana walidacja**:
  - Pole wymagane
  - Musi być z listy dostępnych formatów
- **Typy**: string, FormatOption[], ValidationError
- **Propsy**:
  - value: string
  - onChange: (value: string) => void
  - options: FormatOption[]
  - error?: string
  - disabled?: boolean

### SubmitButton

- **Opis**: Przycisk do zapisywania decka
- **Główne elementy**:
  - Button element z loading state
  - Spinner podczas submit
  - Disabled state podczas walidacji
- **Obsługiwane interakcje**:
  - onClick dla submit formularza
  - Disabled state gdy formularz nieprawidłowy
- **Obsługiwana walidacja**:
  - Sprawdza czy formularz jest prawidłowy
  - Blokuje submit podczas loading
- **Typy**: boolean, boolean
- **Propsy**:
  - isSubmitting: boolean
  - isDisabled: boolean
  - onClick: () => void

### ErrorDisplay

- **Opis**: Komponent do wyświetlania błędów
- **Główne elementy**:
  - Alert component z błędami
  - Lista błędów walidacji
  - Błędy API
- **Obsługiwane interakcje**:
  - Wyświetlanie błędów walidacji
  - Wyświetlanie błędów API
  - Auto-hide po czasie
- **Obsługiwana walidacja**:
  - Wyświetla błędy walidacji pól
  - Wyświetla błędy API
- **Typy**: ValidationError[], ApiError
- **Propsy**:
  - validationErrors: ValidationError[]
  - apiError?: ApiError
  - onDismiss: () => void

## 5. Typy

### CreateDeckFormData

```typescript
interface CreateDeckFormData {
  name: string;
  description?: string;
  format: string;
}
```

### FormatOption

```typescript
interface FormatOption {
  value: string;
  label: string;
}
```

### FormValidationState

```typescript
interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}
```

### SubmissionState

```typescript
interface SubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error?: string;
}
```

### ValidationError

```typescript
interface ValidationError {
  field: string;
  message: string;
}
```

### ApiError

```typescript
interface ApiError {
  code: string;
  message: string;
  status: number;
}
```

## 6. Zarządzanie stanem

Widok wykorzystuje custom hook `useCreateDeckForm` do zarządzania stanem formularza:

- **Stan formularza**: wartości pól (name, description, format)
- **Stan walidacji**: błędy walidacji dla każdego pola
- **Stan submit**: loading, success, error states
- **Funkcje**: updateField, validateField, submitForm, resetForm

## 7. Integracja API

- **Endpoint**: POST /api/decks
- **Typ żądania**: CreateDeckRequest (name, description, format)
- **Typ odpowiedzi**: DeckResponse (id, name, description, format, deck_size, created_at, last_modified)
- **Obsługa błędów**: 400 (walidacja), 401 (autoryzacja), 500 (serwer)
- **Przekierowanie**: Po sukcesie do `/decks/{deckId}/edit`

## 8. Interakcje użytkownika

1. **Wprowadzanie nazwy**: Real-time walidacja, max 100 znaków
2. **Wybór formatu**: Z dropdown listy dostępnych formatów
3. **Wprowadzanie opisu**: Opcjonalne, max 500 znaków
4. **Submit formularza**: Walidacja wszystkich pól, wywołanie API
5. **Obsługa błędów**: Wyświetlanie błędów walidacji i API
6. **Przekierowanie**: Po sukcesie do edytora decka

## 9. Warunki i walidacja

- **Nazwa decka**: Wymagana, nie może być pusta, max 100 znaków
- **Format decka**: Wymagany, musi być z listy dostępnych formatów
- **Opis decka**: Opcjonalny, max 500 znaków
- **Walidacja real-time**: Podczas wprowadzania danych
- **Walidacja submit**: Sprawdzenie wszystkich pól przed wysłaniem
- **Walidacja API**: Sprawdzenie odpowiedzi serwera

## 10. Obsługa błędów

- **Błędy walidacji**: Wyświetlanie pod każdym polem
- **Błędy API**: Wyświetlanie w ErrorDisplay
- **Błędy sieci**: Komunikat o problemie z połączeniem
- **Błędy autoryzacji**: Przekierowanie do logowania
- **Błędy serwera**: Komunikat o problemie z serwerem
- **Retry mechanism**: Możliwość ponownej próby

## 11. Kroki implementacji

1. **Utworzenie struktury plików**: CreateDeckPage.astro, CreateDeckForm.tsx
2. **Implementacja typów**: CreateDeckFormData, ValidationError, ApiError
3. **Implementacja custom hook**: useCreateDeckForm
4. **Implementacja komponentów**: DeckNameInput, DeckDescriptionInput, FormatSelector
5. **Implementacja głównego formularza**: CreateDeckForm z walidacją
6. **Implementacja obsługi błędów**: ErrorDisplay, retry mechanism
7. **Implementacja integracji API**: POST /api/decks
8. **Implementacja przekierowania**: Po sukcesie do edytora
9. **Implementacja responsywności**: Mobile-first design
10. **Testowanie**: Walidacja, błędy, responsywność
11. **Optymalizacja**: Performance, accessibility
12. **Dokumentacja**: README, komentarze w kodzie
