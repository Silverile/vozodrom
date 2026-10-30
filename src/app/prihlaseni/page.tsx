import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getSession, googleEnabled } from "@/lib/auth";
import { safeNext } from "@/lib/safe-next";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = { title: "Přihlášení a registrace", robots: { index: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ dalsi?: string }> }) {
  await connection();
  if (await getSession()) redirect(safeNext((await searchParams).dalsi));
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Suspense>
        <SignInForm google={googleEnabled()} />
      </Suspense>
    </div>
  );
}
