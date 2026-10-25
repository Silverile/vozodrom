import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AddListingTabs } from "./AddListingTabs";

export const metadata: Metadata = { title: "Přidat inzerát zdarma" };

export default function AddListingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Přidat inzerát zdarma</h1>
      <p className="text-[var(--color-muted)] mt-1">
        Prototyp: formulář ukazuje, jak bude inzerát vypadat. Nic se neodesílá, rozpracovaný inzerát se ukládá jen v tomto prohlížeči.
        Prodejci mohou posílat celý sklad <Link href="/pro-prodejce/" className="text-[var(--color-brand)] hover:underline">feedem</Link>.
      </p>
      <Suspense>
        <AddListingTabs />
      </Suspense>
    </div>
  );
}
