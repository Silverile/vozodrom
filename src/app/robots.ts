import type { MetadataRoute } from "next";

// The site's own part of robots.txt (Cloudflare adds its managed rules for AI crawlers in front):
// everything may be crawled except accounts, admin and the API, and here is the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/ucet/", "/api/", "/garaz/"] },
    sitemap: "https://vozodrom.cz/sitemap.xml",
    host: "https://vozodrom.cz",
  };
}
