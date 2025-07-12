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
  - `scripts/mass-import.ts`: A utility script for bulk-importing images and data from the `_do_importu` directory into the database.
  - `scripts/generate-companies-data.ts`: A utility script for generating dummy data and images into the `_do_importu` directory for testing and development purposes.
- `C:/Users/JanCichosz/Downloads/suit-app/frontend/`: Contains the frontend mobile app code.
  - `src/`: Source code for the frontend app.
  - `screens/`: Application screens.
  - `components/`: Reusable UI components.
  - `navigation/`: Navigation setup.
- `C:/Users/JanCichosz/Downloads/suit-app/frontendDesigns/`: Contains the original design mockups and images that inspired the application's UI/UX.
- `C:/Users/JanCichosz/Downloads/suit-app/shared/`: Shared TypeScript code.
  - `validators/`: Contains `zod` validation schemas.
  - `enums.ts`: Contains shared enumerations.
- `C:/Users/JanCichosz/Downloads/suit-app/_do_importu/`: This folder is used for staging data and images to be imported into the database and application.
  - The structure within this folder represents the data to be imported:
    - `_do_importu/{company_name}/{product_name}/`: Base directory for a product.
      - `product_metadata.json`: Contains product parameters to be imported.
      - `WARIANTY/`: (Corresponds to `variants/`) Contains images representing individual product SKUs.
      - `WLASCIWOSCI/`: (Corresponds to `properties/`) Contains subfolders for each property, e.g., `WLASCIWOSCI/{property_name}/`.
        - `WLASCIWOSCI/{property_name}/{variant_name}.jpg`: Image files representing property variants.
- `C:/Users/JanCichosz/Downloads/suit-app/uploads/`: This folder stores images that have been imported and are used by the application. File names in this folder should correspond to entries in the database.

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

## 6. Database Management (Development)

During development, it's safe and often necessary to clear and re-import all data to ensure consistency, especially when making schema changes or dealing with data inconsistencies. This process will reset your development database to a clean state and re-populate it with initial data.

**Important:** This process is intended for development environments only and should **never** be used on a production database as it will result in data loss.

To clear and re-import all data:

1.  **Reset the database:** This command will drop all data and reset your Prisma migrations.
    ```bash
    npm run prisma:reset --workspace=backend
    ```
    _Note: On Windows, you might encounter an `EPERM` error during this step. This usually indicates a file permission issue with the Prisma client. It often does not prevent the command from succeeding, and you can proceed to the next step._
2.  **Apply migrations:** This will re-apply the latest database schema.
    ```bash
    npm run prisma:migrate:dev --workspace=backend
    ```
    _Note: Similar to `prisma:reset`, an `EPERM` error might occur on Windows but typically does not hinder the migration process._
3.  **Import initial data:** This will import data from the `_do_importu` directory.
    ```bash
    npm run import-images --workspace=backend
    ```

## 7. Reviewing Code Changes

To review all the changes made to the codebase since the last commit (a relatively stable version), you can use the following Git command. This is useful for understanding what has been modified and can help in diagnosing issues if something goes wrong.

This command will show you all the additions and deletions to the tracked files in your project.

```bash
git diff HEAD
```

**Note:** This command is safe to use as it only displays the changes and does not modify the repository's history in any way.
