import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.15gunlukhavadurumu.org" }],
        destination: "https://15gunlukhavadurumu.org",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.15gunlukhavadurumu.org" }],
        destination: "https://15gunlukhavadurumu.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
