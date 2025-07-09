
# Task T-006: Pełna przebudowa logiki cenowej i naprawa importu danych

## 1. Opis

Obecny mechanizm cenowy w aplikacji jest wadliwy. Skrypty importujące dane nie populują cen bazowych produktów, co skutkuje wartością `0` w bazie danych. Dodatkowo, brakuje spójnej logiki do obliczania ceny finalnej `ProductSku` na podstawie ceny bazowej produktu, modyfikatorów cenowych poszczególnych wariantów cech (`PropertyVariant`) oraz promocyjnych korekt na poziomie samego SKU.

Celem tego zadania jest kompleksowa naprawa i wdrożenie nowej logiki cenowej w całym systemie: od generowania danych, przez ich import, logikę backendową, aż po prawidłowe wyświetlanie cen w interfejsie użytkownika.

## 2. Kryteria Akceptacji (Acceptance Criteria)

1.  **Cena Bazowa Produktu:**
    *   Skrypt `scripts/generate-lemaska-products.ts` musi generować dane z uwzględnieniem pola `basePrice` dla każdego produktu.
    *   Skrypt importujący dane musi poprawnie odczytywać `basePrice` z metadanych i zapisywać je w tabeli `Product` w bazie danych.

2.  **Obliczanie Ceny Bazowej SKU:**
    *   Cena bazowa dla danego `ProductSku` jest obliczana dynamicznie jako suma: `Product.basePrice` + `SUM(PropertyVariant.priceAdjustment)` dla wszystkich wariantów składających się na dany SKU.
    *   Pole `priceAdjustment` w modelu `PropertyVariant` reprezentuje bezwzględną wartość netto, o jaką dany wariant zmienia cenę bazową produktu.

3.  **Promocyjna Korekta Ceny SKU:**
    *   Model `ProductSku` musi posiadać opcjonalne pole `priceMultiplier` (typu `Decimal`/`Float`), które działa jako mnożnik promocyjny. Domyślna wartość to `1.0`.
    *   Wartość `priceMultiplier < 1.0` oznacza promocję (przecenę).
    *   Wartość `priceMultiplier > 1.0` oznacza odgórne podniesienie ceny.

4.  **Obliczanie Ceny Finalnej SKU:**
    *   Cena finalna `ProductSku` jest obliczana według wzoru: `CenaBazowaSKU * priceMultiplier`.

5.  **Wyświetlanie Ceny w UI (Ekran Rekomendacji):**
    *   **Promocja (`priceMultiplier < 1.0`):** Na ekranie `RecommendationScreen` musi być wyświetlana przekreślona cena bazowa SKU oraz obok niej nowa, niższa cena finalna. Musi to jasno komunikować, że produkt jest w promocji.
    *   **Cena Standardowa/Podwyższona (`priceMultiplier >= 1.0`):** Wyświetlana jest tylko i wyłącznie cena finalna, bez pokazywania ceny bazowej.

6.  **Schemat Bazy Danych:**
    *   Schemat Prisma (`schema.prisma`) musi zostać zweryfikowany i w razie potrzeby zaktualizowany, aby zapewnić, że wszystkie pola związane z cenami (`basePrice`, `priceAdjustment`, `priceMultiplier`) mają odpowiedni typ danych (np. `Decimal`).

## 3. Plan Implementacji

### Backend

1.  **Prisma Schema (`backend/prisma/schema.prisma`):**
    *   W modelu `Product` dodaj lub upewnij się, że istnieje pole `basePrice` (np. `Decimal`).
    *   W modelu `PropertyVariant` dodaj lub upewnij się, że istnieje pole `priceAdjustment` (np. `Decimal`).
    *   W modelu `ProductSku` dodaj pole `priceMultiplier` (np. `Decimal @default(1.0)`).

2.  **Skrypty:**
    *   **`backend/scripts/generate-lemaska-products.ts`:** Zmodyfikuj skrypt, aby generował pliki `.json` zawierające `basePrice` dla produktów oraz `priceAdjustment` dla wariantów cech.
    *   **`backend/scripts/mass-import-images.ts` (lub główny skrypt importujący):** Rozbuduj logikę, aby podczas importu zapisywać `basePrice` do bazy danych.

3.  **API & Logika Biznesowa:**
    *   **`backend/src/controllers/recommendationsController.ts` (lub odpowiedni kontroler):** Zmodyfikuj endpoint zwracający rekomendacje. Dla każdego `ProductSku` powinien on obliczać i zwracać:
        *   `skuBasePrice`: Obliczona cena bazowa SKU.
        *   `finalPrice`: Obliczona cena finalna po uwzględnieniu `priceMultiplier`.
        *   `priceMultiplier`: Wartość mnożnika.
    *   Backend powinien dostarczyć na frontend wszystkie te trzy wartości, aby UI mogło łatwo zaimplementować logikę wyświetlania.

### Frontend

1.  **Aktualizacja Typów (`shared/`):**
    *   Zaktualizuj definicje typów/walidatory Zod dla `ProductSku`, aby uwzględniały nowe pola (`skuBasePrice`, `finalPrice`, `priceMultiplier`).

2.  **Pobieranie Danych (`frontend/src/hooks/useApi.ts`):**
    *   Upewnij się, że hook pobierający rekomendacje poprawnie odbiera i przetwarza nowe pola cenowe.

3.  **Komponent Wyświetlania Ceny:**
    *   Stwórz nowy, reużywalny komponent (np. `components/PriceView.tsx`), który przyjmie jako propsy `skuBasePrice`, `finalPrice` i `priceMultiplier`.
    *   Komponent ten będzie odpowiedzialny za logikę warunkowego renderowania:
        *   Jeśli `priceMultiplier < 1.0`, renderuje `<Text style={{textDecorationLine: 'line-through'}}>{skuBasePrice}</Text> <Text>{finalPrice}</Text>`.
        *   W przeciwnym razie, renderuje tylko `<Text>{finalPrice}</Text>`.

4.  **Ekran Rekomendacji (`frontend/src/screens/RecommendationScreen.tsx`):**
    *   Zintegruj nowy komponent `PriceView.tsx` w miejscu, gdzie obecnie wyświetlana jest cena.
