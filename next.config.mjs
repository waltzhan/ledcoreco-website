/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // 注意：根路径 / 的语言检测重定向在 app/page.tsx 中实现
  // 不要在这里添加重定向规则，否则会覆盖动态语言检测
};

export default nextConfig;
