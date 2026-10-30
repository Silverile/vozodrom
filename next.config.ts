import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  // pg loads its Workers socket from pg-cloudflare only under the "workerd" export condition,
  // which Next's file tracing (Node conditions) does not follow, so ship the whole package.
  outputFileTracingIncludes: { "/*": ["./node_modules/pg-cloudflare/**/*"] },
};

export default nextConfig;

// Gives `next dev` access to Cloudflare bindings (Hyperdrive, vars from .dev.vars); no effect on builds.
initOpenNextCloudflareForDev();
