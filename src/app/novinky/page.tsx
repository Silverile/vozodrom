import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Novinky a rady pro motoristy",
  description: "Praktické rady k nákupu a prodeji auta, přepisu, pneumatikám a elektromobilům.",
};

export default function NewsPage() {
  const [lead, ...rest] = articles;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Novinky a rady</h1>
      <p className="mt-1 text-[var(--color-muted)] max-w-2xl">Praktické rady k nákupu, prodeji a provozu auta. Bez clickbaitu a se zdroji.</p>

      <div className="mt-6">
        <ArticleCard article={lead} variant="feature" />
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {rest.map((a) => (
          <li key={a.slug}><ArticleCard article={a} /></li>
        ))}
      </ul>
    </div>
  );
}
