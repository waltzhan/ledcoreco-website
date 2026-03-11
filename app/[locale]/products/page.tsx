import { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/lib/i18n/config';
import { urlFor } from '@/lib/sanity/client';

// 加载翻译文件
function getMessages(locale: string) {
  const messagesMap: Record<string, any> = {
    en: require('@/messages/en.json'),
    zh: require('@/messages/zh.json'),
    id: require('@/messages/id.json'),
    th: require('@/messages/th.json'),
    vi: require('@/messages/vi.json'),
    ar: require('@/messages/ar.json'),
  };
  return messagesMap[locale] || messagesMap.en;
}

// 辅助函数：通过路径获取嵌套属性
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
}

// 静态产品数据（构建时使用）
const staticProducts = [
  {
    _id: '1',
    name: { en: '0603 Standard CHIP LED', zh: '0603 标准CHIP LED' },
    slug: { current: 'gp0603-01' },
    model: 'GP0603-01',
    category: { name: { en: 'CHIP LED', zh: 'CHIP LED' } },
    shortDescription: { en: 'Ultra-small indicator LED for consumer electronics', zh: '超小型指示灯LED' },
    status: 'active',
    targetMarkets: ['malaysia', 'indonesia', 'thailand'],
  },
  {
    _id: '2',
    name: { en: 'PLCC-2 White LED', zh: 'PLCC-2 白光LED' },
    slug: { current: 'gp-plcc2-w' },
    model: 'GP-PLCC2-W',
    category: { name: { en: 'PLCC LED', zh: 'PLCC LED' } },
    shortDescription: { en: 'High efficacy white LED for lighting', zh: '高光效白光LED' },
    status: 'new',
    targetMarkets: ['indonesia', 'vietnam', 'middle-east'],
  },
  {
    _id: '3',
    name: { en: '940nm IR Emitter', zh: '940nm 红外发射管' },
    slug: { current: 'gp-ir940-e' },
    model: 'GP-IR940-E',
    category: { name: { en: 'IR Sensors', zh: '红外传感器' } },
    shortDescription: { en: 'Standard IR emitter for remote control', zh: '标准红外发射管' },
    status: 'active',
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam'],
  },
];

const staticCategories = [
  { _id: '1', name: { en: 'CHIP LED', zh: 'CHIP LED' }, slug: { current: 'chip-led' } },
  { _id: '2', name: { en: 'PLCC LED', zh: 'PLCC LED' }, slug: { current: 'plcc-led' } },
  { _id: '3', name: { en: 'IR Sensors', zh: '红外传感器' }, slug: { current: 'ir-sensors' } },
  { _id: '4', name: { en: 'UV LED', zh: 'UV LED' }, slug: { current: 'uv-led' } },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  
  return {
    title: `${messages.navigation.products} | GOPRO LED`,
    description: messages.metadata.description,
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const t = (key: string) => getNestedValue(messages, key);
  
  // 使用静态数据（构建时）
  const products = staticProducts;
  const categories = staticCategories;

  const getLocalizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('products.title')}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('products.categoriesTitle')}
              </h2>
              <nav className="space-y-2">
                <Link
                  href={getLocalizedHref('/products')}
                  className="block px-3 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-900"
                >
                  {t('products.allProducts')}
                </Link>
                {categories.map((category: any) => (
                  <Link
                    key={category._id}
                    href={getLocalizedHref(`/products?category=${category.slug.current}`)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-900 transition-colors"
                  >
                    {category.name[locale] || category.name.en}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t('products.noProducts')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <article
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-gray-100">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto mb-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-500">{product.model}</span>
                        </div>
                      </div>
                      {/* Status Badge */}
                      {product.status === 'new' && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {t('common.new')}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="text-xs text-blue-600 font-medium mb-2">
                        {product.category?.name[locale] || product.category?.name.en}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name[locale] || product.name.en}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {t('products.model')}: {product.model}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.shortDescription?.[locale] || product.shortDescription?.en}
                      </p>

                      {/* Target Markets */}
                      {product.targetMarkets && product.targetMarkets.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.targetMarkets.slice(0, 3).map((market: string) => (
                            <span
                              key={market}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {market}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      <Link
                        href={getLocalizedHref(`/products/${product.slug.current}`)}
                        className="block w-full text-center bg-blue-900 text-white py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
                      >
                        {t('products.viewDetails')} →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
