import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { listing, report, user } from "@/db/schema";

export default async function AdminHome() {
  const db = getDb();
  const [[users], [banned], [pending], [reports]] = await Promise.all([
    db.select({ n: count() }).from(user),
    db.select({ n: count() }).from(user).where(eq(user.banned, true)),
    db.select({ n: count() }).from(listing).where(eq(listing.status, "pending")),
    db.select({ n: count() }).from(report).where(eq(report.status, "open")),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Přehled</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4"><p className="text-sm text-[var(--color-muted)]">Uživatelé</p><p className="text-2xl font-extrabold">{users.n}</p></div>
        <div className="card p-4"><p className="text-sm text-[var(--color-muted)]">Zablokovaní</p><p className="text-2xl font-extrabold">{banned.n}</p></div>
        <div className="card p-4"><p className="text-sm text-[var(--color-muted)]">Inzeráty ke schválení</p><p className="text-2xl font-extrabold"><Link href="/admin/inzeraty/" className="hover:text-[var(--color-brand)]">{pending.n}</Link></p></div>
        <div className="card p-4"><p className="text-sm text-[var(--color-muted)]">Otevřená hlášení</p><p className="text-2xl font-extrabold"><Link href="/admin/hlaseni/" className="hover:text-[var(--color-brand)]">{reports.n}</Link></p></div>
      </div>
      <p className="text-sm text-[var(--color-muted)]">
        Moderace fóra a recenzí a úpravy katalogu přibudou s dalšími kroky.{" "}
        Funguje <Link href="/admin/uzivatele/" className="text-[var(--color-brand)] hover:underline">správa uživatelů</Link>, <Link href="/admin/inzeraty/" className="text-[var(--color-brand)] hover:underline">moderace inzerátů</Link> a <Link href="/admin/hlaseni/" className="text-[var(--color-brand)] hover:underline">hlášení</Link>.
      </p>
    </div>
  );
}
