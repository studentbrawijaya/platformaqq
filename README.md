# EduPath Monorepo

Monorepo platform bimbingan belajar online **EduPath** untuk persiapan SNBT dan SKD.

## Struktur

- `apps/backend` - NestJS API (port 3000)
- `apps/frontend` - Next.js App Router (port 3001)
- `services/ai-service` - FastAPI AI service (port 8000)

## Setup Development

1. Salin env:
   ```bash
   cp .env.example .env
   ```
2. Install dependency root workspace:
   ```bash
   npm install
   ```
3. Jalankan service infra + app:
   ```bash
   docker compose up --build
   ```

## Menjalankan Seed

```bash
npm run seed -w apps/backend
```

Seed membuat subject, skill, dan akun development saat `NODE_ENV=development`.

## Menjalankan Test

```bash
npm run test -w apps/backend
pytest services/ai-service/tests
```

## CI

Workflow CI ada di `.github/workflows/ci.yml` dan menjalankan lint, test, build untuk backend, frontend, dan ai-service.
