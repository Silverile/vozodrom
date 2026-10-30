import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

// Gives `next dev` access to Cloudflare bindings (none yet); no effect on builds.
initOpenNextCloudflareForDev();
