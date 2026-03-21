import { type MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://anthaikhang.com';

function robots(): MetadataRoute.Robots {
  const baseUrl = BASE_URL.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

export default robots;
