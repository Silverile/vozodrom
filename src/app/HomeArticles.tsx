"use client";

import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/lib/articles";

// The three newest articles on the (prerendered) home page, fetched so articles staff add or change
// show up without a deploy. Until they arrive, the built-in ones the page was built with stand in.
export function HomeArticles({ initial }: { initial: Article[] }) {
  const [articles, setArticles] = useState(initial);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/novinky/?pocet=3")
      .then((r) => (r.ok ? (r.json() as Promise<{ articles: Article[] }>) : null))
      .then((data) => !cancelled && data && setArticles(data.articles))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <ul className="grid gap-3 lg:grid-cols-3">
      {articles.slice(0, 3).map((a) => (
        <li key={a.slug}><ArticleCard article={a} /></li>
      ))}
    </ul>
  );
}
