import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { carTitle } from "@/lib/garage";
import { carFor } from "@/lib/garage-store";
import { ListingError } from "@/lib/listing-store";
import { EntryForm } from "../../EntryForm";

export const metadata: Metadata = { title: "Nový zápis do příběhu auta", robots: { index: false } };

export default async function NewEntryPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect(`/prihlaseni/?dalsi=/garaz/${id}/zapis/`);
  const car = await carFor(session, id).catch((error) => {
    if (error instanceof ListingError) notFound();
    throw error;
  });
  const title = carTitle(car.data);
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-[var(--color-muted)]">
        <Link href="/garaz/" className="hover:text-[var(--color-brand)]">Moje garáž</Link> / <Link href={`/garaz/${id}/`} className="hover:text-[var(--color-brand)]">{title}</Link> / Nový zápis
      </p>
      <h1 className="mt-1 mb-6 text-2xl sm:text-3xl font-extrabold tracking-tight">Nový zápis do příběhu auta</h1>
      <EntryForm carId={id} />
    </div>
  );
}
