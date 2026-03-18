import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp-mail';

// 接收询盘邮件的目标邮箱
const INQUIRY_EMAIL = process.env.INQUIRY_EMAIL || 'sales@ledcoreco.com';

// 发件人配置
const FROM_EMAIL = 'sales@ledcoreco.com';
const FROM_NAME = 'GOPRO LED 销售团队';

// 产品选项映射（用于邮件显示）
const productLabels: Record<string, Record<string, string>> = {
  'ir-led': { en: 'IR LED', zh: '红外LED', id: 'LED IR', th: 'LED อินฟราเรด', vi: 'LED Hồng ngoại', ar: 'LED الأشعة تحت الحمراء' },
  'visible-led': { en: 'Visible LED', zh: '可见光LED', id: 'LED Cahaya Terlihat', th: 'LED แสงที่มองเห็นได้', vi: 'LED Ánh sáng nhìn thấy', ar: 'LED الضوء المرئي' },
  'uv-led': { en: 'UV LED', zh: '紫外LED', id: 'LED UV', th: 'LED UV', vi: 'LED UV', ar: 'LED UV' },
  'other': { en: 'Other', zh: '其他', id: 'Lainnya', th: 'อื่นๆ', vi: 'Khác', ar: 'أخرى' },
};

// GET 方法用于测试 API 是否正常工作
export async function GET() {
  return NextResponse.json({ 
    status: 'API is working - SMTP VERSION v2',
    inquiryEmail: INQUIRY_EMAIL,
    fromEmail: FROM_EMAIL,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      contactName,
      email,
      phone,
      country,
      products,
      quantity,
      message,
      locale = 'zh',
    } = body;

    // 验证必填字段
    if (!companyName || !contactName || !email || !phone || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 格式化产品兴趣
    const productNames = (products || [])
      .map((p: string) => productLabels[p]?.[locale] || productLabels[p]?.en || p)
      .join(', ');

    // 国家名称映射
    const countryNames: Record<string, Record<string, string>> = {
      malaysia: { en: 'Malaysia', zh: '马来西亚' },
      indonesia: { en: 'Indonesia', zh: '印尼' },
      thailand: { en: 'Thailand', zh: '泰国' },
      vietnam: { en: 'Vietnam', zh: '越南' },
      singapore: { en: 'Singapore', zh: '新加坡' },
      philippines: { en: 'Philippines', zh: '菲律宾' },
      uae: { en: 'UAE', zh: '阿联酋' },
      'saudi-arabia': { en: 'Saudi Arabia', zh: '沙特阿拉伯' },
      other: { en: 'Other', zh: '其他' },
    };
    const countryName = countryNames[country]?.[locale] || countryNames[country]?.en || country;

    // 数量范围映射
    const quantityLabels: Record<string, Record<string, string>> = {
      '1k-10k': { en: '1,000 - 10,000 pcs', zh: '1,000 - 10,000 件' },
      '10k-50k': { en: '10,000 - 50,000 pcs', zh: '10,000 - 50,000 件' },
      '50k-100k': { en: '50,000 - 100,000 pcs', zh: '50,000 - 100,000 件' },
      '100k+': { en: '100,000+ pcs', zh: '100,000+ 件' },
    };
    const quantityLabel = quantityLabels[quantity]?.[locale] || quantityLabels[quantity]?.en || quantity || '-';

    // 调试日志
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS,
      inquiryEmail: INQUIRY_EMAIL,
    });

    // 发送邮件给销售团队
    console.log('Sending email to sales team:', INQUIRY_EMAIL);
    await sendEmail({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: INQUIRY_EMAIL,
      subject: `【询盘】${companyName} - ${contactName}`,
      html: `
        <h2>新的客户询盘</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold; width: 120px;">公司名称</td>
            <td style="padding: 10px;">${companyName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">联系人</td>
            <td style="padding: 10px;">${contactName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">邮箱</td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">电话</td>
            <td style="padding: 10px;">${phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">国家/地区</td>
            <td style="padding: 10px;">${countryName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">感兴趣的产品</td>
            <td style="padding: 10px;">${productNames || '-'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold;">预计采购数量</td>
            <td style="padding: 10px;">${quantityLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; vertical-align: top;">详细需求</td>
            <td style="padding: 10px; white-space: pre-wrap;">${message || '-'}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          此邮件由 GOPRO LED 网站自动发送<br>
          提交时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
        </p>
      `,
    });

    // 发送确认邮件给用户
    console.log('Sending confirmation email to user:', email);
    await sendEmail({
      from: `GOPRO LED <${FROM_EMAIL}>`,
      to: email,
      subject: locale === 'zh' ? '【GOPRO LED】询盘提交成功' : '[GOPRO LED] Inquiry Received',
      html: getAutoReplyEmail(locale, companyName),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry' },
      { status: 500 }
    );
  }
}

// 自动回复邮件模板
function getAutoReplyEmail(locale: string, companyName: string): string {
  const templates: Record<string, { subject: string; body: string }> = {
    zh: {
      subject: '【GOPRO LED】询盘提交成功',
      body: `
        <h2>尊敬的 ${companyName}，您好！</h2>
        <p>感谢您联系 GOPRO LED！我们已收到您的询盘，销售团队将在 24 小时内与您联系。</p>
        <p>如有紧急需求，请直接致电：<strong>+86-xxx-xxxx-xxxx</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          厦门光莆电子股份有限公司<br>
          邮箱: sales@ledcoreco.com<br>
          地址: 厦门市翔安火炬高新区民安大道1800-1812号
        </p>
      `,
    },
    en: {
      subject: '[GOPRO LED] Inquiry Received',
      body: `
        <h2>Dear ${companyName},</h2>
        <p>Thank you for contacting GOPRO LED! We have received your inquiry and our sales team will contact you within 24 hours.</p>
        <p>For urgent needs, please call: <strong>+86-xxx-xxxx-xxxx</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Xiamen Gopro Electronics Co., Ltd.<br>
          Email: sales@ledcoreco.com<br>
          Address: No.1800-1812 Min'an Avenue, Xiang'an Torch High-tech Zone, Xiamen, China
        </p>
      `,
    },
    id: {
      subject: '[GOPRO LED] Permintaan Diterima',
      body: `
        <h2>Yth. ${companyName},</h2>
        <p>Terima kasih telah menghubungi GOPRO LED! Kami telah menerima permintaan Anda dan tim penjualan akan menghubungi Anda dalam 24 jam.</p>
        <p>Untuk kebutuhan mendesak, silakan hubungi: <strong>+86-xxx-xxxx-xxxx</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Xiamen Gopro Electronics Co., Ltd.<br>
          Email: sales@ledcoreco.com
        </p>
      `,
    },
    th: {
      subject: '[GOPRO LED] ได้รับคำสอบถามแล้ว',
      body: `
        <h2>เรียน ${companyName},</h2>
        <p>ขอบคุณที่ติดต่อ GOPRO LED! เราได้รับคำสอบถามของคุณแล้ว และทีมขายจะติดต่อกลับภายใน 24 ชั่วโมง</p>
        <p>สำหรับความต้องการเร่งด่วน กรุณาโทร: <strong>+86-xxx-xxxx-xxxx</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Xiamen Gopro Electronics Co., Ltd.<br>
          Email: sales@ledcoreco.com
        </p>
      `,
    },
    vi: {
      subject: '[GOPRO LED] Đã nhận yêu cầu',
      body: `
        <h2>Kính gửi ${companyName},</h2>
        <p>Cảm ơn bạn đã liên hệ với GOPRO LED! Chúng tôi đã nhận được yêu cầu của bạn và đội ngũ bán hàng sẽ liên hệ trong vòng 24 giờ.</p>
        <p>Cho nhu cầu khẩn cấp, vui lòng gọi: <strong>+86-xxx-xxxx-xxxx</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Xiamen Gopro Electronics Co., Ltd.<br>
          Email: sales@ledcoreco.com
        </p>
      `,
    },
    ar: {
      subject: '[GOPRO LED] تم استلام الاستفسار',
      body: `
        <h2>عزيزي ${companyName}،</h2>
        <p>شكراً لتواصلك مع GOPRO LED! لقد تلقينا استفسارك وسيتواصل معك فريق المبيعات خلال 24 ساعة.</p>
        <p>للاحتياجات العاجلة، يرجى الاتصال: <strong>+86-xxx-xxxx-xxxx</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          شيامن جوبرو للإلكترونيات المحدودة<br>
          البريد الإلكتروني: sales@ledcoreco.com
        </p>
      `,
    },
  };

  const template = templates[locale] || templates.en;
  return template.body;
}
