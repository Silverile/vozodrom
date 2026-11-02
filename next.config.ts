import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  // The owners' logbooks were "Deníky aut" at /deniky/ until 2026-11-02; old links and notifications keep working.
  // Sections without real content yet (lib/sections.ts, closed) lead home until they open.
  async redirects() {
    const closed = ["/forum", "/recenze", "/technika", "/moto", "/dily", "/pneumatiky"].flatMap((p) => [
      { source: p, destination: "/", permanent: false },
      { source: `${p}/:path*`, destination: "/", permanent: false },
    ]);
    return [{ source: "/deniky/:path*", destination: "/pribehy/:path*", permanent: true }, ...closed];
  },
  // pg loads its Workers socket from pg-cloudflare only under the "workerd" export condition,
  // which Next's file tracing (Node conditions) does not follow, so ship the whole package.
  outputFileTracingIncludes: { "/*": ["./node_modules/pg-cloudflare/**/*"] },
};

export default nextConfig;

// Gives `next dev` access to Cloudflare bindings (Hyperdrive, vars from .dev.vars); no effect on builds.
initOpenNextCloudflareForDev();
