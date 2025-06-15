/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'theme.hstatic.net', '14.225.212.72', 'res.cloudinary.com'],
  },
  // Add production optimizations
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Disable server components for now to avoid hydration issues
    serverComponents: false,
    // Disable CSS optimization that requires critters
    optimizeCss: false,
    // Ensure proper static optimization
    staticPageGenerationTimeout: 120,
  }
}

module.exports = nextConfig 