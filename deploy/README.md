# Wdrożenie Produkcyjne Aplikacji "SuitUp"

Ten folder zawiera konfigurację niezbędną do wdrożenia całej aplikacji w środowisku produkcyjnym przy użyciu Docker i Cloudflare Tunnel.

## Architektura

Konfiguracja jest modularna i składa się z trzech plików, co ułatwia zarządzanie:

1.  **`docker-compose.yml` (Główny plik orkiestrujący)**:
    *   Definiuje globalną sieć `proxy-net`, która łączy wszystkie usługi.
    *   Używa dyrektywy `include`, aby załadować konfiguracje aplikacji i infrastruktury.

2.  **`docker-compose.app.yml` (Usługi Aplikacji)**:
    *   `postgres`: Baza danych.
    *   `backend`: Serwer API Node.js.
    *   `frontend`: Serwer Nginx serwujący statyczne pliki aplikacji React.
    *   Wszystkie usługi odwołują się do zewnętrznej sieci `proxy-net`.

3.  **`docker-compose.infra.yml` (Usługi Infrastruktury)**:
    *   `cloudflared`: Kontener z Cloudflare Tunnel, który bezpiecznie wystawia aplikację do internetu.
    *   Odwołuje się do zewnętrznej sieci `proxy-net`.

Dzięki takiemu podejściu, całą aplikację można uruchomić jedną, prostą komendą, zachowując jednocześnie logiczny porządek i separację usług.

## Konfiguracja Cloudflare Tunnel (Jednorazowa)

Aby poprawnie wystawić aplikację na publicznych domenach, należy jednorazowo skonfigurować połączenie z Cloudflare.

### Krok 1: Pobranie `cloudflared` (jeśli nie masz)

```powershell
# Uruchom w PowerShell
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "deploy/cloudflare/cloudflared.exe"
```

### Krok 2: Logowanie do Cloudflare

```powershell
# Uruchom w PowerShell, będąc w głównym folderze projektu
./deploy/cloudflare/cloudflared.exe tunnel login
```
Komenda otworzy przeglądarkę. Zaloguj się i autoryzuj swoją domenę.

### Krok 3: Stworzenie "Nazwanego" Tunelu

Ta komenda generuje plik z kluczem (`.json`), niezbędny do uwierzytelnienia.

```powershell
# Uruchom w PowerShell
./deploy/cloudflare/cloudflared.exe tunnel create suitup-prod
```
Zanotuj **ID tunelu**. Plik `<ID_TUNELU>.json` zostanie zapisany w `C:\Users\TWOJA_NAZWA\.cloudflared\`.

### Krok 4: Konfiguracja Plików Projektu

1.  **Skopiuj plik `<ID_TUNELU>.json`** z `C:\Users\TWOJA_NAZWA\.cloudflared\` do folderu `deploy/cloudflare/`.
2.  Otwórz plik `deploy/cloudflare/config.yml` i upewnij się, że ID tunelu oraz nazwa pliku `.json` są poprawne.

### Krok 5: Konfiguracja DNS w Panelu Cloudflare

1.  W panelu DNS Cloudflare dodaj dwa rekordy **CNAME**:
    *   **Typ:** `CNAME`, **Nazwa:** `@`, **Cel:** `<ID_TUNELU>.cfargotunnel.com`, **Proxy:** Proxied.
    *   **Typ:** `CNAME`, **Nazwa:** `suitup`, **Cel:** `<ID_TUNELU>.cfargotunnel.com`, **Proxy:** Proxied.
2.  W panelu **Zero Trust -> Access -> Tunnels** upewnij się, że dla tunelu `suitup-prod` **nie ma skonfigurowanych żadnych "Public Hostnames"**.

## Uruchomienie Aplikacji

Po wykonaniu jednorazowej konfiguracji, możesz uruchomić całą aplikację jedną komendą z folderu `deploy`:

```bash
# Będąc w folderze /deploy
docker compose up -d --build
```

Aby zatrzymać aplikację:

```bash
# Będąc w folderze /deploy
docker compose down
```
