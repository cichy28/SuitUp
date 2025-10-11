# Expose Frontend Service

**Task Number:** T-013

## 1. Description

The frontend service is currently not accessible from the host machine. This task involves exposing the frontend service on port 80 for both development and production environments.

For development, the frontend will be directly accessible on `http://localhost:80`.

For production, the frontend will be exposed through the Cloudflare Tunnel, alongside the backend service.

## 2. Acceptance Criteria

- [ ] The `frontend` service in `docker-compose.dev.yml` should be accessible on port 80 of the host machine.
- [ ] The `cloudflared` service in `docker-compose.prod.yml` should be configured to expose both the `frontend` and `backend` services through the tunnel.

## 3. Technical Details & Implementation Notes

- **Affected Files:**
    - `docker-compose.dev.yml`
    - `docker-compose.prod.yml`
