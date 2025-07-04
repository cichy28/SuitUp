# T-003: Usprawnienie nawigacji, konfiguratora produktów i procesu składania zamówienia

**Opis:**
Obecny przepływ użytkownika w aplikacji jest wybrakowany. Brakuje kluczowych funkcjonalności, takich jak możliwość powrotu do poprzednich ekranów, co zmusza użytkowników do rozpoczynania procesu od nowa. Ekran rekomendacji ma problemy z responsywnością, a kluczowy element aplikacji - konfigurator produktów - nie działa zgodnie z założeniami. Należy również dokończyć podstawową ścieżkę składania zamówienia, dodając ekran podsumowania i tymczasowy endpoint w backendzie.

**Kryteria Akceptacji (Frontend):**

1.  **Nawigacja wsteczna:**
    *   Na każdym ekranie procesu konfiguracji (preferencje stylu, rekomendacje, konfigurator) użytkownik ma możliwość powrotu do *bezpośrednio poprzedniego* ekranu.
    *   Powrót do poprzedniego ekranu pozwala na modyfikację wcześniej dokonanych wyborów bez utraty pozostałych danych z sesji.

2.  **UI Ekranu Rekomendacji:**
    *   Na ekranie `RecommendationScreen` wszystkie obrazy produktów mają stały, z góry określony rozmiar, niezależnie od ich liczby.
    *   Layout jest zwinięty w `ScrollView` lub `FlatList`.
    *   Na ekranie telefonu widoczne są jednocześnie 4 produkty w rzędzie; reszta jest dostępna po przewinięciu.

3.  **Logika Konfiguratora Produktów:**
    *   Ekran `ProductConfiguratorScreen` dynamicznie renderuje hotspoty na obrazie produktu dla *każdej* konfigurowalnej właściwości (np. kołnierzyk, mankiet, tkanina), a nie tylko jeden.
    *   Kliknięcie na dany hotspot aktywuje `VariantSelector` dla *odpowiadającej mu właściwości*, umożliwiając wybór wariantu (np. kliknięcie na hotspot kołnierzyka pozwala wybrać rodzaj kołnierzyka).
    *   Wygląd i działanie interfejsu są inspirowane projektem z `frontendDesigns/Konfigurator_2.jpg`.

4.  **Zakończenie Procesu i Podsumowanie:**
    *   Na ekranie `ProductConfiguratorScreen` znajduje się przycisk "Zakończ" (lub "Dalej").
    *   Przycisk ten nawiguje do nowego ekranu `SummaryScreen`.
    *   Ekran `SummaryScreen` zawiera:
        *   Podsumowanie skonfigurowanego produktu.
        *   Całkowitą kwotę zamówienia.
        *   Formularz z polami na dane klienta (imię, nazwisko, adres, etc.).
        *   Przycisk "Złóż zamówienie".

**Kryteria Akceptacji (Backend):**

1.  **Placeholder dla Składania Zamówień:**
    *   Przycisk "Złóż zamówienie" na ekranie `SummaryScreen` wysyła żądanie POST z zebranymi danymi (konfiguracja + dane klienta) na nowy endpoint w backendzie (np. `/api/orders/place`).
    *   Backend posiada kontroler i trasę obsługującą ten endpoint.
    *   Na ten moment, funkcja kontrolera nie przetwarza danych, tylko od razu zwraca odpowiedź ze statusem `404` i ciałem JSON: `{ "message": "funkcjonalnosc w opracowaniu" }`.
