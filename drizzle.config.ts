import { defineConfig } from "drizzle-kit";

// Migrations are generated from src/db/schema.ts into ./drizzle and applied with `npm run db:migrate`.
// Locally DATABASE_URL defaults to the PGlite server from `npm run db:local`; for Neon pass its
// direct (non-pooled) connection string: DATABASE_URL=… npm run db:migrate
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5433/postgres" },
});
