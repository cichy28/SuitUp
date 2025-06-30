# Generowanie dodatkowych produktów dla producenta Lemanska

**Task Number:** T-XXX

## 1. Description

Obecnie mechanizm rekomendacji produktów dla producenta "Lemanska" jest ograniczony ze względu na małą liczbę dostępnych produktów. Istniejące produkty wykorzystują pliki SVG jako placeholdery. Celem tego zadania jest zwiększenie liczby produktów dla producenta "Lemanska" poprzez wygenerowanie nowych produktów z rzeczywistymi plikami obrazów `.jpg` zawierającymi tekst, co pozwoli na pełniejsze testowanie mechanizmu rekomendacji.

## 2. Acceptance Criteria

- [ ] Zidentyfikowano skrypt odpowiedzialny za ładowanie danych z folderu `_do_importu/`.
- [ ] Zidentyfikowano sposób, w jaki dane produktów są strukturyzowane w folderze `_do_importu/Lemanska/`.
- [ ] Zaimplementowano metodę generowania plików `.jpg` z tekstem przy użyciu biblioteki `canvas`.
- [ ] Utworzono nową strukturę folderów w `_do_importu/Lemanska/` dla co najmniej 10-20 nowych produktów, z których każdy zawiera foldery `WARIANTY` i `WLASCIWOSCI`.
- [ ] Każdy nowy produkt zawiera co najmniej jeden plik `.jpg` z wygenerowanym obrazem.
- [ ] Dla każdego nowego produktu wygenerowano plik `product_metadata.json` w głównym folderze produktu, zawierający przypisane sylwetki (`suitableFor`) i preferencje stylu (`style`).
- [ ] Skrypt `backend/scripts/mass-import-images.ts` został zmodyfikowany, aby odczytywać `product_metadata.json` i przypisywać `suitableFor` oraz `style` do produktu w bazie danych.
- [ ] Skrypt ładowania danych jest w stanie poprawnie zaimportować nowe produkty z wygenerowanymi obrazami i przypisanymi właściwościami, sylwetkami i preferencjami stylu.
- [ ] Po załadowaniu danych, nowe produkty są widoczne w bazie danych i dostępne dla mechanizmu rekomendacji, z poprawnie przypisanymi sylwetkami i preferencjami stylu.

## 3. Technical Details & Implementation Notes

- **Affected Files:**
    - `backend/scripts/mass-import-images.ts`
    - `_do_importu/Lemanska/...` (nowe pliki i foldery)
    - Nowy skrypt do generowania danych/obrazów (`backend/scripts/generate-lemaska-products.ts`)

## 4. Gemini Analysis

### Plan:

1.  **Zrozumienie istniejącego mechanizmu importu i struktury danych:**
    *   Przeanalizuję plik `backend/scripts/mass-import-images.ts` aby zrozumieć, jak dane są odczytywane i importowane do bazy danych.
    *   Zbadam strukturę folderów w `_do_importu/Lemanska/` (np. `KAMIZELKA_A/WARIANTY/`, `KAMIZELKA_A/WLASCIWOSCI/`) oraz zawartość plików w tych folderach, aby zrozumieć, jak są mapowane na dane produktu, warianty, właściwości.
    *   Zidentyfikuję dostępne sylwetki (`BodyShape`) i preferencje stylu (`StylePreference`) z `shared/enums.ts` i `backend/prisma/schema.prisma`.
2.  **Modyfikacja `generate-lemaska-products.ts` (nowy skrypt):**
    *   Zaimplementuję generator obrazów z `canvas`.
    *   Dla każdego generowanego produktu:
        *   Utworzę główny folder produktu.
        *   Wewnątrz niego utworzę foldery `WARIANTY` i `WLASCIWOSCI`.
        *   Wygeneruję plik `.jpg` z obrazem produktu i umieszczę go w odpowiednim miejscu (do ustalenia na podstawie analizy istniejącej struktury).
        *   **Kluczowa zmiana:** Utworzę plik `product_metadata.json` w głównym folderze produktu. Ten plik będzie zawierał tablice `suitableFor` (BodyShape[]) i `style` (StylePreference[]), przypisane losowo lub w zdefiniowany sposób.
        *   W folderze `WLASCIWOSCI` będą generowane tylko właściwości, które faktycznie tworzą warianty SKU (np. `KOLOR`, `ROZMIAR`).
3.  **Modyfikacja `mass-import-images.ts`:**
    *   Zmodyfikuję funkcję `processProduct` w `mass-import-images.ts`, aby odczytywała plik `product_metadata.json` z głównego folderu produktu.
    *   Wyodrębnię z tego pliku wartości `suitableFor` i `style`.
    *   Zaktualizuję wywołanie `prisma.product.create` (lub `update`) o te wartości, aby były one poprawnie przypisane do modelu `Product` w bazie danych.
4.  **Weryfikacja importu:**
    *   Uruchomię skrypt importujący dane (`backend/scripts/mass-import-images.ts`), aby sprawdzić, czy nowe produkty z obrazami `.jpg` i przypisanymi właściwościami, sylwetkami i preferencjami stylu zostały poprawnie załadowane do bazy danych.
    *   Zweryfikuję dane w bazie danych (np. poprzez zapytanie do API backendu lub przeglądając dane w narzędziu do zarządzania bazą danych), aby upewnić się, że sylwetki i preferencje stylu są poprawnie przypisane do produktów.

