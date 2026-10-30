import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { STAFF_ROLES, getSession, hasRole } from "@/lib/auth";
import { AccountClient } from "./AccountClient";

export const metadata: Metadata = { title: "Můj účet", robots: { index: false } };

export default async function AccountPage() {
  await connection();
  const session = await getSession();
  if (!session) redirect("/prihlaseni/?dalsi=/ucet/");
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense>
        <AccountClient user={{ name: session.user.name, email: session.user.email }} staff={hasRole(session, STAFF_ROLES)} />
      </Suspense>
    </div>
  );
}
