import { MetadataRoute } from 'next';
import { i18n } from '~/i18n';
import {
  categoryService,
  postService,
  productService,
  tagService
} from '~/services';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://anthaikhang.com';

const ROUTES = [
  '',
  'categories',
  'projects',
  'insights',
  'insights?tab=always-take-care',
  'insights?tab=trust-in-mind',
  'insights?tab=keep-promise',
  'activities',
  'activities?tab=company',
  'activities?tab=community',
  'contact',
  'terms',
  'privacy'
];

async function fetchPages<T>(
  fetcher: (params: { page: number; limit: number }) => Promise<{
    items: T[];
    pagination: { totalPages: number };
  }>,
  limit = 100
): Promise<T[]> {
  let page = 1;
  let totalPages = 1;

  const results: T[] = [];

  while (page <= totalPages) {
    const { items, pagination } = await fetcher({ page, limit });

    totalPages = pagination.totalPages;

    results.push(...items);

    if (!items.length) break;

    page++;
  }

  return results;
}

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL.replace(/\/$/, '');
  const { locales } = i18n;

  const categories = await categoryService.get();
  const categoryUrls: MetadataRoute.Sitemap = categories.flatMap((c) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/categories?tab=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    }))
  );

  const products = await fetchPages((params) => productService.get(params));
  const productUrls: MetadataRoute.Sitemap = products.flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }))
  );

  const posts = await fetchPages((params) => postService.get(params));
  const postUrls: MetadataRoute.Sitemap = posts.flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/posts/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }))
  );

  const tags = await tagService.getHot();
  const tagUrls: MetadataRoute.Sitemap = tags.flatMap((t) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/tags/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    }))
  );

  const staticUrls: MetadataRoute.Sitemap = ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8
    }))
  );

  return [
    ...staticUrls,
    ...categoryUrls,
    ...productUrls,
    ...postUrls,
    ...tagUrls
  ];
}

export default sitemap;
