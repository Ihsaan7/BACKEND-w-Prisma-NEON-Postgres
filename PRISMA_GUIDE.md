# Prisma - Simple Guide & Cheatsheet

## What is Prisma?

Prisma is an **ORM** (Object-Relational Mapping) — it lets you talk to your database using JavaScript instead of writing raw SQL.

**Without Prisma (raw SQL):**

```sql
INSERT INTO "User" (name, email, password) VALUES ('John', 'john@mail.com', '123');
```

**With Prisma:**

```javascript
await prisma.user.create({
  data: { name: "John", email: "john@mail.com", password: "123" },
});
```

---

## Key Files

| File | Purpose |
| --- | --- |
| `schema.prisma` | Your blueprint — define your tables (models) here |
| `.env` | Stores your `DATABASE_URL` (address + password to your DB). **Never commit to git** |
| `prisma.config.ts` | Tells Prisma CLI where to find the database URL (reads from `.env`) |
| `db.js` | Where your app connects to the database at runtime using `PrismaClient` |

---

## Prisma Studio

`npx prisma studio` runs a **local web app** (usually `localhost:5555`) to visually browse/edit your database — like phpMyAdmin. Your actual database is still remote. The localhost part is just the UI running on your computer.

---

## The Workflow (Step by Step)

1. **Define your model** in `schema.prisma`
2. **Push it** → `npx prisma db push` (creates/updates tables in DB)
3. **Generate the client** → `npx prisma generate` (updates JS code so PrismaClient knows your models)
4. **Use it in your code** → `prisma.user.create(...)`, `prisma.user.findMany()`, etc.

> Every time you change your schema (add a field, add a model), repeat steps 2 and 3.

---

## Common Prisma Commands

```bash
# Push schema changes to database
npx prisma db push

# Generate/regenerate Prisma Client
npx prisma generate

# Open visual database editor
npx prisma studio

# Create a new Prisma Postgres database
npx prisma init --db

# Create a migration (for production workflows)
npx prisma migrate dev
```

---

## Common Prisma Queries

```javascript
// Create a record
await prisma.user.create({
  data: { name: "John", email: "john@mail.com", password: "123" },
});

// Find all records
const users = await prisma.user.findMany();

// Find one by unique field
const user = await prisma.user.findUnique({ where: { email: "john@mail.com" } });

// Update a record
await prisma.user.update({
  where: { id: "some-id" },
  data: { name: "Updated Name" },
});

// Delete a record
await prisma.user.delete({ where: { id: "some-id" } });
```

---

## Prisma v7 Setup (JavaScript Project)

### schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```

> Use `prisma-client-js` (NOT `prisma-client`) for JavaScript projects.

### db.js (connection file)

```javascript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

> Prisma v7 requires a driver adapter — it no longer reads the DB URL from the schema file.

### Required packages

```bash
npm install @prisma/client @prisma/adapter-pg pg
npm install -D prisma
```

### package.json must have

```json
"type": "module"
```

---

## Troubleshooting

### Error: P1001 - Can't reach database server

Your database is down or expired. Fix:

1. Go to [console.prisma.io](https://console.prisma.io) to check
2. If expired, create a new one: `npx prisma init --db`
3. Update `DATABASE_URL` in `.env` with the new URL
4. Run `npx prisma db push` to recreate tables

### No tables showing in Prisma Studio

You defined models in `schema.prisma` but didn't push them. Run:

```bash
npx prisma db push
```

### SyntaxError: Cannot use import statement

Your `package.json` is missing `"type": "module"`. Add it.

### Error: Cannot find module '.prisma/client/default'

Wrong generator. Change `provider = "prisma-client"` to `provider = "prisma-client-js"` in `schema.prisma`, then run `npx prisma generate`.

---

## Quick Checklist (Before Running Your App)

- [ ] `.env` has a valid `DATABASE_URL`
- [ ] `schema.prisma` uses `provider = "prisma-client-js"`
- [ ] `package.json` has `"type": "module"`
- [ ] `db.js` uses `PrismaPg` adapter with the connection string
- [ ] Ran `npx prisma db push` after schema changes
- [ ] Ran `npx prisma generate` after schema changes
