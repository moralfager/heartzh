/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: false
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig