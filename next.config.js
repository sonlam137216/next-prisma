/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'theme.hstatic.net', '14.225.212.72', 'res.cloudinary.com'],
  },
}

module.exports = nextConfig 