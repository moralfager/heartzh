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
  generateEtags: false,
  // Отключаем ESLint при production build (уже проверено в dev)
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig