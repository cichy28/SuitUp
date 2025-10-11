# Switch to Local PostgreSQL

**Task Number:** T-011

## 1. Description

This task involves migrating the application from Supabase to a local PostgreSQL database managed by Docker Compose for both development and production environments. This change will give us more control over the database and simplify the local development setup.

## 2. Acceptance Criteria

- [ ] Update `.env.development` and `.env.production` to use the local PostgreSQL container.
- [ ] Ensure the `backend` service in `docker-compose.dev.yml` and `docker-compose.prod.yml` correctly connects to the `postgres` service.
- [ ] Verify that the application, including scripts like `mass-import.ts`, works correctly with the new database setup.

## 3. Technical Details & Implementation Notes

- **Affected Files:**
    - `backend/.env.development`
    - `backend/.env.production`
