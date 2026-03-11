import { 
  generateOrganizationSchema, 
  generateWebsiteSchema, 
  generateFAQSchema 
} from '@/lib/utils/structured-data';
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';
import idMessages from '@/messages/id.json';
import thMessages from '@/messages/th.json';
import viMessages from '@/messages/vi.json';
import arMessages from '@/messages/ar.json';

const messagesMap: Record<string, typeof enMessages> = {
  en: enMessages,
  zh: zhMessages,
  id: idMessages,
  th: thMessages,
  vi: viMessages,
  ar: arMessages,
};

// 辅助函数：通过路径获取嵌套属性
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
}

// 加载翻译文件
function getMessages(locale: string) {
  const messages = messagesMap[locale] || enMessages;
  return (key: string) => getNestedValue(messages, key);
}

// GEO优化：获取FAQ内容
function getFAQs(locale: string) {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    en: [
      { question: 'What types of LEDs does GOPRO manufacture?', answer: 'GOPRO manufactures IR LEDs, Visible Light LEDs, and UV LEDs for various applications including consumer electronics, lighting, and industrial use.' },
      { question: 'Which markets does GOPRO serve?', answer: 'We primarily serve Southeast Asia (Malaysia, Indonesia, Thailand, Vietnam) and Middle East markets.' },
      { question: 'What is the minimum order quantity?', answer: 'We accept orders starting from 1,000 pieces, with competitive pricing for bulk orders over 10,000 pieces.' },
    ],
    zh: [
      { question: '光莆生产哪些类型的LED？', answer: '光莆生产红外LED、可见光LED和紫外LED，应用于消费电子、照明和工业等领域。' },
      { question: '光莆服务哪些市场？', answer: '我们主要服务东南亚（马来西亚、印尼、泰国、越南）和中东市场。' },
      { question: '最小订单量是多少？', answer: '我们接受1000件起订，10000件以上批量订单可享受优惠价格。' },
    ],
  };
  return faqs[locale] || faqs.en;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getMessages(locale);
  
  // GEO优化：生成结构化数据
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema(locale);
  const faqSchema = generateFAQSchema(getFAQs(locale));

  return (
    <>
      {/* GEO优化：结构化数据标记 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-2">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                {t('hero.ctaPrimary')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                {t('hero.ctaSecondary')}
              </button>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.years')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.patents')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.employees')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.certifications')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Preview */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {t('products.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['chipLed', 'plccLed', 'irSensor', 'uvLed'].map((category) => (
                <div key={category} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t(`products.categories.${category}`)}
                  </h3>
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">
                    {t('products.viewDetails')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
