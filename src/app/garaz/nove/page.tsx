import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { CarForm } from "../CarForm";

export const metadata: Metadata = { title: "Přidat auto do garáže", robots: { index: false } };

export default async function NewCarPage() {
  await connection();
  if (!(await getSession())) redirect("/prihlaseni/?dalsi=/garaz/nove/");
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-[var(--color-muted)]"><Link href="/garaz/" className="hover:text-[var(--color-brand)]">Moje garáž</Link> / Nové auto</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">Přidat auto</h1>
      <p className="mt-1 mb-6 text-[var(--color-muted)]">Stačí značka a model, ostatní můžete doplnit později. Fotky přidáte po uložení.</p>
      <CarForm />
    </div>
  );
}
