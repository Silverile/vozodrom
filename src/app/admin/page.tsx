import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { user } from "@/db/schema";

export default async function AdminHome() {
  const db = getDb();
  const [[users], [banned]] = await Promise.all([
    db.select({ n: count() }).from(user),
    db.select({ n: count() }).from(user).where(eq(user.banned, true)),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Přehled</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4"><p className="text-sm text-[var(--color-muted)]">Uživatelé</p><p className="text-2xl font-extrabold">{users.n}</p></div>
        <div className="card p-4"><p className="text-sm text-[var(--color-muted)]">Zablokovaní</p><p className="text-2xl font-extrabold">{banned.n}</p></div>
        <div className="card p-4"><p className="text-sm text-[var(--color-muted)]">Inzeráty ke schválení</p><p className="text-2xl font-extrabold">—</p></div>
      </div>
      <p className="text-sm text-[var(--color-muted)]">
        Moderace inzerátů, hlášení podle DSA, fóra a recenzí a úpravy katalogu přibudou s dalšími kroky.{" "}
        <Link href="/admin/uzivatele/" className="text-[var(--color-brand)] hover:underline">Správa uživatelů</Link> už funguje.
      </p>
    </div>
  );
}
