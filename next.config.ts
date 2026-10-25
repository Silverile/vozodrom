import type { NextConfig } from "next";

// GitHub Pages serves the project at /vozodrom until the custom domain is connected.
// The deploy workflow sets NEXT_PUBLIC_BASE_PATH; locally it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
