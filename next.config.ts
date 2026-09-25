import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>; locally the base path is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/images/loader.ts",
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [96, 160, 240],
  },
  experimental: {
    globalNotFound: true,
    // Inline the (small, gzip ~15 KB) stylesheet: removes the render-blocking request
    inlineCss: true,
  },
};

export default nextConfig;
