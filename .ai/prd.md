# Dokument wymagań produktu (PRD) - MtG Decks Builder

## 1. Przegląd produktu

### 1.1 Opis produktu

MtG Decks Builder to aplikacja webowa umożliwiająca graczom Magic: The Gathering tworzenie, zarządzanie i analizowanie własnych decków karcianych. Aplikacja oferuje intuicyjny interfejs do wyszukiwania kart, budowania decków zgodnie z zasadami gry oraz analizy statystyk decków.

### 1.2 Cel produktu

Głównym celem jest dostarczenie graczom MtG narzędzia do:

- Tworzenia i zarządzania własnymi deckami
- Wyszukiwania kart z zaawansowanymi filtrami
- Analizy statystyk decków (rozkład kosztów, kolorów, typów)
- Organizowania strategii gry w jednym miejscu

### 1.3 Grupa docelowa

- Gracze Magic: The Gathering (początkujący i zaawansowani)
- Osoby planujące strategie decków
- Gracze potrzebujący narzędzia do organizacji kolekcji kart

### 1.4 Kluczowe wartości

- Intuicyjność użytkowania
- Kompletność danych kart MtG
- Zgodność z zasadami gry
- Szybkość wyszukiwania i filtrowania
- Responsywność na różnych urządzeniach

## 2. Problem użytkownika

### 2.1 Główne problemy

Gracze Magic: The Gathering napotykają następujące problemy:

- Brak centralnego miejsca do organizacji decków
- Trudności w wyszukiwaniu odpowiednich kart z ogromnej bazy danych
- Brak narzędzi do analizy struktury decków
- Trudności w śledzeniu limitów kart w deckach
- Brak możliwości szybkiego porównywania różnych wersji decków

### 2.2 Obecne rozwiązania i ich ograniczenia

- Fizyczne notatki - łatwo gubione, trudne do edycji
- Arkusze kalkulacyjne - brak integracji z bazą kart, ograniczone filtrowanie
- Inne aplikacje - często płatne, skomplikowane, brak polskiej lokalizacji

### 2.3 Korzyści z rozwiązania

- Centralizacja zarządzania deckami
- Szybkie wyszukiwanie i filtrowanie kart
- Automatyczne sprawdzanie limitów kart
- Wizualizacja statystyk decków
- Dostępność z każdego urządzenia

## 3. Wymagania funkcjonalne

### 3.1 Zarządzanie deckami

- Tworzenie nowych decków z metadanymi (nazwa, opis, format, data utworzenia)
- Edycja istniejących decków
- Usuwanie decków z potwierdzeniem
- Lista wszystkich decków użytkownika
- Wyszukiwanie decków po nazwie

### 3.2 Wyszukiwanie i filtrowanie kart

- Wyszukiwanie kart po nazwie
- Filtrowanie po kolorach (biały, niebieski, czarny, czerwony, zielony, bezbarwny)
- Filtrowanie po koszcie many
- Filtrowanie po typach kart (stworzenie, czar, planeswalker, artefakt, enchantment, instant, sorcery, land)
- Filtrowanie po setach MtG
- Filtrowanie po rzadkości
- Filtrowanie po koszcie zakupu
- Kombinowanie wielu filtrów jednocześnie
- Sortowanie wyników (nazwa, koszt many, data wydania)

### 3.3 Zarządzanie kartami w deckach

- Dodawanie kart do decka
- Usuwanie kart z decka
- Edycja ilości kart w decku
- Automatyczne sprawdzanie limitów (4 sztuki na kartę, landy bez limitu)
- Wyświetlanie aktualnej liczby kart w decku
- Podgląd szczegółów karty (obraz, tekst, koszt, typ)

### 3.4 Statystyki decków

- Rozkład kosztów many w decku
- Rozkład kolorów w decku
- Rozkład typów kart
- Liczba kart w decku
- Średni koszt many
- Wykresy i wizualizacje statystyk

### 3.5 Autentykacja i bezpieczeństwo

- Rejestracja nowych użytkowników
- Logowanie użytkowników
- Wylogowanie
- Ochrona danych użytkownika
- Sesje użytkownika

## 4. Granice produktu

### 4.1 Funkcjonalności włączone w MVP

- Podstawowe CRUD dla decków
- Wyszukiwanie i filtrowanie kart
- Zarządzanie kartami w deckach z limitami
- Podstawowe statystyki decków
- Autentykacja użytkowników
- Responsywny design

