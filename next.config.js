/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'theme.hstatic.net', '14.225.212.72', 'res.cloudinary.com'],
  },
  experimental: {
    outputFileTracingRoot: undefined, // Enable file tracing
  },
}

module.exports = nextConfig 