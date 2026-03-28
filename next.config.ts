import type { NextConfig } from "next";

const isProductionBuild = process.env.NODE_ENV === "production";
const repoBasePath = "/qa-portfolio";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProductionBuild ? repoBasePath : undefined,
  assetPrefix: isProductionBuild ? `${repoBasePath}/` : undefined,
  trailingSlash: isProductionBuild,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
