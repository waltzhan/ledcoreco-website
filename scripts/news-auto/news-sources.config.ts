/**
 * 新闻源独立配置文件
 * ============================================================
 * 维护指南：
 *   - 新增新闻源：在 NEWS_SOURCES 数组中添加新对象
 *   - 停用新闻源：设置 enabled: false（无需删除）
 *   - 调整优先级：修改 priority 值（数字越小优先级越高）
 *   - 仅RSS：设置 type: 'rss'，填写 rss 字段
 *   - 仅网页：设置 type: 'web'，填写 selector 字段
 * ============================================================
 */

export type SourceType = 'rss' | 'web' | 'rss+web';
export type SourceCategory = 'industry' | 'technical' | 'application';
export type SourceLanguage = 'zh' | 'en' | 'id' | 'th' | 'vi' | 'ar';

export interface NewsSource {
  /** 新闻源名称（唯一标识） */
  name: string;
  /** 新闻源首页URL */
  url: string;
  /** 抓取方式：rss / web / rss+web */
  type: SourceType;
  /** RSS feed 地址（type 包含 rss 时必填） */
  rss?: string;
  /** 网页抓取CSS选择器（type 包含 web 时必填） */
  selector?: string;
  /** 对应Sanity文章分类 */
  category: SourceCategory;
  /** 新闻源主要语言 */
  language: SourceLanguage;
  /** 优先级（1最高，数字越小越优先抓取） */
  priority: number;
  /** 是否启用（false=停用，不会被抓取） */
  enabled: boolean;
  /** 备注（维护说明、停用原因等） */
  notes?: string;
  /** 请求时携带的自定义 headers（部分网站需要UA伪装） */
  headers?: Record<string, string>;
}

/**
 * 新闻源配置列表
 * 维护时只需增删改此数组，无需改动抓取逻辑代码
 */
export const NEWS_SOURCES: NewsSource[] = [

  // ── 中文新闻源 ─────────────────────────────────────────────
  {
    name: 'LEDinside',
    url: 'https://www.ledinside.com',
    type: 'rss',
    rss: 'https://www.ledinside.com/rss.xml',
    category: 'industry',
    language: 'zh',
    priority: 1,
    enabled: true,
    notes: '主要中文LED行业媒体，RSS稳定可用',
  },
  {
    name: '高工LED',
    url: 'https://www.gg-led.com',
    type: 'web',
    selector: '.news-list .item',
    category: 'industry',
    language: 'zh',
    priority: 2,
    enabled: false,
    notes: '域名解析不稳定，暂停使用，待观察',
  },
  {
    name: '半导体照明网',
    url: 'http://www.china-led.net',
    type: 'web',
    selector: '.news-item',
    category: 'technical',
    language: 'zh',
    priority: 3,
    enabled: false,
    notes: '待测试可用性',
  },
  {
    name: 'OFweek半导体照明',
    url: 'https://led.ofweek.com',
    type: 'rss',
    rss: 'https://led.ofweek.com/rss.xml',
    category: 'technical',
    language: 'zh',
    priority: 4,
    enabled: false,
    notes: '待测试RSS是否可用',
  },

  // ── 英文新闻源 ─────────────────────────────────────────────
  {
    name: 'LEDs Magazine',
    url: 'https://www.ledsmagazine.com',
    type: 'rss',
    rss: 'https://www.ledsmagazine.com/rss.xml',
    category: 'industry',
    language: 'en',
    priority: 5,
    enabled: false,
    notes: '403反爬虫拦截，暂时禁用，可尝试加UA伪装重新启用',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  },
  {
    name: 'Compound Semiconductor',
    url: 'https://www.compoundsemiconductor.net',
    type: 'rss',
    rss: 'https://www.compoundsemiconductor.net/rss.xml',
    category: 'technical',
    language: 'en',
    priority: 6,
    enabled: false,
    notes: '待测试可用性',
  },
  {
    name: 'Laser Focus World',
    url: 'https://www.laserfocusworld.com',
    type: 'rss',
    rss: 'https://www.laserfocusworld.com/rss.xml',
    category: 'technical',
    language: 'en',
    priority: 7,
    enabled: false,
    notes: '光电技术专业媒体，待测试',
  },
];

/**
 * 获取所有已启用的新闻源（按优先级排序）
 */
export function getEnabledSources(): NewsSource[] {
  return NEWS_SOURCES
    .filter(s => s.enabled)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * 获取指定分类的已启用新闻源
 */
export function getSourcesByCategory(category: SourceCategory): NewsSource[] {
  return getEnabledSources().filter(s => s.category === category);
}

/**
 * 获取指定语言的已启用新闻源
 */
export function getSourcesByLanguage(language: SourceLanguage): NewsSource[] {
  return getEnabledSources().filter(s => s.language === language);
}
