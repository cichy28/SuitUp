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

## 5. Post-Task Workflow

After completing a task, the following verification steps should be performed:

1.  **Run Backend:** Execute `npm run dev` in the `backend/` directory to start the backend server in debug mode.
2.  **Run Frontend:** Execute `npm run web` in the `frontend/` directory to launch the web version of the application.
3.  **Verify & Fix:** If any errors occur during startup or testing, I will attempt to fix them.
4.  **Clarification:** If any part of the task is unclear, I will ask for clarification.
5.  **Proposals:** If I propose a change to the codebase, I will first explain what I'm doing and why.
