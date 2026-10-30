import { count, desc, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { UserActions } from "./UserActions";

export const metadata: Metadata = { title: "Uživatelé" };

const PAGE_SIZE = 50;

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; strana?: string }> }) {
  const session = await getSession();
  if (session?.user.role !== "admin") notFound();

  const { q = "", strana } = await searchParams;
  const page = Math.max(1, Number(strana) || 1);
  const term = q.trim();
  // Escape LIKE wildcards so a search for "a_b" matches literally.
  const where = term ? or(ilike(user.email, `%${term.replace(/[\\%_]/g, "\\$&")}%`), ilike(user.name, `%${term.replace(/[\\%_]/g, "\\$&")}%`)) : undefined;

  const db = getDb();
  const [rows, [{ n: total }]] = await Promise.all([
    db.select().from(user).where(where).orderBy(desc(user.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(user).where(where),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const link = (p: number) => `/admin/uzivatele/?${new URLSearchParams({ ...(term && { q: term }), ...(p > 1 && { strana: String(p) }) })}`;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Uživatelé <span className="text-[var(--color-muted)] text-lg font-normal">{total}</span></h1>
      <form className="flex gap-2" action="/admin/uzivatele/">
        <input className="input" name="q" defaultValue={term} placeholder="Hledat e-mail nebo jméno" aria-label="Hledat uživatele" />
        <button className="pill" type="submit">Hledat</button>
      </form>

      <ul className="space-y-2">
        {rows.map((u) => (
          <li key={u.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold truncate">
                {u.name}{" "}
                {u.banned && <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">zablokován</span>}{" "}
                {!u.emailVerified && <span className="chip">e-mail nepotvrzen</span>}
              </p>
              <p className="text-sm text-[var(--color-muted)] truncate">
                {u.email} · registrace {u.createdAt.toLocaleDateString("cs-CZ")}
                {u.banned && u.banReason ? ` · důvod: ${u.banReason}` : ""}
                {u.banned && u.banExpires ? ` · do ${u.banExpires.toLocaleDateString("cs-CZ")}` : ""}
              </p>
            </div>
            <UserActions id={u.id} role={u.role} banned={u.banned} self={u.id === session.user.id} />
          </li>
        ))}
        {rows.length === 0 && <li className="card p-6 text-sm text-[var(--color-muted)]">Nikdo neodpovídá hledání.</li>}
      </ul>

      {pages > 1 && (
        <nav className="flex items-center gap-3 text-sm" aria-label="Stránkování">
          {page > 1 && <Link className="pill" href={link(page - 1)}>← Předchozí</Link>}
          <span className="text-[var(--color-muted)]">strana {page} z {pages}</span>
          {page < pages && <Link className="pill" href={link(page + 1)}>Další →</Link>}
        </nav>
      )}
    </div>
  );
}
