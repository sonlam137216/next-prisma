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
    // Make all pages dynamic by default
    staticPageGenerationTimeout: 0,
    // Disable static optimization
    reactStrictMode: true,
    // Disable automatic static optimization
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb'
        },
        // Disable static optimization
        optimizeCss: false,
        // Disable static data fetching
        serverComponentsExternalPackages: ['@prisma/client']
    }
};

export default nextConfig;
