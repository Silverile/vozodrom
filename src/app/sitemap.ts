import type { MetadataRoute } from "next";
import { allArticles } from "@/lib/article-store";
import { builtInArticles } from "@/lib/articles";
import { MAKES, modelLinesOf } from "@/lib/makes";

// sitemap.xml for search engines: the main pages, every make and model line of the catalogue and the
// articles. Built on request, so new articles are in it; without the database (a build without one)
// it lists the built-in articles.
export const dynamic = "force-dynamic";

const SITE = "https://vozodrom.cz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await allArticles().catch(() => builtInArticles);
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({
    url: `${SITE}${path}`,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "daily"),
    page("/pribehy/", 0.9, "daily"),
    page("/inzeraty/", 0.8, "daily"),
    page("/katalog/", 0.8),
    page("/novinky/", 0.7, "daily"),
    page("/prepis-vozidla/", 0.5, "monthly"),
    page("/kupni-smlouva/", 0.5, "monthly"),
    page("/podminky/", 0.2, "yearly"),
    page("/soukromi/", 0.2, "yearly"),
    ...articles.map((a) => ({ url: `${SITE}/novinky/${a.slug}/`, lastModified: a.date, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...MAKES.flatMap((m) => [page(`/katalog/${m.slug}/`, 0.5, "monthly"), ...modelLinesOf(m.slug).map((l) => page(`/katalog/${m.slug}/${l.slug}/`, 0.6, "monthly"))]),
  ];
}
