# Refine Development Environment

**Task Number:** T-014

## 1. Description

This task involves refining the development environment to improve the developer experience. The goal is to have a setup where the entire project repository is mounted into the development containers, and changes in the source code automatically trigger a restart of the application (hot-reloading) for both frontend and backend.

## 2. Acceptance Criteria

- [ ] The entire project repository should be mounted into the `backend` and `frontend` development containers.
- [ ] The `backend` service should automatically restart when source code changes are detected.
- [ ] The `frontend` service should use a development server (e.g., Expo dev server) and support hot-reloading.
- [ ] A `Dockerfile.dev` should be created for the `frontend` service to support the development workflow.
- [ ] The development environment should be started with a single `docker-compose up` command.

## 3. Technical Details & Implementation Notes

- **Affected Files:**
    - `docker-compose.dev.yml`
    - `frontend/Dockerfile.dev` (new file)
    - `frontend/package.json` (to check dev scripts)
