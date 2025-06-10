# Suit Creator - Dokumentacja

## Opis projektu

Suit Creator to aplikacja mobilna umożliwiająca konfigurację spersonalizowanych ubrań oferowanych przez małych producentów/rzemieślników. Aplikacja służy jako narzędzie do wizualizacji i składania zamówień, nie obsługuje procesu zakupowo-logistycznego.

Aplikacja obsługuje dwa typy użytkowników:
- **Klienci** - konfigurują i zamawiają spersonalizowane ubrania
- **Producenci/Sprzedawcy** - dodają swoje produkty do katalogu, zarządzają ofertą

## Stack technologiczny

### Frontend
- **React/React Native** - framework do budowy interfejsu użytkownika
- **Expo** - platforma ułatwiająca rozwój aplikacji React Native
- **TypeScript** - typowany nadzbiór JavaScript
- **Tailwind CSS (via NativeWind)** - framework CSS do stylowania komponentów
- **Formik + Yup** - zarządzanie formularzami i walidacja
- **React Navigation** - nawigacja w aplikacji
- **Axios** - klient HTTP do komunikacji z API
- **Zustand** - zarządzanie stanem aplikacji

### Backend
- **Node.js** - środowisko uruchomieniowe JavaScript
- **Express** - framework do budowy API
- **TypeScript** - typowany nadzbiór JavaScript
- **Prisma ORM** - ORM do komunikacji z bazą danych
- **SQLite** - lekka baza danych SQL
- **JWT** - uwierzytelnianie i autoryzacja
- **bcrypt** - haszowanie haseł
- **dotenv** - zarządzanie zmiennymi środowiskowymi

### Konteneryzacja
- **Docker** - konteneryzacja aplikacji
- **Docker Compose** - orkiestracja kontenerów

## Struktura projektu

```
suit-creator-app/
├── backend/                  # Kod backendu
│   ├── prisma/               # Konfiguracja i migracje Prisma
│   ├── src/                  # Kod źródłowy backendu
│   │   ├── config/           # Konfiguracja aplikacji
│   │   ├── controllers/      # Kontrolery API
│   │   ├── middleware/       # Middleware Express
│   │   ├── models/           # Modele danych
│   │   ├── routes/           # Definicje tras API
│   │   ├── utils/            # Narzędzia pomocnicze
│   │   └── index.ts          # Punkt wejściowy aplikacji
│   ├── .env                  # Zmienne środowiskowe
│   ├── Dockerfile            # Konfiguracja Docker dla backendu
│   ├── package.json          # Zależności backendu
│   └── tsconfig.json         # Konfiguracja TypeScript
├── frontend/                 # Kod frontendu
│   ├── src/                  # Kod źródłowy frontendu
│   │   ├── assets/           # Zasoby statyczne (obrazy, ikony)
│   │   ├── components/       # Komponenty wielokrotnego użytku
│   │   │   └── ui/           # Biblioteka komponentów UI
│   │   ├── navigation/       # Konfiguracja nawigacji
│   │   ├── screens/          # Ekrany aplikacji
│   │   │   ├── auth/         # Ekrany autoryzacji
│   │   │   ├── main/         # Główne ekrany klienta
│   │   │   ├── orders/       # Ekrany zamówień
│   │   │   ├── producer/     # Ekrany producenta
│   │   │   └── products/     # Ekrany produktów
│   │   └── services/         # Usługi (API, autoryzacja)
│   ├── App.tsx               # Główny komponent aplikacji
│   ├── Dockerfile            # Konfiguracja Docker dla frontendu
│   ├── package.json          # Zależności frontendu
│   └── tailwind.config.js    # Konfiguracja Tailwind CSS
├── docker/                   # Dodatkowe pliki Docker
├── docs/                     # Dokumentacja projektu
├── docker-compose.yml        # Konfiguracja Docker Compose
├── .gitignore                # Pliki ignorowane przez Git
└── README.md                 # Główny plik README
```

## Biblioteka komponentów UI

Aplikacja wykorzystuje zestaw reużywalnych komponentów UI, które zapewniają spójny wygląd i zachowanie w całej aplikacji:

### Podstawowe komponenty

- **Button** - uniwersalny przycisk z różnymi wariantami i stanami
- **FormField** - pole formularza z integracją Formik i walidacją
- **Card** - komponent karty do prezentacji treści
- **Section** - sekcja do grupowania treści
- **Badge** - etykiety statusów i oznaczeń
- **ListItem** - element listy do menu i wyświetlania danych

### Komponenty złożone

- **Modal** - reużywalny modal z konfigurowalnymi opcjami
- **Table** - komponent tabeli z obsługą kolumn i stanów
- **Loading** - komponent ładowania
- **EmptyState** - stan pusty dla list i ekranów

## Przepływ użytkownika

### Klient

