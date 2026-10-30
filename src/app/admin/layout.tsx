import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { STAFF_ROLES, getSession, hasRole } from "@/lib/auth";

export const metadata: Metadata = { title: { default: "Administrace", template: "%s · Administrace" }, robots: { index: false } };

const NAV = [
  { href: "/admin/", label: "Přehled", admin: false },
  { href: "/admin/uzivatele/", label: "Uživatelé", admin: true },
  { href: "/admin/inzeraty/", label: "Inzeráty", admin: false },
  { href: "/admin/hlaseni/", label: "Hlášení (DSA)", admin: false },
  { href: "/admin/komunita/", label: "Fórum a recenze", admin: false },
  { href: "/admin/obsah/", label: "Katalog a novinky", admin: true },
];

// Staff only. Visitors are sent to sign in; signed-in users without a staff role get a 404,
// so the section does not advertise itself.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getSession();
  if (!session) redirect("/prihlaseni/?dalsi=/admin/");
  if (!hasRole(session, STAFF_ROLES)) notFound();
  const isAdmin = session.user.role === "admin";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-[200px_minmax(0,1fr)] items-start">
      <nav aria-label="Administrace" className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2">Administrace · {session.user.role}</p>
        <ul className="flex md:flex-col gap-1 overflow-x-auto">
          {NAV.filter((n) => isAdmin || !n.admin).map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="block rounded-lg px-3 py-2 text-sm whitespace-nowrap text-[var(--color-muted)] hover:bg-[var(--color-field)] hover:text-[var(--color-ink)]">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
