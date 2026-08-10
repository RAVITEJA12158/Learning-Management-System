# Prisma Scaffold — Supabase Postgres + Express

## 1. Provision the Supabase Postgres database

I can't create the Supabase project for you (it needs your account), but here's exactly how:

1. Go to https://supabase.com/dashboard and create a new project (pick a region close to your app).
2. Wait for provisioning to finish (~2 min), then open **Project Settings → Database**.
3. Under **Connection string**, copy two URIs:
   - **Connection pooling** (Transaction mode, port `6543`) → this is your `DATABASE_URL`
   - **Direct connection** (port `5432`) → this is your `DIRECT_URL`
4. Set your database password (or reset it) in the same screen — it gets substituted into both URLs.

## 2. Configure environment

```bash
cp .env.example .env
```

Paste your two connection strings into `.env`. Keep `pgbouncer=true&connection_limit=1` on `DATABASE_URL` — it's required for Supabase's pooler to work correctly with Prisma.

## 3. Install & generate

```bash
npm install
npx prisma generate
```

## 4. Run the base migration

This creates the `users` and `posts` tables from `prisma/schema.prisma` directly on your Supabase DB:

```bash
npx prisma migrate dev --name init
```

(Uses `DIRECT_URL` automatically since it's set in the datasource block.)

## 5. Start the server

```bash
npm run dev      # nodemon, auto-reload
# or
npm start
```

Check the connection:

```bash
curl http://localhost:3000/health
# {"status":"ok","db":"connected"}
```

## 6. Try the API

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","name":"You"}'

curl http://localhost:3000/api/users
```

## Project layout

```
prisma/schema.prisma   → DB schema (User, Post models — extend as needed)
src/lib/prisma.js      → Prisma client singleton
src/routes/user.routes.js → example CRUD routes
src/index.js           → Express app entry point + /health check
.env.example            → connection string template
```

## Notes

- `prisma migrate dev` is for local/dev use. In production/CI, use `npm run prisma:deploy` (`prisma migrate deploy`) instead — it doesn't try to create shadow databases.
- Supabase's pooler (port 6543) doesn't support prepared statements well for long-lived connections outside serverless — that's why migrations use the direct URL (5432) instead.
- To browse data visually: `npx prisma studio`.
