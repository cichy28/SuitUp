---

# T-002: Poprawki na ekranie rekomendacji i implementacja konfiguratora produktu

## 1. Cel zadania

Celem tego zadania jest naprawienie dwóch krytycznych błędów w aplikacji:
1.  Brak wyświetlania zdjęć produktów na ekranie rekomendacji.
2.  Brak działającego konfiguratora produktu po kliknięciu na polecany produkt.

Zadanie obejmuje poprawki w istniejącym kodzie oraz implementację nowego ekranu konfiguratora produktu, zgodnie z dostarczonym projektem graficznym.

## 2. Opis problemu

### 2.1. Błąd wyświetlania zdjęć na ekranie rekomendacji

-   **Problem:** Aplikacja poprawnie pobiera z bazy danych listę produktów pasujących do preferencji użytkownika, ale na ekranie `RecommendationScreen` nie wyświetlają się ich zdjęcia.
-   **Przyczyna:** Prawdopodobnie występuje problem z odczytem lub przekazaniem ścieżki do głównego zdjęcia produktu z danych backendu do komponentu frontendowego.

### 2.2. Brak konfiguratora produktu

-   **Problem:** Po kliknięciu na dowolny produkt na ekranie rekomendacji, użytkownik jest przenoszony do widoku z tekstem zastępczym, zamiast do interaktywnego konfiguratora produktu.
-   **Oczekiwania:** Kliknięcie w produkt powinno otwierać nowy ekran, na którym użytkownik może personalizować produkt (np. zmieniać guziki, kolor, materiał), zgodnie z projektem `frontendDesigns/Konfigurator_2.jpg`.

## 3. Kryteria akceptacji (Co należy zrobić)

### 3.1. Naprawa wyświetlania zdjęć

1.  **Analiza danych:** Zdiagnozuj, w jaki sposób dane produktu (w szczególności tablica `multimedia`) są odbierane z backendu na ekranie `RecommendationScreen`.
2.  **Poprawka komponentu:** Zmodyfikuj komponent odpowiedzialny za wyświetlanie pojedynczego produktu na liście rekomendacji, aby poprawnie interpretował dane i wyświetlał główne zdjęcie produktu.
3.  **Weryfikacja:** Upewnij się, że dla każdego produktu na liście rekomendacji wyświetlane jest odpowiednie zdjęcie.

### 3.2. Implementacja ekranu konfiguratora produktu

1.  **Stworzenie nowego ekranu:** Utwórz nowy plik `frontend/src/screens/ProductConfiguratorScreen.tsx`.
2.  **Nawigacja:** Zaktualizuj `frontend/src/navigation/AppNavigator.tsx`, aby po kliknięciu produktu na `RecommendationScreen` nawigować do nowego ekranu `ProductConfiguratorScreen`, przekazując ID wybranego produktu.
3.  **Adaptacja istniejącego komponentu:**
    *   Zidentyfikuj komponent używany na ekranie `MeasurementScreen` do interaktywnego obrazu (prawdopodobnie `InteractiveImageView.tsx`).
    *   Przebuduj go tak, aby mógł być reużywany. Komponent powinien przyjmować jako właściwości (props) źródło obrazu oraz listę interaktywnych punktów (hotspotów).
4.  **Budowa UI konfiguratora:**
    *   Na nowym ekranie wykorzystaj przebudowany komponent `InteractiveImageView` do wyświetlenia obrazu produktu z hotspotami pobranymi z backendu.
    *   Po kliknięciu w hotspot, ekran powinien wyświetlić nazwę właściwości do skonfigurowania (np. "GUZIK", "MATERIAŁ").
5.  **Stworzenie komponentu wyboru wariantów:**
    *   Stwórz nowy, reużywalny komponent `frontend/src/components/VariantSelector.tsx`.
    *   Komponent ten powinien wyświetlać listę dostępnych wariantów dla wybranej właściwości (np. listę obrazków z różnymi guzikami).
    *   Wybór wariantu powinien być odnotowywany w stanie komponentu.
6.  **Zarządzanie stanem:** Użyj `useState` lub kontekstu (`DesignContext`) do przechowywania aktualnej konfiguracji produktu (które warianty dla których właściwości zostały wybrane).

## 4. Szczegóły techniczne i wskazówki

-   **Backend API:** Upewnij się, że istnieje endpoint w API (np. `GET /api/products/:id`), który zwraca wszystkie potrzebne dane produktu, w tym jego właściwości, warianty i przypisane do nich multimedia.
-   **Struktura danych:** Przeanalizuj strukturę modeli `Product`, `Property`, `PropertyVariant` i `Multimedia` w `prisma/schema.prisma`, aby zrozumieć, jak są ze sobą powiązane.
-   **Komponenty:**
    -   **Do modyfikacji:** `RecommendationScreen.tsx`, `InteractiveImageView.tsx`, `ProductConfiguratorView.tsx`.
    -   **Do stworzenia:** `VariantSelector.tsx`.

---
