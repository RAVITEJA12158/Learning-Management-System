# LMS backend

This directory contains the Express REST API and Prisma database layer for the Learning Management System. The API listens on port `5000` by default; the Vite frontend runs separately and proxies `/api` requests to it.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and `ADMIN_SECRET_CODE`. Configure the Cloudinary values to enable uploads.
3. Generate Prisma Client and apply migrations:

   ```sh
   npm run prisma:generate
   npm run prisma:migrate
   ```

   For an existing deployment, use `npm run prisma:deploy` to apply checked-in migrations without creating a development shadow database.
4. Start the API with `npm run dev` during development or `npm start` in production.

The health endpoint is `GET /health`. It checks the PostgreSQL connection. API routes are mounted under `/api`; see the root [project README](../README.md) for the endpoint overview.

## Environment

- `DATABASE_URL`: application connection string, typically the pooled PostgreSQL URL.
- `DIRECT_URL`: direct PostgreSQL connection used by Prisma migrations.
- `PORT`: API port (defaults to `5000`).
- `FRONTEND_ORIGINS`: comma-separated browser origins allowed by CORS. Local ports `3000` and `5173` are always allowed.
- `JWT_SECRET` and optional `JWT_EXPIRES_IN`: JWT signing key and lifetime.
- `ADMIN_SECRET_CODE`: required by admin login.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: media uploads.

Keep `.env` out of source control and use a strong, unique JWT secret outside local development.

## Checks

```sh
npm test -- --runInBand
npx prisma validate
```

Prisma models and migration history are in `prisma/`. Controllers, middleware, route registration, and server startup are in `src/`.
