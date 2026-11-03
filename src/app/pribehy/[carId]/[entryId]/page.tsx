import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { GarageCarImage } from "@/components/GarageCarImage";
import { PhotoGallery } from "@/components/PhotoGallery";
import { getSession } from "@/lib/auth";
import { formatDate, formatKm, formatPrice } from "@/lib/format";
import { ENTRY_CATEGORIES, carTitle } from "@/lib/garage";
import { Markup, plainText } from "@/lib/markup";
import { entryPage } from "@/lib/garage-store";
import { CommentForm, DeleteComment, Reaction, ReportContent } from "../../LogbookClient";

// One logbook entry: photos, text, what it cost and at what mileage, likes and comments. Earlier
// and later entries of the same car are linked at the bottom.

type Params = Promise<{ carId: string; entryId: string }>;

async function load(carId: string, entryId: string) {
  await connection();
  const viewer = await getSession();
  const page = await entryPage(carId, entryId, viewer);
  return page && { ...page, signedIn: Boolean(viewer) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { carId, entryId } = await params;
  const page = await load(carId, entryId);
  if (!page) return { title: "Zápis v příběhu auta" };
  return {
    title: `${page.entry.title} — ${carTitle(page.car.data)}`,
    description: plainText(page.entry.body).slice(0, 160) || undefined,
    ...((page.entry.hiddenReason || page.car.hiddenReason) && { robots: { index: false } }),
  };
}

export default async function EntryPage({ params }: { params: Params }) {
  const { carId, entryId } = await params;
  const page = await load(carId, entryId);
  if (!page) notFound();
  const { car, entry, comments, earlier, later, viewer, ownerName, liked, signedIn } = page;
  const title = carTitle(car.data);
  const here = `/pribehy/${carId}/${entryId}/`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm text-[var(--color-muted)]">
        <Link href="/pribehy/" className="hover:text-[var(--color-brand)]">Příběhy aut</Link>
        {" / "}
        <Link href={`/pribehy/${carId}/`} className="hover:text-[var(--color-brand)]">{title}</Link>
      </p>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_300px] items-start">
        <article className="min-w-0 space-y-5">
          <header>
            <span className="chip bg-[var(--color-brand-soft)] text-[var(--color-brand)]">{ENTRY_CATEGORIES[entry.category]}</span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">{entry.title}</h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]"><Link href={`/profil/${car.userId}/`} className="hover:text-[var(--color-brand)]">{ownerName}</Link> · {formatDate(entry.happenedOn)}</p>
            {entry.hiddenReason && <p className="mt-3 card p-4 text-sm bg-[var(--color-warn-soft)] text-[var(--color-warn)]">Skryto moderátorem: {entry.hiddenReason}</p>}
          </header>

          {entry.photos.length > 0 && <PhotoGallery photos={entry.photos} title={entry.title} />}

          {entry.body && (
            <Markup text={entry.body} className="text-[0.95rem] leading-relaxed" />
          )}

          {(entry.costCzk != null || entry.mileageKm != null) && (
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {entry.costCzk != null && (
                <div><dt className="inline text-[var(--color-muted)]">Cena: </dt><dd className="inline font-semibold">{formatPrice(entry.costCzk)}</dd></div>
              )}
              {entry.mileageKm != null && (
                <div><dt className="inline text-[var(--color-muted)]">Nájezd: </dt><dd className="inline font-semibold">{formatKm(entry.mileageKm)}</dd></div>
              )}
            </dl>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Reaction what="entry-like" id={entryId} initialOn={liked} initialCount={entry.likes} signedIn={signedIn} next={here} own={viewer.owner} />
            {viewer.owner && <Link href={`/garaz/zapis/${entryId}/`} className="pill">Upravit</Link>}
            {!viewer.owner && <ReportContent kind="entry" id={entryId} signedIn={signedIn} next={here} />}
          </div>

          {(earlier || later) && (
            <nav aria-label="Další zápisy" className="grid gap-3 sm:grid-cols-2">
              {earlier ? (
                <Link href={`/pribehy/${carId}/${earlier.id}/`} className="card p-4 hover:border-[var(--color-brand)]">
                  <span className="block text-xs text-[var(--color-muted)]">← Dříve</span>
                  <span className="block font-semibold">{earlier.title}</span>
                </Link>
              ) : <span />}
              {later && (
                <Link href={`/pribehy/${carId}/${later.id}/`} className="card p-4 text-right hover:border-[var(--color-brand)]">
                  <span className="block text-xs text-[var(--color-muted)]">Později →</span>
                  <span className="block font-semibold">{later.title}</span>
                </Link>
              )}
            </nav>
          )}

          <section id="komentare" className="card p-5 space-y-4 scroll-mt-24">
            <h2 className="font-bold text-lg">Komentáře <span className="text-[var(--color-muted)] font-normal">{comments.filter((c) => !c.hiddenReason).length}</span></h2>
            {comments.length > 0 && (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="text-sm">
                    <p>
                      <Link href={`/profil/${c.authorId}/`} className="font-semibold hover:text-[var(--color-brand)]">{c.authorName}</Link>
                      <span className="text-[var(--color-muted)]"> · {formatDate(c.createdAt.toISOString())}</span>
                    </p>
                    {c.drives.length > 0 && <p className="text-xs text-[var(--color-muted)]">Jezdí s {c.drives.slice(0, 2).join(", ")}</p>}
                    {c.hiddenReason ? (
                      <p className="mt-1 text-[var(--color-warn)]">Skryto moderátorem: {c.hiddenReason}</p>
                    ) : (
                      <p className="mt-1 whitespace-pre-line">{c.body}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-3">
                      {(c.mine || viewer.staff) && <DeleteComment id={c.id} />}
                      {!c.mine && <ReportContent kind="comment" id={c.id} signedIn={signedIn} next={here} />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <CommentForm entryId={entryId} signedIn={signedIn} next={here} />
          </section>
        </article>

        <aside className="min-w-0">
          <Link href={`/pribehy/${carId}/`} className="card block overflow-hidden hover:border-[var(--color-brand)]">
            <GarageCarImage car={car.data} photo={car.photos[0]} alt={title} />
            <span className="block p-4">
              <span className="block font-semibold">{title}</span>
              <span className="block text-sm text-[var(--color-muted)]">{page.counts.entries} zápisů v příběhu</span>
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
