# Local Development Setup

This section describes how to set up and run the application for local development using Docker.

## Starting the Environment

To start all services (backend, frontend, database) for local development, run the following command from the project root:

```bash
docker-compose up -d --build
```
* `--build` forces a rebuild of the images if there are changes in the Dockerfile or source code.
* `-d` runs the containers in detached mode (in the background).

The services will be available at:
- **Frontend:** `http://localhost:80`
- **Backend API:** `http://localhost:3001`
- **Adminer (Database GUI):** `http://localhost:8080`

## Database Management

The development database can be reset and re-populated with initial data from the `_do_importu` directory.

### Recommended Method: Using the Import API

The easiest and recommended way to reset the database and import data is to use the `import:api` script. This triggers a process inside the running backend container that correctly handles the entire reset, migration, and import flow.

From your local machine (in the project root), run:
```bash
npm run import:api --workspace=backend
```
This process runs in the background. You can monitor its progress by checking the container logs:
```bash
docker-compose logs -f backend
```

### Manual Database Operations

If you need to perform manual database operations, such as creating a new migration after changing `schema.prisma`, you **must** run the command inside the backend container. Running it on your local machine will fail because it won't be able to connect to the database.

**Example: Creating a new migration**
```bash
docker-compose exec backend npm run prisma:migrate:dev -- --name your-migration-name
```

---

# Wdrożenie aplikacji w Dockerze

Ten dokument zawiera instrukcje dotyczące budowania, wypychania (push) obrazów Docker oraz wdrażania aplikacji na serwerze NAS.

## Krok 1: Konfiguracja GitHub Personal Access Token (PAT) i logowanie do rejestru

Aby zbudować i wypchnąć obrazy Docker do GitHub Container Registry (GHCR), potrzebujesz tokena PAT.

### Jak zdobyć Personal Access Token (PAT):

1.  **Zaloguj się na swoje konto na [GitHub.com](https://github.com).**
2.  **Przejdź do Ustawień (Settings):** Kliknij na swoje zdjęcie profilowe w prawym górnym rogu i wybierz `Settings`.
3.  **Przejdź do Ustawień Deweloperskich (Developer settings):** W menu po lewej stronie znajdź i kliknij `Developer settings`.
4.  **Przejdź do Personal Access Tokens:** W menu po lewej stronie wybierz `Personal access tokens`, a następnie `Tokens (classic)`.
5.  **Wygeneruj nowy token:** Kliknij przycisk `Generate new token`.
6.  **Skonfiguruj token:**
    *   **Note (Nazwa):** Wpisz nazwę, np. `Docker Deploy`.
    *   **Expiration (Ważność):** Ustaw okres ważności tokena.
    *   **Select scopes (Wybierz uprawnienia):** Zaznacz pole przy `write:packages`. Jest to kluczowe uprawnienie.
7.  **Wygeneruj i skopiuj token:** Kliknij `Generate token`. **Skopiuj token od razu, nie będzie już ponownie widoczny.**

### Logowanie do rejestru Docker (na swoim komputerze deweloperskim):

1.  **Otwórz terminal PowerShell** w katalogu głównym projektu.
2.  **Ustaw zmienną środowiskową `GITHUB_TOKEN`** (zastąp `TWOJ_TOKEN_PAT` swoim tokenem):
    ```powershell
    $env:GITHUB_TOKEN="TWOJ_TOKEN_PAT"
    ```
    Ta zmienna będzie aktywna tylko w tej sesji terminala.
3.  **Zaloguj się do rejestru za pomocą skryptu:**
    ```bash
    npm run docker:login
    ```
    Podczas uruchamiania tego skryptu, wartość zmiennej `$env:GITHUB_TOKEN` zostanie automatycznie przekazana jako hasło do komendy `docker login`. Powinieneś zobaczyć komunikat `Login Succeeded`.

## Krok 2: Budowanie i wypychanie obrazów Docker

Po zalogowaniu możesz użyć skryptu `deploy` z pliku `package.json`, aby zbudować oba obrazy (`backend` i `frontend`) i wypchnąć je do GitHub Container Registry.

**W terminalu (PowerShell, po ustawieniu tokena):**
```bash
npm run deploy
```

## Krok 3: Wdrożenie na serwerze NAS

1.  **Skopiuj niezbędne pliki na NAS:**
    Upewnij się, że następujące foldery i pliki są na Twoim NAS-ie w odpowiednich lokalizacjach:
    *   `deploy/` (zawierający `docker-compose.yml` i `.env.production`)
    *   `cloudflare/` (zawierający `config.yml`)
    *   Puste foldery `backend/_do_importu/` i `backend/uploads/` (muszą istnieć na NAS-ie, aby kontener je zamontował).

2.  **Połącz się z NAS-em przez SSH.**

3.  **Przejdź do katalogu `deploy` na NAS-ie:**
    ```bash
    cd /sciezka/do/folderu/deploy/na_nas
    ```
    (Zastąp `/sciezka/do/folderu/deploy/na_nas` rzeczywistą ścieżką).

4.  **Pobierz najnowsze obrazy i uruchom aplikację:**
    ```bash
    docker-compose pull
    docker-compose up -d
    ```
    Komenda `pull` pobierze najnowsze obrazy Docker z GHCR. `up -d` uruchomi usługi w tle. 

## Krok 4: Uruchamianie skryptu importu danych (opcjonalnie)

Jeśli chcesz zaimportować dane za pomocą skryptu `mass-import.ts`:

1.  Upewnij się, że pliki do importu znajdują się w folderze `backend/_do_importu` na Twoim NAS-ie.
2.  Uruchom komendę (połączony przez SSH z NAS-em, w folderze głównym projektu):
    ```bash
    docker-compose --env-file deploy/.env.production -f deploy/docker-compose.yml exec backend npm run import-images:docker
    ```
