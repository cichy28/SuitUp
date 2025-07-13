### **T-009: Implementacja logiki klasyfikacji sylwetki i walidacji danych wejściowych**

**Cel:** Uczynienie procesu zbierania pomiarów w pełni funkcjonalnym poprzez implementację logiki, która na ich podstawie określa typ sylwetki użytkownika, oraz dodanie walidacji uniemożliwiającej przejście dalej bez podania kompletnych danych.

**Opis:**
Obecnie ekran `BriefScreen` zbiera wymiary użytkownika, ale logika w `StylePreferencesScreen` (`classifyBodyShape`) ignoruje te dane i zwraca stałą wartość (`INVERTED_TRIANGLE`). Dodatkowo, nie ma mechanizmu, który informowałby użytkownika o konieczności wypełnienia wszystkich pól przed kontynuacją.

To zadanie ma na celu naprawienie tych braków, implementując realną logikę klasyfikacji oraz wprowadzając walidację na ekranie `BriefScreen`.

**Kryteria akceptacji (Acceptance Criteria):**

1.  **Logika klasyfikacji:** Funkcja `classifyBodyShape` w pliku `frontend/src/screens/StylePreferencesScreen.tsx` musi zostać zaimplementowana tak, aby dynamicznie określała typ sylwetki na podstawie przekazanych pomiarów.
2.  **Wykorzystanie pomiarów:** Logika musi opierać się na proporcjach między kluczowymi pomiarami: `chest` (klatka piersiowa), `waist` (talia) i `hips` (biodra).
    - **Trójkąt (Gruszka):** Biodra są wyraźnie szersze od klatki piersiowej.
    - **Odwrócony Trójkąt:** Klatka piersiowa jest wyraźnie szersza od bioder.
    - **Klepsydra:** Klatka piersiowa i biodra mają zbliżony wymiar, a talia jest wyraźnie węższa.
    - **Prostokąt:** Klatka piersiowa, talia i biodra mają zbliżone wymiary.
    - **Owal (Jabłko):** Talia jest szersza od klatki piersiowej i bioder.
3.  **Walidacja w `BriefScreen`:** W pliku `frontend/src/screens/BriefScreen.tsx`, po naciśnięciu przycisku "Continue", system musi sprawdzić, czy wszystkie pola pomiarów zostały wypełnione.
4.  **Komunikat dla użytkownika:** Jeśli którykolwiek z pomiarów jest pusty, na ekranie musi pojawić się `Alert` z czytelnym komunikatem, np. "Proszę uzupełnić wszystkie wymiary, aby kontynuować."
5.  **Blokada nawigacji:** Nawigacja do ekranu `StylePreferencesScreen` musi zostać zablokowana, dopóki wszystkie pomiary nie zostaną wprowadzone.

**Plan implementacji:**

1.  **Modyfikacja `BriefScreen.tsx`:**
    - Zlokalizuję funkcję `handleContinue`.
    - Znajdę istniejącą (lecz nie w pełni wykorzystaną) logikę sprawdzającą `hotspots.every((h) => h.value.trim() !== "")`.
    - Zastąpię obecny `console.log` mechanizmem `Alert.alert()` z odpowiednim komunikatem dla użytkownika w przypadku niepowodzenia walidacji.

2.  **Modyfikacja `StylePreferencesScreen.tsx`:**
    - Zlokalizuję funkcję `classifyBodyShape`.
    - Wewnątrz funkcji, pobiorę i sparsuję do liczb wartości dla `chest`, `waist` i `hips` z tablicy `measurements`.
    - Zaimplementuję logikę warunkową (`if/else if/else`) opartą na proporcjach między tymi trzema wymiarami, aby zwrócić odpowiednią wartość z enuma `BodyShape`.
    - Upewnię się, że funkcja poprawnie obsługuje przekazane dane i zwraca dynamicznie obliczony typ sylwetki.
