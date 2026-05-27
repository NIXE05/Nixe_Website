import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      // /courtsy is a Next.js route now; only the alt prototype designs need rewrites.
      { source: "/courtsy/interests", destination: "/courtsy/interests.html" },
      { source: "/courtsy/neon", destination: "/courtsy/neon.html" },
    ];
  },
  async redirects() {
    return [
      { source: "/courtly", destination: "/courtsy", permanent: true },
      { source: "/courtly/:path*", destination: "/courtsy/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
