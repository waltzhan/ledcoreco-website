import { NextResponse } from 'next/server';
import { locales } from '@/lib/i18n/config';

// 静态产品slug列表
const productSlugs = ['gp0603-01', 'gp-plcc2-w', 'gp-ir940-e'];

// 静态页面路径
const staticPages = ['', '/products', '/contact'];

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goproled.com';
  
  // 生成所有语言和页面的组合
  const urls: string[] = [];
  
  for (const locale of locales) {
    // 静态页面
    for (const page of staticPages) {
      urls.push(`${baseUrl}/${locale}${page}`);
    }
    
    // 产品详情页
    for (const slug of productSlugs) {
      urls.push(`${baseUrl}/${locale}/products/${slug}`);
    }
  }
  
  // 生成XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
