# Wdrożenie aplikacji na serwerze

Ten folder zawiera wszystko, co potrzebne do uruchomienia aplikacji na serwerze docelowym (np. NAS).

## Wymagania

Ten folder jest samowystarczalny. Zawiera wszystko, co potrzebne do uruchomienia aplikacji.

**Struktura folderu `deploy`:**
```
deploy/
├── docker-compose.yml
├── .env.production
├── README.md  (ten plik)
├── cloudflare/
│   └── config.yml
└── backend/
    ├── _do_importu/
    └── uploads/
```

-   **`.env.production`**: Plik z zmiennymi środowiskowymi dla produkcji (sekrety, konfiguracja bazy danych, itp.).
-   **`cloudflare/config.yml`**: Plik konfiguracyjny dla Cloudflare Tunnel.
-   **`backend/_do_importu/`**: Folder na dane do importu. Musi istnieć, nawet jeśli jest pusty.
-   **`backend/uploads/`**: Folder na wgrane pliki. Musi istnieć, nawet jeśli jest pusty.

## Proces uruchomienia

Zakładając, że obrazy Docker zostały już wysłane do rejestru `ghcr.io` (za pomocą komendy `npm run deploy` na maszynie deweloperskiej).

1.  **Zaloguj się do serwera** (np. przez SSH).

2.  **Skopiuj cały ten folder (`deploy`) na serwer, a następnie przejdź do niego**:
    ```bash
    cd /sciezka/do/folderu/deploy
    ```

3.  **Pobierz najnowsze obrazy z rejestru**:
    ```bash
    docker-compose pull
    ```
    Ta komenda pobierze obrazy zdefiniowane w `docker-compose.yml` z `ghcr.io`.

4.  **Uruchom aplikację**:
    ```bash
    docker-compose up -d
    ```
    Ta komenda uruchomi wszystkie usługi w tle.
