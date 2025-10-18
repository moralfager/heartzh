/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: false
  },
  images: {
    unoptimized: true
  },
  // Docker оптимизации
  compress: true,
  poweredByHeader: false,
  generateEtags: false
}

module.exports = nextConfig