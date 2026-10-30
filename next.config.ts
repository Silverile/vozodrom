import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Cloudflare Workers (OpenNext) is the default target. The GitHub Pages workflow sets
// STATIC_EXPORT=1 to build a plain static site into ./out until the domain moves to Cloudflare.
const staticExport = process.env.STATIC_EXPORT === "1";

// GitHub Pages serves the project at /vozodrom until the custom domain is connected.
// The deploy workflow sets NEXT_PUBLIC_BASE_PATH; locally it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: staticExport ? "export" : undefined,
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;

// Gives `next dev` access to Cloudflare bindings (none yet); no effect on builds.
initOpenNextCloudflareForDev();
