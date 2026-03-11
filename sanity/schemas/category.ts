// @ts-nocheck
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: '产品分类',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '分类名称',
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
      name: 'description',
      title: '分类描述',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'icon',
      title: '分类图标',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'orderRank',
      title: '排序权重',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name.zh',
      subtitle: 'slug.current',
    },
  },
});
