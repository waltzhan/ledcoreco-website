import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

// 浏览器语言到网站语言的映射
const browserLocaleMap: Record<string, string> = {
  'zh': 'zh',
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'zh-HK': 'zh',
  'id': 'id',
  'ms': 'id', // 马来语映射到印尼语
  'th': 'th',
  'vi': 'vi',
  'ar': 'ar',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
};

// 获取浏览器首选语言
function getBrowserLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // 解析 Accept-Language 头
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, priority = 'q=1.0'] = lang.trim().split(';');
      return {
        code: code.trim(),
        priority: parseFloat(priority.replace('q=', '')) || 1.0
      };
    })
    .sort((a, b) => b.priority - a.priority);

  // 查找匹配的语言
  for (const { code } of languages) {
    // 精确匹配
    if (browserLocaleMap[code]) {
      return browserLocaleMap[code];
    }
    // 前缀匹配 (如 "en-US" 匹配 "en")
    const prefix = code.split('-')[0];
    if (browserLocaleMap[prefix]) {
      return browserLocaleMap[prefix];
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查路径是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径已有语言前缀，不处理
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 跳过某些路径
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 获取浏览器语言
  const browserLocale = getBrowserLocale(request);

  // 检查是否有语言偏好cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  const targetLocale = localeCookie?.value || browserLocale;

  // 重定向到对应语言版本
  const newUrl = new URL(`/${targetLocale}${pathname}`, request.url);
  
  // 设置 cookie 记住语言偏好（如果还没有）
  const response = NextResponse.redirect(newUrl);
  if (!localeCookie) {
    response.cookies.set('NEXT_LOCALE', targetLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1年
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    // 匹配所有路径，除了静态资源
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
