import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl() ?? new URL('http://localhost:3000');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', site).toString(),
  };
}


