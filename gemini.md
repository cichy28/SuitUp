# Gemini Project Configuration

This document provides context for the Gemini AI assistant to understand and effectively assist with this project.

## 1. Project Overview

This is a full-stack application for a suit/clothing service. It consists of a React Native (Expo) frontend, a Node.js (Express) backend, and a shared library for common code.

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
  - Database: PostgreSQL (inferred from `docker-compose.yml` and Prisma setup)
- **Validation:** `zod` is used for all data validation in the `shared/validators` directory.
- **Package Manager:** `npm` is used across the monorepo.

## 3. Project Structure & Key Files

- `C:/Users/JanCichosz/Downloads/suit-app/`: The project root.
- `C:/Users/JanCichosz/Downloads/suit-app/backend/`: Contains the backend server code.
  - `.env.development`, `.env.production`: Environment variables for development and production. During testing, both files contain identical environment variables, pointing to the external Supabase database. For production deployment, these files will be updated with new machine URLs.
  - `src/`: Source code for the backend.
  - `prisma/`: Prisma schema, migrations, and seed scripts.
  - `scripts/seed.ts`: A script to populate the database with dummy data for testing and development.
  - `scripts/mass-import-images.ts`: A utility script for bulk-importing images into the database.
- `C:/Users/JanCichosz/Downloads/suit-app/frontend/`: Contains the frontend mobile app code.
  - `src/`: Source code for the frontend app.
  - `screens/`: Application screens.
  - `components/`: Reusable UI components.
  - `navigation/`: Navigation setup.
- `C:/Users/JanCichosz/Downloads/suit-app/frontendDesigns/`: Contains the original design mockups and images that inspired the application's UI/UX.
- `C:/Users/JanCichosz/Downloads/suit-app/shared/`: Shared TypeScript code.
  - `validators/`: Contains `zod` validation schemas.
  - `enums.ts`: Contains shared enumerations.

## 4. Development Workflow & Conventions

- **Task Management:** Tasks are defined in `.md` files within the `tasks/` directory, following `TEMPLATE.md`.
- **Commits:** Commits should be linked to a task number (e.g., "feat(T-123): Implement user authentication").
- **Code Style:** Adhere to the existing TypeScript and Prettier/ESLint configurations.
- **Coding Principles:**
  - **DRY (Don't Repeat Yourself):** Avoid code duplication.
  - **Encapsulation:** Group related data and functions.
  - **Reusability:** Write modular and reusable code.
- **Validation:** All new data validation logic should use `zod` and be placed in the `shared/validators/` directory.
- **API Routes:** Backend routes are defined in `backend/src/routes/` and linked to controllers in `backend/src/controllers/`.
- **Database:** Database schema is managed by Prisma migrations. Changes should be made in `backend/prisma/schema.prisma` and migrated using `npx prisma migrate dev`.

## 5. Database Interaction

To directly query the database using Prisma, you can use the `query-db.ts` script located in `backend/scripts/`.

**Usage:**

1. Create a file named `query.sql` in the `backend/scripts/` directory.
2. Write your SQL query inside `backend/scripts/query.sql`.
3. Navigate to the `backend/` directory in your terminal.
4. Run the script:

```bash
npx cross-env ts-node scripts/query-db.ts
```

**Example:**

To retrieve the `id`, `url`, and `fileType` of the first 5 multimedia entries, first create `backend/scripts/query.sql` with the following content:

```sql
SELECT id, url, "fileType" FROM "Multimedia" LIMIT 5;
```

Then, run the script as shown in the usage section. This script will output the query result in JSON format.