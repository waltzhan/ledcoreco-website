// @ts-nocheck
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: '产品',
  type: 'document',
  fields: [
    // 基础信息 - 中英文
    defineField({
      name: 'name',
      title: '产品名称 (中文)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule: any) => Rule.required() },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'model',
      title: '产品型号',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '产品分类',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    }),
    
    // 产品描述 - 中英文
    defineField({
      name: 'description',
      title: '产品描述',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: '简短描述 (用于列表展示)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    
    // 产品图片
    defineField({
      name: 'mainImage',
      title: '主图',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: '产品图集',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    
    // 产品规格
    defineField({
      name: 'specifications',
      title: '技术规格',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'productSpec' }] }],
    }),
    
    // 产品特性 - 中英文
    defineField({
      name: 'features',
      title: '产品特性',
      type: 'object',
      fields: [
        {
          name: 'zh',
          title: '中文',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
    
    // 应用场景 - 中英文
    defineField({
      name: 'applications',
      title: '应用场景',
      type: 'object',
      fields: [
        {
          name: 'zh',
          title: '中文',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
    
    // 目标市场
    defineField({
      name: 'targetMarkets',
      title: '目标市场',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '马来西亚', value: 'malaysia' },
          { title: '印尼', value: 'indonesia' },
          { title: '泰国', value: 'thailand' },
          { title: '越南', value: 'vietnam' },
          { title: '中东', value: 'middle-east' },
          { title: '全球', value: 'global' },
        ],
      },
    }),
    
    // SEO 信息
    defineField({
      name: 'seo',
      title: 'SEO 设置',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta 标题',
          type: 'object',
          fields: [
            { name: 'zh', title: '中文', type: 'string' },
            { name: 'en', title: 'English', type: 'string' },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta 描述',
          type: 'object',
          fields: [
            { name: 'zh', title: '中文', type: 'text', rows: 2 },
            { name: 'en', title: 'English', type: 'text', rows: 2 },
          ],
        },
        {
          name: 'keywords',
          title: '关键词',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
    
    // 状态
    defineField({
      name: 'status',
      title: '产品状态',
      type: 'string',
      options: {
        list: [
          { title: '在售', value: 'active' },
          { title: '新品', value: 'new' },
          { title: '停产', value: 'discontinued' },
          { title: '即将上市', value: 'coming-soon' },
        ],
      },
      initialValue: 'active',
    }),
    
    // 排序权重
    defineField({
      name: 'orderRank',
      title: '排序权重',
      type: 'number',
      description: '数字越小排序越靠前',
      initialValue: 0,
    }),
    
    // 数据表/文档
    defineField({
      name: 'datasheet',
      title: '数据手册 (PDF)',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
  ],
  
  preview: {
    select: {
      title: 'name.zh',
      subtitle: 'model',
      media: 'mainImage',
    },
  },
});