### 4.2 Funkcjonalności wykluczone z MVP

- Funkcjonalności społecznościowe (udostępnianie decków)
- Eksport decków do innych formatów
- Zaawansowana analiza metagame
- Notatki do kart
- System ocen decków
- Integracja z zewnętrznymi platformami
- Aplikacja mobilna (tylko web)

### 4.3 Ograniczenia techniczne

- Czas realizacji: 2 tygodnie na MVP
- Brak funkcjonalności offline
- Zależność od zewnętrznego API kart
- Brak zaawansowanych algorytmów rekomendacji

### 4.4 Obsługiwane formaty MtG

- Standard
- Modern
- Legacy
- Vintage
- Commander
- Pauper
- Inne formaty zgodne z zasadami MtG

## 5. Historyjki użytkowników

### US-001: Rejestracja użytkownika

**Tytuł:** Jako nowy użytkownik chcę się zarejestrować, aby móc korzystać z aplikacji

**Opis:** Nowy użytkownik chce utworzyć konto w aplikacji MtG Decks Builder, aby móc tworzyć i zarządzać swoimi deckami. Bez utworzonego konta nie ma możliwości tworzenia decków.

**Kryteria akceptacji:**

- Użytkownik może wprowadzić adres email i hasło
- System waliduje format emaila
- Hasło musi mieć minimum 8 znaków
- System sprawdza unikalność emaila
- Po pomyślnej rejestracji użytkownik jest automatycznie zalogowany
- Wyświetlany jest komunikat o pomyślnej rejestracji
- W przypadku błędu wyświetlany jest odpowiedni komunikat

### US-002: Logowanie użytkownika

**Tytuł:** Jako zarejestrowany użytkownik chcę się zalogować, aby uzyskać dostęp do moich decków

**Opis:** Zarejestrowany użytkownik chce się zalogować do aplikacji, aby móc zarządzać swoimi deckami.

**Kryteria akceptacji:**

- Użytkownik może wprowadzić email i hasło
- System waliduje dane logowania
- Po pomyślnym logowaniu użytkownik jest przekierowany do głównej strony
- Sesja użytkownika jest zachowana
- W przypadku błędnych danych wyświetlany jest komunikat o błędzie
- Użytkownik może wybrać opcję "Zapamiętaj mnie"

### US-003: Wylogowanie użytkownika

**Tytuł:** Jako zalogowany użytkownik chcę się wylogować, aby zabezpieczyć swoje konto

**Opis:** Zalogowany użytkownik chce się wylogować z aplikacji z powodów bezpieczeństwa.

**Kryteria akceptacji:**

- Użytkownik może kliknąć przycisk "Wyloguj"
- System wylogowuje użytkownika i kończy sesję
- Użytkownik jest przekierowany do strony logowania
- Sesja jest całkowicie usunięta
- Wyświetlany jest komunikat o pomyślnym wylogowaniu

### US-004: Tworzenie nowego decka

**Tytuł:** Jako zalogowany użytkownik chcę utworzyć nowy deck, aby organizować swoje karty

**Opis:** Użytkownik chce utworzyć nowy deck z podstawowymi informacjami.

**Kryteria akceptacji:**

- Użytkownik może wprowadzić nazwę decka (wymagane)
- Użytkownik może dodać opis decka (opcjonalne)
- Użytkownik może wybrać format decka z listy dostępnych formatów
- System automatycznie przypisuje datę utworzenia
- Po zapisaniu deck jest dodawany do listy decków użytkownika
- Użytkownik jest przekierowany do edytora decka
- Walidacja: nazwa nie może być pusta, maksymalnie 100 znaków

### US-005: Wyświetlanie listy decków

**Tytuł:** Jako zalogowany użytkownik chcę zobaczyć listę moich decków, aby szybko znaleźć potrzebny deck

**Opis:** Użytkownik chce zobaczyć wszystkie swoje decki w przejrzystej liście.

**Kryteria akceptacji:**

- Lista wyświetla nazwę, format, datę utworzenia i liczbę kart każdego decka
- Decki są posortowane według daty utworzenia (najnowsze pierwsze)
- Użytkownik może wyszukiwać decki po nazwie
- Każdy deck ma przyciski do edycji i usunięcia
- Lista jest responsywna i działa na różnych urządzeniach
- W przypadku braku decków wyświetlany jest komunikat zachęcający do utworzenia pierwszego decka

