# Setup Production Docker Compose with Cloudflare

**Task Number:** T-012

## 1. Description

This task involves updating the production Docker Compose file to include the Cloudflare Tunnel daemon (`cloudflared`) for secure, public access to the backend service.

## 2. Acceptance Criteria

- [ ] Add a `cloudflared` service to `docker-compose.prod.yml`.
- [ ] The `cloudflared` service should connect to the `backend` service on the internal Docker network.
- [ ] The configuration should use an environment variable for the Cloudflare Tunnel token.
- [ ] The `docker-compose.prod.yml` should be ready for production deployment.

## 3. Technical Details & Implementation Notes

- **Affected Files:**
    - `docker-compose.prod.yml`
    - `backend/.env.production`
