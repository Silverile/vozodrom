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
        Vyplňte údaje o autě, v dalším kroku přidáte fotky a odešlete inzerát ke schválení. Rozpracované údaje se průběžně ukládají
        v tomto prohlížeči. Ostatní rubriky (technika, motorky, díly, pneumatiky) jsou zatím jen náhled. Prodejci mohou posílat celý sklad <Link href="/pro-prodejce/" className="text-[var(--color-brand)] hover:underline">feedem</Link>.
      </p>
      <Suspense>
        <AddListingTabs />
      </Suspense>
    </div>
  );
}
