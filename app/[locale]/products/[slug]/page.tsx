import { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/lib/i18n/config';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/utils/structured-data';

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

// 静态产品数据
const staticProducts: Record<string, any> = {
  'gp0603-01': {
    _id: '1',
    name: { en: '0603 Standard CHIP LED', zh: '0603 标准CHIP LED' },
    model: 'GP0603-01',
    category: { name: { en: 'CHIP LED', zh: 'CHIP LED' }, slug: { current: 'chip-led' } },
    description: {
      en: 'Ultra-small 0603 package LED, ideal for indicator lights in smartphones, wearables, and other precision electronic products. Features low power consumption, high brightness output, and RoHS compliance.',
      zh: '超小型0603封装LED，适用于智能手机、可穿戴设备和其他精密电子产品的指示灯。具有低功耗、高亮度输出和RoHS合规特性。',
    },
    features: {
      en: ['Size: 1.6×0.8×0.6mm', 'Low power design', 'High brightness output', 'RoHS compliant', 'Wide viewing angle'],
      zh: ['尺寸：1.6×0.8×0.6mm', '低功耗设计', '高亮度输出', '符合RoHS标准', '宽视角'],
    },
    applications: {
      en: ['Smartphones', 'Smartwatches', 'Bluetooth earphones', 'Power banks', 'Portable devices'],
      zh: ['智能手机', '智能手表', '蓝牙耳机', '移动电源', '便携设备'],
    },
    specifications: [
      { name: { en: 'Wavelength', zh: '波长' }, value: '470nm (Blue)', unit: 'nm' },
      { name: { en: 'Forward Voltage', zh: '正向电压' }, value: '2.8-3.4', unit: 'V' },
      { name: { en: 'Forward Current', zh: '正向电流' }, value: '20', unit: 'mA' },
      { name: { en: 'Luminous Intensity', zh: '发光强度' }, value: '80-150', unit: 'mcd' },
    ],
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam'],
    status: 'active',
  },
  'gp-plcc2-w': {
    _id: '2',
    name: { en: 'PLCC-2 White LED', zh: 'PLCC-2 白光LED' },
    model: 'GP-PLCC2-W',
    category: { name: { en: 'PLCC LED', zh: 'PLCC LED' }, slug: { current: 'plcc-led' } },
    description: {
      en: 'PLCC-2 package white LED with high luminous efficacy for backlight and lighting applications. Available in various color temperatures from 3000K to 6500K.',
      zh: 'PLCC-2封装白光LED，高光效，适用于背光和照明应用。提供3000K至6500K多种色温选择。',
    },
    features: {
      en: ['CCT: 3000K-6500K options', 'CRI>80', 'Efficacy: 120-150lm/W', 'Low thermal resistance', 'Long lifespan'],
      zh: ['色温：3000K-6500K可选', 'CRI>80', '光效：120-150lm/W', '低热阻', '长寿命'],
    },
    applications: {
      en: ['LCD backlight', 'Panel lights', 'Tube lights', 'Downlights', 'Commercial lighting'],
      zh: ['LCD背光', '面板灯', '灯管', '筒灯', '商业照明'],
    },
    specifications: [
      { name: { en: 'Color Temperature', zh: '色温' }, value: '3000-6500', unit: 'K' },
      { name: { en: 'CRI', zh: '显色指数' }, value: '>80', unit: '' },
      { name: { en: 'Luminous Flux', zh: '光通量' }, value: '25-30', unit: 'lm' },
      { name: { en: 'Forward Voltage', zh: '正向电压' }, value: '2.9-3.3', unit: 'V' },
    ],
    targetMarkets: ['indonesia', 'vietnam', 'middle-east'],
    status: 'new',
  },
  'gp-ir940-e': {
    _id: '3',
    name: { en: '940nm IR Emitter', zh: '940nm 红外发射管' },
    model: 'GP-IR940-E',
    category: { name: { en: 'IR Sensors', zh: '红外传感器' }, slug: { current: 'ir-sensors' } },
    description: {
      en: '940nm wavelength IR emitter with high radiant intensity for remote control and sensing applications. Low forward voltage and high reliability.',
      zh: '940nm波长红外发射管，高辐射强度，适用于遥控和感应应用。低正向电压，高可靠性。',
    },
    features: {
      en: ['Wavelength: 940nm', 'Viewing angle: ±30°', 'Low forward voltage', 'High reliability', 'Pb-free'],
      zh: ['波长：940nm', '视角：±30°', '低正向电压', '高可靠性', '无铅'],
    },
    applications: {
      en: ['TV remote', 'AC remote', 'Set-top boxes', 'IR sensing', 'Security systems'],
      zh: ['电视遥控', '空调遥控', '机顶盒', '红外感应', '安防系统'],
    },
    specifications: [
      { name: { en: 'Wavelength', zh: '波长' }, value: '940', unit: 'nm' },
      { name: { en: 'Forward Voltage', zh: '正向电压' }, value: '1.2-1.5', unit: 'V' },
      { name: { en: 'Forward Current', zh: '正向电流' }, value: '100', unit: 'mA' },
      { name: { en: 'Radiant Intensity', zh: '辐射强度' }, value: '15-25', unit: 'mW/sr' },
    ],
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam', 'middle-east'],
    status: 'active',
  },
};

export function generateStaticParams() {
  const slugs = Object.keys(staticProducts);
  const params: { locale: string; slug: string }[] = [];
  
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = staticProducts[slug];
  
  if (!product) {
    return {
      title: 'Product Not Found | GOPRO LED',
    };
  }
  
  return {
    title: `${product.name[locale] || product.name.en} | GOPRO LED`,
    description: product.description[locale] || product.description.en,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const messages = getMessages(locale);
  const product = staticProducts[slug];

  const getLocalizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  // GEO优化：生成结构化数据
  const productSchema = generateProductSchema(product, locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: messages.navigation.home, url: '/' },
    { name: messages.navigation.products, url: '/products' },
    { name: product.name[locale] || product.name.en, url: `/products/${slug}` },
  ], locale);

  // 辅助翻译函数
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('products.productNotFound')}
          </h1>
          <Link href={getLocalizedHref('/products')} className="text-blue-900 hover:underline">
            ← {t('products.backToProducts')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* GEO优化：产品结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href={getLocalizedHref('/')} className="hover:text-blue-900">{messages.navigation.home}</Link>
            <span>/</span>
            <Link href={getLocalizedHref('/products')} className="hover:text-blue-900">{messages.navigation.products}</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name[locale] || product.name.en}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-32 h-32 mx-auto mb-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-2xl font-bold text-gray-400">{product.model}</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="text-sm text-blue-600 font-medium mb-2">
              {product.category.name[locale] || product.category.name.en}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name[locale] || product.name.en}
            </h1>
            <p className="text-lg text-gray-500 mb-2">{t('products.model')}: {product.model}</p>
            
            {/* Status Badge */}
            {product.status === 'new' && (
              <span className="inline-block bg-green-500 text-white text-sm font-bold px-3 py-1 rounded mb-6">
                {t('common.new')}
              </span>
            )}

            <p className="text-gray-700 text-lg mb-8">
              {product.description[locale] || product.description.en}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href={getLocalizedHref('/contact')}
                className="flex-1 bg-blue-900 text-white text-center py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                {messages.navigation.inquiry}
              </Link>
              <button className="flex-1 border-2 border-blue-900 text-blue-900 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                {t('products.downloadDatasheet')}
              </button>
            </div>

            {/* Target Markets */}
            {product.targetMarkets && product.targetMarkets.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {t('products.targetMarkets')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.targetMarkets.map((market: string) => (
                    <span key={market} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {market}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specifications & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Specifications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('products.specifications')}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {product.specifications.map((spec: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-3 px-4 font-medium text-gray-700">
                          {spec.name[locale] || spec.name.en}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {spec.value} {spec.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Features & Applications */}
          <div className="space-y-8">
            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('products.features')}
              </h3>
              <ul className="space-y-2">
                {(product.features[locale] || product.features.en).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('products.applications')}
              </h3>
              <ul className="space-y-2">
                {(product.applications[locale] || product.applications.en).map((app: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
