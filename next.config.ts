import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
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
    // Disable static page generation during build
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb'
        }
    },
};

export default nextConfig;
