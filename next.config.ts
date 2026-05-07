import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      // /courtly is a Next.js route now; only the alt prototype designs need rewrites.
      { source: "/courtly/interests", destination: "/courtly/interests.html" },
      { source: "/courtly/neon", destination: "/courtly/neon.html" },
    ];
  },
};

export default nextConfig;
