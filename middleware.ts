import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

// 浏览器语言到网站语言的映射（全部小写以便不区分大小写匹配）
const browserLocaleMap: Record<string, string> = {
  'zh': 'zh',
  'zh-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
  'id': 'id',
  'ms': 'id', // 马来语映射到印尼语
  'th': 'th',
  'vi': 'vi',
  'ar': 'ar',
  'en': 'en',
  'en-us': 'en',
  'en-gb': 'en',
};

// 获取浏览器首选语言
function getBrowserLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  console.log('[Middleware] Accept-Language:', acceptLanguage);
  
  if (!acceptLanguage) {
    console.log('[Middleware] No Accept-Language header, using default:', defaultLocale);
    return defaultLocale;
  }

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
  
  console.log('[Middleware] Parsed languages:', languages);

  // 查找匹配的语言
  for (const { code } of languages) {
    const lowerCode = code.toLowerCase();
    console.log(`[Middleware] Checking code: ${code} (lowercase: ${lowerCode})`);
    // 精确匹配（不区分大小写）
    if (browserLocaleMap[lowerCode]) {
      console.log(`[Middleware] Matched exact: ${lowerCode} -> ${browserLocaleMap[lowerCode]}`);
      return browserLocaleMap[lowerCode];
    }
    // 前缀匹配 (如 "en-US" 匹配 "en")
    const prefix = lowerCode.split('-')[0];
    if (browserLocaleMap[prefix]) {
      console.log(`[Middleware] Matched prefix: ${prefix} -> ${browserLocaleMap[prefix]}`);
      return browserLocaleMap[prefix];
    }
  }

  console.log('[Middleware] No match found, using default:', defaultLocale);
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
  console.log('[Middleware] Browser locale:', browserLocale);

  // 重定向到浏览器语言版本
  const newUrl = new URL(`/${browserLocale}${pathname}`, request.url);
  
  // 设置 cookie 记住语言偏好
  const response = NextResponse.redirect(newUrl);
  response.cookies.set('NEXT_LOCALE', browserLocale, {
    maxAge: 60 * 60 * 24 * 365, // 1年
    path: '/',
  });

  console.log('[Middleware] Redirecting to:', newUrl.toString());
  return response;
}

export const config = {
  matcher: [
    // 匹配根路径和所有非语言前缀路径
    '/',
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|en/|zh/|id/|th/|vi/|ar/).*)',
  ],
};
