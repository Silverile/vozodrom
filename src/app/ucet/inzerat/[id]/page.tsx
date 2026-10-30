import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { draftTitle } from "@/lib/listing-draft";
import { ListingError, listingFor } from "@/lib/listing-store";
import { ManageListing } from "./ManageListing";

export const metadata: Metadata = { title: "Správa inzerátu", robots: { index: false } };

export default async function ManageListingPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect(`/prihlaseni/?dalsi=/ucet/inzerat/${id}/`);
  const row = await listingFor(session, id).catch((error) => {
    if (error instanceof ListingError) notFound();
    throw error;
  });
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <ManageListing
        listing={{
          id: row.id,
          title: draftTitle(row.data),
          status: row.status,
          data: row.data,
          photos: row.photos,
          phone: row.phone ?? "",
          messengers: row.messengers,
          rejectReason: row.rejectReason,
          wasPublished: row.publishedAt !== null,
        }}
      />
    </div>
  );
}
