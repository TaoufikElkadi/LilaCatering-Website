/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    // AVIF is deliberately omitted: its encoder stalls indefinitely on these
    // large, soft-gradient stills (and on anything with an alpha channel), and
    // what it does return is visibly hazy. WebP encodes fast and looks clean.
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Compression
  compress: true,

  // Production optimizations
  poweredByHeader: false,

  // Experimental features disabled - optimizeCss was causing CSS loading issues
  // experimental: {
  //   optimizeCss: true,
  // },
}

module.exports = nextConfig

