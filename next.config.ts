import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
};

export default nextConfig;
