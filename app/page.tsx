import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { unstable_noStore } from 'next/cache';
import { defaultLocale } from '@/lib/i18n/config';

// 浏览器语言到网站语言的映射
const browserLocaleMap: Record<string, string> = {
  'zh': 'zh',
  'zh-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
  'id': 'id',
  'ms': 'id',
  'th': 'th',
  'vi': 'vi',
  'ar': 'ar',
  'en': 'en',
  'en-us': 'en',
  'en-gb': 'en',
};

function getBrowserLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].trim();
      const priority = parts[1] ? parseFloat(parts[1].replace('q=', '')) : 1.0;
      return { code: code.toLowerCase(), priority: isNaN(priority) ? 1.0 : priority };
    })
    .sort((a, b) => b.priority - a.priority);

  for (const { code } of languages) {
    if (browserLocaleMap[code]) {
      return browserLocaleMap[code];
    }
    const prefix = code.split('-')[0];
    if (browserLocaleMap[prefix]) {
      return browserLocaleMap[prefix];
    }
  }

  return defaultLocale;
}

export default async function RootPage() {
  // 强制动态渲染，确保每次请求都执行
  unstable_noStore();
  
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  
  // 调试：输出到响应头
  const browserLocale = getBrowserLocale(acceptLanguage);
  
  // 使用 307 临时重定向，避免缓存
  redirect(`/${browserLocale}`);
}
