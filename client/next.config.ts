import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://personal-finance-tracker-u6n3.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;
