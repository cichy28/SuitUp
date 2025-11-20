# Wdrożenie aplikacji na serwerze

Ten folder zawiera wszystko, co potrzebne do uruchomienia aplikacji na serwerze docelowym.

## Wymagania

- Na serwerze musi być zainstalowany Docker i Docker Compose.

**Struktura folderu `deploy`:**
```
deploy/
├── docker-compose.app.yml
├── docker-compose.infra.yml
├── .env.production
├── README.md  (ten plik)
├── cloudflare/
│   └── config.yml
└── backend/
    ├── _do_importu/
    └── uploads/
```

## Proces uruchomienia

Zakładając, że obrazy Docker zostały już wysłane do rejestru `ghcr.io`.

1.  **Zaloguj się do serwera** (np. przez SSH).

2.  **Skopiuj cały ten folder (`deploy`) na serwer, a następnie przejdź do niego**:
    ```bash
    cd /sciezka/do/folderu/deploy
    ```

3.  **Pobierz najnowsze obrazy z rejestru**:
    ```bash
    docker-compose -f docker-compose.app.yml -f docker-compose.infra.yml pull
    ```

4.  **Uruchom aplikację**:
    ```bash
    docker-compose -f docker-compose.app.yml -f docker-compose.infra.yml up -d
    ```
    Ta komenda uruchomi wszystkie usługi w tle. Aplikacja i tunel będą dostępne po chwili. Sieć `proxy-net` zostanie automatycznie utworzona przez `docker-compose.infra.yml`.

## Zarządzanie usługami

- Aby zatrzymać usługi: `docker-compose -f docker-compose.app.yml -f docker-compose.infra.yml down`
- Aby zaktualizować obrazy i zrestartować aplikację: `docker-compose -f docker-compose.app.yml -f docker-compose.infra.yml pull && docker-compose -f docker-compose.app.yml -f docker-compose.infra.yml up -d`
