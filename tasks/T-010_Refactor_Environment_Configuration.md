# Refactor Backend Environment Configuration

**Task Number:** T-010

## 1. Description

The current backend environment configuration uses five different `.env` files, which is overly complex. This task aims to simplify the setup to just two files: one for production and one for development. The development setup should support a hot-reload workflow where code changes on the host machine are immediately reflected in the running Docker container.

As part of this refactoring, the Nginx reverse proxy will be removed from the Docker Compose setup, as traffic will be managed by Cloudflare Zero Trust Tunnels.

## 2. Acceptance Criteria

- [x] Reduce the number of `.env` files in the `backend/` directory to two: `.env.production` and `.env.development`.
- [x] The `docker-compose.dev.yml` file should be configured to use `.env.development`.
- [x] The development container should mount the local `backend/src` directory.
- [x] The development container should use a tool like `ts-node-dev` or `nodemon` to automatically restart the server when file changes are detected in the mounted volume.
- [x] The production setup (`docker-compose.prod.yml`) should use the `.env.production` file and run an optimized version of the application.
- [x] Remove the Nginx service from `docker-compose.dev.yml` and `docker-compose.prod.yml`.
- [x] Expose the backend port directly in the Docker Compose files.

## 3. Technical Details & Implementation Notes

- **Affected Files:**
    - `backend/.env.development`
    - `backend/.env.production`
    - `docker-compose.dev.yml`
    - `docker-compose.prod.yml`
    - `backend/package.json`

## 4. Gemini Analysis

(This section is for Gemini to analyze the task and propose a plan.)

### Plan:

1.  Consolidate and remove redundant `.env` files.
2.  Update `docker-compose.dev.yml` to mount the source code and use a hot-reload script.
3.  Modify `backend/package.json` to add a `dev` script for hot-reloading.
4.  Adjust `docker-compose.prod.yml` to ensure it uses the streamlined production environment.
5.  Remove Nginx from both `docker-compose.dev.yml` and `docker-compose.prod.yml`.
6.  Expose the backend port in the Docker Compose files.