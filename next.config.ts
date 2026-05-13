import type { NextConfig } from "next";

// Deployed to GitHub Pages as a project site (peetzweg.github.io/ui), so we
// need basePath + assetPrefix during CI. Local dev keeps the root path.
// If you point a custom domain at this repo in the future, drop both fields.
const isCI = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isCI ? "/ui" : undefined,
  assetPrefix: isCI ? "/ui" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
