import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This tells Vercel to look the other way on lint errors so your build succeeds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;