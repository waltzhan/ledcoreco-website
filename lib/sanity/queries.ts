import { sanityClient } from './client';

// 获取所有产品分类
export async function getCategories() {
  const query = `*[_type == "category"] | order(orderRank asc) {
    _id,
    name,
    slug,
    description,
    icon
  }`;
  return sanityClient.fetch(query);
}

// 获取所有产品（支持按分类筛选）
export async function getProducts(categorySlug?: string) {
  const filter = categorySlug 
    ? `&& category->slug.current == "${categorySlug}"`
    : '';
  
  const query = `*[_type == "product" ${filter}] | order(orderRank asc) {
    _id,
    name,
    slug,
    model,
    "category": category->{name, slug},
    shortDescription,
    mainImage,
    status,
    targetMarkets
  }`;
  return sanityClient.fetch(query);
}

// 获取单个产品详情
export async function getProductBySlug(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    model,
    "category": category->{name, slug},
    description,
    shortDescription,
    mainImage,
    gallery,
    features,
    applications,
    specifications,
    targetMarkets,
    status,
    datasheet,
    seo
  }`;
  return sanityClient.fetch(query, { slug });
}

// 获取相关产品
export async function getRelatedProducts(productId: string, categoryId: string, limit: number = 4) {
  const query = `*[_type == "product" && _id != $productId && category._ref == $categoryId] | order(orderRank asc) [0...${limit}] {
    _id,
    name,
    slug,
    model,
    shortDescription,
    mainImage
  }`;
  return sanityClient.fetch(query, { productId, categoryId });
}
