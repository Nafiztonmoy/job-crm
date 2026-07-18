import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This tells Vercel to build the app even if TypeScript complains
    ignoreBuildErrors: true,
  },
};

export default nextConfig;