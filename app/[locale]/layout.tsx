import { notFound } from 'next/navigation';
import { locales, type Locale, rtlLocales } from '@/lib/i18n/config';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import './globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 加载翻译消息
async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const isRTL = rtlLocales.includes(locale as Locale);

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`${isRTL ? 'rtl' : 'ltr'} flex flex-col min-h-screen`}>
        <Navbar locale={locale as Locale} messages={{ navigation: messages.navigation }} />
        <div className="flex-1">
          {children}
        </div>
        <Footer locale={locale as Locale} messages={{ navigation: messages.navigation, footer: messages.footer }} />
      </body>
    </html>
  );
}
