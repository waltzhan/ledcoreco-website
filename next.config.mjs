/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // SEO优化：支持现代图片格式，提升 Core Web Vitals
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // 注意：根路径 / 的语言检测重定向在 app/page.tsx 中实现
  // 不要在这里添加重定向规则，否则会覆盖动态语言检测
  
  // SEO优化：启用 gzip 压缩
  compress: true,
  
  // SEO优化：优化构建输出
  poweredByHeader: false,
};

export default nextConfig;
