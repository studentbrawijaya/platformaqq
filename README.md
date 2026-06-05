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

## Deploy Frontend ke Vercel

> Repo ini monorepo. Yang di-deploy ke Vercel adalah `apps/frontend`.

1. Buat project baru di Vercel dari repository ini.
2. Atur **Root Directory** ke `apps/frontend`.
3. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` = URL backend publik + `/api/v1` (contoh: `https://api.domainkamu.com/api/v1`)
   - `NEXT_PUBLIC_SOCKET_URL` = URL backend publik (contoh: `https://api.domainkamu.com`)
4. Deploy.

Untuk backend, pastikan `FRONTEND_URL` di environment backend diisi domain frontend Vercel agar CORS mengizinkan request dari frontend produksi.
