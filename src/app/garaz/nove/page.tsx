import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { EMPTY_CAR, carLine } from "@/lib/garage";
import { CarForm } from "../CarForm";

export const metadata: Metadata = { title: "Přidat auto do garáže", robots: { index: false } };

// ?znacka=&model= fills in the car picked on the home page ("Jaké auto máte?").
export default async function NewCarPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await connection();
  const q = await searchParams;
  const picked = q.znacka && q.model && carLine({ brand: q.znacka, model: q.model }) ? { ...EMPTY_CAR, brand: q.znacka, model: q.model } : undefined;
  const back = picked ? `/garaz/nove/?znacka=${picked.brand}&model=${picked.model}` : "/garaz/nove/";
  if (!(await getSession())) redirect(`/prihlaseni/?dalsi=${encodeURIComponent(back)}`);
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-[var(--color-muted)]"><Link href="/garaz/" className="hover:text-[var(--color-brand)]">Moje garáž</Link> / Nové auto</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">Přidat auto</h1>
      <p className="mt-1 mb-6 text-[var(--color-muted)]">Stačí značka a model, ostatní můžete doplnit později. Fotky přidáte po uložení.</p>
      <CarForm initial={picked} />
    </div>
  );
}
