import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { STAFF_ROLES, getSession, hasRole } from "@/lib/auth";
import { draftTitle } from "@/lib/listing-draft";
import { listingsOf } from "@/lib/listing-store";
import { AccountClient, type MyListing } from "./AccountClient";

export const metadata: Metadata = { title: "Můj účet", robots: { index: false } };

export default async function AccountPage() {
  await connection();
  const session = await getSession();
  if (!session) redirect("/prihlaseni/?dalsi=/ucet/");
  const listings: MyListing[] = (await listingsOf(session.user.id)).map((l) => ({
    id: l.id,
    title: draftTitle(l.data),
    status: l.status,
    price: l.data.price,
    photo: l.photos[0]?.key ?? null,
    updatedAt: l.updatedAt.toISOString(),
  }));
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense>
        <AccountClient user={{ name: session.user.name, email: session.user.email }} staff={hasRole(session, STAFF_ROLES)} listings={listings} />
      </Suspense>
    </div>
  );
}
