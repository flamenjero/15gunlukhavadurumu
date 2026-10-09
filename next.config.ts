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
        // ads.txt must return 200 on the www host. A redirect to the apex
        // makes AdSense report the file as missing for a www property.
        source: "/:path((?!ads\\.txt$).*)",
        has: [{ type: "host", value: "www.15gunlukhavadurumu.org" }],
        destination: "https://15gunlukhavadurumu.org/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
