// Creates an e-mail/password account with the admin role, already verified, straight in the
// database. Needed while sign-up is closed (no mail provider yet). The password is asked for
// interactively and never appears in the shell history.
//   npm run admin:create -- someone@example.com "Jméno"            local PGlite database
//   DATABASE_URL=postgres://… npm run admin:create -- …            Neon (direct connection string)
import { generateRandomString, hashPassword } from "better-auth/crypto";
import pg from "pg";
import readline from "node:readline";

const [email, name = email?.split("@")[0]] = process.argv.slice(2);
if (!email || !email.includes("@")) {
  console.error('Usage: npm run admin:create -- <email> ["Name"]');
  process.exit(1);
}

// One readline for both prompts; typed characters are not echoed.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let muted = false;
rl._writeToOutput = (s) => {
  if (!muted) rl.output.write(s);
  else if (s.includes("\n") || s.includes("\r")) rl.output.write("\n");
};
// Reading lines from one iterator also works when the input is piped (both lines arrive at once).
const lines = rl[Symbol.asyncIterator]();
const askHidden = async (question) => {
  muted = false;
  rl.output.write(question);
  muted = true;
  return (await lines.next()).value ?? "";
};

const password = await askHidden("Heslo (alespoň 10 znaků): ");
const again = await askHidden("Heslo znovu: ");
rl.close();
if (password.length < 10) {
  console.error("Heslo je kratší než 10 znaků.");
  process.exit(1);
}
if (again !== password) {
  console.error("Hesla se neshodují.");
  process.exit(1);
}

const client = new pg.Client(process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5433/postgres");
await client.connect();
try {
  await client.query("begin");
  const existing = await client.query(`select id from "user" where lower(email) = lower($1)`, [email]);
  if (existing.rowCount) throw new Error(`Účet ${email} už existuje; roli změňte přes npm run admin:grant.`);
  // Same shape as a Better Auth sign-up: the user row plus a "credential" account holding the hash.
  const userId = generateRandomString(32);
  await client.query(
    `insert into "user" (id, name, email, email_verified, role) values ($1, $2, lower($3), true, 'admin')`,
    [userId, name, email],
  );
  await client.query(
    `insert into account (id, account_id, provider_id, user_id, password) values ($1, $2, 'credential', $2, $3)`,
    [generateRandomString(32), userId, await hashPassword(password)],
  );
  await client.query("commit");
  console.log(`Administrátor ${email} vytvořen.`);
} catch (error) {
  await client.query("rollback");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
