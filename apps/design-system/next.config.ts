import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProd ? { output: "export" as const } : {}),
  basePath: isProd ? '/rocketmind' : '',
  images: { unoptimized: true },
};

export default nextConfig;
