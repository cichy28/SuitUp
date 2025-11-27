# Gemini Project Configuration

This document provides context for the Gemini AI assistant to understand and effectively assist with this project.

## 1. Project Overview

This is a full-stack application for a suit/clothing service. It consists of a React Native (Expo) frontend, a Node.js (Express) backend, and a shared library for common code. The application is designed to be run with Docker, using a local PostgreSQL database for development and production.

- **Frontend:** `frontend/` - A mobile application built with React Native and Expo.
- **Backend:** `backend/` - A Node.js API server using Express.js and Prisma for database interaction.
- **Shared:** `shared/` - A TypeScript library for code shared between the frontend and backend (e.g., enums, validators).

## 2. Tech Stack

- **Operating system** Windows 11
- **Language:** TypeScript
- **Frontend:**
  - Framework: React Native with Expo
  - Navigation: React Navigation
  - Styling: Likely custom components, potentially with some constants in `frontend/src/constants`.
- **Backend:**
  - Runtime: Node.js
  - Framework: Express.js
  - ORM: Prisma
  - Database: PostgreSQL (managed by Docker Compose)
- **Validation:** `zod` is used for all data validation in the `shared/validators/` directory.
- **Package Manager:** `npm` is used across the monorepo.

## 3. Project Structure & Key Files

- `C:/Users/JanCichosz/Downloads/suit-app/`: The project root.
- `C:/Users/JanCichosz/Downloads/suit-app/backend/`: Contains the backend server code.
  - `src/`: Source code for the backend.
  - `prisma/`: Prisma schema, migrations, and seed scripts.
  - `scripts/mass-import.ts`: A utility script for bulk-importing images and data from the `_do_importu` directory into the database.
  - `scripts/generate-companies-data.ts`: A utility script for generating dummy data and images into the `_do_importu` directory for testing and development purposes.
- `C:/Users/JanCichosz/Downloads/suit-app/frontend/`: Contains the frontend mobile app code.
  - `src/`: Source code for the frontend app.
- `C:/Users/JanCichosz/Downloads/suit-app/shared/`: Shared TypeScript code.
  - `validators/`: Contains `zod` validation schemas.
- `C:/Users/JanCichosz/Downloads/suit-app/_do_importu/`: This folder is used for staging data and images to be imported into the database and application.
- `C:/Users/JanCichosz/Downloads/suit-app/uploads/`: This folder stores images that have been imported and are used by the application. File names in this folder should correspond to entries in the database.

## 4. Local Development with Docker

To run the application in a local development environment using Docker, follow these steps:

1.  **Start the services:**
    ```bash
    docker-compose up --build -d
    ```
2.  The application will be available at:
    - **Frontend:** `http://localhost:80`
    - **Backend API:** `http://localhost:3001`
    - **Adminer (Database GUI):** `http://localhost:8080`

## 5. Development Workflow & Conventions

- **Code Style:** Adhere to the existing TypeScript and Prettier/ESLint configurations.
- **Validation:** All new data validation logic should use `zod` and be placed in the `shared/validators/` directory.
- **API Routes:** Backend routes are defined in `backend/src/routes/` and linked to controllers in `backend/src/controllers/`.
- **Database:** Database schema is managed by Prisma migrations.

## 6. Database Management (Development)

The recommended way to reset the database and import data is to use the `import:api` script. This triggers a process inside the running backend container that correctly handles the entire reset, migration, and import flow.

**From your local machine (in the project root), run:**
```bash
npm run import:api --workspace=backend
```
This process runs in the background. You can monitor its progress by checking the container logs:
```bash
docker-compose logs -f backend
```

## 7. Common Pitfalls & Solutions

-   **Problem 1: `canvas` dependency:** The `canvas` package causes significant installation issues on Windows due to its native dependencies. It's only used by a non-essential development script (`generate-companies-data.ts`).
    -   **Solution:** `canvas` was removed from `package.json` dependencies. The script was modified to use a placeholder image instead of generating one, allowing the project to build successfully.
-   **Problem 2: `prisma migrate` context:** Running `prisma` commands that need a database connection (like `migrate`, `reset`) from the host machine fails because the hostname `postgres` is only resolvable within the Docker network.
    -   **Solution:** All such commands must be executed *inside* the backend container using `docker-compose exec backend <command>`.
-   **Problem 3: Corrupted Migrations:** The `migrations` folder can get into a broken state (e.g., empty migration subfolder), causing `prisma migrate reset` to fail with error `P3015`.
    -   **Solution:** The corrupted `migrations` directory was deleted, and a new initial migration was created using `docker-compose exec backend npm run prisma:migrate:dev -- --name <name>`.
-   **Problem 4: Flawed `import:api` script:** The original `/api/admin/import-data` endpoint was buggy. It ran `prisma migrate reset` but did not run `prisma migrate dev` afterwards, leading to a database with no tables.
    -   **Solution:** The endpoint in `backend/src/routes/admin.ts` was fixed to include the `prisma migrate dev` step, ensuring a correct database setup.

## 8. Correct Development Workflow Summary:
1.  **Start:** `docker-compose up -d --build`
2.  **Reset/Import:** `npm run import:api --workspace=backend` (from host)
3.  **Manual Migrations:** `docker-compose exec backend npm run prisma:migrate:dev -- --name <name>`