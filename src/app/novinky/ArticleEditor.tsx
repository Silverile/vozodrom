"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ARTICLE_CATEGORIES, ARTICLE_ICONS, type Article } from "@/lib/articles";

// The article editor for staff (moderators and admins): a new article on /novinky/novy/, or the
// article itself on its page ("Upravit"). Saving goes to /api/novinky/; the page shows the result.

const today = () => new Date().toISOString().slice(0, 10);

export function ArticleEditor({ article, onCancel }: { article?: Article; onCancel?: () => void }) {
  const router = useRouter();
  const [draft, setDraft] = useState({
    title: article?.title ?? "",
    perex: article?.perex ?? "",
    category: article?.category ?? "Rady",
    icon: article?.icon ?? "dokument",
    date: article?.date ?? today(),
    body: article?.body ?? "",
    sources: (article?.sources ?? []).join("\n"),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (patch: Partial<typeof draft>) => setDraft((d) => ({ ...d, ...patch }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/novinky/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: article?.slug, article: { ...draft, sources: draft.sources.split("\n").map((s) => s.trim()).filter(Boolean) } }),
      });
      const data = (await r.json().catch(() => ({}))) as { slug?: string; error?: string };
      if (!r.ok || !data.slug) return setError(data.error ?? "Uložení se nepovedlo.");
      if (article && data.slug === article.slug) {
        onCancel?.();
        router.refresh();
      } else router.push(`/novinky/${data.slug}/`);
    } catch {
      setError("Uložení se nepovedlo (spojení), zkuste to znovu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <label className="block text-sm">
        Nadpis
        <input className="input mt-1 !text-lg font-bold" required minLength={5} maxLength={160} value={draft.title} onChange={(e) => set({ title: e.target.value })} />
      </label>
      <label className="block text-sm">
        Úvod (ukáže se i v přehledu)
        <textarea className="input mt-1 min-h-20" required minLength={20} maxLength={400} value={draft.perex} onChange={(e) => set({ perex: e.target.value })} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          Rubrika
          <select className="input mt-1" value={draft.category} onChange={(e) => set({ category: e.target.value })}>
            {ARTICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block text-sm">
          Obrázek
          <select className="input mt-1" value={draft.icon} onChange={(e) => set({ icon: e.target.value })}>
            {Object.entries(ARTICLE_ICONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="block text-sm">
          Datum
          <input type="date" className="input mt-1" required value={draft.date} onChange={(e) => set({ date: e.target.value })} />
        </label>
      </div>
      <div className="text-sm">
        <label htmlFor="clanek-text">Text</label>
        <div className="mt-1">
          <RichTextEditor id="clanek-text" minHeight="min-h-96" maxLength={40_000} value={draft.body} onChange={(body) => set({ body })} />
        </div>
      </div>
      <label className="block text-sm">
        Zdroje (každý na řádek; nepovinné)
        <textarea className="input mt-1 min-h-20" value={draft.sources} onChange={(e) => set({ sources: e.target.value })} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-cta" disabled={busy}>{busy ? "Ukládám…" : article ? "Uložit změny" : "Zveřejnit článek"}</button>
        {onCancel && <button type="button" className="pill" onClick={onCancel}>Zrušit</button>}
        {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
      </div>
    </form>
  );
}
