import { type MetadataRoute } from 'next';
import { getSiteUrl } from '~/lib/site';

function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api']
      }
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`
  };
}

export default robots;
