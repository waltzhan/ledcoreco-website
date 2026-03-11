// 初始化产品分类数据脚本
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-10',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const categories = [
  {
    _type: 'category',
    name: {
      zh: 'CHIP LED',
      en: 'CHIP LED',
    },
    slug: {
      current: 'chip-led',
    },
    description: {
      zh: '适用于消费电子产品的贴片式LED，包括0603、0805、1206等标准封装',
      en: 'SMD LEDs for consumer electronics, including 0603, 0805, 1206 standard packages',
    },
    orderRank: 1,
  },
  {
    _type: 'category',
    name: {
      zh: 'PLCC LED',
      en: 'PLCC LED',
    },
    slug: {
      current: 'plcc-led',
    },
    description: {
      zh: '高亮度PLCC封装LED，适用于照明和背光应用',
      en: 'High brightness PLCC package LEDs for lighting and backlight applications',
    },
    orderRank: 2,
  },
  {
    _type: 'category',
    name: {
      zh: '红外传感器',
      en: 'IR Sensors',
    },
    slug: {
      current: 'ir-sensors',
    },
    description: {
      zh: '红外发射管和接收管，适用于家电控制、安防感应等应用',
      en: 'IR emitters and receivers for appliance control, security sensing applications',
    },
    orderRank: 3,
  },
  {
    _type: 'category',
    name: {
      zh: 'UV LED',
      en: 'UV LED',
    },
    slug: {
      current: 'uv-led',
    },
    description: {
      zh: '紫外LED，适用于消毒、固化、检测等专业应用',
      en: 'UV LEDs for disinfection, curing, detection and other professional applications',
    },
    orderRank: 4,
  },
];

async function seedCategories() {
  console.log('开始初始化产品分类...');
  
  for (const category of categories) {
    try {
      // 检查是否已存在
      const existing = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug: category.slug.current }
      );
      
      if (existing) {
        console.log(`分类已存在: ${category.name.zh}`);
        continue;
      }
      
      const result = await client.create(category);
      console.log(`创建分类成功: ${category.name.zh} (ID: ${result._id})`);
    } catch (error) {
      console.error(`创建分类失败: ${category.name.zh}`, error);
    }
  }
  
  console.log('产品分类初始化完成！');
}

seedCategories();