1. **Rejestracja/Logowanie**
   - Wybór typu użytkownika (klient/producent)
   - Rejestracja lub logowanie

2. **Wprowadzanie wymiarów ciała**
   - Podanie podstawowych wymiarów (wzrost, obwód biustu, talii, bioder, długość nogawki)
   - Wybór typu sylwetki

3. **Przeglądanie produktów**
   - Lista produktów z możliwością filtrowania
   - Szczegóły produktu

4. **Konfiguracja produktu**
   - Wybór stylu, materiału i wykończenia
   - Wizualizacja wybranej konfiguracji
   - Kalkulacja ceny

5. **Składanie zamówienia**
   - Wprowadzenie danych do zamówienia
   - Potwierdzenie zamówienia

6. **Zarządzanie zamówieniami**
   - Lista zamówień
   - Szczegóły zamówienia
   - Śledzenie statusu zamówienia

### Producent

1. **Rejestracja/Logowanie**
   - Wybór typu użytkownika (klient/producent)
   - Rejestracja lub logowanie

2. **Dashboard**
   - Podsumowanie produktów i zamówień
   - Szybki dostęp do najważniejszych funkcji

3. **Zarządzanie produktami**
   - Lista produktów
   - Dodawanie nowego produktu
   - Edycja produktu
   - Szczegóły produktu

4. **Zarządzanie stylami, materiałami i wykończeniami**
   - Dodawanie stylów do produktu
   - Dodawanie materiałów do produktu
   - Dodawanie wykończeń do produktu

5. **Zarządzanie zamówieniami**
   - Lista zamówień
   - Szczegóły zamówienia
   - Aktualizacja statusu zamówienia

## API Backend

### Endpointy autoryzacji

- `POST /api/auth/register` - rejestracja nowego użytkownika
- `POST /api/auth/login` - logowanie użytkownika
- `GET /api/auth/me` - pobranie danych zalogowanego użytkownika

### Endpointy klienta

- `GET /api/products` - lista produktów
- `GET /api/products/:id` - szczegóły produktu
- `POST /api/measurements` - zapisanie wymiarów ciała
- `GET /api/measurements` - pobranie wymiarów ciała
- `POST /api/orders` - złożenie zamówienia
- `GET /api/orders` - lista zamówień
- `GET /api/orders/:id` - szczegóły zamówienia

### Endpointy producenta

- `GET /api/producer/products` - lista produktów producenta
- `POST /api/producer/products` - dodanie nowego produktu
- `PUT /api/producer/products/:id` - aktualizacja produktu
- `DELETE /api/producer/products/:id` - usunięcie produktu
- `POST /api/producer/products/:id/styles` - dodanie stylu do produktu
- `POST /api/producer/products/:id/materials` - dodanie materiału do produktu
- `POST /api/producer/products/:id/finishes` - dodanie wykończenia do produktu
- `GET /api/producer/orders` - lista zamówień producenta
- `PUT /api/producer/orders/:id/status` - aktualizacja statusu zamówienia

## Uruchomienie projektu

### Wymagania

- Node.js (v18+)
- npm lub yarn
- Docker i Docker Compose (opcjonalnie)

### Uruchomienie lokalne

1. **Backend**

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

2. **Frontend**

```bash
cd frontend
npm install
npm start
```

### Uruchomienie z Docker Compose

```bash
docker-compose up -d
```

## Najlepsze praktyki

Projekt został zaimplementowany zgodnie z najlepszymi praktykami:

1. **DRY (Don't Repeat Yourself)**
   - Wykorzystanie reużywalnych komponentów UI
   - Centralizacja stylów z Tailwind CSS
   - Abstrakcja logiki biznesowej do serwisów

2. **Reużywalność**
   - Biblioteka komponentów UI
   - Wspólne hooki i utilities
   - Modularny kod

3. **Enkapsulacja**
   - Komponenty z jasno zdefiniowanymi interfejsami
   - Izolacja logiki biznesowej od UI
   - Separacja odpowiedzialności

4. **Łatwość utrzymania**
   - Spójna struktura projektu
   - Typowanie z TypeScript
   - Dokumentacja kodu
   - Testy jednostkowe

## Dalszy rozwój

Potencjalne kierunki rozwoju projektu:

1. **Integracja z systemami producentów**
   - API do integracji z systemami ERP/CRM producentów
   - Automatyczne aktualizacje statusów zamówień

2. **Zaawansowana wizualizacja**
   - Wizualizacja 3D produktów
   - Możliwość obrotu i przybliżania modelu

3. **Rozszerzona personalizacja**
   - Dodatkowe opcje personalizacji (np. guziki, kieszenie, kołnierze)
   - Zapisywanie i udostępnianie konfiguracji

4. **Funkcje społecznościowe**
   - Oceny i recenzje produktów
   - Udostępnianie konfiguracji w mediach społecznościowych
