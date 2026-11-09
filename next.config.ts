import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
           value:
  "frame-src 'self' https://meet.jit.si https://customer-coo1qvj7j2zkw9sx.cloudflarestream.com https://*.cloudflarestream.com;",          },
        ],
      },
    ];
  },
};

export default nextConfig;

