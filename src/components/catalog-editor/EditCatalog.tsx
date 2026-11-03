"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { dataDrawingSrc } from "@/components/FrontDrawing";

// Entry points to the catalogue editor on a model page, shown to admins only: a button for the whole
// model and a small "Upravit" at each generation (which opens the editor at that generation). The
// editor itself loads on first use, so visitors never download it.

const Panel = dynamic(() => import("./CatalogEditorPanel"), { ssr: false });
const OPEN = "vozodrom:catalog-edit";

function useIsAdmin(): boolean {
  const { data } = authClient.useSession();
  return (data?.user as { role?: string } | undefined)?.role === "admin";
}

/** Opens the editor at a generation (index in the card as the page shows it). */
export function EditGeneration({ index }: { index: number }) {
  const admin = useIsAdmin();
  if (!admin) return null;
  return (
    <button
      type="button"
      className="text-xs font-semibold text-[var(--color-brand)] hover:underline"
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(OPEN, { detail: { index } }));
      }}
    >
      Upravit
    </button>
  );
}

export function EditCatalog({ makeSlug, lineSlug, title }: { makeSlug: string; lineSlug: string; title: string }) {
  const admin = useIsAdmin();
  const [open, setOpen] = useState<{ focus: number | null } | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => setOpen({ focus: (e as CustomEvent<{ index: number }>).detail?.index ?? null });
    window.addEventListener(OPEN, onOpen);
    return () => window.removeEventListener(OPEN, onOpen);
  }, []);

  if (!admin) return null;
  return (
    <>
      <button type="button" className="pill text-sm" onClick={() => setOpen({ focus: null })}>
        ✎ Upravit katalog
      </button>
      {open && (
        <Panel
          makeSlug={makeSlug}
          lineSlug={lineSlug}
          title={title}
          focus={open.focus}
          dataDrawing={(i) => dataDrawingSrc(makeSlug, lineSlug, i)}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
