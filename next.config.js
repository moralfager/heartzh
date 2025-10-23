/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone для Docker
  output: 'standalone',
  
  // Экспериментальные функции
  experimental: {
    optimizeCss: false,
  },
  
  // Оптимизация изображений
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  
  // Производительность
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Кеширование
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  
  // Сборка
  eslint: {
    ignoreDuringBuilds: true, // ESLint проверяется в dev
  },
  typescript: {
    ignoreBuildErrors: false, // Строгая проверка типов
  },
  
  // Заголовки безопасности для production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;