### US-006: Edycja decka

**Tytuł:** Jako właściciel decka chcę edytować jego metadane, aby zaktualizować informacje

**Opis:** Użytkownik chce zmodyfikować nazwę, opis lub format istniejącego decka.

**Kryteria akceptacji:**

- Użytkownik może zmienić nazwę decka
- Użytkownik może zmienić opis decka
- Użytkownik może zmienić format decka
- Zmiany są zapisywane po kliknięciu "Zapisz"
- Użytkownik może anulować zmiany przyciskiem "Anuluj"
- Po zapisaniu wyświetlany jest komunikat o pomyślnej aktualizacji
- Walidacja: nazwa nie może być pusta

### US-007: Usuwanie decka

**Tytuł:** Jako właściciel decka chcę go usunąć, aby uporządkować swoje kolekcje

**Opis:** Użytkownik chce trwale usunąć niepotrzebny deck.

**Kryteria akceptacji:**

- Użytkownik może kliknąć przycisk "Usuń" przy decku
- System wyświetla dialog potwierdzenia z nazwą decka
- Użytkownik musi potwierdzić usunięcie
- Po potwierdzeniu deck jest trwale usunięty
- Użytkownik jest przekierowany do listy decków
- Wyświetlany jest komunikat o pomyślnym usunięciu
- Operacja jest nieodwracalna

### US-008: Wyszukiwanie kart

**Tytuł:** Jako użytkownik chcę wyszukiwać karty po nazwie, aby znaleźć konkretną kartę

**Opis:** Użytkownik chce znaleźć kartę wpisując jej nazwę lub fragment nazwy.

**Kryteria akceptacji:**

- Użytkownik może wprowadzić nazwę karty w pole wyszukiwania
- System wyszukuje karty zawierające wprowadzony tekst
- Wyniki są wyświetlane w czasie rzeczywistym podczas wpisywania
- Wyszukiwanie jest case-insensitive
- Wyświetlanych jest maksymalnie 50 wyników na stronę
- Użytkownik może wyczyścić pole wyszukiwania
- W przypadku braku wyników wyświetlany jest odpowiedni komunikat

### US-009: Filtrowanie kart po kolorach

**Tytuł:** Jako użytkownik chcę filtrować karty po kolorach, aby znaleźć karty w określonych kolorach

**Opis:** Użytkownik chce zawęzić wyniki wyszukiwania do kart w określonych kolorach.

**Kryteria akceptacji:**

- Użytkownik może wybrać jeden lub więcej kolorów (biały, niebieski, czarny, czerwony, zielony, bezbarwny)
- Filtry można łączyć z wyszukiwaniem tekstowym
- Wybrane filtry są wizualnie oznaczone
- Użytkownik może wyczyścić wszystkie filtry
- Filtry są zachowywane podczas nawigacji
- Wyniki są aktualizowane automatycznie po zmianie filtrów

### US-010: Filtrowanie kart po koszcie many

**Tytuł:** Jako użytkownik chcę filtrować karty po koszcie many, aby znaleźć karty o określonym koszcie

**Opis:** Użytkownik chce znaleźć karty o konkretnym koszcie many lub w określonym zakresie.

**Kryteria akceptacji:**

- Użytkownik może wybrać dokładny koszt many (0-15)
- Użytkownik może wybrać zakres kosztów (od-do)
- Użytkownik może wybrać "X" dla kart z kosztem many X
- Filtry można łączyć z innymi filtrami
- Wyniki są aktualizowane automatycznie
- Użytkownik może wyczyścić filtry kosztów

### US-011: Filtrowanie kart po typach

**Tytuł:** Jako użytkownik chcę filtrować karty po typach, aby znaleźć karty określonego typu

**Opis:** Użytkownik chce zawęzić wyszukiwanie do kart określonego typu (stworzenie, czar, planeswalker, etc.).

**Kryteria akceptacji:**

- Użytkownik może wybrać jeden lub więcej typów kart
- Dostępne typy: stworzenie, czar, planeswalker, artefakt, enchantment, instant, sorcery, land
- Filtry można łączyć z innymi filtrami
- Użytkownik może wyczyścić filtry typów
- Wyniki są aktualizowane automatycznie
- Wybrane filtry są wizualnie oznaczone

### US-012: Dodawanie karty do decka

**Tytuł:** Jako użytkownik chcę dodać kartę do decka, aby zbudować swoją strategię

**Opis:** Użytkownik chce dodać wybraną kartę do aktualnie edytowanego decka.

**Kryteria akceptacji:**

- Użytkownik może kliknąć przycisk "Dodaj" przy karcie
- System sprawdza czy karta nie przekracza limitu 4 sztuk (landy bez limitu)
- Karta jest dodawana do decka z ilością 1
- Użytkownik może zwiększyć ilość karty w decku
- System wyświetla aktualną liczbę kart w decku
- W przypadku przekroczenia limitu wyświetlany jest komunikat o błędzie
- Karta jest oznaczona jako dodana do decka

### US-013: Usuwanie karty z decka

**Tytuł:** Jako użytkownik chcę usunąć kartę z decka, aby zmodyfikować strategię

**Opis:** Użytkownik chce usunąć kartę z aktualnie edytowanego decka.

**Kryteria akceptacji:**

- Użytkownik może kliknąć przycisk "Usuń" przy karcie w decku
- System wyświetla dialog potwierdzenia
- Po potwierdzeniu karta jest usuwana z decka
- Liczba kart w decku jest aktualizowana
- W przypadku usunięcia ostatniej sztuki karta znika z listy
- Wyświetlany jest komunikat o pomyślnym usunięciu

### US-014: Edycja ilości karty w decku

**Tytuł:** Jako użytkownik chcę zmienić ilość karty w decku, aby dostosować strategię

**Opis:** Użytkownik chce zwiększyć lub zmniejszyć liczbę sztuk konkretnej karty w decku.

**Kryteria akceptacji:**

- Użytkownik może kliknąć przyciski +/- przy karcie w decku
- System sprawdza limity (4 sztuki dla zwykłych kart, bez limitu dla landów)
- Ilość nie może być mniejsza niż 0
- Ilość nie może być większa niż 4 (dla zwykłych kart)
- Zmiany są zapisywane automatycznie
- W przypadku przekroczenia limitu wyświetlany jest komunikat o błędzie
- Liczba kart w decku jest aktualizowana

### US-015: Wyświetlanie statystyk decka

**Tytuł:** Jako użytkownik chcę zobaczyć statystyki decka, aby analizować jego strukturę

**Opis:** Użytkownik chce przeanalizować swój deck pod kątem rozkładu kosztów, kolorów i typów.

**Kryteria akceptacji:**

- Wyświetlany jest wykres rozkładu kosztów many
- Wyświetlany jest wykres rozkładu kolorów
- Wyświetlany jest wykres rozkładu typów kart
- Wyświetlana jest całkowita liczba kart w decku
- Wyświetlany jest średni koszt many
- Statystyki są aktualizowane w czasie rzeczywistym
- Wykresy są responsywne i czytelne

### US-016: Podgląd szczegółów karty

**Tytuł:** Jako użytkownik chcę zobaczyć szczegóły karty, aby lepiej ją poznać

**Opis:** Użytkownik chce zobaczyć pełne informacje o karcie (obraz, tekst, koszt, typ).

**Kryteria akceptacji:**

- Użytkownik może kliknąć na kartę aby zobaczyć szczegóły
- Wyświetlany jest obraz karty w wysokiej rozdzielczości
- Wyświetlany jest pełny tekst karty
- Wyświetlane są wszystkie koszty (many, life, etc.)
- Wyświetlane są typy i podtypy karty
- Wyświetlana jest rzadkość karty
- Użytkownik może zamknąć podgląd

### US-017: Wyszukiwanie decków

**Tytuł:** Jako użytkownik chcę wyszukiwać swoje decki po nazwie, aby szybko znaleźć potrzebny deck

**Opis:** Użytkownik ma wiele decków i chce szybko znaleźć konkretny deck.

**Kryteria akceptacji:**

- Użytkownik może wprowadzić nazwę decka w pole wyszukiwania
- System wyszukuje decki zawierające wprowadzony tekst
- Wyniki są wyświetlane w czasie rzeczywistym
- Wyszukiwanie jest case-insensitive
- Użytkownik może wyczyścić pole wyszukiwania
- W przypadku braku wyników wyświetlany jest komunikat
- Lista decków jest filtrowana dynamicznie

### US-018: Obsługa błędów API

