import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles the build output automatically — no need for "standalone"
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
