import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow embedding via iframe
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
        ],
      },
    ];
  },
  // External images
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