**Tytuł:** Jako użytkownik chcę otrzymywać informacje o błędach, aby zrozumieć co się dzieje

**Opis:** W przypadku problemów z zewnętrznym API kart, użytkownik powinien otrzymać jasne komunikaty.

**Kryteria akceptacji:**

- W przypadku błędu połączenia wyświetlany jest komunikat o problemie z siecią
- W przypadku błędu API wyświetlany jest komunikat o problemie z serwisem
- Użytkownik może spróbować ponownie
- Aplikacja nie crashuje w przypadku błędów API
- Błędy są logowane dla administratorów
- Użytkownik otrzymuje sugestie co może zrobić

### US-019: Responsywność na urządzeniach mobilnych

**Tytuł:** Jako użytkownik mobilny chcę korzystać z aplikacji na telefonie, aby mieć dostęp wszędzie

**Opis:** Użytkownik chce korzystać z aplikacji na urządzeniach mobilnych.

**Kryteria akceptacji:**

- Aplikacja działa poprawnie na ekranach o szerokości od 320px
- Wszystkie elementy są dotykowe i mają odpowiedni rozmiar
- Lista kart jest przewijalna i responsywna
- Filtry są dostępne w formie dropdown lub modal
- Statystyki są wyświetlane w formie dostosowanej do małych ekranów
- Nawigacja jest intuicyjna na urządzeniach dotykowych

### US-020: Walidacja limitów kart w decku

**Tytuł:** Jako użytkownik chcę być informowany o limitach kart, aby przestrzegać zasad gry

**Opis:** System powinien automatycznie sprawdzać i egzekwować limity kart zgodnie z zasadami MtG.

**Kryteria akceptacji:**

- System automatycznie rozpoznaje landy (nie mają limitu)
- System sprawdza limit 4 sztuk dla zwykłych kart
- W przypadku próby dodania 5. sztuki karty wyświetlany jest komunikat o błędzie
- Użytkownik nie może przekroczyć limitów przez edycję ilości
- System wyświetla aktualną liczbę kart każdego typu
- Limity są sprawdzane w czasie rzeczywistym

## 6. Metryki sukcesu

### 6.1 Metryki biznesowe

- **Liczba zarejestrowanych użytkowników** - cel: 100 użytkowników w pierwszym miesiącu
- **Liczba utworzonych decków** - cel: średnio 5 decków na użytkownika
- **Częstotliwość użytkowania** - cel: 3+ sesje na tydzień na użytkownika
- **Retencja użytkowników** - cel: 70% użytkowników wraca w ciągu tygodnia

### 6.2 Metryki techniczne

- **Czas ładowania strony** - cel: < 2 sekundy
- **Czas odpowiedzi wyszukiwania** - cel: < 1 sekunda
- **Dostępność aplikacji** - cel: 99% uptime
- **Czas realizacji MVP** - cel: 2 tygodnie

### 6.3 Metryki użytkownika

- **Liczba wyszukiwań kart** - cel: średnio 20 wyszukiwań na sesję
- **Liczba filtrów używanych** - cel: średnio 3 filtry na wyszukiwanie
- **Czas tworzenia decka** - cel: < 10 minut na deck
- **Liczba błędów użytkownika** - cel: < 5% akcji kończy się błędem

### 6.4 Metryki jakości

- **Liczba bugów w produkcji** - cel: 0 krytycznych, < 5 drobnych
- **Pokrycie testami** - cel: > 80% kodu
- **Czas naprawy błędów** - cel: < 24 godziny dla krytycznych
- **Zadowolenie użytkowników** - cel: > 4.0/5.0 w ankiecie

### 6.5 Kluczowe wskaźniki wydajności (KPI)

1. **Główny KPI**: Liczba aktywnych decków (decki edytowane w ciągu ostatnich 7 dni)
2. **Wtórny KPI**: Czas spędzony w aplikacji na sesję
3. **Wskaźnik konwersji**: Procent użytkowników tworzących pierwszy deck
4. **Wskaźnik zaangażowania**: Liczba kart dodanych do decków dziennie

### 6.6 Metryki do monitorowania

- Liczba błędów JavaScript w konsoli
- Czas odpowiedzi API zewnętrznego
- Użycie pamięci przeglądarki
- Liczba równoczesnych użytkowników
- Najpopularniejsze karty wyszukiwane
- Najczęściej używane filtry
