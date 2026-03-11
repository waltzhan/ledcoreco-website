import { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/lib/i18n/config';

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

// 静态产品列表（用于询盘表单多选）
const productOptions = [
  { id: 'chip-led', name: { en: 'CHIP LED', zh: 'CHIP LED' } },
  { id: 'plcc-led', name: { en: 'PLCC LED', zh: 'PLCC LED' } },
  { id: 'ir-sensors', name: { en: 'IR Sensors', zh: '红外传感器' } },
  { id: 'uv-led', name: { en: 'UV LED', zh: 'UV LED' } },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  
  return {
    title: `${messages.navigation.contact} | GOPRO LED`,
    description: messages.metadata.description,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isRTL = locale === 'ar';

  const getLocalizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  // 根据语言获取标签文本
  const labels = {
    title: locale === 'zh' ? '联系我们' : locale === 'ar' ? 'اتصل بنا' : 'Contact Us',
    subtitle: locale === 'zh' 
      ? '有LED产品需求？请填写以下表单，我们将尽快与您联系。' 
      : locale === 'ar'
      ? 'هل لديك احتياجات LED؟ يرجى ملء النموذج أدناه وسنقوم بالاتصال بك قريبًا.'
      : 'Have LED product needs? Please fill out the form below and we will contact you soon.',
    companyName: locale === 'zh' ? '公司名称' : locale === 'ar' ? 'اسم الشركة' : 'Company Name',
    contactName: locale === 'zh' ? '联系人姓名' : locale === 'ar' ? 'اسم جهة الاتصال' : 'Contact Name',
    email: locale === 'zh' ? '电子邮箱' : locale === 'ar' ? 'البريد الإلكتروني' : 'Email',
    phone: locale === 'zh' ? '联系电话' : locale === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    country: locale === 'zh' ? '国家/地区' : locale === 'ar' ? 'البلد / المنطقة' : 'Country/Region',
    products: locale === 'zh' ? '感兴趣的产品' : locale === 'ar' ? 'المنتجات المهتمة' : 'Products of Interest',
    quantity: locale === 'zh' ? '预计采购数量' : locale === 'ar' ? 'الكمية المتوقعة' : 'Estimated Quantity',
    message: locale === 'zh' ? '详细需求描述' : locale === 'ar' ? 'وصف متطلبات مفصل' : 'Detailed Requirements',
    submit: locale === 'zh' ? '提交询盘' : locale === 'ar' ? 'إرسال الاستفسار' : 'Submit Inquiry',
    required: locale === 'zh' ? '必填' : locale === 'ar' ? 'مطلوب' : 'Required',
    contactInfo: locale === 'zh' ? '联系信息' : locale === 'ar' ? 'معلومات الاتصال' : 'Contact Information',
    address: locale === 'zh' ? '公司地址' : locale === 'ar' ? 'عنوان الشركة' : 'Company Address',
    addressValue: locale === 'zh' 
      ? '中国福建省厦门市集美区光莆路1号' 
      : 'No.1 Guangpu Road, Jimei District, Xiamen, Fujian, China',
    phoneValue: '+86-592-12345678',
    emailValue: 'sales@gopro-led.com',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{labels.title}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">{labels.subtitle}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <form className="space-y-6">
                {/* Company & Contact Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.companyName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={labels.companyName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.contactName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={labels.contactName}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.phone} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+60 123 456 789"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.country} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{locale === 'zh' ? '请选择国家/地区' : 'Select Country/Region'}</option>
                    <option value="malaysia">Malaysia</option>
                    <option value="indonesia">Indonesia</option>
                    <option value="thailand">Thailand</option>
                    <option value="vietnam">Vietnam</option>
                    <option value="singapore">Singapore</option>
                    <option value="philippines">Philippines</option>
                    <option value="uae">UAE</option>
                    <option value="saudi-arabia">Saudi Arabia</option>
                    <option value="other">{locale === 'zh' ? '其他' : 'Other'}</option>
                  </select>
                </div>

                {/* Products of Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {labels.products}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productOptions.map((product) => (
                      <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={product.id}
                          className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{product.name[locale as keyof typeof product.name] || product.name.en}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.quantity}
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">{locale === 'zh' ? '请选择数量范围' : 'Select Quantity Range'}</option>
                    <option value="1k-10k">1,000 - 10,000 pcs</option>
                    <option value="10k-50k">10,000 - 50,000 pcs</option>
                    <option value="50k-100k">50,000 - 100,000 pcs</option>
                    <option value="100k+">100,000+ pcs</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.message}
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={locale === 'zh' ? '请描述您的具体需求，如应用场景、技术要求、交付时间等...' : 'Please describe your specific requirements, such as application scenarios, technical requirements, delivery time, etc.'}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors"
                >
                  {labels.submit}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{labels.contactInfo}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{labels.address}</p>
                    <p className="text-sm text-gray-600 mt-1">{labels.addressValue}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{labels.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{labels.phoneValue}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{labels.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{labels.emailValue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {locale === 'zh' ? '快速链接' : locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <nav className="space-y-2">
                <Link href={getLocalizedHref('/products')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.products}
                </Link>
                <Link href={getLocalizedHref('/about')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.about}
                </Link>
                <Link href={getLocalizedHref('/support')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.support}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
