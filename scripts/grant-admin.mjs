// Gives an existing account the admin role (the first admin cannot be appointed from the UI).
//   npm run admin:grant -- someone@example.com            local PGlite database
//   DATABASE_URL=postgres://… npm run admin:grant -- …    Neon (direct connection string)
import pg from "pg";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run admin:grant -- <email>");
  process.exit(1);
}

const client = new pg.Client(process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5433/postgres");
await client.connect();
const { rowCount } = await client.query(`update "user" set role = 'admin', updated_at = now() where lower(email) = lower($1)`, [email]);
await client.end();
console.log(rowCount ? `${email} is now an admin.` : `No account with e-mail ${email}.`);
process.exit(rowCount ? 0 : 1);
