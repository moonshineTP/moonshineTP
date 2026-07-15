import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const isStaticExport =
  process.env.GITHUB_PAGES === "true" || process.env.CF_PAGES === "1";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
