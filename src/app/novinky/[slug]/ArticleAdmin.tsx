"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Article } from "@/lib/articles";
import { ArticleEditor } from "../ArticleEditor";

// Staff's controls on an article page: "Upravit" swaps the article for its editor, "Smazat" hides it.
// The page renders them only for moderators and admins; the API checks the role again.
export function ArticleAdmin({ article, children }: { article: Article; children: React.ReactNode }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm(`Smazat článek „${article.title}“? Zmizí z webu.`)) return;
    try {
      const r = await fetch(`/api/novinky/${article.slug}/`, { method: "DELETE" });
      if (!r.ok) return setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Smazání se nepovedlo.");
      router.push("/novinky/");
      router.refresh();
    } catch {
      setError("Smazání se nepovedlo (spojení), zkuste to znovu.");
    }
  }

  if (editing) return <ArticleEditor article={article} onCancel={() => setEditing(false)} />;
  return (
    <>
      <p className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" className="pill text-sm" onClick={() => setEditing(true)}>✎ Upravit</button>
        <button type="button" className="pill text-sm text-[var(--color-warn)]" onClick={remove}>Smazat</button>
        {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
      </p>
      {children}
    </>
  );
}
