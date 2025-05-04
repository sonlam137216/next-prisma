import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'theme.hstatic.net',
                port: '',
                pathname: '/200000689681/1001138369/**',
            },
        ],
      },
};

export default nextConfig;
