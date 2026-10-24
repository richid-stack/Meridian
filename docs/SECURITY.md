# Security

- Passwords: argon2id. Access tokens short-lived, refresh tokens rotated and stored hashed (`Session`).
- All routes authenticated unless `@Public()`. RBAC by `Role`.
- Rate limiting per IP and per user; stricter on auth and money routes.
- Uploads: presigned URLs, MIME and size checks, malware scan job, never served from the API origin.
- Secrets only via env/secret manager. Logs redact auth headers and cookies.
- Webhooks (payments, KYC): signature verified, replay-protected, idempotent.
- Audit log for claims, role changes, moderation, money events.
- Dependency and container scanning in CI. Threat model to be written before launch.
